import React from "react";
import styled from "styled-components";

interface PassedProps {
  backgroundColor?: string;
  color?: string;
  text?: string;
  truncate?: boolean;
}

interface Tag {
  backgroundColor?: string;
  color?: string;
}

const HealthLevelTag = styled.span<Tag>`
  padding: 2px 5px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "var(--gray)"};
  color: ${(props) => (props.color ? props.color : "var(--black)")};
  border-radius: 3px;
  font-weight: bold;
  margin-left: 10px;
  text-overflow: ellipsis;
`;

export const HealthTag = (props: PassedProps) => (
  <HealthLevelTag backgroundColor={props.backgroundColor} color={props.color}>
    {props.text
      ? props.truncate
        ? `${props.text.slice(0, 23)}...`
        : props.text
      : "N/A"}
  </HealthLevelTag>
);
