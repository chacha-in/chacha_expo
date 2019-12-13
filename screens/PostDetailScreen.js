import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import { updatePostComment, deletePostComment } from '../actions/post';

const PostDetailScreen = ({
  props,
  updatePostComment,
  deletePostComment,
  auth: { user },
  post: { postDetail, loading }
}) => {
  console.log(props);
  const [comment, setComment] = useState('');

  const saveComment = async () => {
    if (comment === '') {
      return;
    }

    const userToken = await AsyncStorage.getItem('userToken');

    const _id = postDetail._id;

    try {
      setComment('');
      const res = await fetch(`https://blochaid.io/api/posts/comment/${_id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': userToken
        },
        body: JSON.stringify({ text: comment })
      });

      const resJson = await res.json();

      updatePostComment(resJson);
      setComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const removeComment = async commentId => {
    const userToken = await AsyncStorage.getItem('userToken');

    const _id = postDetail._id;

    try {
      const res = await fetch(
        `https://blochaid.io/api/posts/comment/${_id}/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': userToken
          }
        }
      );

      const resJson = await res.json();
      console.log(resJson);

      if (resJson.msg) {
        console.log('막혔다');
        return;
      }

      deletePostComment(resJson);
    } catch (error) {
      console.log(error);
    }
  };

  const _renderItem = ({ item }) => (
    <Text style={{ fontSize: 15 }}>
      {item.text}{' '}
      {item.user === user._id ? (
        <Text style={{ color: 'red' }} onPress={() => removeComment(item._id)}>
          <FontAwesomeIcon
            style={{ alignSelf: 'flex-end' }}
            name='backspace'
            size={15}
            color='#ff4d4d'
          />
        </Text>
      ) : null}
    </Text>
  );

  return loading ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={{ flex: 1, marginBottom: 60, width: '80%' }}>
        <Text style={styles.title}>{postDetail.title}</Text>
        <Text style={{ textAlign: 'left', fontSize: 15 }}>
          {postDetail.text}
        </Text>
      </View>

      {/* 댓글 리스트 */}
      <View style={{ flex: 7, width: '80%' }}>
        <FlatList
          data={postDetail.comments}
          renderItem={_renderItem}
          keyExtractor={item => item._id}
        />

        {/* <ScrollView>
          {postDetail.comments.map(comment => (
            <Text key={comment._id}>
              {comment.text}{' '}
              {comment.user === user._id ? (
                <FontAwesomeIcon
                  onPress={() => removeComment(comment._id)}
                  style={{ alignSelf: 'flex-end' }}
                  name='backspace'
                  size={17}
                  color='#ff4d4d'
                />
              ) : null}
            </Text>
          ))}
        </ScrollView> */}
      </View>

      {/* 댓글 작성 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={Platform.select({ ios: 50, android: 65 })}
        // enabled
      >
        <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              value={comment}
              onChangeText={comment => setComment(comment)}
              placeholder={'익명 댓글을 남겨주세요'}
              style={styles.input}
            />
            <TouchableOpacity
              onPressOut={() => saveComment()}
              style={{ justifyContent: 'flex-end', marginBottom: 10 }}
            >
              <FontAwesomeIcon name='paper-plane' size={28} color='gray' />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40
            }}
          >
            <TouchableOpacity
              onPressOut={() => props.navigation.navigate('HomeScreen')}
            >
              <Text style={{ fontSize: 16, color: 'gray' }}>
                게시판으로 돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

PostDetailScreen.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  post: state.post,
  props: ownProps
});

export default connect(mapStateToProps, {
  updatePostComment,
  deletePostComment
})(PostDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
    paddingBottom: 20
  },
  title: { margin: 5, fontSize: 25, fontWeight: 'bold', textAlign: 'center' },
  input: {
    width: '81%',
    height: 44,
    // padding: 10,

    borderBottomWidth: 1,
    borderColor: 'gray'
  }
});
