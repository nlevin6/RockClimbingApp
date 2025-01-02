import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

const GradingContext = createContext();


export const GradingProvider = ({ children }) => {
    const [gradingSystem, setGradingSystem] = useState('Hueco (USA)');
    const [chromaticGrades, setChromaticGrades] = useState([]);

    useEffect(() => {
        const fetchGradingSettings = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const docRef = doc(db, `users/${user.uid}/settings`, 'grading');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.gradingSystem) setGradingSystem(data.gradingSystem);
                    if (data.chromaticGrades) setChromaticGrades(data.chromaticGrades);
                }
            } catch (error) {
                console.error('Error fetching grading system:', error);
            }
        };

        fetchGradingSettings();
    }, []);

    const updateGradingSystem = async (newSystem) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const docRef = doc(db, `users/${user.uid}/settings`, 'grading');
            await setDoc(docRef, {
                gradingSystem: newSystem,
                chromaticGrades,
            }, { merge: true });
            setGradingSystem(newSystem);
        } catch (error) {
            console.error('Error saving grading system:', error);
        }
    };


    const updateChromaticGrades = async (newChromaticGrades) => {
        try {
            const docRef = doc(db, 'settings', 'grading');
            await setDoc(docRef, {
                gradingSystem,
                chromaticGrades: newChromaticGrades
            }, { merge: true });
            setChromaticGrades(newChromaticGrades);
        } catch (error) {
            console.error('Error saving chromatic grades:', error);
        }
    };

    return (
        <GradingContext.Provider
            value={{
                gradingSystem,
                setGradingSystem: updateGradingSystem,
                chromaticGrades,
                setChromaticGrades: updateChromaticGrades
            }}
        >
            {children}
        </GradingContext.Provider>
    );
};

export const useGradingSystem = () => useContext(GradingContext);
