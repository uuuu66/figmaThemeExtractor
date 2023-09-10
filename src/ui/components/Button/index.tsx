import React, { PropsWithChildren } from "react";
import styled from "styled-components";

export interface Props extends PropsWithChildren<any>{
  size?: "small" | "middle" | "large";
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  type?: any;
}

const Button: React.FC<Props> = (props) => {
  const { children } = props;

  return <StyledButton {...props}>{children}</StyledButton>;
};

export const StyledButton = styled.button<Props>`
  background: inherit;
  border: 1px solid black;
  box-shadow: none;
  border-radius: 8px;
  padding: 0;
  overflow: visible;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
  ${({ size, type, disabled }) => {
    switch (size) {
      case "large":
        return `
          padding: 20px 24px;
       font-size:24px;
       
        `;
      case "middle":
        return `
          padding: 16px 20px;
       font-size:18px;
        `;
      case "small":
        return `
          padding: 12px 16px;
        font-size:14px;
        `;

      default:
        return `
          padding: 12px 16px;
        font-size:14px;
        `;
    }
  }};
`;

export default Button;
