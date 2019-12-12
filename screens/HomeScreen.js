import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts, refreshPosts, _getPostDetail } from '../actions/post';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  Keyboard
} from 'react-native';
import { Icon, Button, Header, Left, Right, Title, Body } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const HomeScreen = ({
  auth: { user },
  post: { posts, page, refreshing, postDetail },
  getPosts,
  refreshPosts,
  _getPostDetail,
  props
}) => {
  useEffect(() => {
    getPosts();
  }, []);

  const [writePostModal, setWritePostModal] = useState(false);

  const [values, setValues] = useState({
    title: '',
    text: ''
  });

  const _renderItem = ({ item }) => (
    <View
      style={{
        height: 50,
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20
      }}
    >
      <TouchableOpacity
        onPressOut={() => {
          const selectedPost = posts.filter(post => post._id === item._id);
          _getPostDetail(selectedPost);
          props.screenProps.navigation.navigate('PostDetail');
        }}
        style={{ width: '100%', height: '100%', justifyContent: 'center' }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text>{item.title}</Text>
          <Text style={{ color: 'grey' }}>{item.comments.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const getPostDetail = async id => {
    try {
      const selectedPost = posts.filter(post => post._id === id);
    } catch (error) {
      console.log(error);
    }
    setIsPostDetailModal(true);
  };

  const writePost = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const data = {
      title: values.title,
      text: values.text
    };
    try {
      const res = await fetch('https://blochaid.io/api/posts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': userToken
        },
        body: JSON.stringify(data)
      });

      const resJson = await res.json();
    } catch (error) {
      console.log(error);
    }
    setValues({
      title: '',
      text: ''
    });
    setWritePostModal(false);
    getPosts();
  };

  return (
    <View style={styles.container}>
      <Header style={{ backgroundColor: 'white' }}>
        <Left />
        <Body>
          <Title>익명 게시판</Title>
        </Body>
        <Right />
      </Header>

      <Modal
        animationType='fade'
        transparent={false}
        visible={writePostModal}
        onRequestClose={() => {
          Alert.alert('작성이 완료 되었습니다');
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.title}>익명게시판</Text>
            <Text style={{ color: 'gray' }}>제목을 입력하세요</Text>
            <TextInput
              value={values.title}
              onChangeText={title => setValues({ ...values, title })}
              // placeholder={'어떤 근심이 있으신가요?'}
              style={styles.input}
            />
            <Text style={{ color: 'gray' }}>
              근심을 풀어놓으세요. 익명으로 게시됩니다.
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={6}
              value={values.text}
              onChangeText={text => setValues({ ...values, text })}
              // placeholder={'근심을 풀어놓으세요. 익명으로 게시됩니다.'}
              style={styles.multilineInput}
            />
            <View style={{ width: 280 }}>
              <Button block info onPressOut={writePost}>
                <Text style={{ color: 'white', fontSize: 18 }}>등록</Text>
              </Button>
              <Button
                full
                transparent
                onPressOut={() => {
                  setWritePostModal(false);
                  setValues({ title: '', text: '' });
                }}
              >
                <Text style={{ color: 'gray' }}>취소</Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={{ flex: 9 }}>
        <View style={{ flex: 12 }}>
          <FlatList
            data={posts}
            renderItem={_renderItem}
            keyExtractor={item => item._id}
            onEndReached={() => getPosts(page, posts)}
            onEndReachedThreshold={1}
            refreshing={refreshing}
            onRefresh={getPosts}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setWritePostModal(true)}
            style={{
              height: '100%',

              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesomeIcon name='pen' size={20} color='grey' />
          </TouchableOpacity>
        </View>
      </View>

      {/* 응급 버튼 */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'white'
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: '#ff4d4d',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              도 움
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

HomeScreen.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  post: state.post,
  props: ownProps
});

HomeScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name='home' style={{ color: tintColor }} />
  )
};

export default connect(mapStateToProps, {
  getPosts,
  refreshPosts,
  _getPostDetail
})(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: { margin: 20, fontSize: 20 },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40
  },
  input: {
    width: '80%',
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  },

  multilineInput: {
    textAlignVertical: 'top',
    width: '80%',
    height: 120,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  }
});
