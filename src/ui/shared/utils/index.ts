import { ThemeType } from "../../../shared/types";
import { descriptions } from "../constants";

export const translateThemeType = (theme: ThemeType) => {
  switch (theme) {
    case "COLOR":
      return "색상";
    case "TEXT":
      return "글자";
  }
};
export const getThemeDescription = (theme: ThemeType) => {
  switch (theme) {
    case "COLOR":
      return descriptions.COLOR;
    case "TEXT":
      return descriptions.TEXT;
  }
};
