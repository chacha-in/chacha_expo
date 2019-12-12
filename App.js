import React, { useEffect, useState } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Root } from 'native-base';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

// 하단 탭에 들어갈 컴포넌트들
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ToiletDetailScreen from './screens/ToiletDetailScreen';
import PostDetailScreen from './screens/PostDetailScreen';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
    setLoading(false);
  }, []);

  const [loading, setLoading] = useState(true);
  return loading ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppStackNavigator style={{ flex: 1 }} />
      </View>
    </Provider>
  );
};

// 하단 탭 네비게이터 생성
const AppTabNavigator = createMaterialTopTabNavigator(
  {
    // SearchTab: SearchTab,
    HomeScreen: HomeScreen,
    MapScreen: MapScreen,
    ProfileScreen: ProfileScreen
  },
  {
    initialRouteName: 'HomeScreen',
    animationEnabled: true,
    swipeEnabled: false,
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

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
});

const AppStackNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppTabNavigator,
      Auth: AuthStack,
      ToiletDetail: ToiletDetailScreen,
      PostDetail: PostDetailScreen
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

export default App;
