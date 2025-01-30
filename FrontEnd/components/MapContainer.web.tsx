import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L, { icon } from 'leaflet';
import React from 'react';
import { MapContainer as Map, Marker, Popup, TileLayer } from 'react-leaflet';

const personIconUrl = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.iconfinder.com%2Fdata%2Ficons%2Fweb-and-user-interface-21%2F512%2F3-512.png&f=1&nofb=1&ipt=c572ac349d298360adff7e7928ba5b808f97867a3685d3a096818d77ecdfda85&ipo=images';
const projectIconUrl = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Felectricity-icon-png%2Felectricity-icon-png-1.jpg&f=1&nofb=1&ipt=05dbdf5ce08ffdc3c33f33d7833638e76b59353c6bb90a8e570e82b3c3f404a0&ipo=images';

// Custom marker icon configuration for Leaflet using images
const createCustomIcon = (iconUrl: string) =>
  L.icon({
    iconUrl,
    iconSize: [30, 30],  // Adjust the size of the marker
    iconAnchor: [15, 30],  // Anchor the icon in the correct position
    popupAnchor: [0, -30],  // Position the popup above the icon
  });

const MapContainer = ({ mapData }: { mapData: any }) => {
  const userIcon = createCustomIcon(personIconUrl);
  const projectIcon = createCustomIcon(projectIconUrl);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        center={[mapData.userLocation.latitude, mapData.userLocation.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[mapData.userLocation.latitude, mapData.userLocation.longitude]}
          icon={userIcon}
        >
          <Popup maxWidth={300}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>You are here</div>
          </Popup>
        </Marker>
        {mapData.projects.map((project: any, index: number) => (
          <Marker
            key={index}
            position={[project.latitude, project.longitude]}
            icon={projectIcon}
          >
            <Popup maxWidth={300}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{project.title}</div>
              <div>{`Creator: ${project.owner}`}</div>
              <div>{`Funds Raised: ${project.fundingCurrent} / ${project.fundingGoal}`}</div>
            </Popup>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapContainer;
