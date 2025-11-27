import React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
}

const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      options={{
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        zoomControl: true,
      }}
    >
    </GoogleMap>
  );
};

export default Map;
