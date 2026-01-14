# EMAAT Backend

Node.js + Express.js backend serving both the EMAAT Patient App and GP Dashboard.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Microsoft SQL Server (SSMS)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Project Structure

```
emaat-backend/
├── src/
│   ├── index.js              # Main entry point
│   ├── database/
│   │   ├── db.js             # Database connection pool
│   │   ├── init.js           # Database initialization script
│   │   └── schema.sql        # SQL Server schema
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handling
│   │   └── validate.js       # Request validation
│   ├── controllers/
│   │   ├── authController.js        # Authentication
│   │   ├── measurementsController.js # Health measurements
│   │   ├── challengesController.js   # 21-day challenges
│   │   ├── goalsController.js        # Personal goals
│   │   ├── surveysController.js      # Questionnaires
│   │   ├── journalsController.js     # Daily journals
│   │   ├── lifeStepsController.js    # Activity tracking
│   │   ├── remindersController.js    # Reminders
│   │   ├── pointsController.js       # Gamification
│   │   └── gpController.js           # GP dashboard
│   └── routes/
│       ├── authRoutes.js     # /api/auth/*
│       ├── patientRoutes.js  # /api/patient/*
│       └── gpRoutes.js       # /api/gp/*
├── .env                      # Environment variables
├── .env.example              # Environment template
└── package.json
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create database**:
   - Open SQL Server Management Studio
   - Run the script in `src/database/schema.sql`

4. **Start server**:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| JWT_SECRET | Secret key for JWT tokens | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| DB_SERVER | SQL Server hostname | localhost |
| DB_DATABASE | Database name | eMaatDB |
| DB_USER | Database user | sa |
| DB_PASSWORD | Database password | - |
| DB_PORT | Database port | 1433 |
| CORS_ORIGIN | Allowed CORS origins | * |

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /register | Register new user | No |
| POST | /login | Login | No |
| GET | /me | Get profile | Yes |
| PUT | /me | Update profile | Yes |
| PUT | /change-password | Change password | Yes |
| POST | /access-codes | Generate access codes | GP |

### Patient API (`/api/patient`)

All endpoints require authentication with patient role.

#### Measurements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /measurements | Get all measurements |
| GET | /measurements/latest | Get latest of each type |
| POST | /measurements | Add measurement |
| PUT | /measurements/:id | Update measurement |
| DELETE | /measurements/:id | Delete measurement |
| GET | /measurements/initial-bmi | Get initial BMI |
| POST | /measurements/initial-bmi | Set initial BMI |

**Measurement Types**: weight, waist, bloodPressure, bloodGlucose, cholesterol, kidneyFunction, hba1c, smoking

#### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /challenges | Get all challenges |
| GET | /challenges/stats | Get challenge statistics |
| GET | /challenges/:id | Get challenge details |
| POST | /challenges | Start a challenge |
| POST | /challenges/:id/complete-day | Complete daily activity |
| POST | /challenges/:id/cancel | Cancel challenge |

**Challenge Types**: sleep, stress, movement, social, nutrition, smoking (21 days each)

#### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /goals | Get all goals |
| GET | /goals/:id | Get goal details |
| POST | /goals | Create goal |
| PUT | /goals/:id | Update goal |
| DELETE | /goals/:id | Delete goal |
| POST | /goals/:id/progress | Log progress |

**Goal Types**: dailyWalking, movingBreaks, sport, strength, timeOutside, regularSleep, screenOff, calmTime, fruitVeg, water, realFood, alcohol, social, hobby, reading, socialContact, smoking, weight

#### Surveys
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /surveys | Get all survey results |
| GET | /surveys/latest | Get latest of each type |
| GET | /surveys/history/:type | Get history for type |
| GET | /surveys/:id | Get survey result |
| POST | /surveys | Submit survey |
| DELETE | /surveys/:id | Delete survey result |

**Survey Types**: phq9, gad7, psqi, pss10, ipaq, maq, dtsq, paid, wbq12, euroqol, sf12, mna, audit, fagerstrom

#### Journals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /journals | Get journal entries |
| GET | /journals/active | Get active journal types |
| GET | /journals/:id | Get entry |
| POST | /journals | Create entry |
| PUT | /journals/:id | Update entry |
| DELETE | /journals/:id | Delete entry |
| POST | /journals/activate | Activate journal type |
| POST | /journals/deactivate | Deactivate journal type |

**Journal Types**: food, activity, mood, sleep, stress, gratitude

#### Life Steps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /life-steps | Get daily steps |
| GET | /life-steps/summary/weekly | Weekly summary |
| GET | /life-steps/summary/monthly | Monthly summary |
| GET | /life-steps/:date | Get steps for date |
| POST | /life-steps | Log steps |

#### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /reminders | Get all reminders |
| GET | /reminders/:id | Get reminder |
| POST | /reminders | Create reminder |
| PUT | /reminders/:id | Update reminder |
| POST | /reminders/:id/toggle | Toggle active |
| DELETE | /reminders/:id | Delete reminder |

#### Points & Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /points | Get total points |
| GET | /points/pillars | Get points by pillar |
| GET | /points/history | Get points history |
| GET | /points/streak | Get current streak |
| POST | /points/pillar | Add pillar points |
| GET | /community-goals | Get community goals |

### GP Dashboard API (`/api/gp`)

All endpoints require authentication with GP role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /stats | Dashboard statistics |
| GET | /patients | List patients |
| GET | /patients/:id | Patient detail |
| GET | /patients/:id/health-domains | Health domain summary |
| GET | /patients/:id/measurements | Patient measurements |
| GET | /patients/:id/challenges | Patient challenges |
| GET | /patients/:id/challenges/:cid | Challenge detail |
| POST | /patients/:id/challenges | Prescribe challenge |
| GET | /patients/:id/surveys | Patient surveys |
| GET | /patients/:id/goals | Patient goals |
| GET | /patients/:id/life-steps | Patient activity |
| GET | /patients/:id/journals | Patient journals |

## Default Users

After running the schema, a default GP user is created:
- **Email**: gp@emaat.nl
- **Password**: admin123

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <token>
```

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Development

```bash
# Run with auto-reload
npm run dev

# Run tests
npm test
```

## License

Proprietary - EMAAT Project
