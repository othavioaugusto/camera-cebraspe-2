import React from "react";
import { Text } from "native-base";
import { theme } from "../theme";

const TextTituloModal = ({ ...props }) => (
  <Text style={{ ...props.style, ...estilo(props, undefined, undefined) }}>
    {props.children ? props.children : undefined}
  </Text>
);

const TextTituloAjuda = ({ ...props }) => (
  <Text
    style={{
      ...props.style,
      ...estilo(
        props,
        theme.colors.card_info_titulo,
        theme.colors.card_info_texto
      ),
    }}
  >
    {props.children ? props.children : undefined}
  </Text>
);

const estilo = (props, colorTitulo, colorTexto) => {
  const titulo = {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: colorTitulo ? colorTitulo : theme.colors.card_info_titulo,
  };

  const texto = {
    fontSize: 16,
    color: colorTexto ? colorTexto : theme.colors.card_info_texto,
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

export { TextTituloModal, TextTituloAjuda };
