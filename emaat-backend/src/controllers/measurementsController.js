/**
 * Measurements Controller
 * Handles health measurements for patients
 * Measurement types: heartRate, bloodPressure, bloodGlucose, steps, weight, 
 *                    temperature, oxygenSaturation, sleepDuration, smoke
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * Get all measurements for current patient
 * GET /api/patient/measurements
 */
const getMeasurements = asyncHandler(async (req, res) => {
    const { type, startDate, endDate, limit = 100 } = req.query;
    
    let query = `
        SELECT Id, Type, Timestamp, Value, Systolic, Diastolic, Hours, Minutes, 
               Condition, Timing, MemoryPhotoKey, MemoryContent, IsPrivate
        FROM Measurements
        WHERE UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
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
        timestamp: m.Timestamp,
        value: m.Value,
        systolic: m.Systolic,
        diastolic: m.Diastolic,
        hours: m.Hours,
        minutes: m.Minutes,
        condition: m.Condition,
        timing: m.Timing,
        memoryPhotoKey: m.MemoryPhotoKey,
        memoryContent: m.MemoryContent,
        isPrivate: m.IsPrivate
    }));
    
    res.json({
        success: true,
        data: measurements
    });
});

/**
 * Add new measurement
 * POST /api/patient/measurements
 */
const addMeasurement = asyncHandler(async (req, res) => {
    const { type, value, systolic, diastolic, hours, minutes, condition, timing, timestamp, memoryPhotoKey, memoryContent, isPrivate } = req.body;
    
    // Validate measurement type
    const validTypes = [
        'heartRate', 'bloodPressure', 'bloodGlucose', 'steps', 'weight',
        'temperature', 'oxygenSaturation', 'sleepDuration', 'smoke'
    ];
    
    if (!validTypes.includes(type)) {
        throw new AppError(`Invalid measurement type. Valid types: ${validTypes.join(', ')}`, 400, 'INVALID_TYPE');
    }
    
    const measurementId = uuidv4();
    
    await executeQuery(
        `INSERT INTO Measurements (Id, UserId, Type, Timestamp, Value, Systolic, Diastolic, Hours, Minutes, Condition, Timing, MemoryPhotoKey, MemoryContent, IsPrivate, CreatedAt)
         VALUES (@id, @userId, @type, @timestamp, @value, @systolic, @diastolic, @hours, @minutes, @condition, @timing, @memoryPhotoKey, @memoryContent, @isPrivate, GETUTCDATE())`,
        {
            id: measurementId,
            userId: req.user.userId,
            type,
            timestamp: timestamp || new Date().toISOString(),
            value: value || null,
            systolic: systolic || null,
            diastolic: diastolic || null,
            hours: hours || null,
            minutes: minutes || null,
            condition: condition || null,
            timing: timing || null,
            memoryPhotoKey: memoryPhotoKey || null,
            memoryContent: memoryContent || null,
            isPrivate: isPrivate || false
        }
    );
    
    // Update activity points for health tracking
    await updateActivityPoints(req.user.userId, 'measurement', 10);
    
    res.status(201).json({
        success: true,
        data: {
            id: measurementId,
            type,
            value,
            systolic,
            diastolic,
            hours,
            minutes,
            timestamp
        }
    });
});

/**
 * Update measurement
 * PUT /api/patient/measurements/:id
 */
const updateMeasurement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { value, systolic, diastolic, hours, minutes, condition, timing, timestamp } = req.body;
    
    // Verify ownership
    const existing = await executeQuery(
        'SELECT Id FROM Measurements WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (existing.recordset.length === 0) {
        throw new AppError('Measurement not found', 404, 'NOT_FOUND');
    }
    
    await executeQuery(
        `UPDATE Measurements 
         SET Value = @value, Systolic = @systolic, Diastolic = @diastolic, 
             Hours = @hours, Minutes = @minutes, Condition = @condition, 
             Timing = @timing, Timestamp = @timestamp
         WHERE Id = @id`,
        {
            id,
            value: value || null,
            systolic: systolic || null,
            diastolic: diastolic || null,
            hours: hours || null,
            minutes: minutes || null,
            condition: condition || null,
            timing: timing || null,
            timestamp
        }
    );
    
    res.json({
        success: true,
        message: 'Measurement updated successfully'
    });
});

/**
 * Delete measurement
 * DELETE /api/patient/measurements/:id
 */
const deleteMeasurement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        'DELETE FROM Measurements WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Measurement not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Measurement deleted successfully'
    });
});

/**
 * Get latest measurement of each type
 * GET /api/patient/measurements/latest
 */
const getLatestMeasurements = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `WITH LatestMeasurements AS (
            SELECT 
                Id, Type, Timestamp, Value, Systolic, Diastolic, Hours, Minutes, Condition, Timing,
                ROW_NUMBER() OVER (PARTITION BY Type ORDER BY Timestamp DESC) as rn
            FROM Measurements
            WHERE UserId = @userId
        )
        SELECT Id, Type, Timestamp, Value, Systolic, Diastolic, Hours, Minutes, Condition, Timing
        FROM LatestMeasurements
        WHERE rn = 1`,
        { userId: req.user.userId }
    );
    
    const measurements = result.recordset.map(m => ({
        id: m.Id,
        type: m.Type,
        timestamp: m.Timestamp,
        value: m.Value,
        systolic: m.Systolic,
        diastolic: m.Diastolic,
        hours: m.Hours,
        minutes: m.Minutes,
        condition: m.Condition,
        timing: m.Timing
    }));
    
    res.json({
        success: true,
        data: measurements
    });
});

/**
 * Get initial BMI data
 * GET /api/patient/measurements/initial-bmi
 */
const getInitialBMI = asyncHandler(async (req, res) => {
    // Get BMI from InitialBMI table
    const bmiResult = await executeQuery(
        `SELECT BMI, Category, Timestamp
         FROM InitialBMI
         WHERE UserId = @userId`,
        { userId: req.user.userId }
    );
    
    // Get height from Users table
    const userResult = await executeQuery(
        `SELECT Height FROM Users WHERE Id = @userId`,
        { userId: req.user.userId }
    );
    
    // Get latest weight from Measurements
    const weightResult = await executeQuery(
        `SELECT TOP 1 Value FROM Measurements 
         WHERE UserId = @userId AND Type = 'weight' 
         ORDER BY Timestamp DESC`,
        { userId: req.user.userId }
    );
    
    if (bmiResult.recordset.length === 0) {
        return res.json({
            success: true,
            data: null
        });
    }
    
    res.json({
        success: true,
        data: {
            height: userResult.recordset[0]?.Height || null,
            weight: weightResult.recordset[0]?.Value || null,
            bmi: bmiResult.recordset[0].BMI,
            category: bmiResult.recordset[0].Category,
            timestamp: bmiResult.recordset[0].Timestamp
        }
    });
});

/**
 * Set initial BMI data
 * POST /api/patient/measurements/initial-bmi
 */
const setInitialBMI = asyncHandler(async (req, res) => {
    const { height, weight } = req.body;
    
    // Calculate BMI: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmi * 100) / 100;
    
    // Determine BMI category
    let category;
    if (roundedBmi < 18.5) category = 'underweight';
    else if (roundedBmi < 25) category = 'healthy';
    else if (roundedBmi < 30) category = 'overweight';
    else category = 'obese';
    
    // Update height in Users table
    await executeQuery(
        `UPDATE Users SET Height = @height WHERE Id = @userId`,
        { height, userId: req.user.userId }
    );
    
    // Add weight measurement
    await executeQuery(
        `INSERT INTO Measurements (Id, UserId, Type, Value, Timestamp)
         VALUES (@id, @userId, 'weight', @weight, GETUTCDATE())`,
        { id: uuidv4(), userId: req.user.userId, weight }
    );
    
    // Upsert initial BMI
    await executeQuery(
        `MERGE INTO InitialBMI AS target
         USING (SELECT @userId as UserId) AS source
         ON target.UserId = source.UserId
         WHEN MATCHED THEN
            UPDATE SET BMI = @bmi, Category = @category, Timestamp = GETUTCDATE()
         WHEN NOT MATCHED THEN
            INSERT (Id, UserId, BMI, Category, Timestamp)
            VALUES (@id, @userId, @bmi, @category, GETUTCDATE());`,
        {
            id: uuidv4(),
            userId: req.user.userId,
            bmi: roundedBmi,
            category
        }
    );
    
    res.json({
        success: true,
        data: {
            height,
            weight,
            bmi: roundedBmi,
            category
        }
    });
});

/**
 * Helper: Update activity points
 * Uses MERGE to upsert activity points with PascalCase column names
 */
async function updateActivityPoints(userId, activityId, points) {
    try {
        // Try to update existing record first
        const updateResult = await executeQuery(
            `UPDATE ActivityPoints 
             SET Points = Points + @points
             WHERE UserId = @userId AND ActivityId = @activityId`,
            { userId, activityId, points }
        );
        
        // If no rows updated, insert new record
        if (updateResult.rowsAffected[0] === 0) {
            await executeQuery(
                `INSERT INTO ActivityPoints (Id, UserId, ActivityId, Points)
                 VALUES (@id, @userId, @activityId, @points)`,
                {
                    id: uuidv4(),
                    userId,
                    activityId,
                    points
                }
            );
        }
    } catch (error) {
        // Log error but don't fail the main operation
        console.error('Error updating activity points:', error.message);
    }
}

module.exports = {
    getMeasurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getLatestMeasurements,
    getInitialBMI,
    setInitialBMI
};
