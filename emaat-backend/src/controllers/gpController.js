/**
 * GP Dashboard Controller
 * Handles GP-specific operations for viewing patient data
 * Based on the 10 health domains and features from the GP dashboard
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Health domains from GP dashboard
const HEALTH_DOMAINS = [
    'bloodPressure', 'weight', 'cholesterol', 'kidneyFunction',
    'smoking', 'alcohol', 'nutrition', 'exercise', 'stress', 'sleep'
];

/**
 * Helper function to verify that a patient belongs to a GP
 * @param {string} patientId - The patient's ID
 * @param {string} gpId - The GP's ID
 * @returns {Promise<boolean>} - True if the patient belongs to the GP
 */
async function verifyPatientOwnership(patientId, gpId) {
    const result = await executeQuery(
        'SELECT Id FROM Users WHERE Id = @patientId AND Role = \'patient\' AND AssignedGPId = @gpId',
        { patientId, gpId }
    );
    return result.recordset.length > 0;
}

/**
 * Get all patients for GP
 * GET /api/gp/patients
 */
const getPatients = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const gpId = req.user.userId; // Current GP's ID
    
    let query = `
        SELECT u.Id, u.Email, u.Name, u.DateOfBirth, u.CreatedAt,
            (SELECT MAX(Timestamp) FROM Measurements m WHERE m.UserId = u.Id) as LastActivity
        FROM Users u
        WHERE u.Role = 'patient' AND u.AssignedGPId = @gpId
    `;
    const params = { limit: parseInt(limit), offset, gpId };
    
    if (search) {
        query += ` AND (u.Name LIKE @search OR u.Email LIKE @search)`;
        params.search = `%${search}%`;
    }
    
    query += ` ORDER BY u.Name OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    
    const result = await executeQuery(query, params);
    
    // Get total count for this GP's patients only
    let countQuery = `SELECT COUNT(*) as Total FROM Users WHERE Role = 'patient' AND AssignedGPId = @gpId`;
    if (search) {
        countQuery += ` AND (Name LIKE @search OR Email LIKE @search)`;
    }
    const countResult = await executeQuery(countQuery, params);
    
    // Map to consistent response format
    const patients = result.recordset.map(p => ({
        id: p.Id,
        email: p.Email,
        name: p.Name,
        createdAt: p.CreatedAt,
        lastActivity: p.LastActivity
    }));
    
    res.json({
        success: true,
        data: {
            patients,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult.recordset[0].Total || 0
            }
        }
    });
});

/**
 * Get patient detail with summary
 * GET /api/gp/patients/:patientId
 */
const getPatientDetail = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const gpId = req.user.userId;
    
    // Get patient info - only if assigned to this GP
    const patientResult = await executeQuery(
        `SELECT Id, Email, Name, DateOfBirth, Height, Phone, Address, CreatedAt 
         FROM Users WHERE Id = @patientId AND Role = 'patient' AND AssignedGPId = @gpId`,
        { patientId, gpId }
    );
    
    if (patientResult.recordset.length === 0) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    const p = patientResult.recordset[0];
    const patient = {
        id: p.Id,
        email: p.Email,
        name: p.Name,
        dateOfBirth: p.DateOfBirth,
        height: p.Height,
        phone: p.Phone,
        address: p.Address,
        createdAt: p.CreatedAt
    };
    
    // Get latest measurements summary
    const measurementsResult = await executeQuery(
        `WITH LatestMeasurements AS (
            SELECT Type, Value, Systolic, Diastolic, Hours, Minutes, Timestamp,
                   ROW_NUMBER() OVER (PARTITION BY Type ORDER BY Timestamp DESC) as rn
            FROM Measurements WHERE UserId = @patientId
        )
        SELECT Type, Value, Systolic, Diastolic, Hours, Minutes, Timestamp FROM LatestMeasurements WHERE rn = 1`,
        { patientId }
    );
    
    // Get active challenges
    const challengesResult = await executeQuery(
        `SELECT ChallengeId, Status, StartDate, EndDate, Progress
         FROM Challenges WHERE UserId = @patientId AND Status = 'active'`,
        { patientId }
    );
    
    // Get initial BMI
    const bmiResult = await executeQuery(
        `SELECT BMI, Category, Timestamp FROM InitialBMI WHERE UserId = @patientId`,
        { patientId }
    );
    
    // Get latest weight from Measurements
    const weightResult = await executeQuery(
        `SELECT TOP 1 Value FROM Measurements 
         WHERE UserId = @patientId AND Type = 'weight' 
         ORDER BY Timestamp DESC`,
        { patientId }
    );
    
    res.json({
        success: true,
        data: {
            ...patient,
            latestMeasurements: measurementsResult.recordset.map(m => ({
                type: m.Type,
                value: m.Value,
                systolic: m.Systolic,
                diastolic: m.Diastolic,
                hours: m.Hours,
                minutes: m.Minutes,
                timestamp: m.Timestamp
            })),
            activeChallenges: challengesResult.recordset.map(c => ({
                challengeId: c.ChallengeId,
                status: c.Status,
                startDate: c.StartDate,
                endDate: c.EndDate,
                progress: c.Progress
            })),
            initialBMI: bmiResult.recordset[0] ? {
                height: patient.height,
                weight: weightResult.recordset[0]?.Value || null,
                bmi: bmiResult.recordset[0].BMI,
                category: bmiResult.recordset[0].Category
            } : null
        }
    });
});

/**
 * Get patient measurements
 * GET /api/gp/patients/:patientId/measurements
 */
const getPatientMeasurements = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { type, startDate, endDate, limit = 100 } = req.query;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    let query = `
        SELECT Id, Type, Value, Systolic, Diastolic, Hours, Minutes, Condition, Timing, Timestamp
        FROM Measurements
        WHERE UserId = @patientId
    `;
    const params = { patientId };
    
    if (type) {
        query += ' AND Type = @type';
        params.type = type;
    }
    
    if (startDate) {
        query += ' AND Timestamp >= @startDate';
        params.startDate = startDate;
    }
    
    if (endDate) {
        query += ' AND Timestamp <= @endDate';
        params.endDate = endDate;
    }
    
    query += ' ORDER BY Timestamp DESC';
    query += ` OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = parseInt(limit);
    
    const result = await executeQuery(query, params);
    
    const measurements = result.recordset.map(m => ({
        id: m.Id,
        type: m.Type,
        value: m.Value,
        systolic: m.Systolic,
        diastolic: m.Diastolic,
        hours: m.Hours,
        minutes: m.Minutes,
        condition: m.Condition,
        timing: m.Timing,
        timestamp: m.Timestamp
    }));
    
    res.json({
        success: true,
        data: measurements
    });
});

