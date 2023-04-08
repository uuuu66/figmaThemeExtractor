import { SelectOptions } from "../../../shared/interfaces";
import { ThemeType } from "../../../shared/types";
import { translateThemeType } from "../utils";

const themeTypeSelectOptions: SelectOptions<ThemeType>[] = [
  { label: translateThemeType("TEXT"), value: "TEXT" },
  { label: translateThemeType("COLOR"), value: "COLOR" },
];
export { themeTypeSelectOptions };
