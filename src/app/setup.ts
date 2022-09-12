import { fetchMainDataWhenLogin, fetGetUserInfo } from "../api/point";
import { Maybe } from "../common";
import { MAIN_PAGE } from "../constant";
import { appSettings } from "./AppSettings";

new Maybe(window.getStorageValue("token")).run((value) => {
  appSettings.set("token", value);
  console.log(value);
  fetGetUserInfo();
});

appSettings.emitter.on("fetchLoginDone", () => {
  if (!appSettings.get("token")) return;
  fetchMainDataWhenLogin();
});

appSettings.emitter.on("fetGetUserInfoDone", () => {
  if (!appSettings.get("token")) return;
  fetchMainDataWhenLogin();
});

appSettings.emitter.on("addCardWithSelectedText", (text: string) => {
  appSettings.emitter.emit("showFastCard", true);
  appSettings.set("mainPage", MAIN_PAGE.addCard);
  setTimeout(() => {
    appSettings.emitter.emit("setFieldCreateCard", { answer_detail: text });
  }, 0);
});
