import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Hotspot } from '@shared/schema';

const ghanaHotspots: Hotspot[] = [
  {
    id: '1',
    name: 'Tarkwa',
    location: { lat: 5.2922, lng: -1.9833 },
    riskScore: 87,
    lastUpdated: new Date().toISOString(),
    description: 'High mining activity detected with significant vegetation loss'
  },
  {
    id: '2',
    name: 'Obuasi',
    location: { lat: 6.2019, lng: -1.6586 },
    riskScore: 65,
    lastUpdated: new Date().toISOString(),
    description: 'Moderate risk with water pollution indicators'
  },
  {
    id: '3',
    name: 'Damang',
    location: { lat: 6.0123, lng: -1.8625 },
    riskScore: 45,
    lastUpdated: new Date().toISOString(),
    description: 'Low to moderate activity with forest degradation'
  },
];

function getMarkerIcon(riskScore: number) {
  const color = riskScore >= 66 ? '#ef4444' : riskScore >= 33 ? '#f59e0b' : '#22c55e';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        ${Math.round(riskScore)}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function MapController({ hotspots, onHotspotClick }: { hotspots: Hotspot[], onHotspotClick: (hotspot: Hotspot) => void }) {
  const map = useMap();

  useEffect(() => {
    const markerClusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });

    hotspots.forEach((hotspot) => {
      const marker = L.marker([hotspot.location.lat, hotspot.location.lng], {
        icon: getMarkerIcon(hotspot.riskScore),
      });

      marker.bindPopup(`
        <div style="min-width: 200px">
          <h3 style="font-weight: 600; margin-bottom: 4px">${hotspot.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px">${hotspot.description}</p>
          <div style="display: flex; justify-content: space-between; font-size: 12px">
            <span>Risk Score: <strong>${hotspot.riskScore}%</strong></span>
          </div>
        </div>
      `);

      marker.on('click', () => onHotspotClick(hotspot));
      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, hotspots, onHotspotClick]);

  return null;
}

interface MapViewProps {
  onHotspotClick: (hotspot: Hotspot) => void;
}

export function MapView({ onHotspotClick }: MapViewProps) {
  const [hotspots] = useState<Hotspot[]>(ghanaHotspots);

  return (
    <div className="w-full h-full relative" data-testid="map-container">
      <MapContainer
        center={[6.0, -1.5]}
        zoom={8}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController hotspots={hotspots} onHotspotClick={onHotspotClick} />
      </MapContainer>
    </div>
  );
}
