import React from 'react';
import { StyleSheet, Platform } from 'react-native';
// import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';

const AppNavigator = createMaterialTopTabNavigator(
  {
    HomeScreen: HomeScreen,
    MapScreen: MapScreen,
    ProfileScreen: ProfileScreen
  },
  {
    initialRouteName: 'MapScreen',
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      style: {
        ...Platform.select({
          ios: {
            backgroundColor: 'white'
          },
          android: {
            backgroundColor: 'white'
          }
        })
      },
      iconStyle: { height: 50, justifyContent: 'center' },
      activeTintColor: '#000',
      inactiveTintColor: '#d1cece',
      upperCaseLabel: false,
      showLabel: false,
      showIcon: true
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  return <AppContainer />;
};

const styles = StyleSheet.create({});

export default App;
