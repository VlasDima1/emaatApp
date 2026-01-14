/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/db');
const { generateToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * Register new user (patient or GP)
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
    const { 
        email, 
        password, 
        name, 
        role = 'patient', 
        accessCode,
        // Additional patient fields
        dateOfBirth,
        gender,
        height,
        weight,
        photoDataUrl,
        language = 'nl'
    } = req.body;
    
    // Validate role
    if (!['patient', 'gp'].includes(role)) {
        throw new AppError('Invalid role. Must be "patient" or "gp"', 400, 'INVALID_ROLE');
    }
    
    // For patients, validate access code
    let gpId = null;
    if (role === 'patient') {
        if (!accessCode) {
            throw new AppError('Access code is required for patient registration', 400, 'ACCESS_CODE_REQUIRED');
        }
        
        const codeResult = await executeQuery(
            'SELECT * FROM AccessCodes WHERE Code = @code AND IsUsed = 0',
            { code: accessCode }
        );
        
        if (codeResult.recordset.length === 0) {
            throw new AppError('Invalid or already used access code', 400, 'INVALID_ACCESS_CODE');
        }
        
        // Get the GP who created this access code
        gpId = codeResult.recordset[0].GPId;
    }
    
    // Check if email already exists
    const existingUser = await executeQuery(
        'SELECT Id FROM Users WHERE Email = @email',
        { email }
    );
    
    if (existingUser.recordset.length > 0) {
        throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user with all fields
    const userId = uuidv4();
    await executeQuery(
        `INSERT INTO Users (
            Id, Email, PasswordHash, Name, Role, 
            DateOfBirth, Gender, Height, AvatarUrl, Language,
            AssignedGPId, AccessCode,
            CreatedAt, UpdatedAt
        ) VALUES (
            @id, @email, @passwordHash, @name, @role,
            @dateOfBirth, @gender, @height, @avatarUrl, @language,
            @assignedGPId, @accessCode,
            GETUTCDATE(), GETUTCDATE()
        )`,
        {
            id: userId,
            email,
            passwordHash,
            name,
            role,
            dateOfBirth: dateOfBirth || null,
            gender: gender || null,
            height: height || null,
            avatarUrl: photoDataUrl || null,
            language,
            assignedGPId: gpId,
            accessCode: accessCode || null
        }
    );
    
    // If weight is provided, add initial weight measurement
    if (weight && role === 'patient') {
        const measurementId = uuidv4();
        await executeQuery(
            `INSERT INTO Measurements (Id, UserId, Type, Value, Timestamp)
             VALUES (@id, @userId, 'weight', @value, GETUTCDATE())`,
            {
                id: measurementId,
                userId,
                value: weight
            }
        );
        
        // Also save initial BMI if height is provided
        if (height) {
            const bmi = weight / ((height / 100) * (height / 100));
            await executeQuery(
                `INSERT INTO InitialBMI (Id, UserId, BMI, Category, Timestamp)
                 VALUES (@id, @userId, @bmi, @category, GETUTCDATE())`,
                {
                    id: uuidv4(),
                    userId,
                    bmi,
                    category: bmi < 18.5 ? 'underweight' : bmi < 25 ? 'healthy' : bmi < 30 ? 'overweight' : 'obese'
                }
            );
        }
    }
    
    // Mark access code as used (for patients)
    if (role === 'patient' && accessCode) {
        await executeQuery(
            `UPDATE AccessCodes SET IsUsed = 1, UsedBy = @userId, UsedAt = GETUTCDATE()
             WHERE Code = @code`,
            { userId, code: accessCode }
        );
    }
    
    // Generate token
    const token = generateToken({
        userId,
        email,
        role,
        name
    });
    
    res.status(201).json({
        success: true,
        data: {
            user: {
                id: userId,
                email,
                name,
                role,
                dateOfBirth,
                gender,
                height,
                language,
                hasPhoto: !!photoDataUrl
            },
            token
        }
    });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const result = await executeQuery(
        'SELECT * FROM Users WHERE Email = @email',
        { email }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    
    const user = result.recordset[0];
    
    // Verify password (SQL Server returns PascalCase column names)
    const isValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    
    // Generate token
    const token = generateToken({
        userId: user.Id,
        email: user.Email,
        role: user.Role,
        name: user.Name
    });
    
    res.json({
        success: true,
        data: {
            user: {
                id: user.Id,
                email: user.Email,
                name: user.Name,
                role: user.Role,
                dateOfBirth: user.DateOfBirth,
                gender: user.Gender,
                height: user.Height,
                language: user.Language,
                avatarUrl: user.AvatarUrl,
                points: user.Points,
                currentStreak: user.CurrentStreak
            },
            token
        }
    });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = asyncHandler(async (req, res) => {
    const result = await executeQuery(
        `SELECT Id, Email, Name, Role, DateOfBirth, Gender, Height, Language, 
                AvatarUrl, Points, CurrentStreak, CreatedAt 
         FROM Users WHERE Id = @id`,
        { id: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    const user = result.recordset[0];
    res.json({
        success: true,
        data: {
            id: user.Id,
            email: user.Email,
            name: user.Name,
            role: user.Role,
            dateOfBirth: user.DateOfBirth,
            gender: user.Gender,
            height: user.Height,
            language: user.Language,
            avatarUrl: user.AvatarUrl,
            points: user.Points,
            currentStreak: user.CurrentStreak,
            createdAt: user.CreatedAt
        }
    });
});

/**
 * Update user profile
 * PUT /api/auth/me
 */
const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    await executeQuery(
        `UPDATE Users SET Name = @name, UpdatedAt = GETUTCDATE()
         WHERE Id = @id`,
        { id: req.user.userId, name }
    );
    
    res.json({
        success: true,
        message: 'Profile updated successfully'
    });
});

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    // Get current user
    const result = await executeQuery(
        'SELECT PasswordHash FROM Users WHERE Id = @id',
        { id: req.user.userId }
    );
    
    if (result.recordset.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.recordset[0].PasswordHash);
    if (!isValid) {
        throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await executeQuery(
        `UPDATE Users SET PasswordHash = @passwordHash, UpdatedAt = GETUTCDATE()
         WHERE Id = @id`,
        { id: req.user.userId, passwordHash }
    );
    
    res.json({
        success: true,
        message: 'Password changed successfully'
    });
});

/**
 * Generate access codes (GP only)
 * POST /api/auth/access-codes
 */
const generateAccessCodes = asyncHandler(async (req, res) => {
    const { count = 1 } = req.body;
    
    if (count < 1 || count > 100) {
        throw new AppError('Count must be between 1 and 100', 400, 'INVALID_COUNT');
    }
    
    const codes = [];
    
    for (let i = 0; i < count; i++) {
        const code = uuidv4().substring(0, 8).toUpperCase();
        const codeId = uuidv4();
        
        await executeQuery(
            `INSERT INTO AccessCodes (Id, Code, GPId, CreatedAt, IsUsed)
             VALUES (@id, @code, @gpId, GETUTCDATE(), 0)`,
            {
                id: codeId,
                code,
                gpId: req.user.userId
            }
        );
        
        codes.push(code);
    }
    
    res.status(201).json({
        success: true,
        data: { codes }
    });
});

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    generateAccessCodes
};
