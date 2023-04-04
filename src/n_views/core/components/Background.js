import React, { Component } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Content } from "native-base";

import styles from "./styles";

class Background extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Content {...this.props}>
        <KeyboardAvoidingView behavior="padding">
          {this.props.children}
        </KeyboardAvoidingView>
      </Content>
    );
  }
}

export default Background;
