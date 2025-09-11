import { _ as _export_sfc, D as DashboardConfigurationStore, A as fetchPost, c as createElementBlock, b as createBaseVNode, d as createVNode, f as createTextVNode, t as toDisplayString, e as createCommentVNode, m as withDirectives, y as vModelText, a as openBlock, k as resolveComponent } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main = {
  name: "setup",
  components: { LocaleText },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  data() {
    return {
      setup: {
        username: "",
        newPassword: "",
        repeatNewPassword: "",
        enable_totp: true
      },
      loading: false,
      errorMessage: "",
      done: false
    };
  },
  computed: {
    goodToSubmit() {
      return this.setup.username && this.setup.newPassword.length >= 8 && this.setup.repeatNewPassword.length >= 8 && this.setup.newPassword === this.setup.repeatNewPassword;
    }
  },
  methods: {
    submit() {
      this.loading = true;
      fetchPost("/api/Welcome_Finish", this.setup, (res) => {
        if (res.status) {
          this.done = true;
          this.$router.push("/2FASetup");
        } else {
          document.querySelectorAll("#createAccount input").forEach((x) => x.classList.add("is-invalid"));
          this.errorMessage = res.message;
          document.querySelector(".login-container-fluid").scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }
        this.loading = false;
      });
    }
  }
};
const _hoisted_1 = ["data-bs-theme"];
const _hoisted_2 = {
  class: "m-auto text-body",
  style: { "width": "500px" }
};
const _hoisted_3 = { class: "dashboardLogo display-4" };
const _hoisted_4 = { class: "mb-5" };
const _hoisted_5 = {
  key: 0,
  class: "alert alert-danger"
};
const _hoisted_6 = { class: "d-flex flex-column gap-3" };
const _hoisted_7 = {
  id: "createAccount",
  class: "d-flex flex-column gap-2"
};
const _hoisted_8 = { class: "form-group text-body" };
const _hoisted_9 = {
  for: "username",
  class: "mb-1 text-muted"
};
const _hoisted_10 = { class: "form-group text-body" };
const _hoisted_11 = {
  for: "password",
  class: "mb-1 text-muted"
};
const _hoisted_12 = { class: "form-group text-body" };
const _hoisted_13 = {
  for: "confirmPassword",
  class: "mb-1 text-muted"
};
const _hoisted_14 = ["disabled"];
const _hoisted_15 = {
  key: 0,
  class: "d-flex align-items-center w-100"
};
const _hoisted_16 = {
  key: 1,
  class: "d-flex align-items-center w-100"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: "container-fluid login-container-fluid d-flex main pt-5 overflow-scroll",
    "data-bs-theme": this.store.Configuration.Server.dashboard_theme
  }, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("span", _hoisted_3, [
        createVNode(_component_LocaleText, { t: "Nice to meet you!" })
      ]),
      createBaseVNode("p", _hoisted_4, [
        createVNode(_component_LocaleText, { t: "Please fill in the following fields to finish setup" }),
        _cache[4] || (_cache[4] = createTextVNode(" 😊"))
      ]),
      createBaseVNode("div", null, [
        createBaseVNode("h3", null, [
          createVNode(_component_LocaleText, { t: "Create an account" })
        ]),
        this.errorMessage ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(this.errorMessage), 1)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("form", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("label", _hoisted_9, [
                createBaseVNode("small", null, [
                  createVNode(_component_LocaleText, { t: "Enter an username you like" })
                ])
              ]),
              withDirectives(createBaseVNode("input", {
                type: "text",
                autocomplete: "username",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.setup.username = $event),
                class: "form-control",
                id: "username",
                name: "username",
                required: ""
              }, null, 512), [
                [vModelText, this.setup.username]
              ])
            ]),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("label", _hoisted_11, [
                createBaseVNode("small", null, [
                  createVNode(_component_LocaleText, { t: "Enter a password" }),
                  createBaseVNode("code", null, [
                    createVNode(_component_LocaleText, { t: "(At least 8 characters and make sure is strong enough!)" })
                  ])
                ])
              ]),
              withDirectives(createBaseVNode("input", {
                type: "password",
                autocomplete: "new-password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.setup.newPassword = $event),
                class: "form-control",
                id: "password",
                name: "password",
                required: ""
              }, null, 512), [
                [vModelText, this.setup.newPassword]
              ])
            ]),
            createBaseVNode("div", _hoisted_12, [
              createBaseVNode("label", _hoisted_13, [
                createBaseVNode("small", null, [
                  createVNode(_component_LocaleText, { t: "Confirm password" })
                ])
              ]),
              withDirectives(createBaseVNode("input", {
                type: "password",
                autocomplete: "confirm-new-password",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.setup.repeatNewPassword = $event),
                class: "form-control",
                id: "confirmPassword",
                name: "confirmPassword",
                required: ""
              }, null, 512), [
                [vModelText, this.setup.repeatNewPassword]
              ])
            ])
          ]),
          createBaseVNode("button", {
            class: "btn btn-dark btn-lg mb-5 d-flex btn-brand shadow align-items-center",
            ref: "signInBtn",
            disabled: !this.goodToSubmit || this.loading || this.done,
            onClick: _cache[3] || (_cache[3] = ($event) => this.submit())
          }, [
            !this.loading && !this.done ? (openBlock(), createElementBlock("span", _hoisted_15, [
              createVNode(_component_LocaleText, { t: "Next" }),
              _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-chevron-right ms-auto" }, null, -1))
            ])) : (openBlock(), createElementBlock("span", _hoisted_16, [
              createVNode(_component_LocaleText, { t: "Saving..." }),
              _cache[6] || (_cache[6] = createBaseVNode("span", {
                class: "spinner-border ms-auto spinner-border-sm",
                role: "status"
              }, [
                createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
              ], -1))
            ]))
          ], 8, _hoisted_14)
        ])
      ])
    ])
  ], 8, _hoisted_1);
}
const setup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  setup as default
};
