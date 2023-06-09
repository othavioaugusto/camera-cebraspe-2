import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  Input,
  Button,
  ListItem,
  Switch,
  InputProps,
} from 'react-native-elements';
import ContainerApp from "../core/components/ContainerApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { constants } from "../core/constants";
import { strNaoVazioValorMinimo, mostraMsg, mostraMsgForm, mostraMsgFormAlto, storeData, storeJson, logar, getPastaArmazenamentoExterno, getPastaArmazenamentoInterno } from "../core/utils";
import { Header } from '../../components/header';
import { useToast } from "react-native-toast-notifications";
import { theme } from "../core/theme";

const SCREEN_WIDTH = Dimensions.get('window').width;

type ConfiguracoesScreenProps = {};

const ConfiguracoesScreen: React.FunctionComponent<ConfiguracoesScreenProps> = ({ route, navigation }) => {

  const toast = useToast();

  const [spinner, setSpinner] = useState(false);

  let idTelefoneInput = useRef(null);
  const [idTelefone, setIdTelefone] = useState({ value: "", error: "" });

  let caminhoArqInput = useRef(null);
  const [caminhoArq, setCaminhoArq] = useState({ value: "", error: "" });

  let caminhoArqExternoInput = useRef(null);
  const [caminhoArqExterno, setCaminhoArqExterno] = useState({ value: "", error: "" });

  const [disableCaminhoArq, setDisableCaminhoArq] = useState(true);
  const [disableCaminhoArqExterno, setDisableCaminhoArqExterno] = useState(true);

  const [selecoes, setSelecoes] = useState([
    { titulo: "Flash", desc: "Habilitar a função flash da câmera", selecionado: false, id: "FUNC_FLASH" },
    { titulo: "Zoom", desc: "Habilitar a função zoom da câmera", selecionado: false, id: "FUNC_ZOOM" },
    { titulo: "Foco", desc: "Habilitar a função foco da câmera", selecionado: false, id: "FUNC_FOCO" },
    { titulo: "Botão Apagar", desc: "Habilitar botão que permite apagar vídeo", selecionado: false, id: "FUNC_BOT_APAGAR" },
  ]);
  const [qualidadeSelect, setQualidadeSelect] = useState(constants.videoBitRate);
  const [ratioSelect, setRatioSelect] = useState(constants.ratio);
  const [tempoGravacaoSelect, setTempoGravacaoSelect] = useState(constants.tempoGravacao);

  const [opcoes, setOpcoes] = useState({
    titulo: "",
    desc: "",
    itens: []
  });
  const [datas, setDatas] = useState([]);

  let shakeInput = useRef(null);

  const InputFieldsStyle = {
    borderWidth: 0,
  };

  const goBack = (msg, tipo) => {
    navigation.goBack();
  }

  const zeraErrosAnteriores = async () => {
    setIdTelefone({ ...idTelefone, error: "" });
    setCaminhoArq({ ...caminhoArq, error: "" });
    setCaminhoArqExterno({ ...caminhoArqExterno, error: "" });
    return;
  }

  const alteraStatusSelecoes = async (id) => {
    setSpinner(true);
    let selecoesTmp = [];
    for (let index = 0; index < selecoes.length; index++) {
      const element = selecoes[index];
      if (id === element.id) {
        element.selecionado = !element.selecionado;
        logar(`Usuario alterou o item ${element.titulo} para: ${element.selecionado}`);
      }
      selecoesTmp.push({ ...element, selecionado: element.selecionado });
    }
    setSelecoes(selecoesTmp);
    storeJson("@selecoes_key", selecoesTmp);
    setSpinner(false);
  }

  const preencheConfiguracoes = async () => {
    setSpinner(true);
    zeraErrosAnteriores();

    const pastaArmazenamentoExterno = await getPastaArmazenamentoExterno();
    const pastaArmazenamentoInterno = await getPastaArmazenamentoInterno();

    setCaminhoArq({ ...caminhoArq, value: pastaArmazenamentoInterno.pasta });
    setCaminhoArqExterno({ ...caminhoArqExterno, value: pastaArmazenamentoExterno.sucesso ? pastaArmazenamentoExterno.pasta : "Não existe armazenamento externo (SDCard)" });
    setDisableCaminhoArq(true);
    setDisableCaminhoArqExterno(true);

    const qualidade = await AsyncStorage.getItem("@qualidade_key") || qualidadeSelect;
    console.log(`- Qualidade [videoBitRate]: ${qualidade}`);
    setQualidadeSelect(qualidade);

    const selecoesStorage = JSON.parse(await AsyncStorage.getItem("@selecoes_key")) || selecoes;
    const selecoesTmp = [];
    console.log(`- SELECOES STORAGE: ${JSON.stringify(selecoesStorage)}`);
    for (let index = 0; index < selecoes.length; index++) {
      const element = selecoes[index];
      const dados = selecoesStorage.find(
        (o) => o.id === element.id
      );
      selecoesTmp.push({ id: dados.id || element.id, titulo: dados.titulo || element.titulo, desc: dados.desc || element.desc, selecionado: dados.selecionado || element.selecionado });
    }

    setSelecoes(selecoesTmp);

    const idTelefone = await AsyncStorage.getItem("@id_telefone") || "";
    setIdTelefone({ ...idTelefone, value: idTelefone });
    setSpinner(false);
  }

  const onConfirmarIdTelefonePressed = async () => {
    setSpinner(true);

    await zeraErrosAnteriores();

    console.log(`- Chamei onConfirmarIdTelefonePressed: ${idTelefone}`);

    const telError = strNaoVazioValorMinimo(
      idTelefone.value,
      "Identificador do telefone",
      6
    );
    if (telError) {
      setIdTelefone({ ...idTelefone, error: telError });
      mostraMsgForm(telError, true, toast);      
      setSpinner(false);
      return;
    }

    // Aqui atualizo variavel global da identificação do telefone
    // mostraMsg(`Identificador do telefone salvo com sucesso!`, "success", global.dropDownAlertRef);
    mostraMsgFormAlto(`Identificador do telefone salvo com sucesso!`, false, toast);  
    logar(`Usuario alterou o id do telefone para: ${idTelefone.value}`);
    storeData("@id_telefone", idTelefone.value);

    setSpinner(false);

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
    console.log(`== PASSEI USEEFFECT (ConfiguracoesScreen): componentWillMount. componentDidMount e componentDidUpdate`);
    //-> Opcional - Caso deseje, aqui no return, vai a a logica para componentWillUnMount
    return () => {
      console.log(`== PASSEI USEEFFECT (ConfiguracoesScreen): componentWillMount`);
    };
  });

  // Dessa forma soh chama na primeira vez
  useEffect(() => {
    console.log(`== Carregando tela ==`);
    preencheConfiguracoes();
  }, []);

  const inputProps = {};
  return (
    <>
      <ContainerApp>
        <Header title="Configurações" view="Configurações" navegarBack={() => goBack('', '')} />

        <Spinner
          visible={spinner}
          textContent={"Aguarde..."}
          textStyle={theme.spinnerTextStyle}
        />

        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>
                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>Identificador do Telefone</ListItem.Title>
                      <ListItem.Subtitle>Informe o identificador do telefone (6 dígitos numéricos)</ListItem.Subtitle>
                      <Input
                        {...(inputProps as InputProps)}
                        containerStyle={[styles.inputContainerStyle]}
                        // placeholder="Informe o identificador do telefone (4 dígitos numéricos)"
                        // label="Identificador do Telefone"
                        style={InputFieldsStyle}
                        maxLength={6}
                        ref={(ref) => (idTelefoneInput = ref)}
                        value={idTelefone.value}
                        rightIcon={
                          <Button
                            title="Salvar"
                            buttonStyle={{ backgroundColor: theme.colors.btn_success }}
                            containerStyle={{
                              height: 40,
                              width: 150,
                            }}
                            titleStyle={{
                              color: 'white'
                            }}
                            // onPress={() => {idTelefoneInput && idTelefoneInput.shake(); Vibration.vibrate(1000)}} 
                            onPress={() => onConfirmarIdTelefonePressed()}
                          />
                        }
                        onChangeText={(text: string) => setIdTelefone({ value: text, error: "" })}
                        onSubmitEditing={() => {
                          // Proximo focus chamar abaixo
                          caminhoArqInput.focus();
                        }}
                        errorMessage={idTelefone.error}
                      />
                    </ListItem.Content>
                  </ListItem>
                </View>

                <View style={{ flex: 1 }}>
                  {selecoes.map((item, i) => (
                    <ListItem bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title>{item.titulo}</ListItem.Title>
                        <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
                      </ListItem.Content>
                      <Switch
                        value={item.selecionado}
                        trackColor={{
                          true: theme.colors.btn_success,
                          false: theme.colors.txt_disable,
                        }}
                        thumbColor={item.selecionado ? theme.colors.btn_success : "#FFF"}
                        onValueChange={() => alteraStatusSelecoes(item.id)}
                      />
                    </ListItem>
                  ))}
                </View>

                <View style={{ flex: 1, paddingTop: 25 }}>
                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>Pasta de armazenamento interno</ListItem.Title>
                      <ListItem.Subtitle>Todos os vídeos serão armazenados nessa pasta</ListItem.Subtitle>
                      <Input
                        {...(inputProps as InputProps)}
                        disabled={disableCaminhoArq}
                        style={InputFieldsStyle}
                        ref={(ref) => (caminhoArqInput = ref)}
                        value={caminhoArq.value}
                        onChangeText={(text: string) => setCaminhoArq({ value: text, error: "" })}
                        errorMessage={caminhoArq.error}
                      />
                    </ListItem.Content>
                  </ListItem>
                </View>

                <View style={{ flex: 1 }}>
                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>Pasta de armazenamento externo</ListItem.Title>
                      <ListItem.Subtitle>Caso exista armazenamento externo (SDCard) uma cópia do vídeo gravado será armazenado nessa mídia</ListItem.Subtitle>
                      <Input
                        {...(inputProps as InputProps)}
                        disabled={disableCaminhoArqExterno}
                        style={InputFieldsStyle}
                        ref={(ref) => (caminhoArqExternoInput = ref)}
                        value={caminhoArqExterno.value}
                        onChangeText={(text: string) => setCaminhoArqExterno({ value: text, error: "" })}
                        errorMessage={caminhoArqExterno.error}
                      />
                    </ListItem.Content>
                  </ListItem>
                </View>

              </View>

              {/* <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Name</ListItem.Title>
                </ListItem.Content>
                <ListItem.Input placeholder="Type your name" />
                <ListItem.Chevron />
              </ListItem> */}
              {/* <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Switch that please 😲</ListItem.Title>
                </ListItem.Content>
                <Switch
                // value={switch1}
                // onValueChange={(value) => setSwitch1(value)}
                />
              </ListItem> */}
              {/* <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Choose 🤯</ListItem.Title>
                </ListItem.Content>
                <ListItem.ButtonGroup
                  buttons={['Flower', 'Coco']}
                // selectedIndex={selectedButtonIndex}
                // onPress={(index) => setSelectedButtonIndex(index)}
                />
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.CheckBox
                // checked={checkbox1}
                // onPress={() => setCheckbox1(!checkbox1)}
                />
                <ListItem.Content>
                  <ListItem.Title>Check that please 😢</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider>
                <Icon name="check" size={20} />
                <ListItem.Content>
                  <ListItem.Title>This thing is checked 😎</ListItem.Title>
                </ListItem.Content>
              </ListItem> */}
              {/* </View> */}
            </>
          }
          data={selecoes}
          keyExtractor={(item) => item.id}
        />
      </ContainerApp>
    </>
  );
};

export default ConfiguracoesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.app_container_app,
    position: 'relative',
  },
  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangleLeft: {
    position: 'absolute',
    left: -20,
    top: 0,
    width: 0,
    height: 0,
    borderRightWidth: 20,
    borderRightColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent',
  },
  triangleRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent',
  },
  inputContainerStyle: {
    marginTop: 10,
    // width: '100%',
  },
  list: {
    padding: 10,
    // borderTopWidth: 1,
    borderColor: theme.colors.app_bg,
  },
  listSelecoes: {
    padding: 10,
    // borderTopWidth: 1,
    borderColor: theme.colors.txt_disable,
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});