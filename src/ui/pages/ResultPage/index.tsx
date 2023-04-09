import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { MsgTypes } from "../../../shared/msgTypes";
import Button from "../../components/Button";
import { PageContainer } from "../../shared/styles";

interface Props {
  result: string;
}

const ResultPage: FunctionComponent<Props> = function ResultPage({ result }) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleClickButton = () => {
    textAreaRef.current.select();
  };
  useEffect(() => {
    textAreaRef.current.select();
  }, [result]);
  return (
    <PageContainer>
      <Container>
        <Desc>복사하셈</Desc>
        <Button onClick={handleClickButton}>전체 선택</Button>
        <TextArea ref={textAreaRef} value={result} readOnly />
      </Container>
    </PageContainer>
  );
};
const Desc = styled.div`
  font-weight: 300;
  max-width: 400px;
`;
const Wrapper = styled.div``;
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
const TextArea = styled.textarea`
  width: 400px;
  height: 200px;
`;
export default ResultPage;
