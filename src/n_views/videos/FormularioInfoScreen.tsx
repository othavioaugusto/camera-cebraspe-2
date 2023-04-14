import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import {
  Input,
  Button,
  ListItem,
  Text
} from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import ContainerApp from "../core/components/ContainerApp";
var RNFS = require("react-native-fs");
import Spinner from "react-native-loading-spinner-overlay";
import { constants } from "../core/constants";
import { mostraMsg, mostraMsgFormAlto, getPastaArmazenamentoInterno, criaPreencheArquivoFormularioPadrao } from "../core/utils";
import { Header } from '../../components/header';
import { useToast } from "react-native-toast-notifications";
import { theme } from "../core/theme";


const SCREEN_WIDTH = Dimensions.get('window').width;

type FormularioInfoComponentProps = {};

const FormularioInfoScreen: React.FunctionComponent<FormularioInfoComponentProps> = ({ route, navigation }) => {

  const toast = useToast();

  const [spinner, setSpinner] = useState(false);
  const [datas, setDatas] = useState([]);
  const [fileVideoInterno, setFileVideoInterno] = useState("");
  const [jsonFormulario, setJsonFormulario] = useState(constants.jsonFormularioPadrao);

  const [configInitTela, setConfigInitTela] = useState({ preencherTela: false, veioDaLista: false, arquivoVideo: "" });

  useEffect(() => {
    if (configInitTela.preencherTela) {
      preencheConfiguracoes();
    }
  }, [configInitTela]);

  const navegar = (tela, params) => {
    navigation.navigate(tela, { ...params });
  }

  const goBack = (msg, tipo) => {
    navigation.goBack();
    route.params.onGoBack({ msg, tipo });
  }

  const alteraFormulario = async (id, novoValor) => {
    setSpinner(true);

    let jsonFormularioDadosTmp = jsonFormulario.dados || [];

    Object.entries(jsonFormularioDadosTmp).forEach(([key, value]) => {
      if (value.id === id) {
        jsonFormularioDadosTmp[key].vlr = novoValor;
      }
    });

    setJsonFormulario({ ...jsonFormulario, dados: jsonFormularioDadosTmp });

    setSpinner(false);
  }

  const preencheJsonArquivoExistente = async (arquivo) => {
    setSpinner(true);

    console.log(`Vou LeR o arquivo: ${arquivo}`);
    const linhasArquivo = await RNFS.readFile(arquivo, 'utf8');

    console.log(`- RETORNO: Li o arquivo de informações: ${linhasArquivo} - ${linhasArquivo.length}!`);

    const jsonArquivo = linhasArquivo.substring(
      linhasArquivo.indexOf("### INICIO_JSON_FORMULARIO ###") + 30,
      linhasArquivo.lastIndexOf("### FIM_JSON_FORMULARIO ###")
    );
    // console.log(`JSON FILE: ${jsonArquivo}`);

    const json = JSON.parse(jsonArquivo);
    // console.log(`JSON: ${json.dados}`);

    let jsonFormularioDadosTmp = json.dados || [];
    // Object.entries(jsonFormularioDadosTmp).forEach(([key, value]) => {            
    //    console.log(`DADO: ${jsonFormularioDadosTmp[key].ttl}: ${jsonFormularioDadosTmp[key].vlr}`);
    // });

    setJsonFormulario({ ...jsonFormulario, dados: jsonFormularioDadosTmp });

    setSpinner(false);
  }

  const atualizarArquivoFormulario = async (arquivoVideoInterno) => {
    let conteudoArquivo = "";
    let retornoCria = false;
    // write the file
    jsonFormulario.dados.forEach(element => {
      conteudoArquivo += `${element.ttl}: ${element.vlr}\n`;
    });
    conteudoArquivo += `\n\n\n ### INICIO_JSON_FORMULARIO ###${JSON.stringify(jsonFormulario)}### FIM_JSON_FORMULARIO ###`;
    retornoCria = await RNFS.writeFile(arquivoVideoInterno, conteudoArquivo, 'utf8').then((success) => {
      console.log('Criei e escrevi no arquivo de informações!');
      return true;
    })
      .catch((err) => {
        console.log(err.message);
        return false;
      });

    return retornoCria;
  }

  const getArquivoVideoFormularioInterno = async () => {
    let msgErro = "";
    let arquivoVideoInterno = "";
    const pastaArmazenamentoInterno = await getPastaArmazenamentoInterno();
    if (pastaArmazenamentoInterno.sucesso) {
      try {
        arquivoVideoInterno = `${pastaArmazenamentoInterno.pasta}/${configInitTela.arquivoVideo}`;
        let existsInterno = await RNFS.exists(arquivoVideoInterno);
        return { OK: true, existsInterno: existsInterno, arquivoVideoInterno: arquivoVideoInterno };
      } catch (err1) {
        msgErro = `Erro ao recuperar arquivo! As informações não serão salvas!`;
        // mostraMsg(msgErro, "error", global.dropDownAlertRef);
        mostraMsgFormAlto(msgErro, true, toast);
        return { ERRO: msgErro };
      }
    } else {
      msgErro = `Não foi possível recuperar o arquivo! As informações não serão salvas!`;
      // mostraMsg(msgErro, "error", global.dropDownAlertRef);
      mostraMsgFormAlto(msgErro, true, toast);
      return { ERRO: msgErro };
    }
  }

  const criaPreencheArquivoFormulario = async () => {
    const { OK, existsInterno, arquivoVideoInterno } = await getArquivoVideoFormularioInterno();
    console.log(`- Retornei: ${OK} - ${existsInterno} - ${arquivoVideoInterno}`);
    if (OK) {
      if (!existsInterno) {
        await atualizarArquivoFormulario(arquivoVideoInterno);
      } else {
        await preencheJsonArquivoExistente(arquivoVideoInterno);
      }
    }
  }

  const onSalvarPressed = async () => {
    const { OK, existsInterno, arquivoVideoInterno } = await getArquivoVideoFormularioInterno();
    if (OK) {
      await atualizarArquivoFormulario(arquivoVideoInterno);
      if (arquivoVideoInterno && arquivoVideoInterno.length > 0) {
        // mostraMsg(`Dados salvos com sucesso!`, "success", global.dropDownAlertRef);
        mostraMsgFormAlto(`Dados salvos com sucesso!`, false, toast);
      }
    }
  }

  const verificaCriaArquivoTxtFormulario = async () => {
    const { OK, existsInterno, arquivoVideoInterno } = await getArquivoVideoFormularioInterno();
    if (OK) {
      if (!existsInterno) {
        await criaPreencheArquivoFormularioPadrao(configInitTela.arquivoVideo);
      }
    }
  }

  const preencheConfiguracoes = async () => {
    setSpinner(true);
    // await zeraErrosAnteriores();

    let arquivoVideoInterno = "";

    if (configInitTela.veioDaLista) {
      await verificaCriaArquivoTxtFormulario();
    }

    setDatas([]);
    await setFileVideoInterno(arquivoVideoInterno);

    await criaPreencheArquivoFormulario();

    setSpinner(false);
  }

  useEffect(() => {
    const veioDaLista = route.params.veioDaLista || false;
    const msgVideoSucesso = route.params.msgVideoSucesso;
    const jsonFormulario = route.params.jsonFormulario;
    const arquivoVideo = route.params.arquivoVideo.replace(".mp4", ".txt");

    console.log(`componentDidMount - ${veioDaLista} - ${arquivoVideo} - ${JSON.stringify(jsonFormulario)}`);

    if (!veioDaLista && msgVideoSucesso) {

      // mostraMsg(
      //   msgVideoSucesso,
      //   "info",
      //   global.dropDownAlertRef7000
      // );
      mostraMsgFormAlto(msgVideoSucesso, false, toast);

      const jsonFormularioParam = JSON.parse(jsonFormulario) || constants.jsonFormularioPadrao;
      setJsonFormulario(jsonFormularioParam);
    }

    setConfigInitTela({ preencherTela: true, veioDaLista: veioDaLista, arquivoVideo: arquivoVideo });

  }, []);

  const renderNomeArquivo = () => {
    return (
      <View
        style={{
          ...styles.viewNomeArquivo,
          backgroundColor: theme.colors.app_bg_dark,
          flexDirection: "row",
        }}
      >
        <Text note style={{ color: "#fff" }}>
          {configInitTela.arquivoVideo ? configInitTela.arquivoVideo : undefined}
        </Text>
      </View>
    );
  };

  const renderBtnSalvar = () => {
    return (
      <View style={styles.bottomViewBtnSalvar}>
        <Button
          title="Salvar"
          buttonStyle={{ backgroundColor: theme.colors.btn_success }}
          containerStyle={{
            width: "100%"
          }}
          titleStyle={{
            color: 'white'
          }}
          onPress={() => onSalvarPressed()}
        />
      </View>
    );
  }

  return (
    <>
      <ContainerApp>
        <Header title={`${jsonFormulario.ttl}`} naoMostrarHome navegarBack={() => goBack('', '')} />

        <Spinner
          visible={spinner}
          textContent={"Aguarde..."}
          textStyle={theme.spinnerTextStyle}
        />

        {renderNomeArquivo()}

        <FlatList
          style={{ marginBottom: 55 }}
          ListHeaderComponent={
            <>
            </>
          }
          data={jsonFormulario.dados}
          renderItem={({ item }) => (
            item.tp === 'texto_normal' ? (
              <View style={{ flex: 1 }}>
                <ListItem bottomDivider>
                  <ListItem.Content style={{ flex: 1 }}>
                    <ListItem.Title>{item.ttl}</ListItem.Title>
                    <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
                    <Input
                      returnKeyType="done"
                      value={item.vlr}
                      maxLength={item.size}
                      onChangeText={(text) =>
                        alteraFormulario(item.id, text)
                      }
                    />
                  </ListItem.Content>
                </ListItem>
              </View>
            ) : item.tp === 'texto_grande' ? (
              <View style={{ flex: 1 }}>
                <ListItem bottomDivider>
                  <ListItem.Content style={{ flex: 1 }}>
                    <ListItem.Title>{item.ttl}</ListItem.Title>
                    <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
                    <Input
                      returnKeyType="done"
                      value={item.vlr}
                      maxLength={item.size}
                      multiline
                      numberOfLines={item.linhas}
                      onChangeText={(text) =>
                        alteraFormulario(item.id, text)
                      }
                    />
                  </ListItem.Content>
                </ListItem>
              </View>
            ) : item.tp === 'selecao' ? (
              <View style={{ flex: 1 }}>
                <ListItem bottomDivider>
                  <ListItem.Content style={{ flex: 1 }}>
                    <ListItem.Title>{item.ttl}</ListItem.Title>
                    <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
                    <Picker
                      mode="dropdown"
                      style={{
                        width: "100%"
                      }}
                      selectedValue={item.vlr}
                      onValueChange={(value) =>
                        alteraFormulario(item.id, value)
                      }
                    >
                      {item.vlrs.map((valor, i) => {
                        return (
                          <Picker.Item
                            label={valor.desc}
                            value={valor.vlr}
                          // key={i}
                          />
                        );
                      })}
                    </Picker>
                  </ListItem.Content>
                </ListItem>
              </View>
            ) : (
              <></>
            )

          )}
          keyExtractor={(item) => item.name}
        />

        {renderBtnSalvar()}

      </ContainerApp>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    marginTop: 20,
  },
  viewNomeArquivo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 5
  },
  bottomViewBtnSalvar: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    marginRight: 10,
    padding: 15
  },
});

export default FormularioInfoScreen;
