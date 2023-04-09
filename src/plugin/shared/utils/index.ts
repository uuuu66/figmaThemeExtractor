import { ExtractResultMessageType } from "../../../shared/interfaces";
import { rgbToHex } from "../../../shared/utils";
const splitValues = [" ", ",", ".", "/", "\n"];
export interface GetTargetArgs {
  nodeId: string;
  returnValue: (SliceNode | SceneNode | Node | any)[];
  target: NodeType;
}
export const getTarget = (
  args: GetTargetArgs
): (SliceNode | SceneNode | Node | TextNode)[] => {
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

const sortByX = (a: string, b: string) => {
  const aNode = figma.getNodeById(a) as TextNode;
  const bNode = figma.getNodeById(b) as TextNode;
  const aX = aNode.absoluteBoundingBox.x;
  const bX = bNode.absoluteBoundingBox.x;
  return aX - bX;
};
export interface GroupByTextNodesArgs {
  targetNodes: TextNode[];

  standard?: "x" | "y" | "parent" | "X" | "Y" | "PARENT";
}
export const groupByTextNodes = (args: GroupByTextNodesArgs) => {
  const { targetNodes, standard = "parent" } = args;

  const textMapByStandard = new Map();
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
      const newNowValue = [...nowValue].sort(sortByX);

      newNowValue.push(targetNode.id);
      textMapByStandard.set(nowStandard, newNowValue);
    } else {
      textMapByStandard.set(nowStandard, [targetNode.id]);
    }
  }

  const returnValue = [Array.from(textMapByStandard.values())];

  return returnValue[0];
};
export interface GroupByRectanglesArgs {
  targetNodes: RectangleNode[];
}
const groupByRectangles = (args: GroupByRectanglesArgs) => {
  const { targetNodes } = args;
  const returnValue = [];
  for (const rectangle of targetNodes) {
    let parentNode = figma.getNodeById(rectangle.parent.id);
    while (true) {
      if (parentNode.type === "FRAME") break;
      parentNode = figma.getNodeById(parentNode.parent.id);
    }
    let texts = [];
    getTarget({ target: "TEXT", nodeId: parentNode.id, returnValue: texts });
    let pushArray = [];

    for (let i = 0; i < texts.length; i += 1) {
      const splittedText = texts[i].characters.split("\n");
      if (splittedText.length > 1) {
        for (let j = 0; j < splittedText.length; j += 1) {
          pushArray.push(splittedText[j]);
        }
      } else pushArray.push(splittedText[0]);
    }

    returnValue.push(pushArray);
  }

  return returnValue;
};
export const extractColorTheme = (
  selectedId: string,
  keys?: string[]
): ExtractResultMessageType => {
  const texts: TextNode[] = [];
  getTarget({
    nodeId: selectedId,
    returnValue: texts,
    target: "TEXT",
  });
  const rectangles: RectangleNode[] = [];
  getTarget({
    nodeId: selectedId,
    returnValue: rectangles,
    target: "RECTANGLE",
  });

  const answer = {};
  addPropertyToAnswer(answer, rectangles, keys || ["Hex", "Name"]);
  return { answer };
};

const addPropertyToAnswer = (
  answer: Object,
  rectangles: RectangleNode[],
  keys: string[]
) => {
  const textGroup = groupByRectangles({ targetNodes: rectangles });

  for (let i = 0; i < textGroup.length; i += 1) {
    for (let j = 0; j < textGroup[i].length; j += 1) {
      let text = textGroup[i][j] as string;
      if (!keys.includes(text)) {
        if (!text.startsWith("#")) {
          for (const splitValue of splitValues) {
            text = text.split(splitValue).join("");
          }
          let key = text;
          let firstChar = key.charAt(0);
          let others = key.slice(1);
          key = firstChar.toLowerCase() + others;
          key = key.replace("-", "");
          answer[key] = textGroup[i][textGroup[i].length - 1];
        }
      }
    }
  }
  return answer;
};
export const extractFontTheme = (
  selectedId: string,
  keys?: string[]
): ExtractResultMessageType => {
  let texts = [];
  getTarget({ target: "TEXT", returnValue: texts, nodeId: selectedId });
  const groups = groupByTextNodes({ targetNodes: texts, standard: "parent" });
  let textNodeGroups: TextNode[][] = [];
  for (let i = 0; i < groups.length; i += 1) {
    textNodeGroups[i] = groups[i]
      .sort(sortByX)
      .map((val) => figma.getNodeById(val) as TextNode);
  }
  const fontWeight = {};
  const answer = {};
  for (let i = 0; i < textNodeGroups.length; i += 1) {
    if (keys.includes(textNodeGroups[i][0].characters)) {
      continue;
    }
    if (textNodeGroups[i].length !== 4) {
      continue;
    }
    const firstNode = textNodeGroups[i][0];
    let key = firstNode.characters;
    let fontWeightKey = textNodeGroups[i][1].characters;

    for (const splitValue of splitValues) {
      key = key.split(splitValue).join("");
      fontWeightKey = fontWeightKey.split(splitValue).join("");
    }
    let firstChar = key.charAt(0);
    let others = key.slice(1);
    key = firstChar.toLowerCase() + others;
    key = key.replace(/-/, "");
    let firstCharFontWeight = fontWeightKey.charAt(0);
    let othersFontweight = fontWeightKey.slice(1);
    fontWeightKey = firstCharFontWeight.toLowerCase() + othersFontweight;
    fontWeightKey = fontWeightKey.replace(/-/, "_");
    const properties = {};
    properties["font-size"] = (firstNode.fontSize as number) + "px";
    fontWeight[fontWeightKey] = firstNode.fontWeight;
    properties["font-weight"] = `fontWeight.${fontWeightKey}`;
    properties["line-height"] = textNodeGroups[i][3].characters;
    answer[key] = properties;
  }
  return { fontWeight, answer };
};
