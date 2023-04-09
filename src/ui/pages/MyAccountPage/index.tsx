import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import { PageContainer } from "../../shared/styles";
import SunFlower from "../../../assets/SunFlower.png";
interface Props {}

const MyAccountPage: FunctionComponent<Props> = function MyAccountPage({
  children,
}) {
  return (
    <PageContainer>
      <Container>
        토스은행 이민기
        <br />
        <Img src={SunFlower} alt="해바라기" />
        <Button
          onClick={() => {
            window.open(
              "https://toss.me/%EB%A7%9D%EA%B3%A0%EB%A7%9D%EA%B3%A0%EC%8A%A4%ED%83%80"
            );
          }}
        >
          알아보기
        </Button>
      </Container>
    </PageContainer>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;
const Img = styled.img`
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: rotation 4s infinite;
`;
export default MyAccountPage;
