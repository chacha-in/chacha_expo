import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  TouchableHighlight,
  Text,
  TextInput,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Icon, Button } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const MapScreen = () => {
  useEffect(() => {
    _getLocationAsync();

    // setTimeout(() => {

    //   // setTimeout(() => {
    //   //   setState({ ...state, marginBottom: 0 });
    //   // }, 100);
    // }, 100);
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.log(status);
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
    console.log(region);
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

  const onRegionChange = event => {
    // console.log(event);
  };

  const _getToiletPointAsync = async () => {
    try {
      const res = await fetch('https://blochaid.io/api/toilets', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const resJson = await res.json();

      console.log(resJson);
      const target = { ...state, markers: [...resJson] };
      setState({ ...target });
    } catch (error) {
      console.log(error);
    }
    console.log('화장실 가져오기');
  };

  const writeToiletPoint = event => {
    console.log(event.nativeEvent.coordinate);

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
        console.log(resJson);

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

  const _onMapReady = () => {
    setState({ ...state, isMapReady: true });
  };

  return (markers === null) & (region === null) & (isMapReady === false) ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' />
      <Text>가운데 왜 안오지</Text>
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
        // followsUserLocation={true}
        // showsMyLocationButton={true}
        region={region}
        // onRegionChange={onRegionChange}
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
              />
            ))}
      </MapView>
    </View>
  );
};

MapScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name='map' style={{ color: tintColor }} />
  )
};

export default MapScreen;

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
