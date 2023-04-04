
import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dialog,
    CheckBox,
    ListItem,
    Avatar,
    Header,
    Text,
    Input,
    Switch,
    InputProps,
} from 'react-native-elements';
import { View, StyleSheet, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
// import { Header } from '../../components/header';
import { strNaoVazioValorMinimo, strNaoVazioValorMinimoSomenteNome, mostraMsg, mostraMsgForm, storeData, logar, getPastaArmazenamentoInterno, getPastaArmazenamentoExterno, getSDCardPathCameraCebraspeModule } from "../core/utils";
import LinearGradient from 'react-native-linear-gradient';
import { constants } from "../core/constants";
import { getPermissao_WRITE_EXTERNAL_STORAGE, getPermissao_READ_EXTERNAL_STORAGE } from "../core/permissoes";
import ContainerApp from '../core/components/ContainerApp';
import AlertaModalNovoSala from "../core/components/AlertaModalNovoSala";
import AlertaModalNovoUsuario from "../core/components/AlertaModalNovoUsuario";
import PararModal from '../core/components/PararModal';

import moment from "moment-timezone";
import Spinner from "react-native-loading-spinner-overlay";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { RNCamera } from "react-native-camera";
import { Stopwatch } from "react-native-stopwatch-timer";
var RNFS = require("react-native-fs");
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from '@react-native-community/clipboard';
import Orientation from 'react-native-orientation';
import { useToast } from "react-native-toast-notifications";

import { theme } from "../core/theme";

const flashModeOrder = {
    off: "torch",
    // on: "auto",
    // auto: "torch",
    torch: "off",
};

const wbOrder = {
    auto: "sunny",
    sunny: "cloudy",
    cloudy: "shadow",
    shadow: "fluorescent",
    fluorescent: "incandescent",
    incandescent: "auto",
};

const landmarkSize = 2;

//   let qualidadeSelect = constants.qualidade;
//   let ratioSelect = constants.ratio;
//   let videoBitRateSelect = constants.videoBitRate;

let currentTime;
let verificaEspacoDisco5s;
let camera;

// We are importing the native Java module here
import { NativeModules } from 'react-native';

type CespeVideoRecorderProps = {};

const CespeVideoRecorder: React.FunctionComponent<CespeVideoRecorderProps> = ({ route, navigation }) => {

    const { CameraCebraspeModule } = NativeModules;

    let alertaModalNovoSala = useRef();

    const Toast = useToast();

    const [spinner, setSpinner] = useState(false);

    const [flash, setFlash] = useState("off");
    const [zoom, setZoom] = useState(0);
    const [autoFocus, setAutoFocus] = useState("on");
    const [autoFocusPoint, setAutoFocusPoint] = useState({
        normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
            x: Dimensions.get("window").width * 0.5 - 32,
            y: Dimensions.get("window").height * 0.5 - 32,
        },
    });
    const [depth, setDepth] = useState(0);
    const [type, setType] = useState("back");
    const [whiteBalance, setWhiteBalance] = useState("auto");
    const [ratio, setRatio] = useState(ratioSelect);
    const [recordOptions, setRecordOptions] = useState({
        mute: false,
        // maxDuration: (40 * 60), // 40 minutos
        quality: RNCamera.Constants.VideoQuality[constants.qualidade],
        // orientation: "landscapeLeft"
        // Nova configuracao pra tentar diminuir o tamanho do video
        // Para Android, menor qualidade corresponding to the 480p (720 x 480) resolution
        // Com esse videoBitrate para videos de 10 Min ~30 M
        // Esse eh o videoBitRate Padrao
        // videoBitrate: 6*1000*1000
        // Abaixo o videoBitrate fixo definido pelo Cebraspe
        videoBitrate: constants.videoBitRate
    });
    const [isRecording, setIsRecording] = useState(false);
    const [noIntervalo, setNoIntervalo] = useState(false);
    const [canDetectFaces, setCanDetectFaces] = useState(false);
    const [canDetectText, setCanDetectText] = useState(false);
    const [canDetectBarCode, setCanDetectBarCode] = useState(false);
    const [faces, setFaces] = useState([]);
    const [textBlocks, setTextBlocks] = useState([]);
    const [barCodes, setBarCodes] = useState([]);
    const [timeStart, setTimeStart] = useState(false);
    const [stopwatchStart, setStopwatchStart] = useState(false);
    const [timerReset, setTimerReset] = useState(false);
    const [stopwatchReset, setStopwatchReset] = useState(false);
    const [flashHabilitado, setFlashHabilitado] = useState(false);
    const [zoomHabilitado, setZoomHabilitado] = useState(false);
    const [focoHabilitado, setFocoHabilitado] = useState(false);
    const [qualidadeSelect, setQualidadeSelect] = useState(constants.qualidade);
    const [ratioSelect, setRatioSelect] = useState(constants.ratio);
    const [videoBitRateSelect, setVideoBitRateSelect] = useState(constants.videoBitRate);
    const [isSchedule, setIsSchedule] = useState(false);
    const [isModalNovoUsuarioVisible, setIsModalNovoUsuarioVisible] = useState(false);
    const [isModalNovoSalaVisible, setIsModalNovoSalaVisible] = useState(false);
    const [isModalPararVisible, setIsModalPararVisible] = useState(false);
    const [codEvento, setCodEvento] = useState({ value: "", error: "" });
    const [idUsuario, setIdUsuario] = useState({ value: "", error: "" });
    const [idSala, setIdSala] = useState({ value: "", error: "" });
    const [codEventoSelect, setCodEventoSelect] = useState("");
    const [idUsuarioSelect, setIdUsuarioSelect] = useState("");
    const [idSalaSelect, setIdSalaSelect] = useState("");
    const [salaVisible, setSalaVisible] = useState(true);
    const [candidatoVisible, setCandidatoVisible] = useState(true);
    const [temSDCard, setTemSDCard] = useState(true);
    const [parouPorTelaPreta, setParouPorTelaPreta] = useState(false);
    const [nomeArquivoVideo, setNomeArquivoVideo] = useState("");
    const [jsonFormulario, setJsonFormulario] = useState({});
    const [uniqueValue, setUniqueValue] = useState(1);

    const InputFieldsStyle = {
        borderWidth: 0,
    };
    const inputProps = {};

    const toggleStopwatch = () => {
        setStopwatchStart(!stopwatchStart);
        setStopwatchReset(false);
    }

    const resetStopwatch = () => {
        setStopwatchStart(false);
        setStopwatchReset(true);
    }

    const refresh = async (mensagem) => {
        const msg = mensagem.msg;
        const tipo = mensagem.tipo;

        if (tipo == 'retorno_qrcode') {
            const tipoQrCode = msg && msg.tipoQrCode;

            console.log(`codEvento: ${msg.codEvento} - idUsuario: ${msg.idUsuario} - idSala: ${msg.idSala} - tipoQrCode: ${tipoQrCode}`);

            if (tipoQrCode === 'Candidato') {
                setCodEventoSelect(msg.codEvento);
                setIdUsuarioSelect(msg.idUsuario);

                storeData("@cod_evento", msg.codEvento);
                storeData("@id_usuario", msg.idUsuario);
            } else {
                setIdSalaSelect(msg.idSala);
                storeData("@id_sala", msg.idSala);

                let jsonFormulario = {};
                if (msg.jsonFormulario?.dados?.length > 0) {
                    // TODO: Mock. Apenas para teste, esses dados virão do QRCode
                    jsonFormulario = msg.jsonFormulario;
                    console.log(`- Json FORMULARIO Recebido: ${JSON.stringify(jsonFormulario)}`);
                }

                setJsonFormulario(jsonFormulario);
                storeData("@json_formulario", JSON.stringify(jsonFormulario));

            }

            storeData("@entrada_manual", "");

        } else if (msg.length > 0) {
            mostraMsg(msg, tipo, global.dropDownAlertRef);
        }

        setUniqueValue(uniqueValue + 1);
    }

    const navegar = (tela, params) => {
        navigation.navigate(tela, { ...params, onGoBack: (msg) => refresh(msg) });
    }

    const getFormattedTime = (time) => {
        currentTime = time;
    }

    const toggleFacing = () => {
        setType(type === "back" ? "front" : "back");
    }

    const toggleFlash = () => {
        setFlash(flashModeOrder[flash]);
    }

    const toggleWB = () => {
        setWhiteBalance(wbOrder[whiteBalance]);
    }

    const toggleFocus = () => {
        setAutoFocus(autoFocus === "on" ? "off" : "on");
    }

    const touchToFocus = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get("window").width;
        const screenHeight = Dimensions.get("window").height;
        const isPortrait = screenHeight > screenWidth;

        let x = pageX / screenWidth;
        let y = pageY / screenHeight;
        // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
        if (isPortrait) {
            x = pageY / screenHeight;
            y = -(pageX / screenWidth) + 1;
        }

        setAutoFocusPoint({
            normalized: { x, y },
            drawRectPosition: { x: pageX, y: pageY },
        });
    }

    const zoomOut = () => {
        setZoom(
            zoom - 0.1 < 0 ? 0 : zoom - 0.1,
        );
    }

    const zoomIn = () => {
        setZoom(
            zoom + 0.1 > 1 ? 1 : zoom + 0.1,
        );
    }

    const focusDepthOut = () => {
        const novoFocus = parseFloat((depth - 0.1 < 0 ? 0 : depth - 0.1).toFixed(1));
        setDepth(novoFocus);
    }

    const focusDepthIn = () => {
        const novoFocus = parseFloat((depth + 0.1 > 1 ? 1 : depth + 0.1).toFixed(1));
        setDepth(novoFocus);
    }

    const setFocusDepth = (depth) => {
        setDepth(depth);
    }

    const takePicture = async function () {
        if (camera) {
            const data = await camera.takePictureAsync();
            console.log("takePicture ", data);
        }
    };

    const getValidaPreenchimentoDadosQRCode = async () => {
        // Verifica soh os armazenados nas variaveis @
        const idSala = await AsyncStorage.getItem("@id_sala");
        const codEvento = await AsyncStorage.getItem("@cod_evento");
        const idUsuario = await AsyncStorage.getItem("@id_usuario");
        const idTelefone = await AsyncStorage.getItem("@id_telefone");

        const idSalaError = strNaoVazioValorMinimoSomenteNome(
            idSala,
            "Sala",
            5
        );
        const codEventoError = strNaoVazioValorMinimoSomenteNome(
            codEvento,
            "Evento",
            5
        );
        const idUsuarioError = strNaoVazioValorMinimoSomenteNome(
            idUsuario,
            "Inscrição",
            8
        );

        const idTelError = strNaoVazioValorMinimo(
            idTelefone,
            "Identificador do telefone",
            6
        );

        let msgErro = '';
        if (idTelError) {
            msgErro = `A identificação do telefone é obrigatória! Preencha o identificador do telefone acessando o item Configurações do menu.`;
            mostraMsg(msgErro, "error", global.dropDownAlertRef);
            logar(`Erro: Video nao iniciou pois, ${msgErro}`);
            return false;
        } else if (codEventoError || idUsuarioError || idSalaError) {
            msgErro = `Todos os campos devem ser preenchidos: ${idSalaError ? idSalaError + ', ' : ''}${codEventoError ? codEventoError + ', ' : ''}${idUsuarioError ? idUsuarioError + ', ' : ''}`;
            msgErro = msgErro.substring(0, msgErro.lastIndexOf(', '));
            mostraMsg(msgErro, "error", global.dropDownAlertRef);
            logar(`Erro: Video nao iniciou pois, ${msgErro}`);
            return false;
        }

        return { idSala, codEvento, idUsuario, idTelefone }

    }

    const verificaPosicaoHorizontal = async (callback) => {

        const orientacao = Orientation.getOrientation((err, orientation) => {
            Orientation.lockToLandscape();
            console.log(`ISPORTRAIT: ${orientation}`);

            const isPortrait = orientation === "PORTRAIT";

            if (isPortrait) {
                const msgErro = `Para iniciar a gravação, o celular precisa estar na horizontal!`;
                mostraMsg(msgErro, "error", global.dropDownAlertRef);
                logar(`Erro: Video nao iniciou pois, ${msgErro}`);
            } else {
                callback();
            }
        });

    }

    const takeVideo = async () => {
        Orientation.unlockAllOrientations();

        // Tentando essa solucao para o problema da gravacao tela preta        
        setUniqueValue(uniqueValue + 1);

        if (camera && !isRecording) {
            try {
                let folder = await getPastaArmazenamentoInterno();
                let folderExterno = await getPastaArmazenamentoExterno();

                let dados = await getValidaPreenchimentoDadosQRCode();
                if (!dados) {
                    console.log('Dados invalidos retornando!');
                    Orientation.lockToLandscape();
                    return;
                }

                let codEvento = dados.codEvento + '-';
                let idUsuario = dados.idUsuario + '-';
                let idSala = dados.idSala + '-';
                let idTelefone = dados.idTelefone + '-';

                let entradaManual = await AsyncStorage.getItem("@entrada_manual") || "";
                entradaManual = entradaManual === "M" ? ('-' + entradaManual) : "";

                console.log(`- Folder: ${folder.pasta}`);
                console.log(`== FOLDER INTERNO: ${folder.sucesso} - == FOLDER EXTERNO: ${folderExterno.sucesso} - `);

                // const thisPai = this;
                async function iniciarGravacao() {

                    const apiLevel = global.api_level;
                    let nomeArqVideo = folder.pasta + "/_temporario_" + "video.mp4";
                    // O ERRO ESTAVA AQUI, NAO POSSO PASSAR O PATH CARAIIIIIIIIIIIIII!!!!!!                    
                    // Olha a merda. No Android 11 nao posso passar o Path pra funcionar.
                    // No Android 12 sou abrigado a passar o Path
                    let options = { recordOptions };
                    if (apiLevel > 30) {
                        options = { recordOptions, path: nomeArqVideo };
                    }

                    // Records a video, saves it in your app's cache directory and returns a promise when stopRecording is called or either maxDuration or maxFileSize specified are reached.
                    const promise = camera.recordAsync(options);

                    if (promise) {
                        // KeepAwake.activate();
                        toggleStopwatch();

                        setIsRecording(true);
                        setParouPorTelaPreta(false);
                        setNomeArquivoVideo("");

                        // Caso volta a usar takeVideoSchedule retirar essa linha abaixo pois eh feito lah
                        verificaStopGravacaoDiscoCheio2s(folder.pasta);
                        // this.takeVideoSchedule(folder);

                        // monitoraLogCat();
                        if (apiLevel > 30) {
                            console.log(`- VERSAO DO ANDROID: [${apiLevel}]`);
                            verificaTamanhoArqTemporario(nomeArqVideo, 1);
                        }

                        logar(`Gravacao de video iniciada!`);

                        // hideNavigationBar();

                        const data = await promise;

                        // showNavigationBar();                    

                        setIsRecording(false);
                        setFlash("off");

                        try {
                            setSpinner(true);
                            const uri = data.uri.replace("file://", "");
                            console.log(`- URI: ${uri} - FOLDER INTERNO: ${folder.pasta} - EXTERNO: ${folderExterno.pasta}`);
                            const nomeArquivoDados = `${codEvento}${idSala}${idUsuario}${idTelefone}${moment(new Date()).format("DDMMYYHHmmss")}${entradaManual}.mp4`;
                            const novoNomeArqVideo = `${folder.pasta}/${nomeArquivoDados}`;

                            zeraCronometro();

                            if (!parouPorTelaPreta) {
                                await RNFS.moveFile(uri, novoNomeArqVideo);
                                const msgVideoArmazenadoInterno = `O vídeo foi armazenado em ${novoNomeArqVideo}.`;
                                let msgVideoArmazenadoExterno = '';

                                logar(`Gravacao de video finalizada! ${msgVideoArmazenadoInterno}${msgVideoArmazenadoExterno}`);

                                // TODO: Aqui chamada ao Modal de preencher formulario
                                console.log(`- CHAMANDO jsonFORM: ${JSON.stringify(jsonFormulario)}`);
                                if (jsonFormulario?.dados?.length > 0) {
                                    navegar("FormularioInfoScreen", { jsonFormulario: JSON.stringify(jsonFormulario), arquivoVideo: nomeArquivoDados, msgVideoSucesso: msgVideoArmazenadoInterno });
                                } else {
                                    mostraMsg(
                                        `${msgVideoArmazenadoInterno}${msgVideoArmazenadoExterno}`,
                                        "info",
                                        global.dropDownAlertRef7000
                                    );
                                }
                            }

                            setSpinner(false);

                            return true;

                        } catch (err) {
                            console.error(err);
                            setSpinner(false);
                        }

                        return true;
                    }

                }

                verificaPosicaoHorizontal(iniciarGravacao);

            } catch (err) {
                console.log(err);
                return false;
            }
        }
    };

    const mostraMsgPai = (mensagem, tipo) => {
        mostraMsg(
            mensagem,
            tipo,
            global.dropDownAlertRefNoClose
        );
    };

    const acabouVerificaVideoStopNormal = () => {
        console.log(`onRecordingEnd: A GRAVACAO ACABOU!`)
    }

    const verificaTamanhoArqTemporario = async (pathArqTemporario, contador) => {
        // console.log(`=> Iniciando verificaTamanhoArqTemporario: ${pathArqTemporario}`);
        const pai = this;
        let tamArqTemporario;
        let numTamArqTemporario;

        async function checaTamanhoArquivo() {
            let existe = await RNFS.exists(pathArqTemporario);
            if (existe) {
                tamArqTemporario = await RNFS.stat(pathArqTemporario);
                numTamArqTemporario = Number(tamArqTemporario.size);

                console.log(`== TamArqTemp: ${tamArqTemporario.size} - Count: ${contador} - Num: ${numTamArqTemporario} - ${numTamArqTemporario < 1000000}`);

                // Aqui verficar o tamanho apos mais ou menos 20 seg
                if (contador >= 6) {
                    if (numTamArqTemporario < 1000000) {
                        logar(`Gravacao parou porque o video estava com falha.`);
                        pai.setState({
                            parouPorTelaPreta: true
                        });
                        pai.stopVideo(2);
                    } else {
                        console.log(`== Tudo certo, arquivo OK!`);
                        return;
                    }
                }
            }

            contador += 1;
            pai.verificaTamanhoArqTemporario(pathArqTemporario, contador);
        }

        if (isRecording) {
            setTimeout(function () {
                checaTamanhoArquivo(pathArqTemporario);
            }, 3000);
        } else {
            return;
        }

    };

    const verificaStopGravacaoDiscoCheio2s = async folder => {
        const pai = this;
        verificaEspacoDisco5s = setInterval(async function () {
            const espacoLivreEmDisco = CameraCebraspeModule.getFreeExternalMemorySync(folder);
            // console.warn('2S: ' + espacoLivreEmDisco + ' - ' + folder);

            // - Camera PAI: props,context,refs,updater,getSupportedPreviewFpsRange,getAvailablePictureSizes,_onMountError,_onCameraReady,_onAudioInterrupted,_onTouch,_onAudioConnected,_onStatusChange,_onPictureSaved,_onObjectDetected,_onSubjectAreaChanged,_setReference,getStatus,hasFaCC,renderChildren,_lastEvents,_lastEventsTimes,_isMounted,state,_reactInternalFiber,_reactInternalInstance,_cameraRef,_cameraHandle
            // console.log(`- Camera PAI: - STATE: | ${pai.camera.state.isAuthorized} ${pai.camera.state.isAuthorizationChecked} ${pai.camera.state.recordAudioPermissionStatus} | - STATUS: ${pai.camera.getStatus()} | - ISMOUNTED: ${pai.camera._isMounted}`);

            const espacoBytes = parseInt(espacoLivreEmDisco);
            if (espacoBytes <= constants.espacoBytesDiscoCheio) {
                logar(`Sistema parou o video por falta de espaco em disco. Espaco em disco: ${espacoBytes}`);
                pai.stopVideo(1);
            }
        }, 2000);
    };

    const stopVideoCliqueBotao = async () => {
        logar(`Usuario clicou: parar video.`);
        // TODO: Descomentar qdo funconar
        // this.refs.pararModal.open();
        setIsModalPararVisible(true);
    };

    const simPressPararModal = () => {
        logar(`Usuario parou o video.`);
        stopVideo(0);
    }

    const startVideoCliqueBotao = async () => {

        const granted_WRITE_EXTERNAL_STORAGE = await getPermissao_WRITE_EXTERNAL_STORAGE();
        const granted_READ_EXTERNAL_STORAGE = await getPermissao_READ_EXTERNAL_STORAGE();

        if (granted_WRITE_EXTERNAL_STORAGE &&
            granted_READ_EXTERNAL_STORAGE === PermissionsAndroid.RESULTS.GRANTED) {
            logar(`Usuario clicou: iniciar video.`);
            takeVideoACada10Minutos();
        } else {
            logar(`Usuario nao confirmou as permissoes necessarias para a gravacao.`);
            mostraMsgForm("Preciso de todas as permissões para continuar.", true, Toast);
            return false;
        }
    }

    const takeVideoACada10Minutos = async () => {
        let folder = await getPastaArmazenamentoInterno();
        const espacoLivreEmDisco = CameraCebraspeModule.getFreeExternalMemorySync(folder.pasta);

        console.log(`S1 [takeVideoACada10Minutos]: ${espacoLivreEmDisco} - ${folder.pasta}`);

        const espacoBytes = parseInt(espacoLivreEmDisco);
        if (espacoBytes <= constants.espacoBytesDiscoCheio) {
            logar(`Video nao iniciou por falta de espaco em disco. Espaco em disco: ${espacoBytes}`);
            stopVideo(1);
        } else {
            takeVideo();
        }
    }


    // facesDetected = ({ faces }) => setFaces({ faces });

    const renderBarcode = ({ bounds, data, type }) => (
        <React.Fragment key={data + bounds.origin.x}>
            <View
                style={[
                    styles.text,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            >
                <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
            </View>
        </React.Fragment>
    );

    const mudancaStatus = object => {
        console.log(`=> onStatusChange: STATUS MUDOU: ${object.cameraStatus} - ${object.recordAudioPermissionStatus}`);
    };

    const renderRecording = () => {
        // const action = isRecording ? this.stopVideo : this.takeVideo;
        const action = isRecording ? stopVideoCliqueBotao : startVideoCliqueBotao;
        return (
            <TouchableOpacity
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    backgroundColor: isRecording ? "red" : "#FFF",
                    borderRadius: 50
                }}
                onPress={() => action()}
            />
        );
    };

    const renderInfoDados = () => {
        return (
            <View style={{ flex: 1, width: "100%" }}>
                <View style={{ flexDirection: "row" }} >
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>Sala:</Text>
                    </View>
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>{idSalaSelect}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }} >
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>Evento:</Text>
                    </View>
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>{codEventoSelect}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }} >
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>Inscrição:</Text>
                    </View>
                    <View style={{ flex: 3 }} >
                        <Text numberOfLines={1} style={{ color: isRecording ? "red" : "#fff" }}>{idUsuarioSelect}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderCronometro = () => {
        return (
            <View style={{ flex: 1, width: "100%" }}>
                <View style={{
                    flex: 1,
                    // backgroundColor: "yellow",
                    alignItems: "flex-end",
                    justifyContent: "center"
                }} >
                    <Stopwatch laps start={stopwatchStart}
                        reset={stopwatchReset}
                        options={{
                            container: {
                                backgroundColor: "transparent",
                                padding: 5,
                            },
                            text: {
                                fontSize: 32,
                                color: isRecording ? "red" : "#FFF",
                            }
                        }}
                        getTime={getFormattedTime} />
                </View>
            </View>
        );
    }

    const setResetarCronometro = (resetar) => {
        resetStopwatch();
        setStopwatchReset(resetar);
    }

    const zeraCronometro = () => {
        clearInterval(verificaEspacoDisco5s);
        setIsRecording(false);
        setIsSchedule(false);
        setResetarCronometro(true);
        if (!parouPorTelaPreta) {
            zeraDadosQRCode();
        }
    }

    const zeraDadosQRCode = async () => {
        storeData("@id_sala", "");
        storeData("@cod_evento", "");
        storeData("@id_usuario", "");
        storeData("@entrada_manual", "");
        storeData("@json_formulario", "");

        setCodEventoSelect("");
        setIdUsuarioSelect("");
        setIdSalaSelect("");
        setCodEvento({ ...codEvento, error: "", value: "" });
        setIdUsuario({ ...idUsuario, error: "", value: "" });
        setIdSala({ ...idSala, error: "", value: "" });
        setNomeArquivoVideo("");
        setJsonFormulario([]);
    }

    const stopVideo = async (tipo) => {

        // 0: Parou Normal
        // 1: Disco Cheio
        // 2: Tela preta

        // TODO: Implementar esse Modal
        // this.refs.pararModal.close();
        setIsModalPararVisible(false);

        console.log(`- CHAMEI stopVideo: ${isRecording} - ${isSchedule}`);
        console.log(`- TIPO: ${tipo}`);

        setSpinner(true);
        await camera.stopRecording();
        setSpinner(false);

        if (tipo === 1) {
            console.warn(`Saindo da gravacao! Disco cheio!`);
            mostraMsgPai(
                "Sem espaço em disco! Libere espaço em disco e tente novamente!",
                "warn"
            );
        } else if (tipo === 2) {
            console.warn(`Saindo da gravacao! Falha: Tela preta!`);
            mostraMsgPai(
                "Falha na gravação do vídeo! Reinicie a gravação!",
                "warn"
            );
        }
    };

    const renderRecBtn = () => {
        return <Text style={styles.flipText}> Gravar </Text>;
    }

    const prepareRatio = async () => {
        if (camera) {
            const ratios = await camera.getSupportedRatiosAsync();
            global.ratios = ratios;

            // See if the current device has your desired ratio, otherwise get the maximum supported one
            // Usually the last element of "ratios" is the maximum supported ratio
            // const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];

            //this.setState({ ratio });
        }
    }

    const onInformarManualCandidatoPressed = async () => {
        setCodEvento({ ...codEvento, error: "", value: "" });
        setIdUsuario({ ...idUsuario, error: "", value: "" });
        setIsModalNovoUsuarioVisible(true);
    }

    const onInformarManualSalaPressed = async () => {
        setIdSala({ ...idSala, error: "", value: "" });
        setIsModalNovoSalaVisible(true);
    }

    const zeraErrosAnteriores = async () => {
        setCodEvento({ ...codEvento, error: "" });
        setIdUsuario({ ...idUsuario, error: "" });
        setIdSala({ ...idSala, error: "" });
        return;
    }

    const onConfirmNovoUsuarioPressed = async () => {
        await zeraErrosAnteriores();

        const codEventoError = strNaoVazioValorMinimo(
            codEvento.value,
            "Código do Evento",
            5
        );
        const idUsuarioError = strNaoVazioValorMinimo(
            idUsuario.value,
            "Inscrição do Candidato",
            8
        );

        if (codEventoError) {
            setCodEvento({ ...codEvento, error: codEventoError });
            mostraMsgForm(codEventoError, true, Toast);
            return;
        } else if (idUsuarioError) {
            setIdUsuario({ ...idUsuario, error: idUsuarioError });
            mostraMsgForm(idUsuarioError, true, Toast);
            return;
        }

        setCodEventoSelect(codEvento.value);
        setIdUsuarioSelect(idUsuario.value);

        storeData("@cod_evento", codEvento.value);
        storeData("@id_usuario", idUsuario.value);
        storeData("@entrada_manual", "M");

        setIsModalNovoUsuarioVisible(false);
    }

    const onConfirmNovoSalaPressed = async () => {
        await zeraErrosAnteriores();

        const idSalaError = strNaoVazioValorMinimo(
            idSala.value,
            "Identificador da Sala",
            5
        );

        if (idSalaError) {
            setIdSala({ ...idSala, error: idSalaError });
            mostraMsgForm(idSalaError, true, Toast);
            return;
        }

        setIdSalaSelect(idSala.value);

        storeData("@id_sala", idSala.value);

        setIsModalNovoSalaVisible(false);
    }

    const renderModalBodyNovoUsuario = () => {
        Clipboard.setString(' ');
        return (
            <ListItem.Content style={{ flexDirection: "row" }} >
                <Input
                    containerStyle={[styles.inputModalBodyNovoUsuario]}
                    style={InputFieldsStyle}
                    inputStyle={styles.inputTextModal}
                    label="Cód. Evento"
                    labelStyle={styles.textLabelModal}
                    maxLength={5}
                    value={codEvento.value}
                    returnKeyType="next"
                    onChangeText={(text: string) => setCodEvento({ ...codEvento, error: "", value: text.trim() })}
                    errorMessage={codEvento.error.length > 0 ? codEvento.error : undefined}
                />

                <Input
                    containerStyle={[styles.inputModalBodyNovoUsuario]}
                    style={InputFieldsStyle}
                    inputStyle={styles.inputTextModal}
                    label="Inscrição"
                    labelStyle={styles.textLabelModal}
                    maxLength={8}
                    value={idUsuario.value}
                    returnKeyType="next"
                    onChangeText={(text: string) => setIdUsuario({ ...idUsuario, error: "", value: text.trim() })}
                    errorMessage={idUsuario.error.length > 0 ? idUsuario.error : undefined}
                />

            </ListItem.Content>
        );
    };

    const renderModalBodyNovoSala = () => {
        Clipboard.setString(' ');
        // console.log('-- Renderizando renderModalBodyNovoSala --');
        return (
            <ListItem.Content>
                <Input
                    containerStyle={[styles.inputContainerStyle]}
                    style={InputFieldsStyle}
                    inputStyle={styles.inputTextModal}
                    label="Identificador da Sala"
                    labelStyle={styles.textLabelModal}
                    maxLength={5}
                    value={idSala.value}
                    onChangeText={(text: string) => setIdSala({ ...idSala, error: "", value: text.trim() })}
                    errorMessage={idSala.error.length > 0 ? idSala.error : undefined}
                />
            </ListItem.Content>
        );
    };

    const recarregaConfiguracoesTela = async () => {
        console.log("-- RECARREGANDO A CAMERA E CONFIGURACOES! --");

        // showNavigationBar();

        const selecaoVazia = '[{"id":"Vazio"}]';
        const selecoes = await AsyncStorage.getItem("@selecoes_key") || selecaoVazia;
        const selecoesStorage = JSON.parse(selecoes);
        const qualidade = qualidadeSelect;
        const ratio = ratioSelect;

        const videoBitRate = videoBitRateSelect;

        const codEvento = await AsyncStorage.getItem("@cod_evento") || codEventoSelect;
        const idUsuario = await AsyncStorage.getItem("@id_usuario") || idUsuarioSelect;
        const idSala = await AsyncStorage.getItem("@id_sala") || idSalaSelect;
        const jsonFormulario = await AsyncStorage.getItem("@json_formulario") || jsonFormulario;

        console.log(`- Qualidade: ${qualidade} - Ratio: ${ratio}`);

        setQualidadeSelect(qualidade);
        setRatioSelect(ratio);
        setVideoBitRateSelect(videoBitRate);
        setRatio(ratio);
        setCodEventoSelect(codEvento);
        setIdUsuarioSelect(idUsuario);
        setIdSalaSelect(idSala);
        setJsonFormulario(jsonFormulario);
        setIsRecording(isRecording);
        setIsSchedule(isSchedule);

        setCodEvento({ error: "", value: codEvento });
        setIdUsuario({ error: "", value: idUsuario });
        setIdSala({ error: "", value: idSala });

        console.log(`= Na Camera, setando videoBitRate para [${videoBitRate}] e qualidade para [${qualidade}]`);

        setRecordOptions({
            ...recordOptions,
            quality: RNCamera.Constants.VideoQuality[qualidade],
            videoBitrate: videoBitRate === "default" ? (6 * 1000 * 1000) : parseInt(videoBitRate)
        });


        // Verifica Zoom   
        const selecaoZoom = selecoesStorage.find(
            (o) => o.id === "FUNC_ZOOM"
        );
        if (selecaoZoom) {
            setZoomHabilitado(selecaoZoom.selecionado);
        }

        // Verifica Flash   
        const selecaoFlash = selecoesStorage.find(
            (o) => o.id === "FUNC_FLASH"
        );
        if (selecaoFlash) {
            setFlashHabilitado(selecaoFlash.selecionado);
        }

        // Verifica Foco
        const selecaoFoco = selecoesStorage.find(
            (o) => o.id === "FUNC_FOCO"
        );
        if (selecaoFoco) {
            setFocoHabilitado(selecaoFoco.selecionado);
        }

        setZoom(0);
        setFlash("off");
    }

    const verificaExisteSDCard = async () => {
        // Verifica se tem armazenamento externo SD Card
        console.log(`== CespeVideoRecorder: verificaExisteSDCard`);
        setTemSDCard(true);
        try {
            await getSDCardPathCameraCebraspeModule();
        } catch (err) {
            setTemSDCard(false);
            logar(`Info: Camera - Nao existe armazenamento externo. Apenas interno.`);
        }
    }

    // componentWillReceiveProps
    useEffect(() => {
        recarregaConfiguracoesTela();
        verificaExisteSDCard();
        setIsModalNovoSalaVisible(false);
    }, [navigation]);

    useEffect(() => {
        const { params } = route;
        const show_msg = params ? params.show_msg : params;
        if (show_msg) {
            mostraMsg(show_msg.msg, show_msg.tipo, global.dropDownAlertRef);
        }
        setIsModalNovoSalaVisible(false);
    }, []);

    // TODO: Esse codigo estava dentro do Render, rever isso
    const drawFocusRingPosition = {
        top: autoFocusPoint.drawRectPosition.y - 32,
        left: autoFocusPoint.drawRectPosition.x - 32,
    };

    return (
        <>
            <ContainerApp>
                <View style={styles.containerCamera}>
                    <RNCamera
                        key={uniqueValue}
                        ref={ref => {
                            camera = ref;
                        }}
                        onCameraReady={prepareRatio} // You can only get the supported ratios when the camera is mounted
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                        }}
                        type={type}
                        flashMode={flash}
                        autoFocus={autoFocus}
                        autoFocusPointOfInterest={autoFocusPoint.normalized}
                        zoom={zoom}
                        whiteBalance={whiteBalance}
                        ratio={ratio}
                        focusDepth={depth}
                        androidCameraPermissionOptions={{
                            title: "Permissão para uso da câmera",
                            message: "Precisamos da sua permissão para usar a sua câmera",
                            buttonPositive: "Sim",
                            buttonNegative: "Não",
                        }}
                        faceDetectionLandmarks={
                            RNCamera.Constants.FaceDetection.Landmarks
                                ? RNCamera.Constants.FaceDetection.Landmarks.all
                                : undefined
                        }
                        onFacesDetected={canDetectFaces ? facesDetected : null}
                        onTextRecognized={canDetectText ? textRecognized : null}
                        // onGoogleVisionBarcodesDetected={canDetectBarcode ? barcodeRecognized : null}
                        onRecordingEnd={acabouVerificaVideoStopNormal}
                        onStatusChange={mudancaStatus}
                        onMountError={() => console.log(`onMountError: MOUNT ERROR!`)}
                    >

                        {focoHabilitado &&
                            <View style={StyleSheet.absoluteFill}>
                                <TouchableWithoutFeedback onPress={touchToFocus.bind(this)}>
                                    <View style={{ flex: 1 }} />
                                </TouchableWithoutFeedback>
                                <View style={[styles.boxFoco, drawFocusRingPosition]}>
                                    <Text style={{ color: "#fff", marginBottom: 5 }}>Foco</Text>
                                    <View style={styles.autoFocusBox}>
                                        <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50 }]}
                                            onPress={focusDepthOut.bind(this)}
                                        >
                                            <Text style={styles.flipText}>-</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50, borderWidth: 0 }]}
                                        >
                                            <Text style={styles.flipText}>{depth}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50 }]}
                                            onPress={focusDepthIn.bind(this)}
                                        >
                                            <Text style={styles.flipText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }

                        {!isRecording &&
                            <TouchableOpacity style={styles.botaoMenu} onPress={() => navegar('Home', {})}>
                                <FontAwesome5
                                    name={"home"}
                                    size={25}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        }

                        {/* <View
          style={{
            flex: 0.5,
            height: 72,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity style={styles.flipButton} onPress={toggleFacing.bind(this)}>
              <Text style={styles.flipText}> FLIP </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={toggleFlash.bind(this)}>
              <Text style={styles.flipText}> FLASH: {flash} </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={toggleWB.bind(this)}>
              <Text style={styles.flipText}> WB: {whiteBalance} </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity onPress={toggle("canDetectFaces")} style={styles.flipButton}>
              <Text style={styles.flipText}>
                {!canDetectFaces ? "Detect Faces" : "Detecting Faces"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggle("canDetectText")} style={styles.flipButton}>
              <Text style={styles.flipText}>
                {!canDetectText ? "Detect Text" : "Detecting Text"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggle("canDetectBarcode")} style={styles.flipButton}>
              <Text style={styles.flipText}>
                {!canDetectBarcode ? "Detect Barcode" : "Detecting Barcode"}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

                        <View style={{ ...styles.bottomView, backgroundColor: isRecording ? "transparent" : theme.colors.txt_disable }}>

                            <Spinner
                                visible={spinner}
                                textContent={"Aguarde..."}
                                textStyle={theme.spinnerTextStyle}
                            />

                            <View style={{
                                flex: 2.5,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {renderInfoDados()}
                            </View>

                            <View style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {renderRecording()}
                            </View>

                            <View style={{ flex: 2.5 }} >
                                {renderCronometro()}
                            </View>

                            {/* <ViewContent
            style={{
              height: 20,
              // backgroundColor: "transparent",
              backgroundColor: "green",
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Slider
              style={{ width: 150, marginTop: 15, alignSelf: "flex-end" }}
              onValueChange={setFocusDepth.bind(this)}
              step={0.1}
              disabled={autoFocus === "on"}
            />
          </View> */}
                            {/* <View
            style={{
              height: 56,
              // backgroundColor: "transparent",
              backgroundColor: "blue",
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          > */}

                            {/* <View
            style={{
              // height: 20,
              // backgroundColor: "transparent",
              backgroundColor: "green",
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Text>Teste</Text>
          </View> */}
                            {/* </View> */}
                            {/* {zoom !== 0 && (
            <Text style={[styles.flipText, styles.zoomText]}>Zoom: {zoom}</Text>
          )} */}
                        </View>

                        <View style={styles.viewComponentes}>

                            <View style={styles.viewsBotoesCamera} >

                                {flashHabilitado &&
                                    <View style={styles.viewFuncionalidades}>
                                        {/* <Text style={{ color: "#fff" }}>Flash</Text> */}

                                        {/* <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50 }]}
                                            onPress={toggleFlash.bind(this)}
                                        >
                                            <Text style={styles.flipText}>
                                                {flash === 'torch' ? 'on' : 'off'}
                                            </Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity style={[styles.flipButton, { borderColor: flash === 'torch' ? theme.colors.app_flash_enable : theme.colors.app_flash_disable, width: 50 }]} onPress={toggleFlash.bind(this)}>
                                            <FontAwesome5
                                                name={"bolt"}
                                                size={25}
                                                color={flash === 'torch' ? theme.colors.app_flash_enable : theme.colors.app_flash_disable}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }

                                {zoomHabilitado &&
                                    <View style={styles.viewFuncionalidades}>
                                        <Text style={{ color: "#fff" }}>Zoom</Text>
                                        <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50 }]}
                                            onPress={zoomIn.bind(this)}
                                        >
                                            <Text style={styles.flipText}>+</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.flipButton, { height: 30, width: 50 }]}
                                            onPress={zoomOut.bind(this)}
                                        >
                                            <Text style={styles.flipText}>-</Text>
                                        </TouchableOpacity>
                                    </View>}
                            </View>

                            <View style={styles.viewsCandidatoSala} >

                                {!isRecording &&
                                    <View style={styles.viewCandidato} >
                                        <TouchableOpacity
                                            style={styles.viewTituloCandidato}
                                            onPress={() =>
                                                setSalaVisible(!salaVisible)
                                            }>
                                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Sala</Text>
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    paddingHorizontal: 5,
                                                    position: "absolute",
                                                    right: 0
                                                }}>
                                                <FontAwesome5
                                                    name={salaVisible ? "chevron-down" : "chevron-right"}
                                                    size={15}
                                                    color="#fff"
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {salaVisible &&
                                            <View style={styles.viewBotaoCandidato} >
                                                <Button
                                                    title="QR Code"
                                                    buttonStyle={{
                                                        backgroundColor: theme.colors.btn_outros,
                                                        marginBottom: 10,
                                                        borderColor: 'transparent',
                                                        borderWidth: 0,
                                                        borderRadius: 30
                                                    }}
                                                    containerStyle={{
                                                        width: "100%"
                                                    }}
                                                    titleStyle={{
                                                        color: 'white'
                                                    }}
                                                    icon={<FontAwesome5 name="qrcode" size={20} color="#fff" style={{ marginLeft: 10 }} />}
                                                    iconRight
                                                    iconContainerStyle={{ marginLeft: 10 }}
                                                    onPress={() => navegar("QRCodeScreen", { tipoQrCode: "Sala" })}
                                                >
                                                </Button>
                                                <Button
                                                    title="Manual"
                                                    buttonStyle={{
                                                        backgroundColor: theme.colors.btn_outros,
                                                        borderColor: 'transparent',
                                                        borderWidth: 0,
                                                        borderRadius: 30
                                                    }}
                                                    containerStyle={{
                                                        width: "100%"
                                                    }}
                                                    titleStyle={{
                                                        color: 'white'
                                                    }}
                                                    onPress={() => onInformarManualSalaPressed()}
                                                >
                                                </Button>
                                            </View>
                                        }
                                    </View>
                                }

                                {!isRecording &&
                                    <View style={styles.viewCandidato} >
                                        <TouchableOpacity
                                            style={styles.viewTituloCandidato}
                                            onPress={() =>
                                                setCandidatoVisible(!candidatoVisible)
                                            }>
                                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Candidato</Text>
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    paddingHorizontal: 5,
                                                    position: "absolute",
                                                    right: 0
                                                }}>
                                                <FontAwesome5
                                                    name={candidatoVisible ? "chevron-down" : "chevron-right"}
                                                    size={15}
                                                    color="#fff"
                                                />
                                            </View>
                                        </TouchableOpacity>



                                        {candidatoVisible &&
                                            <View style={styles.viewBotaoCandidato} >
                                                <Button
                                                    title="QR Code"
                                                    buttonStyle={{
                                                        backgroundColor: theme.colors.btn_outros,
                                                        marginBottom: 10,
                                                        borderColor: 'transparent',
                                                        borderWidth: 0,
                                                        borderRadius: 30
                                                    }}
                                                    containerStyle={{
                                                        width: "100%"
                                                    }}
                                                    titleStyle={{
                                                        color: 'white'
                                                    }}
                                                    icon={<FontAwesome5 name="qrcode" size={20} color="#fff" style={{ marginLeft: 10 }} />}
                                                    iconRight
                                                    iconContainerStyle={{ marginLeft: 10 }}
                                                    onPress={() => navegar("QRCodeScreen", { tipoQrCode: "Candidato" })}
                                                >
                                                </Button>
                                                <Button
                                                    title="Manual"
                                                    buttonStyle={{
                                                        backgroundColor: theme.colors.btn_outros,
                                                        borderColor: 'transparent',
                                                        borderWidth: 0,
                                                        borderRadius: 30
                                                    }}
                                                    containerStyle={{
                                                        width: "100%"
                                                    }}
                                                    titleStyle={{
                                                        color: 'white'
                                                    }}
                                                    onPress={() => onInformarManualCandidatoPressed()}
                                                >
                                                </Button>
                                            </View>
                                        }
                                    </View>
                                }

                            </View>

                        </View>
                    </RNCamera>
                </View>
            </ContainerApp>

            <AlertaModalNovoUsuario
                swipeArea={50}
                titulo={'Candidato'}
                onConfirmNovoUsuarioPressed={() =>
                    onConfirmNovoUsuarioPressed()
                }
                isOpen={isModalNovoUsuarioVisible}
                onOpened={() => {
                    setIsModalNovoUsuarioVisible(true);
                }}
                onClosed={() => {
                    setIsModalNovoUsuarioVisible(false);
                }}
                childComp={renderModalBodyNovoUsuario()}
            >
            </AlertaModalNovoUsuario>

            <AlertaModalNovoSala
                swipeArea={50}
                titulo={'Sala'}
                onConfirmNovoSalaPressed={() =>
                    onConfirmNovoSalaPressed()
                }
                isOpen={isModalNovoSalaVisible}
                onOpened={() => {
                    console.log('= Abri o Modal! =')
                    setIsModalNovoSalaVisible(true);
                }}
                onClosed={() => {
                    console.log('= Fechei o Modal! =');
                    setIsModalNovoSalaVisible(false);
                }}
                childComp={renderModalBodyNovoSala()}
            >
            </AlertaModalNovoSala>

            <PararModal
                isOpen={isModalPararVisible}
                onOpened={() => {
                    setIsModalPararVisible(true);
                }}
                onClosed={() => {
                    setIsModalPararVisible(false);
                }}
                simPress={() => simPressPararModal()}
                mensagem={"Tem certeza que deseja parar o vídeo?"}
            />

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: theme.colors.app_bg,
    },
    containerCamera: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        borderColor: "white",
        borderWidth: 1,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    viewComponentes: {
        flex: 1,
        left: 15,
        right: 15,
        flexDirection: "row",
        bottom: 110
    },
    viewsBotoesCamera: {
        width: "30%",
        position: "absolute",
        alignItems: "flex-start",
        bottom: 0,
        // backgroundColor: "yellow"
    },
    viewFuncionalidades: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10
    },
    viewsCandidatoSala: {
        width: "50%",
        flexDirection: "row",
        position: "absolute",
        paddingTop: 10,
        alignItems: "flex-end",
        justifyContent: "center",
        alignSelf: "flex-end",
        right: 20,
        bottom: 0,
        // backgroundColor: "yellow"
    },
    viewCandidato: {
        flex: 1,
        width: 150,
        padding: 5,
        borderRadius: 8,
        borderColor: "white",
        borderWidth: 1,
        marginTop: 10,
        marginRight: 10
    },
    viewTituloCandidato: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.app_bg,
        borderRadius: 10
    },
    viewBotaoCandidato: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        // backgroundColor: "red"
    },
    autoFocusBox: {
        // position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 60,
        width: 130,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "white",
        opacity: 0.4,
        flexWrap: "wrap",
        // backgroundColor: "blue"
        backgroundColor: "transparent"
    },
    boxFoco: {
        flex: 1,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 5,
        // opacity: 1,
        // backgroundColor: "yellow",
        backgroundColor: "transparent"
    },
    flipText: {
        color: "white",
        fontSize: 15,
    },
    zoomText: {
        position: "absolute",
        bottom: 70,
        zIndex: 2,
        left: 2,
    },
    configsText: {
        position: "absolute",
        bottom: 90,
        left: 15,
    },
    botaoMenu: {
        position: "absolute",
        top: 35,
        right: 15,
    },
    viewUsuarioAtual: {
        flex: 1,
        position: "absolute",
        backgroundColor: "white",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 3,
        right: 15
    },
    picButton: {
        backgroundColor: "darkseagreen",
    },
    facesContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: "absolute",
        borderColor: "#FFD700",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: "absolute",
        backgroundColor: "red",
    },
    faceText: {
        color: "#FFD700",
        fontWeight: "bold",
        textAlign: "center",
        margin: 10,
        backgroundColor: "transparent",
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: "absolute",
        borderColor: "#F00",
        justifyContent: "center",
    },
    textBlock: {
        color: "#F00",
        position: "absolute",
        textAlign: "center",
        backgroundColor: "transparent",
    },
    bottomView: {
        backgroundColor: theme.colors.txt_disable,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        padding: 10,
        flexDirection: "row"
    },
    labelForm: {
        fontWeight: "bold",
        fontSize: 16,
    },
    itemInputContainer: {
        marginVertical: 5,
    },
    parent: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
        justifyContent: "space-between",
        overflow: "hidden",
    },
    parentModalBody: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red"
    },
    inputModalBodyNovoUsuario: {
        flex: 2,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainerStyle: {
        marginTop: 10,
        // width: '100%',
    },
    viewLabelModal: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,

    },
    textLabelModal: {
        color: theme.colors.card_info_texto,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
    inputTextModal: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
    }
});

export default CespeVideoRecorder;
