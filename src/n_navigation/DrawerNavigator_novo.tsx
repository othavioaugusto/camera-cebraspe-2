import React, { useState, useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View, PermissionsAndroid, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import {
  ThemeContext,
  Button,
  Divider,
  Switch,
  ListItem,
  Text,
  Tab,
  Dialog,
  Icon
} from 'react-native-elements';
import styles from "./style";
import { menuRNE } from "./menuRNE";
import { ThemeReducerContext } from '../helpers/ThemeReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import { mostraMsg, mostraMsgForm, storeData, logar, getPastaArmazenamentoExterno, getPastaArmazenamentoInterno } from "../n_views/core/utils";
// import { useNavigation } from '@react-navigation/native';
import { theme } from "../n_views/core/theme";

function CustomContentComponent(
  props: DrawerContentComponentProps<DrawerContentOptions>
) {
  // const navigation = useNavigation();

  const { ThemeState, dispatch } = useContext(ThemeReducerContext);
  // const { theme } = useContext(ThemeContext);

  const dados = [
    {
      name: "Gravar Vídeo",
      route: "Grava Vídeos",
      iconFA5: "youtube",
      bg: "#C5F442",
      reload: true
    },
    {
      name: "Vídeos Gravados",
      route: "Lista Vídeos",
      iconFA5: "list",
      bg: "#C5F442",
      reload: true
    },
    {
      name: "Configurações",
      route: "Configurações",
      iconFA5: "cogs",
      bg: "#C5F442",
      reload: true
    },
  ];


  const dadosFinal = [    
    {
      name: "Sair",
      evento: "SAIR",
      iconFA5: "sign-out-alt",
      bg: "#C5F442"
    },
  ];

  const versaoApp = [
    {
      name: "Versão: ",
      bg: "#ffffff"
    },
  ];

  const [datas, setDatas] = useState([]);

  const navegar = async (tela, params) => {
    const { navigate } = props.navigation;
    navigate(tela, { ...params });
  }

  const navegarClickMenu = (tela, params) => {
    logar(`Usuario clicou no item de menu: ${tela.name}`);

    changeMenuItemColor(tela);
    const { navigate } = props.navigation;
    const rota = tela.route;
    const reload = tela.reload;
    navigate(rota, { ...params });
    if (reload) {
      console.log("= Vou dar Reload na Telasss!!!");
      // const setParamsAction = NavigationActions.setParams({
      //   params: { refreshTela: true },
      //   key: rota
      // });
      // navigation.dispatch(setParamsAction);
    }
  }

  const changeMenuItemColor = (menuSelect) => {
    // Precisei fazer com essa sintaxe [...] para qq mudanca ser enviada para o Render
    // Preciso criar um novo Array senao nao sensibiliza
    let dataTmp = [];
    for (let index = 0; index < datas.length; index++) {
      const element = datas[index];
      element.select = element.route === menuSelect.route || false;
      dataTmp.push(element);
    }
    setDatas(dataTmp);
  }

  // const onLogoutPressed = async () => {
    // this.setState({ spinner: true });    
    // const trataRet = trataRetorno(response, mostraMsg);
    // if (trataRet) {      
    //   global.navegarParaLogin(this.props.navigation);
    // }
    // this.setState({ spinner: false });
  // }

  const onSairPressed = async () => {
    RNExitApp.exitApp();
  }

  const evento = async (evento) => {
    switch (evento) {
      // case "LOGOUT":
      //   await onLogoutPressed();
      //   break;
      case "SAIR":
        await onSairPressed();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setDatas(dados);
  }, []);

  const renderMenu = (item) => {
    // let item = props.item;
    return (
      <ListItem
        containerStyle={{ backgroundColor: "transparent" }}
        // noBorder
        onPress={() => {
          item.evento
            ? evento(item.evento)
            : navegarClickMenu(item, {});
        }}
        style={item.select ? styles.itemSelect : styles.item}
      >
        <ListItem.Content style={{ flex: 1 }}>
          {item.iconFA5 ? (
            <FontAwesome5
              name={item.iconFA5}
              style={
                item.select ? styles.iconeSelect : styles.icone
              }
            />
          ) : (
            <Icon
              active
              name={item.icon}
              style={
                item.select ? styles.iconeSelect : styles.icone
              }
            />
          )}
        </ListItem.Content>

        <ListItem.Content style={{ flex: 5 }}>
          <Text
            style={item.select ? styles.textoSelect : styles.texto}
          >
            {item.name}
          </Text>
        </ListItem.Content>

      </ListItem>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: theme?.colors?.grey5,
      }}
      edges={['right', 'left', 'bottom']}
    >
      {/* <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../images/logo.png')}
          style={{ width: '70%', height: 100, tintColor: '#397af8' }}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: 25,
          paddingBottom: 5,
        }}
      >
        <Text
          style={{
            marginTop: 3,
          }}
        >
          Dark Mode
        </Text>

        <Switch
          style={{
            position: 'absolute',
            right: 5,
          }}
          value={ThemeState.themeMode === 'dark'}
          onValueChange={(val) => {
            if (val === true) {
              dispatch({ type: 'set-theme', payload: 'dark' });
            } else {
              dispatch({ type: 'set-theme', payload: 'light' });
            }
          }}
        />
      </View>
      <Divider style={{ marginTop: 15 }} /> */}

      <LinearGradient
        colors={[theme?.colors?.app_bg_dark, theme?.colors?.app_bg]}
        style={{ flex: 1, paddingTop: 0, marginTop: -5 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ flex: 1, marginTop: 15 }}>
          {datas.map((item, i) => (
            renderMenu(item)
          ))}
        </View>

        <View style={styles.menuSeparador} />

        <View style={{ flex: 1 }}>
          {dadosFinal.map((item, i) => (
            renderMenu(item)
          ))}
        </View>

      </LinearGradient>

      <View style={{ flex: 1 }}>
        {versaoApp.map((item, i) => (
          <ListItem
            containerStyle={{ borderBottomWidth: 0, backgroundColor: "transparent" }}
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <Text style={styles.textoVersao}>
                {item.name + DeviceInfo.getVersion()}
              </Text>
            </View>
          </ListItem>
        ))}
      </View>

      <LinearGradient
        colors={[theme?.colors?.app_bg_dark, theme?.colors?.app_bg]}
        style={{ flex: 1, paddingTop: 0, marginTop: -5 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ flex: 1, marginTop: 15 }}>
          {menuRNE.map((item, i) => (
            renderMenu(item)
          ))}
        </View>

      </LinearGradient>

    </SafeAreaView>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>
) {
  return (
    <DrawerContentScrollView {...props}>
      <CustomContentComponent {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
