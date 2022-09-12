import { BreakPoint } from "./constant";
import { css, html, LitElement, unsafeCSS } from "lit";
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
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.bindEmitter();
    this.setPosition(this.position);
    this.style.position = "fixed";
    this.style.width = "100%";
    this.style.zIndex = "100000";
    this.setMaxWidth(375);
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
        if (width < 300) return;
        this.setMaxWidth(width);
        this.setPosition({ left });
      }
    );
  }
  static get styles() {
    return [
      css`
        ${unsafeCSS(style)}
      `,
    ];
  }

  setShow(status: boolean) {
    if (status) {
      this.animateEl.status = 1;
    } else {
      this.animateEl.status = -1;
    }
    if (!this.animateEl.isRun) {
      this.animateEl.isRun = true;
      this.animateEl.time = new Date().getTime();
      this.animateRun();
    }
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

  render() {
    if (!this.isShow) return html``;

    return html` <div
      class="fastcard-body rounded-md relative px-3 border border-slate-500"
    >
      <span-width
        position="left"
        class="absolute top-0 left-0 w-1 z-10 bg-sky-400 opacity-0 hover:opacity-50 transition-all block h-full"
      >
      </span-width>
      <header-element
        class="block w-full border-b select-none border-slate-700 cursor-move"
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
