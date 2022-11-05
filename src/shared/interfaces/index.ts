export interface MessageType<T = {}> {
  type: string;

  value?: T;
}
export interface SelectOptions<T> {
  label: string;
  value: T | string;
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
  LABE_SELECT: string;
  LANGUAGE: string;
  KOR: string;
  ENG: string;
}
export interface LanguageMessageType {
  country: string;
  payload?: any;
}
