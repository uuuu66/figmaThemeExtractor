import { MessageType } from "../shared/interfaces";
import { Types } from "../shared/msgTypes";

figma.showUI(__html__);

figma.ui.onmessage = (msg: MessageType<any>) => {
  if (msg.type === Types.EX) {
    console.log(figma.currentPage.findAll());
    const square = figma.createRectangle();
    figma.currentPage.appendChild(square);
  }
};
