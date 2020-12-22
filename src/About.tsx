import React from "react";
import styled from "styled-components";

const Section = styled.div`
  padding: 40px 20px;
  max-width: 960px;
  margin: auto;
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

const About = () => {
  return (
    <Section>
      <h2>About This Project</h2>
      The project tries to visualizes near real-time data and historical data of
      concentration on particulate matter less than 2.5 microns (PM 2.5) in
      diameter in the air. PM 2.5 is one of the most damaging form of air
      pollution responsible for heart disease, stroke, lung cancer, respiratory
      infections, and other diseases.
      <br />
      <br />
      The visualizations are designed and developed by{" "}
      <a target="_blank" rel="noreferrer" href="https://www.mustafasaifee.com">
        Mustafa Saifee
      </a>{" "}
      and the open source python code for fetching the live map data in JSON format
      can be found{" "}
      <a target="_blank" rel="noreferrer" href="https://github.com/mustafasaifee42/air-quality-grid-map-image-data">
        here
      </a>{" "}
      and the code for the website can be found{" "}
      <a target="_blank" rel="noreferrer" href="https://github.com/mustafasaifee42/airq-data-portal">
        here
      </a>
      .
      <br />
      <br />
      <h2>Data Source</h2>
      The data for the map is fetched from{" "}
      <a target="_blank" rel="noreferrer" href="https://berkeleyearth.org/">
        Berkeley Earth
      </a>{" "}
      (a source of reliable, independent, and non-governmental scientific data
      and analysis). More detail of how this data is calculated can be found{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://berkeleyearth.org/archive/air-quality-real-time-map/"
      >
        here
      </a>
      . The data for the map can be found{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="http://berkeleyearth.org/archive/air-quality-real-time-maps-data-download/"
      >
        here
      </a>
      {" "}and the images generated using this map can be found{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/mustafasaifee42/air-quality-grid-map-image-data"
      >
        here
      </a>
      .
      <br />
      <br />
      The historical data for the cities is fetch using{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/mustafasaifee42/air-quality-api"
      >
        the unofficial API for fetching air quality data from Berkley Earth
      </a>
      . The API fetches the data from{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="http://berkeleyearth.lbl.gov/air-quality/maps/cities/"
      >
        Berkley Earth database
      </a>
      . The API is open source can the code is available on{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/mustafasaifee42/air-quality-api"
      >
        github
      </a>
      .
      <br />
      <br />
      <h2>Health Indicators</h2>
      Health indicators are based on the US EPA’s air quality index standard for
      24-hour exposure (
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.epa.gov/sites/production/files/2016-04/documents/2012_aqi_factsheet.pdf"
      >
        source here
      </a>
      )
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
            {`<`} 12.0 μg/m<sup>3</sup>
          </Cell>
          <Cell backgroundColor={"#009966"}>
            Air quality is considered satisfactory, and air pollution poses
            little or no risk.
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
            12.1-35.4 μg/m<sup>3</sup>
          </Cell>
          <Cell backgroundColor={"#FFDE33"} color={"var(--black)"}>
            Air quality is acceptable; however, for some pollutants there may be
            a moderate health concern for a very small number of people who are
            unusually sensitive to air pollution.
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
            35.5-55.4 μg/m<sup>3</sup>
          </Cell>
          <Cell backgroundColor={"#FF9933"} color={"var(--black)"}>
            Members of sensitive groups may experience health effects. The
            general public is not likely to be affected.
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
            55.5-150.4 μg/m<sup>3</sup>
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
            150.5-250.4 μg/m<sup>3</sup>
          </Cell>
          <Cell backgroundColor={"#660099"}>
            Health warnings of emergency conditions. The entire population is
            more likely to be affected.
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
            {">"} 250.5 μg/m<sup>3</sup>
          </Cell>
          <Cell backgroundColor={"#7E0023"}>
            Health alert: everyone may experience more serious health effects.
          </Cell>
        </TableRow>
      </Table>
      <br />
      <h2>Calculation of 24 hour and Monthly Averages</h2>
      24 hour and monthly averages are calculated using hourly data. The average
      is caculated simply by adding all the hourly concentrations value in a day
      or month and then dividing it by the total number of hours for which the
      data is available.{" "}
      <span className="italics">
        Please note.: 24 hour (daily) averages are calculated only for days with
        more than 12 hourly observations (atleast 50%). Monthly averages are
        calculated only shown for months with more than 60% observations (i.e.
        if a month has 720 hrs than it should have atleast 432 hrs of valid
        observations).
      </span>
      <br />
      <br />
      <h2>Cigarette Equivalence</h2>
      The method used for comparing air pollution to cigarette smoking can be
      found{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://berkeleyearth.org/archive/air-pollution-and-cigarette-equivalence/"
      >
        here
      </a>
      .{" "}
      <span className="bold">
        1 cigarette is equivalent to an air pollution of 22 μg/m<sup>3</sup> for
        one day.
      </span>{" "}
      This means breathing air with PM 2.5 concentration of 22 μg/m<sup>3</sup>{" "}
      is equivalent to smoking 1 cigarette that day.
      <br />
      <br />
      <h2>Contact</h2>
      Project and visualizations by{" "}
      <a target="_blank" rel="noreferrer" href="https://mustafasaifee.com/">
        Mustafa Saifee
      </a>
      <br />
      <br />
      For suggestions, queries or feedback, please email me at{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="mailto:saifee.mustafa@gmail.com"
      >
        saifee.mustafa@gmail.com
      </a>{" "}
      or connect on{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://twitter.com/mustafasaifee42"
      >
        twitter
      </a>
    </Section>
  );
};

export default About;
