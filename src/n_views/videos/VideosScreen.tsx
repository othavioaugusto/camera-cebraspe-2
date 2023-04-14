import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import {
  Button,
  ListItem,
  Text,
  Tab,
  Dialog,
} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ContainerApp from "../core/components/ContainerApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
var RNFS = require("react-native-fs");
import moment from "moment-timezone";
import { mostraMsg, mostraMsgForm, mostraMsgFormAlto, mostraMsgFormAltoTipo, storeData, logar, getPastaArmazenamentoExterno, getPastaArmazenamentoInterno } from "../core/utils";
import ListaVazia from "../core/components/ListaVazia";
import { Header } from '../../components/header';
import { useToast } from "react-native-toast-notifications";
import { theme } from "../core/theme";

import { getPermissao_WRITE_EXTERNAL_STORAGE, getPermissao_READ_EXTERNAL_STORAGE } from "../core/permissoes";
import RemoverModal from '../core/components/RemoverModal';

const ScreenWidth = Dimensions.get('window').width;

type VideosScreenProps = {};

const VideosScreen: React.FunctionComponent<VideosScreenProps> = ({ route, navigation }) => {

  // const navigation = useNavigation();

  const toast = useToast();

  const [spinner, setSpinner] = useState(false);

  const [sincroniza, setSincroniza] = useState({
    sincronizando: false,
    videosACopiar: [],
    videosCopiados: [],
    mensagem: "",
    msgArqVideo: "",
    mostraMsgApresentacao: true,
    videosACopiadosLista: []
  });
  const [ultimaSincroniza, setUltimaSincroniza] = useState("xx-xx-xxxx");
  const [data, setData] = useState([]);
  const [listaVazia, setListaVazia] = useState({ value: false, msg: "" });
  const [nomeArquivoExcluir, setNomeArquivoExcluir] = useState("");
  const [pasta, setPasta] = useState("");
  const [btnApagarHabilitado, setBtnApagarHabilitado] = useState(false);
  const [seg, setSeg] = useState(0);
  const scrollRef = React.useRef<ScrollView>(null);
  const [isVisibleRemoveDialog, setIsVisibleRemoveDialog] = useState(false);

  useEffect(() => {
    carregaVideosTutoriais()
  }, [seg]);

  // useEffect(() => {
  //   console.log(`- Nome arquivo excluir: ${nomeArquivoExcluir}`);
    
  // }, [nomeArquivoExcluir]);

  const refresh = async (mensagem) => {
    const msg = mensagem.msg;
    const tipo = mensagem.tipo;
  }

  const navegar = (tela, params) => {
    navigation.navigate(tela, { ...params, onGoBack: (msg) => refresh(msg) });
  }

  const goBack = (msg, tipo) => {
    navigation.goBack();
  }

  const carregaVideosTutoriais = async () => {
    setSpinner(true);

    zeraDadosSincronizar();

    // Zera Array Promocoes e Lista Vazia
    setData([]);
    setListaVazia({ value: false, msg: "" });

    const granted_WRITE_EXTERNAL_STORAGE = await getPermissao_WRITE_EXTERNAL_STORAGE();
    const granted_READ_EXTERNAL_STORAGE = await getPermissao_READ_EXTERNAL_STORAGE();

    if (granted_WRITE_EXTERNAL_STORAGE &&
      granted_READ_EXTERNAL_STORAGE === PermissionsAndroid.RESULTS.GRANTED) {

      try {
        // Habilita ou não o botão apagar
        const selecaoVazia = '[{"id":"Vazio"}]';
        const selecoes = await AsyncStorage.getItem("@selecoes_key") || selecaoVazia;
        const selecoesStorage = JSON.parse(selecoes);

        const selecaoApagar = selecoesStorage.find(
          (o: { id: string; }) => o.id === "FUNC_BOT_APAGAR"
        );
        if (selecaoApagar) {
          setBtnApagarHabilitado(selecaoApagar.selecionado);
        }

        // get a list of files and directories in the main bundle
        let folder = seg === 0 ? await getPastaArmazenamentoInterno() : await getPastaArmazenamentoExterno();
        let vazio = false;

        if (folder.sucesso) {
          console.log(`Listando videos em: ${folder.pasta}`);
          logar(`Listando videos em: ${folder.pasta}`);
          const result = await RNFS.readDir(folder.pasta);

          // Filtra os .mp4
          let mp4s = [];
          mp4s = result.filter(
            (o) => o.name.indexOf(".mp4") > 0
          );

          mp4s.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.mtime) - new Date(a.mtime);
          });

          setData(mp4s);
          vazio = mp4s.length === 0;

          if (vazio) {
            setListaVazia({
              value: true,
              msg: "A pasta está vazia. Nenhum vídeo gravado."
            });
          }
        } else {
          setListaVazia({
            value: true,
            msg: folder.msg
          });
          folder.pasta = folder.msg;
        }

        setPasta(folder.pasta);

      } catch (error) {
        // mostraMsg("Erro ao carregar os Vídeos Gravados. ", "error", global.dropDownAlertRef);
        mostraMsgFormAlto("Erro ao carregar os Vídeos Gravados.", true, toast);
        setListaVazia({
          value: true,
          msg: error.toString()
        });
        setSpinner(false);
        return;
      }

    } else {
      logar(`Usuario nao confirmou a permissao para acesso de escrita e leitura dos arquivos.`);
      mostraMsgFormAlto("Preciso de todas as permissões para continuar.", true, toast);
      return false;
    }

    setSpinner(false);
  }

  const renderListaVazia = () => {
    let msg = listaVazia.msg;
    return (<ListaVazia msg={msg} />);
  };

  const renderMensagemSincronizacao = () => {
    let msg = `Clicando em Sincronizar, o aplicativo vai analisar as pastas do armazenamento interno e externo e copiar para o armazenamento externo os vídeos faltantes. Dependendo do tamanho dos arquivos, esse processo pode demorar alguns minutos.`;
    atualizaUltimaSincronizacao(false);
    // TODO: Arrumar a ListaVaziaSincronizar
    // return <ListaVaziaSincronizar msg={msg} />;    
    return (<ListaVazia msg={msg} />);
  };

  const renderVideosCopiados = () => {
    let lista = JSON.parse(JSON.stringify(sincroniza.videosACopiadosLista));
    return (
      <>
        {sincroniza.mostraMsgApresentacao ? renderMensagemSincronizacao() : undefined}
        <View style={styles.modalBody}>
          <View style={styles.viewMsgSincronizar}>
            <Text style={{ color: sincroniza.sincronizando ? undefined : theme.colors.btn_success }}>{sincroniza.mensagem}</Text>

            {sincroniza.msgArqVideo.length > 0 &&
              <Text style={{ color: theme.colors.btn_trash }}>{sincroniza.msgArqVideo}</Text>
            }
          </View>

          <FlatList
            data={lista}
            renderItem={({ item }) => (
              <ListItem>
                <Body style={{ flexDirection: "row", flex: 4 }} >
                  <Text>{item.name}</Text>
                </Body>
                <Right style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 0.5 }} >
                  <FontAwesome5 name="check" style={{ color: theme.colors.btn_success }} />
                </Right>
              </ListItem>
            )}
            keyExtractor={(item) => item.name}
          />
        </View>
      </>
    );

    // return (sincroniza.mostraMsgApresentacao ? renderMensagemSincronizacao() : <ListaVazia msg={"TESTANDO2"} />);
  }

  const atualizaUltimaSincronizacao = async (atualizarDataHora: boolean) => {
    let ultimaSincronizacao = `${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}`;

    if (atualizarDataHora) {
      storeData("@ultima_sincronizacao", ultimaSincronizacao);
    } else {
      ultimaSincronizacao = await AsyncStorage.getItem("@ultima_sincronizacao") || ultimaSincroniza;
    }

    setUltimaSincroniza(ultimaSincronizacao);
  }

  const onFormularioPressed = async (nomeArquivo) => {    
    navegar('FormularioInfoScreen', { arquivoVideo: nomeArquivo, veioDaLista: true });
  }

  const onRemovePressed = async (nomeArquivo) => {    
    setNomeArquivoExcluir(nomeArquivo);
    setIsVisibleRemoveDialog(true);
  }

  const getVideosArmazenamentoExterno = async (pastaArmazenamentoExterno) => {
    try {
      let vazio = false;
      const result = await RNFS.readDir(pastaArmazenamentoExterno.pasta);

      // Filtra os .mp4
      let mp4s = [];
      mp4s = result.filter(
        (o) => o.name.indexOf(".mp4") > 0
      );

      mp4s.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.mtime) - new Date(a.mtime);
      });
      vazio = mp4s.length === 0;

      if (vazio) {
        console.log(`Não existem vídeos armazenados no armazenamento externo (SDCard).`);
        return [{}];
      } else {
        const jsonVideosExternos: { name: any; size: any; }[] = [];
        mp4s.forEach((element: { name: any; size: any; }) => {
          jsonVideosExternos.push({ name: element.name, size: element.size });
        });
        console.log(`EXTERNOS: ${JSON.stringify(jsonVideosExternos)}`);
        return jsonVideosExternos;
      }

    } catch (error) {
      // mostraMsg("Erro ao acessar os Vídeos Gravados no armazenamento externo. ", "error", global.dropDownAlertRef);
      mostraMsgFormAlto("Erro ao acessar os Vídeos Gravados no armazenamento externo.", true, toast);
      return;
    }
  }

  const zeraDadosSincronizar = async () => {
    setSincroniza({
      ...sincroniza,
      sincronizando: false,
      mostraMsgApresentacao: true,
      videosACopiar: [],
      mensagem: "",
      msgArqVideo: "",
      videosACopiadosLista: []
    });    
  }

  const onSincronizarPressed = async () => {

    setSpinner(true);

    let pastaArmazenamentoInterno = await getPastaArmazenamentoInterno();
    let pastaArmazenamentoExterno = await getPastaArmazenamentoExterno();
    logar(`Usuario clicou em Sincronizar.${pastaArmazenamentoExterno.sucesso ? "" : " Não existe armazenamento externo (SDCard)."}`);

    zeraDadosSincronizar();

    if (pastaArmazenamentoExterno.sucesso) {
      try {
        let vazio = false;

        logar(`Listando videos em: ${pastaArmazenamentoInterno.pasta}`);
        const result = await RNFS.readDir(pastaArmazenamentoInterno.pasta);

        // Filtra os .mp4
        let mp4s = [];
        mp4s = result.filter(
          (o) => o.name.indexOf(".mp4") > 0
        );

        mp4s.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(a.mtime) - new Date(b.mtime);
        });
        vazio = mp4s.length === 0;

        if (vazio) {
          // mostraMsg("Não existem vídeos gravados no armazenamento interno. ", "warn", global.dropDownAlertRef);
          mostraMsgFormAltoTipo("Não existem vídeos gravados no armazenamento interno. ", "warning", toast);
        } else {
          // this.setState({
          //   data: mp4s
          // });
          console.log(`Quantidade de vídeos gravados no armazenamento interno: ${mp4s.length} `);

          const jsonVideosInternos = [];
          mp4s.forEach((element) => {
            jsonVideosInternos.push({ name: element.name, size: element.size });
          });
          console.log(`INTERNOS: ${JSON.stringify(jsonVideosInternos)}`);

          const jsonVideosExternos = await getVideosArmazenamentoExterno(pastaArmazenamentoExterno);

          // Videos a copiar
          let videosCopiar = [];
          let videoCopiar = [];
          let videosCopiarJaTem = [];

          jsonVideosInternos.forEach((element) => {
            console.log(`- Testando se contem: ${element.name}`);
            videoCopiar = jsonVideosExternos.filter(
              (o) => o.name === element.name && o.size === element.size
            );
            if (videoCopiar.length == 0) {
              // console.log(`== NAO TEM => Size interno: ${element.size}`);
              videosCopiar.push(element);
            } else {
              videosCopiarJaTem.push(element);

              // const jsonVideoCopiar = JSON.stringify(videoCopiar[0]);
              // console.log(`== JA TEM => Size interno: ${element.size} => Size externo: ${JSON.parse(jsonVideoCopiar).size} - IGUAL: ${ element.size === JSON.parse(jsonVideoCopiar).size }`);
            }
          });

          // console.log(`=> Videos a copiar: ${JSON.stringify(videosCopiar)}`);
          // console.log(`=> Videos ja tem: ${JSON.stringify(videosCopiarJaTem)}`);

          if (videosCopiar.length === 0) {
            // mostraMsg("As pastas estão sincronizadas. ", "info", global.dropDownAlertRef);
            mostraMsgFormAltoTipo(`As pastas estão sincronizadas.`, "normal", toast);
            atualizaUltimaSincronizacao(true);
          } else {
            copiarVideosParaArmazExterno(pastaArmazenamentoInterno, pastaArmazenamentoExterno, videosCopiar);
            return;
          }

        };

      } catch (error) {
        // mostraMsg("Erro ao acessar os Vídeos Gravados. ", "error", global.dropDownAlertRef);
        mostraMsgFormAlto(`Erro ao acessar os Vídeos Gravados. `, true, toast);
        setSpinner(false);
        return;
      }

    } else {
      // mostraMsg("Não existe armazenamento externo (SDCard)", "error", global.dropDownAlertRef);
      mostraMsgFormAlto(`Não existe armazenamento externo (SDCard)`, true, toast);
    }

    setSpinner(false);
  }

  const copiarVideosParaArmazExterno = (pastaArmazenamentoInterno, pastaArmazenamentoExterno, videosCopiar) => {

    logar(`Iniciando cópia dos vídeos para armazenamento externo.`);

    setSincroniza({
      ...sincroniza, videosACopiar: videosCopiar,
      sincronizando: true,
      mostraMsgApresentacao: false,
      videosACopiadosLista: []
    });

    function logarVideosCopiadosOK(strVideos) {
      logar(`Vídeos copiados com sucesso para o armazenamento externo: ${strVideos}`);
    }

    function logarVideosCopiadosERRO(videosErro) {
      if (videosErro && videosErro.length > 0) {
        let strVideosCopiadosErroLog = "";
        videosErro.forEach(element => {
          strVideosCopiadosErroLog += `${element} | `;
        });
        logar(`ERRO ao copiar os vídeos para o armazenamento externo: ${strVideos}`);
      }
    }

    let videosCopiadosOK = [];
    let videosCopiadosERRO = [];

    let strVideosCopiados = "";
    let strVideosCopiadosOKLog = "";

    const copiarVideos = async (indice) => {
      setSpinner(false);

      indice++;

      if (indice === videosCopiar.length) {

        videosCopiadosOK.forEach(element => {
          strVideosCopiadosOKLog += `${element} | `;
        });

        setSincroniza({
          ...sincroniza, sincronizando: false,
          videosACopiar: [],
          videosACopiadosLista: videosCopiadosOK,
          mensagem: `Finalizado! ${indice} vídeos copiados:\n ${strVideosCopiados}`,
          msgArqVideo: ``
        });

        atualizaUltimaSincronizacao(true);

        console.log(`= FIM COPIAR VIDEO ARMEXTERNO: ${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}`);

        logarVideosCopiadosOK(strVideosCopiadosOKLog);
        logarVideosCopiadosERRO(videosCopiadosERRO);

        return;
      }

      setSpinner(true);

      const videoACopiar = videosCopiar[indice].name;
      const nomeArqVideoInterno = pastaArmazenamentoInterno.pasta + '/' + videoACopiar;
      const novoNomeArqVideoExterno = pastaArmazenamentoExterno.pasta + '/' + videoACopiar;

      console.log(`COPIANDO[${indice}]: ${nomeArqVideoInterno} para ${novoNomeArqVideoExterno} - Length: ${videosCopiar.length}`);

      const indiceLabel = indice + 1;

      setSincroniza({
        ...sincroniza, sincronizando: true,
        videosACopiar: videosCopiar,
        mensagem: `Copiando vídeo ${indiceLabel} de ${videosCopiar.length}`,
        msgArqVideo: `${videoACopiar}`
      });

      const resultadoCopia = await copiarArquivoParaArmazExterno(nomeArqVideoInterno, novoNomeArqVideoExterno);

      if (resultadoCopia) {
        videosCopiadosOK.push({ name: videoACopiar });
      } else {
        videosCopiadosERRO.push(videoACopiar);
        mostraMsgForm(`Ocorreu erro ao copiar o vídeo: ${videoACopiar}`, true, toast);
      }

      copiarVideos(indice);

    }

    console.log(`= INICIO COPIAR VIDEO ARMEXTERNO: ${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}`);
    copiarVideos(-1);
  }

  const copiarArquivoParaArmazExterno = async (nomeArqVideoInterno, novoNomeArqVideoExterno) => {

    // Copiar nativamente
    // const retorno = await CameraCebraspeModule.copyFileToExternalFolder(nomeArqVideoInterno, novoNomeArqVideoExterno);
    // console.log(`= RETORNO COPYNATIVO: ${retorno}`);
    // return retorno;

    return await RNFS.copyFile(nomeArqVideoInterno, novoNomeArqVideoExterno)
      .then((success) => {
        console.log(`Video de ${nomeArqVideoInterno} copiado para ${novoNomeArqVideoExterno}`);
        return true;
      })
      .catch((err) => {        
        console.log("Erro ao copiar video: " + err.message); // <--- but copyFile returns "doesn't exists" error for temp.jpg
        return false;
      });

  }

  const onPlayPressed = async (nomeArquivo) => {
    const enderecoVideo = 'file://' + pasta + '/' + nomeArquivo;
    logar(`Usuario assistiu o video: ${enderecoVideo}`);
    navegar("VideoPlay", { arquivoVideo: enderecoVideo });
  }

  const simPressRemoveModal = () => {
    setSpinner(true);

    logar(`Usuario removeu o video: ${pasta + '/' + nomeArquivoExcluir}`);
    var path = pasta + '/' + nomeArquivoExcluir;
    
    setIsVisibleRemoveDialog(false);

    const excluiArquivoTxt = async (path) => {      
      let arquivoTxt = path.replace(".mp4", ".txt");
      let exists = await RNFS.exists(arquivoTxt);
      if (exists) {
        return RNFS.unlink(arquivoTxt)
          .then(() => {
            console.log(`- Arquivo: ${arquivoTxt} excluído corretamente.`);
          })
          // `unlink` will throw an error, if the item to unlink does not exist
          .catch((err) => {
            console.log(err.message);
          });
      }      
    }

    console.log(`- Vou excluir o video: ${path}`);
    return RNFS.unlink(path)
      .then(() => {
        console.log(`- EXCLUI o video: ${path}`);
        setSpinner(false);
        excluiArquivoTxt(path);
        carregaVideosTutoriais();
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        setSpinner(false);
        console.log(err.message);
      });
  }

  const naoPressRemoveModal = () => {
    setNomeArquivoExcluir("");
    setIsVisibleRemoveDialog(false);
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

  // componentWillReceiveProps
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`== Carregando componentWillReceiveProps ==`);      
      setSeg(0);
      carregaVideosTutoriais();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Dessa forma soh chama na primeira vez
  useEffect(() => {
    console.log(`== Carregando tela ==`);
    carregaVideosTutoriais();
  }, []);

  const renderHeader = () => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header2}>
          <Tab
            value={seg}
            onChange={(e) => {
              console.log(`- SEG: ${e}`);
              setSeg(e);
              scrollRef.current?.scrollTo({
                x: ScreenWidth * e,
              });
            }}
            indicatorStyle={{
              backgroundColor: 'white',
            }}
            style={{ backgroundColor: 'transparent', flex: 1 }}
          >
            <Tab.Item
              title="Armazenamento Interno"
              titleStyle={{ color: '#fff', fontSize: 14 }}
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
            />
            <Tab.Item
              title="Armazenamento Externo"
              titleStyle={{ color: '#fff', fontSize: 14 }}
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
            />
            <Tab.Item
              title="Sincronização"
              titleStyle={{ color: '#fff', fontSize: 14 }}
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
            />
          </Tab>
        </View>
      </SafeAreaView>
    );
  };

  const renderRodape = () => {
    const dataLength = data.length;
    const segmento = seg;
    return (
      <View style={styles.bottomView}>
        <View
          style={{
            ...styles.parentFooter,
            backgroundColor: theme.colors.app_bg,
            width: "100%",
          }}
        >
          {/* <Text note style={{ color: "#fff" }}> */}
          <Text style={{ color: "#fff" }}>
            {(segmento === 0 || segmento === 1) && pasta && pasta.length > 0
              ? pasta : ""}
          </Text>
          <Text style={{ color: "#fff" }}>
            {data
              ? data.length + (data.length <= 1 ? " Arquivo" : " Arquivos")
              : "0 Arquivo"}
          </Text>
        </View>
      </View>
    );
  };

  const renderBtnSincronizar = () => {
    return (
      <View style={styles.bottomViewBtnSincronizar}>
        <View style={styles.bottomViewLabelUltimaSincroniza}>
          <Text>Última sincronização: </Text>
          <Text style={{ color: theme.colors.btn_trash }}>{ultimaSincroniza}</Text>
        </View>
        <Button
          title="Sincronizar"
          buttonStyle={{ backgroundColor: theme.colors.btn_success }}
          containerStyle={{
            width: "100%"
          }}
          titleStyle={{
            color: 'white'
          }}
          onPress={() => onSincronizarPressed()}
        />
      </View>
    );
  }

  const inputProps = {};
  return (
    // Tive que fazer dessa forma pra sensibilizar a lista na tela
    // const lista = JSON.parse(JSON.stringify(data));
    // const segmento = seg;
    <>
      <ContainerApp>

        <Header title="Vídeos Gravados" view="Vídeos Gravados"  navegarBack={() => goBack('', '')} />

        {renderHeader()}

        <Spinner
          visible={spinner}
          textContent={"Aguarde..."}
          textStyle={theme.spinnerTextStyle}
        />

        {(seg === 0 || seg === 1) && data && data.length > 0 ? (
          <FlatList
            style={{ marginBottom: 40 }}
            ListHeaderComponent={
              <>
              </>
            }
            data={data}
            renderItem={({ item }) => (
              <ListItem.Swipeable
                // onPress={log}
                bottomDivider
                leftContent={
                  <Button 
                    title={"Play"}                   
                    icon={
                      <FontAwesome5 name="play" size={20} style={{ color: "#fff", paddingRight: 10 }} />
                    }
                    buttonStyle={{
                      width: "100%",
                      backgroundColor: theme.colors.btn_success,
                      borderRadius: 5,
                    }}
                    titleStyle={{
                      fontFamily: 'regular',
                      fontSize: 13,
                      color: '#fff',
                    }}
                    onPress={() => onPlayPressed(item.name)}
                  />
                }
                leftStyle={{ backgroundColor: '#fff', padding: 5 }}
                rightContent={
                  <>
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>

                      <Button
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                          backgroundColor: theme.colors.txt_titulo_cinza,
                          borderColor: 'transparent',
                          borderWidth: 0,
                          borderRadius: 5
                        }}
                        containerStyle={{
                          width: btnApagarHabilitado ? "45%" : "100%",
                          paddingRight: 5
                        }}
                        icon={
                          <FontAwesome5 name="clipboard" size={20} style={{ color: "#fff" }} />
                        }
                        onPress={() => onFormularioPressed(item.name)}
                      />
                      { btnApagarHabilitado &&
                        <Button
                          titleStyle={{ fontWeight: '700' }}
                          buttonStyle={{
                            backgroundColor: theme.colors.btn_trash,
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 5,
                          }}
                          containerStyle={{
                            width: "45%",
                          }}
                          icon={
                            <FontAwesome5 name="trash-alt" size={20} style={{ color: "#fff" }} />
                          }
                          onPress={() => onRemovePressed(item.name)}
                        />
                      }

                    </View>

                  </>

                }
                rightStyle={{ backgroundColor: '#fff', padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              >
                {/* <Icon name={item.icon} /> */}
                <ListItem.Content style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", flex: 3.5 }}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end", flex: 1.5 }} >
                  <ListItem.Subtitle>{moment(new Date(item.mtime)).format("DD/MM/YYYY HH:mm:ss")}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end", flex: 0.8 }} >
                  <ListItem.Subtitle>{formatBytes(item.size)}</ListItem.Subtitle>
                </ListItem.Content>

              </ListItem.Swipeable>
            )}
            keyExtractor={(item) => item.name}
          />
        ) : (
          seg === 2 ?
            // <View style={{ flex: 1 }}>
            renderVideosCopiados()
            // </View>
            : renderListaVazia()
        )}

        {/* <Dialog          
          onBackdropPress={() => setNomeArquivoExcluir("")}
          isVisible={ isVisibleRemoveDialog }
        >
          <Dialog.Title title="Excluir"/>
          <Text>Tem certeza que deseja remover o vídeo?</Text>
          <Dialog.Actions>
            <Dialog.Button title="Sim" onPress={() => simPressRemoveModal(this)}/>
            <Dialog.Button title="Não" onPress={() => naoPressRemoveModal() }/>
          </Dialog.Actions>
        </Dialog> */}

        <RemoverModal
          isOpen={isVisibleRemoveDialog}
          onOpened={() => {
            setIsVisibleRemoveDialog(true);
          }}
          onClosed={() => {
            setIsVisibleRemoveDialog(false);
          }}
          simPress={() => simPressRemoveModal(this)}
          mensagem={"Tem certeza que deseja remover o vídeo?"}
        />

      </ContainerApp>

      {(seg === 0 || seg === 1) ? (
        renderRodape()
      ) : (
        !sincroniza.sincronizando &&
        renderBtnSincronizar()
      )
      }


    </>
  );
};

export default VideosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.app_container_app,
    position: 'relative',
  },
  safeArea: {
    // backgroundColor: '#075E54'
    backgroundColor: theme.colors.laranja_cebraspe
  },
  icon: {
    paddingHorizontal: 10,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: ScreenWidth - 40
    width: "100%"
  },
  modalBody: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  viewMsgSincronizar: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomView: {
    backgroundColor: theme.colors.container_bg,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  },
  bottomViewLabelUltimaSincroniza: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    paddingTop: 0
  },
  bottomViewBtnSincronizar: {
    backgroundColor: theme.colors.app_container_app,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginRight: 10,
    padding: 15
  },
  parentFooter: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10
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