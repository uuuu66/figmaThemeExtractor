import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { PAGE_WIDTH } from "../shared/constants";

import {
  GlobalStyles,
  LoadingWrapper,
  LeftNavigation,
  RightNavigation,
  MainContainer,
} from "./shared/styles";
import { useCallback } from "react";
import EasterEggPage from "./pages/EasterEggPage";
import { ThemeType } from "../shared/types";
import MainPage from "./pages/MainPage";
import { MessageType, SelectOptions } from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import { postWindowMessageToPlugin } from "../shared/utils";
import CheckPage from "./pages/CheckPage";
import useInterval from "./shared/hooks/useInterval";
import ResultPage from "./pages/ResultPage";

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);
  const [isSelect, setIsSelect] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>("COLOR");
  const [result, setResult] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [ignores, setIgnores] = useState<string>("Hex,Name");
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
        ignores: ignores.split(",").map((val) => val.trim()),
      },
    };
    console.log(msg);
    postWindowMessageToPlugin(msg);
  };
  const requestCheckSelectFrame = () => {
    const msg: MessageType = {
      type: MsgTypes.CHECK_SELECT,
      value: ignores.split(",").map((val) => val.trim()),
    };
    postWindowMessageToPlugin(msg);
  };
  const navRight = () => {
    setDisabled(true);
    if (stage + 1 < 4) {
      window.scrollTo({
        left: (stage + 1) * PAGE_WIDTH + 20,
        behavior: "smooth",
      });
      setStage(stage + 1);
    }
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
      case 3:
        return false;
      case 4:
        return false;
      case 5:
        return false;
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
  const handleChangeIgnores = (e: ChangeEvent<HTMLInputElement>) => {
    setIgnores(e.target.value);
  };
  const handleOnMessage = (e: MessageEvent) => {
    if (e.data.pluginMessage.type === MsgTypes.CHECK_SELECT)
      setIsSelect(e.data.pluginMessage.value);
    if (e.data.pluginMessage.type === MsgTypes.EXTRACT) {
      if (e.data.pluginMessage.value === false) navToStage(2);
      else setResult("color = " + JSON.stringify(e.data.pluginMessage.value));
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
    if (theme === "COLOR") setIgnores("Hex,Name");
    else setIgnores("Font weight,Bold,Medium,Regular,Name,Display");
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
          handleChangeIgnores={handleChangeIgnores}
          ignores={ignores}
          theme={theme}
          isSelect={isSelect}
          setIsSelect={setIsSelect}
        ></CheckPage>
        <ResultPage result={result} />
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
