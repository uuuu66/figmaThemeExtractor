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
  onSelect: (e: SelectOptions<T>) => void;
}
export interface RGB {
  r: number;
  g: number;
  b: number;
}