/**
 * Get patient challenges with progress
 * GET /api/gp/patients/:patientId/challenges
 */
const getPatientChallenges = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { status } = req.query;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    let query = `
        SELECT c.*, 
            (SELECT COUNT(*) FROM ChallengeActivities ca 
             WHERE ca.ChallengeId = c.Id AND ca.Status = 'completed') as CompletedDays
        FROM Challenges c
        WHERE c.UserId = @patientId
    `;
    const params = { patientId };
    
    if (status) {
        query += ' AND c.Status = @status';
        params.status = status;
    }
    
    query += ' ORDER BY c.CreatedAt DESC';
    
    const result = await executeQuery(query, params);
    
    const challenges = result.recordset.map(c => ({
        id: c.Id,
        challengeId: c.ChallengeId,
        status: c.Status,
        startDate: c.StartDate,
        endDate: c.EndDate,
        progress: c.Progress,
        completedDays: c.CompletedDays,
        createdAt: c.CreatedAt
    }));
    
    res.json({
        success: true,
        data: challenges
    });
});

/**
 * Get challenge details with daily activities
 * GET /api/gp/patients/:patientId/challenges/:challengeId
 */
const getPatientChallengeDetail = asyncHandler(async (req, res) => {
    const { patientId, challengeId } = req.params;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    const challengeResult = await executeQuery(
        `SELECT * FROM Challenges WHERE Id = @challengeId AND UserId = @patientId`,
        { challengeId, patientId }
    );
    
    if (challengeResult.recordset.length === 0) {
        throw new AppError('Challenge not found', 404, 'NOT_FOUND');
    }
    
    const c = challengeResult.recordset[0];
    
    // Get activities
    const activitiesResult = await executeQuery(
        `SELECT * FROM ChallengeActivities 
         WHERE ChallengeId = @challengeId 
         ORDER BY Day`,
        { challengeId }
    );
    
    const challenge = {
        id: c.Id,
        challengeId: c.ChallengeId,
        status: c.Status,
        startDate: c.StartDate,
        endDate: c.EndDate,
        progress: c.Progress,
        activities: activitiesResult.recordset.map(a => ({
            id: a.Id,
            day: a.Day,
            type: a.Type,
            status: a.Status,
            scheduledAt: a.ScheduledAt,
            completedAt: a.CompletedAt,
            data: a.Data ? JSON.parse(a.Data) : null
        }))
    };
    
    res.json({
        success: true,
        data: challenge
    });
});

