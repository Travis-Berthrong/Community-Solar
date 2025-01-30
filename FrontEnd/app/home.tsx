import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Platform, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { removeToken } from '../services/auth';
import * as Location from 'expo-location';
import 'leaflet/dist/leaflet.css';
import { fetchMapData } from '../services/home-map';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedView } from '@/components/ThemedView';

let MapContainer: any;
let MobileMap: any;
if (Platform.OS === 'web') {
  MapContainer = React.lazy(() => import('../components/MapContainer.web'));
}

export default function Home() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapData, setMapData] = useState<any | null>(null);
  const [message, setMessage] = useState<string>('');
  const [MobileMap, setMobileMap] = useState<any | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('@/components/MapContainer')
        .then((module) => setMobileMap(() => module.MobileMap))
        .catch((error) => console.error("Error loading MobileMap:", error));
    }
  }, []);

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
    if (!location) return;
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

  return (
    <ThemedView style={styles.container}>
      {/* Navbar */}
      <ThemedView style={styles.navbar}>
        {/* Logout Button - Left side */}
        {Platform.OS === 'web' && (
          <Button title="Logout" onPress={handleLogout} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
        )}
  
        {/* Spacer to push "Add Project" to the right */}
        <View style={{ flex: 1 }} />
  
        {/* Add Project Button - Right side */}
        {Platform.OS === 'web' && (
          <Button title="Add Project" onPress={handleAddButtonPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
        )}
  
        {/* Mobile Icon Buttons */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={28} color="green" />
        </TouchableOpacity>
  
        <View style={{ flex: -1 }} />
  
        <TouchableOpacity onPress={handleAddButtonPress} style={styles.iconButton}>
          <IconSymbol name="plus.circle.fill" size={28} color="green" />
        </TouchableOpacity>
      </ThemedView>
  
      {/* Show React Leaflet on Web, react-native-maps on Mobile */}
      {Platform.OS === 'web' ? (
        mapData && (
          <React.Suspense fallback={<View><Text>Loading...</Text></View>}>
            <MapContainer mapData={mapData} />
          </React.Suspense>
        )
      ) : (
        mapData && MobileMap && <MobileMap mapData={mapData} />
      )}
    </ThemedView>
  );  
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      paddingTop: 80, 
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'green', // Green background
      paddingVertical: 20,
      paddingHorizontal: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      
      marginVertical: 5,
    },
    buttonTitle: {
      color: 'white',
      fontWeight: 'bold',
    },
    iconButton: {
      padding: 10,
      borderRadius: 30,
      backgroundColor: 'transparent',
    },
  });
