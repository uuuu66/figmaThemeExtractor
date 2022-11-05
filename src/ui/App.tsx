import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PAGE_WIDTH, TYPE_RECTANGLE, TYPE_TEXT } from "../shared/constants";
import { MessageType, SelectOptions } from "../shared/interfaces";
import { Types } from "../shared/msgTypes";
import { nodeTypeSelectOptions } from "../shared/options";
import { postWindowMessage } from "../shared/utils";
import Button from "./components/Button";
import Select from "./components/Select";
import {
  FlexDiv,
  GlobalStyles,
  LoadingWrapper,
  LeftNavigation,
  RightNavigation,
  Pages,
  TitleWrapper,
  MainContainer,
} from "./styles";
import KongGif from "../assets/f2.gif";

const App: React.FC = () => {
  const [type, setType] = useState<NodeType>();
  const handleClickButton = () => {
    const exMsg: MessageType<{}> = {
      type: Types.EX,
    };
    postWindowMessage(exMsg);
  };
  const navLeft = () => {
    window.scrollBy({ left: -PAGE_WIDTH, behavior: "smooth" });
  };
  const navRight = () => {
    window.scrollBy({ left: PAGE_WIDTH, behavior: "smooth" });
  };
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener("message", (e) => {
      console.log(e);
    });
  }, []);
  return (
    <>
      <GlobalStyles />

      <MainContainer>
        <LeftNavigation onClick={navLeft}></LeftNavigation>
        <Pages>
          <TitleWrapper>Mango's theme extractor</TitleWrapper>
        </Pages>
        <Pages>
          <Select
            options={nodeTypeSelectOptions}
            value={type}
            onSelect={(e) => {
              setType(e.value);
            }}
          />
        </Pages>
        <Pages>hi</Pages>
        <RightNavigation onClick={navRight}> </RightNavigation>
      </MainContainer>
    </>
  );
};

export default App;
