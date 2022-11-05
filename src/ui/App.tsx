import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import strings from "../assets/strings.json";

import { ENG, KOR, LANGUAGE, PAGE_WIDTH } from "../shared/constants";
import {
  LanguageMessageType,
  MessageType,
  SelectOptions,
} from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import getOptions from "./shared/options";
import { postWindowMessageToPlugin } from "../shared/utils";
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
  EasterEggPage,
} from "./shared/styles";
import KongGif from "../assets/f2.gif";
import SunFlower from "../assets/SunFlower.png";

const App: React.FC = () => {
  const [type, setType] = useState<NodeType>();
  const [stage, setStage] = useState<number>(1);
  const [options, setOptions] = useState(getOptions(ENG));
  const [language, setLanguage] = useState("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const navLeft = () => {
    setDisabled(true);
    if (stage - 1 >= 0) {
      window.scrollTo({ left: (stage - 1) * PAGE_WIDTH, behavior: "smooth" });
      setStage(stage - 1);
    }
  };
  const navRight = () => {
    setDisabled(true);
    if (stage + 1 < 4) {
      window.scrollTo({ left: (stage + 1) * PAGE_WIDTH, behavior: "smooth" });
      setStage(stage + 1);
    }
  };
  const handleChangeLanguage = (e: SelectOptions<string>) => {
    const msg: MessageType<LanguageMessageType> = {
      type: MsgTypes.LANGUAGE_EDIT,
      value: { country: e.value },
    };
    postWindowMessageToPlugin(msg);
  };
  useEffect(() => {
    window.addEventListener("message", (e) => {
      const msgData = e.data.pluginMessage as MessageType;
      const { type, value } = msgData;
      switch (type) {
        case MsgTypes.LANGUAGE_INFO:
          const thisValue = value as LanguageMessageType;
          setLanguage(thisValue.country);
          setOptions(getOptions(thisValue.country));
          break;
        default:
          break;
      }
    });
    window.scrollBy(600, 0);
  }, []);

  useEffect(() => {
    if (disabled)
      setTimeout(() => {
        setDisabled(false);
      }, 600);
  }, [disabled]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading && <LoadingWrapper></LoadingWrapper>}
      <MainContainer>
        <LeftNavigation
          disabled={disabled}
          onClick={!disabled ? navLeft : undefined}
        ></LeftNavigation>
        <EasterEggPage>
          <img src={KongGif} width={60} height={60} />
          made by Mango
        </EasterEggPage>
        <Pages>
          <TitleWrapper>{strings[language || KOR]?.TITLE}</TitleWrapper>

          <Select
            options={options?.languaseSelectOptions || []}
            value={language}
            placeholder="language"
            onSelect={handleChangeLanguage}
          />
        </Pages>
        <Pages>
          <Select
            options={options?.nodeTypeSelectOptions || []}
            value={type}
            onSelect={(e) => {
              setType(e.value);
            }}
          />
        </Pages>
        <Pages>hi</Pages>
        <RightNavigation
          disabled={disabled}
          onClick={!disabled ? navRight : undefined}
        >
          {" "}
        </RightNavigation>
      </MainContainer>
    </>
  );
};

export default App;
