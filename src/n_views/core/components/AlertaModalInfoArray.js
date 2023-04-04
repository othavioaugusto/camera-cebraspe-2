/* eslint-disable react/no-string-refs */
import React, { Component } from "react";
import { Text, List, Body, Card, CardItem } from "native-base";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox";
import { TextTituloAjuda } from "./TextTituloModal";

import { theme } from "../theme";

class AlertaModalInfoArray extends Component {
  constructor(props) {
    super(props);
  }

  open() {
    this.refs.alertaModalInfoArray.open();
  }

  close() {
    this.refs.alertaModalInfoArray.close();
  }

  render() {
    return (
      <Modal
        {...this.props}
        style={{ ...styles.modal, ...styles.alertaModal, height: this.props.height ? this.props.height :  450 }}
        position={"center"}
        ref={"alertaModalInfoArray"}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TextTituloAjuda tipo="titulo">
                {this.props.titulo}
              </TextTituloAjuda>
              <View style={styles.divider} />
            </View>

            <List
              style={{ marginBottom: 70 }}
              dataArray={this.props.mensagem.msgArray}
              renderRow={(msg) => (
                <ScrollView style={{ flex: 1 }}>
                  <View style={styles.modalBody}>
                    {msg.titulo ? (
                      <TextTituloAjuda
                        tipo="texto"
                        style={{ fontWeight: "bold" }}
                      >
                        {msg.titulo}
                      </TextTituloAjuda>
                    ) : undefined}
                    <TextTituloAjuda tipo="texto">{msg.texto}</TextTituloAjuda>
                  </View>
                </ScrollView>
              )}
            />

            <View style={styles.modalFooter}>
              <View style={styles.divider} />
              <View style={{ flexDirection: "row-reverse", margin: 5 }}>
                <TouchableOpacity
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_fechar,
                  }}
                  onPress={() => this.close()}
                >
                  <Text style={styles.actionText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "100%",
    borderRadius: 5,
    flex: 1,
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  modalHeader: {},
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalFooter: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#fff",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  alertaModal: {
    height: 450,
    width: 300,
  },
  naoVerMais: {
    width: "100%",
    alignItems: "flex-end",
    flexDirection: "row",
    padding: 10,
  },
});

export default AlertaModalInfoArray;
