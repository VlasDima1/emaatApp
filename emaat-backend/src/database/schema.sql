-- =====================================================
-- eMaat Database Schema for SQL Server
-- Supports both Patient App and GP Dashboard
-- =====================================================

-- Create Database
IF NOT EXISTS (SELECT *
FROM sys.databases
WHERE name = 'eMaatDB')
BEGIN
    CREATE DATABASE eMaatDB;
END
GO

USE eMaatDB;
GO

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users Table (both patients and GPs)
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Users' AND xtype='U')
CREATE TABLE Users
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('patient', 'gp')),

    -- Common fields
    Name NVARCHAR(255) NOT NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(20) NULL CHECK (Gender IN ('male', 'female', 'unspecified')),

    -- Patient-specific fields
    Height INT NULL,
    -- cm
    Phone NVARCHAR(50) NULL,
    Address NVARCHAR(500) NULL,
    AvatarUrl NVARCHAR(MAX) NULL,
    -- Base64 or URL
    Language NVARCHAR(10) DEFAULT 'nl',

    -- Gamification (patients only)
    Points INT DEFAULT 0,
    CurrentStreak INT DEFAULT 0,
    LastActivityDate DATE NULL,

    -- Settings
    IsAvatarUpdatesEnabled BIT DEFAULT 1,
    IsSpeechEnabled BIT DEFAULT 1,
    AllHabitsUnlocked BIT DEFAULT 1,

    -- GP assignment (for patients)
    AssignedGPId UNIQUEIDENTIFIER NULL,

    -- Access code for patient registration
    AccessCode NVARCHAR(50) NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (AssignedGPId) REFERENCES Users(Id)
);
GO

-- Create index on Role for filtering
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_AssignedGPId ON Users(AssignedGPId);
GO

