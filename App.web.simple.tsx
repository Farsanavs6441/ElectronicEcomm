import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function App(): React.JSX.Element {
  console.log('Simple App component rendering...');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello ElectronicEcomm Web!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});

export default App;