/**
 * Reminders Controller
 * Handles reminder management for patients
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * Get all reminders for current patient
 * GET /api/patient/reminders
 */
const getReminders = asyncHandler(async (req, res) => {
    const { active } = req.query;
    
    let query = `
        SELECT id, type, title, message, time, days, isActive, createdAt
        FROM Reminders
        WHERE userId = @userId
    `;
    const params = { userId: req.user.userId };
    
    if (active !== undefined) {
        query += ' AND isActive = @isActive';
        params.isActive = active === 'true' ? 1 : 0;
    }
    
    query += ' ORDER BY time';
    
    const result = await executeQuery(query, params);
    
    // Parse JSON days field
    const reminders = result.recordset.map(r => ({
        ...r,
        days: r.days ? JSON.parse(r.days) : null
    }));
    
    res.json({
        success: true,
        data: reminders
    });
});

/**
 * Get reminder by ID
 * GET /api/patient/reminders/:id
 */
const getReminderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `SELECT * FROM Reminders WHERE id = @id AND userId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Reminder not found', 404, 'NOT_FOUND');
    }
    
    const reminder = result.recordset[0];
    reminder.days = reminder.days ? JSON.parse(reminder.days) : null;
    
    res.json({
        success: true,
        data: reminder
    });
});

/**
 * Create a reminder
 * POST /api/patient/reminders
 */
const createReminder = asyncHandler(async (req, res) => {
    const { type, title, message, time, days } = req.body;
    
    const reminderId = uuidv4();
    
    await executeQuery(
        `INSERT INTO Reminders (id, userId, type, title, message, time, days, isActive, createdAt)
         VALUES (@id, @userId, @type, @title, @message, @time, @days, 1, GETUTCDATE())`,
        {
            id: reminderId,
            userId: req.user.userId,
            type: type || 'general',
            title,
            message: message || null,
            time,
            days: days ? JSON.stringify(days) : null
        }
    );
    
    res.status(201).json({
        success: true,
        data: {
            id: reminderId,
            type,
            title,
            message,
            time,
            days,
            isActive: true
        }
    });
});

/**
 * Update a reminder
 * PUT /api/patient/reminders/:id
 */
const updateReminder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, message, time, days, isActive } = req.body;
    
    // Verify ownership
    const existing = await executeQuery(
        'SELECT id FROM Reminders WHERE id = @id AND userId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (existing.recordset.length === 0) {
        throw new AppError('Reminder not found', 404, 'NOT_FOUND');
    }
    
    const updates = [];
    const params = { id };
    
    if (title !== undefined) {
        updates.push('title = @title');
        params.title = title;
    }
    if (message !== undefined) {
        updates.push('message = @message');
        params.message = message;
    }
    if (time !== undefined) {
        updates.push('time = @time');
        params.time = time;
    }
    if (days !== undefined) {
        updates.push('days = @days');
        params.days = JSON.stringify(days);
    }
    if (isActive !== undefined) {
        updates.push('isActive = @isActive');
        params.isActive = isActive ? 1 : 0;
    }
    
    if (updates.length === 0) {
        throw new AppError('No fields to update', 400, 'NO_UPDATES');
    }
    
    await executeQuery(
        `UPDATE Reminders SET ${updates.join(', ')} WHERE id = @id`,
        params
    );
    
    res.json({
        success: true,
        message: 'Reminder updated successfully'
    });
});

/**
 * Toggle reminder active status
 * POST /api/patient/reminders/:id/toggle
 */
const toggleReminder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `UPDATE Reminders SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END
         OUTPUT INSERTED.isActive
         WHERE id = @id AND userId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Reminder not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        data: {
            isActive: result.recordset[0].isActive === 1
        }
    });
});

/**
 * Delete a reminder
 * DELETE /api/patient/reminders/:id
 */
const deleteReminder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        'DELETE FROM Reminders WHERE id = @id AND userId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Reminder not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Reminder deleted successfully'
    });
});

module.exports = {
    getReminders,
    getReminderById,
    createReminder,
    updateReminder,
    toggleReminder,
    deleteReminder
};
