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
  margin: auto;
  margin-top: 20px;
  padding: 0 20px;
`;

const Section = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid var(--gray);
`;

const Table = styled.div`
  font-size: 14px;
  font-family: "IBM Plex Sans", sans-serif;
  line-height: 24px;
  margin-top: 20px;
  width: 100%;
`;

const TableRow = styled.div`
  display: flex;
  align-items: top;
`;

interface CellInterface {
  color?: string;
  backgroundColor: string;
  borderLeft?: string;
  borderRight?: string;
}

const Cell = styled.div<CellInterface>`
  padding: 15px 10px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => (props.color ? props.color : "var(--white)")};
  border-left: ${(props) => (props.borderLeft ? props.borderLeft : "0")};
  border-right: ${(props) => (props.borderRight ? props.borderRight : "0")};
  min-width: 25%;
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

const Button = styled.button`
  background-color: #fff;
  border: 0;
  padding: 0;
  color: var(--primary-color);
  font-style: italic;
  font-size: 14px;
`;

const Body = () => {
  const [cityList, setCityList] = useState<CityData[] | null>(null);
  const [tableVisibility, setTableVisibility] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      .catch((e: {message: string;}) => setErr(e.message));
  }, []);

  return (
    <RootEl>
      <Section>
        <h1>Most polluted cities in the last hour</h1>
        {cityList ? (
          <CityList data={cityList} />
        ) : err ? (
          <ErrorDiv>{err}</ErrorDiv>
        ) : (
          <LoaderEl>
            <Loader type="Oval" color="#00BFFF" height={50} width={50} />
          </LoaderEl>
        )}
      </Section>
      <Section>
        <h1>Air Quality Real-time Map</h1>
        <div>
          The map above visualizes near real-time data of concentration on
          particulate matter less than 2.5 microns (PM 2.5) in diameter in the
          air. PM 2.5 is one of the most damaging form of air pollution
          responsible for heart disease, stroke, lung cancer, respiratory
          infections, and other diseases.
          <br />
          <br />
          The data for the map is fetched from{" "}
          <a target="_blank" rel="noreferrer" href="https://berkeleyearth.org/">
            Berkeley Earth
          </a>
          (a source of reliable, independent, and non-governmental scientific
          data and analysis). More detail of how this data is calculated can be
          found{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://berkeleyearth.org/archive/air-quality-real-time-map/"
          >
            here
          </a>
          .
          <br />
          <br />
          Health indicators are based on the US EPA’s air quality index standard
          for 24-hour exposure (
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.epa.gov/sites/production/files/2016-04/documents/2012_aqi_factsheet.pdf"
          >
            source here
          </a>
          ).
          {tableVisibility ? (
            <>
              <Table>
                <TableRow>
                  <Cell className="bold" backgroundColor={"#009966"}>
                    Good
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#009966"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    {`<`} 12.0 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#009966"}>
                    Air quality is considered satisfactory, and air pollution
                    poses little or no risk.
                  </Cell>
                </TableRow>
                <TableRow>
                  <Cell
                    className="bold"
                    backgroundColor={"#FFDE33"}
                    color={"var(--black)"}
                  >
                    Moderate
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#FFDE33"}
                    color={"var(--black)"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    12.1-35.4 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#FFDE33"} color={"var(--black)"}>
                    Air quality is acceptable; however, for some pollutants
                    there may be a moderate health concern for a very small
                    number of people who are unusually sensitive to air
                    pollution.
                  </Cell>
                </TableRow>
                <TableRow>
                  <Cell
                    className="bold"
                    color={"var(--black)"}
                    backgroundColor={"#FF9933"}
                  >
                    Unhealthy for sensitive groups
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#FF9933"}
                    color={"var(--black)"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    35.5-55.4 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#FF9933"} color={"var(--black)"}>
                    Members of sensitive groups may experience health effects.
                    The general public is not likely to be affected.
                  </Cell>
                </TableRow>
                <TableRow>
                  <Cell className="bold" backgroundColor={"#CC0033"}>
                    Unhealthy
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#CC0033"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    55.5-150.4 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#CC0033"}>
                    Everyone may begin to experience health effects; members of
                    sensitive groups may experience more serious health effects.
                  </Cell>
                </TableRow>
                <TableRow>
                  <Cell className="bold" backgroundColor={"#660099"}>
                    Very unhealthy
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#660099"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    150.5-250.4 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#660099"}>
                    Health warnings of emergency conditions. The entire
                    population is more likely to be affected.
                  </Cell>
                </TableRow>
                <TableRow>
                  <Cell className="bold" backgroundColor={"#7E0023"}>
                    Hazardous
                  </Cell>
                  <Cell
                    className="bold"
                    backgroundColor={"#7E0023"}
                    borderLeft={"1px solid rgba(255,255,255,0.65)"}
                    borderRight={"1px solid rgba(255,255,255,0.65)"}
                  >
                    {">"} 250.5 μg/m3
                  </Cell>
                  <Cell backgroundColor={"#7E0023"}>
                    Health alert: everyone may experience more serious health
                    effects.
                  </Cell>
                </TableRow>
              </Table>
              <Button
                onClick={() => {
                  setTableVisibility(false);
                }}
              >
                Hide the definitions
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setTableVisibility(true);
              }}
            >
              Click here to see the health indicator definitions
            </Button>
          )}
        </div>
      </Section>
    </RootEl>
  );
};

export default Body;
