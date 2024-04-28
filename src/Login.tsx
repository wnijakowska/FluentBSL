/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login: React.FC = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  interface UserInfo{
    username : string;
    UUID : number;
  }

  const handleLogin = async () => {
    try {
      // change the ip address to the api of your machine on lan
      // post username and password
      const response = await fetch('http://192.168.0.53:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const userData : UserInfo = await response.json();
        const storeData = async () => {
          try {
            //set uuid and username in async storage
            console.log('in login page uuid:',userData.UUID.toString());
            await AsyncStorage.setItem('username', userData.username);
            await AsyncStorage.setItem('uuid', userData.UUID.toString());
          } catch (e) {
            console.log("login load",e);
          }
        }; 
        storeData();
        navigation.navigate('Main'); // redirect to Learning screen if login is successful
      } else {
        let errorMessage;
        if (response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else {
          // Try to extract error message from response body
          const responseBody = await response.text();
          errorMessage = 'Login failed: ' + (responseBody || response.statusText);
        }
        console.error(errorMessage);
        // set error message to display
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // handle network errors or other errors
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
      <Button title="Login" onPress={handleLogin} color="#f2545b" />
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

export default Login;



