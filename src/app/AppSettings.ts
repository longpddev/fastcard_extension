import { CONST_REMOVE, MAIN_PAGE } from "./../constant";
import { TinyEmitter } from "tiny-emitter";
import { Maybe } from "../common";

const appContext: any = {
  isLogin: false,
  mainPage: MAIN_PAGE.home,
};

export const appSettings = {
  emitter: new TinyEmitter(),
  REMOVE: CONST_REMOVE,
  get(key: string) {
    if (key in appContext) return appContext[key];
  },

  set(key: string, value: any) {
    if (value === CONST_REMOVE) {
      delete appContext[key];
      setTimeout(() => {
        this.emitter.emit(key + "Remove");
      }, 0);
      return this;
    }
    appContext[key] = value;
    setTimeout(() => {
      this.emitter.emit(key + "Change");
    }, 0);
    return this;
  },

  run(key: string) {
    const maybe = new Maybe(this.get(key));
    return (cb: (i: any) => any) => {
      return maybe.run(cb);
    };
  },

  map(key: string) {
    const maybe = new Maybe(this.get(key));
    return (cb: (i: any) => any) => {
      return maybe.map(cb);
    };
  },
};

if (!("getStorageValue" in window && "setStorageValue" in window)) {
  window.setStorageValue = (name, value) => {
    localStorage.setItem(name + "FastCard", value);
  };
  window.getStorageValue = (name, defaultValue) => {
    return localStorage.getItem(name + "FastCard") || defaultValue;
  };
}

appSettings.emitter.on("tokenChange", () => {
  const token = appSettings.get("token");
  window.setStorageValue("token", token || "");
  if (token && !appSettings.get("isLogin")) {
    appSettings.set("isLogin", true);
  } else {
    if (appSettings.get("isLogin")) appSettings.set("isLogin", false);
  }
});

export const token = {
  get() {
    return appSettings.get("token") || "";
  },

  set(value: string) {
    appSettings.set("token", value || "");
  },
};

window.appSettings = appSettings;
window.appContext = appContext;
