import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatsListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chats List Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A1A',
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
});