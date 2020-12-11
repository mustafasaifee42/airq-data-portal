import React from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ImageOverlay,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Coordinates {
  lat: number;
  lon: number
}

interface PassedProp {
  setColorScale: (e:string)=> void;
  setMode: (e:string)=> void;
  setCoordinates: (e:Coordinates | undefined)=> void;
}

export const MapView = (props: PassedProp) => {
  const {
    setMode,
    setColorScale,
    setCoordinates,
  } = props;
  const MapEvent = () => {
    useMapEvents({
      mousemove: (e: any) => {
        setCoordinates({
          'lat': e.latlng.lat,
          'lon': e.latlng.lng,
        });
      },
      mouseout:() => {
        setCoordinates(undefined)
      },
      baselayerchange: (e) => {
        if(e.name === 'Categorical' || e.name === 'Sequential')
          setColorScale(e.name);
        if(e.name === 'Light Mode' || e.name === 'Dark Mode')
          setMode(e.name);
      },
    });
    return null;
  };
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom={true}
      preferCanvas={true}
      minZoom={2}
      maxZoom={7}
      zoomControl={false}
    >
      <MapEvent />
      <ZoomControl position="bottomright" />
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Light Mode">
          <TileLayer
            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            noWrap={true}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark Mode">
          <TileLayer
            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            noWrap={true}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <LayersControl position="topright" collapsed={false}>
        <LayersControl.BaseLayer checked name="Sequential">
          <ImageOverlay
            url={"https://raw.githubusercontent.com/mustafasaifee42/air-quality-grid-map-image-data/main/airQualitySequentialMap.png"}
            bounds={[
              [-85, -180],
              [85, 180],
            ]}
            opacity={1}
            zIndex={10}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Categorical">
          <ImageOverlay
            url={"https://raw.githubusercontent.com/mustafasaifee42/air-quality-grid-map-image-data/main/airQualityHealthMap.png"}
            bounds={[
              [-85, -180],
              [85, 180],
            ]}
            opacity={1}
            zIndex={10}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
};