import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { MessageType } from "../../../shared/interfaces";
import { MsgTypes } from "../../../shared/msgTypes";
import { ThemeType } from "../../../shared/types";
import { PageContainer } from "../../shared/styles";
import { getCheckDescription, translateThemeType } from "../../shared/utils";

interface Props {
  isSelect: boolean;
  theme: ThemeType;
  ignores: string;
  onGoNextStep: () => void;
  handleChangeIgnores: React.ChangeEventHandler;
  setIsSelect: (e: boolean) => void;
}

const CheckPage: FunctionComponent<Props> = function CheckPage({
  isSelect,
  ignores,
  theme,
  onGoNextStep,
  setIsSelect,
  handleChangeIgnores,
}) {
  return (
    <PageContainer>
      <Container>
        <Wrapper>
          <Title>추출할 프레임이 선택되었는가..?</Title>{" "}
          <div>{isSelect ? "ok" : "no"}</div>
        </Wrapper>
        <Wrapper>
          <Title>선택된 테마 </Title>
          <div>{translateThemeType(theme)}</div>
        </Wrapper>
        <Wrapper>
          <Title>무시할 글자</Title>
          <Desc>(,)로 구분함</Desc>
          <input value={ignores} onChange={handleChangeIgnores} />
        </Wrapper>
        <Wrapper style={{ marginTop: "24px" }}>
          <Desc>{getCheckDescription(theme)}</Desc>
        </Wrapper>
        {isSelect && <Arrow onClick={onGoNextStep}>{`-->`}</Arrow>}
      </Container>
    </PageContainer>
  );
};
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
  position: absolute;
  right: 56px;
  bottom: 24px;
  font-size: 36px;
  font-weight: 900;
  animation-name: move;
  animation-duration: 1s;
  animation-iteration-count: infinite;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  position: relative;
  padding: 12px;
`;
const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
`;
const Title = styled.div`
  font-weight: 700;
  flex: 1 0 30%;
  &::after {
    content: "?";
  }
  display: flex;
`;
const Desc = styled.div`
  font-weight: 300;
  max-width: 400px;
`;

export default CheckPage;
