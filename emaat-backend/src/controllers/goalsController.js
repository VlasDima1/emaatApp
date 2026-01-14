/**
 * Goals Controller
 * Handles patient lifestyle goals with flexible JSON data structure
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Valid goal keys from frontend analysis
const GOAL_KEYS = [
    'dailyWalking', 'movingBreaks', 'sport', 'strength', 'timeOutside',
    'regularSleep', 'screenOff', 'calmTime',
    'fruitVeg', 'water', 'realFood', 'alcohol',
    'social', 'hobby', 'reading', 'socialContact',
    'smoking', 'weight'
];

/**
 * Get all goals for current patient
 * GET /api/patient/goals
 */
const getGoals = asyncHandler(async (req, res) => {
    const { active } = req.query;
    
    let query = `
        SELECT Id, GoalKey, GoalData, IsActive, CreatedAt, UpdatedAt
        FROM Goals
        WHERE UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
    if (active !== undefined) {
        query += ' AND IsActive = @isActive';
        params.isActive = active === 'true' ? 1 : 0;
    }
    
    query += ' ORDER BY CreatedAt DESC';
    
    const result = await executeQuery(query, params);
    
    const goals = result.recordset.map(g => ({
        id: g.Id,
        goalKey: g.GoalKey,
        ...JSON.parse(g.GoalData),
        isActive: g.IsActive,
        createdAt: g.CreatedAt,
        updatedAt: g.UpdatedAt
    }));
    
    res.json({
        success: true,
        data: goals
    });
});

/**
 * Get goal by ID
 * GET /api/patient/goals/:id
 */
const getGoalById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `SELECT Id, GoalKey, GoalData, IsActive, CreatedAt, UpdatedAt
         FROM Goals WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Goal not found', 404, 'NOT_FOUND');
    }
    
    const g = result.recordset[0];
    const goal = {
        id: g.Id,
        goalKey: g.GoalKey,
        ...JSON.parse(g.GoalData),
        isActive: g.IsActive,
        createdAt: g.CreatedAt,
        updatedAt: g.UpdatedAt
    };
    
    res.json({
        success: true,
        data: goal
    });
});

/**
 * Create or update a goal (upsert by goalKey)
 * POST /api/patient/goals
 */
const createGoal = asyncHandler(async (req, res) => {
    const { goalKey, ...goalData } = req.body;
    
    if (!goalKey) {
        throw new AppError('Goal key is required', 400, 'INVALID_INPUT');
    }
    
    if (!GOAL_KEYS.includes(goalKey)) {
        throw new AppError(`Invalid goal key. Valid keys: ${GOAL_KEYS.join(', ')}`, 400, 'INVALID_TYPE');
    }
    
    const goalId = uuidv4();
    
    // Upsert goal (unique constraint on userId + goalKey)
    await executeQuery(
        `MERGE INTO Goals AS target
         USING (SELECT @userId as UserId, @goalKey as GoalKey) AS source
         ON target.UserId = source.UserId AND target.GoalKey = source.GoalKey
         WHEN MATCHED THEN
            UPDATE SET GoalData = @goalData, IsActive = 1, UpdatedAt = GETUTCDATE()
         WHEN NOT MATCHED THEN
            INSERT (Id, UserId, GoalKey, GoalData, IsActive, CreatedAt, UpdatedAt)
            VALUES (@id, @userId, @goalKey, @goalData, 1, GETUTCDATE(), GETUTCDATE());`,
        {
            id: goalId,
            userId: req.user.userId,
            goalKey,
            goalData: JSON.stringify(goalData)
        }
    );
    
    res.status(201).json({
        success: true,
        data: {
            goalKey,
            ...goalData,
            isActive: true
        }
    });
});

/**
 * Update a goal
 * PUT /api/patient/goals/:id
 */
const updateGoal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive, ...goalData } = req.body;
    
    // Verify ownership
    const existing = await executeQuery(
        'SELECT Id, GoalData FROM Goals WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (existing.recordset.length === 0) {
        throw new AppError('Goal not found', 404, 'NOT_FOUND');
    }
    
    // Merge existing data with updates
    const existingData = JSON.parse(existing.recordset[0].GoalData);
    const mergedData = { ...existingData, ...goalData };
    
    await executeQuery(
        `UPDATE Goals SET GoalData = @goalData, IsActive = @isActive, UpdatedAt = GETUTCDATE()
         WHERE Id = @id`,
        {
            id,
            goalData: JSON.stringify(mergedData),
            isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1
        }
    );
    
    res.json({
        success: true,
        message: 'Goal updated successfully'
    });
});

/**
 * Log progress for a goal - no separate table, just update goal data
 * POST /api/patient/goals/:id/progress
 */
const logProgress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    
    // Verify goal ownership
    const goalResult = await executeQuery(
        `SELECT Id, GoalData FROM Goals WHERE Id = @id AND UserId = @userId AND IsActive = 1`,
        { id, userId: req.user.userId }
    );
    
    if (goalResult.recordset.length === 0) {
        throw new AppError('Goal not found or not active', 404, 'NOT_FOUND');
    }
    
    // Update goal data with progress
    const existingData = JSON.parse(goalResult.recordset[0].GoalData);
    existingData.lastProgress = {
        value,
        timestamp: new Date().toISOString()
    };
    
    await executeQuery(
        `UPDATE Goals SET GoalData = @goalData, UpdatedAt = GETUTCDATE()
         WHERE Id = @id`,
        { id, goalData: JSON.stringify(existingData) }
    );
    
    res.json({
        success: true,
        message: 'Progress logged successfully'
    });
});

/**
 * Delete a goal
 * DELETE /api/patient/goals/:id
 */
const deleteGoal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        'DELETE FROM Goals WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Goal not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Goal deleted successfully'
    });
});

module.exports = {
    getGoals,
    getGoalById,
    createGoal,
    updateGoal,
    logProgress,
    deleteGoal
};
