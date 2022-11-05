import { TYPE_RECTANGLE, TYPE_TEXT } from "../constants";
import { SelectOptions } from "../interfaces";

export const nodeTypeSelectOptions: SelectOptions<NodeType>[] = [
  { label: "텍스트", value: TYPE_TEXT },
  { label: "사각형", value: TYPE_RECTANGLE },
];
