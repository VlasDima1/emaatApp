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

// 1. Weight Widget
const WeightWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data = measurements
        .filter(m => m.weight !== undefined)
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)}`,
            fullDate: m.date,
            val: m.weight
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Gewicht" 
            value={latest?.val || '-'} 
            unit="kg" 
            icon={<ScaleIcon />}
            colorClass="bg-teal-600"
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
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        tick={{fontSize: 10, fill: '#9ca3af'}} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0d9488', fontWeight: 'bold' }}
                        cursor={{ stroke: '#ccfbf1', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#0d9488" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#0d9488' }}
                        activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }} 
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
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)}`,
            val: m.steps
        }));
    
    // Fallback to challenge data if no measurement data (mock mode)
    const moveChallenge = participant.challenges.find(c => c.domain === Domain.Beweeg);
    const challengeData = moveChallenge 
        ? [...moveChallenge.data]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 14)
            .map((d) => ({
                name: `${d.date.substring(8)}/${d.date.substring(5, 7)}`,
                val: d.value
            })) 
        : [];
    
    // Use measurement data if available, otherwise fall back to challenge data
    const data = measurementData.length > 0 ? measurementData : challengeData;
    
    // Calculate average or latest based on need, using latest here
    const latest = data.length > 0 ? data[data.length - 1].val : '-';

    return (
        <MetricCard 
            title="Stappen" 
            value={latest.toLocaleString()} 
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
                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)}`,
            val: Number(m.sleepHours!.toFixed(1))
        }));
    
    // Fallback to challenge data if no measurement data (mock mode)
    const sleepChallenge = participant.challenges.find(c => c.domain === Domain.Slaap);
    const challengeData = sleepChallenge 
        ? [...sleepChallenge.data]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 14)
            .map((d) => ({
                name: `${d.date.substring(8)}/${d.date.substring(5, 7)}`,
                val: d.value
            })) 
        : [];
    
    // Use measurement data if available, otherwise fall back to challenge data
    const data = measurementData.length > 0 ? measurementData : challengeData;

    const latest = data.length > 0 ? data[data.length - 1].val : '-';

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
                        itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                        cursor={{ stroke: '#e0e7ff', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="val" 
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
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)}`,
            sys: m.bloodPressureSystolic,
            dia: m.bloodPressureDiastolic
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Bloeddruk" 
            value={latest ? `${latest.sys}/${latest.dia}` : '-'} 
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
                    />
                    <Line type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
                    <Line type="monotone" dataKey="dia" stroke="#fca5a5" strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
                </LineChart>
            </ResponsiveContainer>
        </MetricCard>
    );
};

// 5. Blood Sugar Widget
const BloodSugarWidget: React.FC<{ measurements: VitalityMeasurement[] }> = ({ measurements }) => {
    const data = measurements
        .filter(m => m.bloodSugar !== undefined)
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            // Include time for distinct moments
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)} ${m.time}`,
            displayTime: m.time,
            val: m.bloodSugar
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Bloedsuiker" 
            value={latest?.val || '-'} 
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
                        itemStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                        cursor={{ stroke: '#f3e8ff', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="val" 
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
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .map(m => ({
            name: `${m.date.substring(8)}/${m.date.substring(5, 7)} ${m.time}`,
            val: m.heartRate
        }));

    const latest = data[data.length - 1];

    return (
        <MetricCard 
            title="Hartslag" 
            value={latest?.val || '-'} 
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
                        itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                        cursor={{ stroke: '#ffe4e6', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="val" 
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