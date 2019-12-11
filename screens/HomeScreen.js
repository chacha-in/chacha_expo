import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { Icon, Button } from 'native-base';

const HomeScreen = () => {
  useEffect(() => {
    _getData();
  }, []);

  const [data, setData] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const _renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, marginTop: 20 }}>
      <Image source={{ uri: item.url }} style={{ height: 200 }} />
      <Text>{item.title}</Text>
    </View>
  );

  const _getData = async () => {
    const url =
      'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' + page;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(refreshing ? json : json.concat(data));
        setPage(page + 1);
        setRefreshing(false);
      });
  };

  const _handleLoadMore = () => {
    _getData();
  };

  const _handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    _getData();
  };

  const writePost = () => {};

  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 12 }}>
          <FlatList
            data={data}
            renderItem={_renderItem}
            keyExtractor={(item, index) => item.id}
            onEndReached={_handleLoadMore}
            onEndReachedThreshold={1}
            refreshing={refreshing}
            onRefresh={_handleRefresh}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              height: '100%',

              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>근심 풀기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 응급 버튼 */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'white'
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <TouchableOpacity
            style={{
              width: '50%',
              height: '100%',
              backgroundColor: '#3366ff',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              범 죄
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '50%',
              height: '100%',
              backgroundColor: '#ff4d4d',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              응 급
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

HomeScreen.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name='home' style={{ color: tintColor }} />
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
