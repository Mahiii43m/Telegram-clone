import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatWindowScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Window - Your Messaging UI Goes Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, color: '#000' },
});