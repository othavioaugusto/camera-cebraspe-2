import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useToast } from "react-native-toast-notifications";
import { theme } from "../core/theme";

import { hideNavigationBar, showNavigationBar } from "react-native-navigation-bar-color";

// import VideoPlayer from 'react-native-video-controls';
// import ContainerApp from '../core/components/ContainerApp';

import VideoPlayer from 'react-native-media-console';

type VideoPlayComponentProps = {};

const VideoPlay: React.FunctionComponent<VideoPlayComponentProps> = ({ route, navigation }) => {

  const toast = useToast();

  const [spinner, setSpinner] = useState(false);

  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [resizeMode, setResizeMode] = useState("contain");
  const [duration, setDuration] = useState(0.0);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [paused, setPaused] = useState(false);
  const [arquivoVideo, setArquivoVideo] = useState("");

  // let video = React.useRef<VideoPlayer>(VideoPlayer);

  const navegar = (tela, params) => {
    navigation.navigate(tela, { ...params });
  }

  const goBack = (msg, tipo) => {
    navigation.goBack();
    route.params.onGoBack({ msg, tipo });
  }

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onEnd = () => {
    setPaused(true);
    // video.seekTo(0)
  };

  const onAudioBecomingNoisy = () => {
    setPaused(true);
  };

  const getCurrentTimePercentage = () => {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(duration);
    }
    return 0;
  };

  const renderRateControl = (rateParam) => {
    const isSelected = (rate === rateParam);

    return (
      <TouchableOpacity onPress={() => { setRate(rateParam) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {rateParam}
        </Text>
      </TouchableOpacity>
    );
  }

  const renderResizeModeControl = (resizeModeParam) => {
    const isSelected = (resizeMode === resizeModeParam);

    return (
      <TouchableOpacity onPress={() => { setResizeMode(resizeModeParam) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {resizeModeParam}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderVolumeControl = (volumeParam) => {
    const isSelected = (volume === volumeParam);

    return (
      <TouchableOpacity onPress={() => { setVolume(volumeParam) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {volumeParam * 100}%
        </Text>
      </TouchableOpacity>
    )
  }

  // -> MODELO DE USEEFFECT
  useEffect(() => {
    // -> Aqui vai a alogica para componentWillMount. componentDidMount e componentDidUpdate  
    setPaused(false);
    setArquivoVideo(route.params.arquivoVideo);
    // hideNavigationBar();
    // -> Opcional - Caso deseje, aqui no return, vai a a logica para componentWillUnMount
    return () => {
      // showNavigationBar();
    };
  }, []);

  return (
    <>
      {arquivoVideo && arquivoVideo.length > 0 ?
        < VideoPlayer
          // source={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
          source={{ uri: arquivoVideo }}
          containerStyle={styles.fullScreen}
          isFullscreen={true}
          showDuration={true}
          showOnEnd={true}
          disableFullscreen={true}
          onPause={() => setPaused(true)}
          onPlay={() => setPaused(false)}
          onBack={() => goBack({ msg: "", tipo: "" })}
          tapAnywhereToPause={true}
          disableVolume={true}
        />
        : <></>}

        {/* <View style={styles.controls}>
          <View style={styles.generalControls}>
            <View style={styles.rateControl}>
              {this.renderRateControl(0.25)}
              {this.renderRateControl(0.5)}
              {this.renderRateControl(1.0)}
              {this.renderRateControl(1.5)}
              {this.renderRateControl(2.0)}
            </View>

            <View style={styles.volumeControl}>
              {this.renderVolumeControl(0.5)}
              {this.renderVolumeControl(1)}
              {this.renderVolumeControl(1.5)}
            </View>

            <View style={styles.resizeModeControl}>
              {this.renderResizeModeControl('cover')}
              {this.renderResizeModeControl('contain')}
              {this.renderResizeModeControl('stretch')}
            </View>
          </View>

          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
            </View>
          </View>
        </View> */}

    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cecece',
  },
  fullScreen: {
    position: 'absolute',
    top: 15,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: 'green',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});

export default VideoPlay;