const React = require("react-native");
const { Platform, Dimensions } = React;
import { theme } from "../n_views/core/theme";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.8,
    width: null,
    position: "relative",
    justifyContent: "center", //Centered vertically
    alignItems: "center", // Centered horizontally
  },
  drawerCoverUserLogado: {
    alignSelf: "stretch",
    height: deviceHeight / 12,
    width: null,
    position: "relative",
    justifyContent: "center", //Centered vertically
    alignItems: "center", // Centered horizontally
    marginTop: 0
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    resizeMode: "cover"
  },
  drawerImageNovo: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderColor: "#fff",
    borderWidth: 2
  },
  drawerImageMenorIcone: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    position: "absolute",
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    borderColor: "#fff",
    borderWidth: 1,
    right: 12,
    bottom: 5,
  },
  drawerImageMenorIconeUsuario: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    position: "absolute",
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    borderColor: "#fff",
    borderWidth: 1,
    right: 2,
    bottom: 3,
  },
  drawerImageUsuario: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
    borderColor: "#fff",
    borderWidth: 2
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  textBottomView: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },
  textBottomViewUsuario: {
    width: "70%",
    alignItems: "flex-end"
  },
  imagemBottomViewUsuario: {
    width: "30%",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 7
  },
  textBoldBottomView: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  },
  textNoteBottomView: {
    color: "#fff",
    marginBottom: 10
  },
  item: {
    marginLeft: 0,
    paddingLeft: 15,
    paddingRight: 0,
  },
  itemSelect: {
    backgroundColor: theme.colors.app_bg_dark,
    // borderBottomRightRadius: 30,
    // borderTopRightRadius: 30,
    marginLeft: 0,
    paddingLeft: 15,
    paddingRight: 0,
    // shadowColor: "#000",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 5,
  },
  texto: {
    color: "#fff",
    marginLeft: 0
  },
  textoSelect: {
    //color: theme.colors.card_info_texto,
    color: "#fff",
    marginLeft: 0
  },
  textoVersao: {
    color: "#fff",
    marginLeft: 0,
    fontStyle: "italic"
  },
  iconeSelect: {
    // color: theme.colors.card_info_texto,
    color: "#fff",
    fontSize: 20
  },
  icone: {
    color: "#fff",
    fontSize: 20
  },
  menuSeparador: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: theme.colors.menu_separador
  }
};
