import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Header as HeaderRNE, HeaderProps, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import { theme } from '../n_views/core/theme';

type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderSomenteTexto: React.FunctionComponent<HeaderComponentProps> = (props) => {
  return (
    <HeaderRNE
    rightComponent={      
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => RNExitApp.exitApp()}>
            <FontAwesome5
              name={"sign-out-alt"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>          
        </View>      
    }
      centerComponent={{ text: props.title, style: styles.heading }}
      backgroundColor={theme.colors.app_bg}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { HeaderSomenteTexto };
