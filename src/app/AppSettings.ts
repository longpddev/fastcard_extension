import { TinyEmitter } from "tiny-emitter";

declare global {
  interface Window {
    appSettings: any;
    appContext: any;
  }
}

const appContext: any = {
  isLogin: false,
};

class Maybe {
  data: Array<any>;
  constructor(value: Maybe | any) {
    let result = value;
    if (value instanceof Maybe) result = value.get();
    if (!Array.isArray(result)) result = [result];

    this.data = result;
  }
  isNotNil() {
    return (
      this.data !== undefined && this.data !== null && this.data.length > 0
    );
  }

  get() {
    return this.data.length === 1 ? this.data[0] : this.data;
  }

  map(cb: (i: any, index?: number) => any) {
    return new Maybe(this.data.map(cb));
  }

  run(cb: (i: any) => any) {
    return new Maybe(cb(this.get()));
  }
}

export const appSettings = {
  emitter: new TinyEmitter(),

  get(key: string) {
    if (key in appContext) return appContext[key];
  },

  set(key: string, value: any) {
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
};

appSettings.emitter.on("tokenChange", () => {
  console.log("tokenChange");
  const token = appSettings.get("token");

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
    appSettings.set("token", value);
  },
};

window.appSettings = appSettings;
window.appContext = appContext;
