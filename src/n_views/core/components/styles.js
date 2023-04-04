const React = require("react-native");
import { theme } from "../../core/theme";

export default {
  container: {
    backgroundColor: theme.colors.container_bg
  },
  keyboardAvoidingView: {
    backgroundColor: theme.colors.app_bg
  },
  bottomView:{ 
    backgroundColor: theme.colors.container_bg,
    width: '100%',     
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0, 
    padding: 10
  }, 
  textInput: {
    backgroundColor: theme.colors.surface
  },
};