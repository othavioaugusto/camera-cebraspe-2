import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, BackHandler, FlatList } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
  Input,
  ListItem,
} from 'react-native-elements';
import ContainerApp from "../core/components/ContainerApp";
import Spinner from "react-native-loading-spinner-overlay";
import AlertaModalNovoSala from "../core/components/AlertaModalNovoSala";
import AlertaModalNovoUsuario from "../core/components/AlertaModalNovoUsuario";
import { strNaoVazioValorMinimo, mostraMsg, logar } from "../core/utils";
import { Header } from '../../components/header';
import { useToast } from "react-native-toast-notifications";
import { theme } from "../core/theme";
import DropdownAlert from "react-native-dropdownalert";

let SCREEN_HEIGHT = Dimensions.get("screen").height;
let SCREEN_WIDTH = Dimensions.get("screen").width;

let overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

let rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
let rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
let rectBorderColor = theme.colors.txt_disable;

let scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
let scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
let scanBarColor = theme.colors.btn_success;

let iconScanColor = theme.colors.btn_outros;

let dropDownAlertRefSemFechar;
let dropDownAlertRef;

type QRCodeScreenProps = {};

const QRCodeScreen: React.FunctionComponent<QRCodeScreenProps> = ({ route, navigation }) => {

  const toast = useToast();

  /**
    * Returns true if the screen is in portrait mode
    */
  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  const [spinner, setSpinner] = useState(false);
  const [uniqueValue, setUniqueValue] = useState(1);
  const [codEvento, setCodEvento] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [idSala, setIdSala] = useState("");
  const [tipoQrCode, setTipoQrCode] = useState("");
  const [isModalNovoUsuarioVisible, setIsModalNovoUsuarioVisible] = useState(false);
  const [isModalNovoSalaVisible, setIsModalNovoSalaVisible] = useState(false);
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape');
  const [showQrCodeCapture, setShowQrCodeCapture] = useState(true);
  const [jsonFormulario, setJsonFormulario] = useState({});

  const InputFieldsStyle = {
    borderWidth: 0,
};

  const navegar = (tela, params) => {
    navigation.navigate(tela, { ...params });
  }

  const goBack = (msg, tipo) => {
    navigation.goBack();
    route.params.onGoBack({ msg, tipo });
  }

  const onSuccess = e => {
    console.log('LI O QRCode: ', e.data);
    logar(`Usuario leu o QR Code - ${tipoQrCode}. Dados: ${e.data}`);    

    setShowQrCodeCapture(false);

    try {
      const dados = JSON.parse(e.data);

      if(tipoQrCode === "Candidato") {
        const codEvento = dados.codEvento || null;
        const idUsuario = dados.idUsuario || null;
        if(codEvento && idUsuario) {          
          setCodEvento(codEvento);
          setIdUsuario(idUsuario);

          // TODO: Arrumar aqui
          // this.refs.alertaModalNovoUsuario.open();
          setIsModalNovoUsuarioVisible(true);
        } else {
          logar(`ERRO: QR Code - ${tipoQrCode} - Invalido: ${e.data}`);
          mostraMsg(
            `ERRO ao ler QR Code. Os dados são inválidos!`,
            "error",
            dropDownAlertRefSemFechar
          );
        }
      } else {
        const idSala = dados.idSala || null;
        if(idSala) {
          setIdSala(dados.idSala);
          setJsonFormulario(dados.formulario || {});

          // TODO: Arrumar aqui
          // this.refs.alertaModalNovoSala.open();
          setIsModalNovoSalaVisible(true);
        } else {
          logar(`ERRO: QR Code - ${tipoQrCode} - Invalido: ${e.data}`);
          mostraMsg(
            `ERRO ao ler QR Code. Os dados são inválidos!`,
            "error",
            dropDownAlertRefSemFechar
          );
        }        
      }

    } catch (err) {
      console.log("ERRO: ", err);
      logar(`ERRO: QR Code - ${tipoQrCode}: ${err.toString()}`);
      mostraMsg(
        `ERRO ao ler QR Code. Tente novamente! ERRO: [${err.toString()}]`,
        "error",
        dropDownAlertRefSemFechar
      );
    }    
    setUniqueValue(uniqueValue + 1);
  };

  const onConfirmNovoUsuarioPressed = async () => {
    const codEventoError = strNaoVazioValorMinimo(
      codEvento,
      "Código do Evento",
      5
    );
    const idUsuarioError = strNaoVazioValorMinimo(
      idUsuario,
      "Inscrição do Usuário",
      8
    );

    setShowQrCodeCapture(true);

    if (codEventoError || idUsuarioError) {
      logar(`Erro: ${codEventoError} ${idUsuarioError}`);
      mostraMsg(
        `ERRO: ${codEventoError} ${idUsuarioError}`,
        "error",
        dropDownAlertRef
      );
      return;
    }

    const msg = {
      'codEvento': codEvento,
      'idUsuario': idUsuario,
      'tipoQrCode': tipoQrCode
    };
    console.log(`Usuario confirmou o QR Code - ${tipoQrCode}. Codigo do Evento: ${codEvento} - Inscricao do Usuario: ${idUsuario}`);
    logar(`Usuario confirmou o QR Code - ${tipoQrCode}. Codigo do Evento: ${codEvento} - Inscricao do Usuario: ${idUsuario}`);
    setIsModalNovoUsuarioVisible(false);
    goBack(msg, 'retorno_qrcode');
  }

  const onConfirmNovoSalaPressed = async () => {
    const idSalaError = strNaoVazioValorMinimo(
      idSala,
      "Identificador da Sala",
      5
    );

    setShowQrCodeCapture(true);

    if (idSalaError) {
      logar(`Erro: ${idSalaError}`);
      mostraMsg(
        `ERRO: ${idSalaError}`,
        "error",
        dropDownAlertRef
      );
      return;
    }

    const msg = {
      'idSala': idSala,
      'jsonFormulario': jsonFormulario || {},
      'tipoQrCode': tipoQrCode
    };
    logar(`Usuario confirmou o QR Code - ${tipoQrCode}. Sala: ${idSala}`);
    setIsModalNovoSalaVisible(false);
    goBack(msg, 'retorno_qrcode');
  }

  const renderModalBodyNovoUsuario = () => {
    // console.log('-- Renderizando renderModalBodyNovoUsuario - QRCodeScreen --');
    return (
      <ListItem.Content style={{ flexDirection: "row" }} >
          <Input
              containerStyle={[styles.inputModalBodyNovoUsuario]}
              style={InputFieldsStyle}
              inputStyle={styles.inputTextModal}
              label="Cód. Evento"
              labelStyle={styles.textLabelModal}
              maxLength={5}
              value={codEvento}
              returnKeyType="next"
              disabled={true}
          />

          <Input
              containerStyle={[styles.inputModalBodyNovoUsuario]}
              style={InputFieldsStyle}
              inputStyle={styles.inputTextModal}
              label="Inscrição"
              labelStyle={styles.textLabelModal}
              maxLength={8}
              value={idUsuario}
              returnKeyType="next"
              disabled={true}
          />

      </ListItem.Content>
  );

  };

  const renderModalBodyNovoSala = () => {
    // console.log('-- Renderizando renderModalBodyNovoSala - QRCodeScreen --');
    return (
      <ListItem.Content>
        <Input
          containerStyle={[styles.inputContainerStyle]}
          style={InputFieldsStyle}
          inputStyle={styles.inputTextModal}
          label="Identificador da Sala"
          labelStyle={styles.textLabelModal}
          maxLength={5}
          value={idSala}
          disabled={true}
        />
      </ListItem.Content>
    );
  };

  const qrCodeStyle = () => {
    console.log(`CHAMEI: qrCodeStyle - ${orientation}`);

    SCREEN_HEIGHT = Dimensions.get("screen").height;
    SCREEN_WIDTH = Dimensions.get("screen").width;

    overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

    rectDimensions = SCREEN_WIDTH * 0.55; // this is equivalent to 255 from a 393 device width
    rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
    rectBorderColor = theme.colors.txt_disable;

    scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
    scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
    scanBarColor = theme.colors.btn_success;

    iconScanColor = theme.colors.btn_outros;

    const rectangleContainer = {
        flex: 3,
        position: "absolute",
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "flex-end",
        right: 10,
        bottom: 100,
        backgroundColor: "green"
    };
    const rectangle = {
      height: orientation === 'portrait' ? rectDimensions : rectDimensions - 250,
      width: orientation === 'portrait' ? rectDimensions : rectDimensions - 250,
      // height: 400,
      // width: 400,
      borderWidth: rectBorderWidth,
      borderColor: rectBorderColor,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: orientation === 'portrait' ? 100 : 40,
      left: orientation === 'portrait' ? 15 : -15,      
      borderStyle: 'dashed'
    };
    const topOverlay = {
      flex: 1,
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      //backgroundColor: overlayColor,
      justifyContent: "center",
      alignItems: "center"
    };
    const bottomOverlay = {
      flex: 1,
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      //backgroundColor: overlayColor,
      paddingBottom: SCREEN_WIDTH * 0.25
    };
    const leftAndRightOverlay = {
      height: SCREEN_WIDTH * 0.65,
      width: SCREEN_WIDTH,
      //backgroundColor: overlayColor
    };
    const scanBar = {
      width: scanBarWidth,
      height: scanBarHeight,
      backgroundColor: scanBarColor
    };

    console.log(`SCREEN_HEIGHT: ${SCREEN_HEIGHT} - SCREEN_WIDTH: ${SCREEN_WIDTH}`);

    return { rectangleContainer, rectangle, topOverlay, bottomOverlay, leftAndRightOverlay, scanBar };
  };

  const handleBackButtonClick = () => {
    logar(`Usuario clicou no botao voltar do Android.`);
    goBack('', '');
    return true;
  }

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
    console.log(`== PASSEI USEEFFECT (QRCodeScreen): componentWillMount. componentDidMount e componentDidUpdate`);
    const { params } = route;
    console.log(`CHAMEI: componentDidMount QRCodeScreen2: Params[${JSON.stringify(params)}]`);
    setTipoQrCode(params.tipoQrCode);
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      console.log(`== PASSEI USEEFFECT (QRCodeScreen): componentWillUnMount`);
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  });

  // Dessa forma soh chama na primeira vez
  useEffect(() => {
    console.log(`== Carregando tela ==`);
    // preencheConfiguracoes();
  }, []);

  const inputProps = {};
  return (
    <>
      <ContainerApp>
        <Header title={`QR Code: ${tipoQrCode}`} naoMostrarHome navegarBack={() => goBack('', '')} />

        <Spinner
          visible={spinner}
          textContent={"Aguarde..."}
          textStyle={theme.spinnerTextStyle}
        />

        <FlatList
          ListHeaderComponent={
            <>
              {showQrCodeCapture ?
                <QRCodeScanner
                  showMarker
                  onRead={onSuccess.bind(this)}
                  cameraStyle={{ height: showQrCodeCapture ? SCREEN_HEIGHT : 0, width: showQrCodeCapture ? SCREEN_WIDTH : 0, backgroundColor: showQrCodeCapture ? "transparent" : "black" }}
                  key={uniqueValue}
                  customMarker={
                    <View style={styles.topView}>
                      <View style={{ ...qrCodeStyle().rectangle }} />
                    </View>
                  }
                />
                : <View style={{
                  flex: 1,
                  backgroundColor: "black",
                  height: SCREEN_HEIGHT
                }} />
              }
            </>
          }
          data={[]}
          renderItem={({ item }) => (
            <>
            </>
          )}
          keyExtractor={(item) => item.name}
        />

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
            setShowQrCodeCapture(true);
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
            setIsModalNovoSalaVisible(true);
          }}
          onClosed={() => {
            setIsModalNovoSalaVisible(false);
            setShowQrCodeCapture(true);
          }}
          childComp={renderModalBodyNovoSala()}
        >
        </AlertaModalNovoSala>

      </ContainerApp>

      <DropdownAlert
          successColor={theme.colors.dpdownalert_success_color}
          infoColor={theme.colors.dpdownalert_info_color}
          warnColor={theme.colors.dpdownalert_warn_color}
          errorColor={theme.colors.dpdownalert_error_color}
          ref={(ref) => (dropDownAlertRef = ref)}
          wrapperStyle={{ top: 10 }}
          closeInterval={3000}
        />

        <DropdownAlert
          successColor={theme.colors.dpdownalert_success_color}
          infoColor={theme.colors.dpdownalert_info_color}
          warnColor={theme.colors.dpdownalert_warn_color}
          errorColor={theme.colors.dpdownalert_error_color}
          showCancel={true}
          wrapperStyle={{ top: 10 }}
          onClose={() =>
            // console.log('== CLOSE NO ALERT ==');
            setShowQrCodeCapture(true)
          }
          onCancel={() =>
            // console.log('== CANCEL NO ALERT ==');
            setShowQrCodeCapture(true)
          }          
          ref={ref => dropDownAlertRefSemFechar = ref}
          closeInterval={0} />
    </>
  );
};

export default QRCodeScreen;

const styles = StyleSheet.create({
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  labelForm: {
    fontWeight: "bold",
  },
  itemInputContainer: {
    marginVertical: 5,
  },
  labelDados: {
    fontSize: 16
  },
  parent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topView: {
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    padding: 10,
    flexDirection: "row"
  },
  parentModalBody: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
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