/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/Home';
import LoginScreen from './src/Login';
import SignupScreen from './src/Signup';
import MainScreen from './src/Main';
import ProfileScreen from './src/Profile';
import LearningScreen from './src/Learning';
import NumbersScreen from './src/Numbers';
import AlphabetScreen from './src/Alphabet';
import AnimalsScreen from './src/Animals';
import ConversationalScreen from './src/Conversational';
import Lesson from './src/Lessons/Lesson';
import Quiz from './src/Lessons/Quiz';


const Stack = createStackNavigator();

// stack navigator used for navigation throughout the entire app
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Learning" component={LearningScreen} />
        <Stack.Screen name="Numbers" component={NumbersScreen} />
        <Stack.Screen name="Alphabet" component={AlphabetScreen} />
        <Stack.Screen name="Animals" component={AnimalsScreen} />
        <Stack.Screen name="Conversational" component={ConversationalScreen} />
        <Stack.Screen name="Lesson" component={Lesson} />
        <Stack.Screen name="Quiz" component={Quiz} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

