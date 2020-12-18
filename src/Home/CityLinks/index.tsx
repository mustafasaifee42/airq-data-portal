import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import cityList from "../../data/cityList.json";
import { Link } from "react-router-dom";

const RootEl = styled.div`
  margin: auto;
  padding: 60px 20px;
  background-color: var(--very-light-gray);
`;

const H1 = styled.h1`
  font-family: IBM Plex Sans, sans-serif;
  color: var(--black);
`;

const ListEl = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Container = styled.div`
  max-width: 1272px;
  margin: auto;
  background-color: var(--white);
  border: 1px solid var(--light-gray);
`;

const CountryList = styled.div`
  width: 30%;
  flex-shrink: 0;
  min-width: 150px;
  max-width: 280px;
  margin-right: 10px;
  font-size: 14px;
  max-height: 500px;
  cursor: pointer;
  overflow: auto;
  border-right: 1px solid var(--light-gray);
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: var(--gray);
  }
`;

interface Selected {
  selected: boolean;
}

const CountryEl = styled.div<Selected>`
  margin: 10px 0 10px 10px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  color: ${(props) =>
    props.selected ? "var(--primary-color)" : "var(--black)"};
`;

const CityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  padding: 0 10px;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: var(--gray);
  }
  max-height: 418px;
`;

const CountryHeading = styled.div`
  font-weight: bold;
  color: var(--primary-color);
  font-size: 30px;
  padding: 20px;
  height: 42px;
`;

const CityEl = styled.div`
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: var(--light-gray);
  color: var(--black);
  font-style: normal;
`;

const CityListEl = styled.div`
  max-height: 500px;
`;

const MostPollutedList = () => {
  const [selectedCountry, setSelectedCountry] = useState("Afghanistan");
  const countryList = _.sortBy(
    _.uniqBy(cityList, "countryName"),
    "countryName",
    "asc"
  );
  return (
    <RootEl>
      <H1>Air Quality Around the World</H1>
      <Container>
        <ListEl>
          <CountryList>
            {countryList.map((country) => (
              <CountryEl
                onClick={() => {
                  setSelectedCountry(country.countryName);
                }}
                selected={
                  selectedCountry === country.countryName ? true : false
                }
              >
                {country.countryName}
              </CountryEl>
            ))}
          </CountryList>
          <CityListEl>
            <CountryHeading>{selectedCountry}</CountryHeading>
            <CityList>
              {_.sortBy(
                _.filter(
                  cityList,
                  (city) => city.countryName === selectedCountry
                ),
                "cityName",
                "asc"
              ).map((city) => (
                <Link to={city.regionID === "None" ? `/${city.countryID}/${city.cityID}` : `/${city.countryID}/${city.regionID}/${city.cityID}`}>
                  <CityEl>{city.cityName}</CityEl>
                </Link>
              ))}
            </CityList>
          </CityListEl>
        </ListEl>
      </Container>
    </RootEl>
  );
};

export default MostPollutedList;
