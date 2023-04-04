import React from "react";
import { TextInputMask } from "react-native-masked-text";
import { theme } from "../../core/theme";

import styles from "./styles";

const TextInput = ({ errorText, ...props }) => (

  <TextInputMask
    style={styles.textInput}
    selectionColor={theme.colors.primary}
    underlineColor="transparent"
    mode="outlined"
    {...props}
  />
  // {errorText ? <Text style={styles.textInputError}>{errorText}</Text> : null}

);

export default TextInput;
