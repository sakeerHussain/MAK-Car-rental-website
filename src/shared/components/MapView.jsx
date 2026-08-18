import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * @param {{
 *   markers?: import('@/shared/models/typedefs').VehicleLocation[],
 *   center?: [number, number],
 *   zoom?: number,
 *   className?: string,
 * }} props
 */
export function MapView({
  markers = [],
  center = [25.2048, 55.2708],
  zoom = 11,
  className,
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = L.map(containerRef.current).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();
    markers.forEach((marker) => {
      L.marker([marker.lat, marker.lng], { icon: defaultIcon })
        .addTo(layerGroupRef.current)
        .bindPopup(
          `<strong>${marker.carName}</strong><br/>Speed: ${marker.speed} km/h<br/>Ignition: ${marker.ignitionOn ? 'On' : 'Off'}<br/>Updated: ${marker.lastUpdated}`,
        );
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      mapRef.current.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
    }
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={cn('h-96 w-full overflow-hidden rounded-xl border border-border-brand', className)}
    />
  );
}
