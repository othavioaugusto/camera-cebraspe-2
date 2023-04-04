import React, { Component } from "react";
import { View } from "react-native";

import styles from "./styles";

class BottomView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.bottomView}>
        {this.props.children}
      </View>
    );
  }
}

export default BottomView;
