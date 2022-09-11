import { customElement } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

@customElement("test-element")
export class TestElement extends BaseElement {
  connectedCallback(): void {
    super.connectedCallback();
  }

  render() {}
}
