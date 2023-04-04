import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Chip, withTheme, Text } from 'react-native-elements';
import colors from '../../../config/colors';
import { Header } from '../../../components/header';

type ListaVaziaComponentProps = {};

const ListaVazia: React.FunctionComponent<ListaVaziaComponentProps> = ({ ...props }) => {
  return (
    <>
      <View style={styles.contentView}>
        <Chip
          title={props.msg}
          type="outline"          
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,    
    padding: 20,    
  }
});

export default withTheme(ListaVazia, '');