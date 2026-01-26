/**
 * Challenges Controller
 * Handles 6 challenge types: sleepChallenge, stressChallenge, beweegChallenge, socialChallenge, voedingChallenge, stopRokenChallenge
 * Each challenge has daily activities over a 15-day period
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Challenge types and their configurations
const CHALLENGE_TYPES = {
    sleepChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    stressChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    beweegChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    socialChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    voedingChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    stopRokenChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 },
    hartfalenChallenge: { duration: 15, dailyPoints: 10, completionPoints: 100 }
};

// Map backend type names to database ChallengeId values (for backwards compatibility)
const TYPE_TO_CHALLENGE_ID = {
    'sleep': 'sleepChallenge',
    'stress': 'stressChallenge',
    'movement': 'beweegChallenge',
    'social': 'socialChallenge',
    'nutrition': 'voedingChallenge',
    'smoking': 'stopRokenChallenge',
    'hartfalen': 'hartfalenChallenge',
    // Also accept direct challengeId names
    'sleepChallenge': 'sleepChallenge',
    'stressChallenge': 'stressChallenge',
    'beweegChallenge': 'beweegChallenge',
    'socialChallenge': 'socialChallenge',
    'voedingChallenge': 'voedingChallenge',
    'stopRokenChallenge': 'stopRokenChallenge',
    'hartfalenChallenge': 'hartfalenChallenge'
};

/**
 * Get all challenges for current patient
 * GET /api/patient/challenges
 */
