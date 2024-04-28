/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, ProgressBarAndroid } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Animals: React.FC = () => {
  const navigation = useNavigation();
  const [buttonStatus, setButtonStatus] = useState<Array<boolean>>([true, false, false, false]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [progress, setProgress] = useState(2);
  const [tasks, setTasks] = useState<Object | null>({});
  const [completedTasksFiltered, setCompletedTasksFiltered] = useState<Array<string> >([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [uuid, setuuid] = useState();
  const [numTasks, setNumTasks] = useState(4);

  useEffect(() => {
    const fetchUUID = async () => {
      await currentUUID();
    };
    fetchUUID();
  }, []);

  useEffect(() => {
    if (uuid !== undefined) {
      const fetchData = async () => {
        await taskCall();
      };
      fetchData();
    }
  }, [uuid]);

  useEffect(() => {
    if (uuid !== undefined) {
      const fetchData2 = async () => {
        await completedTaskIDsCall();
        setLoading(false);
      };
      fetchData2();
    }
  }, [tasks]);


  // fetch tasks from backend
  const taskCall  = async () => {
    try {
      // change the ip address to the api of your machine on lan
      // post category type as animals
      const response = await fetch('http://192.168.0.53:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'category' : 'Animals' }),
      });
      // receive tasklist as json response
      if (response.ok) {
        const tasklist = await response.json();
        console.log('taskilst len',Object.keys(tasklist).length);
        console.log(tasklist);
        setTasks(tasklist);
        setNumTasks(Object.keys(tasklist).length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // fetch completed task IDs from backend
  const completedTaskIDsCall = async () => {
    try {
      // change the ip address to the api of your machine on lan
      // post uuid to backend
      const response = await fetch('http://192.168.0.53:3000/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'UUID' : uuid}),
      });
      // update lesson progress
      if (response.ok) {
        const completedTasksFilteredtoReturn: string[] = [];
        const completedTaskIDList = (await response.text()).split(',');
        console.log('response task list',completedTaskIDList.length);
        for (const task in tasks) {
          completedTaskIDList.forEach(function (completedTaskID){
            if (parseInt(completedTaskID) === tasks[task].TaskID) {
              console.log('match found');
              completedTasksFilteredtoReturn.push(completedTaskID);
            }
          });
        }
        setCompletedTasksFiltered(completedTasksFilteredtoReturn);
        setProgress(completedTasksFilteredtoReturn.length)
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // get current uuid from async storage
  const currentUUID = async () => {
    try {
      const value = await AsyncStorage.getItem('uuid');
      if (value !== null) {
        setuuid(parseInt(value));
        console.log('in numbers page', value);
      }
    } catch (e) {
      console.log("error retrieving",e);
    }
  }; 


  const handleButtonPress = (taskIndex: number) => {
    if (taskIndex <= completedTasksFiltered.length +1) {
      setSelectedButton(taskIndex);
      console.log(tasks[taskIndex]);
      const storeData = async () => {
        try {
          await AsyncStorage.setItem('taskID', tasks[taskIndex].TaskID.toString());
        } catch (e) {
          // saving error
          console.log("saving error");
        }
      };  
      storeData();
      navigation.navigate('Lesson');
    } else {
      setShowModal(true);
    }
  };

  // close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // complete lesson
  const completeLesson = () => {
    const nextIndex = selectedButton !== null ? selectedButton + 1 : 0;
    if (nextIndex < buttonStatus.length) {
      const newButtonStatus = [...buttonStatus];
      newButtonStatus[nextIndex] = true;
      setButtonStatus(newButtonStatus);
    }
    
  };

  // check if all lessons are completed
  const isAllLessonsCompleted = () => {
    return buttonStatus.every(status => status);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>Progress</Text>
        <View style={styles.progressBarOutline}>
          {!loading && tasks &&(
          <View style={{ ...styles.progressBarFill, width: `${(progress / numTasks) * 100}%` }}></View>
          )}
          </View>
      </View>
       {/* draw path between lesson buttons */}
      <Svg height="100%" width="100%" style={styles.svg}>
        {!loading && tasks && Object.keys(tasks).slice(0,-1).map((key, index) => (
          <Path
            key={index}
            d={`M${100 + 200 * (index % 2)} ${150 + 150 * index} Q ${150 + 100 * (index % 2)} ${200 + index * 150} ${300 - 200 * (index % 2)} ${300 + index * 150}`}
            fill="none"
            stroke={index <= completedTasksFiltered.length -1 ? '#53c972' : '#c45252'}
            strokeWidth="20"
          />
        ))}
      </Svg>

      {!loading && tasks && Object.keys(tasks).map((key, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { left: 50 + 200 * (index % 2), top: 100 + 150 * index }, { backgroundColor: index <= (completedTasksFiltered.length) ? 'green' : 'darkred' }]}
          onPress={() => handleButtonPress(index)}
        >
          <Text style={styles.buttonText}>{tasks[key].TaskName}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Please complete the previous lesson.</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    top: 10,
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    color:'#19323c',
  },
  progressBarOutline: {
    width: '300%',
    height: 20,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f2545b',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'absolute',
  },
  buttonText: {
    color: '#f3f7f0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  finalTestButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
});

export default Animals;