/**
 * Get patient surveys/questionnaires
 * GET /api/gp/patients/:patientId/surveys
 */
const getPatientSurveys = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { type, limit = 50 } = req.query;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    let query = `
        SELECT Id, Type, Score, Answers, CompletedAt, Interpretation
        FROM SurveyResults
        WHERE UserId = @patientId
    `;
    const params = { patientId };
    
    if (type) {
        query += ' AND Type = @type';
        params.type = type;
    }
    
    query += ' ORDER BY CompletedAt DESC';
    query += ` OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = parseInt(limit);
    
    const result = await executeQuery(query, params);
    
    const surveys = result.recordset.map(s => ({
        id: s.Id,
        type: s.Type,
        score: s.Score,
        answers: s.Answers ? JSON.parse(s.Answers) : [],
        completedAt: s.CompletedAt,
        interpretation: s.Interpretation
    }));
    
    res.json({
        success: true,
        data: surveys
    });
});

/**
 * Get patient goals
 * GET /api/gp/patients/:patientId/goals
 */
const getPatientGoals = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    const result = await executeQuery(
        `SELECT Id, Type, Target, Frequency, StartDate, Status, CurrentStreak, LongestStreak
         FROM Goals
         WHERE UserId = @patientId
         ORDER BY CreatedAt DESC`,
        { patientId }
    );
    
    const goals = result.recordset.map(g => ({
        id: g.Id,
        type: g.Type,
        target: g.Target ? JSON.parse(g.Target) : null,
        frequency: g.Frequency,
        startDate: g.StartDate,
        status: g.Status,
        currentStreak: g.CurrentStreak,
        longestStreak: g.LongestStreak
    }));
    
    res.json({
        success: true,
        data: goals
    });
});

/**
 * Get patient life steps/activity
 * GET /api/gp/patients/:patientId/life-steps
 */
const getPatientLifeSteps = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    let query = `
        SELECT Id, Date, Steps, Distance, Calories, ActiveMinutes, Floors
        FROM LifeSteps
        WHERE UserId = @patientId
    `;
    const params = { patientId };
    
    if (startDate) {
        query += ' AND Date >= @startDate';
        params.startDate = startDate;
    }
    
    if (endDate) {
        query += ' AND Date <= @endDate';
        params.endDate = endDate;
    }
    
    query += ' ORDER BY Date DESC';
    query += ` OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = parseInt(limit);
    
    const result = await executeQuery(query, params);
    
    const lifeSteps = result.recordset.map(l => ({
        id: l.Id,
        date: l.Date,
        steps: l.Steps,
        distance: l.Distance,
        calories: l.Calories,
        activeMinutes: l.ActiveMinutes,
        floors: l.Floors
    }));
    
    res.json({
        success: true,
        data: lifeSteps
    });
});

