terraform {
  required_version = ">= 1.3.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

resource "random_integer" "suffix" {
  min = 10000
  max = 99999
}

provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}

# -------------------------
# VARIABLES
# -------------------------
variable "sql_admin_user" {
  type        = string
  description = "SQL admin username"
  default = "emmatusr"
}

variable "sql_admin_password" {
  type        = string
  sensitive   = true
  description = "SQL admin password"
  default = "IAmStr0ng!"
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "JWT signing secret"
  default = "CantSeeMe"
}

# -------------------------
# RESOURCE GROUP
# -------------------------
resource "azurerm_resource_group" "rg" {
  name     = "rg-emaat-uat"
  location = "UK South"
}

# -------------------------
# APP SERVICE PLAN
# -------------------------
resource "azurerm_service_plan" "plan" {
  name                = "asp-emaat-uat"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# -------------------------
# KEY VAULT
# -------------------------
resource "azurerm_key_vault" "kv" {
  name                        = "kv-emaat-uat-${random_integer.suffix.result}"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
}

resource "azurerm_key_vault_access_policy" "kv_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = ["Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"]
}

# -------------------------
# SQL SERVER
# -------------------------
resource "azurerm_mssql_server" "sql" {
  name                         = "sql-emaat-uat-12345"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_user
  administrator_login_password = var.sql_admin_password
}

# -------------------------
# SQL DATABASE
# -------------------------
resource "azurerm_mssql_database" "db" {
  name      = "eMaatDB"
  server_id = azurerm_mssql_server.sql.id
  sku_name  = "Basic"
}

# -------------------------
# APP SERVICE (LINUX)
# -------------------------
resource "azurerm_linux_web_app" "app" {
  name                = "emaat-api-uat-12345"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = true
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    for key, secret in azurerm_key_vault_secret.secrets :
    key => "@Microsoft.KeyVault(SecretUri=${secret.id})"
  }
}

# -------------------------
# KEY VAULT ACCESS POLICY (APP SERVICE)
# -------------------------
resource "azurerm_key_vault_access_policy" "app_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.app.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# -------------------------
# SQL FIREWALL RULES FOR APP SERVICE
# -------------------------
locals {
  app_outbound_ips = split(",", azurerm_linux_web_app.app.outbound_ip_addresses)
}

# Allow App Service and other Azure services to access SQL
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}


# -------------------------
# APPLICATION SECRETS (KEY VAULT)
# -------------------------
locals {
  app_secrets = {
    PORT        = "3001"
    NODE_ENV   = "development"

    JWT_SECRET     = var.jwt_secret
    JWT_EXPIRES_IN = "7d"

    DB_SERVER   = azurerm_mssql_server.sql.fully_qualified_domain_name
    DB_DATABASE = azurerm_mssql_database.db.name
    DB_USER     = var.sql_admin_user
    DB_PASSWORD = var.sql_admin_password
    DB_PORT     = "1433"
    DB_ENCRYPT  = "true"
    DB_TRUST_SERVER_CERTIFICATE = "false"
  }
}

resource "azurerm_key_vault_secret" "secrets" {
    depends_on = [ azurerm_key_vault.kv, azurerm_mssql_server.sql ]
  for_each     = local.app_secrets
  # replace underscores with dashes to satisfy Key Vault rules
  name         = replace(each.key, "_", "-")
  value        = each.value
  key_vault_id = azurerm_key_vault.kv.id
}

# -------------------------
# STATIC WEB APPS
# -------------------------
resource "azurerm_static_web_app" "dashboard" {
  name                = "emaat-dashboard-uat-${random_integer.suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "westeurope"
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    VITE_API_URL = "https://${azurerm_linux_web_app.app.default_hostname}"
  }
}

resource "azurerm_static_web_app" "app" {
  name                = "emaat-app-uat-${random_integer.suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "westeurope"
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    VITE_API_URL = "https://${azurerm_linux_web_app.app.default_hostname}"
  }
}
