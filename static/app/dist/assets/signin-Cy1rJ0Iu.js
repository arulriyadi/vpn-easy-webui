import { _ as _export_sfc, G as GetLocale, a as openBlock, c as createElementBlock, b as createBaseVNode, m as withDirectives, y as vModelText, n as normalizeClass, t as toDisplayString, D as DashboardConfigurationStore, d as createVNode, F as Fragment, h as renderList, i as createBlock, e as createCommentVNode, k as resolveComponent, a3 as vModelDynamic, g as fetchGet, A as fetchPost, v as vModelCheckbox, f as createTextVNode, w as withCtx, T as TransitionGroup } from "./index-xvqfLBaG.js";
import { M as Message } from "./message-DVfFTRqS.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main$4 = {
  name: "RemoteServer",
  props: {
    server: Object
  },
  data() {
    return {
      active: false,
      startTime: void 0,
      endTime: void 0,
      errorMsg: "",
      refreshing: false
    };
  },
  methods: {
    async handshake() {
      this.active = false;
      if (this.server.host && this.server.apiKey) {
        this.refreshing = true;
        this.startTime = void 0;
        this.endTime = void 0;
        this.startTime = dayjs();
        await fetch(`${this.server.host}/api/handshake`, {
          headers: {
            "content-type": "application/json",
            "wg-dashboard-apikey": this.server.apiKey
          },
          method: "GET",
          signal: AbortSignal.timeout(5e3)
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error(res.statusText);
        }).then(() => {
          this.endTime = dayjs();
          this.active = true;
        }).catch((res) => {
          this.active = false;
          this.errorMsg = res;
        });
        this.refreshing = false;
      }
    },
    async connect() {
      await fetch(`${this.server.host}/api/authenticate`, {
        headers: {
          "content-type": "application/json",
          "wg-dashboard-apikey": this.server.apiKey
        },
        body: JSON.stringify({
          host: window.location.hostname
        }),
        method: "POST",
        signal: AbortSignal.timeout(5e3)
      }).then((res) => res.json()).then((res) => {
        this.$emit("setActiveServer");
        this.$router.push("/");
      });
    }
  },
  mounted() {
    this.handshake();
  },
  computed: {
    getHandshakeTime() {
      if (this.startTime && this.endTime) {
        return `${dayjs().subtract(this.startTime).millisecond()}ms`;
      } else {
        if (this.refreshing) {
          return GetLocale(`Pinging...`);
        }
        return this.errorMsg ? this.errorMsg : "N/A";
      }
    }
  }
};
const _hoisted_1$4 = { class: "card rounded-3" };
const _hoisted_2$2 = { class: "card-body" };
const _hoisted_3$2 = { class: "d-flex gap-3 w-100 remoteServerContainer" };
const _hoisted_4$2 = { class: "d-flex gap-3 align-items-center flex-grow-1" };
const _hoisted_5$2 = { class: "d-flex gap-3 align-items-center flex-grow-1" };
const _hoisted_6$1 = { class: "d-flex gap-2 button-group" };
const _hoisted_7$1 = { class: "card-footer gap-2 d-flex align-items-center" };
const _hoisted_8$1 = {
  key: 0,
  class: "spin ms-auto text-primary-emphasis"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createBaseVNode("div", _hoisted_2$2, [
      createBaseVNode("div", _hoisted_3$2, [
        createBaseVNode("div", _hoisted_4$2, [
          _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-server" }, null, -1)),
          withDirectives(createBaseVNode("input", {
            class: "form-control form-control-sm",
            onBlur: _cache[0] || (_cache[0] = ($event) => this.handshake()),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.server.host = $event),
            type: "url"
          }, null, 544), [
            [vModelText, this.server.host]
          ])
        ]),
        createBaseVNode("div", _hoisted_5$2, [
          _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-key-fill" }, null, -1)),
          withDirectives(createBaseVNode("input", {
            class: "form-control form-control-sm",
            onBlur: _cache[2] || (_cache[2] = ($event) => this.handshake()),
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.server.apiKey = $event),
            type: "text"
          }, null, 544), [
            [vModelText, this.server.apiKey]
          ])
        ]),
        createBaseVNode("div", _hoisted_6$1, [
          createBaseVNode("button", {
            onClick: _cache[4] || (_cache[4] = ($event) => this.$emit("delete")),
            class: "ms-auto btn btn-sm bg-danger-subtle text-danger-emphasis border-1 border-danger-subtle"
          }, _cache[9] || (_cache[9] = [
            createBaseVNode("i", { class: "bi bi-trash" }, null, -1)
          ])),
          createBaseVNode("button", {
            onClick: _cache[5] || (_cache[5] = ($event) => this.connect()),
            class: normalizeClass([{ disabled: !this.active }, "ms-auto btn btn-sm bg-success-subtle text-success-emphasis border-1 border-success-subtle"])
          }, _cache[10] || (_cache[10] = [
            createBaseVNode("i", { class: "bi bi-arrow-right-circle" }, null, -1)
          ]), 2)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_7$1, [
      createBaseVNode("span", {
        class: normalizeClass(["dot ms-0 me-2", [this.active ? "active" : "inactive"]])
      }, null, 2),
      createBaseVNode("small", null, toDisplayString(this.getHandshakeTime), 1),
      this.refreshing ? (openBlock(), createElementBlock("div", _hoisted_8$1, _cache[11] || (_cache[11] = [
        createBaseVNode("i", { class: "bi bi-arrow-clockwise" }, null, -1)
      ]))) : (openBlock(), createElementBlock("a", {
        key: 1,
        role: "button",
        onClick: _cache[6] || (_cache[6] = ($event) => this.handshake()),
        class: "text-primary-emphasis text-decoration-none ms-auto disabled"
      }, _cache[12] || (_cache[12] = [
        createBaseVNode("i", { class: "bi bi-arrow-clockwise me" }, null, -1)
      ])))
    ])
  ]);
}
const RemoteServer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-ed7817c7"]]);
const _sfc_main$3 = {
  name: "RemoteServerList",
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  components: { LocaleText, RemoteServer }
};
const _hoisted_1$3 = { class: "w-100 mt-3" };
const _hoisted_2$1 = { class: "d-flex align-items-center mb-3" };
const _hoisted_3$1 = { class: "mb-0" };
const _hoisted_4$1 = {
  class: "w-100 d-flex gap-3 flex-column p-3 border border-1 border-secondary-subtle rounded-3",
  style: { "height": "400px", "overflow-y": "scroll" }
};
const _hoisted_5$1 = {
  key: 0,
  class: "text-muted m-auto"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_RemoteServer = resolveComponent("RemoteServer");
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createBaseVNode("div", _hoisted_2$1, [
      createBaseVNode("h5", _hoisted_3$1, [
        createVNode(_component_LocaleText, { t: "Server List" })
      ]),
      createBaseVNode("button", {
        onClick: _cache[0] || (_cache[0] = ($event) => this.store.addCrossServerConfiguration()),
        class: "btn bg-primary-subtle text-primary-emphasis border-1 border-primary-subtle shadow-sm ms-auto"
      }, [
        _cache[1] || (_cache[1] = createBaseVNode("i", { class: "bi bi-plus-circle-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Server" })
      ])
    ]),
    createBaseVNode("div", _hoisted_4$1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(this.store.CrossServerConfiguration.ServerList, (server, key) => {
        return openBlock(), createBlock(_component_RemoteServer, {
          onSetActiveServer: ($event) => this.store.setActiveCrossServer(key),
          onDelete: ($event) => this.store.deleteCrossServerConfiguration(key),
          key,
          server
        }, null, 8, ["onSetActiveServer", "onDelete", "server"]);
      }), 128)),
      Object.keys(this.store.CrossServerConfiguration.ServerList).length === 0 ? (openBlock(), createElementBlock("h6", _hoisted_5$1, [
        createVNode(_component_LocaleText, { t: "Click" }),
        _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-plus-circle-fill mx-1" }, null, -1)),
        createVNode(_component_LocaleText, { t: "to add your server" })
      ])) : createCommentVNode("", true)
    ])
  ]);
}
const RemoteServerList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  name: "signInInput",
  methods: { GetLocale },
  props: {
    id: "",
    data: "",
    type: "",
    placeholder: ""
  },
  computed: {
    getLocaleText() {
      return GetLocale(this.placeholder);
    }
  }
};
const _hoisted_1$2 = ["type", "id", "name", "placeholder"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("input", {
    type: $props.type,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data[this.id] = $event),
    class: "form-control rounded-3",
    id: this.id,
    name: this.id,
    autocomplete: "on",
    placeholder: this.getLocaleText,
    required: ""
  }, null, 8, _hoisted_1$2)), [
    [vModelDynamic, this.data[this.id]]
  ]);
}
const SignInInput = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  name: "signInTOTP",
  methods: { GetLocale },
  props: {
    data: ""
  },
  computed: {
    getLocaleText() {
      return GetLocale("OTP from your authenticator");
    }
  }
};
const _hoisted_1$1 = ["placeholder"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("input", {
    class: "form-control totp",
    required: "",
    id: "totp",
    maxlength: "6",
    type: "text",
    inputmode: "numeric",
    autocomplete: "one-time-code",
    placeholder: this.getLocaleText,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.totp = $event)
  }, null, 8, _hoisted_1$1)), [
    [vModelText, this.data.totp]
  ]);
}
const SignInTOTP = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  name: "signin",
  components: { SignInTOTP, SignInInput, LocaleText, RemoteServerList, Message },
  async setup() {
    const store = DashboardConfigurationStore();
    let theme = "dark";
    let totpEnabled = false;
    let version = void 0;
    if (!store.IsElectronApp) {
      await Promise.all([
        fetchGet("/api/getDashboardTheme", {}, (res) => {
          theme = res.data;
        }),
        fetchGet("/api/isTotpEnabled", {}, (res) => {
          totpEnabled = res.data;
        }),
        fetchGet("/api/getDashboardVersion", {}, (res) => {
          version = res.data;
        })
      ]);
    }
    store.removeActiveCrossServer();
    return { store, theme, totpEnabled, version };
  },
  data() {
    return {
      data: {
        username: "",
        password: "",
        totp: ""
      },
      loginError: false,
      loginErrorMessage: "",
      loading: false
    };
  },
  computed: {
    getMessages() {
      return this.store.Messages.filter((x) => x.show);
    },
    applyLocale(key) {
      return GetLocale(key);
    },
    formValid() {
      return this.data.username && this.data.password && (this.totpEnabled && this.data.totp || !this.totpEnabled);
    }
  },
  methods: {
    GetLocale,
    async auth() {
      if (this.formValid) {
        this.loading = true;
        await fetchPost("/api/authenticate", this.data, (response) => {
          if (response.status) {
            this.loginError = false;
            this.$refs["signInBtn"].classList.add("signedIn");
            if (response.message) {
              this.$router.push("/welcome");
            } else {
              if (this.store.Redirect !== void 0) {
                this.$router.push(this.store.Redirect);
              } else {
                this.$router.push("/");
              }
            }
          } else {
            this.store.newMessage("Server", response.message, "danger");
            document.querySelectorAll("input[required]").forEach((x) => {
              x.classList.remove("is-valid");
              x.classList.add("is-invalid");
            });
            this.loading = false;
          }
        });
      } else {
        document.querySelectorAll("input[required]").forEach((x) => {
          if (x.value.length === 0) {
            x.classList.remove("is-valid");
            x.classList.add("is-invalid");
          } else {
            x.classList.remove("is-invalid");
            x.classList.add("is-valid");
          }
        });
      }
    }
  }
};
const _hoisted_1 = ["data-bs-theme"];
const _hoisted_2 = { class: "login-box m-auto" };
const _hoisted_3 = {
  class: "m-auto signInContainer",
  style: { "width": "700px" }
};
const _hoisted_4 = { class: "mb-0 text-body" };
const _hoisted_5 = { class: "form-floating mb-2" };
const _hoisted_6 = ["disabled"];
const _hoisted_7 = {
  for: "floatingInput",
  class: "d-flex"
};
const _hoisted_8 = { class: "form-floating mb-2" };
const _hoisted_9 = ["disabled"];
const _hoisted_10 = {
  for: "floatingInput",
  class: "d-flex"
};
const _hoisted_11 = {
  key: 0,
  class: "form-floating mb-2"
};
const _hoisted_12 = ["disabled"];
const _hoisted_13 = {
  for: "floatingInput",
  class: "d-flex"
};
const _hoisted_14 = ["disabled"];
const _hoisted_15 = {
  key: 0,
  class: "d-flex w-100"
};
const _hoisted_16 = {
  key: 1,
  class: "d-flex w-100 align-items-center"
};
const _hoisted_17 = {
  key: 2,
  class: "d-flex mt-3"
};
const _hoisted_18 = { class: "form-check form-switch ms-auto" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = {
  class: "form-check-label",
  for: "flexSwitchCheckChecked"
};
const _hoisted_21 = { class: "text-muted pb-3 d-block w-100 text-center mt-3" };
const _hoisted_22 = { class: "messageCentre text-body position-absolute d-flex" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_RemoteServerList = resolveComponent("RemoteServerList");
  const _component_Message = resolveComponent("Message");
  return openBlock(), createElementBlock("div", {
    class: "container-fluid login-container-fluid d-flex main flex-column py-4 text-body h-100",
    style: { "overflow-y": "scroll" },
    "data-bs-theme": this.theme
  }, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("h4", _hoisted_4, [
          createVNode(_component_LocaleText, { t: "Welcome to" })
        ]),
        _cache[10] || (_cache[10] = createBaseVNode("span", { class: "dashboardLogo display-3" }, [
          createBaseVNode("strong", null, "WGDashboard")
        ], -1)),
        !this.store.CrossServerConfiguration.Enable ? (openBlock(), createElementBlock("form", {
          key: 0,
          onSubmit: _cache[3] || (_cache[3] = (e) => {
            e.preventDefault();
            this.auth();
          }),
          class: "mt-3"
        }, [
          createBaseVNode("div", _hoisted_5, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              required: "",
              disabled: $data.loading,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.username = $event),
              name: "username",
              autocomplete: "username",
              autofocus: "",
              class: "form-control rounded-3",
              id: "username",
              placeholder: "Username"
            }, null, 8, _hoisted_6), [
              [vModelText, this.data.username]
            ]),
            createBaseVNode("label", _hoisted_7, [
              _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-person-circle me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Username" })
            ])
          ]),
          createBaseVNode("div", _hoisted_8, [
            withDirectives(createBaseVNode("input", {
              type: "password",
              required: "",
              disabled: $data.loading,
              autocomplete: "current-password",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.data.password = $event),
              class: "form-control rounded-3",
              id: "password",
              placeholder: "Password"
            }, null, 8, _hoisted_9), [
              [vModelText, this.data.password]
            ]),
            createBaseVNode("label", _hoisted_10, [
              _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-key-fill me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Password" })
            ])
          ]),
          this.totpEnabled ? (openBlock(), createElementBlock("div", _hoisted_11, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              id: "totp",
              required: "",
              disabled: $data.loading,
              placeholder: "totp",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.data.totp = $event),
              class: "form-control rounded-3",
              maxlength: "6",
              inputmode: "numeric",
              autocomplete: "one-time-code"
            }, null, 8, _hoisted_12), [
              [vModelText, this.data.totp]
            ]),
            createBaseVNode("label", _hoisted_13, [
              _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-lock-fill me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "OTP from your authenticator" })
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("button", {
            class: "btn btn-lg btn-dark ms-auto mt-5 w-100 d-flex btn-brand signInBtn rounded-3",
            disabled: this.loading || !this.formValid,
            ref: "signInBtn"
          }, [
            !this.loading ? (openBlock(), createElementBlock("span", _hoisted_15, [
              createVNode(_component_LocaleText, { t: "Sign In" }),
              _cache[8] || (_cache[8] = createBaseVNode("i", { class: "ms-auto bi bi-chevron-right" }, null, -1))
            ])) : (openBlock(), createElementBlock("span", _hoisted_16, [
              createVNode(_component_LocaleText, { t: "Signing In..." }),
              _cache[9] || (_cache[9] = createBaseVNode("span", {
                class: "spinner-border ms-auto spinner-border-sm",
                role: "status"
              }, null, -1))
            ]))
          ], 8, _hoisted_14)
        ], 32)) : (openBlock(), createBlock(_component_RemoteServerList, { key: 1 })),
        !this.store.IsElectronApp ? (openBlock(), createElementBlock("div", _hoisted_17, [
          createBaseVNode("div", _hoisted_18, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => this.store.CrossServerConfiguration.Enable = $event),
              disabled: $data.loading,
              class: "form-check-input",
              type: "checkbox",
              role: "switch",
              id: "flexSwitchCheckChecked"
            }, null, 8, _hoisted_19), [
              [vModelCheckbox, this.store.CrossServerConfiguration.Enable]
            ]),
            createBaseVNode("label", _hoisted_20, [
              createVNode(_component_LocaleText, { t: "Access Remote Server" })
            ])
          ])
        ])) : createCommentVNode("", true)
      ])
    ]),
    createBaseVNode("small", _hoisted_21, [
      createTextVNode(" WGDashboard " + toDisplayString(this.version) + " | Developed with ❤️ by ", 1),
      _cache[11] || (_cache[11] = createBaseVNode("a", {
        href: "https://github.com/donaldzou",
        target: "_blank"
      }, [
        createBaseVNode("strong", null, "Donald Zou")
      ], -1))
    ]),
    createBaseVNode("div", _hoisted_22, [
      createVNode(TransitionGroup, {
        name: "message",
        tag: "div",
        class: "position-relative flex-sm-grow-0 flex-grow-1 d-flex align-items-end ms-sm-auto flex-column gap-2"
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($options.getMessages.slice().reverse(), (m) => {
            return openBlock(), createBlock(_component_Message, {
              message: m,
              key: m.id
            }, null, 8, ["message"]);
          }), 128))
        ]),
        _: 1
      })
    ])
  ], 8, _hoisted_1);
}
const signin = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-80e20da4"]]);
export {
  signin as default
};