-- =====================================================
-- PILLAR POINTS (Patient gamification per lifestyle pillar)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='PillarPoints' AND xtype='U')
CREATE TABLE PillarPoints
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Pillar NVARCHAR(50) NOT NULL CHECK (Pillar IN ('sleep', 'nutrition', 'social', 'stress_reduction', 'exercise')),
    Points INT DEFAULT 0,

    UNIQUE (UserId, Pillar),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- Activity Points (points per activity type)
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='ActivityPoints' AND xtype='U')
CREATE TABLE ActivityPoints
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ActivityId NVARCHAR(50) NOT NULL,
    -- 'exercise', 'nature', 'meal', 'social', 'hobby', 'read', 'relax', 'sleep', 'smoke'
    Points INT DEFAULT 0,

    UNIQUE (UserId, ActivityId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- MEASUREMENTS (Vitality data from patient app)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Measurements' AND xtype='U')
CREATE TABLE Measurements
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(50) NOT NULL CHECK (Type IN ('heartRate', 'bloodPressure', 'bloodGlucose', 'steps', 'weight', 'temperature', 'oxygenSaturation', 'sleepDuration', 'smoke')),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Type-specific values
    Value DECIMAL(10,2) NULL,
    -- Generic value (heart rate, steps, weight, temp, o2, smoke count)
    Systolic INT NULL,
    -- For blood pressure
    Diastolic INT NULL,
    -- For blood pressure
    Hours INT NULL,
    -- For sleep duration
    Minutes INT NULL,
    -- For sleep duration

    -- Additional metadata
    Condition NVARCHAR(20) NULL,
    -- For heart rate: 'resting', 'active', 'other'
    Timing NVARCHAR(10) NULL,
    -- For blood glucose: 'N', 'NO', 'VM', 'NM', 'VA', 'NA', 'VS'

    -- Memory attachment
    MemoryPhotoKey NVARCHAR(255) NULL,
    MemoryContent NVARCHAR(MAX) NULL,
    IsPrivate BIT DEFAULT 0,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Measurements_UserId ON Measurements(UserId);
CREATE INDEX IX_Measurements_Type ON Measurements(Type);
CREATE INDEX IX_Measurements_Timestamp ON Measurements(Timestamp);
GO

-- =====================================================
-- GOALS (Patient lifestyle goals)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Goals' AND xtype='U')
CREATE TABLE Goals
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    GoalKey NVARCHAR(50) NOT NULL,
    -- 'dailyWalking', 'regularSleep', 'weight', etc.
    GoalData NVARCHAR(MAX) NOT NULL,
    -- JSON object with goal-specific fields
    IsActive BIT DEFAULT 1,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    UNIQUE (UserId, GoalKey),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- CHALLENGES (Lifestyle programs)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Challenges' AND xtype='U')
CREATE TABLE Challenges
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ChallengeId NVARCHAR(50) NOT NULL CHECK (ChallengeId IN ('sleepChallenge', 'beweegChallenge', 'voedingChallenge', 'stopRokenChallenge', 'socialChallenge', 'stressChallenge')),
    Status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (Status IN ('active', 'completed', 'stopped')),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Progress INT DEFAULT 0,
    -- 0-100

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Challenges_UserId ON Challenges(UserId);
CREATE INDEX IX_Challenges_Status ON Challenges(Status);
GO

-- Challenge Activities (individual daily tasks)
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='ChallengeActivities' AND xtype='U')
CREATE TABLE ChallengeActivities
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ChallengeId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,

    Day INT NOT NULL,
    -- 1-15
    Type NVARCHAR(50) NOT NULL,
    -- 'introduction', 'morningCheckin', 'braintainment', 'eveningCheckin', etc.
    ScheduledAt DATETIME2 NOT NULL,
    Status NVARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'completed')),
    CompletedAt DATETIME2 NULL,

    -- Activity-specific data (JSON)
    Data NVARCHAR(MAX) NULL,

    -- Memory attachment
    MemoryPhotoKey NVARCHAR(255) NULL,
    MemoryContent NVARCHAR(MAX) NULL,
    IsPrivate BIT DEFAULT 0,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (ChallengeId) REFERENCES Challenges(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO

CREATE INDEX IX_ChallengeActivities_ChallengeId ON ChallengeActivities(ChallengeId);
CREATE INDEX IX_ChallengeActivities_UserId ON ChallengeActivities(UserId);
CREATE INDEX IX_ChallengeActivities_ScheduledAt ON ChallengeActivities(ScheduledAt);
GO

-- =====================================================
-- LIFE STEPS (Activity log / timeline entries)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='LifeSteps' AND xtype='U')
CREATE TABLE LifeSteps
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,

    ActivityId NVARCHAR(50) NOT NULL,
    -- 'exercise', 'nature', 'meal', etc.
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Nudge/tip text
    Nudge NVARCHAR(MAX) NULL,

    -- Points tracking
    PointsBefore INT NOT NULL,
    PointsAfter INT NOT NULL,
    PointsDoubled BIT DEFAULT 0,

    -- Avatar snapshots (keys to assets)
    AvatarBeforeKey NVARCHAR(255) NULL,
    AvatarAfterKey NVARCHAR(255) NULL,

    -- Audio data key
    AudioDataKey NVARCHAR(255) NULL,

    -- Memory attachment
    MemoryPhotoKey NVARCHAR(255) NULL,
    MemoryContent NVARCHAR(MAX) NULL,
    MemoryWalkingData NVARCHAR(MAX) NULL,
    -- JSON: {unit, value}
    MemoryDurationData NVARCHAR(MAX) NULL,
    -- JSON: {hours, minutes}
    MemoryMealData NVARCHAR(MAX) NULL,
    -- JSON: {type, description}
    MemorySocialData NVARCHAR(MAX) NULL,
    -- JSON: {description}
    IsPrivate BIT DEFAULT 0,

    -- Badge earned
    EarnedBadgeActivityId NVARCHAR(50) NULL,
    EarnedBadgeTier NVARCHAR(20) NULL,

    -- Challenge reference (if from a challenge activity)
    ChallengeActivityId UNIQUEIDENTIFIER NULL,
    ChallengeId NVARCHAR(50) NULL,
    ChallengeActivityType NVARCHAR(50) NULL,
    OverrideTitle NVARCHAR(255) NULL,
    Subtitle NVARCHAR(255) NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ChallengeActivityId) REFERENCES ChallengeActivities(Id)
);
GO

CREATE INDEX IX_LifeSteps_UserId ON LifeSteps(UserId);
CREATE INDEX IX_LifeSteps_Timestamp ON LifeSteps(Timestamp);
GO

-- =====================================================
-- SURVEYS / QUESTIONNAIRES
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='SurveyResults' AND xtype='U')
CREATE TABLE SurveyResults
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SurveyId NVARCHAR(50) NOT NULL,
    -- 'fourDKL', 'phq9', 'gad7', etc.
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Answers stored as JSON
    Answers NVARCHAR(MAX) NOT NULL,
    -- JSON object: {questionKey: answerTextKey}

    -- Scores stored as JSON
    Scores NVARCHAR(MAX) NOT NULL,
    -- JSON object: {dimension: score}

    -- Interpretation stored as JSON
    Interpretation NVARCHAR(MAX) NOT NULL,
    -- JSON object: {dimension: 'low'|'moderate'|'high'}

    -- Computed fields for easy querying
    TotalScore INT NULL,
    MaxScore INT NULL,
    ResultLabel NVARCHAR(50) NULL,
    -- 'Laag risico', 'Matig risico', 'Verhoogd risico'

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_SurveyResults_UserId ON SurveyResults(UserId);
CREATE INDEX IX_SurveyResults_SurveyId ON SurveyResults(SurveyId);
GO

