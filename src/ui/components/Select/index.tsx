import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { SelectProps } from "../../../shared/interfaces";
interface StyleProps {
  isOn: boolean;
  width?: string;
  length?: number;
}
const Select: React.FC<SelectProps<any>> = ({
  children,
  value,
  onSelect,
  options,
  width,
  defaultIsOn = false,
}) => {
  const [isOn, setIsOn] = useState(defaultIsOn);

  const handleClickContainer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOn(!isOn);
  };

  return (
    <div style={{ marginLeft: "30px" }}>
      <StyledSelectContainer
        length={options.length}
        onClick={handleClickContainer}
        isOn={isOn}
      >
        <StyledTopDiv />
        {
          <StyledOptionContainer onClick={handleClickContainer} isOn={isOn}>
            <StyledOptionWrapper onClick={handleClickContainer}>
              {options.map((option) => (
                <StyledMenu
                  onClick={() => {
                    onSelect(option);
                  }}
                  isOn={isOn}
                  key={option.key || option.value}
                >
                  {option.label}
                </StyledMenu>
              ))}
            </StyledOptionWrapper>
            <StyledMenu isOn>
              {options.find((option) => option.value === value)
                ? options.find((option) => option.value === value).label
                : "선택"}
            </StyledMenu>
          </StyledOptionContainer>
        }
      </StyledSelectContainer>
      <StyledCircleWrapper>
        <StyledCircleRightBottomBorder />
        <StyledCircle>
          <StyledInnerCircleWrappr>
            <StyledInnerCircle />
          </StyledInnerCircleWrappr>
        </StyledCircle>
      </StyledCircleWrapper>
      <StyledSelectInput onClick={handleClickContainer}>{}</StyledSelectInput>
    </div>
  );
};
const StyledSelectContainer = styled.div<StyleProps>`
  max-width: ${({ width }) => width || "120px"};
  border-radius: 0px 16px 0px 0px;
  box-sizing: content-box;
  line-height: 24px;
  font-size: 16px;
  position: absolute;
  height: ${({ isOn, length }) =>
    isOn ? `calc(32 * ${length + 1}px + 22px)` : "49px"};
  border: 1px solid #6e6e6e;

  overflow-y: hidden;
  overflow-x: visible;
  background-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  width: ${({ width }) => width || "120px"};
  transition: all 0.4s;
`;
const StyledSelectInput = styled.div`
  /* color: white; */
  height: 32px;
`;
const StyledTopDiv = styled.div`
  position: relative;
  z-index: 15;
  background-color: white;
  height: 20px;
  left: 0px;
  border-bottom: 1px solid black;
  top: 0px;
  &:hover {
    background-color: #cbcbcb;
  }
  width: calc(100% px);
`;
const StyledOptionContainer = styled.div<StyleProps>`
  position: absolute;
  text-overflow: ellipsis;

  transition: all 0.4s;
  width: calc(100% - 12px);
  bottom: 0px;

  background-color: white;
  box-sizing: border-box;
  border-bottom: 1px solid black;
  border-left: 1px solid black;

  left: 12px;
`;
const StyledOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e7e7e7;
  align-items: flex-end;
  justify-content: flex-end;
`;
const StyledCircleWrapper = styled.div`
  width: 28px;
  height: 32px;
  position: relative;
  z-index: 30;
  top: 1px;
  right: 16px;
`;
const StyledCircle = styled.div`
  border-radius: 100%;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 15;
  border: 1px solid #6e6e6e;
  background-color: white;
`;
const StyledInnerCircleWrappr = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const StyledInnerCircle = styled.div`
  width: 40%;
  height: 40%;
  border-radius: 100%;
  position: relative;

  border-color: black;
  background-color: black;
`;
const StyledCircleRightBottomBorder = styled.div`
  border-bottom: 1px solid #6e6e6e;
  position: absolute;
  right: -1px;
  bottom: -2px;
  height: 16px;
  width: 16px;
  background-color: #cecece;
`;
const StyledMenu = styled.div<StyleProps>`
  height: 32px;
  padding: 0px 4px;
  &:hover {
    background-color: #cbcbcb;
  }
  width: calc(100% - 8px);
  font-size: 16px;

  cursor: pointer;
`;

export default Select;
