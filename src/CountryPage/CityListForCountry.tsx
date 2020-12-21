import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getHealthStatus } from "../utils/getHealthStatus";

const CityListEl = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  justify-content: space-between;
`;
const City = styled.div`
  display: flex;
  margin: 5px 10px;
  width: 100%;
  background-color: var(--very-light-gray);
  justify-content: space-between;
`;

interface HealthStatus {
  backgroundColor: string;
  color: string;
}

const LeftCol = styled.div`
  display: flex;
  align-items: center;
`;

const RightCol = styled.div<HealthStatus>`
  display: flex;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  padding: 10px;
  justify-content: flex-end;
  font-weight: bold;
  width: 105px;
  font-style: normal;
`;

const CityIndex = styled.div`
  font-size: 16px;
  font-weight: bold;
  background-color: var(--gray);
  padding: 10px;
  width: 25px;
  text-align: center;
  color: var(--black);
  font-style: normal;
`;

const CityName = styled.div`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: var(--black);
  font-style: normal;
`;

const RegionName = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: var(--gray);
  font-style: normal;
`;

interface Tag {
  backgroundColor?: string;
  color?: string;
}

const HealthLevelTag = styled.span<Tag>`
  padding: 2px 5px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "var(--gray)"};
  color: ${(props) => (props.color ? props.color : "var(--black)")};
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
  height: fit-content;
  font-style: normal;
`;

const ShowMoreLess = styled.button`
  margin: 10px 0 20px 0;
  width: 100%;
  padding: 20px;
  background-color: var(--light-gray);
  border: 0;
  border-radius: 5px;
  color: var(--black);
  font-size: 16px;
`;

const ParentDiv = styled.div`
  width: calc(100% - 20px);
`;

const CityListForCountry = (props: any) => {
  const { data } = props;
  const [showMore, setShowMore] = useState<boolean>(true);
  return (
    <>
      <CityListEl>
        {data.map((d: any, i: number) =>
          showMore ? (
            i < 10 ? (
              <ParentDiv key={i}>
                <Link
                  to={
                    d.region === "None"
                      ? `/${d.country.replace(/ /g, "_")}/${d.city.replace(
                          / /g,
                          "_"
                        )}`
                      : `/${d.country.replace(/ /g, "_")}/${d.region.replace(
                          / /g,
                          "_"
                        )}/${d.city.replace(/ /g, "_")}`
                  }
                >
                  <City>
                    <LeftCol>
                      <CityIndex>{i + 1}</CityIndex>
                      <CityName>
                        {d.city}
                        {window.innerWidth > 680 ? (
                          <RegionName>, {d.region}</RegionName>
                        ) : null}
                      </CityName>
                      <HealthLevelTag
                        backgroundColor={
                          getHealthStatus(d["PM2.5"]["Last Hour"])
                            .backgroundColor
                        }
                        color={getHealthStatus(d["PM2.5"]["Last Hour"]).color}
                      >
                        {getHealthStatus(d["PM2.5"]["Last Hour"]).value}
                      </HealthLevelTag>
                    </LeftCol>
                    <RightCol
                      backgroundColor={
                        getHealthStatus(d["PM2.5"]["Last Hour"]).backgroundColor
                      }
                      color={getHealthStatus(d["PM2.5"]["Last Hour"]).color}
                    >
                      {d["PM2.5"]["Last Hour"]} μg/m<sup>3</sup>
                    </RightCol>
                  </City>
                </Link>
              </ParentDiv>
            ) : null
          ) : (
            <ParentDiv key={i}>
              <Link
                to={
                  d.region === "None"
                    ? `/${d.country.replace(/ /g, "_")}/${d.city.replace(
                        / /g,
                        "_"
                      )}`
                    : `/${d.country.replace(/ /g, "_")}/${d.region.replace(
                        / /g,
                        "_"
                      )}/${d.city.replace(/ /g, "_")}`
                }
              >
                <City>
                  <LeftCol>
                    <CityIndex>{i + 1}</CityIndex>
                    <CityName>
                      {d.city}
                      <RegionName>, {d.region}</RegionName>
                    </CityName>
                    <HealthLevelTag
                      backgroundColor={
                        getHealthStatus(d["PM2.5"]["Last Hour"]).backgroundColor
                      }
                      color={getHealthStatus(d["PM2.5"]["Last Hour"]).color}
                    >
                      {getHealthStatus(d["PM2.5"]["Last Hour"]).value}
                    </HealthLevelTag>
                  </LeftCol>
                  <RightCol
                    backgroundColor={
                      getHealthStatus(d["PM2.5"]["Last Hour"]).backgroundColor
                    }
                    color={getHealthStatus(d["PM2.5"]["Last Hour"]).color}
                  >
                    {d["PM2.5"]["Last Hour"]} μg/m<sup>3</sup>
                  </RightCol>
                </City>
              </Link>
            </ParentDiv>
          )
        )}
      </CityListEl>
      {data.length > 10 ? (
        <ShowMoreLess
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          {showMore ? "Show More" : "Show Less"}
        </ShowMoreLess>
      ) : null}
    </>
  );
};

export default CityListForCountry;
