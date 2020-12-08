import React from "react";
import MapComponent from './MapComponent';
import MostPollutedList from './MostPollutedList';
import CityLinks from './CityLinks';

const Home = () => {
  return (
    <>
      <MapComponent />
      <MostPollutedList />
      <CityLinks />
    </>
  );
};

export default Home;
