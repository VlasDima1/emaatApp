/**
 * Surveys Controller
 * Handles survey results for patients
 * Uses PascalCase column names to match schema
 */
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Survey types from frontend analysis
const SURVEY_TYPES = [
    'fourDKL',        // 4DKL (Dutch)
    'phq9',           // Depression
    'gad7',           // Anxiety
    'psqi',           // Sleep quality
    'pss10',          // Perceived stress
    'ipaq',           // Physical activity
    'maq',            // Medication adherence
    'dtsq',           // Diabetes treatment satisfaction
    'paid',           // Problem areas in diabetes
    'wbq12',          // Well-being
    'euroqol',        // Quality of life (EQ-5D)
    'sf12',           // Health survey
    'mna',            // Mini nutritional assessment
    'audit',          // Alcohol use
    'fagerstrom'      // Nicotine dependence
];

/**
 * Get all survey results for current patient
 * GET /api/patient/surveys
 */
const getSurveyResults = asyncHandler(async (req, res) => {
    const { surveyId, limit = 50 } = req.query;
    
    let query = `
        SELECT Id, SurveyId, Timestamp, Answers, Scores, Interpretation, TotalScore, MaxScore, ResultLabel
        FROM SurveyResults
        WHERE UserId = @userId
    `;
    const params = { userId: req.user.userId };
    
    if (surveyId) {
        query += ' AND SurveyId = @surveyId';
        params.surveyId = surveyId;
    }
    
    query += ' ORDER BY Timestamp DESC';
    query += ` OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = parseInt(limit);
    
    const result = await executeQuery(query, params);
    
    // Transform to camelCase for frontend and parse JSON fields
    const surveys = result.recordset.map(s => {
        let answers = [];
        let scores = {};
        let interpretation = {};
        
        try {
            if (s.Answers) answers = JSON.parse(s.Answers);
        } catch (e) { console.error('Error parsing answers:', e); }
        
        try {
            if (s.Scores) scores = JSON.parse(s.Scores);
        } catch (e) { console.error('Error parsing scores:', e); }
        
        try {
            if (s.Interpretation) interpretation = JSON.parse(s.Interpretation);
        } catch (e) { console.error('Error parsing interpretation:', e); }
        
        return {
            id: s.Id,
            surveyId: s.SurveyId,
            timestamp: s.Timestamp,
            answers,
            scores,
            interpretation,
            totalScore: s.TotalScore,
            maxScore: s.MaxScore,
            resultLabel: s.ResultLabel,
            // For backwards compatibility
            score: s.TotalScore,
            level: s.ResultLabel
        };
    });
    
    res.json({
        success: true,
        data: surveys
    });
});

/**
 * Get latest survey result of each type
 * GET /api/patient/surveys/latest
 */
const getLatestSurveys = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `WITH LatestSurveys AS (
            SELECT 
                Id, SurveyId, Timestamp, Answers, Scores, Interpretation, TotalScore, MaxScore, ResultLabel,
                ROW_NUMBER() OVER (PARTITION BY SurveyId ORDER BY Timestamp DESC) as rn
            FROM SurveyResults
            WHERE UserId = @userId
        )
        SELECT Id, SurveyId, Timestamp, Answers, Scores, Interpretation, TotalScore, MaxScore, ResultLabel
        FROM LatestSurveys
        WHERE rn = 1`,
        { userId: req.user.userId }
    );
    
    const surveys = result.recordset.map(s => {
        let answers = [];
        let scores = {};
        let interpretation = {};
        
        try { if (s.Answers) answers = JSON.parse(s.Answers); } catch (e) {}
        try { if (s.Scores) scores = JSON.parse(s.Scores); } catch (e) {}
        try { if (s.Interpretation) interpretation = JSON.parse(s.Interpretation); } catch (e) {}
        
        return {
            id: s.Id,
            surveyId: s.SurveyId,
            timestamp: s.Timestamp,
            answers,
            scores,
            interpretation,
            totalScore: s.TotalScore,
            maxScore: s.MaxScore,
            resultLabel: s.ResultLabel,
            score: s.TotalScore,
            level: s.ResultLabel
        };
    });
    
    res.json({
        success: true,
        data: surveys
    });
});

/**
 * Get survey result by ID
 * GET /api/patient/surveys/:id
 */
const getSurveyById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        `SELECT Id, SurveyId, Timestamp, Answers, Scores, Interpretation, TotalScore, MaxScore, ResultLabel
         FROM SurveyResults 
         WHERE Id = @id AND UserId = @userId`,
        { id, userId: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Survey result not found', 404, 'NOT_FOUND');
    }
    
    const s = result.recordset[0];
    let answers = [];
    let scores = {};
    let interpretation = {};
    
    try { if (s.Answers) answers = JSON.parse(s.Answers); } catch (e) {}
    try { if (s.Scores) scores = JSON.parse(s.Scores); } catch (e) {}
    try { if (s.Interpretation) interpretation = JSON.parse(s.Interpretation); } catch (e) {}
    
    res.json({
        success: true,
        data: {
            id: s.Id,
            surveyId: s.SurveyId,
            timestamp: s.Timestamp,
            answers,
            scores,
            interpretation,
            totalScore: s.TotalScore,
            maxScore: s.MaxScore,
            resultLabel: s.ResultLabel,
            score: s.TotalScore,
            level: s.ResultLabel
        }
    });
});

/**
 * Submit a survey
 * POST /api/patient/surveys
 */
const submitSurvey = asyncHandler(async (req, res) => {
    const { surveyId, type, answers, scores, interpretation, totalScore, maxScore, resultLabel, score, level } = req.body;
    
    const actualSurveyId = surveyId || type;
    
    if (!actualSurveyId) {
        throw new AppError('Survey ID or type is required', 400, 'MISSING_SURVEY_ID');
    }
    
    if (!answers) {
        throw new AppError('Answers must be provided', 400, 'INVALID_ANSWERS');
    }
    
    const id = uuidv4();
    const actualTotalScore = totalScore ?? score ?? 0;
    const actualResultLabel = resultLabel ?? level ?? null;
    
    await executeQuery(
        `INSERT INTO SurveyResults (Id, UserId, SurveyId, Timestamp, Answers, Scores, Interpretation, TotalScore, MaxScore, ResultLabel, CreatedAt)
         VALUES (@id, @userId, @surveyId, GETUTCDATE(), @answers, @scores, @interpretation, @totalScore, @maxScore, @resultLabel, GETUTCDATE())`,
        {
            id,
            userId: req.user.userId,
            surveyId: actualSurveyId,
            answers: typeof answers === 'string' ? answers : JSON.stringify(answers),
            scores: scores ? (typeof scores === 'string' ? scores : JSON.stringify(scores)) : '{}',
            interpretation: interpretation ? (typeof interpretation === 'string' ? interpretation : JSON.stringify(interpretation)) : '{}',
            totalScore: actualTotalScore,
            maxScore: maxScore || null,
            resultLabel: actualResultLabel
        }
    );
    
    res.status(201).json({
        success: true,
        data: {
            id,
            surveyId: actualSurveyId,
            totalScore: actualTotalScore,
            resultLabel: actualResultLabel,
            timestamp: new Date().toISOString()
        }
    });
});

/**
 * Get survey history for a specific type
 * GET /api/patient/surveys/history/:surveyId
 */
const getSurveyHistory = asyncHandler(async (req, res) => {
    const { surveyId } = req.params;
    
    const result = await executeQuery(
        `SELECT Id, TotalScore, Timestamp, ResultLabel, Interpretation
         FROM SurveyResults
         WHERE UserId = @userId AND SurveyId = @surveyId
         ORDER BY Timestamp DESC`,
        { userId: req.user.userId, surveyId }
    );
    
    const surveys = result.recordset.map(s => {
        let interpretation = {};
        try { if (s.Interpretation) interpretation = JSON.parse(s.Interpretation); } catch (e) {}
        
        return {
            id: s.Id,
            score: s.TotalScore,
            timestamp: s.Timestamp,
            level: s.ResultLabel,
            interpretation
        };
    });
    
    res.json({
        success: true,
        data: surveys
    });
});

/**
 * Delete a survey result
 * DELETE /api/patient/surveys/:id
 */
const deleteSurvey = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await executeQuery(
        'DELETE FROM SurveyResults WHERE Id = @id AND UserId = @userId',
        { id, userId: req.user.userId }
    );
    
    if (result.rowsAffected[0] === 0) {
        throw new AppError('Survey result not found', 404, 'NOT_FOUND');
    }
    
    res.json({
        success: true,
        message: 'Survey result deleted successfully'
    });
});

module.exports = {
    getSurveyResults,
    getLatestSurveys,
    getSurveyById,
    submitSurvey,
    getSurveyHistory,
    deleteSurvey
};
