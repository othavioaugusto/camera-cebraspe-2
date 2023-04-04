import React, { useRef } from 'react';
import { Text, Button } from "react-native-elements";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox";

import { theme } from "../theme";

interface ParentCompProps {
  childComp?: React.ReactNode
}

const AlertaModalNovoSala: React.FunctionComponent<ParentCompProps> = (props) => {

  let alertaModalClass = useRef();

  const open = () => {
    alertaModalClass.current.open();
  }

  const close = () => {
    alertaModalClass.current.close();
  }

  return (
    <>
      <Modal
        {...props}
        style={styles.modal}
        position={"center"}
        ref={alertaModalClass}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>{props.titulo}</Text>
              <View style={styles.divider}></View>
            </View>

            <View style={styles.modalBody}>
              {props.childComp}
            </View>

            <View style={styles.modalFooter}>
              <View style={styles.divider}></View>
              <View style={styles.botoesView}>
                <View style={{ ...styles.botaoView, paddingRight: 5 }}>
                  <Button
                    title="Fechar"
                    buttonStyle={{ backgroundColor: theme.colors.btn_fechar }}
                    containerStyle={{
                      width: "100%"
                    }}
                    titleStyle={{
                      color: 'white'
                    }}
                    onPress={() => close()}
                  />
                </View>
                <View style={{ ...styles.botaoView, paddingLeft: 5 }}>
                  <Button
                    title="Confirmar"
                    buttonStyle={{ backgroundColor: theme.colors.btn_success }}
                    containerStyle={{
                      width: "100%"
                    }}
                    titleStyle={{
                      color: 'white'
                    }}
                    onPress={() => props.onConfirmNovoSalaPressed()}
                  />
                </View>
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
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
    // paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    width: "100%",
  },
  modalFooter: {},
  actions: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: "#fff",
  },
  modal: {
    height: 230,
    width: 380,
    justifyContent: "center",
    alignItems: "center",
  },
  labelForm: {
    fontWeight: "bold",
  },
  itemInputContainer: {
    marginVertical: 0,
  },
  parent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  botoesView: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    padding: 10,
  },
  botaoView: {
    flex: 2,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center"
  },
});

export default AlertaModalNovoSala;