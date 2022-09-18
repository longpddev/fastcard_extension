import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BreakPoint, signUp } from "../constant";
import { BaseElement } from "./../BaseElement";
import { fetchLogin } from "../api/point";

enum Fields {
  email = "email",
  password = "password",
}

@customElement("login-form")
export class LoginForm extends BaseElement {
  @property() email = "";
  @property() password = "";
  @property() isFirstSubmit = false;
  @property() isLoading = false;
  observerBreakPoint = true;
  @property() message = html``;
  timer = 0;
  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!this.isFirstSubmit) this.isFirstSubmit = true;

    if (
      ![
        this.validate(this.email, Fields.email),
        this.validate(this.password, Fields.password),
      ].some((i) => i.length === 0)
    )
      return;

    this.emitter.emit("login", { email: this.email, password: this.password });
    this.isLoading = true;

    fetchLogin(this.email, this.password).catch((e) => {
      this.showMessage(
        html`<p class=" text-red-400 text-2xl">
          Username or password wrong please try again
        </p>`
      );
      this.isLoading = false;
    });
  }
  bindEmitter(): void {
    super.bindEmitter();
  }

  validate(value: string, type: Fields) {
    const caseOb = {
      email: () => {
        if (value.trim().length === 0) return "Email require";
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Invalid email";
        return "";
      },
      password: () => {
        if (value.trim().length === 0) return "Password require";
        if (value.trim().length < 4) return "Password at least 4 characters";
        if (![/[0-9]+/, /[a-zs]+/].every((regex) => regex.test(value)))
          return "Password must contains letters and numbers";

        return "";
      },
    };

    if (!(type in caseOb)) throw new Error("type not correct");
    return caseOb[type]();
  }

  showMessage(mess: TemplateResult<any>) {
    this.message = mess;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.message = html``;
    }, 2000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  render() {
    return html`
      <div class="px-4">
        <h2 class="text-center text-xl font-medium text-sky-300 mt-2">
          Sign in
        </h2>
        ${this.message}
        <form action="" @submit="${this.handleSubmit}">
          <div
            class="flex mb-2 ${this.breakPoint > BreakPoint.md
              ? " items-center gap-x-4"
              : "flex-wrap gap-y-2"}"
          >
            <label for="">Email: </label>
            <input
              type="email"
              class="input"
              .value="${this.email}"
              @input="${(e: InputEvent) =>
                (this.email = (e.currentTarget as HTMLInputElement).value)}"
            />
            <p class="text-red-400 font-semibold text-sm mb-2">
              ${this.isFirstSubmit
                ? this.validate(this.email, Fields.email)
                : ""}
            </p>
          </div>
          <div
            class="flex mb-2 ${this.breakPoint > BreakPoint.md
              ? " items-center gap-x-4"
              : "flex-wrap gap-y-2"}"
          >
            <label for="">Password: </label>
            <input
              type="password"
              class="input"
              .value="${this.password}"
              @input="${(e: InputEvent) =>
                (this.password = (e.currentTarget as HTMLInputElement).value)}"
            />
            <p class="text-red-400 font-semibold text-sm mb-2">
              ${this.isFirstSubmit
                ? this.validate(this.password, Fields.password)
                : ""}
            </p>
          </div>
          <div class="flex">
            <a href="${signUp}" target="_blank" class="ml-auto"
              >or, create account</a
            >
          </div>
          <div class="flex my-4">
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
      </div>
    `;
  }
}
