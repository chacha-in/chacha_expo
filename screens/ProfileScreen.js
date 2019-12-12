import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/auth';

import store from '../store';
import { loadUser } from '../actions/auth';

import {
  View,
  Text,
  StyleSheet,
  Button,
  AsyncStorage,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Icon, Header, Left, Right, Title, Body } from 'native-base';

const ProfileScreen = ({
  props,
  logout,
  auth: { user, loading, authenticated }
}) => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  const _signOutAsync = async () => {
    // await AsyncStorage.clear();
    logout();

    props.navigation.navigate('Auth');
  };

  return loading ? (
    <ActivityIndicator />
  ) : (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <Header noShadow style={{ backgroundColor: 'white' }}>
          <Left />
          <Body>
            <Title style={{ color: 'black' }}>배탈의 민족</Title>
          </Body>
          <Right />
        </Header>
      ) : (
        <Header
          noShadow
          style={{
            backgroundColor: 'white',
            marginTop: 25,
            borderBottomWidth: 1,
            borderBottomColor: '#d9d9d9'
          }}
        >
          <Left />
          <Body>
            <Title style={{ color: 'black' }}>배탈의 민족</Title>
          </Body>
          <Right />
        </Header>
      )}
      <View style={styles.container}>
        <Text style={styles.text}>사용자 : {user.username}</Text>
        <Text style={styles.text}>이메일 : {user.email}</Text>
        <Button title='다음에 또 만나요' onPress={_signOutAsync} />
      </View>
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
export default connect(mapStateToProps, { logout })(ProfileScreen);

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
