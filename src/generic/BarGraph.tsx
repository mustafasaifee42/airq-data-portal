import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getMonth } from "../utils/getMonth";
import _ from "lodash";
import styled from "styled-components";

interface PassedProps {
  data: any;
  region: string;
}

const Note = styled.div`
  font-size: 18px;
  width: 100%;
  background-color: var(--moderate-light-gray);
  border: 1px solid var(--light-gray);
  padding: 5px;
  margin: 20px 0;
  border-radius: 5px;
  text-align: center;
`;

const TimeSeries = (props: PassedProps) => {
  const { data, region } = props;
  const GraphRef = useRef(null);

  const dataUpdated = _.filter(
    data,
    (d: any) => d["PM2.5_Avg"] !== undefined || d["PM2.5_Avg"] !== null
  );
  let pmValAvg = 0;
  dataUpdated.forEach(d => {
    pmValAvg = pmValAvg + d["PM2.5_Avg"]
  })
  const cigAvg = (pmValAvg / (22 * dataUpdated.length)).toFixed(1);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphDiv = d3.select(GraphRef.current);

      graphDiv.selectAll("svg").remove();

      const dataWONull = _.filter(
        data,
        (d: any) => d["PM2.5_Avg"] !== undefined || d["PM2.5_Avg"] !== null
      );

      const dataMax = Math.ceil(d3.max(dataWONull, (d: any) => d["PM2.5_Avg"] / 22) ? d3.max(dataWONull, (d: any) => d["PM2.5_Avg"] / 22) as number : 0);


      const height = 380;

      const margin = { top: 20, right: 0, bottom: 10, left: 20 };


      const div = graphDiv
        .append("div")
        .attr("class", "tooltiForBar")
        .style("opacity", 0);
      const width =
        parseInt(graphDiv.style("width").slice(0, -2), 10) -
        margin.left -
        margin.right;

      const svg = graphDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom);

      const mainGraph = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`);

      const xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([data[0].date, data[data.length - 1].date]);

      const yScale = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, dataMax]);

      mainGraph
        .selectAll('.bgBars')
        .data(data)
        .enter()
        .append('rect')
        .attr("class", "bgBars")
        .attr('x', (_d, i) => i * width / data.length)
        .attr('y', 0)
        .attr('height', height - margin.bottom)
        .attr('width', width / data.length)
        .style('fill', 'var(--white)')
        .on("mouseover", (event, d: any) => {
          const year = d.date.toISOString().substring(0, 10).split('-')[0];
          const day = d.date.toISOString().substring(0, 10).split('-')[2];
          const month = getMonth(d.date.toISOString().substring(0, 10).split('-')[1]);
          d3.select(event.currentTarget)
            .style('fill', 'var(--light-gray)');

          div.transition().duration(200).style("opacity", 1);
          div
            .html(
              `${day}-${month}-${year}: ${d["PM2.5_Avg"] !== null
                ? `<span class='bold'>${d["PM2.5_Avg"].toFixed(1)} μg/m3</span>`
                : "NA"
              }${d["PM2.5_Avg"] !== null
                ? `
                    <br />
                    Equivalent to smoking <span class='bold'>${(d["PM2.5_Avg"] / 22).toFixed(1)} cigarettes</span>`
                : ''
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
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .style('fill', 'var(--white)');
          div.transition().duration(200).style("opacity", 0);
        });
      mainGraph
        .selectAll(".bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (_d, i) => i * width / data.length)
        .attr("y", (d: any) => d["PM2.5_Avg"] ? yScale(d["PM2.5_Avg"] / 22) : 0)
        .attr("height", (d: any) => d["PM2.5_Avg"] ? height - margin.bottom - yScale(d["PM2.5_Avg"] / 22) : height - margin.bottom)
        .attr("width", width / data.length)
        .style("fill", (d: any) => d["PM2.5_Avg"] ? "var(--primary-color)" : "#fafafa")
        .style("pointer-events", "none")
      mainGraph
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d %b '%y") as any).ticks(window.innerWidth < 720 ? 5 : undefined))
        .call((g) => g.select(".domain").remove());
      mainGraph
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .call(d3.axisRight(yScale).ticks(4).tickSize(width + margin.left))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick:not(:first-of-type) line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke", "var(--gray)")
            .attr("stroke-dasharray", "2,2")
        )
        .call((g) =>
          g
            .selectAll(".tick:last-of-type text")
            .text(`${g.selectAll(".tick:last-of-type text").text()} cigarettes`)
        )
        .attr("transform", `translate(-${margin.left},0)`)
        .call((g) => g.selectAll(".tick text").attr("x", 0).attr("dy", -4));

    }
    // eslint-disable-next-line
  }, [GraphRef.current]);
  return <>
    <Note>Breathing the air in {region} for 2 years is equivalent to smoking <span className="bold">{cigAvg} cigarettes</span> every day.</Note>
    <div ref={GraphRef} />
  </>
};

export default TimeSeries;
