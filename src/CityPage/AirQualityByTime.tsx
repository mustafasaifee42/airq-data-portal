import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { uniqBy } from "lodash";

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
      const margin = { top: 20, right: 0, bottom: 0, left: 75 };

      const formatData = data.map((d: any) => {
        return {
          DateTime: d.DateTime,
          "PM2.5": d["PM2.5"],
          Date: d.Date,
          Hour: parseInt(d.DateTime.split("T")[1].substring(0, 2), 10),
        };
      });
      const dateArr = uniqBy(formatData, "Date").map((d: any) => d.Date);

      const width =
        parseInt(graphDiv.style("width").slice(0, -2), 10) -
        margin.left -
        margin.right;
      const barWidth = width / 24;
      const barHeight = 20;
      const height = dateArr.length * barHeight + margin.bottom + margin.top;

      const div = graphDiv
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const svg = graphDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height);

      const colorScale = d3
        .scaleLinear()
        .range([
          "#009966",
          "#edd242",
          "#ff9933",
          "#cc0033",
          "#660099",
          "#7e0023",
        ] as any)
        .domain([0, 12, 35.4, 55.4, 150.4, 250.4]);
      const graphG = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      graphG
        .append("text")
        .attr("font-size", "10px")
        .attr("fill", "var(--gray)")
        .attr("font-family", "IBM Plex Sans")
        .attr("x", -10)
        .attr("y", 0)
        .attr("dy", -5)
        .attr("text-anchor", "end")
        .text("UTC Hours");
      graphG
        .selectAll(".dayTick")
        .data(dateArr)
        .enter()
        .append("text")
        .attr("class", "dayTick")
        .attr("font-size", "10px")
        .attr("fill", "var(--gray)")
        .attr("font-family", "IBM Plex Sans")
        .attr("x", -10)
        .attr("y", (d, i) => i * barHeight)
        .attr("dy", 15)
        .attr("text-anchor", "end")
        .text((d) => d);
      const hourArr = [];
      for (let i = 0; i < 24; i++) {
        hourArr.push(i);
      }
      graphG
        .selectAll(".hourTick")
        .data(hourArr)
        .enter()
        .append("text")
        .attr("class", "hourTick")
        .attr("font-size", "10px")
        .attr("fill", "var(--gray)")
        .attr("font-family", "IBM Plex Sans")
        .attr("x", (d) => d * barWidth + barWidth / 2)
        .attr("y", 0)
        .attr("dy", -5)
        .attr("text-anchor", "middle")
        .text((d) => `${d < 10 ? `0${d}` : d}:00`);
      graphG
        .selectAll(".bars")
        .data(formatData)
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("x", (d: any) => d.Hour * barWidth)
        .attr("y", (d: any) => dateArr.indexOf(d.Date) * barHeight)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", (d: any) =>
          d["PM2.5"] !== null ? colorScale(d["PM2.5"]) : "#eee"
        )
        .on("mouseover", (event, d: any) => {
          svg.selectAll(".bars").attr("opacity", 0.4);
          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("stroke-width", 1)
            .attr("stroke", "var(--black)");

          div.transition().duration(200).style("opacity", 1);
          div
            .html(
              `${
                d["PM2.5"] !== null ? `${d["PM2.5"].toFixed(1)} μg/m3` : "NA"
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
