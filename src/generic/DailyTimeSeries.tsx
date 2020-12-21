import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";

interface PassedProps {
  data: any;
}

const levels = [
  {
    tag: "Good",
    concentrationLimit: [0, 12],
    color: "#009966",
    opacity: 0.2,
  },
  {
    tag: "Moderate",
    concentrationLimit: [12, 35.4],
    color: "#edd242",
    opacity: 0.2,
  },
  {
    tag: "Unhealthy for sensitive groups",
    concentrationLimit: [35.4, 55.4],
    color: "#ff9933",
    opacity: 0.2,
  },
  {
    tag: "Unhealthy",
    concentrationLimit: [55.4, 150.4],
    color: "#cc0033",
    opacity: 0.2,
  },
  {
    tag: "Very unhealthy",
    concentrationLimit: [150.4, 250.4],
    color: "#660099",
    opacity: 0.2,
  },
  {
    tag: "Hazardous",
    concentrationLimit: [250.4, 10000],
    color: "#7e0023",
    opacity: 0.15,
  },
];

const TimeSeries = (props: PassedProps) => {
  const { data } = props;
  const GraphRef = useRef(null);
  useEffect(() => {
    if (GraphRef.current && GraphRef !== null) {
      const graphDiv = d3.select(GraphRef.current);

      graphDiv.selectAll("svg").remove();

      const lineDataWONull = _.filter(
        data,
        (d: any) => d["PM2.5_Avg"] !== undefined || d["PM2.5_Avg"] !== null
      );

      const lineDataMax = d3.max(lineDataWONull, (d: any) => d["PM2.5_Max"]);

      const focusHeight = 60;

      const height = 320;

      const margin = { top: 20, right: 0, bottom: 10, left: 0 };

      const width =
        parseInt(graphDiv.style("width").slice(0, -2), 10) -
        margin.left -
        margin.right;

      const svg = graphDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + focusHeight + margin.top + 3 * margin.bottom);

      svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      const mainGraph = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`);

      const xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([data[0].date, data[data.length - 1].date]);

      const xScaleMiniGraph = d3
        .scaleTime()
        .range([0, width + margin.left])
        .domain([data[0].date, data[data.length - 1].date]);

      const yScale = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, lineDataMax]);

      const yScaleMiniGraph = d3
        .scaleLinear()
        .range([focusHeight, 0])
        .domain([0, lineDataMax]);
      mainGraph
        .selectAll(".markerLines")
        .data(levels)
        .enter()
        .append("rect")
        .attr("class", "marker")
        .attr("x", 0 - margin.left)
        .attr("width", width + margin.left)
        .attr("y", (d: any) =>
          yScale(d.concentrationLimit[1]) !== 10000
            ? yScale(d.concentrationLimit[1])
            : 0
        )
        .attr("height", (d: any) =>
          yScale(d.concentrationLimit[1]) !== 10000
            ? yScale(d.concentrationLimit[0]) - yScale(d.concentrationLimit[1])
            : yScale(d.concentrationLimit[0])
        )
        .attr("opacity", (d: any) => d.opacity)
        .attr("fill", (d: any) => d.color);
      const bisect = d3.bisector((d: any) => d.date).left;

      const miniGraph = svg
        .append("g")
        .attr(
          "transform",
          `translate(0,${height + margin.top + margin.bottom})`
        );

      const xAxis = mainGraph
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b '%y") as any))
        .call((g) => g.select(".domain").remove());
      mainGraph
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--black)")
        .call(d3.axisRight(yScale).tickSize(width + margin.left))
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
            .text(`${g.selectAll(".tick:last-of-type text").text()} μg/m3`)
        )
        .attr("transform", `translate(-${margin.left},0)`)
        .call((g) => g.selectAll(".tick text").attr("x", 0).attr("dy", -4));

      const mainGraphLine = d3
        .line()
        .defined((d: any) => d["PM2.5_Avg"] !== null)
        .x((d: any) => xScale(d.date))
        .y((d: any) => yScale(d["PM2.5_Avg"]))
        .curve(d3.curveMonotoneX);
      const mainGraphLineMaxValue = d3
        .line()
        .defined((d: any) => d["PM2.5_Max"] !== null)
        .x((d: any) => xScale(d.date))
        .y((d: any) => yScale(d["PM2.5_Max"]))
        .curve(d3.curveMonotoneX);

      const miniGraphLine = d3
        .line()
        .defined((d: any) => d["PM2.5_Avg"] !== null)
        .x((d: any) => xScaleMiniGraph(d.date))
        .y((d: any) => yScaleMiniGraph(d["PM2.5_Avg"]))
        .curve(d3.curveMonotoneX);

      miniGraph
        .append("g")
        .style("font-size", "10px")
        .style("font-family", "IBM Plex Sans")
        .style("color", "var(--gray)")
        .attr("transform", `translate(0,${focusHeight})`)
        .call(
          d3
            .axisBottom(xScaleMiniGraph)
            .tickFormat(d3.timeFormat("%b '%y") as any)
        );
      mainGraph
        .append("path")
        .attr("clip-path", "url(#clip)")
        .datum(data)
        .attr("class", "line")
        .attr("d", mainGraphLine)
        .attr("stroke", "var(--black)")
        .attr("stroke-width", 1)
        .attr("fill", "none");
      mainGraph
        .append("path")
        .attr("clip-path", "url(#clip)")
        .datum(data)
        .attr("class", "lineMax")
        .attr("d", mainGraphLineMaxValue)
        .attr("stroke", "var(--gray)")
        .attr("stroke-width", 1)
        .attr("fill", "none");

      miniGraph
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width + margin.left)
        .attr("height", focusHeight)
        .attr("fill", "#f1f1f1");
      miniGraph
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", miniGraphLine)
        .attr("stroke", "var(--black)")
        .attr("stroke-width", 1)
        .attr("fill", "none");

      const updateChart = (event: any) => {
        const extent = event.selection;
        if (extent) {
          xScale.domain([
            xScaleMiniGraph.invert(extent[0]),
            xScaleMiniGraph.invert(extent[1]),
          ]);
          mainGraph
            .selectAll(".line")
            .transition()
            .attr("d", mainGraphLine as any);
          mainGraph
            .selectAll(".lineMax")
            .transition()
            .attr("d", mainGraphLineMaxValue as any);
          xAxis.transition().call(d3.axisBottom(xScale));
        }
      };
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width + margin.left, focusHeight],
        ])
        .on("brush", updateChart);
      miniGraph
        .append("g")
        .attr("class", "x brush")
        .call(brush)
        .call(brush.move, [(width + margin.left) / 2, width + margin.left]);

      const focus = mainGraph
        .append("g")
        .append("line")
        .style("fill", "none")
        .attr("stroke", "var(--gray)")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height)
        .style("opacity", 0);

      // Create the text that travels along the curve of chart
      const focusTextGroupAvgValue = mainGraph.append("g").attr("opacity", 0);
      focusTextGroupAvgValue
        .append("rect")
        .attr("x", -5)
        .attr("y", -12)
        .attr("width", 240)
        .attr("height", 20)
        .attr("fill", "#fff")
        .attr("opacity", 0.5);
      const focusTextAvgValue = focusTextGroupAvgValue
        .append("text")
        .attr("class", "avgValue")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("font-size", 12)
        .attr("alignment-baseline", "middle");
      const focusTextGroupMaxValue = mainGraph.append("g").attr("opacity", 0);
      focusTextGroupMaxValue
        .append("rect")
        .attr("x", -5)
        .attr("y", -12)
        .attr("width", 240)
        .attr("height", 20)
        .attr("fill", "#fff")
        .attr("opacity", 0.5);
      const focusTextMaxValue = focusTextGroupMaxValue
        .append("text")
        .attr("class", "maxValue")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("font-size", 12)
        .attr("alignment-baseline", "middle");

      const mouseover = () => {
        focus.style("opacity", 1);
        focusTextAvgValue.style("opacity", 1);
        focusTextMaxValue.style("opacity", 1);
      };

      const mousemove = (event: any) => {
        const selectedData =
          data[bisect(data, xScale.invert(d3.pointer(event)[0]), 1)];
        focus
          .attr("x1", xScale(selectedData.date))
          .attr("x2", xScale(selectedData.date));
        focusTextGroupAvgValue
          .attr("opacity", 1)
          .attr(
            "transform",
            `translate(${
              xScale(selectedData.date) + 15 < width - 250
                ? xScale(selectedData.date) + 15
                : xScale(selectedData.date) - 245
            },${yScale(selectedData["PM2.5_Avg"])})`
          );
        focusTextGroupMaxValue
          .attr("opacity", 1)
          .attr(
            "transform",
            `translate(${
              xScale(selectedData.date) + 15 < width - 250
                ? xScale(selectedData.date) + 15
                : xScale(selectedData.date) - 245
            },${yScale(selectedData["PM2.5_Max"])})`
          );
        focusTextAvgValue.html(
          `${selectedData.date
            .toISOString()
            .substring(0, 10)} (24 hours avg.): ${
            selectedData["PM2.5_Avg"]
              ? `${selectedData["PM2.5_Avg"].toFixed(1)}  μg/m3`
              : "NA"
          }`
        );
        focusTextMaxValue.html(
          `${selectedData.date.toISOString().substring(0, 10)} (Max Value): ${
            selectedData["PM2.5_Max"]
              ? `${selectedData["PM2.5_Max"].toFixed(1)}  μg/m3`
              : "NA"
          }`
        );
      };
      const mouseout = () => {
        focus.style("opacity", 0);
        focusTextGroupAvgValue.attr("opacity", 0);
        focusTextGroupMaxValue.attr("opacity", 0);
      };

      mainGraph
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
    }
    // eslint-disable-next-line
  }, [GraphRef.current]);
  return <div ref={GraphRef} />;
};

export default TimeSeries;
