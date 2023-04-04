import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import VideosScreen from './VideosScreen';
import FormularioInfoScreen from './FormularioInfoScreen';
import VideoPlay from './VideoPlay';

const Stack = createStackNavigator();

export default function VideosRotas({ ComponentePrincipal = VideosScreen }) {

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
        <Stack.Screen name='VideosScreen' component={ComponentePrincipal} />
        <Stack.Screen name='FormularioInfoScreen' component={FormularioInfoScreen} />
        <Stack.Screen name='VideoPlay' component={VideoPlay} />
    </Stack.Navigator>);
}
