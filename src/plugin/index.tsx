import { MessageType } from "../shared/interfaces";
import { Types } from "../shared/msgTypes";
import { getTarget, groupByTextNodes } from "../shared/utils";

figma.showUI(__html__, { width: 600, height: 300 });

figma.ui.onmessage = (msg: MessageType<any>) => {
  if (msg.type === Types.EX) {
    const selectedId = figma.currentPage.selection[0]?.id;
    const rectangles: RectangleNode[] = [];
    const text: TextNode[] = [];
    getTarget({ nodeId: selectedId, returnValue: text, target: "TEXT" });
    console.log(groupByTextNodes({ targetNodes: text, standard: "X" }), text);
  }
};
