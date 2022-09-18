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
    this.style.fill = "currentColor";
    this.style.display = "inline-block";
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

@customElement("icon-loading-fastcard")
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

@customElement("icon-house")
export class IconHouse extends IconBase {
  iconWidth = 576;
  iconHeight = 512;
  htmlIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
        />
      </svg>
    `;
  }
}

@customElement("icon-plus")
export class IconPlus extends IconBase {
  iconWidth = 448;
  iconHeight = 512;
  htmlIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
        />
      </svg>
    `;
  }
}
