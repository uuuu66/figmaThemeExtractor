import React from "react";

import { FunctionComponent } from "react";
import styled from "styled-components";
import { SelectOptions } from "../../../shared/interfaces";
import { ThemeType } from "../../../shared/types";
import Select from "../../components/Select";
import { themeTypeSelectOptions } from "../../shared/options";
import { PageContainer } from "../../shared/styles";
import { getThemeDescription, translateThemeType } from "../../shared/utils";

interface Props {
  selectedType: ThemeType;
  onSelectType: (e: SelectOptions<ThemeType>) => void;
  onGoNextStep: () => void;
}

const MainPage: FunctionComponent<Props> = function MainPage({
  onSelectType,
  onGoNextStep,
  selectedType,

  children,
}) {
  return (
    <PageContainer>
      <Container>
        <Title>추출할 테마 타입을 고르세요</Title>
        <Wrapper style={{ gap: "200px" }}>
          <Select
            value={selectedType}
            options={themeTypeSelectOptions}
            onSelect={onSelectType}
          />
          <div>
            <Title>선택된 테마 타입 </Title>
            <Title>
              <Wrapper style={{ gap: "64px" }}>
                {translateThemeType(selectedType)}{" "}
                <Arrow onClick={onGoNextStep}>{`-->`}</Arrow>
              </Wrapper>
            </Title>
          </div>
        </Wrapper>
        <Description>{getThemeDescription(selectedType)}</Description>
      </Container>
    </PageContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36px;
`;
const Wrapper = styled.div`
  display: flex;
`;
const Title = styled.h1`
  font-weight: 800;
`;
const Arrow = styled.div`
  cursor: pointer;
  @keyframes move {
    to {
      transform: translateX(20px);
    }
    from {
      transform: translateX(0px);
    }
  }
  animation-name: move;
  animation-duration: 1s;
  animation-iteration-count: infinite;
`;
const Description = styled.div`
  font-weight: 300;
  font-size: 12px;
`;
export default MainPage;
