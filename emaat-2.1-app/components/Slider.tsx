import React, { FC } from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    minLabel: string;
    maxLabel: string;
}

const Slider: FC<SliderProps> = ({ value, onChange, minLabel, maxLabel }) => {
    const percentage = (value / 10) * 100;
    
    return (
        <div>
            <div className="relative mb-2 h-2">
                <div className="absolute top-0 left-0 h-2 bg-gray-200 rounded-full w-full"></div>
                <div 
                    className="absolute top-0 left-0 h-2 bg-brand-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value, 10))}
                    className="absolute top-0 left-0 w-full h-2 appearance-none cursor-pointer bg-transparent"
                    style={{'--thumb-color': '#4F46E5'} as React.CSSProperties}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span>{minLabel}</span>
                <span className="font-bold text-brand-primary">{value}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
};

export default Slider;
