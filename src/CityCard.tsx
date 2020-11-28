import React from "react";
import styled from "styled-components";
import { HealthTag } from "./generic/HealthTag";
import { getHealthStatus } from "./utils/getHealthStatus";
import Particles from "./Particles";

interface PassedProps {
  city: string;
  country: string;
  value: number | null;
  index: number;
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

const LinkEl = styled.a`
  border: 0;
  padding: 0;
  color: var(--secondary-color);
  font-style: italic;
  font-size: 14px;
`;

export const CityCard = (props: PassedProps) => {
  if (props.value)
    return (
      <CityEl>
        <CardTitle>
          <CityName>
            {props.city}, {props.country}
          </CityName>
          {props.ranking ? <Ranking># {props.ranking}</Ranking> : null}
        </CardTitle>
        <TextEl>
          PM 2.5 Conc.: <span className="bold">{props.value} μg/m3</span>
        </TextEl>
        <TextEl>
          Health Status:
          <HealthTag
            backgroundColor={getHealthStatus(props.value)?.backgroundColor}
            color={getHealthStatus(props.value)?.color}
            text={getHealthStatus(props.value)?.value}
            truncate={
              getHealthStatus(props.value)?.value ===
              "Unhealthy for sensitive groups"
                ? true
                : false
            }
          />
        </TextEl>
        <TextEl>
          Cigarette Eq.:{" "}
          <span className="bold">
            {(props.value / 22).toFixed(1)} cigarettes / day
          </span>
        </TextEl>
        <ParticlesEl>
          <Particles
            width={286 / 2}
            height={286}
            id={`ParticleGood${props.index}`}
            density={12}
            note={"Good Air Quality"}
          />
          <Particles
            width={286 / 2}
            height={286}
            id={`Particle${props.index}`}
            density={props.value}
            note={`Air Quality in ${props.city}`}
          />
        </ParticlesEl>
        <LinkEl href="www.google.com">
          Click here to see the historic data
        </LinkEl>
      </CityEl>
    );
  return (
    <CityEl>
      <CityName>
        {props.city}, {props.country}
      </CityName>
      <TextEl>
        PM 2.5 Conc.:{" "}
        <span className="bold">Data not available for last hour</span>
      </TextEl>
      <LinkEl href="www.google.com">Click here to see the historic data</LinkEl>
    </CityEl>
  );
};
