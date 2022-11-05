import styled, { createGlobalStyle } from "styled-components";
import { PAGE_WIDTH } from "../../../shared/constants";

export const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
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
  text-align: center;
`;
export const Pages = styled.div`
  border-right: 2px black dotted;
  display: flex;
  flex: 0 0 ${PAGE_WIDTH}px;
  overflow-x: auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
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
export const EasterEggPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 600px;
`;
export const RightNavigation = styled.div<{ disabled?: boolean }>`
  width: 30px;
  height: 100%;
  background-color: transparent;
  position: fixed;
  z-index: 1300;

  right: 0;
  transition: all 0.5s;
  cursor: pointer;
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
