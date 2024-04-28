/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      if (!username || !password || !email) {
        console.error('Please fill out all fields');
        return;
      }
      // change the ip address to the api of your machine on lan
      // post method sending username password and email
      const response = await fetch('http://192.168.0.53:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'username': username, 'password': password,'email' : email }),
      });

      if (response.ok) {
        console.log('User signed up successfully!');
        navigation.navigate('Login');
        // user redirected to login page
      } else {
        console.error('Signup failed:', response.statusText);
        // Handle unsuccessful signup
      }
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle network errors or other errors
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor: '#19323c', color: '#19323c' }]}
        placeholder="Username"
        placeholderTextColor="#19323c"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: '#19323c', color: '#19323c' }]}
        placeholder="Password"
        placeholderTextColor="#19323c"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { borderColor: '#19323c', color: '#19323c' }]}
        placeholder="Email"
        placeholderTextColor="#19323c"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Sign Up" onPress={handleSignup} color="#f2545b" />
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
  input: {
    width: '80%',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default Signup;
