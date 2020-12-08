import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import { CityCard } from "./CityCard";
import Select from "react-select";


import cityList from "../../data/cityList.json";

interface CityData {
  city: string;
  country: string;
  region: string;
  "PM2.5": {
    "Last Hour": number | null;
    "Last Day": number | null;
    "Last 2 Days": number | null;
    "Last 3 Days": number | null;
    "Last 5 Days": number | null;
    "Last Week": number | null;
    "Last 30 Days": number | null;
    "Last Year": number | null;
  };
}

interface PassedProps {
  data: CityData[];
  setLastUpdatedErr: (e:string) => void;
  setLastUpdated: (e:string) => void;
}

const RootEl = styled.div`
  margin: 0 -10px;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const AddCityContainer = styled.div`
  margin: 10px;
  width: 100%;
  max-width: 286px;
  padding: 10px;
  background-color: var(--very-light-gray);
  border-radius: 5px;
  align-items: center;
  display: flex;
`;

const AddCityEl = styled.div`
  width: 100%;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
`;

interface CityInterface {
  city: string;
  country: string;
  value: string;
  region: string;
}

export const CityList = (props: PassedProps) => {
  const { data, setLastUpdated, setLastUpdatedErr } = props;

  const [selectedCity, setSelectedCity] = useState<CityInterface[]>([]);
  const cityOption = cityList.map((d: any) => {
    return {
      label: `${d.cityName}, ${d.regionName}, ${d.countryName}`,
      city: d.cityName,
      region: d.regionName,
      country: d.countryName,
    };
  });
  const cities = data
    .filter((city, i) => i < 10)
    .map((city: CityData, i: number) => {
      if (city["PM2.5"]["Last Hour"]) {
        return (
          <CityCard
            key={i}
            city={city.city}
            country={city.country}
            cityID={city.city.replace(/ /g, "_")}
            countryID={city.country.replace(/ /g, "_")}
            regionID={city.region.replace(/ /g, "_")}
            value={city["PM2.5"]["Last Hour"]}
            index={i}
            ranking={i + 1}
          />
        );
      }
      return null;
    });

  useEffect(() => {
    Axios.get(
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/hourly-data/${data[0].country.replace(
        / /g,
        "_"
      )}/${data[0].region.replace(/ /g, "_")}/${data[0].city.replace(
        / /g,
        "_"
      )}?mostRecent=2`
    )
      .then((d) => {
        const index = d.data.findIndex(
          (item: any) => item["PM2.5"] === data[0]["PM2.5"]["Last Hour"]
        );
        setLastUpdated(d.data[index].DateTime);
      })
      .catch((e: { message: string }) => {
        setLastUpdatedErr(e.message);
      });
      // eslint-disable-next-line
  }, []);

  return (
      <RootEl>
        {cities}
        {selectedCity.map((city, i: number) => {
          const selectedCityData = data.filter(
            (cityName) =>
              cityName.city === city.city &&
              cityName.country === city.country &&
              cityName.region === city.region
          );

          const ranking = data.findIndex(
            (cityName) =>
              cityName.city === city.city &&
              cityName.country === city.country &&
              cityName.region === city.region
          );
          if (selectedCityData.length > 0)
            return (
              <CityCard
                key={i}
                city={selectedCityData[0].city}
                country={selectedCityData[0].country}
                cityID={selectedCityData[0].city.replace(/ /g, "_")}
                countryID={selectedCityData[0].country.replace(/ /g, "_")}
                regionID={selectedCityData[0].region.replace(/ /g, "_")}
                value={selectedCityData[0]["PM2.5"]["Last Hour"]}
                index={10 + i}
                ranking={ranking + 1}
              />
            );
          return (
            <CityCard
              key={i}
              city={city.city}
              country={city.country}
              value={null}
              index={10 + i}
              cityID={city.city.replace(/ /g, "_")}
              countryID={city.country.replace(/ /g, "_")}
              regionID={city.region.replace(/ /g, "_")}
            />
          );
        })}
        <AddCityContainer>
          <AddCityEl>
            <CardTitle>Add a city</CardTitle>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isClearable={true}
              isSearchable={true}
              name="citySelection"
              options={cityOption}
              placeholder={"Search a city"}
              value={null}
              onChange={(e: any) => {
                if (e) {
                  const obj = {
                    city: e.city,
                    country: e.country,
                    value: e.value,
                    region: e.region,
                  };
                  setSelectedCity(selectedCity.concat(obj));
                }
              }}
            />
          </AddCityEl>
        </AddCityContainer>
      </RootEl>
  );
};
