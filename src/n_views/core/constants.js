
var RNFS = require("react-native-fs");
const absolutePath = RNFS.DownloadDirectoryPath + "/cebraspe-video-recorder";
const constants =
{
  qualidade: "4:3",
  videoBitRate: (0.75*1000*1000), // Padrao: (6*1000*1000) "default"
  ratio: "4:3",
  espacoBytesDiscoCheio: 10000000,
  tempoGravacao: "10",
  idPathSelect: "10",
  absolutePath,
  jsonFormularioPadrao: {
    "ttl": "Notas",
    "dados": [
      {
        "id": "notas",
        "tp": "texto_grande",
        "ttl": "Notas",
        "desc": "Caso deseje, informe aqui algo sobre o vídeo",
        "vlr": "",
        "size": 500,
        "linhas": 5
      }
    ]
  },
  dadosQualidadeVideo: [
    {
      titulo: "Qualidade",
      desc: "Selecione a qualidade da gravação",
      opcoes: [
        {
          desc: "480p (720 x 480)",
          value: "480p"
        },
        {
          desc: "720p (1280 x 720)",
          value: "720p"
        },
        {
          desc: "1080p (1920 x 1080)",
          value: "1080p"
        },
        {
          desc: "4:3 (640x480)",
          value: "4:3"
        },
      ],
      id: 1
    },
    {
      titulo: "Video Bitrate",
      desc: "Selecione o bitrate da gravação",
      opcoes: [
        {
          desc: (0.25) + " Mbps",
          value: (0.25 * 1000 * 1000) + ""
        },
        {
          desc: (0.50) + " Mbps",
          value: (0.50 * 1000 * 1000) + ""
        },
        {
          desc: (0.75) + " Mbps",
          value: (0.75 * 1000 * 1000) + ""
        },
        {
          desc: (1) + " Mbps",
          value: (1 * 1000 * 1000) + ""
        },
        {
          desc: (1.25) + " Mbps",
          value: (1.25 * 1000 * 1000) + ""
        },
        {
          desc: (1.50) + " Mbps",
          value: (1.50 * 1000 * 1000) + ""
        },
        {
          desc: (1.75) + " Mbps",
          value: (1.75 * 1000 * 1000) + ""
        },
        {
          desc: (2) + " Mbps",
          value: (2 * 1000 * 1000) + ""
        },
        {
          desc: (2.25) + " Mbps",
          value: (2.25 * 1000 * 1000) + ""
        },
        {
          desc: (2.50) + " Mbps",
          value: (2.50 * 1000 * 1000) + ""
        },
        {
          desc: (2.75) + " Mbps",
          value: (2.75 * 1000 * 1000) + ""
        },
        {
          desc: (3) + " Mbps",
          value: (3 * 1000 * 1000) + ""
        },
        {
          desc: (3.25) + " Mbps",
          value: (3.25 * 1000 * 1000) + ""
        },
        {
          desc: (3.50) + " Mbps",
          value: (3.50 * 1000 * 1000) + ""
        },
        {
          desc: (3.75) + " Mbps",
          value: (3.75 * 1000 * 1000) + ""
        },
        {
          desc: (4) + " Mbps",
          value: (4 * 1000 * 1000) + ""
        },
        {
          desc: (4.25) + " Mbps",
          value: (4.25 * 1000 * 1000) + ""
        },
        {
          desc: (4.50) + " Mbps",
          value: (4.50 * 1000 * 1000) + ""
        },
        {
          desc: (4.25) + " Mbps",
          value: (4.25 * 1000 * 1000) + ""
        },
        {
          desc: (4.50) + " Mbps",
          value: (4.50 * 1000 * 1000) + ""
        },
        {
          desc: (4.75) + " Mbps",
          value: (4.75 * 1000 * 1000) + ""
        },
        {
          desc: (5) + " Mbps",
          value: (5 * 1000 * 1000) + ""
        },
      ],
      id: 2
    },
  ]
};

module.exports = {
  constants
};
