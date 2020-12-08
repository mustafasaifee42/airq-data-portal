export const getHealthStatus = (value: number | null) => {
  if (value) {
    if (value > 250.4) {
      return {
        value: "Hazardous",
        backgroundColor: "#7e0023",
        color: "#ffffff",
      };
    }
    if (value <= 250.4 && value > 150.4) {
      return {
        value: "Very Unhealthy",
        backgroundColor: "#660099",
        color: "#ffffff",
      };
    }
    if (value <= 150.4 && value > 55.4) {
      return {
        value: "Unhealthy",
        backgroundColor: "#cc0033",
        color: "#ffffff",
      };
    }
    if (value <= 55.4 && value > 35.4) {
      return {
        value: "Unhealthy for sensitive groups",
        backgroundColor: "#ff9933",
        color: "#212121",
      };
    }
    if (value <= 35.4 && value > 12) {
      return {
        value: "Moderate",
        backgroundColor: "#edd242",
        color: "#212121",
      };
    }
    if (value < 12) {
      return {
        value: "Good",
        backgroundColor: "#009966",
        color: "#ffffff",
      };
    }
  }
  return {
    value: "",
    backgroundColor: "#fffff",
    color: "#ffffff",
  };
};
