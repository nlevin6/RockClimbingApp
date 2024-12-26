import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from '../../firebaseConfig';

const GradingContext = createContext();

const db = getFirestore(app);

export const GradingProvider = ({ children }) => {
    const [gradingSystem, setGradingSystem] = useState('Hueco (USA)');

    useEffect(() => {
        const fetchGradingSystem = async () => {
            try {
                const docRef = doc(db, 'settings', 'grading');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setGradingSystem(docSnap.data().gradingSystem);
                }
            } catch (error) {
                console.error('Error fetching grading system:', error);
            }
        };

        fetchGradingSystem();
    }, []);

    // Save the grading system to Firestore
    const toggleGradingSystem = async () => {
        const newSystem = gradingSystem === 'Hueco (USA)' ? 'Fontainebleau' : 'Hueco (USA)';
        setGradingSystem(newSystem);

        try {
            const docRef = doc(db, 'settings', 'grading');
            await setDoc(docRef, { gradingSystem: newSystem });
        } catch (error) {
            console.error('Error saving grading system:', error);
        }
    };

    return (
        <GradingContext.Provider value={{ gradingSystem, toggleGradingSystem }}>
            {children}
        </GradingContext.Provider>
    );
};

export const useGradingSystem = () => useContext(GradingContext);
