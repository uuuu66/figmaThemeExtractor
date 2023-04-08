import { MessageType } from "../shared/interfaces";
import { MsgTypes } from "../shared/msgTypes";
import { getTarget, groupByTextNodes } from "./shared/utils";

figma.showUI(__html__, { width: 600, height: 300 });

figma.ui.onmessage = (msg: MessageType<any>) => {
  switch (msg.type) {
    case MsgTypes.SELECT_TYPE:
      const selectedId = figma.currentPage.selection[0]?.id;
      const text: TextNode[] = [];
      getTarget({
        nodeId: selectedId,
        returnValue: text,
        target: "TEXT",
      });
      console.log(groupByTextNodes({ targetNodes: text, standard: "x" }));

    case MsgTypes.CHECK_SELECT:
      const isSelect = figma.currentPage.selection.length > 0;
      const msg: MessageType = { type: MsgTypes.CHECK_SELECT, value: isSelect };
      figma.ui.postMessage(msg);
  }
};
