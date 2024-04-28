/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Learning: React.FC = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
  };

  //screen with topic buttons
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Topics</Text>
      <Text></Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Conversational"
          onPress={() => navigateToScreen('Conversational')}
          color="#f39c12"
          style={styles.button}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Numbers"
          onPress={() => navigateToScreen('Numbers')}
          color="#3498db"
          style={styles.button}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Alphabet"
          onPress={() => navigateToScreen('Alphabet')}
          color="#2ecc71"
          style={styles.button}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Animals"
          onPress={() => navigateToScreen('Animals')}
          color="#e74c3c"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f7f0',
  },
  header: {
    fontSize: 24,
    color: '#19323c',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
});

export default Learning;


