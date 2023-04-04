
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Dimensions, TouchableOpacity } from 'react-native';
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderSomenteTexto } from '../../components/headerSomenteTexto';
import { logar } from "../core/utils";
import { theme } from "../core/theme";
import DeviceInfo from 'react-native-device-info';
import ContainerApp from '../core/components/ContainerApp';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

let SCREEN_HEIGHT = Dimensions.get("screen").height;

type LoginScreenProps = {};

const LoginScreen: React.FunctionComponent<LoginScreenProps> = ({ route, navigation }) => {

    const [spinner, setSpinner] = useState(false);

    const refresh = async (mensagem) => {
        const msg = mensagem.msg;
        const tipo = mensagem.tipo;
    }

    const navegar = (tela, params) => {
        navigation.navigate(tela, { ...params, onGoBack: (msg) => refresh(msg) });
    }    

    useEffect(() => {
        const { params } = route;
        const show_msg = params ? params.show_msg : params;


    }, []);

    const navegarClickMenu = (tela, params) => {
        logar(`Usuario clicou no item de menu: ${tela.name}`);

        const { navigate } = props.navigation;
        const rota = tela.route;
        const reload = tela.reload;
        navigate(rota, { ...params });
    }

    return (
        <>
            <ContainerApp>
                <HeaderSomenteTexto title="Câmera Cebraspe" view="Home" />

                <Spinner
                    visible={spinner}
                    textContent={"Aguarde..."}
                    textStyle={theme.spinnerTextStyle}
                />
                <FlatList
                    contentContainerStyle={{ backgroundColor: "transparent" }}
                    ListHeaderComponent={
                        <>
                            <View style={styles.parentElevado} >
                                <TouchableOpacity style={{ ...styles.listHomeOpcoes, marginEnd: 10 }} onPress={() => navegar('Grava Vídeos', {})}>
                                    <FontAwesome5
                                        name={"video"}
                                        size={120}
                                        color={theme.colors.laranja_cebraspe}
                                    />
                                    <Text style={{ fontWeight: "bold" }}>Gravar Vídeo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.listHomeOpcoes} onPress={() => navegar('Lista Vídeos', {})}><FontAwesome5
                                    name={"list"}
                                    size={120}
                                    color={theme.colors.laranja_cebraspe}
                                />
                                    <Text style={{ fontWeight: "bold" }}>Vídeos Gravados</Text></TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.listHomeOpcoes, marginStart: 10 }} onPress={() => navegar('Configurações', {})}><FontAwesome5
                                    name={"cogs"}
                                    size={120}
                                    color={theme.colors.laranja_cebraspe}
                                />
                                    <Text style={{ fontWeight: "bold" }}>Configurações</Text></TouchableOpacity>
                            </View>
                        </>
                    }
                    ListFooterComponent={
                        <>
                            {/* <View style={styles.bottomView}> */}
                            <View
                                style={{
                                    ...styles.parentFooter,
                                    backgroundColor: theme.colors.app_bg,
                                    width: "100%",
                                }}
                            >
                                <Text style={{ color: "#fff" }}>
                                    {"Versão: " + DeviceInfo.getVersion()}
                                </Text>
                            </View>
                            {/* </View> */}
                        </>
                    }
                    data={[]}
                    renderItem={({ item }) => (
                        <>
                        </>
                    )}
                    keyExtractor={(item) => item.name}
                />
                {/* {renderRodape()} */}
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
    listHome: {
        flex: 1,
        backgroundColor: "red",
        // width: "100%",
        justifyContent: "center",
        // alignItems: "center",
        flexDirection: "row",
        padding: 10,
        height: SCREEN_HEIGHT - 114
    },
    parentElevado: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", //Centered vertically
        alignItems: "center", // Centered horizontally
        padding: 10,
        overflow: "hidden",
        borderTopColor: "red",
    },
    listHomeOpcoes: {
        flex: 2,
        aspectRatio: 1,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: theme.colors.laranja_cebraspe,
        justifyContent: "center", //Centered vertically
        alignItems: "center", // Centered horizontally
        backgroundColor: theme.colors.app_bg_disable,
        shadowColor: theme.colors.laranja_cebraspe,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 15,
        // height: SCREEN_HEIGHT - 200
    },
    buttonContainer: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomView: {
        backgroundColor: theme.colors.container_bg,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0
    },
    parentFooter: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: 3
    },
});

export default LoginScreen;