const getChallenges = asyncHandler(async (req, res) => {
    const { status } = req.query;
    
    let query = `
        SELECT c.Id, c.UserId, c.ChallengeId, c.Status, c.StartDate, c.EndDate, c.Progress, c.CreatedAt,
               (SELECT COUNT(*) FROM ChallengeActivities ca 
                WHERE ca.ChallengeId = c.Id AND ca.Status = 'completed') as CompletedDays
        FROM Challenges c
        WHERE c.UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
    if (status) {
        query += ' AND c.Status = @status';
        params.status = status;
    }
    
    query += ' ORDER BY c.CreatedAt DESC';
    
    const result = await executeQuery(query, params);
    
    const challenges = result.recordset.map(c => ({
        id: c.Id,
        challengeId: c.ChallengeId,
        type: c.ChallengeId, // Alias for compatibility
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
 * Get active challenges
 * GET /api/patient/challenges/active
 */
const getActiveChallenges = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT c.Id, c.UserId, c.ChallengeId, c.Status, c.StartDate, c.EndDate, c.Progress, c.CreatedAt,
                (SELECT COUNT(*) FROM ChallengeActivities ca 
                 WHERE ca.ChallengeId = c.Id AND ca.Status = 'completed') as CompletedDays
         FROM Challenges c
         WHERE c.UserId = @userId AND c.Status = 'active'
         ORDER BY c.CreatedAt DESC`,
        { userId: req.user.userId }
    );
    
    const challenges = result.recordset.map(c => ({
        id: c.Id,
        challengeId: c.ChallengeId,
        type: c.ChallengeId,
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
 * GET /api/patient/challenges/:id
 */
const getChallengeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const challengeResult = await executeQuery(
        `SELECT * FROM Challenges WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
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
        { challengeId: id }
    );
    
    const challenge = {
        id: c.Id,
        challengeId: c.ChallengeId,
        type: c.ChallengeId,
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
 * Start a new challenge
 * POST /api/patient/challenges
 */
const startChallenge = asyncHandler(async (req, res) => {
    const { type } = req.body;
    
    // Map type to challengeId
    const challengeId = TYPE_TO_CHALLENGE_ID[type];
    
    if (!challengeId || !CHALLENGE_TYPES[challengeId]) {
        throw new AppError(`Invalid challenge type. Valid types: ${Object.keys(TYPE_TO_CHALLENGE_ID).join(', ')}`, 400, 'INVALID_TYPE');
    }
    
    // Check for existing active challenge (only one active challenge at a time)
    const existing = await executeQuery(
        `SELECT Id FROM Challenges 
         WHERE UserId = @userId AND Status = 'active'`,
        { userId: req.user.userId }
    );
    
    if (existing.recordset.length > 0) {
        // Stop the existing challenge first
        await executeQuery(
            `UPDATE Challenges SET Status = 'stopped', UpdatedAt = GETUTCDATE() WHERE Id = @id`,
            { id: existing.recordset[0].Id }
        );
    }
    
    const id = uuidv4();
    const config = CHALLENGE_TYPES[challengeId];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + config.duration);
    
    await executeQuery(
        `INSERT INTO Challenges (Id, UserId, ChallengeId, Status, StartDate, EndDate, Progress, CreatedAt)
         VALUES (@id, @userId, @challengeId, 'active', @startDate, @endDate, 0, GETUTCDATE())`,
        {
            id,
            userId: req.user.userId,
            challengeId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        }
    );
    
    // Create placeholder activities for all days
    for (let day = 1; day <= config.duration; day++) {
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(scheduledDate.getDate() + day - 1);
        
        await executeQuery(
            `INSERT INTO ChallengeActivities (Id, ChallengeId, UserId, Day, Type, ScheduledAt, Status, CreatedAt)
             VALUES (@id, @challengeId, @userId, @day, 'daily', @scheduledAt, 'pending', GETUTCDATE())`,
            {
                id: uuidv4(),
                challengeId: id,
                userId: req.user.userId,
                day,
                scheduledAt: scheduledDate.toISOString()
            }
        );
    }
    
    res.status(201).json({
        success: true,
        data: {
            id,
            challengeId,
            type: challengeId,
            status: 'active',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            progress: 0,
            currentDay: 1,
            totalDays: config.duration
        }
    });
});

/**
 * Complete daily activity for a challenge
 * POST /api/patient/challenges/:id/complete-day
 */
const completeDailyActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { dayNumber, data } = req.body;
    
    // Verify challenge ownership and status
    const challenge = await executeQuery(
        `SELECT * FROM Challenges WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (challenge.recordset.length === 0) {
        throw new AppError('Challenge not found', 404, 'NOT_FOUND');
    }
    
    if (challenge.recordset[0].Status !== 'active') {
        throw new AppError('Challenge is not active', 400, 'CHALLENGE_NOT_ACTIVE');
    }
    
    // Update activity
    const updateResult = await executeQuery(
        `UPDATE ChallengeActivities 
         SET Status = 'completed', Data = @data, CompletedAt = GETUTCDATE()
         WHERE ChallengeId = @challengeId AND Day = @dayNumber`,
        {
            challengeId: id,
            dayNumber,
            data: data ? JSON.stringify(data) : null
        }
    );
    
    if (updateResult.rowsAffected[0] === 0) {
        throw new AppError('Activity not found for this day', 404, 'ACTIVITY_NOT_FOUND');
    }
    
    // Award points
    const config = CHALLENGE_TYPES[challenge.recordset[0].ChallengeId];
    try {
        await updateActivityPoints(req.user.userId, 'challenge_daily', config.dailyPoints);
    } catch (e) {
        console.log('Points update skipped:', e.message);
    }
    
    // Calculate progress
    const completedCount = await executeQuery(
        `SELECT COUNT(*) as count FROM ChallengeActivities 
         WHERE ChallengeId = @challengeId AND Status = 'completed'`,
        { challengeId: id }
    );
    
    const progress = Math.round((completedCount.recordset[0].count / config.duration) * 100);
    
    // Update challenge progress
    await executeQuery(
        `UPDATE Challenges SET Progress = @progress, UpdatedAt = GETUTCDATE() WHERE Id = @id`,
        { id, progress }
    );
    
    // Check if challenge is complete
    if (completedCount.recordset[0].count >= config.duration) {
        await executeQuery(
            `UPDATE Challenges SET Status = 'completed', Progress = 100, UpdatedAt = GETUTCDATE()
             WHERE Id = @id`,
            { id }
        );
        
        // Award completion bonus
        try {
            await updateActivityPoints(req.user.userId, 'challenge_complete', config.completionPoints);
        } catch (e) {
            console.log('Completion points update skipped:', e.message);
        }
    }
    
    res.json({
        success: true,
        message: 'Daily activity completed',
        data: {
            dayNumber,
            completed: true,
            progress,
            pointsEarned: config.dailyPoints
        }
    });
});

/**
 * Cancel/abandon a challenge
 * POST /api/patient/challenges/:id/cancel
 */
const cancelChallenge = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `UPDATE Challenges SET Status = 'stopped', UpdatedAt = GETUTCDATE()
         WHERE Id = @id AND UserId = @userId AND Status = 'active'`,
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Challenge not found or not active', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Challenge cancelled'
    });
});

