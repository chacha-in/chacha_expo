import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Icon } from 'native-base';

const ProfileScreen = props => {
  const getUser = async () => {
    try {
      let response = await fetch('https://blochaid.io/api/auth/test');
      let responseJson = await response.json();
      console.log(responseJson);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const _signOutAsync = async () => {
    console.log('signout');
    await AsyncStorage.clear();
    //
    props.screenProps.navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Button title='유저 정보' onPress={getUser}></Button>
      <Button title='Actually, sign me out :)' onPress={_signOutAsync} />
    </View>
  );
};

export default ProfileScreen;

ProfileScreen.navigationOptions = {
  // tabBarIcon: ({tintColor}) => <View style={styles.tabIcon}></View>,
  tabBarIcon: ({ tintColor }) => (
    <Icon name='contact' style={{ color: tintColor }} />
  )
};

// ProfileScreen.navigationOptions = {
//   title: 'CHACHA'
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 15
  }
});
