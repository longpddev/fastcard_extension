import { appSettings } from "./app/AppSettings";
import { BreakPoint } from "./constant";
import { TinyEmitter } from "tiny-emitter";
import { LitElement } from "lit";
import { Main } from "./main";
import { property } from "lit/decorators.js";

declare global {
  interface Window {
    testElement: any;
  }
}

export class BaseElement extends LitElement {
  context: Main | undefined;
  emitter: TinyEmitter = new TinyEmitter();
  @property() breakPoint = BreakPoint.lg;
  @property() isLogin = (appSettings.get("isLogin") as boolean) || false;
  observerBreakPoint = false;
  observerIsLogin = false;
  constructor() {
    super();

    this.handleBreakPoint = this.handleBreakPoint.bind(this);
    this.handleIdLogin = this.handleIdLogin.bind(this);
  }
  protected getContext() {
    const root = this.getRootNode() as ShadowRoot;
    const context = root.host as Main;
    if (!context) throw new Error("context not found");
    return context;
  }

  connectedCallback() {
    this.context = this.getContext();
    this.emitter = this.context.emitter;
    this.breakPoint = this.context.breakPoint;
    super.connectedCallback();
    this.bindEmitter();
  }
  handleBreakPoint(value: BreakPoint) {
    if (!this.observerBreakPoint) return;
    this.breakPoint = value;
  }

  handleIdLogin() {
    if (!this.observerIsLogin) return;
    if (this.isLogin !== appSettings.get("isLogin"))
      this.isLogin = appSettings.get("isLogin");
  }
  bindEmitter() {
    this.emitter.on("breakPoint", this.handleBreakPoint);
    appSettings.emitter.on("isLoginChange", this.handleIdLogin);
  }

  unbindEmitter() {
    this.emitter.off("breakPoint", this.handleBreakPoint);
    appSettings.emitter.off("isLoginChange", this.handleIdLogin);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.unbindEmitter();
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }
}
