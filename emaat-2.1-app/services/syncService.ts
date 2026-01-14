/**
 * Sync Service for Patient App
 * Handles syncing local data to the backend
 */

import { apiService } from './apiService';
import { Measurement, LifeStep, Goals, ChallengeId, SurveyResult, JournalEntry, Reminder } from '../types';

interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    errors: string[];
}

class SyncService {
    private syncInProgress = false;
    private syncQueue: Array<{ type: string; data: any; retries: number }> = [];
    private maxRetries = 3;

    /**
     * Check if user is authenticated for sync
     */
    isReadyToSync(): boolean {
        return apiService.isAuthenticated();
    }

    /**
     * Sync a single measurement to the backend
     */
    async syncMeasurement(measurement: Measurement): Promise<boolean> {
        if (!this.isReadyToSync()) {
            console.log('Sync skipped: Not authenticated');
            return false;
        }

        try {
            // Map frontend measurement to backend format
            const backendMeasurement = this.mapMeasurementToBackend(measurement);
            
            const result = await apiService.addMeasurement(backendMeasurement);
            
            if (result.success) {
                console.log(`Measurement synced: ${measurement.type}`);
                return true;
            } else {
                console.error(`Failed to sync measurement: ${result.error}`);
                // Add to retry queue
                this.addToQueue('measurement', measurement);
                return false;
            }
        } catch (error) {
            console.error('Sync error:', error);
            this.addToQueue('measurement', measurement);
            return false;
        }
    }

    /**
     * Map frontend measurement format to backend format
     */
    private mapMeasurementToBackend(measurement: Measurement): any {
        const base = {
            type: measurement.type,
            timestamp: measurement.timestamp instanceof Date 
                ? measurement.timestamp.toISOString() 
                : measurement.timestamp,
            memoryPhotoKey: measurement.memory?.photoUrl || null,
            memoryContent: null,
            isPrivate: measurement.memory?.isPrivate || false
        };

        switch (measurement.type) {
            case 'weight':
                return { ...base, value: (measurement as any).value };
            case 'bloodPressure':
                return {
                    ...base,
                    systolic: (measurement as any).systolic,
                    diastolic: (measurement as any).diastolic
                };
            case 'bloodGlucose':
                return {
                    ...base,
                    value: (measurement as any).value,
                    timing: (measurement as any).timing || null
                };
            case 'heartRate':
                return {
                    ...base,
                    value: (measurement as any).value,
                    condition: (measurement as any).condition || 'resting'
                };
            case 'steps':
                return { ...base, value: (measurement as any).value };
            case 'temperature':
                return { ...base, value: (measurement as any).value };
            case 'oxygenSaturation':
                return { ...base, value: (measurement as any).value };
            case 'sleepDuration':
                return {
                    ...base,
                    hours: (measurement as any).hours,
                    minutes: (measurement as any).minutes
                };
            case 'smoke':
                return { ...base, value: (measurement as any).value || 1 };
            default:
                return { ...base, value: (measurement as any).value };
        }
    }

    /**
     * Sync a life step (activity) to the backend
     */
    async syncLifeStep(step: LifeStep): Promise<boolean> {
        if (!this.isReadyToSync()) {
            return false;
        }

        try {
            const result = await apiService.addLifeStep({
                activityId: step.activity.id,
                activityName: step.activity.name,
                pillar: step.activity.pillar,
                timestamp: step.timestamp.toISOString(),
                points: step.pointsAfter - step.pointsBefore,
                nudge: step.nudge,
                memoryPhotoKey: step.memory?.photoUrl || null,
                memoryContent: step.memory?.content || null,
                memoryIsPrivate: step.memory?.isPrivate || false
            });

            return result.success;
        } catch (error) {
            console.error('Failed to sync life step:', error);
            this.addToQueue('lifeStep', step);
            return false;
        }
    }

    /**
     * Sync goals to the backend
     */
    async syncGoals(goals: Goals): Promise<boolean> {
        if (!this.isReadyToSync()) {
            return false;
        }

        try {
            // Sync each active goal
            for (const [key, goal] of Object.entries(goals)) {
                if (goal && goal.isActive) {
                    await apiService.setGoal({
                        goalKey: key,
                        ...goal
                    });
                }
            }
            return true;
        } catch (error) {
            console.error('Failed to sync goals:', error);
            return false;
        }
    }

    /**
     * Sync challenge progress to the backend
     */
    async syncChallengeProgress(challengeId: ChallengeId, activityId: string, data: any): Promise<boolean> {
        if (!this.isReadyToSync()) {
            return false;
        }

        try {
            const result = await apiService.updateChallengeProgress(challengeId, {
                activityId,
                data,
                completedAt: new Date().toISOString()
            });

            return result.success;
        } catch (error) {
            console.error('Failed to sync challenge progress:', error);
            this.addToQueue('challengeProgress', { challengeId, activityId, data });
            return false;
        }
    }

    /**
     * Sync a survey result to the backend
     */
    async syncSurveyResult(survey: any): Promise<boolean> {
        if (!this.isReadyToSync()) {
            console.log('Sync skipped: Not authenticated');
            return false;
        }

        try {
            const result = await apiService.submitSurvey({
                surveyId: survey.surveyId,
                answers: survey.answers,
                scores: survey.scores,
                interpretation: survey.interpretation,
                timestamp: survey.timestamp instanceof Date 
                    ? survey.timestamp.toISOString() 
                    : survey.timestamp
            });

            if (result.success) {
                console.log(`Survey synced: ${survey.surveyId}`);
                return true;
            } else {
                console.error(`Failed to sync survey: ${result.error}`);
                this.addToQueue('survey', survey);
                return false;
            }
        } catch (error) {
            console.error('Sync error:', error);
            this.addToQueue('survey', survey);
            return false;
        }
    }

