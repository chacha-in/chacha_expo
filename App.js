import React from 'react';
import { View, Text } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainScreen from './screens/MainScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';

// import HomeScreen from './screens/HomeScreen';
// import MapScreen from './screens/MapScreen';
// import ProfileScreen from './screens/ProfileScreen';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppStackNavigator style={{ flex: 1 }} />
    </View>
  );
};

const AppStack = createStackNavigator({
  MainScreen: MainScreen
});
// const AppStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     MapScreen: MapScreen,
//     Profile: ProfileScreen
//   },
//   {
//     initialRouteName: 'Profile'
//   }
// );
const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
});

const AppStackNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

export default App;
