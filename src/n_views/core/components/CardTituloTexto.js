import React from "react";
import { StyleSheet, View } from "react-native";
import { Content, Text, Body, Card, CardItem, List } from "native-base";
import TextTitulo from "./TextTitulo";
import { theme } from "../theme";

const CardTituloTexto = ({ ...props }) => (
  <Card>
    <CardItem>
        <Body>
          {props.mensagem && Array.isArray(props.mensagem) ? (
            <List
              dataArray={props.mensagem}
              renderRow={(mensagem) => (
                <TextTitulo tipo={mensagem.tipo} mb={15}>
                  {mensagem.msg}
                </TextTitulo>
              )}
            />
          ) : (
            <Text>{props.mensagem}</Text>
          )}
          {props.children ? props.children : undefined}
        </Body>
    </CardItem>
  </Card>
);

export default CardTituloTexto;
