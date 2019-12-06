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
  AsyncStorage
} from 'react-native';
import { Icon, Button } from 'native-base';
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
      _getToiletPointAsync();
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
    markers: [],
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

      setState({ ...state, markers: resJson });
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
      // markers.push(preMarker);

      // setState({
      //   ...state,
      //   markers,
      //   writeToiletModalVisible: false
      // });
      // setValues({ title: '', description: '' });
    }
  };

  console.log(markers);

  const _onMapReady = () => {
    setState({ ...state, isMapReady: true });
  };

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

            {/* <TouchableHighlight
              onPress={() => {
                preMarker.title = title;
                preMarker.description = description;

                if (title) {
                  markers.push(preMarker);

                  setState({
                    ...state,
                    markers,
                    writeToiletModalVisible: false
                  });
                  setValues({ title: '', description: '' });
                }
              }}
            >
              <Text>등록</Text>
            </TouchableHighlight> */}
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
        {markers.map(marker => (
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
