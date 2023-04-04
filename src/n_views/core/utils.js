/* eslint-disable radix */
/* eslint-disable no-undef */
import { constants } from "../core/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment-timezone";
import { getPermissao_WRITE_EXTERNAL_STORAGE, getPermissao_READ_EXTERNAL_STORAGE } from "../core/permissoes";
var RNFS = require("react-native-fs");
import DeviceInfo from 'react-native-device-info';

// We are importing the native Java module here
import { NativeModules, PermissionsAndroid } from 'react-native';
const {CameraCebraspeModule} = NativeModules;

const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return "Por favor, preencha o campo e-mail.";
  }
  if (!re.test(email)) {
    return "Ops! Esse e-mail não é válido.";
  }

  return "";
};

const emailValidatorEsqueceuSenha = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return "Por favor, preencha o campo e-mail.";
  }
  if (!re.test(email)) {
    return "Por favor, informe um e-mail válido.";
  }

  return "";
};

const strNaoVazioValorMinimoEmail = (str, nome, valMinimo) => {
  const re = /\S+@\S+\.\S+/;

  if (!str || str.length <= 0) {
    return `Por favor, preencha o campo ${nome}.`;
  }
  if (str.length < valMinimo) {
    return `${nome} deve possuir no mínimo ${valMinimo} caracteres.`;
  }
  if (!re.test(str)) {
    return "Ops! Esse Email não é válido.";
  }

  return "";
};

const emailValidatorPermiteVazio = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (email && email.length > 0) {
    if (!re.test(email)) {
      return "Ops! Esse Email não é válido.";
    }
  }

  return "";
};

const cpfValidatorPermiteVazio = (cpf) => {
  const re = /^([0-9]){3}\.([0-9]){3}\.([0-9]){3}-([0-9]){2}$/;
  if (cpf && cpf.length > 0) {
    if (!re.test(cpf) || !validarCPF(cpf)) {
      return "Ops! Esse CPF não é válido.";
    }
  }
  return "";
};

const cnpjValidatorPermiteVazio = (cnpj) => {
  const re = /^([0-9]){2}\.([0-9]){3}\.([0-9]){3}\/([0-9]){4}\-([0-9]){2}$/;
  if (cnpj && cnpj.length > 0) {
    if (!re.test(cnpj) || !validarCnpj(cnpj)) {
      return "Ops! Esse CNPJ não é válido.";
    }
  }
  return "";
};

const passwordValidator = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!password || password.length <= 0) {
    return "Por favor, preencha o campo Senha.";
  }
  if (password.length < 6) {
    return "Senha deve conter no mínimo 6 caracteres.";
  }
  if (!re.test(password)) {
    return "Senha deve conter letras e números.";
  }

  return "";
};

const nameValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Por favor, preencha o campo Nome.";
  }
  if (name.length < 3) {
    return "Nome deve possuir no mínimo 3 caracteres.";
  }

  return "";
};

const strNaoVazioValorMinimo = (str, nome, valMinimo) => {
  if (!str || str.length <= 0) {
    return `Por favor, preencha o campo ${nome}.`;
  }
  if (str.length < valMinimo) {
    return `${nome} deve possuir no mínimo ${valMinimo} caracteres.`;
  }

  return "";
};

const strNaoVazioValorMinimoSomenteNome = (str, nome, valMinimo) => {
  if (!str || str.length <= 0) {
    return nome;
  }
  if (str.length < valMinimo) {
    return `${nome} deve possuir no mínimo ${valMinimo} caracteres.`;
  }

  return "";
};

const strSeNaoVazioValorMinimo = (str, nome, valMinimo) => {
  if (str && str.length > 0) {
    if (str.length < valMinimo) {
      return `${nome} deve possuir no mínimo ${valMinimo} caracteres.`;
    }
  }

  return "";
};

const dataValidator = (str, nome) => {
  if (!str || str.length <= 0) {
    return `Por favor, preencha o campo ${nome}.`;
  }
  if (nome.length < 8) {
    return `Verifique o preenchimento do campo ${nome}.`;
  }

  return "";
};

const mostraMsg = (msg, tipo, DropdownAlert) => {
  switch (tipo) {
    case "error":
      DropdownAlert.alertWithType("error", "Erro", msg);
      return "error";
    case "success":
      DropdownAlert.alertWithType("success", "Sucesso", msg);
      return "success";
    case "info":
      DropdownAlert.alertWithType("info", "Informação", msg);
      return "info";
    case "warn":
      DropdownAlert.alertWithType("warn", "Alerta", msg);
      return "warn";
    case "custom":
      DropdownAlert.alertWithType("custom", "Customizado", msg);
      return "custom";
    case "sucesso-lista-vazia":
      //DropdownAlert.alertWithType("info", "Informação", msg);
      return "info";
    default:
      DropdownAlert.alertWithType("info", "Informação", msg);
      return "info";
  }
};

const mostraMsgForm = (msg, erro, Toast) => {
  Toast.show(msg, {
    // type: "normal | success | warning | danger | custom",
    // placement: "top | bottom",
    // duration: 4000,
    // offset: 30,
    // animationType: "slide-in | zoom-in",
    type: erro ? "danger" : "success",
    placement: "bottom",
    duration: 4000,
    offset: 30,
    animationType: "slide-in"
  });
};

