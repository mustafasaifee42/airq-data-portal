import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import MapComponent from './MapComponent';
import Body from './Body';

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
  padding: 10px 20px;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  font-size: 30px;
`

const RedSpan = styled.span`
  color: var(--primary-color);
  font-family: IBM Plex Serif, serif;
  font-style: italic;
  font-weight: 600;
  margin-right: 5px;
`

const BlackSpan = styled.span`
  color: var(--black);
  font-weight: 600;
`

const App = () => {
  return (
    <div>
      <GlobalStyle />
      <Header className="appHeader">
        <Logo>
          <RedSpan>AirQ</RedSpan>
          <BlackSpan>Data Portal</BlackSpan>
        </Logo>
      </Header>
      <MapComponent />
      <Body />
    </div>
  );
};

export default App;
