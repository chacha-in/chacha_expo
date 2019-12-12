import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainScreen from './screens/MainScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ToiletDetailScreen from './screens/ToiletDetailScreen';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    Font.loadAsync({
      bm: require('./assets/fonts/BMEULJIROTTF.ttf')
    });
  }, []);
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppStackNavigator style={{ flex: 1 }} />
      </View>
    </Provider>
  );
};

const AppStack = createStackNavigator({
  MainScreen: MainScreen
});

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
});

const AppStackNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
      ToiletDetail: ToiletDetailScreen
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

export default App;
