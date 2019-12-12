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
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const PostDetailScreen = ({
  props,
  auth: { user },
  post: { postDetail, loading }
}) => {
  console.log(props);
  const [comment, setComment] = useState('');

  console.log('postDetail 진입');
  return loading ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={{ flex: 1, marginBottom: 60 }}>
        <Text style={styles.title}>{postDetail.title}</Text>
        <Text>{postDetail.text}</Text>
      </View>

      {/* 댓글 리스트 */}
      <View style={{ flex: 7, width: 300 }}>
        <ScrollView>
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
        </ScrollView>
      </View>

      {/* 댓글 작성 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={Platform.select({ ios: 50, android: 65 })}
        // enabled
      >
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              value={comment}
              onChangeText={comment => setComment(comment)}
              placeholder={'이 화장실에 대해 얘기해주세요'}
              style={styles.input}
            />
            <TouchableOpacity
              onPressOut={() => saveComment()}
              style={{ justifyContent: 'flex-end', marginBottom: 10 }}
            >
              <FontAwesomeIcon name='paper-plane' size={28} color='gray' />
            </TouchableOpacity>
          </View>

          <View>
            <Button
              full
              transparent
              onPressOut={() =>
                props.navigation.navigate('App', { name: 'HomeScreen' })
              }
            >
              <Text style={{ fontSize: 16, color: 'gray' }}>
                게시판으로 돌아가기
              </Text>
            </Button>
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

export default connect(mapStateToProps)(PostDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
    paddingBottom: 20
  },
  title: { margin: 5, fontSize: 25, fontWeight: 'bold' },
  input: {
    width: 320,
    height: 44,
    // padding: 10,

    borderBottomWidth: 1,
    borderColor: 'gray'
  }
});
