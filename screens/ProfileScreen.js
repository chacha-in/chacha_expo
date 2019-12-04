import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Icon} from 'native-base';

const ProfileScreen = () => {
  const getUser = async () => {
    try {
      let response = await fetch('https://localhost:5000/api/auth/test');
      let responseJson = await response.json();
      console.log(responseJson);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Button title="유저 정보" onPress={getUser}></Button>
    </View>
  );
};

export default ProfileScreen;

ProfileScreen.navigationOptions = {
  // tabBarIcon: ({tintColor}) => <View style={styles.tabIcon}></View>,
  tabBarIcon: ({tintColor}) => (
    <Icon name="contact" style={{color: tintColor}} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 15,
  },
});
