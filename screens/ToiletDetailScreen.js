import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateToiletComment, deleteToiletComment } from '../actions/toilet';

import {
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';

import { Button } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const ToiletDetail = ({
  props,
  updateToiletComment,
  deleteToiletComment,
  auth: { user },
  toilet: { toiletDetail, loading }
}) => {
  const [comment, setComment] = useState('');

  const saveComment = async () => {
    if (comment === '') {
      return;
    }

    const userToken = await AsyncStorage.getItem('userToken');

    const _id = toiletDetail._id;

    try {
      const res = await fetch(
        `https://blochaid.io/api/toilets/comment/${_id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': userToken
          },
          body: JSON.stringify({ text: comment })
        }
      );

      const resJson = await res.json();

      updateToiletComment(resJson);
      setComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const removeComment = async commentId => {
    const userToken = await AsyncStorage.getItem('userToken');

    const _id = toiletDetail._id;

    try {
      const res = await fetch(
        `https://blochaid.io/api/toilets/comment/${_id}/${commentId}`,
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

      deleteToiletComment(resJson);
    } catch (error) {
      console.log(error);
    }
  };

  const _renderItem = ({ item }) => (
    <Text style={{ fontSize: 18 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.username}</Text> {item.text}{' '}
      {item.user === user._id ? (
        <Text style={{ color: 'red' }} onPress={() => removeComment(item._id)}>
          <FontAwesomeIcon
            style={{ alignSelf: 'flex-end' }}
            name='backspace'
            size={18}
            color='#ff4d4d'
          />
        </Text>
      ) : null}
    </Text>
  );

  return toiletDetail === null ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={{ flex: 1, marginBottom: 60 }}>
        <Text style={styles.title}>{toiletDetail.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {toiletDetail.sex === 'both' ? (
            <>
              <FontAwesomeIcon name='female' size={40} color='#ff4d4d' />
              <Text> </Text>
              <FontAwesomeIcon name='male' size={40} color='#3366ff' />
            </>
          ) : null}

          {toiletDetail.sex === 'maleOnly' ? (
            <>
              <FontAwesomeIcon name='male' size={40} color='#3366ff' />
            </>
          ) : null}

          {toiletDetail.sex === 'femaleOnly' ? (
            <>
              <FontAwesomeIcon name='female' size={40} color='#ff4d4d' />
            </>
          ) : null}
          {toiletDetail.forDisabled === true ? (
            <>
              <Text>{'       '}</Text>
              <FontAwesomeIcon
                style={{ alignSelf: 'flex-end' }}
                name='wheelchair'
                size={40}
                color='#39ac73'
              />
            </>
          ) : null}
          {toiletDetail.diaperChangingTable === true ? (
            <>
              <Text>{'      '}</Text>
              <FontAwesomeIcon
                style={{ alignSelf: 'flex-end' }}
                name='baby'
                size={40}
                color='#666699'
              />
            </>
          ) : null}
        </View>
      </View>

      {/* 댓글 리스트 */}
      <View style={{ flex: 7, width: 300 }}>
        <FlatList
          data={toiletDetail.comments}
          renderItem={_renderItem}
          keyExtractor={item => item._id}
        />

        {/* <ScrollView>
          {toiletDetail.comments &&
            toiletDetail.comments.map(comment => (
              <Text style={{ fontSize: 20 }} key={comment._id}>
                <Text style={{ fontWeight: 'bold' }}>{comment.username}</Text>{' '}
                {comment.text}{' '}
                {comment.user === user._id ? (
                  <Text onPress={() => removeComment(comment._id)}>
                    <FontAwesomeIcon
                      style={{ alignSelf: 'flex-end' }}
                      name='backspace'
                      size={20}
                      color='#ff4d4d'
                    />
                  </Text>
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
        enabled
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

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40
            }}
          >
            <TouchableOpacity
              onPressOut={() => props.navigation.navigate('MapScreen')}
            >
              <Text style={{ fontSize: 16, color: 'gray' }}>
                지도로 돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

ToiletDetail.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  toilet: state.toilet,
  props: ownProps
});

export default connect(mapStateToProps, {
  updateToiletComment,
  deleteToiletComment
})(ToiletDetail);

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
