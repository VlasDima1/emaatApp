

import React, { FC, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    ChallengeState, Goals, MorningCheckinData, EveningCheckinData, MovementEveningCheckinData,
    Measurement, BloodPressureMeasurement, WeightMeasurement, StepsMeasurement, SleepDurationMeasurement,
    BloodGlucoseMeasurement, TemperatureMeasurement, OxygenSaturationMeasurement, SurveyResult, SurveyId,
    ChallengeActivity, ChallengeId, HeartRateMeasurement, RegularSleepGoal
} from '../../types';
import { BarChart } from '../BarChart';
import LineChart from '../LineChart';
import BloodGlucoseTable from '../BloodGlucoseTable';
import SurveyChart from '../SurveyChart';

interface StatsScreenProps {
    challenge?: ChallengeState;
    challengeHistory: ChallengeActivity[];
    goals: Goals;
    measurements: Measurement[];
    surveys: SurveyResult[];
}

const StatsScreen: FC<StatsScreenProps> = ({ challenge, challengeHistory, goals, measurements, surveys }) => {
    const { t, language } = useLanguage();

    const chartData = useMemo(() => {
        const hasAnyData = challenge || challengeHistory.length > 0 || measurements.length > 0 || surveys.length > 0;
        if (!hasAnyData) return null;

        const sleepChartData = {
            durationData: [] as { label: string, value: number }[],
            qualityData: [] as { label: string, value: number }[],
            habitsData: [] as { label: string, value: number }[],
            missedData: [] as { label: string, value: number }[],
        };
        
        const movementChartData = {
            stepsData: [] as { label: string, value: number }[],
        };

        // --- Process COMPLETED activities from ALL sources ---
        const allCompletedActivities = [
            ...(challenge?.activities.filter(a => a.status === 'completed') || []),
            ...challengeHistory,
        ];
        const uniqueCompletedActivities = Array.from(new Map(allCompletedActivities.map(item => [item.id, item])).values());

        const completedActivitiesByChallengeId = uniqueCompletedActivities.reduce((acc, act) => {
            if (!acc[act.challengeId]) {
                acc[act.challengeId] = [];
            }
            acc[act.challengeId].push(act);
            return acc;
        }, {} as Record<ChallengeId, ChallengeActivity[]>);


        // --- Process Sleep Challenge Stats ---
        if (completedActivitiesByChallengeId.sleepChallenge) {
            const dataByDay: { [day: number]: { duration?: number; quality?: number; habits?: number; } } = {};
            for (let i = 1; i <= 15; i++) { dataByDay[i] = {}; }

            completedActivitiesByChallengeId.sleepChallenge.forEach(act => {
                if (act.data) {
                    if (act.type === 'morningCheckin') {
                        const data = act.data as MorningCheckinData;
                        if (data.sleepDuration) {
                            dataByDay[act.day].duration = data.sleepDuration.hours + data.sleepDuration.minutes / 60;
                        }
                        if (data.sleepQuality) {
                           dataByDay[act.day].quality = data.sleepQuality;
                        }
                    }
                    if (act.type === 'eveningCheckin') {
                        dataByDay[act.day].habits = Object.values(act.data as EveningCheckinData).filter(v => v).length;
                    }
                }
            });
            
            Object.entries(dataByDay).forEach(([day, data]) => {
                if (data.duration !== undefined) sleepChartData.durationData.push({ label: t('statsScreen.day', { day }), value: data.duration });
                if (data.quality !== undefined) sleepChartData.qualityData.push({ label: t('statsScreen.day', { day }), value: data.quality });
                if (data.habits !== undefined) sleepChartData.habitsData.push({ label: t('statsScreen.day', { day }), value: data.habits });
            });
        }
        
        // --- Process MISSED activities from ACTIVE challenge only ---
        if (challenge?.id === 'sleepChallenge') {
            const missedByDay: { [day: number]: number } = {};
            for (let i = 1; i <= 15; i++) { missedByDay[i] = 0; }

            challenge.activities.forEach(act => {
                const isMissed = act.status === 'pending' && new Date() > new Date(act.scheduledAt);
                if (isMissed) {
                    missedByDay[act.day]++;
                }
            });

            Object.entries(missedByDay).forEach(([day, missedCount]) => {
                if (missedCount > 0) {
                    sleepChartData.missedData.push({ label: t('statsScreen.day', { day }), value: missedCount });
                }
            });
        }

        // --- Process Movement Challenge Stats ---
        if (completedActivitiesByChallengeId.beweegChallenge) {
             completedActivitiesByChallengeId.beweegChallenge.forEach(act => {
                if (act.type === 'eveningCheckin' && act.data) {
                    const data = act.data as MovementEveningCheckinData;
                    movementChartData.stepsData.push({ label: t('statsScreen.day', { day: act.day }), value: data.steps });
                }
            });
        }
        
        // Process measurements
        const bloodPressureData = measurements.filter(m => m.type === 'bloodPressure') as BloodPressureMeasurement[];
        const weightData = measurements.filter(m => m.type === 'weight') as WeightMeasurement[];
        const bloodGlucoseData = measurements.filter(m => m.type === 'bloodGlucose') as BloodGlucoseMeasurement[];
        const temperatureData = measurements.filter(m => m.type === 'temperature') as TemperatureMeasurement[];
        const oxygenSaturationData = measurements.filter(m => m.type === 'oxygenSaturation') as OxygenSaturationMeasurement[];
        const restingHeartRateData = measurements.filter(m => m.type === 'heartRate' && m.condition === 'resting') as HeartRateMeasurement[];
        
        const stepsByDate: { [date: string]: number } = {};
        (measurements.filter(m => m.type === 'steps') as StepsMeasurement[]).forEach(m => {
            const dateKey = m.timestamp.toISOString().split('T')[0];
            stepsByDate[dateKey] = (stepsByDate[dateKey] || 0) + m.value;
        });
        
        const sleepByDate: { [date: string]: number } = {};
        (measurements.filter(m => m.type === 'sleepDuration') as SleepDurationMeasurement[]).forEach(m => {
            const dateKey = m.timestamp.toISOString().split('T')[0];
            sleepByDate[dateKey] = m.hours + m.minutes / 60;
        });
        if (completedActivitiesByChallengeId.sleepChallenge) {
            completedActivitiesByChallengeId.sleepChallenge.forEach(act => {
                if (act.type === 'morningCheckin' && act.data) {
                    const checkinData = act.data as MorningCheckinData;
                    const dateKey = (act.completedAt || act.scheduledAt).toISOString().split('T')[0];
                    if (!sleepByDate[dateKey]) { 
                        sleepByDate[dateKey] = checkinData.sleepDuration.hours + checkinData.sleepDuration.minutes / 60;
                    }
                }
            });
        }

        const combinedLabels = [...new Set([...Object.keys(stepsByDate), ...Object.keys(sleepByDate)])].sort();
        const recentLabels = combinedLabels.slice(-14);

        const stepsData = recentLabels.map(date => ({
            label: new Date(date).toLocaleDateString(language, { day: 'numeric', month: 'numeric' }),
            value: stepsByDate[date] || 0
        }));
        const sleepData = recentLabels.map(date => ({
            label: new Date(date).toLocaleDateString(language, { day: 'numeric', month: 'numeric' }),
            value: sleepByDate[date] || 0
        }));

        // Process survey data
        const singleScoreSurveyIds: SurveyId[] = ['phq9', 'gad7', 'audit', 'cat', 'vasPain', 'gfi', 'fagerstrom', 'mmrc', 'pam13'];
        const singleScoreCharts = singleScoreSurveyIds.map(surveyId => {
            const surveyResults = surveys.filter(s => s.surveyId === surveyId).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
            if (surveyResults.length < 1) return null;
            return {
                id: surveyId,
                title: t(`surveys.${surveyId}.name`),
                data: surveyResults.map(s => ({
                    label: new Date(s.timestamp).toLocaleDateString(language, { day: 'numeric', month: 'numeric' }),
                    value: s.scores.score,
                }))
            };
        }).filter(Boolean);

        const createMultiDimChartData = (surveyId: SurveyId, dimensions: string[]) => {
            const surveyResults = surveys.filter(s => s.surveyId === surveyId).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
            if (surveyResults.length < 1) return null;

            const seriesData: Record<string, { x: string, y: number }[]> = {};
            dimensions.forEach(dim => seriesData[dim] = []);

            surveyResults.forEach(survey => {
                const xLabel = new Date(survey.timestamp).toLocaleDateString(language, { day: 'numeric', month: 'numeric' });
                for (const dim of dimensions) {
                     if (survey.scores[dim] !== undefined) {
                        seriesData[dim].push({ x: xLabel, y: survey.scores[dim] });
                    }
                }
            });
            
            const colors: Record<string, string> = {
                distress: 'stroke-rose-500', depression: 'stroke-sky-500', anxiety: 'stroke-amber-500', somatization: 'stroke-teal-500',
            };

            return {
                series: dimensions.map(dim => ({
                    label: t(`surveys.${surveyId}.dimensions.${dim}`),
                    data: seriesData[dim],
                    color: colors[dim] || 'stroke-gray-500',
                })),
            }
        };

        const fourDKLChartData = createMultiDimChartData('fourDKL', ['distress', 'depression', 'anxiety', 'somatization']);
        const hadsChartData = createMultiDimChartData('hads', ['anxiety', 'depression']);

        // FIX: Update the component to calculate sleep duration from the `regularSleep` goal's `bedtime` and `wakeTime` properties, as the `sleep` goal with a `duration` property no longer exists.
        const sleepDurationGoal = goals.regularSleep ? (() => {
            const [bedH, bedM] = goals.regularSleep.bedtime.split(':').map(Number);
            const [wakeH, wakeM] = goals.regularSleep.wakeTime.split(':').map(Number);
            let durationMinutes = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
            if (durationMinutes < 0) durationMinutes += 24 * 60;
            return durationMinutes / 60;
        })() : undefined;


        return { sleepChartData, movementChartData, bloodPressureData, weightData, bloodGlucoseData, stepsData, sleepData, temperatureData, oxygenSaturationData, restingHeartRateData, fourDKLChartData, hadsChartData, singleScoreCharts, sleepDurationGoal };

    }, [challenge, challengeHistory, goals, measurements, surveys, t, language]);
    
    const hasSleepData = chartData?.sleepChartData && (chartData.sleepChartData.durationData.length > 0 || chartData.sleepChartData.missedData.length > 0);

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">{t('statsScreen.title')}</h2>
            </header>
            <div className="max-w-2xl mx-auto">
                {!chartData ? (
                    <div className="text-center py-10 px-6 bg-white rounded-lg shadow">
                         <p className="text-gray-600 font-semibold text-lg">{t('statsScreen.noData')}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                       {hasSleepData && (
                           <>
                               <h3 className="text-xl font-bold text-brand-dark text-center">{t('statsScreen.sleepChallengeTitle')}</h3>
                                {chartData.sleepChartData.durationData.length > 0 && <BarChart title={t('statsScreen.sleepDuration')} data={chartData.sleepChartData.durationData} barColor="fill-indigo-500" goalValue={chartData.sleepDurationGoal} maxValue={12} />}
                                {chartData.sleepChartData.qualityData.length > 0 && <BarChart title={t('statsScreen.sleepQuality')} data={chartData.sleepChartData.qualityData} barColor="fill-amber-500" maxValue={5} />}
                                {chartData.sleepChartData.habitsData.length > 0 && <BarChart title={t('statsScreen.eveningHabits')} data={chartData.sleepChartData.habitsData} barColor="fill-emerald-500" maxValue={7} />}
                                {chartData.sleepChartData.missedData.length > 0 && <BarChart title={t('statsScreen.missedActivities')} data={chartData.sleepChartData.missedData} barColor="fill-rose-500" maxValue={3} />}
                           </>
                       )}
                       {chartData.movementChartData.stepsData.length > 0 && (
                           <>
                               <h3 className="text-xl font-bold text-brand-dark text-center">{t('challenge.beweegChallenge.name')}</h3>
                               <BarChart title={t('statsScreen.steps')} data={chartData.movementChartData.stepsData} barColor="fill-lime-600" goalValue={goals.movementChallenge?.steps} maxValue={Math.max(10000, goals.movementChallenge?.steps || 0, ...chartData.movementChartData.stepsData.map(d=>d.value))} />
                           </>
                       )}
                       {chartData.stepsData.length > 0 && (
                            <BarChart 
                                title={t('statsScreen.stepsAndSleep')}
                                data={chartData.stepsData}
                                lineData={chartData.sleepData}
                                barColor="fill-lime-500"
                                lineColor="stroke-indigo-500"
                                maxValue={Math.max(10000, ...chartData.stepsData.map(d => d.value))}
                                lineMaxValue={Math.max(12, ...chartData.sleepData.map(d => d.value))}
                                yAxisLabel={t('statsScreen.steps')}
                                lineYAxisLabel={t('statsScreen.sleep')}
                            />
                       )}
                       {chartData.bloodPressureData.length > 0 && (
                            <LineChart 
                                title={t('statsScreen.bloodPressure')}
                                data1={chartData.bloodPressureData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.systolic }))}
                                label1={t('measurements.labels.systolic')}
                                data2={chartData.bloodPressureData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.diastolic }))}
                                label2={t('measurements.labels.diastolic')}
                                color1="stroke-purple-500"
                                color2="stroke-purple-300"
                                maxValue={Math.max(160, ...chartData.bloodPressureData.map(d => d.systolic))}
                            />
                       )}
                       {chartData.weightData.length > 0 && (
                            <LineChart 
                                title={t('statsScreen.weight')}
                                data1={chartData.weightData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.value }))}
                                color1="stroke-teal-500"
                                maxValue={Math.max(100, ...chartData.weightData.map(d => d.value))}
                            />
                       )}
                       {chartData.restingHeartRateData.length > 0 && (
                            <LineChart 
                                title={t('statsScreen.restingHeartRate')}
                                data1={chartData.restingHeartRateData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.value }))}
                                color1="stroke-rose-500"
                                maxValue={Math.max(120, ...chartData.restingHeartRateData.map(d => d.value))}
                                minValue={40}
                            />
                       )}
                       {chartData.temperatureData.length > 0 && (
                            <LineChart 
                                title={t('statsScreen.temperature')}
                                data1={chartData.temperatureData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.value }))}
                                color1="stroke-orange-500"
                                maxValue={Math.max(40, ...chartData.temperatureData.map(d => d.value))}
                            />
                        )}
                        {chartData.oxygenSaturationData.length > 0 && (
                            <LineChart 
                                title={t('statsScreen.oxygenSaturation')}
                                data1={chartData.oxygenSaturationData.map(d => ({ label: d.timestamp.toLocaleDateString(language, { day: 'numeric', month: 'numeric' }), value: d.value }))}
                                color1="stroke-sky-500"
                                maxValue={100}
                                minValue={80}
                            />
                        )}
                       {chartData.bloodGlucoseData.length > 0 && (
                            <BloodGlucoseTable
                                title={t('statsScreen.bloodGlucose')}
                                data={chartData.bloodGlucoseData}
                            />
                       )}
                       {chartData.fourDKLChartData && (
                            <SurveyChart 
                                title={t('surveys.fourDKL.name')}
                                series={chartData.fourDKLChartData.series}
                                maxValue={32}
                            />
                       )}
                        {chartData.hadsChartData && (
                            <SurveyChart
                                title={t('surveys.hads.name')}
                                series={chartData.hadsChartData.series}
                                maxValue={21}
                            />
                        )}
                       {chartData.singleScoreCharts?.map(chart => (
                           chart && <LineChart 
                                key={chart.id}
                                title={chart.title}
                                data1={chart.data}
                                color1="stroke-blue-500"
                                maxValue={Math.max(...chart.data.map(d => d.value), 10)}
                            />
                       ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsScreen;
