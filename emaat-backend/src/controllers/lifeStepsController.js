/**
 * Life Steps Controller
 * Handles activity logging (the "life story" timeline entries)
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * Get life steps (activity timeline) for current patient
 * GET /api/patient/life-steps
 */
const getLifeSteps = asyncHandler(async (req, res) => {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let query = `
        SELECT Id, ActivityId, Timestamp, Nudge, PointsBefore, PointsAfter, PointsDoubled,
               AvatarBeforeKey, AvatarAfterKey, AudioDataKey,
               MemoryPhotoKey, MemoryContent, IsPrivate,
               EarnedBadgeActivityId, EarnedBadgeTier, ChallengeActivityId
        FROM LifeSteps
        WHERE UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
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
    
    const lifeSteps = result.recordset.map(s => ({
        id: s.Id,
        activityId: s.ActivityId,
        timestamp: s.Timestamp,
        nudge: s.Nudge,
        pointsBefore: s.PointsBefore,
        pointsAfter: s.PointsAfter,
        pointsDoubled: s.PointsDoubled,
        avatarBeforeKey: s.AvatarBeforeKey,
        avatarAfterKey: s.AvatarAfterKey,
        audioDataKey: s.AudioDataKey,
        memoryPhotoKey: s.MemoryPhotoKey,
        memoryContent: s.MemoryContent,
        isPrivate: s.IsPrivate,
        earnedBadge: s.EarnedBadgeActivityId ? {
            activityId: s.EarnedBadgeActivityId,
            tier: s.EarnedBadgeTier
        } : null,
        challengeActivityId: s.ChallengeActivityId
    }));
    
    res.json({
        success: true,
        data: lifeSteps
    });
});

/**
 * Get life steps for a specific date
 * GET /api/patient/life-steps/:date
 */
const getLifeStepsByDate = asyncHandler(async (req, res) => {
    const { date } = req.params;
    
    const result = await executeQuery(
        `SELECT Id, ActivityId, Timestamp, Nudge, PointsBefore, PointsAfter, PointsDoubled,
                AvatarBeforeKey, AvatarAfterKey, AudioDataKey,
                MemoryPhotoKey, MemoryContent, IsPrivate,
                EarnedBadgeActivityId, EarnedBadgeTier, ChallengeActivityId
         FROM LifeSteps 
         WHERE UserId = @userId AND CAST(Timestamp as DATE) = CAST(@date as DATE)
         ORDER BY Timestamp DESC`,
        { userId: req.user.userId, date }
    );
    
    const lifeSteps = result.recordset.map(s => ({
        id: s.Id,
        activityId: s.ActivityId,
        timestamp: s.Timestamp,
        nudge: s.Nudge,
        pointsBefore: s.PointsBefore,
        pointsAfter: s.PointsAfter,
        pointsDoubled: s.PointsDoubled,
        memoryPhotoKey: s.MemoryPhotoKey,
        memoryContent: s.MemoryContent,
        isPrivate: s.IsPrivate
    }));
    
    res.json({
        success: true,
        data: lifeSteps
    });
});

/**
 * Log a life step (activity)
 * POST /api/patient/life-steps
 */
const logLifeSteps = asyncHandler(async (req, res) => {
    const { 
        activityId, 
        activityName,
        pillar,
        timestamp, 
        nudge, 
        points = 0,
        memoryPhotoKey,
        memoryContent,
        memoryIsPrivate = false,
        challengeActivityId
    } = req.body;
    
    if (!activityId) {
        throw new AppError('Activity ID is required', 400, 'INVALID_INPUT');
    }
    
    // Get current user points
    const userResult = await executeQuery(
        'SELECT Points FROM Users WHERE Id = @userId',
        { userId: req.user.userId }
    );
    const currentPoints = userResult.recordset[0]?.Points || 0;
    const newPoints = currentPoints + points;
    
    const stepId = uuidv4();
    
    await executeQuery(
        `INSERT INTO LifeSteps (
            Id, UserId, ActivityId, Timestamp, Nudge, 
            PointsBefore, PointsAfter, PointsDoubled,
            MemoryPhotoKey, MemoryContent, IsPrivate,
            ChallengeActivityId
        ) VALUES (
            @id, @userId, @activityId, @timestamp, @nudge,
            @pointsBefore, @pointsAfter, 0,
            @memoryPhotoKey, @memoryContent, @isPrivate,
            @challengeActivityId
        )`,
        {
            id: stepId,
            userId: req.user.userId,
            activityId,
            timestamp: timestamp || new Date().toISOString(),
            nudge: nudge || null,
            pointsBefore: currentPoints,
            pointsAfter: newPoints,
            memoryPhotoKey: memoryPhotoKey || null,
            memoryContent: memoryContent || null,
            isPrivate: memoryIsPrivate,
            challengeActivityId: challengeActivityId || null
        }
    );
    
    // Update user's points
    if (points > 0) {
        await executeQuery(
            `UPDATE Users SET Points = @points, LastActivityDate = CAST(GETUTCDATE() as DATE)
             WHERE Id = @userId`,
            { userId: req.user.userId, points: newPoints }
        );
    }
    
    res.status(201).json({
        success: true,
        data: {
            id: stepId,
            activityId,
            timestamp,
            pointsEarned: points
        }
    });
});

/**
 * Get weekly summary
 * GET /api/patient/life-steps/summary/weekly
 */
const getWeeklySummary = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT 
            ActivityId,
            COUNT(*) as Count,
            SUM(PointsAfter - PointsBefore) as TotalPoints
         FROM LifeSteps
         WHERE UserId = @userId 
           AND Timestamp >= DATEADD(week, -1, GETUTCDATE())
         GROUP BY ActivityId
         ORDER BY TotalPoints DESC`,
        { userId: req.user.userId }
    );
    
    res.json({
        success: true,
        data: result.recordset.map(r => ({
            activityId: r.ActivityId,
            count: r.Count,
            totalPoints: r.TotalPoints
        }))
    });
});

/**
 * Get monthly summary
 * GET /api/patient/life-steps/summary/monthly
 */
const getMonthlySummary = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT 
            ActivityId,
            COUNT(*) as Count,
            SUM(PointsAfter - PointsBefore) as TotalPoints
         FROM LifeSteps
         WHERE UserId = @userId 
           AND Timestamp >= DATEADD(month, -1, GETUTCDATE())
         GROUP BY ActivityId
         ORDER BY TotalPoints DESC`,
        { userId: req.user.userId }
    );
    
    res.json({
        success: true,
        data: result.recordset.map(r => ({
            activityId: r.ActivityId,
            count: r.Count,
            totalPoints: r.TotalPoints
        }))
    });
});

module.exports = {
    getLifeSteps,
    getLifeStepsByDate,
    logLifeSteps,
    getWeeklySummary,
    getMonthlySummary
};
