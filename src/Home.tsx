/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

const Home: React.FC = () => {
  const navigation = useNavigation();

  console.log('navigation:', navigation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>FluentBSL</Text>
      </View>
      <View style={styles.videoContainer}>
        {/* load video for 'hello' sign */}
        <Video
          source={require('../videos/hello.mp4')}
          style={styles.backgroundVideo}
          repeat
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.introText}>
          Welcome to FluentBSL! Start your journey to mastering British Sign
          Language today.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')} // navigate to Login Screen
            color="#f2545b"
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')} // navigate to Sign Up Screen
            color="#f2545b"
          />
        </View>
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
    marginBottom: 20,
    paddingBottom:30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19323C',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    marginBottom: 20,
  },
  backgroundVideo: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  introText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#19323C', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    marginHorizontal: 10,
  },
});

export default Home;

