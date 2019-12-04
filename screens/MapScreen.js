import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Icon } from 'native-base';
import MapView from 'react-native-maps';
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
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
    } else {
      _getLocationAsync();
    }
    // setTimeout(() => setState({ mapflex: 1 }), 100);
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status !== 'granted') {
      setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setState({ location });
  };

  const [state, setState] = useState({
    region: {
      latitude: 37.579,
      longitude: 126.9768,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    },
    mapflex: 0,
    isMapReady: false,
    location: null,
    errorMessage: null
  });

  const { mapflex, region, isLoading, location, errorMessage } = state;

  const onRegionChange = event => {
    console.log(event);
  };

  const writeToiletPoint = event => {
    console.log(event.nativeEvent.coordinate);
  };

  const onMapLayout = () => {
    setState({ isMapReady: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider='google'
        style={{ flex: 1 }}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initialRegion}
        region={region}
        onRegionChange={onRegionChange}
        onLongPress={writeToiletPoint}
        onMapReady={onMapLayout}
      />
    </View>
  );
};

MapScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name='map' style={{ color: tintColor }} />
  )
};

export default MapScreen;

const styles = StyleSheet.create({});
