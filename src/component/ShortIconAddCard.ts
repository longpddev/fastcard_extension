import { appSettings } from "./../app/AppSettings";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { getSelect } from "../common";

@customElement("short-icon-add-card")
export class ShortIconAddCard extends LitElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handlePointerup = this.handlePointerup.bind(this);
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = "none";
    this.style.position = "fixed";
    this.style.zIndex = "10000";
    this.style.setProperty('-webkit-user-select', 'none');
    this.style.setProperty('-moz-user-select', 'none');
    this.style.setProperty('-ms-user-select', 'none');
    this.style.setProperty('user-select', 'none');

    document.addEventListener("selectionchange", this.handlePointerup);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    document.removeEventListener("selectionchange", this.handlePointerup);
  }

  showEl(status: boolean) {
    if (status) {
      this.style.display = "inline-flex";
    } else {
      this.style.display = "none";
    }
  }

  handlePointerup() {
    const select = getSelect();

    if (select === null) return this.showEl(false);
    if (!this.checkSelected(select)) return this.showEl(false);

    this.showEl(true);
    const position = this.getPositionSelect(select);
    const { innerWidth: width } = window;
    const padding = 5;
    let top = position.top + padding;
    let left = position.right + padding;

    if (position.right + padding + this.offsetWidth > width) {
      left = width - this.offsetWidth;
      top = position.bottom;
    }

    if (position.top - padding - this.offsetHeight > 0) {
      top = position.top - this.offsetHeight;
    }

    this.style.left = left + "px";
    this.style.top = top + "px";
  }

  getPositionSelect(select: Selection) {
    return select.getRangeAt(0).getBoundingClientRect();
  }

  getTextSelect(select: Selection) {
    return select.toString().trim();
  }

  checkSelected(select: Selection) {
    return this.getTextSelect(select).length > 0;
  }

  handleClick() {
    const select = getSelect();

    if (select === null) return;
    if (!this.checkSelected(select)) return;
    appSettings.emitter.emit(
      "addCardWithSelectedText",
      this.getTextSelect(select)
    );

    this.showEl(false);
  }
  render() {
    return html`
      <button
        @click="${this.handleClick}"
        style="
          color: white;
          display: inline-flex;
          border: unset;
          padding: 3px 4px;
          border-radius: 4px;
          background: rgb(51 65 85);
          cursor: pointer;
        "
      >
        <icon-plus></icon-plus>
      </button>
    `;
  }
}
