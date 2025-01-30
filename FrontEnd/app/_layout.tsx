import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getToken } from '../services/auth';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (loaded && isLoggedIn !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoggedIn]);

  async function checkLoginStatus() {
    const token = await getToken();
    setIsLoggedIn(!!token);
  }

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName={isLoggedIn ? 'home' : 'login'}
        screenOptions={{
          headerTitle: () => <HeaderTitle />, // Custom header title
          headerStyle: styles.header,
          headerTitleAlign: 'center', // Ensures text is centered
          headerTintColor: '#fff', // White text color
          headerLeft: () => null, // Hides back arrow
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="addproject" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      {<Footer />}
    </ThemeProvider>
  );
}

// Custom Header Component
function HeaderTitle() {
  return <Text style={styles.headerText}>WELCOME TO COMMUNITY SOLAR</Text>;
}

// Custom Footer Component
function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.headerText}>WELCOME TO COMMUNITY SOLAR</Text>
    </View>
  );
}

// Styles for the header and footer
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E7D32', // Green header background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', // White text color
  },
  footer: {
    backgroundColor: '#2E7D32', // Green footer background
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