    /**
     * Sync a journal entry to the backend
     */
    async syncJournalEntry(entry: any): Promise<boolean> {
        if (!this.isReadyToSync()) {
            console.log('Sync skipped: Not authenticated');
            return false;
        }

        try {
            const result = await apiService.addJournalEntry({
                type: entry.journalId,
                content: entry.data,
                timestamp: entry.timestamp instanceof Date 
                    ? entry.timestamp.toISOString() 
                    : entry.timestamp,
                memoryPhotoKey: entry.memory?.photoUrl || null,
                memoryContent: entry.memory?.content || null,
                memoryIsPrivate: entry.memory?.isPrivate || false
            });

            if (result.success) {
                console.log(`Journal entry synced: ${entry.journalId}`);
                return true;
            } else {
                console.error(`Failed to sync journal entry: ${result.error}`);
                this.addToQueue('journal', entry);
                return false;
            }
        } catch (error) {
            console.error('Sync error:', error);
            this.addToQueue('journal', entry);
            return false;
        }
    }

    /**
     * Sync points to the backend
     */
    async syncPoints(points: number, pillarPoints: Record<string, number>, reason: string = 'sync'): Promise<boolean> {
        if (!this.isReadyToSync()) {
            return false;
        }

        try {
            const result = await apiService.addPoints({
                points,
                reason
            });

            return result.success;
        } catch (error) {
            console.error('Failed to sync points:', error);
            return false;
        }
    }

    /**
     * Sync a challenge activity completion to the backend
     */
    async syncChallengeActivityComplete(dbChallengeId: string, dayNumber: number, data: any): Promise<boolean> {
        if (!this.isReadyToSync()) {
            return false;
        }

        try {
            const result = await apiService.updateChallengeProgress(dbChallengeId, {
                dayNumber,
                ...data,
                completedAt: new Date().toISOString()
            });

            if (result.success) {
                console.log(`Challenge activity synced: day ${dayNumber}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to sync challenge activity:', error);
            this.addToQueue('challengeActivity', { dbChallengeId, dayNumber, data });
            return false;
        }
    }

    /**
     * Add item to retry queue
     */
    private addToQueue(type: string, data: any): void {
        this.syncQueue.push({ type, data, retries: 0 });
    }

    /**
     * Process retry queue
     */
    async processQueue(): Promise<SyncResult> {
        if (this.syncInProgress || !this.isReadyToSync()) {
            return { success: false, synced: 0, failed: 0, errors: ['Sync in progress or not authenticated'] };
        }

        this.syncInProgress = true;
        let synced = 0;
        let failed = 0;
        const errors: string[] = [];
        const remainingQueue: typeof this.syncQueue = [];

        for (const item of this.syncQueue) {
            try {
                let success = false;

                switch (item.type) {
                    case 'measurement':
                        success = await this.syncMeasurement(item.data);
                        break;
                    case 'lifeStep':
                        success = await this.syncLifeStep(item.data);
                        break;
                    case 'challengeProgress':
                        success = await this.syncChallengeProgress(
                            item.data.challengeId,
                            item.data.activityId,
                            item.data.data
                        );
                        break;
                    case 'survey':
                        success = await this.syncSurveyResult(item.data);
                        break;
                    case 'journal':
                        success = await this.syncJournalEntry(item.data);
                        break;
                    case 'challengeActivity':
                        success = await this.syncChallengeActivityComplete(
                            item.data.dbChallengeId,
                            item.data.dayNumber,
                            item.data.data
                        );
                        break;
                }

                if (success) {
                    synced++;
                } else {
                    item.retries++;
                    if (item.retries < this.maxRetries) {
                        remainingQueue.push(item);
                    } else {
                        failed++;
                        errors.push(`Failed to sync ${item.type} after ${this.maxRetries} retries`);
                    }
                }
            } catch (error) {
                item.retries++;
                if (item.retries < this.maxRetries) {
                    remainingQueue.push(item);
                } else {
                    failed++;
                    errors.push(`Error syncing ${item.type}: ${error}`);
                }
            }
        }

        this.syncQueue = remainingQueue;
        this.syncInProgress = false;

        return { success: failed === 0, synced, failed, errors };
    }

    /**
     * Full sync - sync all local data to backend
     */
    async fullSync(measurements: Measurement[], lifeSteps: LifeStep[], goals: Goals): Promise<SyncResult> {
        if (!this.isReadyToSync()) {
            return { success: false, synced: 0, failed: 0, errors: ['Not authenticated'] };
        }

        let synced = 0;
        let failed = 0;
        const errors: string[] = [];

        // Sync measurements
        for (const measurement of measurements) {
            const success = await this.syncMeasurement(measurement);
            if (success) synced++;
            else failed++;
        }

        // Sync life steps
        for (const step of lifeSteps) {
            const success = await this.syncLifeStep(step);
            if (success) synced++;
            else failed++;
        }

        // Sync goals
        const goalsSuccess = await this.syncGoals(goals);
        if (goalsSuccess) synced++;
        else failed++;

        return { success: failed === 0, synced, failed, errors };
    }

    /**
     * Get queue status
     */
    getQueueStatus(): { pending: number; inProgress: boolean } {
        return {
            pending: this.syncQueue.length,
            inProgress: this.syncInProgress
        };
    }
}

export const syncService = new SyncService();
export default syncService;
