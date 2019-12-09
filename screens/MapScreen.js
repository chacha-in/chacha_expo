import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Text,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Icon, Button } from 'native-base';
import MapView, { Marker } from 'react-native-maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const MapScreen = ({ props, auth }) => {
  useEffect(() => {
    _getLocationAsync();
    // setTimeout(() => {
    //   setState({ ...state, marginBottom: 0 });
    // }, 100);
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    const location = await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta:
        (Dimensions.get('window').width / Dimensions.get('window').height) *
        0.01
    };

    // setState({ ...state, region });
    setState({ ...state, region, marginBottom: 0 });

    _getToiletPointAsync();
  };

  const [state, setState] = useState({
    region: null,
    markers: null,
    isMapReady: false,
    writeToiletModalVisible: false,
    preMarker: {},

    errorMessage: null,
    marginBottom: 1
  });

  const [values, setValues] = useState({
    title: '',
    description: '',
    latlng: {}
  });

  const {
    region,
    isMapReady,
    errorMessage,
    marginBottom,
    markers,
    writeToiletModalVisible,
    preMarker
  } = state;

  const { title, description, latlng } = values;

  const _getToiletPointAsync = async () => {
    try {
      const res = await fetch('https://blochaid.io/api/toilets', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const resJson = await res.json();

      setState({ ...state, markers: resJson });
      // const target = { ...state, markers: [...resJson] };
      // setState({ ...target });
    } catch (error) {
      console.log(error);
    }
  };

  const writeToiletPoint = event => {
    const coordinate = event.nativeEvent.coordinate;

    setState({
      ...state,
      preMarker: { latlng: coordinate },
      writeToiletModalVisible: true
    });
  };

  const saveToiletPoint = async () => {
    preMarker.title = title;
    preMarker.description = description;

    const userToken = await AsyncStorage.getItem('userToken');

    if (title) {
      try {
        const res = await fetch('https://blochaid.io/api/toilets', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': userToken
          },
          body: JSON.stringify(preMarker)
        });

        const resJson = await res.json();

        markers.push(resJson);

        setState({
          ...state,
          markers,
          writeToiletModalVisible: false
        });
        setValues({ title: '', description: '' });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goToCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta:
        (Dimensions.get('window').width / Dimensions.get('window').height) *
        0.01
    };
    setState({ ...state, region });
  };

  const _onMapReady = () => {
    setState({ ...state, isMapReady: true });
  };

  return (markers === null) & (region === null) & (isMapReady === false) ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <Modal
        animationType='slide'
        transparent={false}
        visible={writeToiletModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.title}>화장실 등록</Text>
            <TextInput
              value={title}
              onChangeText={title => setValues({ ...values, title })}
              placeholder={'title'}
              style={styles.input}
            />
            <TextInput
              multiline={true}
              numberOfLines={6}
              value={description}
              onChangeText={description =>
                setValues({ ...values, description })
              }
              placeholder={'description'}
              style={styles.multilineInput}
            />
          </View>
          <View style={{ width: 280 }}>
            <Button block info onPressOut={saveToiletPoint}>
              <Text style={{ color: 'white', fontSize: 18 }}>등록</Text>
            </Button>
            <Button
              full
              transparent
              onPressOut={() => {
                setState({ ...state, writeToiletModalVisible: false });
                setValues({ title: '', description: '' });
              }}
            >
              <Text style={{ color: 'gray' }}>취소</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <MapView
        // provider='google'
        style={{ flex: 1, marginBottom: marginBottom }}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        region={region}
        onLongPress={writeToiletPoint}
        onMapReady={_onMapReady}
      >
        {markers === null
          ? null
          : markers.map(marker => (
              <Marker
                key={marker._id}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                tracksViewChanges={false}
              />
            ))}
      </MapView>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '0%', //for center align
          right: '0%',
          // alignSelf: 'flex-end', //for align to right
          margin: 17
          // backgroundColor: 'white',
          // width: 50,
          // height: 50,
          // borderRadius: 25
        }}
      >
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            onPressOut={goToCurrentLocation}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon
              name='navigate'
              style={{
                fontSize: 58,
                color: 'gray'
              }}
            />
          </TouchableOpacity>
        ) : null
        // (
        //   <TouchableOpacity
        //     onPressOut={goToCurrentLocation}
        //     style={{
        //       flex: 1,
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: 'white',
        //       borderRadius: 25,
        //       width: 50,
        //       height: 50
        //     }}
        //   >
        //     <Icon
        //       name='locate'
        //       style={{
        //         fontSize: 40,
        //         color: 'gray'
        //       }}
        //     />
        //   </TouchableOpacity>
        // )
        }
      </View>
    </View>
  );
};

MapScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name='map' style={{ color: tintColor }} />
  )
};

MapScreen.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  props: ownProps
});

// export default MapScreen;
export default connect(mapStateToProps)(MapScreen);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { margin: 20, fontSize: 20 },
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
  }
});
