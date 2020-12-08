import React, { useEffect } from "react";
import { select } from "d3-selection";
import styled from "styled-components";
import { timer } from "d3-timer";
import { range } from "d3-array";

interface PassedProps {
  width: number;
  height: number;
  density: number;
  id: string;
  note: string;
}


interface Dimensions {
  width: number;
  height: number;
}
const RootEl = styled.div<Dimensions>`
  background-color: white;
  border: 1px solid var(--gray);
  width: fit-content;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

const ParticleDiv = styled.div<Dimensions>`
  width: ${(props) => props.width - 2}px;
`;

const TextDiv = styled.div<Dimensions>`
  padding: 2px 10px;
  border-radius: 2px;
  background-color: rgba(255,255,255,0.6);
  font-size: 14px;
  position relative;
  max-width: ${(props) => props.width - 22}px;
  top: ${(props) => 0 - props.height / 2}px;
  left: ${(props) => props.width / 2}px;
  margin: auto;
  transform: translate(${(props) => 0 - props.width / 2}px, -50%);
  margin: auto;
  text-align: center;
`;

const drawCanvas = (width:number, height:number, density:number, id:string) => {
  const fill: string = "rgba(5, 5, 5, 0.5)";
  const stroke: string = "rgba(255,255,255, 1)";
  const radiusMin: number = 2;
  const radiusMax: number = 4;
  select(`#${id}`).selectAll("canvas").remove();
  const canvas: any = select(`#${id}`)
    .append("canvas")
    .attr("width", `${width-2}px`)
    .attr("height", `${height}px`);

  const context: any = canvas.node().getContext("2d");

  const nodes: {
    r: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
  }[] = range(density).map(() => {
    return {
      r: Math.round(Math.random() * (radiusMax - radiusMin) + radiusMin),
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height),
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    };
  });

  const getBounds = () => {
    return {
      get w() {
        return width;
      },
      get h() {
        return height;
      },
      get x() {
        return [(width - this.w) / 2, (width + this.w) / 2];
      },
      get y() {
        return [(height - this.h) / 2, (height + this.h) / 2];
      },
    };
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    // background rect
    context.beginPath();
    context.strokeStyle = stroke;
    context.rect(
      getBounds().x[0],
      getBounds().y[0],
      getBounds().w,
      getBounds().h
    );
    context.stroke();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < nodes.length; ++i) {
      context.beginPath();
      context.fillStyle = fill;
      context.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, 2 * Math.PI);
      context.fill();
    }
  };

  timer(floating);

  function floating() {
    nodes.forEach((d) => {
      d.x += d.dx;
      if (d.x > getBounds().x[1] || d.x < getBounds().x[0]) d.dx *= -1;
      d.y += d.dy;
      if (d.y > getBounds().y[1] || d.y < getBounds().y[0]) d.dy *= -1;
    });

    draw();
  }
};

const Particles: React.FunctionComponent<PassedProps> = (
  props: PassedProps
) => {
  const { width, height, density, id, note } = props;
  useEffect(() => {
    drawCanvas(width, height, density, id);
  });
  return (
    <RootEl width={width} height={height} >
      <ParticleDiv id={id} className="particleDiv" width={width} height={height} />
      <TextDiv width={width} height={height}>{note}</TextDiv>
    </RootEl>
  );
};
export default Particles;
