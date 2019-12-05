import React, { useState } from 'react';
import {
  View,
  TextInput,
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Button } from 'native-base';

const SignUpScreen = props => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    username: ''
  });

  // // 폼에서 입력되는 값을 상태값에 지정
  // const handleChange = name => {
  //   setValues({ ...values, name });
  // };

  const { email, password, username } = values;

  const _signUpAsync = async () => {
    console.log(email, password, username);
    try {
      const res = await fetch('https://blochaid.io/api/auth', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const resJson = await res.json();

      await AsyncStorage.setItem('userToken', resJson.token);
      return props.navigation.navigate('App');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}></Text>
        <TextInput
          value={email}
          onChangeText={email => setValues({ ...values, email })}
          placeholder={'이메일'}
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={password => setValues({ ...values, password })}
          placeholder={'패스워드'}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>
      <View style={{ width: 280 }}>
        <Button block info onPressOut={_signUpAsync}>
          <Text style={{ color: 'white', fontSize: 18 }}>회원 가입</Text>
        </Button>
        <Button
          full
          transparent
          onPressOut={() => props.navigation.navigate('SignIn')}
        >
          <Text style={{ color: 'gray' }}>이미 차차 회원이긴사요?</Text>
        </Button>
      </View>
    </View>
  );
};

SignUpScreen.navigationOptions = {
  title: 'CHACHA'
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { margin: 30, fontSize: 30 },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    width: 280,
    height: 44,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  }
});
export default SignUpScreen;
