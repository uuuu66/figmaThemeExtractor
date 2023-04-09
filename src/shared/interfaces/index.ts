import { ThemeType } from "../types";

export interface MessageType<T = {}> {
  type: string;

  value?: T;
}
export interface SelectOptions<T> {
  label: string;
  value: T;
  key?: string;
}
export interface SelectProps<T> {
  defaultIsOn?: boolean;
  options: SelectOptions<T>[];
  value: any;
  width?: string;
  placeholder?: string;
  onSelect: (e: SelectOptions<T>) => void;
}
export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface Strings {
  LABEL_TYPE_TEXT: string;
  LABEL_TYPE_RECTANGLE: string;
  LABEL_SELECT: string;
  LABEL_COLOR: string;
  LANGUAGE: string;
  KOR: string;
  ENG: string;
  TITLE: string;
  TITLE_CHOOSE_THEME_TYPE: string;
}
export interface LanguageMessageType {
  country: string;
  payload?: any;
}
export interface FontProperties {
  "font-size": string;
  "font-weight": number;
  "line-height": string;
}
export interface ExtractResultMessageType {
  answer: {
    [index: string]: string | FontProperties;
  };
  fontWeight?: { [index: string]: number };
  themeType?: ThemeType;
}