-- =====================================================
-- JOURNALS (Symptom diaries)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='JournalEntries' AND xtype='U')
CREATE TABLE JournalEntries
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    JournalId NVARCHAR(50) NOT NULL,
    -- 'klachtenDagboek', 'hoofdpijnDagboek', etc.
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Entry data as JSON
    Data NVARCHAR(MAX) NOT NULL,

    -- Memory attachment
    MemoryPhotoKey NVARCHAR(255) NULL,
    MemoryContent NVARCHAR(MAX) NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- Active Journal tracking
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='ActiveJournals' AND xtype='U')
CREATE TABLE ActiveJournals
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    JournalId NVARCHAR(50) NOT NULL,
    StartedAt DATETIME2 DEFAULT GETUTCDATE(),

    UNIQUE (UserId, JournalId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- REMINDERS
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Reminders' AND xtype='U')
CREATE TABLE Reminders
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ActivityId NVARCHAR(50) NOT NULL,
    PredictedAt DATETIME2 NOT NULL,
    VisibleAt DATETIME2 NOT NULL,
    IsCompleted BIT DEFAULT 0,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Reminders_UserId ON Reminders(UserId);
CREATE INDEX IX_Reminders_PredictedAt ON Reminders(PredictedAt);
GO

-- =====================================================
-- COMMUNITY GOALS
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='CommunityGoals' AND xtype='U')
CREATE TABLE CommunityGoals
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    TitleKey NVARCHAR(255) NOT NULL,
    Target INT NOT NULL,
    CurrentProgress INT DEFAULT 0,
    Participants INT DEFAULT 23,
    UnitKey NVARCHAR(100) NOT NULL,
    RewardBadgeId NVARCHAR(50) NOT NULL,
    RelatedChallengeId NVARCHAR(50) NULL,

    -- Last earned badge from community goal
    LastEarnedBadgeActivityId NVARCHAR(50) NULL,
    LastEarnedBadgeTier NVARCHAR(20) NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- ASSETS (Binary storage for avatars, photos, audio)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='Assets' AND xtype='U')
CREATE TABLE Assets
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    AssetKey NVARCHAR(255) NOT NULL,
    AssetData NVARCHAR(MAX) NOT NULL,
    -- Base64 encoded
    MimeType NVARCHAR(100) NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    UNIQUE (UserId, AssetKey),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Assets_AssetKey ON Assets(AssetKey);
GO

-- =====================================================
-- INITIAL BMI (Captured during onboarding)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='InitialBMI' AND xtype='U')
CREATE TABLE InitialBMI
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    BMI DECIMAL(5,2) NOT NULL,
    Category NVARCHAR(20) NOT NULL CHECK (Category IN ('underweight', 'healthy', 'overweight', 'obese')),
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- GP DASHBOARD SPECIFIC: Challenge Progress View
-- (Denormalized view for dashboard performance)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='GP_ChallengeProgress' AND xtype='U')
CREATE TABLE GP_ChallengeProgress
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Domain NVARCHAR(50) NOT NULL,
    -- 'Slaap', 'Beweeg', etc.
    StartDate DATE NULL,
    EndDate DATE NULL,
    Progress INT DEFAULT 0,
    -- 0-100

    -- Daily data as JSON array (14 days)
    DailyData NVARCHAR(MAX) NULL,

    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    UNIQUE (UserId, Domain),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- =====================================================
-- ACCESS CODES (For patient registration)
-- =====================================================
IF NOT EXISTS (SELECT *
FROM sysobjects
WHERE name='AccessCodes' AND xtype='U')
CREATE TABLE AccessCodes
(
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(50) NOT NULL UNIQUE,
    GPId UNIQUEIDENTIFIER NOT NULL,
    IsUsed BIT DEFAULT 0,
    UsedBy UNIQUEIDENTIFIER NULL,
    UsedAt DATETIME2 NULL,
    ExpiresAt DATETIME2 NULL,

    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (GPId) REFERENCES Users(Id),
    FOREIGN KEY (UsedBy) REFERENCES Users(Id)
);
GO

PRINT 'eMaat Database schema created successfully!';
GO
