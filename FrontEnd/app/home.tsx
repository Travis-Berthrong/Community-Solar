import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Button } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { removeToken } from '../services/auth';
import * as Location from 'expo-location';
import L from 'leaflet';
import { fetchMapData } from '../services/home-map'; // Import the service to fetch map data

export default function Home() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapData, setMapData] = useState<any | null>(null); // Store the map data here
  const [message, setMessage] = useState<string>('');

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

  const fetchMap = async () => {
    if (!location) return; // Ensure location is available before making request
    try {
      const { message, data } = await fetchMapData(location.coords);
      setMessage(message);
      setMapData(data);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setMessage('Failed to load map.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchMap(); // Fetch the map data once location is retrieved
    }
  }, [location]);

  useEffect(() => {
    if (mapData) {
      // Initialize the Leaflet map once data is available
      const map = L.map('map').setView([mapData.userLocation.latitude, mapData.userLocation.longitude], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Add marker for current user's location
      L.marker([mapData.userLocation.latitude, mapData.userLocation.longitude])
        .bindPopup('Your location')
        .addTo(map);

      // Add project markers
      mapData.projects.forEach((project: any) => {
        const popupContent = `
          <b>${project.title}</b><br>
          <b>Creator:</b> ${project.owner}<br>
          <b>Funds Raised:</b> ${project.fundingCurrent} / ${project.fundingGoal}<br>
        `;
        L.marker([project.latitude, project.longitude])
          .bindPopup(popupContent)
          .addTo(map);
      });
    }
  }, [mapData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Add Project" onPress={handleAddButtonPress} />
      <Text style={styles.title}>Your location is: {JSON.stringify(location?.coords)}</Text>
      
      {message && <Text style={styles.title}>{message}</Text>}

      {/* Add the div element to render the map */}
      <View id="map" style={{ width: '100%', height: 500 }}></View>
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
