import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Button } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { removeToken } from '../services/auth';
import * as Location from 'expo-location';

export default function Home() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const handleLogout = async () => {
    await removeToken();
    router.replace('/login' as Href);
  };

  const handleAddButtonPress = () => {
    router.push('/addproject' as Href);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getLastKnownPositionAsync({});
    console.log('location', location);
    if (!location) {
      location = await Location.getCurrentPositionAsync({});
      console.log('location req 2', location);
    }
    setLocation(location);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Add Project" onPress={handleAddButtonPress} />
      <Text style={styles.title}>Your location is: {JSON.stringify(location?.coords)}</Text>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: isDarkMode ? '#ffffff' : '#000000',

  },
});
