// ### ESSA EH A VERSAO CUSTOMIZADA DO REACT-NATIVE-ELEMENTS TYPESCRIPT ##//
// ### TIVE QUE COMENTAR ALGUMAS COISAS PARA FUNCIONAR SEM O EXPO ##//

import React, { useState, useReducer, useEffect } from 'react';
import { ThemeProvider } from 'react-native-elements';
// import { useColorScheme } from 'react-native-appearance';
import RootNavigator from './src/n_navigation/RootNavigator';
// import AppLoading from './src/components/AppLoading';
// import { cacheImages, cacheFonts } from './src/helpers/AssetsCaching';
// import vectorFonts from './src/helpers/vector-fonts';
import {
  ThemeReducer,
  initialState,
  ThemeReducerContext,
} from './src/helpers/ThemeReducer';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Orientation from 'react-native-orientation';
import KeepAwake from 'react-native-keep-awake';
import { ToastProvider } from 'react-native-toast-notifications';
import { theme } from "./src/n_views/core/theme";


export default () => {
  const [ThemeState, dispatch] = useReducer(ThemeReducer, initialState);
  // const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   if (colorScheme === 'dark') {
  //     dispatch({ type: 'set-theme', payload: 'dark' });
  //   }
  // }, [colorScheme]);

  //-> MODELO DE USEEFFECT
  // useEffect(() => {
  //-> Aqui vai a alogica para componentWillMount. componentDidMount e componentDidUpdate
  // document.title = `Você clicou ${count} vezes`;
  //-> Opcional - Caso deseje, aqui no return, vai a a logica para componentWillUnMount
  // return () => {
  //   ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  // };
  // }, [count]); //-> Opcional - Caso deseje, apenas re-execute o efeito quando o count mudar

  useEffect(() => {
    console.log(`- APP.js: componentWillMount. componentDidMount e componentDidUpdate`);

    KeepAwake.activate();

    // this locks the view to Landscape Mode
    Orientation.lockToLandscape();

    // this unlocks any previous locks to all Orientations
    // Orientation.unlockAllOrientations();

    Orientation.addOrientationListener(this._orientationDidChange);

    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();

    return () => {
      console.log(`- APP.js: componentWillUnMount`);
      // Orientation.removeOrientationListener(this._orientationDidChange);
    };
  });

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
    } else {
      // do something with portrait layout
    } 
  }

  // const loadAssetsAsync = async () => {
  //   const imageAssets = cacheImages([
  //     require('./assets/images/bg_screen1.jpg'),
  //     require('./assets/images/bg_screen2.jpg'),
  //     require('./assets/images/bg_screen3.jpg'),
  //     require('./assets/images/bg_screen4.jpg'),
  //     require('./assets/images/user-cool.png'),
  //     require('./assets/images/user-hp.png'),
  //     require('./assets/images/user-student.png'),
  //     require('./assets/images/avatar1.jpg'),
  //   ]);

  //   const fontAssets = cacheFonts([
  //     ...vectorFonts,
  //     { georgia: require('./assets/fonts/Georgia.ttf') },
  //     { regular: require('./assets/fonts/Montserrat-Regular.ttf') },
  //     { light: require('./assets/fonts/Montserrat-Light.ttf') },
  //     { bold: require('./assets/fonts/Montserrat-Bold.ttf') },
  //     { UbuntuLight: require('./assets/fonts/Ubuntu-Light.ttf') },
  //     { UbuntuBold: require('./assets/fonts/Ubuntu-Bold.ttf') },
  //     { UbuntuLightItalic: require('./assets/fonts/Ubuntu-Light-Italic.ttf') },
  //   ]);
  //   await Promise.all([...imageAssets, ...fontAssets]);
  // };

  if (!isReady) {
    // return (
    //   <AppLoading
    //     startAsync={loadAssetsAsync}
    //     onFinish={() => {
    //       setIsReady(true);
    //     }}
    //     onError={console.warn}
    //   />
    // );
  }

  return (
    <ThemeReducerContext.Provider value={{ ThemeState, dispatch }}>
      <ThemeProvider theme={theme} useDark={ThemeState.themeMode === 'dark' ? true : false}>
        <SafeAreaProvider>
          <ToastProvider 
            successIcon={<FontAwesome5 name="check" style={{ color: "#fff", marginRight: 15 }} />}
            warningIcon={<FontAwesome5 name="exclamation-triangle" style={{ color: "#fff", marginRight: 15 }} />}            
            dangerIcon={<FontAwesome5 name="times" style={{ color: "#fff", marginRight: 15 }} />}
            successColor={theme.colors.success}
            dangerColor={theme.colors.error}
            warningColor={theme.colors.warning}
            normalColor={theme.colors.normal}
          >
            <RootNavigator />
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ThemeReducerContext.Provider>
  );
};

