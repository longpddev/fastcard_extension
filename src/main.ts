import {
    css,
    CSSResult,
    CSSResultGroup,
    html,
    LitElement,
    unsafeCSS,
} from "lit";
import { customElement } from "lit/decorators.js";
import style from "./style.scss.css";

@customElement("fast-card-body")
export class Main extends LitElement {
    static get styles() {
        return [
            css`
                ${unsafeCSS(style)}
            `,
        ];
    }
    render() {
        return html` <h1 class="text-2xl">long</h1> `;
    }

    createRenderRoot() {
        return this;
    }
}

const mainEl = document.createElement("fast-card-body");

mainEl.classList.add("fastcard-body");
document.body.append(mainEl);
