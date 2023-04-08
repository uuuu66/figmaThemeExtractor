import { MessageType } from "../shared/interfaces";
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
          const type: ThemeType = msg.value.type;
          const selectedId = figma.currentPage.selection[0]?.id;
          let answer = {};
          if (type === "COLOR") {
            answer = extractColorTheme(selectedId, msg.value.ignores);
          } else {
            extractFontTheme(selectedId, msg.value.ignores);
          }
          const extractedMessage: MessageType = {
            type: MsgTypes.EXTRACT,
            value: answer,
          };
          figma.ui.postMessage(extractedMessage);
        }
      }
      break;
  }
};
