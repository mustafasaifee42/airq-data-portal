import React from "react";
import styled from "styled-components";
import { HealthTag } from "./HealthTag";
import { getHealthStatus } from "../utils/getHealthStatus";
import Particles from "./Particles";

interface PassedProps {
  data: number | "NA";
  particleWidth: number;
  city: string;
  text: string;
}

const DataValueEl = styled.div`
  display: flex;
  align-items: center;
`;

const DataValue = styled.div`
  font-size: 40px;
  display: flex;
  align-items: baseline;
`;

const ParticlesEl = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Span = styled.div`
  font-size: 18px;
  margin-left: 5px;
`;

const DataCard = (props: PassedProps) => {
  const { data, particleWidth, city, text } = props;
  return data !== "NA" ? (
    <>
      <DataValueEl>
        <DataValue>
          {data} <Span>μg/m3</Span>
        </DataValue>
        <HealthTag
          backgroundColor={getHealthStatus(data)?.backgroundColor}
          color={getHealthStatus(data)?.color}
          text={getHealthStatus(data)?.value}
          truncate={
            getHealthStatus(data)?.value === "Unhealthy for sensitive groups"
              ? true
              : false
          }
        />
      </DataValueEl>
      <ParticlesEl>
        <Particles
          width={particleWidth / 2}
          height={(2 * particleWidth) / 3}
          density={12}
          note={"Good Air Quality"}
        />
        <Particles
          width={particleWidth / 2}
          height={(2 * particleWidth) / 3}
          density={data}
          note={`${text} air quality in ${city}`}
        />
      </ParticlesEl>
    </>
  ) : (
    <>
      <DataValueEl>
        <DataValue>{data}</DataValue>
      </DataValueEl>
      <ParticlesEl>
        <Particles
          width={particleWidth / 2}
          height={(2 * particleWidth) / 3}
          density={12}
          note={"Good Air Quality"}
        />
        <Particles
          width={particleWidth / 2}
          height={(2 * particleWidth) / 3}
          density={0}
          note={`${text} air quality in ${city} is Not Available`}
        />
      </ParticlesEl>
    </>
  );
};

export default DataCard;
