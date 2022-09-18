import { BreakPoint } from "./constant";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import style from "./style.scss.css";
import { TinyEmitter } from "tiny-emitter";
import { nearest } from "./common";

// import icon
import "./iconSvg";
// end import icon

// setup app
import "./app/setup";
// end setup app

// list component
import "./component/TestElement";
import "./component/HeaderElement";
import "./component/SpanWidth";
import "./component/MainContent";
import "./component/HeaderTabPage";
import "./component/CreateFastCard";
import "./component/ShortIconAddCard";
import { appSettings } from "./app/AppSettings";
// end list component
declare global {
  interface Window {
    fastCard: any;
  }
}

@customElement("fast-card-body")
export class Main extends LitElement {
  @property() isShow = false;
  emitter = new TinyEmitter();
  maxWidth = 0;
  timerTransition = 0;
  timerFocusout = 0;
  @property() isPopupActive = false;
  // 30s
  timeCountUnActive = 30000;
  position = {
    left: 0,
    top: 0,
  };
  breakPoint = BreakPoint.lg;
  animateEl = {
    isRun: false,
    opacity: 0,
    status: -1,
    time: new Date().getTime(),
  };
  constructor() {
    super();

    this.setSizePopupWithAnimation = this.setSizePopupWithAnimation.bind(this);
    this.handlePopupFocus = this.handlePopupFocus.bind(this);
    this.handlePopupBlur = this.handlePopupBlur.bind(this);
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.bindEmitter();
    this.setPosition(this.position);
    this.style.position = "fixed";
    this.style.width = "100%";
    this.style.zIndex = "100000";
    this.style.overflow = "hidden";
    this.style.borderRadius = "5px";
    this.setMaxWidth(375);
    this.setPosition({ left: 100, top: 100 });

    // make popup focusable
    this.tabIndex = 0;
    this.addEventListener("focus", this.handlePopupFocus);
    this.addEventListener("blur", this.handlePopupBlur);
  }

  bindEmitter() {
    this.emitter.on(
      "dragging",
      ({ left, top }: { left: number; top: number }) => {
        if (!left || !top) return;

        this.setPosition({ top, left });
      }
    );

    this.emitter.on(
      "changeMaxWidth",
      ({ width, left }: { width: number; left: number }) => {
        if (Number.isNaN(width) || Number.isNaN(left)) return;
        if (width < 100) return;
        this.setMaxWidth(width);
        this.setPosition({ left });
      }
    );

    appSettings.emitter.on("showFastCard", (status: boolean) => {
      if (status === true) {
        this.setShow(true);
      } else {
        this.setShow(false);
      }
    });

    appSettings.emitter.on(
      "setSizePopupWithAnimation",
      this.setSizePopupWithAnimation
    );
  }

  setShow(status: boolean) {
    this.style.opacity = status ? "1" : "0";
    status && (this.isShow = status);
    this.setTransition(() => {
      !status && (this.isShow = status);
    });
  }
  roundOpacity() {
    return this.animateEl.opacity <= 0 ? 0 : 100;
  }
  calcNextStep() {
    const constant = 200;
    const currTime = new Date().getTime();
    const result = ((currTime - this.animateEl.time) / constant) * 100;
    this.animateEl.time = currTime;
    return result === 0 ? 0.01 : result;
  }
  animateRun() {
    this.animateEl.opacity += this.animateEl.status * this.calcNextStep();

    // check and set isShow
    if (this.roundOpacity() === 0) {
      this.isShow !== false && (this.isShow = false);
    } else {
      this.isShow !== true && (this.isShow = true);
    }
    if (this.animateEl.opacity <= 0 || this.animateEl.opacity >= 100) {
      this.style.opacity = "";
      this.animateEl.opacity = this.roundOpacity();
      this.animateEl.isRun = false;
      return;
    }
    this.style.opacity = (this.animateEl.opacity / 100).toString();
    requestAnimationFrame(this.animateRun.bind(this));
  }

  toggleShow() {
    this.setShow(!(this.animateEl.status === 1));
  }

  setPosition({ top, left }: { top?: number; left?: number }) {
    if (top !== undefined && this.position.top !== top)
      this.style.top = top + "px";
    if (left !== undefined && this.position.left !== left)
      this.style.left = left + "px";
  }

  getMaxWidth() {
    return this.maxWidth;
  }

  setMaxWidth(width: number) {
    if (this.maxWidth === width) return;
    this.maxWidth = width;
    this.style.maxWidth = width + "px";

    const breakPoint = nearest([BreakPoint.sm, BreakPoint.md, BreakPoint.lg])(
      width
    );

    if (breakPoint !== this.breakPoint) {
      this.breakPoint = breakPoint;

      this.emitter.emit("breakPoint", breakPoint);
    }
  }

  setSizePopupWithAnimation({
    top,
    left,
    width,
    height,
  }: {
    top?: number;
    left?: number;
    width: number;
    height: number;
  }) {
    this.setTransition();
    this.style.height = height > 0 ? height + "px" : "";
    this.setPosition({ top, left });
    this.setMaxWidth(width);
    appSettings.emitter.emit("setSizePopupWithAnimationDone");
  }

  getRealHeight() {
    return (this.shadowRoot?.querySelector(".fastcard-body") as HTMLDivElement)
      ?.offsetHeight;
  }

  setTransition(cb?: () => void) {
    this.style.transition = "all 300ms";

    this.timerTransition = setTimeout(() => {
      this.style.transition = "";
      appSettings.emitter.emit("animationDone");
      cb && cb();
    }, 300);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("focus", this.handlePopupFocus);
    this.removeEventListener("blur", this.handlePopupBlur);
    appSettings.emitter.off(
      "setSizePopupWithAnimation",
      this.setSizePopupWithAnimation
    );
  }
  handlePopupFocus() {
    this.style.opacity = "1";
    this.setTransition();
    this.isPopupActive = true;
    appSettings.emitter.emit("popupActive");
    clearTimeout(this.timerFocusout);
  }
  handlePopupBlur() {
    clearTimeout(this.timerFocusout);
    this.timerFocusout = setTimeout(() => {
      this.isPopupActive = false;
      this.style.opacity = ".35";
      this.setTransition();
      appSettings.emitter.emit("popupUnActive");
    }, this.timeCountUnActive);
  }

  render() {
    if (!this.isShow) return html``;

    return html` <style>
        ${style}
      </style>
      <div
        class="fastcard-body relative border border-t-0 overflow-hidden ${this
          .isPopupActive
          ? "border-sky-500"
          : "border-slate-500"}  before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-sky-400"
      >
        <span-width
          position="left"
          class="absolute top-0 left-0 w-1 z-10 bg-sky-400 opacity-0 hover:opacity-50 transition-all block h-full"
        >
        </span-width>
        <header-element
          class="block w-full select-none bg-slate-800 cursor-move"
        ></header-element>
        <main-content></main-content>
        <span-width
          position="right"
          class="absolute top-0 right-0 w-1 z-10 bg-sky-400 block opacity-0 hover:opacity-50 transition-all h-full"
        >
        </span-width>
      </div>`;
  }
}

document.body.dispatchEvent(new CustomEvent("fastCardLoaded"));
