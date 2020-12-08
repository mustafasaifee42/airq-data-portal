import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { CityList } from "./CityList";

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

const RootEl = styled.div`
  margin: 20px auto;
  padding: 0 20px;
`;

const Section = styled.div`
  padding: 20px 0;
`;

const ErrorDiv = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(218, 59, 1, 0.1);
  border: 1px solid rgba(218, 59, 1, 1);
  border-radius: 2px;
`;

const LoaderEl = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;


const SubNote = styled.span`
  font-size: 14px;
  color: var(--black);
  font-style: italic;
  font-weight: normal;
`;


const MostPollutedList = () => {
  const [cityList, setCityList] = useState<CityData[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const [lastUpdatedErr, setlLastUpdatedErr] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    Axios.get(
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/all-cities`
    )
      .then((d) => {
        const data = [...d.data].sort((a, b) =>
          a["PM2.5"]["Last Hour"] > b["PM2.5"]["Last Hour"]
            ? -1
            : a["PM2.5"]["Last Hour"] < b["PM2.5"]["Last Hour"]
            ? 1
            : 0
        );
        setCityList(data);
      })
      .catch((e: { message: string }) => setErr(e.message));
  }, []);

  return (
    <RootEl>
      <Section>

      <h1>
        Live City Ranking{" "}
        <SubNote>
          (Last Updated:{" "}
          {lastUpdated
            ? `${lastUpdated} UTC`
            : lastUpdatedErr
            ? "Error fetching the last update date"
            : "..."}
          )
        </SubNote>
      </h1>
        {cityList ? (
          <CityList data={cityList} setLastUpdated={setLastUpdated} setLastUpdatedErr={setlLastUpdatedErr} />
        ) : err ? (
          <ErrorDiv>{err}</ErrorDiv>
        ) : (
          <LoaderEl>
            <Loader type="Oval" color="#00BFFF" height={50} width={50} />
          </LoaderEl>
        )}
      </Section>
    </RootEl>
  );
};

export default MostPollutedList;
