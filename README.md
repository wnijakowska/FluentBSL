This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Frontend Setup

This app is built to run on Android. During development, I used the Android Emulator in Android Studio [Android Studio](https://developer.android.com/studio)
You can also run this app on an Android phone, given it is plugged into your computer.
Exact instructions on how to run this app can be found on the React Native website [React-Native](https://reactnative.dev/docs/environment-setup?guide=native)
In this website choose:
React Native CLI Quickstart, 
Development OS -> Windows,
Target OS -> Android

For external node_modules that could be missing:
 - cd FluentBSL
 - npm install
 - npm install @react-navigation/stack
 - npm install @react-navigation/native
 - npm install @react-navigation/bottom-tabs
 - npm install @react-native-async-storage
 - npm install @react-native-async-storage/async-storage
 - npm install @react-native-community
 - npm install react-native-video
 - npm install react-native-svg
 - npm install typescript
  
I believe these are all of the extra node modules used, however if you encounter an error about an unresolved dependency the console will display any missing node modules.

As my backend is ran on my local ipv4 address, the ip addresses in the frontend need to be changed to your local ip4 address, here are all the files and lines where this needs to be changed:
Signup.tsx - Line 21,
Profile.tsx - Line 28,
Number.tsx - Line 53, Line 79,
Login.tsx - Line 22,
Conversational.tsx - Line 52, Line 76,
Animals.tsx - Line 52, Line 77,
Alphabet.tsx - Line 52, Line 77,
Quiz.tsx - Line 44,
Lesson.tsx - Line 60, Line 181


# Backend Setup

The backend uses Express, and it will have to be ran alongside the frontend. Node.js must be installed on your device.
For external node_modules that could be missing:
 - cd FluentBSL/backend/src
 - npm install
 - npm install typescript
 - npm install ts-node
 - npm install helmet
 - npm install cors
 - npm install bcrypt
 - npm install sqlite3

I believe these are all of the extra node modules used, however if you encounter an error about an unresolved dependency the console will display any missing node modules.


# Run the app
With Android Studio running, or an Android device connected to your computer
- cd FluentBSL
- npx react-native run-android

In another terminal:
 - cd FluentBSL/backend/src
 - ts-node server.ts

