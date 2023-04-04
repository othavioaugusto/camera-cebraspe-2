import React, { Component } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import LogoTelaDescanso from "./LogoTelaDescanso";
import DropdownAlert from "react-native-dropdownalert";
import { theme } from "../theme";

type ContainerAppProps = {};

const ContainerApp: React.FunctionComponent<ContainerAppProps> = (props) => {
  return (
    <>
     <View style={styles.container}>
        {!props.showTelaDescanso ? (
          <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={'padding'}
          enabled
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 84}
        >
          { props.children }
          </KeyboardAvoidingView>
        ) : (
          <LinearGradient
            colors={[
              theme.colors.app_bg_disable,
              theme.colors.app_bg_enable,
              theme.colors.app_bg_enable,
              theme.colors.app_bg_disable,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <LogoTelaDescanso />
          </LinearGradient>
        )}

        <DropdownAlert
          successColor={theme.colors.dpdownalert_success_color}
          infoColor={theme.colors.dpdownalert_info_color}
          warnColor={theme.colors.dpdownalert_warn_color}
          errorColor={theme.colors.dpdownalert_error_color}
          wrapperStyle={{ top: 10 }}
          ref={(ref) => (global.dropDownAlertRef = ref)}
          closeInterval={3000}
        />

        <DropdownAlert
          successColor={theme.colors.dpdownalert_success_color}
          infoColor={theme.colors.dpdownalert_info_color}
          warnColor={theme.colors.dpdownalert_warn_color}
          errorColor={theme.colors.dpdownalert_error_color}
          wrapperStyle={{ top: 10 }}
          ref={ref => global.dropDownAlertRef7000 = ref}
          closeInterval={7000} />

        <DropdownAlert
          successColor={theme.colors.dpdownalert_success_color}
          infoColor={theme.colors.dpdownalert_info_color}
          warnColor={theme.colors.dpdownalert_warn_color}
          errorColor={theme.colors.dpdownalert_error_color}
          wrapperStyle={{ top: 10 }}
          showCancel={true}
          ref={ref => global.dropDownAlertRefNoClose = ref}
          closeInterval={0} />

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.app_container_app,
    position: 'relative',
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default ContainerApp;