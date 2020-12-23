import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {getMonth} from '../utils/getMonth';

interface PassedProps {
  data: any;
}

const TimeSeries = (props: PassedProps) => {
  const { data } = props;
  const GraphRef = useRef(null);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphDiv = d3.select(GraphRef.current);

      graphDiv.selectAll("svg").remove();

      graphDiv.selectAll(".tooltip").remove();
      const height = 100;

      const margin = { top: 0, right: 0, bottom: 15, left: 0 };

      const width =
        parseInt(graphDiv.style("width").slice(0, -2), 10) -
        margin.left -
        margin.right;
      const barWidth = width / data.length;

      const div = graphDiv
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const svg = graphDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([data[0].date, data[data.length - 1].date]);

      const colorScale = d3
        .scaleThreshold()
        .range([
          "#009966",
          "#edd242",
          "#ff9933",
          "#cc0033",
          "#660099",
          "#7e0023",
        ] as any)
        .domain([12, 35.4, 55.4, 150.4, 250.4]);

      svg
        .append("text")
        .attr("font-size", "12px")
        .attr("fill", "var(--gray)")
        .attr("font-family", "IBM Plex Sans")
        .attr("x", 0)
        .attr("y", height + margin.bottom)
        .text(data[0].date.toISOString().substring(0, 10));

      svg
        .append("text")
        .attr("font-size", "12px")
        .attr("fill", "var(--gray)")
        .attr("font-family", "IBM Plex Sans")
        .attr("x", width + margin.right)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "end")
        .text(data[data.length - 1].date.toISOString().substring(0, 10));

      svg
        .selectAll(".bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("x", (d: any) => xScale(d.date))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", height)
        .attr("fill", (d: any) =>
          d["PM2.5_Avg"] !== null ? colorScale(d["PM2.5_Avg"]) : "#eee"
        )
        .on("mouseover", (event, d: any) => {
          const year  = d.date.toISOString().substring(0, 10).split('-')[0];
          const day  = d.date.toISOString().substring(0, 10).split('-')[2];
          const month  = getMonth(d.date.toISOString().substring(0, 10).split('-')[1]);
          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("stroke-width", 2)
            .attr("stroke", "var(--black)");

          div.transition().duration(200).style("opacity", 1);
          div
            .html(
              `${day}-${month}-${year}: ${
                d["PM2.5_Avg"] !== null
                  ? `${d["PM2.5_Avg"].toFixed(1)} μg/m3`
                  : "NA"
              }`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mousemove", (event) => {
          div
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", () => {
          svg
            .selectAll(".bars")
            .attr("opacity", 1)
            .attr("stroke-width", 0)
            .attr("stroke", "none");
          div.transition().duration(200).style("opacity", 0);
        });
    }
    // eslint-disable-next-line
  }, [GraphRef.current]);
  return <div ref={GraphRef} />;
};

export default TimeSeries;
