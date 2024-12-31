import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import app from '../../firebaseConfig';
import tw from '../../tailwind';

const ClimbingStats = () => {
    const [totalClimbs, setTotalClimbs] = useState(0);
    const [lastClimbedDate, setLastClimbedDate] = useState(null);

    useEffect(() => {
        const db = getFirestore(app);
        const climbsRef = collection(db, 'climbs');
        const q = query(climbsRef, orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const climbs = snapshot.docs.map((doc) => doc.data());
            setTotalClimbs(climbs.length);
            if (climbs.length > 0) {
                setLastClimbedDate(climbs[0].date);
            } else {
                setLastClimbedDate(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={tw`bg-gray-800 p-4 rounded-lg`}>
            <Text style={tw`text-violet-500 text-lg font-semibold mb-2`}>Overall Stats</Text>
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-400`}>Total Climbs:</Text>
                <Text style={tw`text-violet-300`}>{totalClimbs}</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-gray-400`}>Date Last Climbed:</Text>
                <Text style={tw`text-violet-300`}>{formatDate(lastClimbedDate)}</Text>
            </View>
        </View>
    );
};

export default ClimbingStats;
