import React from "react";
import { Input } from "native-base";
import { theme } from "../theme";

import styles from "./styles";

const TextInput = ({ errorText, ...props }) => (

  <Input
    style={styles.textInput}
    selectionColor={theme.colors.primary}
    underlineColor="transparent"
    mode="outlined"
    {...props}
  />
  // {errorText ? <Text style={styles.textInputError}>{errorText}</Text> : null}

);

export default TextInput;
