/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Profile: React.FC = () => {
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState();
  const [uuid, setuuid] = useState();

  // get uuid from async storage
  const currentUUID = async () => {
    try {
      const value = await AsyncStorage.getItem('uuid');
      if (value !== null) {
        setuuid(parseInt(value));
      }
    } catch (e) {
      console.log("error retrieving",e);
    }
  };
  const getData = async () =>{
    if(uuid){
      try {
        // change the ip address to the api of your machine on lan
        // post method sending uuid and retreiving username, email, streak and taskID from backend
        const response = await fetch('http://192.168.0.53:3000/getTracker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'UUID' : uuid }),
        });
        if (response.ok) {
          const userInfo = await response.json();
          setUsername(userInfo.Username);
          setEmail(userInfo.Email);
          setStreak(userInfo.streak);
          setScore(userInfo.TaskIDs.split(',').length);
          console.log('hi');


        } else {
          console.error('Error:', response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await currentUUID(); // Wait for taskID to be retrieved
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Immediately invoke the fetchData function
  }, []);

  useEffect(() =>{
    const fetchData2 = async () => {
      try {
        await getData(); // Wait for taskID to be retrieved
      } catch (error) {
        console.error(error);
      }
    };
    fetchData2();
  }, [uuid]);


  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={[styles.label, { marginBottom: 40 }]}>Total Score: {score}</Text>
        <Text style={styles.label}>Streak: {streak}</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Username:</Text>
          <Text style={styles.text}>{username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Email Address:</Text>
          <Text style={styles.text}>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f3f7f0',
  },
  scoreContainer: {
    marginTop:50,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 100,
    padding:20,
    paddingLeft:40,
    paddingRight:40,
    backgroundColor:'#f2545b',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19323c',
  },
  section: {
    marginBottom: 20,
    marginTop:50,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#19323c',
  },
  text: {
    color: '#19323c',
  },
});

export default Profile;

