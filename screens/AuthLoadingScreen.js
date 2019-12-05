import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

const AuthLoadingScreen = props => {
  useEffect(() => {
    _bootstrapAsync();
  }, [_bootstrapAsync]);

  // Fetch the token from storage then navigate to our appropriate place
  const _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('토큰 유무 확인중');
    try {
      const res = await fetch('https://blochaid.io/api/auth', {
        method: 'GET',
        headers: {
          'x-auth-token': userToken
        }
      });

      console.log(res);

      const resJson = await res.json();

      console.log(resJson);

      props.navigation.navigate(resJson.email ? 'App' : 'Auth');
    } catch (error) {
      console.log(error);
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle='default' />
    </View>
  );
};

export default AuthLoadingScreen;
