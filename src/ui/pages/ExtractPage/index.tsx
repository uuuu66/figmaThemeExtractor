import React, { FunctionComponent, useEffect } from "react";
import { MessageType } from "../../../shared/interfaces";
import { MsgTypes } from "../../../shared/msgTypes";
import { PageContainer } from "../../shared/styles";

interface Props {}

const ExtractPage: FunctionComponent<Props> = function ExtractPage({
  children,
}) {
  const requestCheckSelectFrame = () => {
    const msg: MessageType = {
      type: MsgTypes.CHECK_SELECT,
    };
  };

  useEffect(() => {
    requestCheckSelectFrame();
  }, []);
  return <PageContainer></PageContainer>;
};

export default ExtractPage;
