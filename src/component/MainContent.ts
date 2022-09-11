import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

import "./LoginForm";

@customElement("main-content")
export class MainContent extends BaseElement {
  observerIsLogin = true;
  render() {
    return html` ${this.isLogin ? html`` : html`<login-form />`}`;
  }
}
