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

        // Order by date so the first doc is the most recent climb
        const q = query(climbsRef, orderBy('date', 'desc'));

        // Listen in real-time to the climbs collection
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const climbs = snapshot.docs.map((doc) => doc.data());

            setTotalClimbs(climbs.length);

            // If there is at least one climb, set the date of the most recent climb
            if (climbs.length > 0) {
                setLastClimbedDate(climbs[0].date);
            } else {
                setLastClimbedDate(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Helper to safely convert the date string/field to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString(); // e.g., "12/30/2024"
    };

    return (
        <View style={tw`bg-gray-800 p-4 rounded-lg`}>
            <Text style={tw`text-white text-lg font-semibold mb-2`}>Overall Stats</Text>

            {/* Total Climbs */}
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-400`}>Total Climbs:</Text>
                <Text style={tw`text-white`}>{totalClimbs}</Text>
            </View>

            {/* Date Last Climbed */}
            <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-gray-400`}>Date Last Climbed:</Text>
                <Text style={tw`text-white`}>{formatDate(lastClimbedDate)}</Text>
            </View>
        </View>
    );
};

export default ClimbingStats;
