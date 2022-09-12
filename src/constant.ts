export const hostApi = "http://139.162.50.214:6969";
export const homePage = "http://139.162.50.214:3000";
export const baseUrl = `${hostApi}/api/v1`;
export const signUp = homePage + "/sign-up";

export enum BreakPoint {
  "sm" = 375,
  "md" = 480,
  "lg" = 768,
}

export enum MAIN_PAGE {
  home = "homePage",
  addCard = "addCardPage",
}

export const CARD_TYPE = {
  question: "question",
  answer: "answer",
  explain: "explain",
};
