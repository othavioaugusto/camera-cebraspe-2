import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
// import CespeVideoRecorder from './CespeVideoRecorder';
// import CespeVisionCamera from '../visioncamera/CespeVisionCamera'
// import CebraspeVisionCamera from '../visioncamera/CebraspeVisionCamera'
import NovoCespeVideoRecorder from './NovoCespeVideoRecorder';
import QRCodeScreen from './QRCodeScreen';

const Stack = createStackNavigator();

export default function VideoRecorderRotas({ ComponentePrincipal = NovoCespeVideoRecorder }) {

    const timingConfig = {
        animation: 'timing',
        config: {
            duration: 200,
            easing: Easing.linear,
        },
    };

    return (<Stack.Navigator screenOptions={{
        headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
            open: timingConfig,
            close: timingConfig,
        }
    }}>
        <Stack.Screen name='NovoCespeVideoRecorder' component={ComponentePrincipal} />
        <Stack.Screen name='QRCodeScreen' component={QRCodeScreen} />
    </Stack.Navigator>);
}