const tratarPalavra = (palavraTratar) => {
  palavraTratar = palavraTratar.replace(/[ÀÁÂÃÄÅ]/, "A");
  palavraTratar = palavraTratar.replace(/[àáâãäå]/, "a");
  palavraTratar = palavraTratar.replace(/[ÈÉÊË]/, "E");
  palavraTratar = palavraTratar.replace(/[Ç]/, "C");
  palavraTratar = palavraTratar.replace(/[ç]/, "c");
  palavraTratar = palavraTratar.replace(/[éèëê]/, "e");
  palavraTratar = palavraTratar.replace(/[íìïî]/, "i");
  palavraTratar = palavraTratar.replace(/[óòõöô]/, "o");
  palavraTratar = palavraTratar.replace(/[úùüû]/, "u");
  palavraTratar = palavraTratar.replace(/^ /, "");
  palavraTratar = palavraTratar.replace(/ $/, "");
  palavraTratar = palavraTratar.replace(/\s+/g, "_");
  palavraTratar = palavraTratar.replace(/[\\"]/g, "-");
  palavraTratar = palavraTratar.replace(/[//"]/g, "-");
  return palavraTratar;
};

const tratarPalavraImpressao = (palavraTratar) => {
  palavraTratar = palavraTratar.replace(/[ÀÁÂÃÄÅ]/, "A");
  palavraTratar = palavraTratar.replace(/[àáâãäå]/, "a");
  palavraTratar = palavraTratar.replace(/[ÈÉÊË]/, "E");
  palavraTratar = palavraTratar.replace(/[Ç]/, "C");
  palavraTratar = palavraTratar.replace(/[ç]/, "c");
  palavraTratar = palavraTratar.replace(/[éèëê]/, "e");
  palavraTratar = palavraTratar.replace(/[íìïî]/, "i");
  palavraTratar = palavraTratar.replace(/[óòõöô]/, "o");
  palavraTratar = palavraTratar.replace(/[úùüû]/, "u");
  palavraTratar = palavraTratar.replace(/^ /, "");
  palavraTratar = palavraTratar.replace(/ $/, "");
  palavraTratar = palavraTratar.replace(/[\\"]/g, "-");
  palavraTratar = palavraTratar.replace(/[//"]/g, "-");
  return palavraTratar;
};

function isVazio(str) {
  if (str && str.length > 0) {
    return false;
  }
  return true;
}

const storeData = async (storageKey, value) => {
  try {
    await AsyncStorage.setItem(storageKey, value);
    // await AsyncStorage.setItem('@storage_Key', value)
  } catch (e) {
    // saving error
  }
}

const storeJson = async (storageKey, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storageKey, jsonValue);
  } catch (e) {
    // saving error
  }
}

const logarInterno = async (msg) => {
  const logFileInterno = global.log_filename;
  console.log(`== LogFileNameInterno: [${logFileInterno}] - MSG: ${msg}`);
  try {
    // LOG INTERNO
    let existsInterno = await RNFS.exists(logFileInterno);
    if (!existsInterno) {
      // write the file
      RNFS.writeFile(global.log_filename, msg, 'utf8').then((success) => {
        console.log('Criei e escrevi no log no arquivo interno!');
      })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      RNFS.appendFile(global.log_filename, msg, 'utf8').then((success) => {
        console.log('Appendei o log no arquivo interno!');
      })
        .catch((err) => {
          console.log(err.message);
        });
    }
  } catch (err1) {
    console.log(`== Erro ao manipular arquivo de log interno: [${err1.message}] `);
  }
}

const logarExterno = async (msg) => {
  const logFileExterno = global.log_filename_externo;
  console.log(`== LogFileNameExterno: [${logFileExterno}] - MSG: ${msg}`);
  try {
    // LOG EXTERNO
    if (logFileExterno) {
      let existsExterno = await RNFS.exists(global.log_filename_externo);
      if (!existsExterno) {
        // write the file
        RNFS.writeFile(global.log_filename_externo, msg, 'utf8').then((success) => {
          console.log('Criei e escrevi no log no arquivo externo!');
        })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        RNFS.appendFile(global.log_filename_externo, msg, 'utf8').then((success) => {
          console.log('Appendei o log no arquivo externo!');
        })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }

  } catch (err2) {
    console.log(`== Erro ao manipular arquivo de log externo: [${err2.message}] `);
  }
}

const logar = async (msg) => {
  msg = `[${moment(new Date()).format("DD-MM-YYYY_HH:mm:ss")}] ${msg} \n `;

  const granted_WRITE_EXTERNAL_STORAGE = await getPermissao_WRITE_EXTERNAL_STORAGE();
  const granted_READ_EXTERNAL_STORAGE = await getPermissao_READ_EXTERNAL_STORAGE();

  if (granted_WRITE_EXTERNAL_STORAGE &&
    granted_READ_EXTERNAL_STORAGE === PermissionsAndroid.RESULTS.GRANTED) {
      logarInterno(msg);
      // logarExterno(msg);
  }
}

const getSDCardPathCameraCebraspeModule = async () => {
  const caminho = CameraCebraspeModule.getSDCardPathCameraCebraspe();
  return caminho.substr(0, caminho.indexOf('/cache'));
}

const getPastaArmazenamentoExterno = async () => {
  let pastaArmazenamentoExterno = { sucesso: false, msg: "Não existe armazenamento externo." };
  let pasta = "";
  try {
    const sdCardPathCameraCebraspe = await getSDCardPathCameraCebraspeModule();
    pasta = sdCardPathCameraCebraspe || "/storage/3130-3239/Android/data/com.camcebraspe";
    pasta += "/cebraspe-video-recorder";

    let exists = await RNFS.exists(pasta);
    if (!exists) {
      await RNFS.mkdir(pasta);
    }
    // logar(`Info: Pasta de armazenamento externo carregada com sucesso.`);

  } catch (err) {
    // logar(`Info: Não existe armazenamento externo. Apenas interno.`);
    return pastaArmazenamentoExterno;
  }
  pastaArmazenamentoExterno = { sucesso: true, pasta, msg: "Sucesso." };
  console.log(`== RETORNO getPastaArmazenamentoExterno: ${JSON.stringify(pastaArmazenamentoExterno)}`);
  return pastaArmazenamentoExterno;
}

const getPastaArmazenamentoInterno = async () => {
  let pastaArmazenamentoInterno = { sucesso: false, msg: "Não existe pasta de armazenamento interno." };
  let pasta = "";
  try {
    // pasta = constants.absolutePath + `_${ DeviceInfo.getVersion().replace(/\D/g, "") }`;
    pasta = constants.absolutePath;
    let exists = await RNFS.exists(pasta);
    if (!exists) {
      await RNFS.mkdir(pasta);
    }
    // logar(`Info: Pasta de armazenamento interno carregada com sucesso.`);

  } catch (err) {
    // logar(`Info: Não existe pasta de armazenamento interno.`);
    return pastaArmazenamentoInterno;
  }
  pastaArmazenamentoInterno = { sucesso: true, pasta, msg: "Sucesso." };
  console.log(`== RETORNO getPastaArmazenamentoInterno: ${JSON.stringify(pastaArmazenamentoInterno)}`);
  return pastaArmazenamentoInterno;
}

const criaPreencheArquivoFormularioPadrao = async (arquivoVideoInterno)  => {
  let conteudoArquivo = "";
  let retornoCria;  
  const pastaArmazenamentoInterno = await getPastaArmazenamentoInterno();

  if (pastaArmazenamentoInterno.sucesso) {
    try {
        arquivoVideoInterno = arquivoVideoInterno.replace(".mp4", ".txt");
        arquivoVideoInterno = `${pastaArmazenamentoInterno.pasta}/${arquivoVideoInterno}`;
                
        const jsonFormulario = constants.jsonFormularioPadrao;

        console.log(`- LOG_PADRAO_INTERNO: ${arquivoVideoInterno} - ${JSON.stringify(jsonFormulario)}`);
        
        jsonFormulario.dados.forEach(element => {
          console.log(`- PASSEI: ${element.ttl}: ${element.vlr}`);
          conteudoArquivo += `${element.ttl}: ${element.vlr}\n`;
        });
        
        conteudoArquivo += `\n\n\n ### INICIO_JSON_FORMULARIO ###${JSON.stringify(jsonFormulario)}### FIM_JSON_FORMULARIO ###`;
        retornoCria = await RNFS.writeFile(arquivoVideoInterno, conteudoArquivo, 'utf8').then((success) => {
          console.log('Criei e escrevi no arquivo de informações padrão!');
          return true;
        })
          .catch((err) => {
            console.log(err.message);
            return false;
          });
      
    } catch (err1) {
      logarInterno(`Erro ao criar arquivo formulário padrão interno! As informações não serão salvas!`);
      return false;
    }
  } else {
    logarInterno(`Não foi possível recuperar o arquivo formulário padrão interno! As informações não serão salvas!`);
    return false;
  }

  console.log(`Arquivo video interno: ${arquivoVideoInterno}`);

  return arquivoVideoInterno;
}


module.exports = {
  emailValidator,
  emailValidatorEsqueceuSenha,
  emailValidatorPermiteVazio,
  strNaoVazioValorMinimoEmail,
  cpfValidatorPermiteVazio,
  cnpjValidatorPermiteVazio,
  passwordValidator,
  nameValidator,
  mostraMsg,
  strNaoVazioValorMinimo,
  strNaoVazioValorMinimoSomenteNome,
  strSeNaoVazioValorMinimo,
  mostraMsgForm,
  dataValidator,
  isVazio,
  tratarPalavra,
  tratarPalavraImpressao,
  storeData,
  storeJson,
  logar,
  getSDCardPathCameraCebraspeModule,
  getPastaArmazenamentoExterno,
  getPastaArmazenamentoInterno,
  criaPreencheArquivoFormularioPadrao
};
