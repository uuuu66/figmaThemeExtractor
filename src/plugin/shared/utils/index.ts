import { rgbToHex } from "../../../shared/utils";

export interface GetTargetArgs {
  nodeId: string;
  returnValue: (SliceNode | SceneNode | Node)[];
  target: NodeType;
}
export const getTarget = (
  args: GetTargetArgs
): (SliceNode | SceneNode | Node)[] => {
  const { nodeId, returnValue, target } = args;
  const frameNode = figma.getNodeById(nodeId) as FrameNode;

  for (let i = 0; i < frameNode.children?.length; i += 1) {
    const nowChild = frameNode.children[i];
    switch (nowChild.type) {
      case target:
        returnValue.push(nowChild);
        break;
      case "INSTANCE":
      case "COMPONENT_SET":
      case "COMPONENT":
      case "FRAME":
      case "GROUP":
        getTarget({
          nodeId: nowChild.id,
          returnValue,
          target,
        });

      default:
        break;
    }
  }
  return returnValue;
};
export interface GetRectangleStylesArgs {
  targetRectangle: RectangleNode;
}
export const getRectangleColor = (args: GetRectangleStylesArgs): string => {
  const { targetRectangle } = args;

  const fills = targetRectangle.fills as SolidPaint[];
  return rgbToHex(fills[0]?.color);
};
export interface GroupByTextNodesArgs {
  targetNodes: TextNode[];
  isLastNodeKey?: boolean;
  standard?: "x" | "y" | "parent" | "X" | "Y" | "PARENT";
}
export const groupByTextNodes = (args: GroupByTextNodesArgs) => {
  const { targetNodes, isLastNodeKey, standard = "parent" } = args;

  const textMapByStandard = new Map<string, string[]>();
  for (const targetNode of targetNodes) {
    let nowStandard: string = standard;
    switch (standard) {
      case "x":
      case "X":
        nowStandard = targetNode.absoluteBoundingBox.x.toString();
        break;
      case "y":
      case "Y":
        nowStandard = targetNode.absoluteBoundingBox.y.toString();
        break;
      case "PARENT":
      case "parent":
      default:
        nowStandard = targetNode.parent.id;
        break;
    }
    const nowValue = textMapByStandard.get(nowStandard);
    if (textMapByStandard.has(nowStandard)) {
      const newNowValue = [...nowValue];
      newNowValue.push(targetNode.name);
      textMapByStandard.set(nowStandard, newNowValue);
    } else {
      textMapByStandard.set(nowStandard, [targetNode.name]);
    }
  }

  const returnValue = [Array.from(textMapByStandard.values())];
  if (isLastNodeKey) return returnValue.map((val) => val.reverse());
  return returnValue;
};
