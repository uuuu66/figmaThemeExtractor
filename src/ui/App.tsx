import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { PAGE_WIDTH } from "../shared/constants";

import {
  GlobalStyles,
  LoadingWrapper,
  LeftNavigation,
  RightNavigation,
  MainContainer,
  PageContainer,
  AccountNumberContainer,
} from "./shared/styles";
import { useCallback } from "react";
import EasterEggPage from "./pages/EasterEggPage";
import { ThemeType } from "../shared/types";
import MainPage from "./pages/MainPage";
import {
  ExtractResultMessageType,
  FontProperties,
  MessageType,
  SelectOptions,
} from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import { postWindowMessageToPlugin } from "../shared/utils";
import CheckPage from "./pages/CheckPage";
import useInterval from "./shared/hooks/useInterval";
import ResultPage from "./pages/ResultPage";
import MyAccountPage from "./pages/MyAccountPage";

const App: React.FC = () => {
  const myAccount = "100046614549";
  const [stage, setStage] = useState<number>(1);
  const [isSelect, setIsSelect] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>("COLOR");
  const [result, setResult] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [keys, setKeys] = useState<string>("Hex,Name");
  const navLeft = () => {
    setDisabled(true);
    if (stage - 1 >= 0) {
      window.scrollTo({
        left: (stage - 1) * PAGE_WIDTH + 20,
        behavior: "smooth",
      });
      setStage(stage - 1);
    }
  };
  const requestExtractTheme = () => {
    const msg: MessageType = {
      type: MsgTypes.EXTRACT,
      value: {
        type: theme,
        keys: keys.split(",").map((val) => val.trim()),
      },
    };
    console.log(msg);
    postWindowMessageToPlugin(msg);
  };
  const requestCheckSelectFrame = () => {
    const msg: MessageType = {
      type: MsgTypes.CHECK_SELECT,
      value: keys.split(",").map((val) => val.trim()),
    };
    postWindowMessageToPlugin(msg);
  };
  const navRight = () => {
    setDisabled(true);
    if (getNextStageIsReady())
      window.scrollTo({
        left: (stage + 1) * PAGE_WIDTH + 20,
        behavior: "smooth",
      });
    setStage(stage + 1);
  };
  const handleClickNextButton = () => {
    if (stage === 1) requestCheckSelectFrame();
    if (stage === 2) requestExtractTheme();
    navRight();
  };
  const getNextStageIsReady = useCallback(() => {
    switch (stage) {
      case 0:
        return true;
      case 1:
        if (isLoading) return false;
        return true;
      case 2:
        if (isSelect) return true;
        return false;
      case 3 + myAccount.length + 1:
        return false;
      default:
        return true;
    }
  }, [stage, isLoading, disabled, isSelect]);
  const navToStage = (stage: number) => {
    window.scrollTo({
      left: (stage - 1) * PAGE_WIDTH + 20,
      behavior: "smooth",
    });
    setStage(stage);
  };
  const handleSelectThemeType = (e: SelectOptions<ThemeType>) => {
    setTheme(e.value);
  };
  const handleChangekeys = (e: ChangeEvent<HTMLInputElement>) => {
    setKeys(e.target.value);
  };
  const handleSelectCssType=(e:string)=>{
    setKeys(e);
  }
  const handleOnMessage = (e: MessageEvent) => {
    if (e.data.pluginMessage.type === MsgTypes.CHECK_SELECT)
      setIsSelect(e.data.pluginMessage.value);
    if (e.data.pluginMessage.type === MsgTypes.EXTRACT) {
      const messageData = e.data.pluginMessage
        .value as ExtractResultMessageType;

      if (!messageData) navToStage(2);
      else if (messageData.themeType === "COLOR")
        setResult("const color = " + JSON.stringify(messageData.answer));
      else if (messageData.themeType === "TEXT") {
        if(messageData.fontWeight)
        setResult(`const fontSizeTheme =${JSON.stringify(messageData.answer)} \n const fontWeightTheme=${JSON.stringify(messageData.fontWeight)}`)
        else
        setResult(
          JSON.stringify(messageData.answer)
        );
      }
    }
  };
  useEffect(() => {
    window.addEventListener("message", handleOnMessage);

    return () => window.removeEventListener("message", handleOnMessage);
  }, []);
  useEffect(() => {
    window.scrollBy(PAGE_WIDTH + 20, 0);
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
  useEffect(() => {
    if (theme === "COLOR") setKeys("Hex,Name");
    else setKeys("TAILWIND");
  }, [theme]);
  useInterval(() => {
    requestCheckSelectFrame();
  }, 1000);
  return (
    <>
      <GlobalStyles />
      {isLoading && <LoadingWrapper></LoadingWrapper>}

      <MainContainer>
        <LeftNavigation
          disabled={disabled || stage === 0}
          onClick={!disabled ? navLeft : undefined}
        ></LeftNavigation>
        <EasterEggPage />
        <MainPage
          onGoNextStep={handleClickNextButton}
          selectedType={theme}
          onSelectType={handleSelectThemeType}
        />
        <CheckPage
          onGoNextStep={handleClickNextButton}
          handleChangekeys={handleChangekeys}
          handleSelectCssType={handleSelectCssType}
          keys={keys}
          theme={theme}
          isSelect={isSelect}
          setIsSelect={setIsSelect}
        ></CheckPage>
        <ResultPage result={result} />
        {myAccount.split("").map((val, index) => (
          <PageContainer key={"a" + index}>
            {index === 0 && <div>받아적으삼</div>}
            <AccountNumberContainer>{val}</AccountNumberContainer>
          </PageContainer>
        ))}
        <MyAccountPage />
        <RightNavigation
          disabled={disabled || !getNextStageIsReady()}
          isReady={getNextStageIsReady()}
          onClick={
            !disabled && getNextStageIsReady()
              ? handleClickNextButton
              : undefined
          }
        ></RightNavigation>
      </MainContainer>
    </>
  );
};

export default App;
