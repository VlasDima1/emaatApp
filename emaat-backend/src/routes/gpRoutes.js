/**
 * GP Dashboard Routes
 * All routes require authentication and GP role
 */
const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const gpController = require('../controllers/gpController');

const router = express.Router();

// Apply authentication and GP authorization to all routes
router.use(authenticate);
router.use(authorize('gp'));

// ============================================
// DASHBOARD & STATS
// ============================================
router.get('/stats', gpController.getGPStats);

// ============================================
// PATIENTS LIST & DETAIL
// ============================================
router.get('/patients', gpController.getPatients);
router.get('/patients/:patientId', gpController.getPatientDetail);

// ============================================
// PATIENT HEALTH DOMAINS
// ============================================
router.get('/patients/:patientId/health-domains', gpController.getHealthDomainSummary);

// ============================================
// PATIENT MEASUREMENTS
// ============================================
router.get('/patients/:patientId/measurements', gpController.getPatientMeasurements);

// ============================================
// PATIENT CHALLENGES
// ============================================
router.get('/patients/:patientId/challenges', gpController.getPatientChallenges);
router.get('/patients/:patientId/challenges/:challengeId', gpController.getPatientChallengeDetail);
router.post('/patients/:patientId/challenges', [
    body('type').notEmpty().withMessage('Challenge type is required'),
    validate
], gpController.prescribeChallenge);

// ============================================
// PATIENT SURVEYS/QUESTIONNAIRES
// ============================================
router.get('/patients/:patientId/surveys', gpController.getPatientSurveys);

// ============================================
// PATIENT GOALS
// ============================================
router.get('/patients/:patientId/goals', gpController.getPatientGoals);

// ============================================
// PATIENT ACTIVITY/LIFE STEPS
// ============================================
router.get('/patients/:patientId/life-steps', gpController.getPatientLifeSteps);

// ============================================
// PATIENT JOURNALS
// ============================================
router.get('/patients/:patientId/journals', gpController.getPatientJournals);

module.exports = router;
