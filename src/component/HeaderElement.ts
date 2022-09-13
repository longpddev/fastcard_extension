import { appSettings } from './../app/AppSettings';
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

interface IPosition {
  top: number;
  left: number;
}

interface IPopupShape extends IPosition {
  width: number;
  height: number;
}

@customElement("header-element")
export class HeaderElement extends BaseElement {
  headerDraggable = false;
  position: IPosition = { top: 0, left: 0 };
  rootPosition: IPosition = { top: 0, left: 0 };
  resizeObserver: ResizeObserver = new ResizeObserver(() => {
    const oldHeight = appSettings.get('headerElementHeight')
    if(oldHeight !== this.offsetHeight) appSettings.set('headerElementHeight', this.offsetHeight)
  })
  constructor() {
    super();

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    this.handleMiniPopup = this.handleMiniPopup.bind(this)
    this.setSizePopupWithAnimationDone = this.setSizePopupWithAnimationDone.bind(this)
  }
  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener("pointermove", this.handlePointerMove);
    appSettings.emitter.on('setSizePopupWithAnimationDone', this.setSizePopupWithAnimationDone)
    this.resizeObserver.observe(this)
  }

  disconnectedCallback(): void {
    document.removeEventListener("pointermove", this.handlePointerMove);
    appSettings.emitter.off('setSizePopupWithAnimationDone', this.setSizePopupWithAnimationDone)
    this.resizeObserver.unobserve(this)
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

  getCurrentRootShape(): IPopupShape {
    if (!this.context)
      return {
        left: 0,
        top: 0,
        height: 0,
        width: 0
      };

    return {
      left: parseInt(this.context.style.left),
      top: parseInt(this.context.style.top),
      width: this.context.offsetWidth,
      height: this.context.offsetHeight
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

  setSizePopupWithAnimationDone() {

  }

  handleMiniPopup() {
    appSettings.set('prevPopupShape', this.getCurrentRootShape())
    appSettings.emitter.emit('setSizePopupWithAnimation', {width: 100, height: appSettings.get('headerElementHeight') || 50, left: window.innerWidth - 120, top: window.innerHeight - (appSettings.get('headerElementHeight') || 50) - 20})
    appSettings.set('minimized', true);
    this.requestUpdate()
  }

  handleExpandPopup () {
    const prevPopupShape = appSettings.get('prevPopupShape') || {}
    appSettings.emitter.emit('setSizePopupWithAnimation', {width: 300, left: 0, top: 0, ...prevPopupShape, height: ''})
    appSettings.set('minimized', false);
    this.requestUpdate()
  }

  render() {
    
    return html`
      <div class="header-container flex p-2 relative touch-none">
        <div
          class="header-drag-control absolute inset-0 z-0"
          @pointerdown="${this.handlePointerDown}"
          @pointerup="${this.handlePointerCancel}"
          @pointercancel="${this.handlePointerCancel}"
        ></div>
        ${appSettings.get('minimized') ? html`
          <button @click="${this.handleExpandPopup}" class="w-[1em] h-[1em] hover:text-sky-400 text-xl inline-block ml-auto relative z-10">
            <span
              class="block w-[1em] h-[.9em] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] border border-currentColor rounded-sm"
            ></span>
          </button>
        ` : html`
          <button @click="${this.handleMiniPopup}" class="w-[1em] h-[1em] hover:text-sky-400 text-xl inline-block ml-auto relative z-10">
            <span
              class="block w-[1em] h-px bg-currentColor absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
            ></span>
          </button>
        `}
        
        <button
          @click="${() => this.context?.setShow(false)}"
          class="w-[1em] h-[1em] hover:text-sky-400 text-xl inline-block ml-3 relative z-10"
        >
          <span
            class="block w-px h-[1em] bg-currentColor absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rotate-45"
          ></span>
          <span
            class="block w-px h-[1em] bg-currentColor absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rotate-[-45deg]"
          ></span>
        </button>
      </div>
    `;
  }
}
