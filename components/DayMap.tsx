import React, { useMemo, useCallback } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { ItineraryItem, ItemType } from '../types';

interface DayMapProps {
    items: ItineraryItem[];
}

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem',
};

const defaultCenter = {
    lat: 60.0, // Default to Nordic region roughly
    lng: 10.0,
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const getItemColor = (type: ItemType): string => {
    switch (type) {
        case ItemType.ACTIVITY: return '#D65F5F'; // Red
        case ItemType.FLIGHT: return '#6B8EAA'; // Blue
        case ItemType.HOTEL: return '#9D8189'; // Purple
        case ItemType.TRAIN: return '#F4A261'; // Orange
        case ItemType.CAR_RENTAL: return '#8BA678'; // Green
        case ItemType.INFO: return '#7F7F7F'; // Grey
        default: return '#D65F5F';
    }
};

const DayMap: React.FC<DayMapProps> = ({ items }) => {
    const itemsWithCoords = useMemo(() =>
        items.filter(item => item.locationCoordinates && item.locationCoordinates.lat && item.locationCoordinates.lng),
        [items]);

    const center = useMemo(() => {
        if (itemsWithCoords.length > 0) {
            return itemsWithCoords[0].locationCoordinates!;
        }
        return defaultCenter;
    }, [itemsWithCoords]);

    const onLoad = useCallback((map: google.maps.Map) => {
        if (itemsWithCoords.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            itemsWithCoords.forEach(item => {
                bounds.extend(item.locationCoordinates!);
            });
            map.fitBounds(bounds);

            // Adjust zoom if only one marker to avoid too close zoom
            const listener = google.maps.event.addListener(map, "idle", () => {
                if (map.getZoom()! > 15) map.setZoom(15);
                google.maps.event.removeListener(listener);
            });
        }
    }, [itemsWithCoords]);

    if (itemsWithCoords.length === 0) return null;

    const path = itemsWithCoords.map(item => item.locationCoordinates!);

    return (
        <div className="mb-6 shadow-md rounded-xl overflow-hidden border border-stone-200">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                options={options}
                onLoad={onLoad}
            >
                {itemsWithCoords.map((item, index) => (
                    <Marker
                        key={item.id}
                        position={item.locationCoordinates!}
                        label={{
                            text: (index + 1).toString(),
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: getItemColor(item.type),
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2,
                            scale: 12,
                        }}
                        title={item.title}
                    />
                ))}

                {/* Draw a line connecting the points to show the route flow */}
                <Polyline
                    path={path}
                    options={{
                        strokeColor: '#2D2D2D',
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        icons: [{
                            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: '#2D2D2D' },
                            offset: '50%',
                            repeat: '100px'
                        }],
                    }}
                />
            </GoogleMap>
        </div>
    );
};

export default DayMap;
