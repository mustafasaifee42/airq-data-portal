import { getHours } from "./getDateTimeRange";
import { formatNumber } from "./formatNumber";
import { getHourlyData, getDailyData, getMonthlyData } from "./getFinalData";

export const getSummary = (dataAsObj: any) => {
  const dateTime = new Date();

  const startDate = `${new Date().getFullYear() - 1}-${formatNumber(
    new Date().getMonth() + 1
  )}-${formatNumber(new Date().getDate())}`;
  const startDateDaily = `${new Date().getFullYear() - 2}-${formatNumber(
    new Date().getMonth() + 1
  )}-${formatNumber(new Date().getDate())}`;
  const endDate = `${new Date().getFullYear()}-${formatNumber(
    new Date().getMonth() + 1
  )}-${formatNumber(new Date().getDate())}`;
  const dateTimeValue = getHours(new Date(startDate), new Date(endDate));
  const dateTimeValueDaily = getHours(new Date(startDateDaily), new Date(endDate));
  const dataFinalDailyYearly = getDailyData(dataAsObj, dateTimeValue);
  const dataFinalHourly = getHourlyData(dataAsObj, dateTimeValue);
  const dataFinalDaily = getDailyData(dataAsObj, dateTimeValueDaily);
  const StartDate30DaysTemp = new Date();
  StartDate30DaysTemp.setDate(new Date().getDate() - 31);
  const StartDate30Days = `${StartDate30DaysTemp.getFullYear()}-${formatNumber(
    StartDate30DaysTemp.getMonth() + 1
  )}-${formatNumber(StartDate30DaysTemp.getDate())}`;
  const dateTimeValue30Days = getHours(
    new Date(StartDate30Days),
    new Date(endDate)
  );
  const dataFinalHourly30Days = getHourlyData(dataAsObj, dateTimeValue30Days);

  const dateTimeYest = new Date();

  dateTimeYest.setDate(dateTimeYest.getDate() - 1);
  const dateTimeHoursOneDay = getHours(
    new Date(dateTimeYest),
    new Date(dateTime)
  );
  const dataFinalYest = getDailyData(dataAsObj, dateTimeHoursOneDay);

  const EndDateMonth = `${new Date().getFullYear()}-${formatNumber(
    new Date().getMonth() + 1
  )}`;
  const StartDateMonthTemp = new Date();
  StartDateMonthTemp.setMonth(new Date().getMonth() - 1);
  const StartDateMonth = `${StartDateMonthTemp.getFullYear()}-${formatNumber(
    StartDateMonthTemp.getMonth() + 1
  )}`;

  const startDateMonthFinal = StartDateMonth.split("-");
  const endDatMonthFinal = EndDateMonth.split("-");
  const dateTimeMonth = getHours(
    new Date(`${startDateMonthFinal[0]}-${startDateMonthFinal[1]}-01`),
    new Date(`${endDatMonthFinal[0]}-${endDatMonthFinal[1]}-01`)
  );
  const dataFinalLastMonth = getMonthlyData(dataAsObj, dateTimeMonth);
  const data = {
    "Most Recent": dataAsObj[dataAsObj.length - 1],
    "Last Day": dataFinalYest[0],
    "Last 30 Days": dataFinalHourly30Days,
    "Last Month": dataFinalLastMonth[0],
    "Last Year Hourly Data": dataFinalHourly,
    "Last Year Daily Data": dataFinalDailyYearly,
    "Last 2 Years Daily Averages": dataFinalDaily,
  };
  return data;
};
