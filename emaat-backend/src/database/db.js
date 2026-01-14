/**
 * Database Configuration for SQL Server
 */
require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'eMaatDB',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

/**
 * Get or create database connection pool
 */
const getPool = async () => {
    if (pool) {
        return pool;
    }
    
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server database');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

/**
 * Execute a query with parameters
 * @param {string} query - SQL query
 * @param {Object} params - Query parameters {name: {type, value}}
 */
const executeQuery = async (query, params = {}) => {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters
    Object.entries(params).forEach(([name, param]) => {
        if (param !== null && param !== undefined && typeof param === 'object' && param.type) {
            request.input(name, param.type, param.value);
        } else {
            request.input(name, param);
        }
    });
    
    return request.query(query);
};

/**
 * Execute a stored procedure
 * @param {string} procedureName - Stored procedure name
 * @param {Object} params - Parameters
 */
const executeProcedure = async (procedureName, params = {}) => {
    const pool = await getPool();
    const request = pool.request();
    
    Object.entries(params).forEach(([name, param]) => {
        if (param !== null && param !== undefined && typeof param === 'object' && param.type) {
            request.input(name, param.type, param.value);
        } else {
            request.input(name, param);
        }
    });
    
    return request.execute(procedureName);
};

/**
 * Close the database connection pool
 */
const closePool = async () => {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('Database connection pool closed');
    }
};

// SQL types for convenience
const types = sql;

module.exports = {
    getPool,
    executeQuery,
    executeProcedure,
    closePool,
    types,
    sql
};
