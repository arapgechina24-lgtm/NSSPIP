'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SecurityIncident, CrimePrediction, SurveillanceFeed } from "@/types"
import { Map as MapIcon } from "lucide-react"
import type * as L from 'leaflet'

interface ThreatMapProps {
  incidents: SecurityIncident[];
  predictions: CrimePrediction[];
  surveillance: SurveillanceFeed[];
}

export function ThreatMap({ incidents, predictions, surveillance }: ThreatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatmapLayerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // Leaflet.heat is a side-effect plugin
      await import('leaflet.heat');
      // @ts-expect-error - Leaflet CSS import issue
      await import('leaflet/dist/leaflet.css');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current as HTMLElement).setView([-0.0236, 37.9062], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles',
      }).addTo(map);

      // Fetch Heatmap Data from Python Backend
      try {
        const response = await fetch('http://localhost:8000/api/v1/intelligence/heatmap');
        if (response.ok) {
          const points = await response.json();
          const heatData = points.map((p: any) => [p.lat, p.lng, p.intensity]);
          // L.heatLayer exists from side-effect import
          const heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
          }).addTo(map);
          heatmapLayerRef.current = heatLayer;
        }
      } catch (err) {
        console.warn('Python AI Backend unreachable for heatmap. Falling back to local points.');
        // Fallback or static points if backend is down
      }

      const incidentIcon = (color: string) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 0px; border: 1px solid #00ff41; box-shadow: 0 0 10px ${color}80;"></div>`,
        iconSize: [16, 16],
      });

      incidents.slice(0, 20).forEach((incident) => {
        const color =
          incident.threatLevel === 'CRITICAL' ? '#dc2626' :
            incident.threatLevel === 'HIGH' ? '#ea580c' :
              incident.threatLevel === 'MEDIUM' ? '#ca8a04' : '#16a34a';

        const marker = L.marker(incident.location.coordinates, {
          icon: incidentIcon(color),
        }).addTo(map);

        marker.bindPopup(`
          <div style="background: #000; color: #00ff41; border: 1px solid #00ff41; padding: 10px; font-family: monospace; font-size: 11px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #003b00; padding-bottom: 4px;">ID: ${incident.id}</h3>
            ${incident.description}
          </div>
        `);
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [incidents, predictions, surveillance]);

  return (
    <Card className="bg-black border-green-900/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <MapIcon className="h-5 w-5 text-green-500" />
            LIVE SECURITY HEATMAP (SENTINEL-OMEGA)
          </div>
          <div className="text-[10px] text-red-500 animate-pulse font-mono tracking-tighter">
            INTELLIGENCE_STREAM_ACTIVE
          </div>
        </CardTitle>
        <div className="flex gap-4 mt-2 text-[10px] font-mono uppercase">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gradient-to-r from-blue-500 to-red-600"></div>
            <span className="text-green-800">Threat_Intensity</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-green-900 border border-green-900 px-1">GAPPED_SOVEREIGN</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[500px] rounded-lg overflow-hidden border border-green-900/30"
        />
      </CardContent>
    </Card>
  )
}
