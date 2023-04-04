
import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    CheckBox,
    ListItem,
    Avatar,
    Header
} from 'react-native-elements';
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native';
// import { Header } from '../../components/header';
import { strNaoVazioValorMinimo, mostraMsg, mostraMsgForm, storeData, storeJson, logar, getPastaArmazenamentoExterno, getPastaArmazenamentoInterno } from "../core/utils";
import LinearGradient from 'react-native-linear-gradient';
import LogoTelaDescanso from "../core/components/LogoTelaDescanso";
import { theme } from "../core/theme";
import DeviceInfo from 'react-native-device-info';
import { hideNavigationBar, showNavigationBar } from "react-native-navigation-bar-color";
import { getPermissao_WRITE_EXTERNAL_STORAGE, getPermissao_READ_EXTERNAL_STORAGE } from "../core/permissoes";
import ContainerApp from '../core/components/ContainerApp';

type LoginScreenProps = {};

const LoginScreen: React.FunctionComponent<LoginScreenProps> = ({ route, navigation }) => {

    const [spinner, setSpinner] = useState(false);

    const navegar = (tela, params) => {
        navigation.navigate(tela, { ...params });
    }

    const verificaSeJaLogado = async () => {
        //Verifica se está logado
        setSpinner(true);

        // Configuracoes para Log
        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        const granted_WRITE_EXTERNAL_STORAGE = await getPermissao_WRITE_EXTERNAL_STORAGE();
        const granted_READ_EXTERNAL_STORAGE = await getPermissao_READ_EXTERNAL_STORAGE();

        if (granted_WRITE_EXTERNAL_STORAGE &&
            granted_READ_EXTERNAL_STORAGE === PermissionsAndroid.RESULTS.GRANTED) {

            console.log(`-- Permissoes já concedidas --`);

            let folder = await getPastaArmazenamentoInterno();
            const fileName = `${folder.pasta}/logs_${date}-${month}-${year}.txt`;
            global.log_filename = fileName;

            let folderExterno = await getPastaArmazenamentoExterno();
            const fileNameExterno = folderExterno.sucesso ? `${folderExterno.pasta}/logs_${date}-${month}-${year}.txt` : undefined;
            global.log_filename_externo = fileNameExterno;

            console.log(`-- Aplicação iniciada --`);
            logar(`Aplicacao iniciada.`);

            // navegar("Lista Vídeos");
            navegar("Home");
        }

        const apiLevel = DeviceInfo.getApiLevelSync();
        global.api_level = apiLevel;
        const versionApp = DeviceInfo.getVersion();

        console.log(`== API LEVEL: ${apiLevel} - ${versionApp}`);

        setSpinner(false);
    }

    useEffect(() => {
        const { params } = route;
        const show_msg = params ? params.show_msg : params;
        hideNavigationBar();
        if (show_msg) {
            mostraMsg(show_msg.msg, show_msg.tipo, global.dropDownAlertRef);
        } else {
            verificaSeJaLogado();
        }

    }, []);

    return (
        <>
        <Header backgroundColor={ theme.colors.app_bg } containerStyle={{ height: 8 }}  />
        <ContainerApp>
            <LinearGradient                
                colors={[
                    theme.colors.app_bg,
                    "#fff",
                    // "#fff",
                    theme.colors.app_bg                    
                ]}
                // start={{ x: 0, y: 0 }}
                // end={{ x: 1, y: 1 }}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }}
            >
                <LogoTelaDescanso />
            </LinearGradient>
        </ContainerApp>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        width: 220,
        margin: 20,
    },
    buttonContainer: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
