import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MapView } from "./MapView";
import { getRoundedValue } from "../../utils/getRoundedValue";
import { getHealthStatus } from "../../utils/getHealthStatus";
import { HealthTag } from "../../generic/HealthTag";
import { Sequential, Quantized } from "../../Scales";

// tslint:disable-next-line: no-var-requires
const data = require("../../data/airQualityData.json");

interface MapMode {
  mode: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

const MapDiv = styled.div<MapMode>`
  width: 100%;
  height: 500px;
  background-color: ${(props) =>
    props.mode === "Light Mode" ? "#d4dadc" : "#222222"};
`;

const DateTime = styled.div`
    margin:10px auto;
    background-color: rgba(255,255,255,0.6);
    padding: 2px 10px;
    border-radius: 2px;
    position absolute;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 10000;
    font-size: 14px;
`;

interface ColorScaleType {
  colorScale: string;
}

const InfoBox = styled.div`
    margin:10px 0 0 10px;
    background-color: rgba(255,255,255,0.6);
    padding: 2px 10px;
    border-radius: 2px;
    position absolute;
    z-index: 10000;
    font-size: 14px;
    max-width: 280px;
`;

const SubNote = styled.div`
  font-size: 12px;
  font-style: italic;
`;

const ColorScale = styled.div<ColorScaleType>`
    margin: ${(props) =>
      props.colorScale === "Sequential" ? "421px" : "391px"} 0 0 10px;
    background-color: rgba(255,255,255,0.3);
    padding: 0 10px;
    border-radius: 2px;
    position absolute;
    height: ${(props) => (props.colorScale === "Sequential" ? "68px" : "99px")};
    width: 381px;
    z-index: 10000;
    font-size: 14px;
`;


const MapComponent = () => {
  const [mode, setMode] = useState("Light Mode");
  const [colorScale, setColorScale] = useState("Sequential");
  const [city, setCity] = useState(null);
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(
    undefined
  );
  const dataValue = coordinates
    ? data.data.find(
        (el: { lat: number; lon: number; value: number }) =>
          el.lat === getRoundedValue(coordinates.lat) &&
          el.lon === getRoundedValue(coordinates.lon)
      )
    : null;
  const healthLevel = dataValue ? getHealthStatus(dataValue.value) : null;
  useEffect(() => {
    if (coordinates) {
      // tslint:disable-next-line: no-floating-promises
      fetch(
        `https://api.teleport.org/api/locations/${coordinates.lat}%2C${coordinates.lon}/`
      )
        .then((response) => response.json())
        // tslint:disable-next-line: no-shadowed-variable
        .then((data: any) => {
          if (data._embedded["location:nearest-cities"] !== null) {
            // tslint:disable-next-line: no-floating-promises
            fetch(
              data._embedded["location:nearest-cities"][0]._links[
                "location:nearest-city"
              ].href
            )
              .then((response) => response.json())
              .then((_cityInfo: any) => {
                setCity(_cityInfo.full_name);
              });
          } else {
            setCity(null);
          }
        });
    }
  }, [coordinates]);
  return (
    <MapDiv mode={mode}>
      <InfoBox>
        {coordinates ? (
          <>
            <h3>Coordinates</h3>
            <div className={"bold"}>
              {coordinates.lat.toFixed(2)},{coordinates.lon.toFixed(2)}
            </div>
            <h3>Nearest City</h3>
            <div className={"bold"}>{city ? city : "N/A"}</div>
            <h3>
              PM 2.5 Concentrations (μg / m<sup>3</sup>)
            </h3>
            {dataValue ? (
              <>
                <span className={"bold"}>{dataValue.value}</span>
                <HealthTag
                  backgroundColor={healthLevel?.backgroundColor}
                  color={healthLevel?.color}
                  text={healthLevel?.value}
                />
              </>
            ) : (
              <div>No Data</div>
            )}
            <h3>Cigarette Equivalence</h3>
            {dataValue ? (
              <>
                <div>
                  Breathing this air for 1 day is equivalent to smoking{" "}
                  <span className={"bold"}>
                    {(dataValue.value / 22).toFixed(2)} cigarettes
                  </span>
                </div>
              </>
            ) : (
              <div>N/A</div>
            )}
          </>
        ) : (
          <SubNote>Hover on map to see the PM 2.5 concetrations</SubNote>
        )}
      </InfoBox>
      <DateTime>{data.dateTime} UTC</DateTime>
      <ColorScale colorScale={colorScale}>
        <h4>
          PM2.5 Concetration (μg/m<sup>3</sup>)
        </h4>
        {colorScale === "Sequential" ? <Sequential /> : <Quantized />}
      </ColorScale>
      <MapView
        setMode={setMode}
        setColorScale={setColorScale}
        setCoordinates={setCoordinates}
      />
    </MapDiv>
  );
};

export default MapComponent;
