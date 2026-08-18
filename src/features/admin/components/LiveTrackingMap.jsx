import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
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
 *   cluster?: boolean,
 * }} props
 */
export function LiveTrackingMap({
  markers = [],
  center = [25.2048, 55.2708],
  zoom = 11,
  className,
  cluster = true,
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const clusterRef = useRef(null);
  const layerGroupRef = useRef(null);
  const hasFitBounds = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = L.map(containerRef.current).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (cluster) {
      clusterRef.current = L.markerClusterGroup();
      map.addLayer(clusterRef.current);
    } else {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      layerGroupRef.current = null;
      hasFitBounds.current = false;
    };
  }, [center, zoom, cluster]);

  useEffect(() => {
    if (!mapRef.current) return;

    const targetLayer = cluster ? clusterRef.current : layerGroupRef.current;
    if (!targetLayer) return;

    targetLayer.clearLayers();

    markers.forEach((marker) => {
      const m = L.marker([marker.lat, marker.lng], { icon: defaultIcon }).bindPopup(
        `<strong>${marker.carName}</strong><br/>
         Speed: ${marker.speed} km/h<br/>
         Ignition: ${marker.ignitionOn ? 'On' : 'Off'}<br/>
         Updated: ${new Date(marker.lastUpdated).toLocaleString()}`,
      );
      targetLayer.addLayer(m);
    });

    if (markers.length > 0 && !hasFitBounds.current) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      mapRef.current.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
      hasFitBounds.current = true;
    }
  }, [markers, cluster]);

  return (
    <div
      ref={containerRef}
      className={cn('h-[600px] w-full overflow-hidden rounded-xl border border-border-brand', className)}
    />
  );
}