/**
 * Update challenge progress (alias for complete-day, used by mobile app)
 * POST /api/patient/challenges/:id/progress
 * Accepts: { dayNumber, type, data, ...rest }
 */
const updateChallengeProgress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { dayNumber, type, data: activityData, ...rest } = req.body;
    
    console.log('[updateChallengeProgress] Received:', {
        challengeId: id,
        dayNumber,
        type,
        activityData,
        rest,
        fullBody: req.body
    });
    
    // Activity type (e.g., morningCheckin, eveningCheckin, braintainment)
    const activityType = type || 'daily';
    
    // The actual data to store (could be nested in 'data' or spread in rest)
    const dataToStore = activityData || rest;
    
    console.log('[updateChallengeProgress] Storing:', {
        activityType,
        dataToStore
    });
    
    // If no dayNumber, calculate from start date
    let day = dayNumber;
    
    if (!day) {
        // Get challenge start date to calculate current day
        const challenge = await executeQuery(
            `SELECT StartDate FROM Challenges WHERE Id = @id AND UserId = @userId`,
            { id, userId: req.user.userId }
        );
        
        if (challenge.recordset.length === 0) {
            throw new AppError('Challenge not found', 404, 'NOT_FOUND');
        }
        
        const startDate = new Date(challenge.recordset[0].StartDate);
        const today = new Date();
        day = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        day = Math.max(1, Math.min(day, 15)); // Clamp between 1 and 15
    }
    
    // Verify challenge ownership and status
    const challenge = await executeQuery(
        `SELECT * FROM Challenges WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (challenge.recordset.length === 0) {
        throw new AppError('Challenge not found', 404, 'NOT_FOUND');
    }
    
    if (challenge.recordset[0].Status !== 'active') {
        throw new AppError('Challenge is not active', 400, 'CHALLENGE_NOT_ACTIVE');
    }
    
    // Check if activity with this day AND type already exists
    const existingActivity = await executeQuery(
        `SELECT Id FROM ChallengeActivities WHERE ChallengeId = @challengeId AND Day = @dayNumber AND Type = @type`,
        { challengeId: id, dayNumber: day, type: activityType }
    );
    
    // Serialize the data to store
    const dataJson = dataToStore && Object.keys(dataToStore).length > 0 ? JSON.stringify(dataToStore) : null;
    
    if (existingActivity.recordset.length > 0) {
        await executeQuery(
            `UPDATE ChallengeActivities 
             SET Status = 'completed', Data = @data, CompletedAt = GETUTCDATE()
             WHERE ChallengeId = @challengeId AND Day = @dayNumber AND Type = @type`,
            {
                challengeId: id,
                dayNumber: day,
                type: activityType,
                data: dataJson
            }
        );
    } else {
        // Activity doesn't exist, create it
        await executeQuery(
            `INSERT INTO ChallengeActivities (Id, ChallengeId, UserId, Day, Type, ScheduledAt, Status, Data, CompletedAt, CreatedAt)
             VALUES (@id, @challengeId, @userId, @day, @type, GETUTCDATE(), 'completed', @data, GETUTCDATE(), GETUTCDATE())`,
            {
                id: uuidv4(),
                challengeId: id,
                userId: req.user.userId,
                day,
                type: activityType,
                data: dataJson
            }
        );
    }
    
    // Award points
    const config = CHALLENGE_TYPES[challenge.recordset[0].ChallengeId];
    if (config) {
        try {
            await updateActivityPoints(req.user.userId, 'challenge_daily', config.dailyPoints);
        } catch (e) {
            console.log('Points update skipped:', e.message);
        }
    }
    
    // Calculate progress based on unique days with at least one completed activity
    const completedDays = await executeQuery(
        `SELECT COUNT(DISTINCT Day) as count FROM ChallengeActivities 
         WHERE ChallengeId = @challengeId AND Status = 'completed'`,
        { challengeId: id }
    );
    
    const duration = config ? config.duration : 15;
    const progress = Math.round((completedDays.recordset[0].count / duration) * 100);
    
    // Update challenge progress
    await executeQuery(
        `UPDATE Challenges SET Progress = @progress, UpdatedAt = GETUTCDATE() WHERE Id = @id`,
        { id, progress }
    );
    
    // Check if challenge is complete (all days have activities)
    if (completedDays.recordset[0].count >= duration) {
        await executeQuery(
            `UPDATE Challenges SET Status = 'completed', Progress = 100, UpdatedAt = GETUTCDATE()
             WHERE Id = @id`,
            { id }
        );
        
        // Award completion bonus
        if (config) {
            try {
                await updateActivityPoints(req.user.userId, 'challenge_complete', config.completionPoints);
            } catch (e) {
                console.log('Completion points update skipped:', e.message);
            }
        }
    }
    
    res.json({
        success: true,
        message: 'Challenge progress updated',
        data: {
            dayNumber: day,
            completed: true,
            progress,
            pointsEarned: config ? config.dailyPoints : 10
        }
    });
});

/**
 * Get challenge history/stats
 * GET /api/patient/challenges/stats
 */
const getChallengeStats = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT 
            ChallengeId,
            COUNT(*) as totalStarted,
            SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN Status = 'active' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN Status = 'stopped' THEN 1 ELSE 0 END) as stopped
         FROM Challenges
         WHERE UserId = @userId
         GROUP BY ChallengeId`,
        { userId: req.user.userId }
    );
    
    res.json({
        success: true,
        data: result.recordset.map(r => ({
            challengeId: r.ChallengeId,
            type: r.ChallengeId,
            totalStarted: r.totalStarted,
            completed: r.completed,
            active: r.active,
            stopped: r.stopped
        }))
    });
});

/**
 * Helper: Update activity points
 */
async function updateActivityPoints(userId, activityId, points) {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // Try to update existing record
        const updateResult = await executeQuery(
            `UPDATE ActivityPoints SET Points = Points + @points WHERE UserId = @userId AND ActivityId = @activityId AND CAST(CreatedAt AS DATE) = @today`,
            { userId, activityId, points, today }
        );
        
        if (updateResult.rowsAffected[0] === 0) {
            // Insert new record
            await executeQuery(
                `INSERT INTO ActivityPoints (Id, UserId, ActivityId, Points, CreatedAt)
                 VALUES (@id, @userId, @activityId, @points, GETUTCDATE())`,
                {
                    id: uuidv4(),
                    userId,
                    activityId,
                    points
                }
            );
        }
    } catch (e) {
        console.log('ActivityPoints update error:', e.message);
    }
}

module.exports = {
    getChallenges,
    getActiveChallenges,
    getChallengeById,
    startChallenge,
    completeDailyActivity,
    updateChallengeProgress,
    cancelChallenge,
    getChallengeStats
};
