import { appSettings } from "./../app/AppSettings";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MAIN_PAGE } from "../constant";
import { BaseElement } from "./../BaseElement";

@customElement("header-tab-page")
export class HeaderTabPage extends BaseElement {
  @property() page: MAIN_PAGE = MAIN_PAGE.home;

  bindEmitter() {
    super.bindEmitter();
    appSettings.emitter.on("mainPageChange", this.requestUpdate, this);
  }

  unbindEmitter() {
    super.unbindEmitter();
    appSettings.emitter.on("mainPageChange", this.requestUpdate, this);
  }

  render() {
    return html`
      <ul class="flex border-b border-slate-700 mt-[2px]">
        <li>
          <button
            @click="${() => appSettings.set("mainPage", MAIN_PAGE.home)}"
            class="px-4 py-1 border-b-2 border-transparent ${appSettings.get(
              "mainPage"
            ) === MAIN_PAGE.home
              ? "border-sky-400 text-sky-400"
              : "hover:border-slate-600"}"
          >
            Home
          </button>
        </li>
        <li>
          <button
            @click="${() => appSettings.set("mainPage", MAIN_PAGE.addCard)}"
            class="px-4 py-1 border-b-2 border-transparent ${appSettings.get(
              "mainPage"
            ) === MAIN_PAGE.addCard
              ? "border-sky-400 text-sky-400"
              : "hover:border-slate-600"}"
          >
            Create card
          </button>
        </li>
      </ul>
    `;
  }
}
