"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { NewsPoint } from "../../types/news";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), {
  ssr: false,
});

const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

interface Props {
  groupedNews: Record<string, NewsPoint[]>;
  mapRef: any;
  onMarkerClick: (country: string) => void;
}

export default function WorldMap({ groupedNews, mapRef, onMarkerClick }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      className="w-full h-full bg-[#090d16]"
      zoomControl={false}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {Object.entries(groupedNews).map(([country, items]) => (
        <CircleMarker
          key={country}
          center={[items[0].lat, items[0].lng]}
          radius={Math.min(10 + items.length * 2, 25)}
          pathOptions={{
            fillColor: items[0].color,
            color: "#ffffff",
            fillOpacity: 0.8,
            weight: 3,
          }}
          eventHandlers={{
            click: () => onMarkerClick(country),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            <div className="px-2 py-1 font-bold">
              {country}
              <span className="text-indigo-400 ml-1">({items.length}건)</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
