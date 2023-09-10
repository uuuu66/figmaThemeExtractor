import { css } from "styled-components";
import { ExtractResultMessageType } from "../../../shared/interfaces";
import { CSSLibraryType } from "../../../shared/types";
import { rgbToHex } from "../../../shared/utils";
const splitValues = [" ", ",", ".", "/", "\n"];
const TEXT_STANDARD="parent";

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
  cssType?:CSSLibraryType, //무시할 글자들

): ExtractResultMessageType => {
  switch(cssType){
    case "TAILWIND":
      return extractTailwindTextTheme(selectedId,[]);
    case "STYLED_COMPONENT":
      default:
        return extractStyledComponentTextTheme(selectedId,[])
      }
  
};
const extractTailwindTextTheme=( selectedId: string,
  ignoreStrings?: string[])=>{
    let texts = [];
    getTarget({ target: "TEXT", returnValue: texts, nodeId: selectedId });
    //텍스트노드인 애들 추출 
    const textNodeIds= groupByTextNodes({ targetNodes: texts, standard: TEXT_STANDARD });
 
    let textNodes: TextNode[][] = [];

    for (let i = 0; i < textNodeIds.length; i += 1) {
      textNodes[i] = textNodeIds[i]
        .sort(sortByX)
        .map((val) => figma.getNodeById(val) as TextNode);
      
    }

    const answer = {};
    const fontWeight={}
    const nodes={};
    //같은 조부모로 묶기 
      for (let i = 0; i < textNodes.length; i += 1) {
        if (ignoreStrings.includes(textNodes[i][0].characters)) {
          //
          continue;
        }
        const nowTextNode=textNodes[i][0];
      
        if(!nodes[nowTextNode.parent.parent.id])
          nodes[nowTextNode.parent.parent.id]=[];
        nodes[nowTextNode.parent.parent.id].push(nowTextNode);
        
      }

    //묶인 것을 오브젝트로 만들기
      for(let i=0;i<Object.entries<TextNode[]>(nodes).length;i+=1){
        const node=Object.entries<TextNode[]>(nodes)[i][1];
     
        let key=node[0].characters;
        for (const splitValue of splitValues) {
          key = key.split(splitValue).join("");
    
        }
        key = key.replace("-", "_");
        const properties = {};
        properties["font-size"] = (node[1].fontSize as number) + "px";
        properties["line-height"] = `${(node[1].lineHeight as {value:number}).value?String( Math.ceil(Number((node[1].lineHeight as {value:number}).value))):String(node[1].lineHeight)}%`;

        fontWeight[key]=node[1].fontWeight
        answer[key]=[properties["font-size"],{lineHeight:properties["line-height"]}]; 
      }
      return {answer,fontWeight};
}
const extractStyledComponentTextTheme=
(  selectedId: string,
  ignoreStrings?: string[],)=>{
      let texts = [];
      getTarget({ target: "TEXT", returnValue: texts, nodeId: selectedId });
      //텍스트노드인 애들 추출 
      const textNodeIds= groupByTextNodes({ targetNodes: texts, standard: TEXT_STANDARD });
      let textNodes: TextNode[][] = [];
      for (let i = 0; i < textNodeIds.length; i += 1) {
        textNodes[i] = textNodeIds[i]
          .sort(sortByX)
          .map((val) => figma.getNodeById(val) as TextNode);
        
      }
  
      const answer = {};
      const nodes={};
      //같은 조부모로 묶기 
        for (let i = 0; i < textNodes.length; i += 1) {
          if (ignoreStrings.includes(textNodes[i][0].characters)) {
            //
            continue;
          }
          const nowTextNode=textNodes[i][0];
        
          if(!nodes[nowTextNode.parent.parent.id])
            nodes[nowTextNode.parent.parent.id]=[];
          nodes[nowTextNode.parent.parent.id].push(nowTextNode);
          
        }

      //묶인 것을 오브젝트로 만들기
        for(let i=0;i<Object.entries<TextNode[]>(nodes).length;i+=1){
          const node=Object.entries<TextNode[]>(nodes)[i][1];
       
          let key=node[0].characters;
          for (const splitValue of splitValues) {
            key = key.split(splitValue).join("");
      
          }
          key = key.replace("-", "_");
          const properties = {};
          properties["font-size"] = (node[1].fontSize as number) + "px";
          properties["line-height"] = `${(node[1].lineHeight as {value:number}).value?String( Math.ceil(Number((node[1].lineHeight as {value:number}).value))):String(node[1].lineHeight)}%`;
          properties["font-weight"]=node[1].fontWeight;
          answer[key]=properties; 
        }
      return {  answer };
}
