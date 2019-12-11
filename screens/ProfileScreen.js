import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  StyleSheet,
  Button,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Icon } from 'native-base';

const ProfileScreen = ({ props, auth: { user, loading, authenticated } }) => {
  console.log('profile screen 진입');

  const _signOutAsync = async () => {
    console.log('signout');
    console.log(props);
    await AsyncStorage.clear();

    props.screenProps.navigation.navigate('Auth');
  };

  return loading === null ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>사용자 : {user.username}</Text>
      <Text style={styles.text}>이메일 : {user.email}</Text>
      <Button title='다음에 또 만나요' onPress={_signOutAsync} />
    </View>
  );
};

ProfileScreen.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  props: ownProps
});

ProfileScreen.navigationOptions = {
  // tabBarIcon: ({tintColor}) => <View style={styles.tabIcon}></View>,
  tabBarIcon: ({ tintColor }) => (
    <Icon name='contact' style={{ color: tintColor }} />
  )
};

// export default ProfileScreen;
export default connect(mapStateToProps)(ProfileScreen);

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
  },
  text: {
    marginBottom: 10
  }
});
