import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PostDetailScreen = ({
  props,
  auth: { user },
  post: { postDetail, loading }
}) => {
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
