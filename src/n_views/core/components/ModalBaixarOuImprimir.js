/* eslint-disable no-trailing-spaces */
/* eslint-disable react/no-string-refs */
import React, { Component } from "react";
import { Text } from "native-base";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox";

import { theme } from "../theme";

class ModalBaixarOuImprimir extends Component {
  constructor(props) {
    super(props);      
  }

  open() {
    this.refs.modalBaixarOuImprimir.open();
  }

  close() {
    this.refs.modalBaixarOuImprimir.close();
  }

  render() {
    return (
      <Modal
        {...this.props}
        style={[styles.modal, styles.alertaModal]}
        position={"center"}
        ref={"modalBaixarOuImprimir"}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.title}>{this.props.titulo}</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.modalBody}>              
              <View style={{ margin: 5 }}>
                <TouchableOpacity
                  onPress={() => this.props.onModalDownloadPressed()}
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_outros,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.props.onModalImprimirPressed()}
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_outros,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }}>Imprimir</Text>
                </TouchableOpacity>                
              </View>
            </View>

            <View style={styles.modalFooter}>
              <View style={styles.divider} />
              <View style={{ margin: 5 }}>
                <TouchableOpacity
                  onPress={() => this.close()}
                  style={{
                    ...styles.actions,
                    backgroundColor: theme.colors.btn_fechar,
                  }}
                >
                  <Text style={{ color: "#fff" }}>Fechar</Text>
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
    // Pra fazer tudo funcionar o pulo do Gato
    // foi esse flex: 1 - Carai
    flex: 1,
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,    
    width: 300,
  },
  modalFooter: {
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  actions: {
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  alertaModal: {
    height: 250,
    width: 300,
  },
  itemInputContainer: {
    marginTop: 10,
    marginVertical: 5,
  },
});

export default ModalBaixarOuImprimir;
