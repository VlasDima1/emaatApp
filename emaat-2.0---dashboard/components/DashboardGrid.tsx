import React from 'react';
import { Participant, Domain, VitalityMeasurement } from '../types';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, YAxis, XAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { 
    ScaleIcon, ShoeIcon, SleepIcon, ActivityIcon, DropIcon, HeartIcon
} from './icons';

interface DashboardGridProps {
    participant: Participant;
}

// --- Shared Components ---

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    colorClass: string;
    children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon, colorClass, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-[300px] hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-10`}>
                        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `h-4 w-4 ${colorClass.replace('bg-', 'text-')}` })}
                    </div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">{value}</span>
                    <span className="text-sm font-medium text-gray-400">{unit}</span>
                </div>
            </div>
        </div>
        
        <div className="flex-1 w-full min-h-0">
            {children}
        </div>
    </div>
);

// --- Widgets ---

// Helper to parse date string robustly (handles YYYY-MM-DD, DD-MM-YYYY, etc.)
const parseDate = (dateStr: string): Date => {
    // Try ISO format first (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
    }
    // Try DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = dateStr.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (dmyMatch) {
        return new Date(`${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`);
    }
    // Fallback
    return new Date(dateStr);
};

const formatDateLabel = (dateStr: string): string => {
    const date = parseDate(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
};

// Custom tooltip for weight chart
interface WeightDataPoint {
    index: number;
    displayLabel: string;
    fullDateTime: string;
    gewicht: number;
}

const WeightTooltip: React.FC<{ active?: boolean; payload?: Array<{ payload: WeightDataPoint }> }> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const dataPoint = payload[0].payload;
        return (
            <div style={{ 
                backgroundColor: 'white', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                border: 'none'
            }}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>Datum: {dataPoint.fullDateTime}</p>
                <p style={{ margin: '4px 0 0 0', color: '#0d9488', fontWeight: 'bold' }}>Gewicht: {dataPoint.gewicht} kg</p>
            </div>
        );
    }
    return null;
};

// 1. Weight Widget
const WeightWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data: WeightDataPoint[] = measurements
        .filter(m => m.weight !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            // If same date, sort by time
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map((m, index) => ({
            index,
            displayLabel: formatDateLabel(m.date),
            fullDateTime: `${formatDateLabel(m.date)} ${m.time || ''}`.trim(),
            gewicht: m.weight!
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Gewicht" 
            value={latest?.gewicht || '-'} 
            unit="kg" 
            icon={<ScaleIcon />}
            colorClass="bg-teal-600"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="index"
                        type="number"
                        domain={[0, data.length - 1]}
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                        tickFormatter={(val: number) => data[val]?.displayLabel || ''}
                        interval={0}
                        ticks={data.length <= 10 ? data.map((_, i) => i) : undefined}
                    />
                    <YAxis 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        content={<WeightTooltip />}
                        cursor={{ stroke: '#ccfbf1', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="gewicht" 
                        name="Gewicht"
                        stroke="#0d9488" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#0d9488' }}
                        activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 2. Steps Widget
const StepsWidget: React.FC<{ participant: Participant }> = ({ participant }) => {
    // First try to get data from vitalityMeasurements (API data)
    const measurementData = participant.vitalityMeasurements
        .filter(m => m.steps !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map(m => ({
            name: formatDateLabel(m.date),
            stappen: m.steps
        }));
    
    // Fallback to challenge data if no measurement data (mock mode)
    const moveChallenge = participant.challenges.find(c => c.domain === Domain.Beweeg);
    const challengeData = moveChallenge 
        ? [...moveChallenge.data]
            .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
            .slice(0, 14)
            .map((d) => ({
                name: formatDateLabel(d.date),
                stappen: d.value
            })) 
        : [];
    
    // Use measurement data if available, otherwise fall back to challenge data
    const data = measurementData.length > 0 ? measurementData : challengeData;
    
    // Calculate average or latest based on need, using latest here
    const latest = data.length > 0 ? data[data.length - 1].stappen : '-';

    return (
        <MetricCard 
            title="Stappen" 
            value={typeof latest === 'number' ? latest.toLocaleString() : latest} 
            unit="stappen" 
            icon={<ShoeIcon />}
            colorClass="bg-blue-500"
        >
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                        interval={2}
                    />
                    <YAxis 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        cursor={{fill: '#eff6ff'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value.toLocaleString()} stappen`, 'Stappen']}
                        labelFormatter={(label) => `Datum: ${label}`}
                    />
                    <Bar dataKey="stappen" name="Stappen" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <ReferenceLine y={6000} stroke="#cbd5e1" strokeDasharray="3 3" />
                </BarChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 3. Sleep Widget
