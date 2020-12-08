import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import { HealthTag } from "../generic/HealthTag";
import { getHealthStatus } from "../utils/getHealthStatus";
import { getSummary } from "../utils/getSummary";
import Loader from "react-loader-spinner";
import TimeSeries from "./TimeSeries";
import DailyTimeSeries from "./DailyTimeSeries";

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

const DataCardEl = styled.div`
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

const DataCard = styled.div`
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

const DataValue = styled.div`
  font-size: 40px;
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
  width: 100%;
  text-align: center;
  color: var(--black);
  background-color: rgba(234, 65, 54, 0.3);
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  max-width: 1200px;
  font-weight: bold;
`;

const CityPage = (props: any) => {
  const [lastHourData, setLastHourData] = useState<any>(null);
  const [lastDayData, setLastDayData] = useState<any>(null);
  const [lastMonthData, setLastMonthData] = useState<any>(null);
  const [hourlyTS, setHourlyTS] = useState<any>(undefined);
  const [dailyTS, setDailyTS] = useState<any>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    Axios.get(
      `https://berkleyearth-air-quality-api.herokuapp.com/air-quality/all-data/${props.match.params.country}/${props.match.params.region}/${props.match.params.city}`
    )
      .then((d) => {
        const summaryData:any = getSummary(d.data)
        const Date1 = new Date(`${summaryData["Most Recent"].DateTime}Z`);
        if ((new Date().getTime() - Date1.getTime()) / 3600000 <= 3)
          setLastHourData(summaryData["Most Recent"]);
        else setLastHourData("NA");
        setLastDayData(summaryData["Last Day"]);
        setLastMonthData(summaryData["Last Month"]);
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
        const hourlyData = summaryData["Last 2 Years Hourly Data"].map((el: any) => {
          return {
            date: new Date(`${el.DateTime}Z`),
            "PM2.5": el["PM2.5"],
            PM10_mask: el.PM10_mask,
          };
        });
        setHourlyTS(hourlyData);
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
          <CityName>{props.match.params.city.replace(/_/g, " ")}</CityName>
          <CountryName>
            {" "}
            | {props.match.params.country.replace(/_/g, " ")}
          </CountryName>
        </Container>
      </Title>
      {error ? (
        <ErrorDiv>{error}</ErrorDiv>
      ) : (
        <>
          <Container>
            <DataCardEl>
              <DataCard>
                <DataValueEl>
                  {lastHourData ? (
                    lastHourData !== "NA" ? (
                      <>
                        <DataValue>{lastHourData["PM2.5"]}</DataValue>
                        <HealthTag
                          backgroundColor={
                            getHealthStatus(lastHourData["PM2.5"])
                              ?.backgroundColor
                          }
                          color={getHealthStatus(lastHourData["PM2.5"])?.color}
                          text={getHealthStatus(lastHourData["PM2.5"])?.value}
                          truncate={
                            getHealthStatus(lastHourData["PM2.5"])?.value ===
                            "Unhealthy for sensitive groups"
                              ? true
                              : false
                          }
                        />
                      </>
                    ) : (
                      <>
                        <DataValue>{lastHourData}</DataValue>
                      </>
                    )
                  ) : (
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={50}
                      width={50}
                    />
                  )}
                </DataValueEl>
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
              </DataCard>
              <DataCard>
                <DataValueEl>
                  {lastDayData ? (
                    lastDayData["PM2.5"].noOfObservations > 12 ? (
                      <>
                        <DataValue>
                          {lastDayData["PM2.5"].avgValue.toFixed(2)}
                        </DataValue>
                        <HealthTag
                          backgroundColor={
                            getHealthStatus(lastDayData["PM2.5"].avgValue)
                              ?.backgroundColor
                          }
                          color={
                            getHealthStatus(lastDayData["PM2.5"].avgValue)
                              ?.color
                          }
                          text={
                            getHealthStatus(lastDayData["PM2.5"].avgValue)
                              ?.value
                          }
                          truncate={
                            getHealthStatus(lastDayData["PM2.5"].avgValue)
                              ?.value === "Unhealthy for sensitive groups"
                              ? true
                              : false
                          }
                        />
                      </>
                    ) : (
                      <DataValue>NA</DataValue>
                    )
                  ) : (
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={50}
                      width={50}
                    />
                  )}
                </DataValueEl>
                <DataNote>
                  Yesterday (Hourly Avg.){" "}
                  {lastDayData ? <SubNote>{lastDayData.Date}</SubNote> : null}{" "}
                  <br />
                  {lastDayData && lastDayData !== "NA" ? (
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
              </DataCard>
              <DataCard>
                <DataValueEl>
                  {lastMonthData ? (
                    lastMonthData["PM2.5"].noOfObservations /
                      lastMonthData["PM2.5"].totalNoOfPossibleObservations >
                    0.6 ? (
                      <>
                        <DataValue>
                          {lastMonthData["PM2.5"].avgValue.toFixed(2)}
                        </DataValue>
                        <HealthTag
                          backgroundColor={
                            getHealthStatus(lastMonthData["PM2.5"].avgValue)
                              ?.backgroundColor
                          }
                          color={
                            getHealthStatus(lastMonthData["PM2.5"].avgValue)
                              ?.color
                          }
                          text={
                            getHealthStatus(lastMonthData["PM2.5"].avgValue)
                              ?.value
                          }
                          truncate={
                            getHealthStatus(lastMonthData["PM2.5"].avgValue)
                              ?.value === "Unhealthy for sensitive groups"
                              ? true
                              : false
                          }
                        />
                      </>
                    ) : (
                      <DataValue>NA</DataValue>
                    )
                  ) : (
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={50}
                      width={50}
                    />
                  )}
                </DataValueEl>
                <DataNote>
                  Last Month (Hourly Avg.){" "}
                  {lastMonthData ? <SubNote>{lastMonthData.Month}</SubNote> : null}{" "}
                  <br />
                  {lastMonthData &&
                  lastMonthData["PM2.5"].noOfObservations /
                    lastMonthData["PM2.5"].totalNoOfPossibleObservations >
                    0.6 ? (
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
              </DataCard>
            </DataCardEl>
            <TimeSeriesCard>
              <h2>Hourly Average Time Series</h2>
              {hourlyTS ? (
                <TimeSeries data={hourlyTS} />
              ) : (
                <div>
                  <Loader type="Oval" color="#00BFFF" height={50} width={50} />
                </div>
              )}
            </TimeSeriesCard>
            <TimeSeriesCard>
              <h2>Daily Average Time Series</h2>
              {dailyTS ? (
                <DailyTimeSeries data={dailyTS} />
              ) : (
                <div>
                  <Loader type="Oval" color="#00BFFF" height={50} width={50} />
                </div>
              )}
            </TimeSeriesCard>
          </Container>
        </>
      )}
    </>
  );
};

export default CityPage;