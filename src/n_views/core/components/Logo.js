import React, { Component } from "react";
import { View } from "react-native";
import { Thumbnail } from "native-base";

import styles from "../../n_autenticacao/components/styles";

// const launchscreenBg = require("../../assets/background_dot.png");
// const launchscreenLogo = require("../../assets/logo.png");
const launchscreenLogo = require("../../assets/logo-cebraspe.png");

const Logo = ({ ...props }) => (

  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Thumbnail square large source={launchscreenLogo} style={styles.logo} /> */}
      <Thumbnail square large source={launchscreenLogo} style={styles.logo_fiverr} />
  </View>

);

export default Logo;
