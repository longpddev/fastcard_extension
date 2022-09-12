import { fetchMainDataWhenLogin, fetGetUserInfo } from "../api/point";
import { Maybe } from "../common";
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
