import { appSettings } from "./../app/AppSettings";
import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseElement } from "../BaseElement";
import { BreakPoint } from "../constant";
import { fetchCreateCard } from "../api/point";

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
  @property() groupId = -1;
  @property() isLoading = false;
  @property() message = html``;
  timeoutRemoveMessage = 0;
  observerBreakPoint = true;
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSetFieldCreateCard = this.handleSetFieldCreateCard.bind(this);
  }

  handleSetFieldCreateCard({
    question_detail,
    answer_detail,
    explain_detail,
  }: {
    question_detail?: string;
    answer_detail?: string;
    explain_detail?: string;
  }) {
    if (question_detail) this.question_detail = question_detail;
    if (answer_detail) this.answer_detail = answer_detail;
    if (explain_detail) this.explain_detail = explain_detail;
  }

  bindEmitter(): void {
    super.bindEmitter();
    appSettings.emitter.on("setFieldCreateCard", this.handleSetFieldCreateCard);
    setTimeout(() => {
      appSettings.emitter.emit("create-fast-card-mound");
    }, 0);
  }

  unbindEmitter(): void {
    super.unbindEmitter();
    appSettings.emitter.off(
      "setFieldCreateCard",
      this.handleSetFieldCreateCard
    );
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.isFirstSubmit) this.isFirstSubmit = true;

    if (
      !["question_detail", "answer_detail", "explain_detail", "groupId"]
        .map((value) =>
          this.validate(this[value as keyof typeof this] as string, value)
        )
        .every((item) => item.length === 0)
    )
      return;

    fetchCreateCard({
      groupId: this.groupId,
      question_detail: this.question_detail,
      answer_detail: this.answer_detail,
      explain_detail: this.explain_detail,
    })
      .then(() => {
        this.question_detail = "";
        this.answer_detail = "";
        this.explain_detail = "";
        this.isFirstSubmit = false;
        this.createMessage(html`
          <p class="text-green-400 font-medium text-center text-xl">
            Create success
          </p>
        `);
      })
      .catch(() => {
        this.createMessage(html`
          <p class="text-red-400 font-medium text-center text-xl">
            Create Error please try again
          </p>
        `);
      });
  }

  createMessage(mess: TemplateResult<any>) {
    clearTimeout(this.timeoutRemoveMessage);
    this.message = mess;
    this.timeoutRemoveMessage = setTimeout(() => {
      this.message = html``;
    }, 2000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timeoutRemoveMessage);
  }

  validate(value: string, type: string) {
    const requireValue = () => {
      if (value.trim().length === 0) return "this field require";
      return "";
    };
    const caseOb = {
      answer_detail: requireValue,
      question_detail: requireValue,
      explain_detail: requireValue,
      groupId: () => {
        const groupId = appSettings
          .map("groupCard")((item) => item.entities)
          .get();
        console.log(value, groupId);
        if (value in groupId) return "";
        return "group is require";
      },
    };

    if (!(type in caseOb)) throw new Error("type not correct");
    return caseOb[type as keyof typeof caseOb]();
  }
  render() {
    return html`
      <form action="" class="px-4 mt-4" @submit="${this.handleSubmit}">
        ${this.message}
        <div
          class="flex mb-2 ${this.breakPoint > BreakPoint.md
            ? " items-center gap-x-4"
            : "flex-wrap gap-y-2"}"
        >
          <label for="">Group: </label>
          <select
            name=""
            id=""
            class="input"
            .value="${this.groupId}"
            @input="${(e: InputEvent) =>
              (this.groupId = parseInt(
                (e.currentTarget as HTMLInputElement).value
              ))}"
          >
            <option value="-1">Please select group card</option>
            ${appSettings
              .map("groupCard")((item) =>
                item.ids.map((id: number) => item.entities[id])
              )
              .map(
                (item) => html`
                  <option value="${item.id}">${item.name}</option>
                `
              )
              .get()}
          </select>
          <p class="text-red-400 font-semibold text-sm mb-2">
            ${this.isFirstSubmit
              ? this.validate(this.groupId.toString(), "groupId")
              : ""}
          </p>
        </div>
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
          ></textarea>
          <p class="text-red-400 font-semibold text-sm mb-2">
            ${this.isFirstSubmit
              ? this.validate(this.question_detail, Fields.question_detail)
              : ""}
          </p>
        </div>

        <div
          class="flex mb-2 ${this.breakPoint > BreakPoint.md
            ? " items-center gap-x-4"
            : "flex-wrap gap-y-2"}"
        >
          <label for="">Answer: </label>
          <textarea
            class="input"
            .value="${this.answer_detail}"
            @input="${(e: InputEvent) =>
              (this.answer_detail = (
                e.currentTarget as HTMLInputElement
              ).value)}"
          ></textarea>
          <p class="text-red-400 font-semibold text-sm mb-2">
            ${this.isFirstSubmit
              ? this.validate(this.answer_detail, Fields.answer_detail)
              : ""}
          </p>
        </div>

        <div
          class="flex mb-2 ${this.breakPoint > BreakPoint.md
            ? " items-center gap-x-4"
            : "flex-wrap gap-y-2"}"
        >
          <label for="">Explain: </label>
          <textarea
            class="input"
            .value="${this.explain_detail}"
            @input="${(e: InputEvent) =>
              (this.explain_detail = (
                e.currentTarget as HTMLInputElement
              ).value)}"
          >
          </textarea>
          <p class="text-red-400 font-semibold text-sm mb-2">
            ${this.isFirstSubmit
              ? this.validate(this.explain_detail, Fields.explain_detail)
              : ""}
          </p>
        </div>

        <div class="flex mt-4">
          <button class="button text-green-400 mx-auto flex items-center">
            <span>Send</span>
            ${this.isLoading
              ? html`<span class="ml-2 inline-flex"></span
                  ><icon-loading-fastcard
                    class="animate-spin"
                  ></icon-loading-fastcard>`
              : ""}
          </button>
        </div>
      </form>
    `;
  }
}
