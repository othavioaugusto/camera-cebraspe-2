import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";

const launchscreenLogo = require("../../assets/logo-cebraspe.png");

type LogoTelaDescansoProps = {};

const LogoTelaDescanso: React.FunctionComponent<LogoTelaDescansoProps> = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image resizeMode="cover" source={launchscreenLogo} style={styles.logoTelaDescanso} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoTelaDescanso: {
    width: 240,
    height: 112
  },
});

export default LogoTelaDescanso;