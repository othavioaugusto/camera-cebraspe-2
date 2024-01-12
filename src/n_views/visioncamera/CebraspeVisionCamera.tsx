import * as React from 'react';
import { useRef, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import {
  CameraDeviceFormat,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  PhotoFile,
  sortFormats,
  useCameraDevices,
  useFrameProcessor,
  VideoFile,
} from 'react-native-vision-camera';
import { strNaoVazioValorMinimo, strNaoVazioValorMinimoSomenteNome, mostraMsg, mostraMsgFormAltoTipoNaCamera, mostraMsgForm, storeData, logar, getPastaArmazenamentoInterno, getPastaArmazenamentoExterno, getSDCardPathCameraCebraspeModule } from "../core/utils";
import { Camera, frameRateIncluded } from 'react-native-vision-camera';
import { CONTENT_SPACING, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from './Constants';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsForeground } from './hooks/useIsForeground';
import { StatusBarBlurBackground } from './views/StatusBarBlurBackground';
import { CaptureButton } from './views/CaptureButton.tsx';
import { PressableOpacity } from 'react-native-pressable-opacity';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
// import { examplePlugin } from './frame-processors/ExamplePlugin';
// import type { Routes } from './Routes';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/core';
import { constants } from '../core/constants';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

type CebraspeVisionCameraProps = {};

const CebraspeVisionCamera: React.FunctionComponent<CebraspeVisionCameraProps> = ({ route, navigation }) => {
  const camera = useRef<Camera>(null);

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
  const [format, setFormat] = useState();
  

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);
  const [fps, setFps] = useState(30);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  // const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  // const [enableNightMode, setEnableNightMode] = useState(false);

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  // const formats = useMemo<CameraDeviceFormat[]>(() => {
  //   if (device?.formats == null) return [];
  //   return device.formats.sort(sortFormats);
  // }, [device?.formats]);

  //#region Memos
  // const [is60Fps, setIs60Fps] = useState(true);
  // const fps = useMemo(() => {
  //   if (!is60Fps) return 30;

  //   if (enableNightMode && !device?.supportsLowLightBoost) {
  //     // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
  //     return 30;
  //   }

  //   const supportsHdrAt60Fps = formats.some((f) => f.supportsVideoHDR && f.frameRateRanges.some((r) => frameRateIncluded(r, 60)));
  //   if (enableHdr && !supportsHdrAt60Fps) {
  //     // User has enabled HDR, but HDR is not supported at 60 FPS.
  //     return 30;
  //   }

  //   const supports60Fps = formats.some((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, 60)));
  //   if (!supports60Fps) {
  //     // 60 FPS is not supported by any format.
  //     return 30;
  //   }
  //   // If nothing blocks us from using it, we default to 60 FPS.
  //   return 60;
  // }, [device?.supportsLowLightBoost, enableHdr, enableNightMode, formats, is60Fps]);

  // const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
  const supportsFlash = device?.hasFlash ?? false;
  // const supportsHdr = useMemo(() => formats.some((f) => f.supportsVideoHDR || f.supportsPhotoHDR), [formats]);
  // const supports60Fps = useMemo(() => formats.some((f) => f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))), [formats]);
  // const canToggleNightMode = enableNightMode
  //   ? true // it's enabled so you have to be able to turn it off again
  //   : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  //#endregion

  // const format = useMemo(() => {
  //   let result = formats;
  //   // if (enableHdr) {
  //   //   // We only filter by HDR capable formats if HDR is set to true.
  //   //   // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
  //   //   result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
  //   // }

  //   // find the first format that includes the given FPS
  //   const retorno = result.find((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, fps)));    
  //   console.log(`RETORNO_FORMAT: ${JSON.stringify(retorno)}`);

  //   return retorno;
  // // }, [formats, fps, enableHdr]);
  // }, [formats, fps]);

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );

  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const onMediaCaptured = useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      console.log(`Media captured! ${JSON.stringify(media)}`);
      navigation.navigate('MediaPage', {
        path: media.path,
        type: type,
      });
    },
    [navigation],
  );

