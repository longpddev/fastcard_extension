import { customElement, property } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

export enum EdgeSide {
  left = "left",
  right = "right",
}

@customElement("span-width")
export class SpanWidth extends BaseElement {
  @property() edge: string = EdgeSide.right;
  rootWidth = 0;
  isResize = false;
  currentPosition = {
    pageX: 0,
    rootLeft: 0,
  };
  constructor() {
    super();

    this.style.cursor = "col-resize";
    this.style.touchAction = "none";
    this.style.userSelect = "none";

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    const position = this.getAttribute("position");

    position && (this.edge = position);
  }

  getWidthContext() {
    if (!this.context) return 0;

    return this.context.getMaxWidth();
  }

  getLeftContext() {
    if (!this.context) return 0;

    return parseInt(this.context.style.left);
  }

  handlePointerMove(e: PointerEvent) {
    if (!this.isResize) return;
    let newPosition = {
      left: this.currentPosition.rootLeft,
      width: this.rootWidth + (e.pageX - this.currentPosition.pageX),
    };
    if (this.edge === EdgeSide.left) {
      newPosition = {
        left:
          this.currentPosition.rootLeft +
          (e.pageX - this.currentPosition.pageX),
        width: this.rootWidth + (this.currentPosition.pageX - e.pageX),
      };
    }
    this.emitter.emit("changeMaxWidth", newPosition);
  }
  handlePointerDown(e: PointerEvent) {
    this.isResize = true;
    this.rootWidth = this.getWidthContext();
    this.currentPosition = {
      pageX: e.pageX,
      rootLeft: this.getLeftContext(),
    };
  }
  handlePointerCancel() {
    this.isResize = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.context) return;

    this.addEventListener("pointerdown", this.handlePointerDown);
    document.addEventListener("pointermove", this.handlePointerMove);
    document.addEventListener("pointerup", this.handlePointerCancel);
    document.addEventListener("pointercancel", this.handlePointerCancel);
  }

  disconnectedCallback(): void {
    document.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("pointerup", this.handlePointerCancel);
    document.removeEventListener("pointercancel", this.handlePointerCancel);
  }
}
