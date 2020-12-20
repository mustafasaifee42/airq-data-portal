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

import { Sequential, Quantized } from "../Scales";

const Title = styled.div`
  padding: 60px 20px 100px 20px;
  background-color: var(--very-light-gray);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const CityName = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: var(--black);
`;

const CountryName = styled.span`
  font-size: 28px;
  color: var(--gray);
`;

const DataCardContainer = styled.div`
  display: flex;
  padding: 20px 0;
  margin: -60px 0 20px 0;
  background-color: var(--white);
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
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
  margin-top: 60px;
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
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/all-data/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`
    )
      .then((d) => {
        if (d.data.error) {
          if (d.data.error === "Request failed with status code 404") {
            setError(`Data Not Available for ${props.match.params.city}`);
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
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Title>
        <Container>
          <BreadCrumb>
            <Link to={`/${props.match.params.country}`}>
              {props.match.params.country.replace(/_/g, " ")}
            </Link>{" "}
            |{" "}
            <Link
              to={`/${props.match.params.country}/${props.match.params.region}`}
            >
              {props.match.params.region.replace(/_/g, " ")}
            </Link>{" "}
            | {props.match.params.city.replace(/_/g, " ")}
          </BreadCrumb>
          <CityName>{props.match.params.city.replace(/_/g, " ")}</CityName>
          <CountryName>
            {" "}
            | {props.match.params.country.replace(/_/g, " ")}
          </CountryName>
        </Container>
      </Title>
      <Container>
        <DataCardContainer>
          {error ? (
            <ErrorDiv style={{margin: '0 20px'}}>{error}</ErrorDiv>
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
                      city={props.match.params.city.replace(/_/g, " ")}
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
                      city={props.match.params.city.replace(/_/g, " ")}
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
                      city={props.match.params.city.replace(/_/g, " ")}
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
      <ShareDiv>
        <H1>Share this page</H1>
        {lastDayData ? (
          <IconContainer>
            <IconEl>
              <FacebookShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`}
                quote={`${
                  lastDayData["PM2.5"].noOfObservations > 12
                    ? `PM2.5 concentration in ${props.match.params.city.replace(
                        /_/g,
                        " "
                      )} yesterday was ${lastDayData["PM2.5"].avgValue.toFixed(
                        2
                      )}μg/m3 (recommended level < 12μg/m3 by US EPA). Equivalent to smoking ${(
                        lastDayData["PM2.5"].avgValue / 22
                      ).toFixed(1)} cigarettes.`
                    : `Get realtime air quality for ${props.match.params.city.replace(
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
                url={`https://airq.mustafasaifee.com/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`}
                title={`${
                  lastDayData["PM2.5"].noOfObservations > 12
                    ? `PM2.5 concentration in ${props.match.params.city.replace(
                        /_/g,
                        " "
                      )} yesterday was ${lastDayData["PM2.5"].avgValue.toFixed(
                        2
                      )}μg/m3 (recommended level < 12μg/m3 by US EPA). Equivalent to smoking ${(
                        lastDayData["PM2.5"].avgValue / 22
                      ).toFixed(1)} cigarettes. `
                    : ""
                }Get realtime air quality for ${props.match.params.city.replace(
                  /_/g,
                  " "
                )}: https://airq.mustafasaifee.com/${
                  props.match.params.country
                }/${props.match.params.region}/${
                  props.match.params.city
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
                url={`https://airq.mustafasaifee.com/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`}
                quote={`Get realtime air quality for ${props.match.params.city.replace(
                  /_/g,
                  " "
                )}`}
              >
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
            </IconEl>
            <IconEl>
              <TwitterShareButton
                url={`https://airq.mustafasaifee.com/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`}
                title={`Get realtime air quality for ${props.match.params.city.replace(
                  /_/g,
                  " "
                )}: https://airq.mustafasaifee.com/${
                  props.match.params.country
                }/${props.match.params.region}/${
                  props.match.params.city
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
