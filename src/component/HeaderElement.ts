import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

interface IPosition {
  top: number;
  left: number;
}

@customElement("header-element")
export class HeaderElement extends BaseElement {
  headerDraggable = false;
  position: IPosition = { top: 0, left: 0 };
  rootPosition: IPosition = { top: 0, left: 0 };
  constructor() {
    super();

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
  }
  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener("pointermove", this.handlePointerMove);
  }

  disconnectedCallback(): void {
    document.removeEventListener("pointermove", this.handlePointerMove);
  }

  getCurrentRootPosition(): IPosition {
    if (!this.context)
      return {
        left: 0,
        top: 0,
      };

    return {
      left: parseInt(this.context.style.left),
      top: parseInt(this.context.style.top),
    };
  }

  handlePointerMove(e: PointerEvent) {
    if (!this.headerDraggable) return;
    this.emitter.emit("dragging", {
      top: this.rootPosition.top + (e.pageY - this.position.top),
      left: this.rootPosition.left + (e.pageX - this.position.left),
    });
  }
  handlePointerDown(e: PointerEvent) {
    this.headerDraggable = true;
    this.position.left = e.pageX;
    this.position.top = e.pageY;
    this.rootPosition = this.getCurrentRootPosition();
  }
  handlePointerCancel() {
    this.headerDraggable = false;
  }

  render() {
    console.log("render");
    return html`
      <div class="header-container flex p-2 relative touch-none">
        <div
          class="header-drag-control absolute inset-0 z-0"
          @pointerdown="${this.handlePointerDown}"
          @pointerup="${this.handlePointerCancel}"
          @pointercancel="${this.handlePointerCancel}"
        ></div>
        <button
          @click="${() => this.context?.setShow(false)}"
          class="w-[1em] h-[1em] hover:text-sky-400 text-xl inline-block ml-auto relative z-10"
        >
          <span
            class="block w-px h-[1em] bg-currentColor absolute left-1/2 top-0 rotate-45"
          ></span>
          <span
            class="block w-px h-[1em] bg-currentColor absolute left-1/2 top-0 rotate-[-45deg]"
          ></span>
        </button>
      </div>
    `;
  }
}
