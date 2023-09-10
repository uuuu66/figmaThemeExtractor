import {
  ExtractResultMessageType,
  FontProperties,
  MessageType,
} from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import { ThemeType } from "../shared/types";
import { extractColorTheme, extractFontTheme, getTarget } from "./shared/utils";

figma.showUI(__html__, { width: 600, height: 300 });

figma.ui.onmessage = (msg: MessageType<any>) => {
  switch (msg.type) {
    case MsgTypes.SELECT_TYPE:
      {
        const selectedId = figma.currentPage.selection[0]?.id;
        const text: TextNode[] = [];
        getTarget({
          nodeId: selectedId,
          returnValue: text,
          target: "TEXT",
        });
      }
      break;
    case MsgTypes.CHECK_SELECT:
      {
        const isSelect = figma.currentPage.selection.length > 0;
        const postmsg: MessageType = {
          type: MsgTypes.CHECK_SELECT,
          value: isSelect,
        };
        figma.ui.postMessage(postmsg);
      }
      break;
    case MsgTypes.EXTRACT:
      {
        const isSelect = figma.currentPage.selection.length > 0;
        if (!isSelect) {
          const postmsg: MessageType = {
            type: MsgTypes.EXTRACT,
            value: false,
          };
          figma.ui.postMessage(postmsg);
        } else {
         /* msg.value types:텍스트인지 색상인지  keys: 추출할 문자 기준 혹은 무시할 문자  */
          const type: ThemeType = msg.value.type;
          const selectedId = figma.currentPage.selection[0]?.id;
          let answer: { [index: string]: string | FontProperties } = {};
          let fontWeight: { [index: string]: number } = {};
          console.log(msg.value.keys)
          if (type === "COLOR") {
            answer = extractColorTheme(selectedId, msg.value.keys).answer;
          } else {
            const result = extractFontTheme(selectedId, msg.value.keys[0]);
            answer = result.answer;
            fontWeight = result.fontWeight;
          }
      
          const extractedMessage: MessageType<ExtractResultMessageType> = {
            type: MsgTypes.EXTRACT,
            value:
              type === "COLOR"
                ? { answer, themeType: type }
                : { answer, themeType: type ,fontWeight},
          };
          figma.ui.postMessage(extractedMessage);
        }
      }
      break;
  }
};
