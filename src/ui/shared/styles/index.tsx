import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { PAGE_WIDTH } from "../../../shared/constants";

export const FlexDiv = styled.div<{ style: React.CSSProperties }>`
  display: flex;
  justify-content: center;
`;
export const LoadingWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  background-color: white;
`;
export const TitleWrapper = styled.h1`
  font-size: 30px;
  font-weight: 700;
  width: 100%;
  height: 40px;
  text-align: center;
`;
export const SmallTitleWrapper = styled.h2`
  font-size: 24px;
  font-weight: 700;
  width: 100%;
  height: 30px;
  text-align: center;
`;
export const AccountNumberContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100;
  justify-content: center;
  align-items: center;
`;
export const PageContainer = styled.div`
  border-right: 2px black dotted;
  flex: 0 0 ${PAGE_WIDTH}px;
`;
export const MainContainer = styled.div`
  width: calc(${PAGE_WIDTH}px * 6);
  height: 100vh;
  display: flex;
`;
export const LeftNavigation = styled.div<{ disabled?: boolean }>`
  width: 30px;
  height: 100%;
  background-color: transparent;
  left: 0;
  z-index: 1300;
  position: fixed;
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : "rgba(157, 152, 152, 0.7)"};
  }
`;
export const EasterEggPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 600px;
`;
export const RightNavigation = styled.div<{
  disabled?: boolean;
  isReady?: boolean;
}>`
  width: 30px;
  height: 100%;
  background-color: ${({ isReady }) =>
    isReady ? "rgba(202, 202, 202, 0.9)" : "transparent"};
  position: fixed;
  z-index: 1300;
  animation: ${({ disabled, isReady }) =>
    disabled ? "" : isReady ? "blink 5s infinite linear" : ""};
  @keyframes blink {
    0% {
      background-color: rgba(202, 202, 202, 0.9);
    }
    50% {
      background-color: rgba(232, 227, 227, 0.9);
    }
    100% {
      background-color: rgba(202, 202, 202, 0.9);
    }
  }
  right: 0;
  transition: all 0.5s;
  cursor: ${({ isReady }) => (isReady ? "pointer" : "default")};
  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : "rgba(157, 152, 152, 0.7)"};
  }
`;
export const GlobalStyles = createGlobalStyle`

    body {
    margin: 0;

    padding: 0;
    display: flex;

    overflow-x: hidden;
    background: white;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
`;
