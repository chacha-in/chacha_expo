import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
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
    location: null,
    errorMessage: null,
    marginBottom: 1
  });

  const {
    region,
    isMapReady,
    location,
    errorMessage,
    marginBottom,
    markers
  } = state;

  const onRegionChange = event => {
    console.log(event);
  };

  const writeToiletPoint = event => {
    // console.log(event);
  };

  const _onMapReady = () => {
    setState({ ...state, isMapReady: true });
  };

  console.log(markers);

  return (
    <View style={{ flex: 1 }}>
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
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
        {/* <Marker
          title='sample'
          description='되라'
          coordinate={{
            latitude: 37.56425783638769,
            longitude: 127.0305786654353
          }}
        /> */}
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

const styles = StyleSheet.create({});
