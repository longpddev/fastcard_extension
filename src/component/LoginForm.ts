import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BreakPoint } from "../constant";
import { BaseElement } from "./../BaseElement";
import { fetchLogin } from "../api/point";

enum Fields {
  email = "email",
  password = "password",
}

@customElement("login-form")
export class LoginForm extends BaseElement {
  @property() email = "email@gmail.com";
  @property() password = "admin123";
  @property() isFirstSubmit = false;
  @property() isLoading = false;
  observerBreakPoint = true;

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

    fetchLogin(this.email, this.password)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.error(e);
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

  render() {
    return html`
      <h2 class="text-center text-2xl mb-2 mt-4">Sign in</h2>
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
            ${this.isFirstSubmit ? this.validate(this.email, Fields.email) : ""}
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
