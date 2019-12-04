import React from 'react';
import { View, Text } from 'react-native';
import { Container, Header, Left, Body, Right, Title } from 'native-base';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './screens/MainScreen';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <MainScreen style={{ flex: 1 }} />
    </View>
  );
};

export default App;