const SleepWidget: React.FC<{ participant: Participant }> = ({ participant }) => {
    // First try to get data from vitalityMeasurements (API data)
    const measurementData = participant.vitalityMeasurements
        .filter(m => m.sleepHours !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map(m => ({
            name: formatDateLabel(m.date),
            slaap: Number(m.sleepHours!.toFixed(1))
        }));
    
    // Fallback to challenge data if no measurement data (mock mode)
    const sleepChallenge = participant.challenges.find(c => c.domain === Domain.Slaap);
    const challengeData = sleepChallenge 
        ? [...sleepChallenge.data]
            .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
            .slice(0, 14)
            .map((d) => ({
                name: formatDateLabel(d.date),
                slaap: d.value
            })) 
        : [];
    
    // Use measurement data if available, otherwise fall back to challenge data
    const data = measurementData.length > 0 ? measurementData : challengeData;

    const latest = data.length > 0 ? data[data.length - 1].slaap : '-';

    return (
        <MetricCard 
            title="Slaap" 
            value={latest} 
            unit="uur" 
            icon={<SleepIcon />}
            colorClass="bg-indigo-500"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                        interval={2}
                    />
                    <YAxis 
                        domain={[0, 12]} 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} uur`, 'Slaap']}
                        labelFormatter={(label) => `Datum: ${label}`}
                        cursor={{ stroke: '#e0e7ff', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="slaap" 
                        name="Slaap"
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        dot={{r: 3, fill: '#6366f1'}}
                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 4. Blood Pressure Widget
const BloodPressureWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data = measurements
        .filter(m => m.bloodPressureSystolic !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map(m => ({
            name: formatDateLabel(m.date),
            bovendruk: m.bloodPressureSystolic,
            onderdruk: m.bloodPressureDiastolic
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Bloeddruk" 
            value={latest ? `${latest.bovendruk}/${latest.onderdruk}` : '-'} 
            unit="mmHg" 
            icon={<ActivityIcon />}
            colorClass="bg-red-500"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                    />
                    <YAxis 
                        domain={[60, 'auto']}
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                     <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number, name: string) => [`${value} mmHg`, name === 'bovendruk' ? 'Bovendruk' : 'Onderdruk']}
                        labelFormatter={(label) => `Datum: ${label}`}
                    />
                    <Line type="monotone" dataKey="bovendruk" name="Bovendruk" stroke="#ef4444" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
                    <Line type="monotone" dataKey="onderdruk" name="Onderdruk" stroke="#fca5a5" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 5. Blood Sugar Widget
const BloodSugarWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data = measurements
        .filter(m => m.bloodSugar !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map(m => ({
            // Include time for distinct moments
            name: `${formatDateLabel(m.date)} ${m.time}`,
            displayTime: m.time,
            bloedsuiker: m.bloodSugar
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Bloedsuiker" 
            value={latest?.bloedsuiker || '-'} 
            unit="mmol/L" 
            icon={<DropIcon />}
            colorClass="bg-purple-600"
        >
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                        // Format tick to be shorter for the axis, but keep full info for tooltip
                        tickFormatter={(val) => val.split(' ')[0]}
                    />
                    <YAxis 
                        domain={[0, 15]}
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} mmol/L`, 'Bloedsuiker']}
                        labelFormatter={(label) => `Datum: ${label}`}
                        cursor={{ stroke: '#f3e8ff', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="bloedsuiker" 
                        name="Bloedsuiker"
                        stroke="#9333ea" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#9333ea' }}
                        activeDot={{ r: 6, fill: '#9333ea', stroke: '#fff', strokeWidth: 2 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 6. Heart Rate Widget
const HeartRateWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data = measurements
        .filter(m => m.heartRate !== undefined)
        .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        })
        .map(m => ({
            name: `${formatDateLabel(m.date)} ${m.time}`,
            hartslag: m.heartRate
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Hartslag" 
            value={latest?.hartslag || '-'} 
            unit="BPM" 
            icon={<HeartIcon />}
            colorClass="bg-rose-500"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10}
                        tickFormatter={(val) => val.split(' ')[0]}
                    />
                    <YAxis 
                        domain={['dataMin - 10', 'dataMax + 10']}
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} BPM`, 'Hartslag']}
                        labelFormatter={(label) => `Datum: ${label}`}
                        cursor={{ stroke: '#ffe4e6', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="hartslag" 
                        name="Hartslag"
                        stroke="#f43f5e" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#f43f5e' }}
                        activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// Main Dashboard Grid
const DashboardGrid: React.FC<DashboardGridProps> = ({ participant }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WeightWidget measurements={participant.vitalityMeasurements} />
            <StepsWidget participant={participant} />
            <SleepWidget participant={participant} />
            
            <BloodPressureWidget measurements={participant.vitalityMeasurements} />
            <BloodSugarWidget measurements={participant.vitalityMeasurements} />
            <HeartRateWidget measurements={participant.vitalityMeasurements} />
        </div>
    );
};

export default DashboardGrid;