import React from 'react';
import { Image, Text, Platform } from 'react-native';

let MapView: any;
let Marker: any;

if (Platform.OS === 'ios' || Platform.OS === 'android') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export const MobileMap = ({ mapData }: { mapData: any }) => {
  const personIconUrl = 'https://cdn1.iconfinder.com/data/icons/web-and-user-interface-21/512/3-512.png';
  const projectIconUrl = 'https://tse4.mm.bing.net/th?id=OIP.nquIUunTQTXsPxVfLr4JAgHaHa&pid=Api';

  if (!mapData) return <Text>Loading map...</Text>;

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
        coordinate={{ latitude: mapData.userLocation.latitude, longitude: mapData.userLocation.longitude }}
        title="You are here"
      >
        <Image source={{ uri: personIconUrl }} style={{ width: 30, height: 30 }} />
      </Marker>

      {/* Project markers */}
      {mapData.projects.map((project: any, index: number) => (
        <Marker
          key={project._id || index}
          coordinate={{ latitude: project.latitude, longitude: project.longitude }}
          title={project.title}
          description={`Creator: ${project.owner} - Funds: ${project.fundingCurrent}/${project.fundingGoal}`}
        >
          <Image source={{ uri: projectIconUrl }} style={{ width: 30, height: 30 }} />
        </Marker>
      ))}
    </MapView>
  );
};
