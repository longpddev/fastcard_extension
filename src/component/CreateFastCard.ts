import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseElement } from "../BaseElement";
import { BreakPoint } from "../constant";

enum Fields {
  question_detail = "question_detail",
  answer_detail = "answer_detail",
  explain_detail = "explain_detail",
}

@customElement("create-fast-card")
export class CreateFastCard extends BaseElement {
  @property() isFirstSubmit = false;
  @property() question_detail = "";
  @property() answer_detail = "";
  @property() explain_detail = "";
  @property() isLoading = false;
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (!this.isFirstSubmit) this.isFirstSubmit = true;
  }

  validate(value: any, type: Fields) {
    return "";
  }
  render() {
    return html`
      <form action="" class="mt-4" @submit="${this.handleSubmit}">
        <div
          class="flex mb-2 ${this.breakPoint > BreakPoint.md
            ? " items-center gap-x-4"
            : "flex-wrap gap-y-2"}"
        >
          <label for="">Question: </label>
          <textarea
            class="input"
            .value="${this.question_detail}"
            @input="${(e: InputEvent) =>
              (this.question_detail = (
                e.currentTarget as HTMLInputElement
              ).value)}"
          />
          <p class="text-red-400 font-semibold text-sm mb-2">
            ${this.isFirstSubmit
              ? this.validate(this.question_detail, Fields.question_detail)
              : ""}
          </p>
        </div>

        <div class="flex my-4">
          <button class="button text-green-400 mx-auto flex items-center">
            <span>Send</span>
            ${this.isLoading
              ? html`<span class="ml-2 inline-flex"></span
                  ><icon-loading class="animate-spin"></icon-loading>`
              : ""}
          </button>
        </div>
      </form>
    `;
  }
}
