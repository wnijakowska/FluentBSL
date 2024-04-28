/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const QuizSection: React.FC<{ markQuizAsCompleted: () => void }> = ({ markQuizAsCompleted }) =>{
  const [videos, setVideos] = useState<Array<Video>>([]);
  const [questionIDs, setQuestionIDs] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const videoRef = useRef<Video>(null);


  // get questionIDs from async storage
  const getQuestionIDs = async () => {
    try {
      const value = await AsyncStorage.getItem('questionIDs');
      if (value !== null) {
        console.log('retrieved val', value);
        setQuestionIDs(value.split(','));
      }
    } catch (e) {
      // error reading value
    }
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getQuestionIDs(); // Wait for taskID to be retrieved
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(); // invoke fetch data
  }, []);
  useEffect(() => {
    const fetchData2 = async () => {
      try {
        console.log('questionIDs', questionIDs);
        // change the ip address to the api of your machine on lan
        // post questionIDs to backend
        const response = await fetch('http://192.168.0.53:3000/getQuiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'questionIDs' : questionIDs }),
        });

        // receieve quizdata as json response
        if (response.ok) {
          const quizData = await response.json();

          setQuestions(quizData.questions);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (questionIDs) {
      fetchData2();
    }
  }, [questionIDs]);
  // set the the vidList to list of videopaths retrieved from backend
  useEffect(() =>{
    const videoLibrary = require('./videoLibrary').default;
    const vidList = [];
    for( let i = 0; i< questions.length; i++){
      vidList.push(videoLibrary[questions[i].VideoPath.trim()]);
    }
    setVideos(vidList);
    console.log(questions);
  }, [questions]);
  // set question buttons and answers
  const answerInput = (choice : string) =>{
    if(choice === questions[currentQuestionIndex].Answer){
      if (currentQuestionIndex < videos.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        console.log(videos);
        videoRef.current?.seek(0);
      } else{
        markQuizAsCompleted();
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.videoTitleContainer}>
        <Text style={styles.videoTitle}>What sign is shown below?</Text>
      </View>
      <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={videos[currentQuestionIndex]}
            style={styles.video}
            repeat
            resizeMode="cover"
          />
      </View>
      <View style={styles.quizButtons}>
        <View style={styles.row}>
          {questions[currentQuestionIndex] && (
            <TouchableOpacity
              style={styles.options}
              onPress={() => answerInput(questions[currentQuestionIndex].Choices[0])}
            >
              <Text style={styles.optionText}>{questions[currentQuestionIndex].Choices[0]}</Text>
            </TouchableOpacity>
          )}
          {questions[currentQuestionIndex] && (
            <TouchableOpacity
              style={styles.options}
              onPress={() => answerInput(questions[currentQuestionIndex].Choices[1])}
            >
              <Text style={styles.optionText}>{questions[currentQuestionIndex].Choices[1]}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.row}>
          {questions[currentQuestionIndex] && (
            <TouchableOpacity
              style={styles.options}
              onPress={() => answerInput(questions[currentQuestionIndex].Choices[2])}
            >
              <Text style={styles.optionText}>{questions[currentQuestionIndex].Choices[2]}</Text>
            </TouchableOpacity>
          )}
          {questions[currentQuestionIndex] && (
            <TouchableOpacity
              style={styles.options}
              onPress={() => answerInput(questions[currentQuestionIndex].Choices[3])}
            >
              <Text style={styles.optionText}>{questions[currentQuestionIndex].Choices[3]}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
const CompletedSection: React.FC = () =>{
  
  const navigation = useNavigation();
  const [uuid, setuuid] = useState();
  const [taskID, setTaskID] = useState();
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
  }
  getTaskID();
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
  currentUUID();
  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
  };
  const finishTask = async () =>{
    if(uuid && taskID){
      try {
        // change the ip address to the api of your machine on lan
        const response = await fetch('http://192.168.0.53:3000/completeTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'taskID' : taskID, 'UUID' : uuid }),
        });
        if (response.ok) {
          navigateToScreen('Main');
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
  };
    return(
    <View style={styles.container}>
      <Text style={styles.congratsText}>Congrats! You have completed these exercises!</Text>
      <TouchableOpacity style={styles.complete} onPress={finishTask}>
        <Text style={styles.completeText}>Return</Text>
      </TouchableOpacity>
    </View>);
}
const Quiz: React.FC = () => {
    const [quizCompleted, setQuizCompleted] = useState(false);
    
    const markQuizAsCompleted = () => {
      setQuizCompleted(true);
    };
    return (<View style = {styles.container}>{!quizCompleted ? <QuizSection markQuizAsCompleted={markQuizAsCompleted} /> : <CompletedSection/> }</View>);
}
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
    fontSize: 20,
    fontWeight: 'bold',
    color:'#19323c',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
  quizButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row:{
    flexDirection:'row',
  },
  options:{
    width: 150,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f2545b',
  },
  optionText: {
    fontSize: 16,
    color: '#19323c',
    fontWeight:'bold',
  },
  complete:{
    width: 150,
    height: 50,
    marginTop:40,
    backgroundColor: '#f2545b',
    borderRadius: 10,
    padding:10,
  },
  completeText:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:20,
  },
  congratsText:{
    fontWeight:'bold',
    fontSize:20,
    color: '#19323c',
  }
});
export default Quiz;