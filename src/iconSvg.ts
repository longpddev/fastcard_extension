import { css } from "lit-element";
import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

class IconBase extends LitElement {
  iconWidth = 0;
  iconHeight = 0;

  static styles = css`
    svg {
      display: block;
    }
  `;
  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    const baseFontSize = 16;
    this.style.fill = "currentColor";
    this.style.display = "inline-block";
    this.style.fontSize = baseFontSize + "px";
    console.log(this.iconWidth / this.iconHeight);
    this.style.width = `${this.iconWidth / this.iconHeight}em`;
    this.style.height = "1em";
  }
  htmlIcon(): TemplateResult {
    console.trace("Not implement yet");
    return html``;
  }
  render() {
    return this.htmlIcon();
  }
}

@customElement("icon-loading")
export class IconLoading extends IconBase {
  iconWidth = 512;
  iconHeight = 512;

  htmlIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
        />
      </svg>
    `;
  }
}
