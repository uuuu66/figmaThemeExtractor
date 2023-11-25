import { ThemeType } from "../../../shared/types";
import { checkDescriptions, descriptions } from "../constants";

export const translateThemeType = (theme: ThemeType) => {
  switch (theme) {
    case "COLOR":
      return "색상";
    case "TEXT":
      return "글자";
    case "SVG":
      return "SVG";
  }
};
export const getThemeDescription = (theme: ThemeType) => {
  switch (theme) {
    case "COLOR":
      return descriptions.COLOR;
    case "TEXT":
      return descriptions.TEXT;
    case "SVG":
      return descriptions.SVG;
  }
};
export const getCheckDescription = (theme: ThemeType) => {
  switch (theme) {
    case "COLOR":
      return checkDescriptions.COLOR;
    case "TEXT":
      return checkDescriptions.TEXT;
    case "SVG":
      return checkDescriptions.SVG;
  }
};
