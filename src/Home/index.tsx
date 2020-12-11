import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import MostPollutedList from "./MostPollutedList";
import CityLinks from "./CityLinks";
import styled from "styled-components";
import Loader from "react-loader-spinner";

const MapDiv = styled.div`
  width: 100%;
  height: 500px;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: "#d4dadc";
`;

const Home = () => {
  const [mapData, setMapData] = useState<any>();
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/mustafasaifee42/air-quality-grid-map-image-data/main/airQualityData.json"
    )
      .then((response) => response.json())
      .then((data: any) => {
        setMapData(data);
      });
  }, []);
  return (
    <>
      {mapData ? (
        <MapComponent data={mapData} />
      ) : (
        <MapDiv>
          <Loader type="Oval" color="#00BFFF" height={50} width={50} />
        </MapDiv>
      )}
      <MostPollutedList />
      <CityLinks />
    </>
  );
};

export default Home;
