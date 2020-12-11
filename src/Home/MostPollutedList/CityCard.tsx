import React from "react";
import styled from "styled-components";
import { HealthTag } from "../../generic/HealthTag";
import { getHealthStatus } from "../../utils/getHealthStatus";
import Particles from "../../generic/Particles";
import { Link } from "react-router-dom";


interface PassedProps {
  city: string;
  country: string;
  cityID: string;
  countryID: string;
  regionID: string;
  value: number | null;
  ranking?: number;
}
const CityEl = styled.div`
  margin: 10px;
  width: 100%;
  max-width: 286px;
  padding: 10px;
  background-color: var(--very-light-gray);
  border-radius: 5px;
  min-height: 466px;
`;

const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CityName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
`;

const Ranking = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
`;

const TextEl = styled.div`
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const ParticlesEl = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const LinkEl = styled.div`
  border: 0;
  padding: 0;
  color: var(--secondary-color);
  font-style: italic;
  font-size: 14px;
`;

export const CityCard = (props: PassedProps) => {
  const {
    city,
    country,
    cityID,
    countryID,
    regionID,
    value,
    ranking,
  }  = props;
  if (value)
    return (
      <CityEl>
        <CardTitle>
          <CityName>
            {city}, {country}
          </CityName>
          {ranking ? <Ranking># {ranking}</Ranking> : null}
        </CardTitle>
        <TextEl>
          PM 2.5 Conc.: <span className="bold">{value} μg/m3</span>
        </TextEl>
        <TextEl>
          Health Status:
          <HealthTag
            backgroundColor={getHealthStatus(value)?.backgroundColor}
            color={getHealthStatus(value)?.color}
            text={getHealthStatus(value)?.value}
            truncate={
              getHealthStatus(value)?.value ===
              "Unhealthy for sensitive groups"
                ? true
                : false
            }
          />
        </TextEl>
        <ParticlesEl>
          <Particles
            width={286 / 2}
            height={286}
            density={12}
            note={"Good Air Quality"}
          />
          <Particles
            width={286 / 2}
            height={286}
            density={value}
            note={`Air Quality in ${city}`}
          />
        </ParticlesEl>
        <TextEl className="italics">
          Breathing this air for 1 day is equivalent to smoking{" "}
          <span className="bold">
            {(value / 22).toFixed(1)} cigarettes
          </span>
          .{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://berkeleyearth.org/archive/air-pollution-and-cigarette-equivalence/"
          >
            Learn more
          </a>
        </TextEl>
        <Link to={`/${countryID}/${regionID}/${cityID}`}>
          <LinkEl>
            Click here to see the historic data
          </LinkEl>
        </Link>
      </CityEl>
    );
  return (
    <CityEl>
      <CityName>
        {city}, {country}
      </CityName>
      <TextEl>
        PM 2.5 Conc.:{" "}
        <span className="bold">Data not available for last hour</span>
      </TextEl>
      <LinkEl>Click here to see the historic data</LinkEl>
    </CityEl>
  );
};
