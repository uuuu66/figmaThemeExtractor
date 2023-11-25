export const descriptions = {
  COLOR: "컬러 칩이라고 불리우는 색상 모음을 추출합니다.",

  TEXT: "fontsize,weight와 같은 속성을 추출합니다.",

  SVG: "svg 아이콘들을 import후 index.ts 파일을 생성합니다.",

  SELECT_FRAME: "추출할 프레임을 선택해주세요.",
};
export const checkDescriptions = {
  TEXT: "글자의 경우 조부모로 묶은 후 적용된 css 추출.",
  COLOR:
    "색상의 경우 부모요소로 묶습니다. x축이나 y축으로도 묶을 수는 있지만 아직 선택기능을 만들지 않았습니다.만약 Name이나 Hex와 같은 글자가 피그마에 존재함다면 이 글자를 적어넣어야 합니다.(기본으로 Name과 Hex를 걸러냄.)",
  SVG: "import 후 index.ts파일을 생성",
};
