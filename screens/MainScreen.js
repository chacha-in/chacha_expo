import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Icon } from 'native-base';

import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

// 하단 탭에 들어갈 컴포넌트들
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './ProfileScreen';

// 하단 탭 네비게이터 생성
const AppTabNavigator = createMaterialTopTabNavigator(
  {
    // SearchTab: SearchTab,
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
      iconStyle: { height: 60, justifyContent: 'center' },
      activeTintColor: '#000',
      inactiveTintColor: '#d1cece',
      upperCaseLabel: false,
      showLabel: false,
      showIcon: true
    }
  }
);

const AppTabContainet = createAppContainer(AppTabNavigator);

const MainScreen = props => {
  console.log('main');
  return <AppTabContainet screenProps={props} style={{ flex: 1 }} />;
};

MainScreen.navigationOptions = {
  title: 'chacha'
};

export default MainScreen;

const styles = StyleSheet.create({});
