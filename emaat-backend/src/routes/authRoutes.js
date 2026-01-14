/**
 * Authentication Routes
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login user
 * GET /api/auth/me - Get current user profile
 * PUT /api/auth/me - Update profile
 * PUT /api/auth/change-password - Change password
 * POST /api/auth/access-codes - Generate access codes (GP only)
 */
const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(['patient', 'gp']).withMessage('Role must be patient or gp'),
    validate
], authController.register);

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.login);

// Get current user (authenticated)
router.get('/me', authenticate, authController.getProfile);

// Update profile (authenticated)
router.put('/me', authenticate, [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    validate
], authController.updateProfile);

// Change password (authenticated)
router.put('/change-password', authenticate, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
], authController.changePassword);

// Generate access codes (GP only)
router.post('/access-codes', 
    authenticate, 
    authorize('gp'), 
    [
        body('count').optional().isInt({ min: 1, max: 100 }).withMessage('Count must be between 1 and 100'),
        validate
    ],
    authController.generateAccessCodes
);

module.exports = router;
