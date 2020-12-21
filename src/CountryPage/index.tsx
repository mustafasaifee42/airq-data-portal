import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import styled from "styled-components";
import { getSummary } from "../utils/getSummary";
import Loader from "react-loader-spinner";
import TimeSeries from "../generic/TimeSeries";
import DailyTimeSeries from "../generic/DailyTimeSeries";
import AirQualityStrip from "../generic/AirQualityStrip";
import AirQualityByTime from "../generic/AirQualityByTime";
import {
  FacebookIcon,
  TwitterIcon,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import * as d3 from "d3";
import DataCard from "../generic/DataCard";
import { Link } from "react-router-dom";
import cityList from "../data/cityList.json";
import CityListForCountry from "./CityListForCountry";
import _ from "lodash";

import { Sequential, Quantized } from "../Scales";

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

const Title = styled.div`
  padding: 60px 20px 100px 20px;
  background-color: var(--very-light-gray);
`;

const Container = styled.div`
  max-width: 1240px;
  margin: auto;
  padding: 0 20px;
`;

const CityName = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: var(--black);
`;

const DataCardContainer = styled.div`
  display: flex;
  padding: 20px 0;
  margin: 20px 0;
  background-color: var(--white);
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
  }
`;

const CityListCard = styled.div`
  padding: 20px;
  margin: -60px 0 20px 0;
  background-color: var(--white);
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  width: calc(100%-40px);
`;

const TimeSeriesCard = styled.div`
  padding: 20px;
  margin: 20px 0;
  background-color: var(--white);
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  width: calc(100%-40px);
`;

const DataCardEl = styled.div`
  width: 30%;
  padding: 0 20px;
  border-right: 1px solid var(--light-gray);
  &:last-of-type {
    border: 0;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--light-gray);
    padding: 20px 0;
    margin: 0 20px;
    &:last-of-type {
      border: 0;
    }
  }
`;

const DataValueEl = styled.div`
  display: flex;
  align-items: center;
`;

const DataNote = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const SubNote = styled.span`
  font-size: 12px;
  font-style: italic;
  color: var(--gray);
  font-weight: normal;
`;

const Span = styled.div`
  color: var(--black);
  font-size: 14px;
  font-weight: normal;
  font-style: italic;
  line-height: 1.5;
  margin: 10px 0;
`;

const ErrorDiv = styled.div`
  margin: 20px auto;
  padding: 20px;
  width: calc(100% - 40px);
  text-align: center;
  color: var(--black);
  background-color: rgba(234, 65, 54, 0.3);
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  max-width: 1200px;
  font-weight: bold;
`;

const H1 = styled.h1`
  margin: 0;
`;

const KeyEl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const ShareDiv = styled.div`
  background-color: var(--very-light-gray);
  padding: 40px 20px;
`;

const IconContainer = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: center;
`;

const IconEl = styled.div`
  margin: 0 5px;
`;

const BreadCrumb = styled.div`
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 30px;
`;

const CityListEl = styled.div`
  margin-top: 60px;
  background-color: var(--moderate-light-gray);
  padding: 40px 20px;
`;

const CityListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CityEl = styled.div`
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: var(--light-gray);
  color: var(--black);
  font-style: normal;
`;

const ShowMoreLess = styled.button`
  margin: 20px 10px;
  padding: 10px;
  background-color: var(--primary-color);
  border: 0;
  border-radius: 5px;
  color: var(--white);
  font-size: 16px;
`;

