import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const GradingContext = createContext();

export const useGradingSystem = () => useContext(GradingContext);

export const GradingProvider = ({ children }) => {
    const [gradingSystem, setGradingSystem] = useState('Hueco (USA)');
    const [chromaticGrades, setChromaticGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'grading');

                const unsubscribeFirestore = onSnapshot(
                    settingsDocRef,
                    (docSnapshot) => {
                        if (docSnapshot.exists()) {
                            const data = docSnapshot.data();
                            setGradingSystem(data.gradingSystem || 'Hueco (USA)');
                            setChromaticGrades(data.chromaticGrades || []);
                        } else {
                            setDoc(settingsDocRef, {
                                gradingSystem: 'Hueco (USA)',
                                chromaticGrades: [],
                            });
                            setGradingSystem('Hueco (USA)');
                            setChromaticGrades([]);
                        }
                        setLoading(false);
                    },
                    () => {
                        setLoading(false);
                    }
                );

                return () => unsubscribeFirestore();
            } else {
                setGradingSystem('Hueco (USA)');
                setChromaticGrades([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const updateGradingSystem = async (newSystem) => {
        setGradingSystem(newSystem);
        const user = auth.currentUser;
        if (user) {
            const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'grading');
            try {
                await setDoc(settingsDocRef, { gradingSystem: newSystem }, { merge: true });
            } catch {}
        }
    };

    const updateChromaticGrades = async (newGrades) => {
        setChromaticGrades(newGrades);
        const user = auth.currentUser;
        if (user) {
            const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'grading');
            try {
                await setDoc(settingsDocRef, { chromaticGrades: newGrades }, { merge: true });
            } catch {}
        }
    };

    const value = {
        gradingSystem,
        setGradingSystem: updateGradingSystem,
        chromaticGrades,
        setChromaticGrades: updateChromaticGrades,
        loading,
    };

    return (
        <GradingContext.Provider value={value}>
            {!loading && children}
        </GradingContext.Provider>
    );
};
