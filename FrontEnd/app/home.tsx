import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import { Button } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { removeToken } from '../services/auth';
import * as Location from 'expo-location';
import 'leaflet/dist/leaflet.css';
import { fetchMapData } from '../services/home-map';

export default function Home() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapData, setMapData] = useState<any | null>(null);
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
      setMessage('Location permission denied.');
      return;
    }
    let location = await Location.getLastKnownPositionAsync({});
    if (!location) {
      location = await Location.getCurrentPositionAsync({});
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
      fetchMap();
    }
  }, [location]);

  const MapContainer = React.useMemo(() => {
    if (Platform.OS === 'web') {
      return React.lazy(() => import('../components/MapContainer'));
    }
    return () => null;
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navbarButtons}>
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            buttonStyle={styles.button} 
            titleStyle={styles.buttonTitle}
          />
          <Button 
            title="Add Project" 
            onPress={handleAddButtonPress} 
            buttonStyle={styles.button} 
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
      {/* MapContainer from React Leaflet */}
      {mapData && (
        <React.Suspense fallback={<View>Loading...</View>}>
          <MapContainer mapData={mapData} />
        </React.Suspense>
      )}
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      paddingTop: 80, // To create space for the navbar
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#222222' : '#f0f0f0',
      padding: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    navbarTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    navbarButtons: {
      flexDirection: 'row',
      gap: 15, // Adjust gap between buttons
      marginLeft: 'auto', // Align buttons to the right
    },
    button: {
      backgroundColor: 'green', // Green background color
      borderRadius: 5, // Optional: add rounded corners
      marginVertical: 5, // Add vertical margin to buttons
    },
    buttonTitle: {
      color: 'white', // White text color
      fontWeight: 'bold', // Optional: add bold text for better visibility
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
  });
