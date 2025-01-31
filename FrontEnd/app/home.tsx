import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Platform, TouchableOpacity, Modal } from 'react-native';
import { Button } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

  const handleMoreInfoPress = () => {
    setModalVisible(true);
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

  // Custom Footer Component
  function Footer() {
    return (
      <View style={styles.footer}>
        <Text style={styles.headerText}>WELCOME TO COMMUNITY SOLAR</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Navbar */}
      <ThemedView style={styles.navbar}>
        {/* Logout Button - Left side */}
        {Platform.OS === 'web' && (
          <Button title="Logout" onPress={handleLogout} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
        )}

        {/* Spacer to push "Info" to the right */}
        <View style={{ flex: 4 }} />
        {/* More Info Button - Center */}
        <Button title="More Info" onPress={handleMoreInfoPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />

        {/* Spacer to push "Add Project" to the right */}
        <View style={{ flex: -1 }} />

        {/* Add Project Button - Right side */}
        {Platform.OS === 'web' && (
          <Button title="Add Project" onPress={handleAddButtonPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
        )}

        <StatusBar style="auto" />
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

      {/* More Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>This platform empowers users to accurately forecast the return on investment (ROI) of local solar installations, helping them make informed financial and energy decisions. By providing data-driven insights, it simplifies the evaluation of potential savings and benefits. Additionally, it fosters a collaborative community where users can share experiences, compare projects, and support each other in transitioning to sustainable energy solutions.</Text>
          <Button title="Close" onPress={() => setModalVisible(!modalVisible)} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
        </View>
      </Modal>

      <Footer />
    </ThemedView>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      paddingTop: 80,
      justifyContent: 'space-between', // Ensure footer is at the bottom
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'green',
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
      marginHorizontal: 5,
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
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    footer: {
      backgroundColor: '#2E7D32', // Green footer background
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff', // White text color
    },
  });
