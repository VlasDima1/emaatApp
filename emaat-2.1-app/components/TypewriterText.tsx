

import React, { FC, useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
    text: string;
    speed: number;
    className?: string;
}

const TypewriterText: FC<TypewriterTextProps> = ({ text, speed, className }) => {
    const [displayedText, setDisplayedText] = useState('');
    // Use a ref to hold the current index, so it persists across re-renders
    const currentIndex = useRef(0);

    useEffect(() => {
        // Reset state when props change
        currentIndex.current = 0;
        setDisplayedText('');

        if (speed <= 0 || !text) {
            setDisplayedText(text || '');
            return;
        }

        let timeoutId: number;

        const typeCharacter = () => {
            // Check if we've reached the end of the text
            if (currentIndex.current >= text.length) {
                return; // Stop the recursion
            }

            // Append the next character
            const char = text.charAt(currentIndex.current);
            setDisplayedText(prev => prev + char);
            
            // Increment the index for the next run
            currentIndex.current++;

            // Schedule the next character
            timeoutId = window.setTimeout(typeCharacter, speed);
        };
        
        // Start the effect
        timeoutId = window.setTimeout(typeCharacter, speed);

        // Cleanup function to clear the timeout when the component unmounts or props change
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [text, speed]);

    return <p className={className}>"{displayedText}"</p>;
};

export default TypewriterText;