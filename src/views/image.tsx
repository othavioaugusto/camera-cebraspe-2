import React from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
// import AppLoading from 'expo-app-loading';
import { Header } from '../components/header';

const BASE_URI = 'https://source.unsplash.com/random?sig=';

const ImageAPI = () => {
  return (
    <>
      <Header title="Image" view="image" />
      <SafeAreaView>
        <FlatList
          data={[...new Array(10)].map((_, i) => i.toString())}
          style={styles.list}
          numColumns={2}
          keyExtractor={(e) => e}
          renderItem={({ item }) => (
            <Image
              source={{ uri: BASE_URI + item }}
              containerStyle={styles.item}
              // PlaceholderContent={<AppLoading />}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
    backgroundColor: '#000',
  },
  item: {
    aspectRatio: 1,
    width: '100%',
    flex: 1,
  },
});

export default ImageAPI;
