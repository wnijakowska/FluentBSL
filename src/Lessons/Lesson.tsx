/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';


interface Question {
    ID: string;
    VideoPath: string;
    Choices: Array<string>;
    Answer: string;
  }

const Lesson: React.FC = () => {
  const [videoTitles, setVideoTitles] = useState<Array<string>>([]);
  const [videos, setVideos] = useState<Array<Video>>([]);
  const [questionIDs, setQuestionIDs] = useState<Array<string>>([]);
  const [taskID, setTaskID] = useState();

  const navigation = useNavigation();

  const navigateToScreen = (screenName: string) => {
  navigation.navigate(screenName);
  };

  // get taskID from async storage
  const getTaskID = async () => {
        try {
          const value = await AsyncStorage.getItem('taskID');
          if (value !== null) {
            console.log('retrieved val', value);
            setTaskID(value);
          }
        } catch (e) {
          // error reading value
        }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTaskID(); // wait for taskID to be retrieved
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // fetch data
  }, []);

  // get task data
  useEffect(() => {
    const fetchData2 = async () => {
      try {
        console.log("CALLED");
        // change the ip address to the api of your machine on lan
        // post taskID to backend
        const response = await fetch('http://192.168.0.53:3000/getLesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'taskID' : taskID }),
        });
        // retrieve lessonData as json response
        if (response.ok) {
          const lessonData = await response.json();
          const videoLibrary = require('./videoLibrary').default;
          const rawVideoList = lessonData.VideoPaths.split(',');
          // set video titiles, questionids and video paths
          setVideoTitles(lessonData.VideoNames.split(','));
          setQuestionIDs(lessonData.QuestionIDs);
          setVideos(rawVideoList.map((filename : string) => videoLibrary[filename]));
          console.log(rawVideoList);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (taskID) {
      fetchData2(); // only fetch data if taskID is set
    }
  }, [taskID]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const videoRef = useRef<Video>(null);

  console.log("videoshow list",videos);

  // increase video index
  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      videoRef.current?.seek(0);
    }
  };

  // decrease video index
  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      videoRef.current?.seek(0);
    }
  };

  // begin quiz after lesson is done, set questionIDs in async storage
  const beginQuiz = async () =>{
    const storeData = async () => {
      try {
        console.log('questionIDs in lesson',questionIDs.toString());
        await AsyncStorage.setItem('questionIDs', questionIDs.toString());
      } catch (e) {
        console.log(e);
      }
    };  
    storeData();
    navigation.navigate('Quiz');
  };


  return (
    <View style={styles.container}>
      <View style={styles.videoTitleContainer}>
        <Text style={styles.videoTitle}>{videoTitles[currentVideoIndex]}</Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={videos[currentVideoIndex]}
          style={styles.video}
          repeat
          resizeMode="stretch"
        />
      </View>
      <View style={styles.arrowsContainer}>
        {currentVideoIndex > 0 && (
          <TouchableOpacity style={styles.arrowButton} onPress={goToPreviousVideo}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
        )}
        {currentVideoIndex < videos.length - 1 ? (
          <TouchableOpacity style={styles.arrowButton} onPress={goToNextVideo}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.arrowButton} onPress={beginQuiz}>
            <Text style={styles.proceedText}>Move to Exercises</Text>
          </TouchableOpacity>
        )}
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
  videoTitleContainer: {
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#19323c',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#f2545b',
    margin:10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  arrowText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#19323c',
  },
  proceedText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19323c',
  }
});


export default Lesson;