const CityPage = (props: any) => {
  const [lastHourData, setLastHourData] = useState<any>(null);
  const [lastDayData, setLastDayData] = useState<any>(null);
  const [lastMonthData, setLastMonthData] = useState<any>(null);
  const [hourlyTS, setHourlyTS] = useState<any>(undefined);
  const [dailyTS, setDailyTS] = useState<any>(undefined);
  const [monthTS, setMonthTS] = useState<any>(undefined);
  const [dailyTSYearly, setDailyTSYearly] = useState<any>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [particleWidth, setParticleWidth] = useState<number>(100);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [countryCityList, setCountryCityList] = useState<any>(undefined);
  const [countryCityListError, setCountryCityListError] = useState<any>(
    undefined
  );

  const GraphRef = useRef(null);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphDiv = d3.select(GraphRef.current);
      const width = parseInt(graphDiv.style("width").slice(0, -2), 10);
      setParticleWidth(width);
    }
  }, []);
  useEffect(() => {
    Axios.get(
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/all-data/${props.match.params.country}`
    )
      .then((d) => {
        if (d.data.error) {
          if (d.data.error === "Request failed with status code 404") {
            setError(`Data Not Available for ${props.match.params.country}`);
          } else setError(d.data.error);
        } else {
          const summaryData: any = getSummary(d.data);
          const Date1 = new Date(`${summaryData["Most Recent"].DateTime}Z`);
          if ((new Date().getTime() - Date1.getTime()) / 3600000 <= 3)
            setLastHourData(summaryData["Most Recent"]);
          else setLastHourData("NA");
          setLastDayData(summaryData["Last Day"]);
          setLastMonthData(summaryData["Last Month"]);
          setMonthTS(summaryData["Last 30 Days"]);
          const dailyData = summaryData["Last 2 Years Daily Averages"].map(
            (el: any) => {
              const avgVal =
                el["PM2.5"].noOfObservations /
                  el["PM2.5"].totalNoOfPossibleObservations <=
                0.5
                  ? null
                  : el["PM2.5"].avgValue;
              return {
                date: new Date(`${el.Date}Z`),
                "PM2.5_Avg": avgVal,
                "PM2.5_Max": el["PM2.5"].maxValue,
              };
            }
          );
          setDailyTS(dailyData);
          const hourlyData = summaryData["Last Year Hourly Data"].map(
            (el: any) => {
              return {
                date: new Date(`${el.DateTime}Z`),
                "PM2.5": el["PM2.5"],
                PM10_mask: el.PM10_mask,
              };
            }
          );
          setHourlyTS(hourlyData);
          const dailyDataYearly = summaryData["Last Year Daily Data"].map(
            (el: any) => {
              const avgVal =
                el["PM2.5"].noOfObservations /
                  el["PM2.5"].totalNoOfPossibleObservations <=
                0.5
                  ? null
                  : el["PM2.5"].avgValue;
              return {
                date: new Date(`${el.Date}Z`),
                "PM2.5_Avg": avgVal,
                "PM2.5_Max": el["PM2.5"].maxValue,
              };
            }
          );
          setDailyTSYearly(dailyDataYearly);
        }
      })
      .catch((e: { message: string }) => {
        setError(e.message);
      });
    Axios.get(
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/all-cities`
    )
      .then((d) => {
        const data = _.filter(
          d.data,
          (v: CityData) =>
            v.country === props.match.params.country.replace(/_/g, " ")
        ).sort((a, b) =>
          a["PM2.5"]["Last Hour"] > b["PM2.5"]["Last Hour"]
            ? -1
            : a["PM2.5"]["Last Hour"] < b["PM2.5"]["Last Hour"]
            ? 1
            : 0
        );
        setCountryCityList(data);
      })
      .catch((e: { message: string }) => {
        setCountryCityListError(e.message);
      });
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Title>
        <Container>
          <BreadCrumb>
            {props.match.params.country.replace(/_/g, " ")}
          </BreadCrumb>
          <CityName>{props.match.params.country.replace(/_/g, " ")}</CityName>
        </Container>
      </Title>
      <Container>
        <CityListCard>
          <h2>
            Live PM 2.5 Concentration for All Cities of{" "}
            {props.match.params.country.replace(/_/g, " ")}{" "}
            <SubNote>
              (only showing the cities for which live data is available, full
              list of cities at the bottom of the page)
            </SubNote>
          </h2>
          {countryCityListError ? (
            <ErrorDiv>{error}</ErrorDiv>
          ) : countryCityList ? (
            <CityListForCountry data={countryCityList} />
          ) : (
            <div>
              <Loader type="Oval" color="#00BFFF" height={50} width={50} />
            </div>
          )}
        </CityListCard>
        <DataCardContainer>
          {error ? (
            <ErrorDiv style={{ margin: "0 20px" }}>{error}</ErrorDiv>
          ) : (
            <>
              <DataCardEl ref={GraphRef}>
                <>
                  {lastHourData ? (
                    <DataCard
                      data={
                        lastHourData === "NA"
                          ? lastHourData
                          : lastHourData["PM2.5"].toFixed(1)
                      }
                      particleWidth={particleWidth}
                      city={props.match.params.country.replace(/_/g, " ")}
                      text={"Last hour's"}
                    />
                  ) : (
                    <DataValueEl>
                      <Loader
                        type="Oval"
                        color="#00BFFF"
                        height={50}
                        width={50}
                      />
                    </DataValueEl>
                  )}
                </>
                <DataNote>
                  Last Hour
                  <br />
                  {lastHourData && lastHourData !== "NA" ? (
                    <>
                      <Span>
                        Breathing this air for 1 day is equivalent to smoking{" "}
                        <span className="bold">
                          {(lastHourData["PM2.5"] / 22).toFixed(1)} cigarettes
                        </span>
                      </Span>
                      <SubNote>
                        Last Updated:{" "}
                        {(
                          (new Date().getTime() -
                            new Date(`${lastHourData.DateTime}Z`).getTime()) /
                          3600000
                        ).toFixed(1)}{" "}
                        hrs ago
                      </SubNote>
                    </>
                  ) : null}
                </DataNote>
              </DataCardEl>
              <DataCardEl>
                <>
                  {lastDayData ? (
                    <DataCard
                      data={
                        lastDayData === "NA"
                          ? lastDayData
                          : lastDayData["PM2.5"].avgValue === null
                          ? "NA"
                          : lastDayData["PM2.5"].avgValue.toFixed(1)
                      }
                      particleWidth={particleWidth}
                      city={props.match.params.country.replace(/_/g, " ")}
                      text={"Yesterday's"}
                    />
                  ) : (
                    <DataValueEl>
                      <Loader
                        type="Oval"
                        color="#00BFFF"
                        height={50}
                        width={50}
                      />
                    </DataValueEl>
                  )}
                </>
                <DataNote>
                  Yesterday (Hourly Avg.){" "}
                  {lastDayData ? <SubNote>{lastDayData.Date}</SubNote> : null}{" "}
                  <br />
                  {lastDayData &&
                  lastDayData !== "NA" &&
                  lastDayData["PM2.5"].avgValue !== null ? (
                    <>
                      <Span>
                        Breathing this air for whole day is equivalent to
                        smoking{" "}
                        <span className="bold">
                          {(lastDayData["PM2.5"].avgValue / 22).toFixed(1)}{" "}
                          cigarettes
                        </span>
                      </Span>
                      <SubNote>
                        {lastDayData
                          ? `Data available for ${lastDayData["PM2.5"].noOfObservations} hrs out of 24`
                          : null}
                      </SubNote>
                    </>
                  ) : null}
                </DataNote>
              </DataCardEl>
              <DataCardEl>
                <>
                  {lastMonthData ? (
                    <DataCard
                      data={
                        lastMonthData["PM2.5"].noOfObservations /
                          lastMonthData["PM2.5"].totalNoOfPossibleObservations <
                          0.6 || lastMonthData["PM2.5"].avgValue === null
                          ? "NA"
                          : lastMonthData["PM2.5"].avgValue.toFixed(1)
                      }
                      particleWidth={particleWidth}
                      city={props.match.params.country.replace(/_/g, " ")}
                      text={"Last Month's"}
                    />
                  ) : (
                    <DataValueEl>
                      <Loader
                        type="Oval"
                        color="#00BFFF"
                        height={50}
                        width={50}
                      />
                    </DataValueEl>
                  )}
                </>
                <DataNote>
                  Last Month (Hourly Avg.){" "}
                  {lastMonthData ? (
                    <SubNote>{lastMonthData.Month}</SubNote>
                  ) : null}{" "}
                  <br />
                  {lastMonthData &&
                  lastMonthData["PM2.5"].noOfObservations /
                    lastMonthData["PM2.5"].totalNoOfPossibleObservations >
                    0.6 &&
                  lastMonthData["PM2.5"].avgValue !== null ? (
                    <>
                      <Span>
                        Breathing this air for month is equivalent to smoking{" "}
                        <span className="bold">
                          {(lastMonthData["PM2.5"].avgValue / 22).toFixed(1)}{" "}
                          cigarettes
                        </span>{" "}
                        each day of the month
                      </Span>
                      <SubNote>
                        {lastDayData
                          ? `Data available for ${lastMonthData["PM2.5"].noOfObservations} hrs out of ${lastMonthData["PM2.5"].totalNoOfPossibleObservations}`
                          : null}
                      </SubNote>
                    </>
                  ) : null}
                </DataNote>
              </DataCardEl>
            </>
          )}
        </DataCardContainer>

        <TimeSeriesCard>
          <h2>Air Quality Stripe (Last 365 days)</h2>
          <KeyEl>
            <Quantized />
          </KeyEl>
          {error ? (
            <ErrorDiv>{error}</ErrorDiv>
          ) : dailyTSYearly ? (
            <AirQualityStrip data={dailyTSYearly} />
          ) : (
            <div>
              <Loader type="Oval" color="#00BFFF" height={50} width={50} />
            </div>
          )}
        </TimeSeriesCard>
        <TimeSeriesCard>
          <h2>Air Quality by Time of Day</h2>
          <KeyEl>
            <Sequential />
          </KeyEl>
          {error ? (
            <ErrorDiv>{error}</ErrorDiv>
          ) : monthTS ? (
            <AirQualityByTime data={monthTS} />
          ) : (
            <div>
              <Loader type="Oval" color="#00BFFF" height={50} width={50} />
            </div>
          )}
        </TimeSeriesCard>
        <TimeSeriesCard>
          <h2>Daily Average Time Series (Last 2 years)</h2>
          {error ? (
            <ErrorDiv>{error}</ErrorDiv>
          ) : dailyTS ? (
            <DailyTimeSeries data={dailyTS} />
          ) : (
            <div>
              <Loader type="Oval" color="#00BFFF" height={50} width={50} />
            </div>
          )}
        </TimeSeriesCard>
        <TimeSeriesCard>
          <h2>Hourly Average Time Series (Last 365 days)</h2>
          {error ? (
            <ErrorDiv>{error}</ErrorDiv>
          ) : hourlyTS ? (
            <TimeSeries data={hourlyTS} />
          ) : (
            <div>
              <Loader type="Oval" color="#00BFFF" height={50} width={50} />
            </div>
          )}
        </TimeSeriesCard>
      </Container>
      <CityListEl>
        <Container>
          <h1>All Cities in {props.match.params.country.replace(/_/g, " ")}</h1>
          <CityListContainer>
            {_.orderBy(
              _.filter(cityList, {
                countryID: props.match.params.country,
              }),
              "cityID",
              "asc"
            ).map((city: any, i) =>
              showMore ? (
                i < 20 ? (
                  <Link
                    to={`/${city.countryID}/${city.regionID}/${city.cityID}`}
                  >
                    <CityEl>
                      {city.cityName}
                      {city.regionName === "None"
                        ? null
                        : `, ${city.regionName}`}
                    </CityEl>
                  </Link>
                ) : null
              ) : (
                <Link to={`/${city.countryID}/${city.regionID}/${city.cityID}`}>
                  <CityEl>
                    {city.cityName}
                    {city.regionName === "None" ? null : `, ${city.regionName}`}
                  </CityEl>
                </Link>
              )
            )}
          </CityListContainer>
          <ShowMoreLess
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            {showMore ? "Show More" : "Show Less"}
          </ShowMoreLess>
        </Container>
      </CityListEl>
      <ShareDiv>
        <H1>Share this page</H1>
        {lastDayData ? (
          <IconContainer>
            <IconEl>
              <FacebookShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}`}
                quote={`${
                  lastDayData["PM2.5"].noOfObservations > 12
                    ? `PM2.5 concentration in ${props.match.params.country.replace(
                        /_/g,
                        " "
                      )} yesterday was ${lastDayData["PM2.5"].avgValue.toFixed(
                        2
                      )}μg/m3 (recommended level < 12μg/m3 by US EPA). Equivalent to smoking ${(
                        lastDayData["PM2.5"].avgValue / 22
                      ).toFixed(1)} cigarettes.`
                    : `Get realtime air quality for ${props.match.params.country.replace(
                        /_/g,
                        " "
                      )}`
                }`}
              >
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
            </IconEl>
            <IconEl>
              <TwitterShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}`}
                title={`${
                  lastDayData["PM2.5"].noOfObservations > 12
                    ? `PM2.5 concentration in ${props.match.params.country.replace(
                        /_/g,
                        " "
                      )} yesterday was ${lastDayData["PM2.5"].avgValue.toFixed(
                        2
                      )}μg/m3 (recommended level < 12μg/m3 by US EPA). Equivalent to smoking ${(
                        lastDayData["PM2.5"].avgValue / 22
                      ).toFixed(1)} cigarettes. `
                    : ""
                }Get realtime air quality for ${props.match.params.country.replace(
                  /_/g,
                  " "
                )}: https://airq.mustafasaifee.com/${
                  props.match.params.country
                } via @mustafasaifee42, Data by @BerkeleyEarth`}
              >
                <TwitterIcon size={40} round={true} />
              </TwitterShareButton>
            </IconEl>
          </IconContainer>
        ) : (
          <IconContainer>
            <IconEl>
              <FacebookShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}`}
                quote={`Get realtime air quality for ${props.match.params.country.replace(
                  /_/g,
                  " "
                )}`}
              >
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
            </IconEl>
            <IconEl>
              <TwitterShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}`}
                title={`Get realtime air quality for ${props.match.params.country.replace(
                  /_/g,
                  " "
                )}: https://airq.mustafasaifee.com/${
                  props.match.params.country
                } via @mustafasaifee42, Data by @BerkeleyEarth`}
              >
                <TwitterIcon size={40} round={true} />
              </TwitterShareButton>
            </IconEl>
          </IconContainer>
        )}
      </ShareDiv>
    </>
  );
};

export default CityPage;
