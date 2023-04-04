// import React, { Component } from "react";
// import {
//   Text, 
// } from "native-base";
// import { StyleSheet, View, TouchableOpacity } from "react-native";
// import Modal from 'react-native-modalbox';

// import { theme } from "../theme";

// class PararModal extends Component {
//     open() {    
//       this.refs.pararModalClass.open();
//     }
//     close() {    
//       this.refs.pararModalClass.close();
//     }
//     render() {
//       return (
//         <Modal
//           {...this.props}
//           style={[styles.modal, styles.removeModal]}
//           position={"center"}                 
//           ref={"pararModalClass"}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.title}>Parar</Text>
//                 <View style={styles.divider}></View>
//               </View>
//               <View style={styles.modalBody}>
//                 <Text style={styles.bodyText}>
//                   {this.props.mensagem}
//                 </Text>
//               </View>
              // <View style={styles.modalFooter}>
              //   <View style={styles.divider}></View>
              //   <View style={{ flexDirection: "row-reverse", margin: 5 }}>
              //     <TouchableOpacity
              //       style={{
              //         ...styles.actions,
              //         backgroundColor: theme.colors.btn_success,
              //       }}
              //       onPress={this.props.simPress}
              //     >                  
              //       <Text style={styles.actionText}>Sim</Text>
              //     </TouchableOpacity>
              //     <TouchableOpacity
              //       style={{
              //         ...styles.actions,
              //         backgroundColor: theme.colors.btn_trash,
              //       }}
              //       onPress={() => this.close()}
              //     >
              //       <Text style={styles.actionText}>Não</Text>
              //     </TouchableOpacity>
              //   </View>
              // </View>
            // </View>
//           </View>
//         </Modal>
//       );  
//     }
//   }

import React, { useRef } from 'react';
import { Text, Button } from "react-native-elements";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox";

import { theme } from "../theme";

interface ParentCompProps {
  childComp?: React.ReactNode
}

const PararModal: React.FunctionComponent<ParentCompProps> = (props) => {

  let pararModalClass = useRef();

  const open = () => {
    pararModalClass.current.open();
  }

  const close = () => {
    pararModalClass.current.close();
  }

  return (
    <>
      <Modal
        {...props}
        style={[styles.modal, styles.removeModal]}
        position={"center"}
        ref={pararModalClass}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Parar</Text>
              <View style={styles.divider}></View>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.bodyText}>
                {props.mensagem}
              </Text>
            </View>

            <View style={styles.modalFooter}>
                <View style={styles.divider}></View>
                <View style={{ flexDirection: "row-reverse", margin: 5 }}>
                  <TouchableOpacity
                    style={{
                      ...styles.actions,
                      backgroundColor: theme.colors.btn_success,
                    }}
                    onPress={props.simPress}
                  >                  
                    <Text style={styles.actionText}>Sim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.actions,
                      backgroundColor: theme.colors.btn_trash,
                    }}
                    onPress={() => close()}
                  >
                    <Text style={styles.actionText}>Não</Text>
                  </TouchableOpacity>
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
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent:{
      backgroundColor:"#00000099",
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer:{
      backgroundColor:"#f9fafb",
      width:"100%",
      borderRadius:5
    },
    modalHeader:{},
    title:{
      fontWeight:"bold",
      fontSize:20,
      padding:15,
      color:"#000"
    },
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    modalBody:{
      backgroundColor:"#fff",
      paddingVertical:20,
      paddingHorizontal:10,    
      width: 400,
      height: 90
    },
    modalFooter:{},
    actions:{
      borderRadius:5,
      marginHorizontal:5,
      paddingVertical:10,
      paddingHorizontal:20
    },
    actionText:{
      color:"#fff"
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeModal: {
        height: 200,
        width: 400
    }
  });

  export default PararModal;