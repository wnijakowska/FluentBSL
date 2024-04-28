/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Learning from './Learning';
import Profile from './Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main: React.FC = () => {
  useEffect(() => {
    // fetch tasks and completed task IDs
    
    getData();
  }, []);
  const Tab = createBottomTabNavigator();
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('uuid');
      if (value !== null) {
        console.log('in main',value);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Learning"
        component={Learning}
        options={{ tabBarLabel: 'Learning' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default Main;




