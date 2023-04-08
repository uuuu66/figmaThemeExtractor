import React, { useEffect, useMemo, useState } from "react";

import { ENG, KOR, PAGE_WIDTH } from "../shared/constants";

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

const App: React.FC = () => {
  const [stage, setStage] = useState<number>(1);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>("COLOR");
  const [isLoading, setLoading] = useState<boolean>(true);
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
        return false;
      case 3:
        return false;
      case 4:
        return false;
      case 5:
        return false;
    }
  }, [stage, isLoading, disabled]);
  const handleSelectThemeType = (e: SelectOptions<ThemeType>) => {
    setTheme(e.value);
  };
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
        <RightNavigation
          disabled={disabled || !getNextStageIsReady()}
          isReady={getNextStageIsReady()}
          onClick={!disabled && getNextStageIsReady() ? navRight : undefined}
        ></RightNavigation>
      </MainContainer>
    </>
  );
};

export default App;