//   const onFlipCameraPressed = useCallback(() => {
//     setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
//   }, []);
  
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
//   const onDoubleTap = useCallback(() => {
//     onFlipCameraPressed();
//   }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then((status) => setHasMicrophonePermission(status === 'authorized'));
  }, []);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  //#endregion

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${isActive ? 'active' : 'inactive'} camera. ` +
        `Device: "${device.name}" (${format.videoWidth}x${format.videoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const values = examplePlugin(frame);
  //   console.log(`Return Values: ${JSON.stringify(values)}`);
  // }, []);

  const onFrameProcessorSuggestionAvailable = useCallback((suggestion: FrameProcessorPerformanceSuggestion) => {
    console.log(`Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`);
  }, []);

  const getConfigFormat = async (configFormato) => {
    let result = global.camera_formats;
    // find the first format that includes the given FPS
    // let retorno = result.find((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, fps)));
    // console.log(`RETORNO_FORMAT 1: ${JSON.stringify(retorno)}`);

    console.log(`- FOMRATS: ${result}`);

    let elemento;
    let retorno;
    result.forEach(element => {
      // console.log(`- COMPARANDO: ${JSON.stringify(element)} COM ${configFormato}`) 
      if(JSON.stringify(element) === JSON.stringify(configFormato)) {
        console.log(`--- ACHEIIIIII ---`);
        retorno = element;
      }      
    });

    console.log(`CONFIG_CAMERA: ${JSON.stringify(retorno)}`);

    return retorno;
  }

  const recarregaConfiguracoesTela = async () => {
    console.log("-- RECARREGANDO A CAMERA E CONFIGURACOES! --");

    // showNavigationBar();

    const selecaoVazia = '[{"id":"Vazio"}]';
    const selecoes = await AsyncStorage.getItem("@selecoes_key") || selecaoVazia;
    const selecoesStorage = JSON.parse(selecoes);
    // const qualidade = qualidadeSelect;
    // const ratio = ratioSelect;

    // const videoBitRate = videoBitRateSelect;

    // const qualidade = await AsyncStorage.getItem("@qualidade_key") || qualidadeSelect;
    // console.log(`- Qualidade[CespeVideoRecorder]: ${qualidade}`);

    // const videoBitRate = await AsyncStorage.getItem("@videobitrate_key") || videoBitRateSelect;
    // console.log(`- Video BitRateSelect[CespeVideoRecorder]: ${videoBitRate}`);

    const codEvento = await AsyncStorage.getItem("@cod_evento") || codEventoSelect;
    const idUsuario = await AsyncStorage.getItem("@id_usuario") || idUsuarioSelect;
    const idSala = await AsyncStorage.getItem("@id_sala") || idSalaSelect;
    const jsonFormulario = await AsyncStorage.getItem("@json_formulario") || jsonFormulario;

    // setQualidadeSelect(qualidade);
    // setRatioSelect(ratio);
    // setVideoBitRateSelect(videoBitRate);
    // setRatio(ratio);
    setCodEventoSelect(codEvento);
    setIdUsuarioSelect(idUsuario);
    setIdSalaSelect(idSala);
    setJsonFormulario(jsonFormulario);
    // setIsRecording(isRecording);
    setIsSchedule(isSchedule);

    setCodEvento({ error: "", value: codEvento });
    setIdUsuario({ error: "", value: idUsuario });
    setIdSala({ error: "", value: idSala });

    // setTxtQualidadeBitRate({        
    //     txtQualidade: constants.dadosQualidadeVideo[0].opcoes.filter((o) => o.value == qualidade)[0].desc,        
    //     txtVideoBitrate: constants.dadosQualidadeVideo[1].opcoes.filter((o) => o.value == videoBitRate)[0].desc
    // });

    // console.log(`= Na Camera, setando videoBitRate para [${videoBitRate}] e qualidade para [${qualidade}] e [${RNCamera.Constants.VideoQuality[qualidade]}]`);

    // setRecordOptions({
    //     ...recordOptions,
    //     quality: RNCamera.Constants.VideoQuality[qualidade],
    //     // videoBitrate: videoBitRate === "default" ? (6 * 1000 * 1000) : parseInt(videoBitRate)
    //     videoBitrate: parseInt(videoBitRate)            
    // });

    const configFormato = JSON.parse(await AsyncStorage.getItem("@configQualidade_key")) || constants.configQualidadeVideoPadrao;
    setFormat(await getConfigFormat(configFormato) ||  configFormato);

    // Verifica Zoom   
    // const selecaoZoom = selecoesStorage.find(
    //     (o) => o.id === "FUNC_ZOOM"
    // );
    // if (selecaoZoom) {
    //     setZoomHabilitado(selecaoZoom.selecionado);
    // }

    // Verifica Flash   
    // const selecaoFlash = selecoesStorage.find(
    //     (o) => o.id === "FUNC_FLASH"
    // );
    // if (selecaoFlash) {
    //     setFlashHabilitado(selecaoFlash.selecionado);
    // }

    // Verifica Foco
    // const selecaoFoco = selecoesStorage.find(
    //     (o) => o.id === "FUNC_FOCO"
    // );
    // if (selecaoFoco) {
    //     setFocoHabilitado(selecaoFoco.selecionado);
    // }

    // setZoom(0);
    // setFlash("off");
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
        // mostraMsg(show_msg.msg, show_msg.tipo, global.dropDownAlertRef);
        mostraMsgFormAltoTipoNaCamera(show_msg.msg, show_msg.tipo,  Toast);
    }
    setIsModalNovoSalaVisible(false);
}, []);

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            {/* <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}> */}
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                // fps={fps}
                // hdr={enableHdr}
                lowLightBoost={device.supportsLowLightBoost}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={false}
                video={true}
                audio={hasMicrophonePermission}
                // frameProcessor={device.supportsParallelVideoProcessing ? frameProcessor : undefined}
                // orientation="portrait"
                // frameProcessorFps={1}
                // onFrameProcessorPerformanceSuggestionAvailable={onFrameProcessorSuggestionAvailable}
              />
            {/* </TapGestureHandler> */}
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        {/* {supportsCameraFlipping && (
          <PressableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
            <IonIcon name="camera-reverse" color="white" size={24} />
          </PressableOpacity>
        )} */}
        {supportsFlash && (
          <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </PressableOpacity>
        )}
        {/* {supports60Fps && (
          <PressableOpacity style={styles.button} onPress={() => setIs60Fps(!is60Fps)}>
            <Text style={styles.text}>
              {is60Fps ? '60' : '30'}
              {'\n'}FPS
            </Text>
          </PressableOpacity>
        )}
        {supportsHdr && (
          <PressableOpacity style={styles.button} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </PressableOpacity>
        )} */}
        {/* {canToggleNightMode && (
          <PressableOpacity style={styles.button} onPress={() => setEnableNightMode(!enableNightMode)} disabledOpacity={0.4}>
            <IonIcon name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
          </PressableOpacity>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    captureButton: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: SAFE_AREA_PADDING.paddingBottom,
    },
    button: {
      marginBottom: CONTENT_SPACING,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      backgroundColor: 'rgba(140, 140, 140, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButtonRow: {
      position: 'absolute',
      right: SAFE_AREA_PADDING.paddingRight,
      top: SAFE_AREA_PADDING.paddingTop,
    },
    text: {
      color: 'white',
      fontSize: 11,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default CebraspeVisionCamera;