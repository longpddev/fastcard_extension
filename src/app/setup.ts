import { fetGetUserInfo } from "../api/point";
import { Maybe } from "../common";
import { appSettings } from "./AppSettings";

new Maybe(window.getStorageValue("token")).run((value) => {
  appSettings.set("token", value);
  console.log(value);
  fetGetUserInfo();
});
