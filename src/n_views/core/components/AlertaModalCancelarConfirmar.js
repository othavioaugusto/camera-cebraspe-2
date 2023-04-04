import React, { Component } from "react";
import { Text, CheckBox, ListItem } from "native-base";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox";

import { theme } from "../theme";

class AlertaModalCancelarConfirmar extends Component {
  constructor(props) {
    super(props);
  }

  open() {
    this.refs.alertaModalClass.open();
  }

  close() {
    this.refs.alertaModalClass.close();
  }

  render() {
    return (
      <Modal
        {...this.props}
        style={[styles.modal, styles.alertaModal]}
        position={"center"}
        ref={"alertaModalClass"}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>{this.props.titulo}</Text>
              <View style={styles.divider}></View>
            </View>
            <View style={{ ...styles.modalBody, height: 180 }}>
              <Text style={styles.bodyText}>{this.props.mensagem}</Text>
            </View>
            <View style={styles.modalFooter}>
              <View style={styles.divider}></View>

              <View style={{ flexDirection: "row-reverse", margin: 5 }}>
                <TouchableOpacity
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_success,
                  }}
                  onPress={this.props.simPress}
                >
                  <Text style={styles.actionText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_fechar,
                  }}
                  onPress={this.props.cancelarPress}
                >
                  <Text style={styles.actionText}>Cancelar</Text>
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
    borderRadius: 5
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: theme.colors.card_info_titulo,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalFooter: {},
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
    height: 300,
    width: 300,
  },
  naoVerMais: {
    width: "100%",
    alignItems: "flex-end",
    flexDirection: "row",
    padding: 10,
  },
});

export default AlertaModalCancelarConfirmar;
