import { LANGUAGE } from "../shared/constants";
import { LanguageMessageType, MessageType } from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import { getTarget, groupByTextNodes } from "./shared/utils";

figma.showUI(__html__, { width: 600, height: 300 });
figma.clientStorage.getAsync(LANGUAGE).then((value) => {
  const languageMessage: MessageType<LanguageMessageType> = {
    type: MsgTypes.LANGUAGE_INFO,
    value: { country: value || "KOR" },
  };
  figma.ui.postMessage(languageMessage);
});
figma.ui.onmessage = (msg: MessageType<any>) => {
  if (msg.type === MsgTypes.SELECT_TYPE) {
    const selectedId = figma.currentPage.selection[0]?.id;
    const rectangles: RectangleNode[] = [];
    const text: TextNode[] = [];
    getTarget({ nodeId: selectedId, returnValue: text, target: "TEXT" });
  }
  if (msg.type === MsgTypes.LANGUAGE_EDIT) {
    figma.clientStorage.setAsync(LANGUAGE, msg.value.country).then(() => {
      figma.clientStorage.getAsync(LANGUAGE).then((value) => {
        const languageMessage: MessageType<LanguageMessageType> = {
          type: MsgTypes.LANGUAGE_INFO,
          value: { country: value || "KOR" },
        };
        figma.ui.postMessage(languageMessage);
      });
    });
  }
};
