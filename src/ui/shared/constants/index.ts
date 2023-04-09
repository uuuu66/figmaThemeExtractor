export const descriptions = {
  COLOR: "컬러 칩이라고 불리우는 색상 모음을 추출합니다.",

  TEXT: "fontsize,weight와 같은 속성을 추출합니다.",

  SELECT_FRAME: "추출할 프레임을 선택해주세요.",
};
export const checkDescriptions = {
  TEXT: "글자의 경우 lineheight를 제외하고는 디자이너가 적어둔 텍스트대로 추출하지 않고 피그마의 글자에 적용된 속성을 가져옵니다.(누군가의 실수로 둘이 다른 경우가 생김, 싸우지마삼). 대부분의 폰트 테마가 이름 weight size lineheight 이 순서로 정의되어 있어서 코드를 그렇게 짰삼. 추후에 순서를 바꾸도록(언제인지 모름)만들 예정.",
  COLOR:
    "색상의 경우 부모요소로 묶습니다. x축이나 y축으로도 묶을 수는 있지만 아직 선택기능을 만들지 않았습니다.만약 Name이나 Hex와 같은 글자가 피그마에 존재함다면 이 글자를 적어넣어야 합니다.(기본으로 Name과 Hex를 걸러냄.)",
};
