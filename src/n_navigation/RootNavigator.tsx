import React, { useContext } from 'react';
import { Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeContext } from 'react-native-elements';
import { ThemeReducerContext } from '../helpers/ThemeReducer';

import LoginScreen from '../n_views/autenticacao/LoginScreen';
import HomeScreen from '../n_views/home/HomeScreen';
import ConfiguracoesScreen from '../n_views/configuracoes/ConfiguracoesScreen';
import VideoRecorderRotas from '../n_views/videos/VideoRecorderRotas';
import VideosRotas from '../n_views/videos/VideosRotas';

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

function RootNavigator() {
  const { ThemeState } = useContext(ThemeReducerContext);
  const { theme } = useContext(ThemeContext);

  const timingConfig = {
    animation: 'timing',
    config: {
      duration: 200,
      easing: Easing.linear,
    },
  };

  return (
    <NavigationContainer
      theme={{
        colors: {
          background:
            theme?.colors?.white !== undefined ? theme.colors.white : '',
          primary: '',
          card: '',
          text: '',
          border: '',
          notification: '',
        },
        dark: ThemeState.themeMode === 'dark',
      }}
    >

      <Stack.Navigator screenOptions={{
        headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: timingConfig,
          close: timingConfig,
        }
      }}>
        <Stack.Screen name="Autenticação" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Configurações" component={ConfiguracoesScreen} />
        <Stack.Screen name="Grava Vídeos" component={VideoRecorderRotas} />
        <Stack.Screen name="Lista Vídeos" component={VideosRotas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
