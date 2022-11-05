import { LANGUAGE } from "../constants";
import { MessageType } from "../interfaces";
import { MsgTypes } from "../msgTypes";

export const postWindowMessageToPlugin = (msg: MessageType<any>) => {
  parent.postMessage({ pluginMessage: msg }, "*");
};
export const postCloseMessage = () => {
  const closeMessage: MessageType = {
    type: MsgTypes.CLOSE_UI,
  };
  postWindowMessageToPlugin(closeMessage);
};

export const rgbToHex = (args: RGB) => {
  const { r, g, b } = args;

  return (
    "#" +
    [
      Number((r * 255).toFixed()),
      Number((g * 255).toFixed()),
      Number((b * 255).toFixed()),
    ]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};
