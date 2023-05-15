import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { BottomNavigation, Text, Card } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function APODScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://pixabay.com/api/?key=34416943-6c0684b9490aa16adfda3d37f&q=car&image_type=photo');
      const json = await response.json();
      setData(json.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatGrid
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Card style={{margin: 5}}>
              <Card.Cover source={{ uri: item.webformatURL }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

function AsteroidsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://pixabay.com/api/?key=34416943-6c0684b9490aa16adfda3d37f&q=build&image_type=photo');
      const json = await response.json();
      setData(json.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatGrid
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Card style={{margin: 5}}>
              <Card.Cover source={{ uri: item.webformatURL }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

function EarthScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://pixabay.com/api/?key=34416943-6c0684b9490aa16adfda3d37f&q=nature&image_type=photo');
      const json = await response.json();
      setData(json.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatGrid
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Card style={{margin: 5}}>
              <Card.Cover source={{ uri: item.webformatURL }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

function MarsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://pixabay.com/api/?key=34416943-6c0684b9490aa16adfda3d37f&q=sea&image_type=photo');
      const json = await response.json();
      setData(json.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatGrid
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Card style={{margin: 5}}>
              <Card.Cover source={{ uri: item.webformatURL }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

function EPICScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://pixabay.com/api/?key=34416943-6c0684b9490aa16adfda3d37f&q=sea&image_type=photo');
      const json = await response.json();
      setData(json.hits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatGrid
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Card style={{margin: 5}}>
              <Card.Cover source={{ uri: item.webformatURL }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="APOD" component={APODScreen}
        options={{
          tabBarLabel: 'APOD',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-club" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="Asteroids" component={AsteroidsScreen}
        options={{
          tabBarLabel: 'Asteroids',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-diamond" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Earth" component={EarthScreen}
        options={{
          tabBarLabel: 'Earth',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-heart" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Mars" component={MarsScreen}
        options={{
          tabBarLabel: 'Mars',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-spade" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="EPIC" component={EPICScreen}
        options={{
          tabBarLabel: 'EPIC',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards" color={color} size={size} />
          ),
        }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}