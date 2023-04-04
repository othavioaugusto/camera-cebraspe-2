
var RNFS = require("react-native-fs");
const absolutePath = RNFS.DownloadDirectoryPath + "/cebraspe-video-recorder";
const constants =
{
    qualidade: "480p",
    // qualidade: "4:3",
    videoBitRate: (0.75*1000*1000), // Padrao: (6*1000*1000)
    ratio: "4:3",
    espacoBytesDiscoCheio: 10000000,
    tempoGravacao: "10",
    idPathSelect: "10",
    absolutePath,
    jsonFormularioPadrao: {
        "ttl":"Notas",            
        "dados": [
          {
            "id": "notas",
            "tp": "texto_grande",                
            "ttl":"Notas",
            "desc": "Caso deseje, informe aqui algo sobre o vídeo",
            "vlr": "",
            "size": 500,
            "linhas": 5
          }
        ]
      }
};

module.exports = {
    constants
};
