import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  TouchableHighlight,
  Text,
  TextInput
} from 'react-native';
import { Icon } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// 지도 초기 장소
const initialRegion = {
  latitude: 37.579,
  longitude: 126.9768,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
};

const MapScreen = () => {
  useEffect(() => {
    _getLocationAsync();
    setTimeout(() => {
      setState({ ...state, marginBottom: 0 });
    }, 100);
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.log(status);
    if (status !== 'granted') {
      setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    setState({ ...state, location });
  };

  const [state, setState] = useState({
    region: {
      latitude: 37.579,
      longitude: 126.9768,
      latitudeDelta: 0.01,
      longitudeDelta:
        (Dimensions.get('window').width / Dimensions.get('window').height) *
        0.01
    },
    markers: [
      {
        title: '상왕십리역 화장실',
        description: '확실히 된다',
        latlng: {
          latitude: 37.56425783638769,
          longitude: 127.0305786654353
        }
      }
    ],
    isMapReady: false,
    writeToiletModalVisible: false,

    preMarker: {},
    location: null,
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
    location,
    errorMessage,
    marginBottom,
    markers,
    writeToiletModalVisible,
    preMarker
  } = state;

  const { title, description, latlng } = values;

  const onRegionChange = event => {
    console.log(event);
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

  const _onMapReady = () => {
    setState({ ...state, isMapReady: true });
  };

  console.log(markers);

  return (
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
              value={description}
              onChangeText={description =>
                setValues({ ...values, description })
              }
              placeholder={'description'}
              style={styles.input}
            />
          </View>
          <View style={{ width: 280 }}>
            <TouchableHighlight
              onPress={() => {
                preMarker.title = title;
                preMarker.description = description;
                markers.push(preMarker);

                setState({
                  ...state,
                  markers,
                  writeToiletModalVisible: false
                });
              }}
            >
              <Text>등록 완료</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <MapView
        provider='google'
        style={{ flex: 1, marginBottom: marginBottom }}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initialRegion}
        region={region}
        // onRegionChange={onRegionChange}
        onLongPress={writeToiletPoint}
        onMapReady={_onMapReady}
      >
        {markers.map((marker, i) => (
          <Marker
            key={i}
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
  }
});
