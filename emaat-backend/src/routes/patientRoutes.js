/**
 * Patient Routes
 * All routes require authentication and patient role
 */
const express = require('express');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

// Controllers
const measurementsController = require('../controllers/measurementsController');
const challengesController = require('../controllers/challengesController');
const goalsController = require('../controllers/goalsController');
const surveysController = require('../controllers/surveysController');
const journalsController = require('../controllers/journalsController');
const lifeStepsController = require('../controllers/lifeStepsController');
const remindersController = require('../controllers/remindersController');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

// Apply authentication and patient authorization to all routes
router.use(authenticate);
router.use(authorize('patient'));

// ============================================
// MEASUREMENTS ROUTES
// ============================================
router.get('/measurements', measurementsController.getMeasurements);
router.get('/measurements/latest', measurementsController.getLatestMeasurements);
router.post('/measurements', [
    body('type').notEmpty().withMessage('Measurement type is required'),
    validate
], measurementsController.addMeasurement);
router.put('/measurements/:id', measurementsController.updateMeasurement);
router.delete('/measurements/:id', measurementsController.deleteMeasurement);

// Initial BMI
router.get('/measurements/initial-bmi', measurementsController.getInitialBMI);
router.post('/measurements/initial-bmi', [
    body('height').isNumeric().withMessage('Height must be a number'),
    body('weight').isNumeric().withMessage('Weight must be a number'),
    validate
], measurementsController.setInitialBMI);

// ============================================
// CHALLENGES ROUTES
// ============================================
router.get('/challenges', challengesController.getChallenges);
router.get('/challenges/active', challengesController.getActiveChallenges);
router.get('/challenges/stats', challengesController.getChallengeStats);
router.get('/challenges/:id', challengesController.getChallengeById);
router.post('/challenges', [
    body('type').notEmpty().withMessage('Challenge type is required'),
    validate
], challengesController.startChallenge);
router.post('/challenges/:id/complete-day', [
    body('dayNumber').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
    validate
], challengesController.completeDailyActivity);
// Alias for backward compatibility with app's updateChallengeProgress
router.post('/challenges/:id/progress', challengesController.updateChallengeProgress);
router.post('/challenges/:id/cancel', challengesController.cancelChallenge);

// ============================================
// GOALS ROUTES
// ============================================
router.get('/goals', goalsController.getGoals);
router.get('/goals/:id', goalsController.getGoalById);
router.post('/goals', [
    body('goalKey').notEmpty().withMessage('Goal key is required'),
    validate
], goalsController.createGoal);
router.put('/goals/:id', goalsController.updateGoal);
router.delete('/goals/:id', goalsController.deleteGoal);
router.post('/goals/:id/progress', goalsController.logProgress);

// ============================================
// SURVEYS ROUTES
// ============================================
router.get('/surveys', surveysController.getSurveyResults);
router.get('/surveys/latest', surveysController.getLatestSurveys);
router.get('/surveys/history/:surveyId', surveysController.getSurveyHistory);
router.get('/surveys/:id', surveysController.getSurveyById);
router.post('/surveys', [
    body('answers').notEmpty().withMessage('Answers are required'),
    validate
], surveysController.submitSurvey);
router.delete('/surveys/:id', surveysController.deleteSurvey);

// ============================================
// JOURNALS ROUTES
// ============================================
router.get('/journals', journalsController.getJournalEntries);
router.get('/journals/active', journalsController.getActiveJournals);
router.get('/journals/:id', journalsController.getJournalEntryById);
router.post('/journals', [
    body('type').notEmpty().withMessage('Journal type is required'),
    body('content').notEmpty().withMessage('Content is required'),
    validate
], journalsController.createJournalEntry);
router.put('/journals/:id', journalsController.updateJournalEntry);
router.delete('/journals/:id', journalsController.deleteJournalEntry);
router.post('/journals/activate', [
    body('type').notEmpty().withMessage('Journal type is required'),
    validate
], journalsController.activateJournal);
router.post('/journals/deactivate', [
    body('type').notEmpty().withMessage('Journal type is required'),
    validate
], journalsController.deactivateJournal);

// ============================================
// LIFE STEPS ROUTES
// ============================================
router.get('/life-steps', lifeStepsController.getLifeSteps);
router.get('/life-steps/summary/weekly', lifeStepsController.getWeeklySummary);
router.get('/life-steps/summary/monthly', lifeStepsController.getMonthlySummary);
router.get('/life-steps/:date', lifeStepsController.getLifeStepsByDate);
router.post('/life-steps', [
    body('activityId').notEmpty().withMessage('Activity ID is required'),
    validate
], lifeStepsController.logLifeSteps);

// ============================================
// REMINDERS ROUTES
// ============================================
router.get('/reminders', remindersController.getReminders);
router.get('/reminders/:id', remindersController.getReminderById);
router.post('/reminders', [
    body('title').notEmpty().withMessage('Title is required'),
    body('time').notEmpty().withMessage('Time is required'),
    validate
], remindersController.createReminder);
router.put('/reminders/:id', remindersController.updateReminder);
router.post('/reminders/:id/toggle', remindersController.toggleReminder);
router.delete('/reminders/:id', remindersController.deleteReminder);

// ============================================
// POINTS & GAMIFICATION ROUTES
// ============================================
router.get('/points', pointsController.getTotalPoints);
router.get('/points/pillars', pointsController.getPointsByPillar);
router.get('/points/history', pointsController.getPointsHistory);
router.get('/points/streak', pointsController.getStreak);
router.post('/points/pillar', [
    body('pillar').notEmpty().withMessage('Pillar is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    validate
], pointsController.addPillarPoints);
router.get('/community-goals', pointsController.getCommunityGoals);

module.exports = router;
