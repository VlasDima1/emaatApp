/**
 * Journals Controller
 * Handles journal types for patients
 * Uses PascalCase column names to match database schema
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Journal types from frontend
const JOURNAL_TYPES = [
    'klachtenDagboek',     // Symptoms diary
    'hoofdpijnDagboek',    // Headache diary
    'hypoOnAwareness',     // Hypoglycemia awareness
    'eetDagboek',          // Eating diary
    'slaapDagboek',        // Sleep diary
    'stemmingsDagboek',    // Mood diary
    // Legacy types
    'food',
    'activity',
    'mood',
    'sleep',
    'stress',
    'gratitude'
];

/**
 * Get all journal entries for current patient
 * GET /api/patient/journals
 */
const getJournalEntries = asyncHandler(async (req, res) => {
    const { type, startDate, endDate, limit = 50 } = req.query;
    
    let query = `
        SELECT Id, JournalId, Timestamp, Data, MemoryPhotoKey, MemoryContent
        FROM JournalEntries
        WHERE UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
    if (type) {
        query += ' AND JournalId = @type';
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
    
    // Transform to camelCase for frontend
    const entries = result.recordset.map(e => {
        let data = {};
        try {
            if (e.Data) data = JSON.parse(e.Data);
        } catch (err) {
            console.error('Error parsing journal data:', err);
        }
        
        return {
            id: e.Id,
            type: e.JournalId,
            timestamp: e.Timestamp,
            content: data,
            memoryPhotoKey: e.MemoryPhotoKey,
            memoryContent: e.MemoryContent
        };
    });
    
    res.json({
        success: true,
        data: entries
    });
});

/**
 * Get journal entry by ID
 * GET /api/patient/journals/:id
 */
const getJournalEntryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `SELECT Id, JournalId, Timestamp, Data, MemoryPhotoKey, MemoryContent
         FROM JournalEntries 
         WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Journal entry not found', 404, 'NOT_FOUND');
    }
    
    const e = result.recordset[0];
    let data = {};
    try {
        if (e.Data) data = JSON.parse(e.Data);
    } catch (err) {
        console.error('Error parsing journal data:', err);
    }
    
    res.json({
        success: true,
        data: {
            id: e.Id,
            type: e.JournalId,
            timestamp: e.Timestamp,
            content: data,
            memoryPhotoKey: e.MemoryPhotoKey,
            memoryContent: e.MemoryContent
        }
    });
});

/**
 * Create a journal entry
 * POST /api/patient/journals
 */
const createJournalEntry = asyncHandler(async (req, res) => {
    const { type, content, timestamp, memoryPhotoKey, memoryContent, memoryIsPrivate } = req.body;
    
    // Accept any journal type for flexibility
    const entryId = uuidv4();
    
    await executeQuery(
        `INSERT INTO JournalEntries (Id, UserId, JournalId, Timestamp, Data, MemoryPhotoKey, MemoryContent, CreatedAt)
         VALUES (@id, @userId, @journalId, @timestamp, @data, @memoryPhotoKey, @memoryContent, GETUTCDATE())`,
        {
            id: entryId,
            userId: req.user.userId,
            journalId: type,
            timestamp: timestamp || new Date().toISOString(),
            data: JSON.stringify(content || {}),
            memoryPhotoKey: memoryPhotoKey || null,
            memoryContent: memoryContent || null
        }
    );
    
    // Award points for journal entry
    await updateActivityPoints(req.user.userId, 'journal', 5);
    
    res.status(201).json({
        success: true,
        data: {
            id: entryId,
            type,
            timestamp,
            content,
            memoryPhotoKey,
            memoryContent
        }
    });
});

/**
 * Update a journal entry
 * PUT /api/patient/journals/:id
 */
const updateJournalEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, memoryPhotoKey, memoryContent } = req.body;
    
    // Verify ownership
    const existing = await executeQuery(
        'SELECT Id FROM JournalEntries WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (existing.recordset.length === 0) {
        throw new AppError('Journal entry not found', 404, 'NOT_FOUND');
    }
    
    const updates = [];
    const params = { id };
    
    if (content !== undefined) {
        updates.push('Data = @data');
        params.data = JSON.stringify(content);
    }
    if (memoryPhotoKey !== undefined) {
        updates.push('MemoryPhotoKey = @memoryPhotoKey');
        params.memoryPhotoKey = memoryPhotoKey;
    }
    if (memoryContent !== undefined) {
        updates.push('MemoryContent = @memoryContent');
        params.memoryContent = memoryContent;
    }
    
    if (updates.length === 0) {
        throw new AppError('No fields to update', 400, 'NO_UPDATES');
    }
    
    await executeQuery(
        `UPDATE JournalEntries SET ${updates.join(', ')} WHERE Id = @id`,
        params
    );
    
    res.json({
        success: true,
        message: 'Journal entry updated successfully'
    });
});

/**
 * Delete a journal entry
 * DELETE /api/patient/journals/:id
 */
const deleteJournalEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        'DELETE FROM JournalEntries WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Journal entry not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Journal entry deleted successfully'
    });
});

/**
 * Get active journals configuration
 * GET /api/patient/journals/active
 */
const getActiveJournals = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT Type, Settings, StartedAt
         FROM ActiveJournals
         WHERE UserId = @userId AND IsActive = 1`,
        { userId: req.user.userId }
    );
    
    const journals = result.recordset.map(j => ({
        type: j.Type,
        settings: j.Settings ? JSON.parse(j.Settings) : null,
        startedAt: j.StartedAt
    }));
    
    res.json({
        success: true,
        data: journals
    });
});

/**
 * Activate a journal type
 * POST /api/patient/journals/activate
 */
const activateJournal = asyncHandler(async (req, res) => {
    const { type, settings } = req.body;
    
    await executeQuery(
        `MERGE INTO ActiveJournals AS target
         USING (SELECT @userId as UserId, @type as Type) AS source
         ON target.UserId = source.UserId AND target.Type = source.Type
         WHEN MATCHED THEN
            UPDATE SET IsActive = 1, Settings = @settings, StartedAt = GETUTCDATE()
         WHEN NOT MATCHED THEN
            INSERT (Id, UserId, Type, IsActive, Settings, StartedAt, CreatedAt)
            VALUES (@id, @userId, @type, 1, @settings, GETUTCDATE(), GETUTCDATE());`,
        {
            id: uuidv4(),
            userId: req.user.userId,
            type,
            settings: settings ? JSON.stringify(settings) : null
        }
    );
    
    res.json({
        success: true,
        message: `${type} journal activated`
    });
});

/**
 * Deactivate a journal type
 * POST /api/patient/journals/deactivate
 */
const deactivateJournal = asyncHandler(async (req, res) => {
    const { type } = req.body;
    
    await executeQuery(
        `UPDATE ActiveJournals SET IsActive = 0
         WHERE UserId = @userId AND Type = @type`,
        { userId: req.user.userId, type }
    );
    
    res.json({
        success: true,
        message: `${type} journal deactivated`
    });
});

/**
 * Helper: Update activity points
 */
async function updateActivityPoints(userId, activity, points) {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        await executeQuery(
            `MERGE INTO ActivityPoints AS target
             USING (SELECT @userId as UserId, @date as Date) AS source
             ON target.UserId = source.UserId AND CAST(target.Date as DATE) = CAST(source.Date as DATE)
             WHEN MATCHED THEN
                UPDATE SET Points = Points + @points
             WHEN NOT MATCHED THEN
                INSERT (Id, UserId, Date, Activity, Points, CreatedAt)
                VALUES (@id, @userId, @date, @activity, @points, GETUTCDATE());`,
            {
                id: uuidv4(),
                userId,
                date: today,
                activity,
                points
            }
        );
    } catch (error) {
        console.error('Error updating activity points:', error);
        // Don't fail the main operation if points update fails
    }
}

module.exports = {
    getJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    getActiveJournals,
    activateJournal,
    deactivateJournal
};
