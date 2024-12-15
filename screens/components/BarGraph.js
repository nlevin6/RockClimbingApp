import React from 'react';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryStack, VictoryTheme } from 'victory-native';

const BarGraph = () => {
    const data = [
        { day: 'M', v1: 1, v3: 2, v5: 1 },
        { day: 'T', v1: 0, v3: 1, v5: 0 },
        { day: 'W', v1: 2, v3: 1, v5: 1 },
        { day: 'T', v1: 1, v3: 1, v5: 0 },
        { day: 'F', v1: 2, v3: 3, v5: 1 },
        { day: 'Sa', v1: 0, v3: 1, v5: 0 },
        { day: 'Su', v1: 1, v3: 1, v5: 2 },
    ];

    return (
        <View style={{ flex: 1 }}>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 20 }}
                height={400}
                width={400}
                padding={{ top: 30, bottom: 50, left: 40, right: 20 }}
            >
                <VictoryAxis style={{ tickLabels: { fill: 'white', fontSize: 12 } }} />
                <VictoryAxis
                    dependentAxis
                    style={{ tickLabels: { fill: 'white', fontSize: 12 } }}
                />
                <VictoryStack colorScale={['#6EE7B7', '#A78BFA', '#F87171']}>
                    <VictoryBar data={data} x="day" y="v1" />
                    <VictoryBar data={data} x="day" y="v3" />
                    <VictoryBar data={data} x="day" y="v5" />
                </VictoryStack>
            </VictoryChart>
        </View>
    );
};

export default BarGraph;
