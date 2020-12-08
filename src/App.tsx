import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import CityPage from "./CityPage";

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #ffffff;
    --black: #2c2c2c;
    --dark-gray: #999999;
    --primary-color: #EA4136;
    --primary-color-hover: #0aa5c2;
    --very-light-gray: #f5f5f5;
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
    font-family: IBM Plex Serif, serif;
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
`;

const Header = styled.header`
  text-align: center;
  height: 50px;
  background-color: var(--white);
  display: flex;
  padding: 20px 0 10px 0;;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray);
`;

const Logo = styled.div`
  display: flex;
  font-size: 30px;
  margin-left: 20px;
`;

const RedSpan = styled.span`
  color: var(--primary-color);
  font-family: IBM Plex Serif, serif;
  font-style: italic;
  font-weight: 600;
  margin-right: 5px;
`;

const BlackSpan = styled.span`
  color: var(--black);
  font-weight: 600;
`;

const Navigation = styled.div`
  font-size: 16px;
  display: flex;
`;
const NavEl = styled.div`
  margin: 0 20px;


  a {
    text-decoration: none;
    font-style: normal;
    color: var(--primary-color);
  }
`;

const App = () => {
  return (
    <Router>
      <div>
        <GlobalStyle />
        <Header className="appHeader">
          <Logo>
            <Link to="/">
              <RedSpan>AirQ</RedSpan>
              <BlackSpan>Data Portal</BlackSpan>
            </Link>
          </Logo>
          <Navigation>
            <NavEl>
              <Link to="/">Map</Link>
            </NavEl>
            <NavEl>
              <Link to="/about">About</Link>
            </NavEl>
          </Navigation>
        </Header>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/:country/:region/:city" render={(props) => {
                    return ( <CityPage {...props } /> )
                }} />
          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </div>
    </Router>
  );
};

export default App;
