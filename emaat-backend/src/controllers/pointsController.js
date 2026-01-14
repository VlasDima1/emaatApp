/**
 * Points Controller
 * Handles gamification points, badges, and streaks
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Pillar types for points
const PILLARS = ['movement', 'nutrition', 'sleep', 'stress', 'social', 'health'];

/**
 * Get total points for current patient
 * GET /api/patient/points
 */
const getTotalPoints = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT 
            ISNULL(SUM(points), 0) as totalPoints,
            COUNT(DISTINCT CAST(date as DATE)) as activeDays
         FROM ActivityPoints
         WHERE userId = @userId`,
        { userId: req.user.userId }
    );
    
    res.json({
        success: true,
        data: result.recordset[0]
    });
});

/**
 * Get points by pillar
 * GET /api/patient/points/pillars
 */
const getPointsByPillar = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT pillar, ISNULL(SUM(points), 0) as points
         FROM PillarPoints
         WHERE userId = @userId
         GROUP BY pillar`,
        { userId: req.user.userId }
    );
    
    // Ensure all pillars are represented
    const pillarPoints = {};
    PILLARS.forEach(p => pillarPoints[p] = 0);
    result.recordset.forEach(r => pillarPoints[r.pillar] = r.points);
    
    res.json({
        success: true,
        data: pillarPoints
    });
});

/**
 * Get points history
 * GET /api/patient/points/history
 */
const getPointsHistory = asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    
    const result = await executeQuery(
        `SELECT 
            CAST(date as DATE) as date,
            SUM(points) as points,
            STRING_AGG(activity, ', ') as activities
         FROM ActivityPoints
         WHERE userId = @userId
           AND date >= DATEADD(day, -@days, GETUTCDATE())
         GROUP BY CAST(date as DATE)
         ORDER BY date DESC`,
        { userId: req.user.userId, days: parseInt(days) }
    );
    
    res.json({
        success: true,
        data: result.recordset
    });
});

/**
 * Get current streak
 * GET /api/patient/points/streak
 */
const getStreak = asyncHandler(async (req, res) => {
    // Get all activity dates
    const result = await executeQuery(
        `SELECT DISTINCT CAST(date as DATE) as date
         FROM ActivityPoints
         WHERE userId = @userId
         ORDER BY date DESC`,
        { userId: req.user.userId }
    );
    
    const dates = result.recordset.map(r => new Date(r.date));
    
    if (dates.length === 0) {
        return res.json({
            success: true,
            data: { currentStreak: 0, longestStreak: 0 }
        });
    }
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        expected.setHours(0, 0, 0, 0);
        
        const actual = new Date(dates[i]);
        actual.setHours(0, 0, 0, 0);
        
        if (actual.getTime() === expected.getTime()) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        prev.setHours(0, 0, 0, 0);
        curr.setHours(0, 0, 0, 0);
        
        const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    
    res.json({
        success: true,
        data: { currentStreak, longestStreak }
    });
});

/**
 * Add pillar points
 * POST /api/patient/points/pillar
 */
const addPillarPoints = asyncHandler(async (req, res) => {
    const { pillar, points, reason } = req.body;
    
    if (!PILLARS.includes(pillar)) {
        throw new AppError(`Invalid pillar. Valid pillars: ${PILLARS.join(', ')}`, 400, 'INVALID_PILLAR');
    }
    
    await executeQuery(
        `INSERT INTO PillarPoints (id, userId, pillar, points, reason, date, createdAt)
         VALUES (@id, @userId, @pillar, @points, @reason, GETUTCDATE(), GETUTCDATE())`,
        {
            id: uuidv4(),
            userId: req.user.userId,
            pillar,
            points,
            reason: reason || null
        }
    );
    
    res.json({
        success: true,
        message: `Added ${points} points to ${pillar} pillar`
    });
});

/**
 * Get community goals progress
 * GET /api/patient/community-goals
 */
const getCommunityGoals = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT cg.*, 
            (SELECT ISNULL(SUM(ap.points), 0) 
             FROM ActivityPoints ap 
             WHERE ap.createdAt >= cg.startDate 
               AND ap.createdAt <= cg.endDate) as currentProgress
         FROM CommunityGoals cg
         WHERE cg.isActive = 1
         ORDER BY cg.endDate`,
        {}
    );
    
    res.json({
        success: true,
        data: result.recordset
    });
});

module.exports = {
    getTotalPoints,
    getPointsByPillar,
    getPointsHistory,
    getStreak,
    addPillarPoints,
    getCommunityGoals
};
