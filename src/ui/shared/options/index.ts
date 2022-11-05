import {
  ENG,
  KOR,
  LANGUAGE,
  TYPE_RECTANGLE,
  TYPE_TEXT,
} from "../../../shared/constants";
import { SelectOptions, Strings } from "../../../shared/interfaces";

import strings from "../../../assets/strings.json";

const getOptions = (country?: string) => {
  const stringsObject = strings[country || KOR] as Strings;

  const nodeTypeSelectOptions: SelectOptions<NodeType>[] = [
    { label: stringsObject.LABEL_TYPE_TEXT, value: TYPE_TEXT },
    { label: stringsObject.LABEL_TYPE_RECTANGLE, value: TYPE_RECTANGLE },
  ];

  const languaseSelectOptions: SelectOptions<string>[] = [
    { label: stringsObject.KOR, value: KOR },
    { label: stringsObject.ENG, value: ENG },
  ];

  return { nodeTypeSelectOptions, languaseSelectOptions };
};
export default getOptions;
