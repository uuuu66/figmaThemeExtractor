import React from "react";
import { EasterEggPageContainer } from "../../shared/styles";
import KongGif from "../../../assets/f2.gif";

const EasterEggPage: React.FC = () => {
  return (
    <EasterEggPageContainer>
      <img src={KongGif} width={60} height={60} />
      made by Mango
    </EasterEggPageContainer>
  );
};
export default EasterEggPage;
