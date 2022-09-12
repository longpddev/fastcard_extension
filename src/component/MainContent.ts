import { MAIN_PAGE } from "./../constant";
import { appSettings } from "./../app/AppSettings";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseElement } from "./../BaseElement";

import "./LoginForm";
import { homePage } from "../api/client";
@customElement("main-content")
export class MainContent extends BaseElement {
  observerIsLogin = true;

  bindEmitter(): void {
    super.bindEmitter();

    appSettings.emitter.on("mainPageChange", this.requestUpdate, this);
    appSettings.emitter.on(
      "fetchMainDataWhenLoginDone",
      this.requestUpdate,
      this
    );
  }

  unbindEmitter(): void {
    super.unbindEmitter();
    appSettings.emitter.off("mainPageChange", this.requestUpdate);
    appSettings.emitter.off("fetchMainDataWhenLoginDone", this.requestUpdate);
  }

  render() {
    if (!this.isLogin) return html`<login-form />`;

    return html`
      <div class="mb-1">
        <header-tab-page></header-tab-page>
        ${this.renderContent()}
        <div class="flex justify-end px-4">
          <a
            href="${homePage}"
            class="text-slate-700 hover:text-sky-400 inline-flex items-center space-x-2"
            target="_blank"
            ><icon-house class="text-"></icon-house> <span>Home page</span></a
          >
        </div>
      </div>
    `;
  }

  renderContent() {
    switch (appSettings.get("mainPage")) {
      case MAIN_PAGE.home:
        return this.renderHome();
      case MAIN_PAGE.addCard:
        return this.renderAddCard();
      default:
        return html``;
    }
  }

  renderHome() {
    const groupCard = appSettings.get("groupCard")?.entities;
    const cardLearnToday = appSettings.get("cardLearnToday");

    if (!groupCard || !cardLearnToday) return html``;
    return html`
      <ul class="mt-4 px-2">
        ${cardLearnToday.map((data: any) => {
          return html`
            <li class="py-1 px-2 flex justify-between">
              <span>${groupCard[data.groupId].name}</span>
              <span class="text-green-400">${data.card.count}</span>
            </li>
          `;
        })}
      </ul>
    `;
  }

  renderAddCard() {
    return html`<create-fast-card></create-fast-card>`;
  }
}
