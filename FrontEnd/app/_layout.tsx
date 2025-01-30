import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getToken } from '../services/auth';
import { Text, View, StyleSheet, Platform } from 'react-native';

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
    console.log('Token:', token);
    setIsLoggedIn(!!token);
  }

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <Stack
          screenOptions={({ route }) => ({
            headerShown: route.name === 'login' || route.name === 'signup' || route.name === 'addproject',
            headerTitle: () => <HeaderTitle />,
            headerStyle: styles.header,
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerLeft: () => null,
          })}
        >
          {!isLoggedIn ? (
            <>
              <Stack.Screen 
                name="login" 
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderTitle />,
                  headerStyle: styles.header,
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff',
                  headerLeft: () => null,
                }}
              />
              <Stack.Screen 
                name="signup"
                options={{
                  headerShown: true,
                  headerTitle: () => <HeaderTitle />,
                  headerStyle: styles.header,
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff',
                  headerLeft: () => null,
                }}
              />
              <Stack.Screen name="index" redirect={true} />
              <Stack.Screen name="home" redirect={true} />
              <Stack.Screen name="addproject" redirect={true} options={{
                headerShown: true,
                headerTitle: () => <HeaderTitle />,
                headerStyle: styles.header,
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
              }} />
            </>
          ) : (
            <>
              <Stack.Screen name="home" />
              <Stack.Screen name="addproject" options={{
                headerShown: true,
                headerTitle: () => <HeaderTitle />,
                headerStyle: styles.header,
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
              }} />
              <Stack.Screen name="login" redirect={true} />
              <Stack.Screen name="signup" redirect={true} />
              <Stack.Screen name="index" redirect={true} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}

function HeaderTitle() {
  return (
    <View style={[
      styles.headerContainer,
      Platform.OS === 'ios' ? { marginBottom: 10 } : null
    ]}>
      <Text style={styles.headerText}>
        {Platform.OS === 'web' ? 'WELCOME TO COMMUNITY SOLAR !' : 'COMMUNITY SOLAR'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    ...Platform.select({
      ios: {
        paddingBottom: 15,
        paddingTop: 5,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
});