import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";
import { theme } from "../theme";

const TextTituloTexto = ({ ...props }) => (
  <Text style={estilo(props)}>
    {props.children ? props.children : undefined}
  </Text>
);

const estilo = (props) => {
  const titulo = {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.card_info_titulo,
  };

  const texto = {
    fontSize: 16,
    color: theme.colors.card_info_texto,
  };

  const estiloMarginBottom = { marginBottom: props.mb };
  let novoEstilo = {};

  if (props.tipo === "titulo") {
    novoEstilo = { ...titulo, ...estiloMarginBottom };
  } else {
    novoEstilo = { ...texto, ...estiloMarginBottom };
  }

  return novoEstilo;
};

export default TextTituloTexto;