/**
 * Get patient journals
 * GET /api/gp/patients/:patientId/journals
 */
const getPatientJournals = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { type, limit = 50 } = req.query;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    let query = `
        SELECT Id, Type, Content, Mood, Timestamp, Tags
        FROM JournalEntries
        WHERE UserId = @patientId
    `;
    const params = { patientId };
    
    if (type) {
        query += ' AND Type = @type';
        params.type = type;
    }
    
    query += ' ORDER BY Timestamp DESC';
    query += ` OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = parseInt(limit);
    
    const result = await executeQuery(query, params);
    
    const journals = result.recordset.map(j => ({
        id: j.Id,
        type: j.Type,
        content: j.Content ? JSON.parse(j.Content) : null,
        mood: j.Mood,
        timestamp: j.Timestamp,
        tags: j.Tags ? JSON.parse(j.Tags) : []
    }));
    
    res.json({
        success: true,
        data: journals
    });
});

/**
 * Get health domain summary for a patient
 * GET /api/gp/patients/:patientId/health-domains
 */
const getHealthDomainSummary = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const gpId = req.user.userId;
    
    // Verify this patient belongs to this GP
    if (!(await verifyPatientOwnership(patientId, gpId))) {
        throw new AppError('Patient not found or not assigned to you', 404, 'NOT_FOUND');
    }
    
    const summary = {};
    
    // Get latest measurements for health domains
    const measurementsResult = await executeQuery(
        `WITH LatestMeasurements AS (
            SELECT Type, Value, Timestamp,
                   ROW_NUMBER() OVER (PARTITION BY Type ORDER BY Timestamp DESC) as rn
            FROM Measurements WHERE UserId = @patientId
        )
        SELECT Type, Value, Timestamp FROM LatestMeasurements WHERE rn = 1`,
        { patientId }
    );
    
    measurementsResult.recordset.forEach(m => {
        summary[m.Type] = {
            value: m.Value,
            lastUpdated: m.Timestamp
        };
    });
    
    // Get relevant survey scores
    const surveysResult = await executeQuery(
        `WITH LatestSurveys AS (
            SELECT Type, Score, CompletedAt,
                   ROW_NUMBER() OVER (PARTITION BY Type ORDER BY CompletedAt DESC) as rn
            FROM SurveyResults WHERE UserId = @patientId
        )
        SELECT Type, Score, CompletedAt FROM LatestSurveys WHERE rn = 1`,
        { patientId }
    );
    
    const surveyScores = {};
    surveysResult.recordset.forEach(s => {
        surveyScores[s.Type] = { score: s.Score, completedAt: s.CompletedAt };
    });
    
    // Get active challenges count
    const challengesResult = await executeQuery(
        `SELECT ChallengeId, COUNT(*) as Count
         FROM Challenges WHERE UserId = @patientId AND Status = 'active'
         GROUP BY ChallengeId`,
        { patientId }
    );
    
    const activeChallenges = {};
    challengesResult.recordset.forEach(c => {
        activeChallenges[c.ChallengeId] = c.Count;
    });
    
    res.json({
        success: true,
        data: {
            measurements: summary,
            surveyScores,
            activeChallenges
        }
    });
});

/**
 * Prescribe/Start a challenge for a patient
 * POST /api/gp/patients/:patientId/challenges
 */
const prescribeChallenge = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { type, notes } = req.body;
    
    const validTypes = ['sleep', 'stress', 'movement', 'social', 'nutrition', 'smoking'];
    if (!validTypes.includes(type)) {
        throw new AppError(`Invalid challenge type. Valid types: ${validTypes.join(', ')}`, 400, 'INVALID_TYPE');
    }
    
    // Check patient exists
    const patientResult = await executeQuery(
        `SELECT Id FROM Users WHERE Id = @patientId AND Role = 'patient'`,
        { patientId }
    );
    
    if (patientResult.recordset.length === 0) {
        throw new AppError('Patient not found', 404, 'NOT_FOUND');
    }
    
    // Check for existing active challenge
    const existing = await executeQuery(
        `SELECT Id FROM Challenges WHERE UserId = @patientId AND ChallengeId = @type AND Status = 'active'`,
        { patientId, type }
    );
    
    if (existing.recordset.length > 0) {
        throw new AppError('Patient already has an active challenge of this type', 400, 'CHALLENGE_EXISTS');
    }
    
    const challengeId = uuidv4();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15); // 15 day challenge
    
    // Map type to challengeId format
    const challengeIdMap = {
        'sleep': 'sleepChallenge',
        'movement': 'beweegChallenge',
        'nutrition': 'voedingChallenge',
        'smoking': 'stopRokenChallenge',
        'social': 'socialChallenge',
        'stress': 'stressChallenge'
    };
    const mappedChallengeId = challengeIdMap[type] || 'sleepChallenge';
    
    await executeQuery(
        `INSERT INTO Challenges (Id, UserId, ChallengeId, Status, StartDate, EndDate, Progress, CreatedAt)
         VALUES (@id, @patientId, @challengeId, 'active', @startDate, @endDate, 0, GETUTCDATE())`,
        {
            id: challengeId,
            patientId,
            challengeId: mappedChallengeId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        }
    );
    
    // Create placeholder activities for 15 days
    for (let day = 1; day <= 15; day++) {
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(scheduledDate.getDate() + day - 1);
        
        await executeQuery(
            `INSERT INTO ChallengeActivities (Id, ChallengeId, UserId, Day, Type, ScheduledAt, Status, CreatedAt)
             VALUES (@id, @challengeId, @patientId, @day, 'daily', @scheduledAt, 'pending', GETUTCDATE())`,
            {
                id: uuidv4(),
                challengeId,
                patientId,
                day,
                scheduledAt: scheduledDate.toISOString()
            }
        );
    }
    
    res.status(201).json({
        success: true,
        data: {
            id: challengeId,
            challengeId: mappedChallengeId,
            status: 'active',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        }
    });
});

/**
 * Get GP dashboard statistics
 * GET /api/gp/stats
 */
const getGPStats = asyncHandler(async (req, res) => {
    // Total patients
    const patientsResult = await executeQuery(
        `SELECT COUNT(*) as TotalPatients FROM Users WHERE Role = 'patient'`,
        {}
    );
    
    // Active challenges
    const challengesResult = await executeQuery(
        `SELECT ChallengeId, COUNT(*) as Count FROM Challenges WHERE Status = 'active' GROUP BY ChallengeId`,
        {}
    );
    
    // Recent activity (last 7 days)
    const activityResult = await executeQuery(
        `SELECT 
            (SELECT COUNT(*) FROM Measurements WHERE Timestamp >= DATEADD(day, -7, GETUTCDATE())) as Measurements,
            (SELECT COUNT(*) FROM SurveyResults WHERE CompletedAt >= DATEADD(day, -7, GETUTCDATE())) as Surveys,
            (SELECT COUNT(*) FROM ChallengeActivities WHERE CompletedAt >= DATEADD(day, -7, GETUTCDATE())) as ChallengeActivities`,
        {}
    );
    
    res.json({
        success: true,
        data: {
            totalPatients: patientsResult.recordset[0].TotalPatients,
            activeChallengesByType: challengesResult.recordset.map(c => ({
                challengeId: c.ChallengeId,
                count: c.Count
            })),
            recentActivity: {
                measurements: activityResult.recordset[0].Measurements,
                surveys: activityResult.recordset[0].Surveys,
                challengeActivities: activityResult.recordset[0].ChallengeActivities
            }
        }
    });
});

module.exports = {
    getPatients,
    getPatientDetail,
    getPatientMeasurements,
    getPatientChallenges,
    getPatientChallengeDetail,
    getPatientSurveys,
    getPatientGoals,
    getPatientLifeSteps,
    getPatientJournals,
    getHealthDomainSummary,
    prescribeChallenge,
    getGPStats
};
