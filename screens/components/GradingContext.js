import React, { createContext, useContext, useState } from 'react';

const GradingContext = createContext();

export const GradingProvider = ({ children }) => {
    const [gradingSystem, setGradingSystem] = useState('Hueco (USA)');

    const toggleGradingSystem = () => {
        setGradingSystem((prev) => (prev === 'Hueco (USA)' ? 'Fontainebleau' : 'Hueco (USA)'));
    };

    return (
        <GradingContext.Provider value={{ gradingSystem, toggleGradingSystem }}>
            {children}
        </GradingContext.Provider>
    );
};

export const useGradingSystem = () => useContext(GradingContext);
