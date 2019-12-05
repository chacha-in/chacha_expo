import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SignUpScreen = props => {
  return (
    <View>
      <Text>SignUpScreen</Text>
      <Button
        title='Go to Login'
        onPress={() => props.navigation.navigate('SignIn')}
      />
    </View>
  );
};

export default SignUpScreen;
