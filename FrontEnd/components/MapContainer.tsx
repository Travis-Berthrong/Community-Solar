import React from 'react';
import { Image, Text, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
let MapView: any;
let Marker: any;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export const MobileMap = ({ mapData }: { mapData: any }) => {
  if (!mapData) return <Text>Loading map...</Text>;
  
  const renderUserMarker = () => {
    if (Platform.OS === 'ios') {
      return (
        <IconSymbol
          name="location.fill"
          size={30}
          color="#007AFF"
          style={{ transform: [{ scale: 1.2 }] }}
        />
      );
    } else {
      return (
        <IconSymbol
          name="location"
          size={30}
          color="#4285F4"
          style={{ transform: [{ scale: 1.2 }] }}
        />
      );
    }
  };

  const renderProjectMarker = () => (
    <IconSymbol
      name="bolt.circle.fill"
      size={30}
      color="#34C759"
      style={{ transform: [{ scale: 1.2 }] }}
    />
  );

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: mapData.userLocation.latitude,
        longitude: mapData.userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* User location marker */}
      <Marker
        coordinate={{
          latitude: mapData.userLocation.latitude,
          longitude: mapData.userLocation.longitude
        }}
        title="You are here"
      >
        {renderUserMarker()}
      </Marker>
      
      {/* Project markers */}
      {mapData.projects.map((project: any, index: number) => (
        <Marker
          key={project._id || index}
          coordinate={{
            latitude: project.latitude,
            longitude: project.longitude
          }}
          title={project.title}
          description={`Creator: ${project.owner} - Funds: ${project.fundingCurrent}/${project.fundingGoal}`}
          onCalloutPress={() => (router.push({ pathname: `/projects/[id]`, params: { id: project.id } }))}
        >
          {renderProjectMarker()}
        </Marker>
      ))}
    </MapView>
  );
};