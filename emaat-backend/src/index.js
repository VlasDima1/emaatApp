/**
 * EMAAT Backend Server
 * Express.js server serving both Patient App and GP Dashboard
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Database
const { getPool, closePool } = require('./database/db');

// Middleware
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const gpRoutes = require('./routes/gpRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request().query('SELECT 1');
        res.json({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (error) {
        res.status(503).json({ 
            status: 'unhealthy', 
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error.message
        });
    }
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/gp', gpRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'EMAAT Backend API',
        version: '1.0.0',
        description: 'Backend API serving EMAAT Patient App and GP Dashboard',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register new user (patient/gp)',
                'POST /api/auth/login': 'Login user',
                'GET /api/auth/me': 'Get current user profile',
                'PUT /api/auth/me': 'Update profile',
                'PUT /api/auth/change-password': 'Change password',
                'POST /api/auth/access-codes': 'Generate access codes (GP only)'
            },
            patient: {
                measurements: 'CRUD for health measurements (weight, blood pressure, etc.)',
                challenges: 'Manage 21-day lifestyle challenges',
                goals: 'Track personal health goals',
                surveys: 'Submit and view questionnaire results',
                journals: 'Daily journals (food, mood, sleep, etc.)',
                lifeSteps: 'Daily activity/steps tracking',
                reminders: 'Manage reminders',
                points: 'Gamification points and streaks'
            },
            gp: {
                patients: 'View and search patients',
                healthDomains: 'View patient health domain summaries',
                measurements: 'View patient measurements',
                challenges: 'View/prescribe patient challenges',
                surveys: 'View patient questionnaire results',
                stats: 'Dashboard statistics'
            }
        }
    });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================
const server = app.listen(PORT, async () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║           EMAAT Backend Server                     ║
╠════════════════════════════════════════════════════╣
║  Status:     Running                               ║
║  Port:       ${PORT}                                   ║
║  Mode:       ${process.env.NODE_ENV || 'development'}                         ║
║  API Docs:   http://localhost:${PORT}/api              ║
║  Health:     http://localhost:${PORT}/health           ║
╚════════════════════════════════════════════════════╝
    `);
    
    // Test database connection
    try {
        await getPool();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
        console.log('HTTP server closed');
        
        try {
            await closePool();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error.message);
        }
        
        process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
