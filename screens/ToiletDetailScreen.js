import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateToiletComment } from '../actions/toilet';

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
  ScrollView
} from 'react-native';

import { Button } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const ToiletDetail = ({
  props,
  updateToiletComment,
  auth,
  toilet: { toiletDetail, loading }
}) => {
  const [comment, setComment] = useState('');

  const saveComment = async () => {
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

  return toiletDetail === null ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>{toiletDetail.title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {toiletDetail.sex === 'both' ? (
              <>
                <FontAwesomeIcon name='female' size={35} color='#ff4d4d' />
                <Text> </Text>
                <FontAwesomeIcon name='male' size={35} color='#3366ff' />
              </>
            ) : null}

            {toiletDetail.sex === 'maleOnly' ? (
              <>
                <FontAwesomeIcon name='male' size={35} color='#3366ff' />
              </>
            ) : null}

            {toiletDetail.sex === 'femaleOnly' ? (
              <>
                <FontAwesomeIcon name='female' size={35} color='#ff4d4d' />
              </>
            ) : null}
            {toiletDetail.forDisabled === true ? (
              <>
                <Text>{'       '}</Text>
                <FontAwesomeIcon
                  style={{ alignSelf: 'flex-end' }}
                  name='wheelchair'
                  size={33}
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
                  size={34}
                  color='#666699'
                />
              </>
            ) : null}
            {/* 댓글 리스트 */}
          </View>
          <View style={{ width: '80%', height: 200 }}>
            <ScrollView>
              {toiletDetail.comments &&
                toiletDetail.comments.map(comment => (
                  <Text key={comment._id}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {comment.username}
                    </Text>{' '}
                    {comment.text}{' '}
                    <FontAwesomeIcon
                      style={{ alignSelf: 'flex-end' }}
                      name='backspace'
                      size={17}
                      color='#ff4d4d'
                    />
                  </Text>
                ))}
            </ScrollView>
          </View>

          {/* 화장실 정보 표시 */}

          {/* 댓글 작성 */}
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              value={comment}
              onChangeText={comment => setComment(comment)}
              placeholder={'댓글 입력'}
              style={styles.input}
            />
            <TouchableOpacity
              onPressOut={() => saveComment()}
              style={{ justifyContent: 'flex-end', marginBottom: 13 }}
            >
              <FontAwesomeIcon name='paper-plane' size={28} color='gray' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: 280 }}>
          <Button
            full
            transparent
            onPressOut={() => props.navigation.navigate('App')}
          >
            <Text style={{ color: 'gray' }}>지도로 돌아갈게요</Text>
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
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

export default connect(mapStateToProps, { updateToiletComment })(ToiletDetail);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { margin: 5, fontSize: 17 },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40
  },
  input: {
    width: 280,
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  },
  multilineInput: {
    textAlignVertical: 'top',
    width: 280,
    height: 120,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray'
  },
  selectBoxContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 35
  },
  selectIcon: {
    fontSize: 25,
    color: 'green'
  }
});
