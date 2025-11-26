import React, { createContext, useContext, useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const MotionContext = createContext();

export const MotionProvider = ({ children }) => {
    // Feature flag: set to false to disable all animations
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    // Respect system preference for reduced motion
    const shouldReduceMotion = useReducedMotion();

    // If user prefers reduced motion, we can either disable animations 
    // or (better) force them to be simple fades. 
    // For now, let's expose 'shouldReduceMotion' so components can adapt.

    const isEnabled = animationsEnabled && !shouldReduceMotion;

    return (
        <MotionContext.Provider value={{ animationsEnabled: isEnabled, setAnimationsEnabled, shouldReduceMotion }}>
            {children}
        </MotionContext.Provider>
    );
};

export const useMotion = () => useContext(MotionContext);
