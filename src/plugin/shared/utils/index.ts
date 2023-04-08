import { rgbToHex } from "../../../shared/utils";
const splitValues = [" ", ",", ".", "/", "\n"];
export interface GetTargetArgs {
  nodeId: string;
  returnValue: (SliceNode | SceneNode | Node)[];
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
      const newNowValue = [...nowValue];

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
export const extractColorTheme = (selectedId: string, ignores?: string[]) => {
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
  addPropertyToAnswer(answer, rectangles, ignores || ["Hex", "Name"]);
  return answer;
};

const addPropertyToAnswer = (
  answer: Object,
  rectangles: RectangleNode[],
  ignores: string[]
) => {
  const textGroup = groupByRectangles({ targetNodes: rectangles });

  for (let i = 0; i < textGroup.length; i += 1) {
    let key = "";
    for (let j = 0; j < textGroup[i].length; j += 1) {
      let text = textGroup[i][j] as string;
      if (!ignores.includes(text)) {
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
export const extractFontTheme = (selectedId: string, ignores?: string[]) => {
  let texts = [];
  getTarget({ target: "TEXT", returnValue: texts, nodeId: selectedId });
  texts = groupByTextNodes({ targetNodes: texts, standard: "parent" });
  const answer = {};
  console.log(
    texts.map((val) =>
      val.map((text) => (figma.getNodeById(text) as TextNode).characters)
    )
  );
  for (let row of texts) {
    row = row.sort((a, b) => {
      const bCode = (figma.getNodeById(b) as TextNode).characters.charCodeAt(0);
      const aCode = (figma.getNodeById(a) as TextNode).characters.charCodeAt(0);
      if (bCode >= 65 && aCode >= 65) return 0;

      if (bCode >= 65 && aCode < 65) return bCode - aCode;
      return 0;
    });
    console.log(
      row.map((text) => (figma.getNodeById(text) as TextNode).characters)
    );
    if (row.length === 4) {
      const node = figma.getNodeById(row[0]) as TextNode;
      let key = node.characters;
      for (let i = 0; i < splitValues.length; i += 1) {
        key = key.split(splitValues[i]).join("");
      }
      key = key.replace(/-/, "");
      key = key.replace(/_/, "");
      key = key.trim();
      const properties = {
        "font-size": "24px",
        "font-weight": 700,
        "line-height": "24px",
      };

      properties["font-size"] = (node.fontSize as number) + "px";
      properties["font-weight"] = node.fontWeight as number;
      properties["line-height"] = (
        figma.getNodeById(row[3]) as TextNode
      ).characters.trim();
      if (!ignores.includes(key)) answer[key] = properties;
    }
  }
  console.log(answer);
  return answer;
};
