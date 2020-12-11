import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import CityPage from "./CityPage";
import {
  FacebookIcon,
  TwitterIcon,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import Select from "react-select";
import cityList from "./data/cityList.json";
// import ReactGA from 'react-ga';

/*
ReactGA.initialize('UA-160446912-1');
ReactGA.set({ anonymizeIp: true });
ReactGA.pageview('/');
*/

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #ffffff;
    --black: #2c2c2c;
    --dark-gray: #999999;
    --primary-color: #EA4136;
    --primary-color-hover: #0aa5c2;
    --very-light-gray: #f6f6f6;
    --light-gray: #e5e5e5;
    --gray: #aaaaaa;
    --bg-color: #faf5eb;
    --secondary-color: #4385F5;
  }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: var(--black);
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
    font-style: italic;
    color: var(--primary-color);
  }

  a:hover {
    font-weight: bold;
  }

  h1 {
    margin: 0 0 40px 0;
    font-size: 28px;
    font-family: IBM Plex Sans, sans-serif;
    color:var(--primary-color);
    text-align: center;
  }

  h4 {
    font-size: 12px;
    margin: 5px 0;
  }

  h2{
    font-size: 18px;
    margin: 0;
    padding-bottom: 10px;
  }

  h3 {
    font-size: 12px;
    font-weight: normal;
    margin: 10px 0 0;
  }

  .bold {
    font-weight: bold;
  }

  .italics {
    font-style: italic;
  }

  .leaflet-container{
    width: 100%;
    height: 500px;
    background: transparent !important;
  }

  .tooltip {
    position: absolute;
    padding: 5px;
    font-size: 12px;
    font-family: IBM Plex Sans, sans-serif;
    background: rgba(255,255,255,0.5);
    pointer-events: none;
  }
`;

const Header = styled.header`
  text-align: center;
  height: 50px;
  background-color: var(--white);
  display: flex;
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray);
`;

const Footer = styled.footer`
  background-color: var(--black);
  padding-top: 40px;
  align-items: center;
  color: var(--white);
`;

const Logo = styled.div`
  display: flex;
  font-size: 30px;
  margin-left: 20px;
  a {
    text-decoration: none;
    font-style: normal;
  }
  a:hover {
    font-weight: inherit;
  }
`;

const RedSpan = styled.span`
  color: var(--primary-color);
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 700;
`;

const BlackSpan = styled.span`
  color: var(--black);
`;

const Navigation = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const NavEl = styled.div`
  margin: 0 20px;

  a {
    text-decoration: none;
    font-style: normal;
    color: var(--primary-color);
  }
`;

const Container = styled.div`
  max-width: 1272px;
  padding: 0 20px;
  margin: auto;
  display: flex;
  justify-content: space-between;

  a {
    color: var(--white);
    text-decoration: underline;
  }
`;

const FooterContainer = styled.div`
  width: 40%;
  min-width: 320px;
`;

const FooterSubNote = styled.div`
  margin-top: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 10px 0;
`;

const IconContainer = styled.div`
  margin-top: 5px;
  display: flex;
`;

const IconEl = styled.div`
  margin-right: 10px;
`;

const SelectEl = styled.div`
  width: 300px;


  .select__control{
    background-color:var(--very-light-gray) !important;
    border-radius:0 !important;
    border: 0 !important;
  }
`;

const App = () => {
  const cityOption = cityList.map((d: any) => {
    return {
      label: `${d.cityName}, ${d.regionName}, ${d.countryName}`,
      city: d.cityName,
      region: d.regionName,
      country: d.countryName,
    };
  });
  return (
    <Router>
      <div>
        <GlobalStyle />
        <Header className="appHeader">
          <Logo>
            <Link to="/">
              <RedSpan>AirQ</RedSpan>
              <BlackSpan>DataPortal</BlackSpan>
            </Link>
          </Logo>
          <Navigation>
            <NavEl>
              <SelectEl>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={false}
                  isClearable={true}
                  isSearchable={true}
                  name="citySelection"
                  options={cityOption}
                  placeholder={"Search a city"}
                  value={null}
                  onChange={(e: any) => {
                    if (e) {
                      window.location.href = `/${e.country.replace(
                        / /g,
                        "_"
                      )}/${e.region.replace(/ /g, "_")}/${e.city.replace(
                        / /g,
                        "_"
                      )}`;
                    }
                  }}
                />
              </SelectEl>
            </NavEl>
            <NavEl>
              <Link to="/">Map</Link>
            </NavEl>
            <NavEl>
              <Link to="/more-info">More Info</Link>
            </NavEl>
          </Navigation>
        </Header>
        <Switch>
          <Route path="/more-info">
            <About />
          </Route>
          <Route
            path="/:country/:region/:city"
            render={(props) => {
              return <CityPage {...props} />;
            }}
          />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer className="appFooter">
          <Container>
            <FooterContainer>
              <h2>About the Project</h2>
              <div>
                The project tries to visualizes near real-time data and
                historical data of concentration on particulate matter less than
                2.5 microns (PM 2.5) in diameter in the air. The data used is
                fetched from{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://berkeleyearth.org/"
                >
                  Berkeley Earth
                </a>
                . <br />
                <Link to="/more-info">Learn More</Link>
              </div>
            </FooterContainer>
            <FooterContainer>
              <h2>Share the Project</h2>
              <div>
                Share the{" "}
                <span aria-label="love-emoji" role="img">
                  💖
                </span>
              </div>
              <IconContainer>
                <IconEl>
                  <FacebookShareButton
                    url={"https://airq.mustafasaifee.com"}
                    quote={
                      "Dashboard visualizing real-time worldwide air quality levels. Learn from PM2.5 trends of most cities in the world"
                    }
                  >
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                </IconEl>
                <IconEl>
                  <TwitterShareButton
                    url={"https://airq.mustafasaifee.com"}
                    title={
                      "Dashboard visualizing real-time worldwide air quality levels. Learn from PM2.5 trends of most cities in the world.: https://airq.mustafasaifee.com' via @mustafasaifee42 | Data by @BerkeleyEarth"
                    }
                  >
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                </IconEl>
              </IconContainer>
            </FooterContainer>
          </Container>
          <FooterSubNote>
            Made in Helsinki by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://mustafasaifee.com/"
            >
              Mustafa Saifee
            </a>{" "}
            @{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://futurice.com/Futurice"
            >
              Futurice
            </a>
          </FooterSubNote>
        </Footer>
      </div>
    </Router>
  );
};

export default App;
