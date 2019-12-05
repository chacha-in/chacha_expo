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

const SignInScreen = props => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  // // 폼에서 입력되는 값을 상태값에 지정
  // const handleChange = name => {
  //   setValues({ ...values, name });
  // };

  const { email, password } = values;

  const _signInAsync = async () => {
    console.log(email, password);
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
          keyboardType='email-address'
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
        <Button block info onPressOut={_signInAsync}>
          <Text style={{ color: 'white', fontSize: 18 }}>로그인</Text>
        </Button>
        <Button
          full
          transparent
          onPressOut={() => props.navigation.navigate('SignUp')}
        >
          <Text style={{ color: 'gray' }}>아직 회원이 아니신가요?</Text>
        </Button>
      </View>
    </View>
  );
};

SignInScreen.navigationOptions = {
  title: '로그인하세요'
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { margin: 20, fontSize: 20 },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    width: 280,
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  }
});
export default SignInScreen;

// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Welcome to the app!',
//   };

//   render() {
//     return (
//       <View>
//         <Button title="Show me more of the app" onPress={this._showMoreApp} />
//         <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
//       </View>
//     );
//   }

//   _showMoreApp = () => {
//     this.props.navigation.navigate('Other');
//   };

//   _signOutAsync = async () => {
//     await AsyncStorage.clear();
//     this.props.navigation.navigate('Auth');
//   };
// }

// More code like OtherScreen omitted for brevity
