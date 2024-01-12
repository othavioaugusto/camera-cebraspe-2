import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    Text,
    Linking,
    Image,
} from 'react-native';
import { strNaoVazioValorMinimo, strNaoVazioValorMinimoSomenteNome, mostraMsg, mostraMsgFormAltoTipoNaCamera, mostraMsgForm, storeData, logar, getPastaArmazenamentoInterno, getPastaArmazenamentoExterno, getSDCardPathCameraCebraspeModule } from "../core/utils";
var RNFS = require("react-native-fs");
import { Camera, useCameraDevices } from 'react-native-vision-camera';

type CespeVisionCameraProps = {};

const CespeVisionCamera: React.FunctionComponent<CespeVisionCameraProps> = ({ route, navigation }) => {
    const camera = useRef(null);
    const devices = useCameraDevices();
    const device = devices.back;

    const [isRecording, setIsRecording] = useState(false);
    const [showCamera, setShowCamera] = useState(true);
    const [imageSource, setImageSource] = useState('');

    useEffect(() => {
        async function getPermission() {
            const newCameraPermission = await Camera.requestCameraPermission();
            console.log(newCameraPermission);
        }
        getPermission();
    }, []);

    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({});
            setImageSource(photo.path);
            setShowCamera(false);
            console.log(photo.path);
        }
    };

    const onStoppedRecording = async (video) => {
        setIsRecording(false);
        let folder = await getPastaArmazenamentoInterno();
        const novoNomeArqVideo = `${folder.pasta}/novovideocomvisioncamera.mp4`;
        console.log(`- Vou copiar o arquivo: ${video.path} para: ${novoNomeArqVideo}`);
        await RNFS.moveFile( video.path, novoNomeArqVideo);
        // cancelAnimation(recordingProgress);
        console.log('stopped recording video!');
      };

    const captureVideo = async () => {
        console.log(`- Chamei captureVideo!`);
        if (camera.current !== null) {
            await camera.current.startRecording({
                flash: 'on',
                onRecordingFinished: (video) => {
                    console.log(`Recording successfully finished! ${video.path}`);
                    //onMediaCaptured(video, 'video');
                    onStoppedRecording(video);
                  },
                onRecordingError: (error) => console.error(error),
              });
            setIsRecording(true);
            //setImageSource(photo.path);
            //setShowCamera(false);
            //console.log(photo.path);
        }
    };

    const stopVideoCliqueBotao = async () => {
        console.log(`- Chamei stopVideoCliqueBotao!`);
        if (camera.current !== null) {
            const uri = await camera.current.stopRecording();            
        }
    };

    if (device == null) {
        return <Text>Camera not available</Text>;
    }

    return (
        <View style={styles.container}>
            {showCamera ? (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={showCamera}
                        video={true}
                        audio={true}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.camButton}
                            // onPress={() => capturePhoto()}
                            onPress={() => isRecording ? stopVideoCliqueBotao() : captureVideo() }
                        />
                    </View>
                </>
            ) : (
                <>
                    {imageSource !== '' ? (
                        <Image
                            style={styles.image}
                            source={{
                                uri: `file://'${imageSource}`,
                            }}
                        />
                    ) : null}

                    <View style={styles.backButton}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#fff',
                                width: 100,
                            }}
                            onPress={() => setShowCamera(true)}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#77c3ec',
                                }}
                                onPress={() => setShowCamera(true)}>
                                <Text style={{ color: '#77c3ec', fontWeight: '500' }}>
                                    Retake
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#77c3ec',
                                }}
                                onPress={() => captureVideo()}>
                                <Text style={{ color: '#77c3ec', fontWeight: '500' }}>
                                    Capture Video
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#77c3ec',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                }}
                                onPress={() => setShowCamera(true)}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    Use Photo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'gray',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        padding: 20,
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 9 / 16,
    },
});

export default CespeVisionCamera;