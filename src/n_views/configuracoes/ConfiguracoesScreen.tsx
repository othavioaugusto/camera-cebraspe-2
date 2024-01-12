import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  CheckBox
} from 'react-native-elements';
import {
  CameraDeviceFormat,
  sortFormats,
  useCameraDevices,
  frameRateIncluded
} from 'react-native-vision-camera';
import ContainerApp from "../core/components/ContainerApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { constants } from "../core/constants";
import { strNaoVazioValorMinimo, mostraMsg, mostraMsgForm, mostraMsgFormAlto, storeData, storeJson, logar, getPastaArmazenamentoExterno, getPastaArmazenamentoInterno } from "../core/utils";
import { Header } from '../../components/header';
import { useToast } from "react-native-toast-notifications";
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from "../core/theme";

const SCREEN_WIDTH = Dimensions.get('window').width;

type ConfiguracoesScreenProps = {};

const ConfiguracoesScreen: React.FunctionComponent<ConfiguracoesScreenProps> = ({ route, navigation }) => {

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');

  // camera format settings
  // const devices = useCameraDevices();
  // const device = devices[cameraPosition];
  // const formats = useMemo<CameraDeviceFormat[]>(() => {
  //   if (device?.formats == null) return [];
  //   return device.formats.sort(sortFormats);
  // }, [device?.formats]);

  // const formatosSuportados = useMemo(() => {
  //   let result = global.camera_formats;
    
  //   // Filtro somente por formatos q nao suportam HDF
  //   result = result.filter((f) => !f.supportsVideoHDR && f.videoWidth);    

  //   // find the first format that includes the given FPS
  //   // const retorno = result.find((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, 30)));
  //   // console.log(`RETORNO_FORMAT_SELECIONADO: ${JSON.stringify(retorno)}`);

  //   // return retorno;

  //   return result;

  // }, [formats]);

  const [formatosSuportados, setFormatosSuportados] = useState([]);

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
  const [qualidadeSelect, setQualidadeSelect] = useState(constants.qualidade);
  const [videoBitRateSelect, setVideoBitRate] = useState(constants.videoBitRate+"");
  
  const [configQualidadeSelect, setConfigQualidadeSelect] = useState(JSON.stringify(constants.configQualidadeVideoPadrao));

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

  const alteraConfigQualidade = async (item) => {    
    setConfigQualidadeSelect(JSON.stringify(item));
    storeJson("@configQualidade_key", JSON.stringify(item));
    logar(`Uusario alterou a configuracao do video para: ${JSON.stringify(item)}`);
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

    const datasTmp = constants.dadosQualidadeVideo;

    setDatas(datasTmp);

    const pastaArmazenamentoExterno = await getPastaArmazenamentoExterno();
    const pastaArmazenamentoInterno = await getPastaArmazenamentoInterno();

    // console.log(`CONFIG FORMATOS SUPORTADOS: ${JSON.stringify(global.camera_formats)}`);

    setFormatosSuportados(global.camera_formats);

    setCaminhoArq({ ...caminhoArq, value: pastaArmazenamentoInterno.pasta });
    setCaminhoArqExterno({ ...caminhoArqExterno, value: pastaArmazenamentoExterno.sucesso ? pastaArmazenamentoExterno.pasta : "Não existe armazenamento externo (SDCard)" });
    setDisableCaminhoArq(true);
    setDisableCaminhoArqExterno(true);

    const qualidade = await AsyncStorage.getItem("@qualidade_key") || qualidadeSelect;
    console.log(`- Qualidade: ${qualidade}`);
    setQualidadeSelect(qualidade);

    const bitrate = await AsyncStorage.getItem("@videobitrate_key") || videoBitRateSelect;
    console.log(`- Video BitRateSelect: ${bitrate}`);
    setVideoBitRate(bitrate);

    const confQualidade = JSON.parse(await AsyncStorage.getItem("@configQualidade_key")) || configQualidadeSelect;
    console.log(`- Config Qualidade: ${confQualidade}`);
    setConfigQualidadeSelect(confQualidade);    

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

  const removeCamposJsonConfigApresentacao = async (item) => {    
    console.log(`Chamei 1 removeCamposJsonConfigApresentacao: ${JSON.stringify(item)}`);
    let retorno = Object.assign({}, item);
    delete retorno.photoHeight;
    console.log(`Chamei 2 removeCamposJsonConfigApresentacao: ${JSON.stringify(retorno)}`);
    return retorno.toString();
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

                <View style={{ flex: 1 }}>
                  {datas.map((item, i) => (
                  <ListItem bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title>{item.titulo}</ListItem.Title>
                        <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>                        
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}                          
                            data={item.opcoes}                          
                            maxHeight={300}
                            labelField="desc"
                            valueField="value"
                            placeholder="Selecione um item"                          
                            value={ item.id === 1 ? qualidadeSelect : videoBitRateSelect}
                            onChange={(value) => {                              
                              let valor = value.value;
                              if (item.id === 1) {
                                setQualidadeSelect(valor);
                                logar(`Usuário alterou a qualidade para: ${valor}`);
                                storeData("@qualidade_key", valor);
                              } else {
                                setVideoBitRate(valor)
                                logar(`Usuário alterou o videobitrate para: ${valor}`);
                                storeData("@videobitrate_key", valor);
                              }
                            }}
                          />
                      </ListItem.Content>
                    {/* { item.id !== 4  &&
                      <Item style={{ ...styles.itemInputContainer, width: "100%" }}>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="ios-arrow-down" />}
                          style={{
                            width: "100%"
                          }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={ (item.id === 1 || item.id === 2) ? 
                            (item.id === 1 ? this.state.qualidadeSelect : this.state.ratioSelect) : 
                            this.state.tempoGravacaoSelect }
                          onValueChange={(value) => {
                            if (item.id === 1) {
                              this.setState({ qualidadeSelect: value });
                              logar(`Usuário alterou a qualidade para: ${value}`);
                              storeData("@qualidade_key", value);
                            } else if(item.id === 2) {
                              this.setState({ ratioSelect: value });
                              logar(`Usuário alterou o ratio para: ${value}`);
                              storeData("@ratio_key", value);
                            }
                          }}
                        >
                          {item.opcoes.map((opcao, i) => {
                            return (
                              <Picker.Item
                                label={opcao.desc}
                                value={opcao.value}
                                key={i}
                              />
                            );
                          })}
                        </Picker>
                      </Item>
                    } */}
                    
                    {/* TRATANDO SOMENTE O NOVO VIDEOBITRATE */}
                                         
                    {/*   
                      { item.id == 2  &&
                        <ListItem style={{ ...styles.itemInputContainer, width: "100%" }}>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="ios-arrow-down" />}
                          style={{
                            width: "100%"
                          }}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={ this.state.qualidadeSelect }
                          onValueChange={(value) => {                            
                            this.setState({ qualidadeSelect: value });
                            logar(`Usuário alterou o video bitrate para: ${value}`);
                            storeData("@qualidade_key", value);                            
                          }}
                        >
                          {item.opcoes.map((opcao, i) => {
                            return (
                              <Picker.Item
                                label={opcao.desc}
                                value={opcao.value}
                                key={i}
                              />
                            );
                          })}
                        </Picker>
                      </ListItem> 
                    }
                    */}                   
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

                <View style={{ flex: 1 }}>
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>Selecione a configuração desejada:</ListItem.Title>                      
                    </ListItem.Content>
                  </ListItem>
                  {formatosSuportados.map((item, i) => (
                    <ListItem bottomDivider containerStyle={{backgroundColor: configQualidadeSelect == JSON.stringify(item) ? theme.colors.app_bg_enable : null}}>
                      <ListItem.Content style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        {/* <ListItem.Subtitle>{JSON.stringify(item, null, 2)}</ListItem.Subtitle> */}
                        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", flex: 2 }}>
                          <ListItem.Subtitle>{removeCamposJsonConfigApresentacao(item)}</ListItem.Subtitle>                          
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", flex: 2 }}>
                          <ListItem.Subtitle>{JSON.stringify(item.frameRateRanges, null, 2)}</ListItem.Subtitle>
                        </View>
                      </ListItem.Content>
                      <CheckBox
                        center                        
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={configQualidadeSelect == JSON.stringify(item)}
                        onPress={() => alteraConfigQualidade(item)}
                      />
                    </ListItem>
                  ))}
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
  dropdown: {
    // margin: 16,
    height: 50,
    width: 300,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});