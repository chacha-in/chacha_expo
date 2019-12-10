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
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { Icon, Button } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MapView, { Marker, Callout } from 'react-native-maps';

import { getToiletById } from '../actions/toilet';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const MapScreen = ({ getToiletById, props, auth }) => {
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

    setState({ ...state, region });
    // setState({ ...state, region, marginBottom: 0 });

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
    latlng: {},
    sex: 'both',
    forDisabled: false,
    diaperChangingTable: false,
    checked: 'both'
  });

  const [toiletDetail, setToiletDetail] = useState(null);
  const [isLoadingToiletDetail, setIsLoadingToiletDetail] = useState(false);

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

      // setState({ ...state, markers: [...resJson] });
      const target = { ...state, markers: [...resJson] };
      setState({ ...target });
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
    preMarker.sex = values.sex;
    preMarker.forDisabled = values.forDisabled;
    preMarker.diaperChangingTable = values.diaperChangingTable;

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
        setValues({
          title: '',
          description: '',
          sex: 'both',
          forDisabled: false,
          diaperChangingTable: false
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goToCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    _mapView.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta:
          (Dimensions.get('window').width / Dimensions.get('window').height) *
          0.01
      },
      1000
    );
  };

  const viewToiletDetail = async id => {
    const userToken = await AsyncStorage.getItem('userToken');

    try {
      const res = await fetch(`https://blochaid.io/api/toilets/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-auth-token': userToken
        }
      });

      const resJson = await res.json();

      setToiletDetail(resJson);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingToiletDetail(true);
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
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.title}></Text>
              <TextInput
                value={title}
                onChangeText={title => setValues({ ...values, title })}
                placeholder={'화장실 이름을 입력해주세요'}
                style={styles.input}
              />
              <View style={{ width: 250, marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.selectBoxContainer}
                  onPressOut={() =>
                    setValues({ ...values, sex: 'both', checked: 'both' })
                  }
                >
                  <Text>남녀 화장실 모두 있어요</Text>
                  {values.checked === 'both' ? (
                    <Icon
                      name='checkmark-circle-outline'
                      style={styles.selectIcon}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectBoxContainer}
                  onPressOut={() =>
                    setValues({
                      ...values,
                      sex: 'femaleOnly',
                      checked: 'femaleOnly'
                    })
                  }
                >
                  <Text>여자 화장실만 있어요</Text>
                  {values.checked === 'femaleOnly' ? (
                    <Icon
                      name='checkmark-circle-outline'
                      style={styles.selectIcon}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectBoxContainer}
                  onPressOut={() =>
                    setValues({
                      ...values,
                      sex: 'maleOnly',
                      checked: 'maleOnly'
                    })
                  }
                >
                  <Text>남자 화장실만 있어요</Text>
                  {values.checked === 'maleOnly' ? (
                    <Icon
                      name='checkmark-circle-outline'
                      style={styles.selectIcon}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectBoxContainer}
                  onPressOut={() =>
                    setValues({
                      ...values,
                      forDisabled: !values.forDisabled
                    })
                  }
                >
                  <Text>장애인 화장실 있어요</Text>
                  {values.forDisabled ? (
                    <Icon
                      name='checkmark-circle-outline'
                      style={styles.selectIcon}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectBoxContainer}
                  onPressOut={() =>
                    setValues({
                      ...values,
                      diaperChangingTable: !values.diaperChangingTable
                    })
                  }
                >
                  <Text>기저귀 거치대 있어요</Text>
                  {values.diaperChangingTable ? (
                    <Icon
                      name='checkmark-circle-outline'
                      style={styles.selectIcon}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </TouchableOpacity>
              </View>
              <TextInput
                multiline={true}
                numberOfLines={6}
                value={description}
                onChangeText={description =>
                  setValues({ ...values, description })
                }
                placeholder={'자세한 정보를 알려주세요'}
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
        </TouchableWithoutFeedback>
      </Modal>

      {/* 상세 페이지 */}

      {/* 지도 */}
      <MapView
        // provider='google'
        ref={mapView => {
          _mapView = mapView;
        }}
        style={{ flex: 1, marginBottom: marginBottom }}
        showsUserLocation={true}
        // followsUserLocation={true}
        // showsMyLocationButton={true}
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
                // title={marker.title}
                // description={marker.description}
                tracksViewChanges={false}
                // onCalloutPress={() => console.log(marker.title)}
              >
                <Callout
                  onPress={() => {
                    getToiletById(marker._id);
                    props.screenProps.navigation.navigate('ToiletDetail');
                  }}
                >
                  <Text>{marker.title}</Text>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                  >
                    {(marker.sex !== '') & (marker.sex === 'both') ? (
                      <>
                        <FontAwesomeIcon
                          name='female'
                          size={25}
                          color='#ff4d4d'
                        />
                        <Text> </Text>
                        <FontAwesomeIcon
                          name='male'
                          size={25}
                          color='#3366ff'
                        />
                      </>
                    ) : null}

                    {(marker.sex !== '') & (marker.sex === 'maleOnly') ? (
                      <>
                        <FontAwesomeIcon
                          name='male'
                          size={25}
                          color='#3366ff'
                        />
                      </>
                    ) : null}

                    {(marker.sex !== '') & (marker.sex === 'femaleOnly') ? (
                      <>
                        <FontAwesomeIcon
                          name='female'
                          size={25}
                          color='#ff4d4d'
                        />
                      </>
                    ) : null}
                    {(marker.forDisabled !== undefined) &
                    (marker.forDisabled === true) ? (
                      <>
                        <Text>{'    '}</Text>
                        <FontAwesomeIcon
                          style={{ alignSelf: 'flex-end' }}
                          name='wheelchair'
                          size={23}
                          color='#39ac73'
                        />
                      </>
                    ) : null}
                    {(marker.diaperChangingTable !== undefined) &
                    (marker.diaperChangingTable === true) ? (
                      <>
                        <Text>{'   '}</Text>
                        <FontAwesomeIcon
                          style={{ alignSelf: 'flex-end' }}
                          name='baby'
                          size={24}
                          color='#666699'
                        />
                      </>
                    ) : null}
                  </View>
                  {/* <Text>{marker.description}</Text> */}
                </Callout>
              </Marker>
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
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name='navigate'
              style={{
                fontSize: 58,
                color: 'rgba(20,20,20, 0.8)'
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressOut={goToCurrentLocation}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255, 0.7)',
              borderRadius: 25,
              width: 50,
              height: 50
            }}
          >
            <Icon
              name='locate'
              style={{
                fontSize: 40,
                color: '#4d4d4d'
              }}
            />
          </TouchableOpacity>
        )}
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
export default connect(mapStateToProps, { getToiletById })(MapScreen);

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
