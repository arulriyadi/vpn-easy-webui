import { _ as _export_sfc, D as DashboardConfigurationStore, z as v4, A as fetchPost, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, m as withDirectives, y as vModelText, n as normalizeClass, t as toDisplayString, e as createCommentVNode, k as resolveComponent, W as WireguardConfigurationsStore, f as createTextVNode, v as vModelCheckbox, i as createBlock, F as Fragment, g as fetchGet, w as withCtx, h as renderList, T as TransitionGroup, j as Transition, r as ref, q as computed, o as onMounted, u as unref, B as vModelSelect } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { V as Vn } from "./vue-datepicker-CvNbCtAl.js";
const _sfc_main$e = {
  components: { LocaleText },
  props: {
    targetData: String,
    title: String,
    warning: false,
    warningText: ""
  },
  setup() {
    const store = DashboardConfigurationStore();
    const uuid = `input_${v4()}`;
    return { store, uuid };
  },
  data() {
    return {
      value: "",
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0,
      changed: false,
      updating: false
    };
  },
  mounted() {
    this.value = this.store.Configuration.Peers[this.targetData];
  },
  methods: {
    async useValidation() {
      if (this.changed) {
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Peers",
          key: this.targetData,
          value: this.value
        }, (res) => {
          if (res.status) {
            this.isValid = true;
            this.showInvalidFeedback = false;
            this.store.Configuration.Peers[this.targetData] = this.value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.isValid = false, 5e3);
          } else {
            this.isValid = false;
            this.showInvalidFeedback = true;
            this.invalidFeedback = res.message;
          }
          this.changed = false;
          this.updating = false;
        });
      }
    }
  }
};
const _hoisted_1$e = { class: "form-group mb-2" };
const _hoisted_2$e = ["for"];
const _hoisted_3$d = ["id", "disabled"];
const _hoisted_4$c = { class: "invalid-feedback" };
const _hoisted_5$b = {
  key: 0,
  class: "px-2 py-1 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-2 d-inline-block mt-1"
};
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1$e, [
    createBaseVNode("label", {
      for: this.uuid,
      class: "text-muted mb-1"
    }, [
      createBaseVNode("strong", null, [
        createBaseVNode("small", null, [
          createVNode(_component_LocaleText, {
            t: this.title
          }, null, 8, ["t"])
        ])
      ])
    ], 8, _hoisted_2$e),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
      id: this.uuid,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.value = $event),
      onKeydown: _cache[1] || (_cache[1] = ($event) => this.changed = true),
      onBlur: _cache[2] || (_cache[2] = ($event) => $options.useValidation()),
      disabled: this.updating
    }, null, 42, _hoisted_3$d), [
      [vModelText, this.value]
    ]),
    createBaseVNode("div", _hoisted_4$c, toDisplayString(this.invalidFeedback), 1),
    $props.warning ? (openBlock(), createElementBlock("div", _hoisted_5$b, [
      createBaseVNode("small", null, [
        _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: $props.warningText }, null, 8, ["t"])
      ])
    ])) : createCommentVNode("", true)
  ]);
}
const PeersDefaultSettingsInput = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$c]]);
const ipV46RegexCheck = (input) => {
};
const _sfc_main$d = {
  name: "accountSettingsInputUsername",
  components: { LocaleText },
  props: {
    targetData: String,
    title: String
  },
  setup() {
    const store = DashboardConfigurationStore();
    const uuid = `input_${v4()}`;
    return { store, uuid };
  },
  data() {
    return {
      value: "",
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0,
      changed: false,
      updating: false
    };
  },
  mounted() {
    this.value = this.store.Configuration.Account[this.targetData];
  },
  methods: {
    async useValidation(e) {
      if (this.changed) {
        this.updating = true;
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Account",
          key: this.targetData,
          value: this.value
        }, (res) => {
          if (res.status) {
            this.isValid = true;
            this.showInvalidFeedback = false;
            this.store.Configuration.Account[this.targetData] = this.value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.isValid = false, 5e3);
          } else {
            this.isValid = false;
            this.showInvalidFeedback = true;
            this.invalidFeedback = res.message;
          }
          this.changed = false;
          this.updating = false;
        });
      }
    }
  }
};
const _hoisted_1$d = { class: "form-group mb-2" };
const _hoisted_2$d = ["for"];
const _hoisted_3$c = ["id", "disabled"];
const _hoisted_4$b = { class: "invalid-feedback" };
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1$d, [
    createBaseVNode("label", {
      for: this.uuid,
      class: "text-muted mb-1"
    }, [
      createBaseVNode("strong", null, [
        createBaseVNode("small", null, [
          createVNode(_component_LocaleText, {
            t: this.title
          }, null, 8, ["t"])
        ])
      ])
    ], 8, _hoisted_2$d),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
      id: this.uuid,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.value = $event),
      onKeydown: _cache[1] || (_cache[1] = ($event) => this.changed = true),
      onBlur: _cache[2] || (_cache[2] = ($event) => $options.useValidation()),
      disabled: this.updating
    }, null, 42, _hoisted_3$c), [
      [vModelText, this.value]
    ]),
    createBaseVNode("div", _hoisted_4$b, toDisplayString(this.invalidFeedback), 1)
  ]);
}
const AccountSettingsInputUsername = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$b]]);
const _sfc_main$c = {
  name: "accountSettingsInputPassword",
  components: { LocaleText },
  props: {
    targetData: String,
    warning: false,
    warningText: ""
  },
  setup() {
    const store = DashboardConfigurationStore();
    const uuid = `input_${v4()}`;
    return { store, uuid };
  },
  data() {
    return {
      value: {
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: ""
      },
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0
    };
  },
  methods: {
    async useValidation() {
      if (Object.values(this.value).find((x) => x.length === 0) === void 0) {
        if (this.value.newPassword === this.value.repeatNewPassword) {
          await fetchPost("/api/updateDashboardConfigurationItem", {
            section: "Account",
            key: this.targetData,
            value: this.value
          }, (res) => {
            if (res.status) {
              this.isValid = true;
              this.showInvalidFeedback = false;
              this.store.Configuration.Account[this.targetData] = this.value;
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.isValid = false;
                this.value = {
                  currentPassword: "",
                  newPassword: "",
                  repeatNewPassword: ""
                };
              }, 5e3);
            } else {
              this.isValid = false;
              this.showInvalidFeedback = true;
              this.invalidFeedback = res.message;
            }
          });
        } else {
          this.showInvalidFeedback = true;
          this.invalidFeedback = "New passwords does not match";
        }
      } else {
        this.showInvalidFeedback = true;
        this.invalidFeedback = "Please fill in all required fields.";
      }
    }
  },
  computed: {
    passwordValid() {
      return Object.values(this.value).find((x) => x.length === 0) === void 0 && this.value.newPassword === this.value.repeatNewPassword;
    }
  }
};
const _hoisted_1$c = { class: "d-flex flex-column gap-2" };
const _hoisted_2$c = { class: "row g-2" };
const _hoisted_3$b = { class: "col-sm" };
const _hoisted_4$a = { class: "form-group" };
const _hoisted_5$a = ["for"];
const _hoisted_6$a = ["id"];
const _hoisted_7$9 = {
  key: 0,
  class: "invalid-feedback d-block"
};
const _hoisted_8$9 = { class: "col-sm" };
const _hoisted_9$7 = { class: "form-group" };
const _hoisted_10$6 = ["for"];
const _hoisted_11$5 = ["id"];
const _hoisted_12$4 = { class: "col-sm" };
const _hoisted_13$3 = { class: "form-group" };
const _hoisted_14$3 = ["for"];
const _hoisted_15$2 = ["id"];
const _hoisted_16$2 = ["disabled"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("form", _hoisted_1$c, [
    createBaseVNode("div", _hoisted_2$c, [
      createBaseVNode("div", _hoisted_3$b, [
        createBaseVNode("div", _hoisted_4$a, [
          createBaseVNode("label", {
            for: "currentPassword_" + this.uuid,
            class: "text-muted mb-1"
          }, [
            createBaseVNode("strong", null, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Current Password" })
              ])
            ])
          ], 8, _hoisted_5$a),
          withDirectives(createBaseVNode("input", {
            type: "password",
            class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
            autocomplete: "current-password",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.value.currentPassword = $event),
            id: "currentPassword_" + this.uuid
          }, null, 10, _hoisted_6$a), [
            [vModelText, this.value.currentPassword]
          ]),
          $data.showInvalidFeedback ? (openBlock(), createElementBlock("div", _hoisted_7$9, toDisplayString(this.invalidFeedback), 1)) : createCommentVNode("", true)
        ])
      ]),
      createBaseVNode("div", _hoisted_8$9, [
        createBaseVNode("div", _hoisted_9$7, [
          createBaseVNode("label", {
            for: "newPassword_" + this.uuid,
            class: "text-muted mb-1"
          }, [
            createBaseVNode("strong", null, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "New Password" })
              ])
            ])
          ], 8, _hoisted_10$6),
          withDirectives(createBaseVNode("input", {
            type: "password",
            class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
            autocomplete: "new-password",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.value.newPassword = $event),
            id: "newPassword_" + this.uuid
          }, null, 10, _hoisted_11$5), [
            [vModelText, this.value.newPassword]
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_12$4, [
        createBaseVNode("div", _hoisted_13$3, [
          createBaseVNode("label", {
            for: "repeatNewPassword_" + this.uuid,
            class: "text-muted mb-1"
          }, [
            createBaseVNode("strong", null, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Repeat New Password" })
              ])
            ])
          ], 8, _hoisted_14$3),
          withDirectives(createBaseVNode("input", {
            type: "password",
            class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
            autocomplete: "new-password",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.value.repeatNewPassword = $event),
            id: "repeatNewPassword_" + this.uuid
          }, null, 10, _hoisted_15$2), [
            [vModelText, this.value.repeatNewPassword]
          ])
        ])
      ])
    ]),
    createBaseVNode("button", {
      disabled: !this.passwordValid,
      class: "ms-auto btn bg-success-subtle text-success-emphasis border-1 border-success-subtle rounded-3 shadow-sm",
      onClick: _cache[3] || (_cache[3] = ($event) => this.useValidation())
    }, [
      _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-save2-fill me-2" }, null, -1)),
      createVNode(_component_LocaleText, { t: "Update Password" })
    ], 8, _hoisted_16$2)
  ]);
}
const AccountSettingsInputPassword = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$a]]);
const _sfc_main$b = {
  name: "dashboardSettingsInputWireguardConfigurationPath",
  components: { LocaleText },
  props: {
    targetData: String,
    title: String,
    warning: false,
    warningText: ""
  },
  setup() {
    const store = DashboardConfigurationStore();
    const WireguardConfigurationStore = WireguardConfigurationsStore();
    const uuid = `input_${v4()}`;
    return { store, uuid, WireguardConfigurationStore };
  },
  data() {
    return {
      value: "",
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0,
      changed: false,
      updating: false
    };
  },
  mounted() {
    this.value = this.store.Configuration.Server[this.targetData];
  },
  methods: {
    async useValidation() {
      if (this.changed) {
        this.updating = true;
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Server",
          key: this.targetData,
          value: this.value
        }, (res) => {
          if (res.status) {
            this.isValid = true;
            this.showInvalidFeedback = false;
            this.store.Configuration.Account[this.targetData] = this.value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.isValid = false, 5e3);
            this.WireguardConfigurationStore.getConfigurations();
            this.store.newMessage("Server", "WireGuard configuration path saved", "success");
          } else {
            this.isValid = false;
            this.showInvalidFeedback = true;
            this.invalidFeedback = res.message;
          }
          this.changed = false;
          this.updating = false;
        });
      }
    }
  }
};
const _hoisted_1$b = { class: "card" };
const _hoisted_2$b = { class: "card-header" };
const _hoisted_3$a = { class: "my-2" };
const _hoisted_4$9 = { class: "card-body" };
const _hoisted_5$9 = { class: "form-group" };
const _hoisted_6$9 = ["for"];
const _hoisted_7$8 = { class: "d-flex gap-2 align-items-start" };
const _hoisted_8$8 = { class: "flex-grow-1" };
const _hoisted_9$6 = ["id", "disabled"];
const _hoisted_10$5 = { class: "invalid-feedback fw-bold" };
const _hoisted_11$4 = ["disabled"];
const _hoisted_12$3 = {
  key: 0,
  class: "bi bi-save2-fill"
};
const _hoisted_13$2 = {
  key: 1,
  class: "spinner-border spinner-border-sm"
};
const _hoisted_14$2 = {
  key: 0,
  class: "px-2 py-1 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-2 d-inline-block mt-1 mb-2"
};
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    createBaseVNode("div", _hoisted_2$b, [
      createBaseVNode("h6", _hoisted_3$a, [
        createVNode(_component_LocaleText, { t: "Path" })
      ])
    ]),
    createBaseVNode("div", _hoisted_4$9, [
      createBaseVNode("div", _hoisted_5$9, [
        createBaseVNode("label", {
          for: this.uuid,
          class: "text-muted mb-1"
        }, [
          createBaseVNode("strong", null, [
            createBaseVNode("small", null, [
              createVNode(_component_LocaleText, {
                t: this.title
              }, null, 8, ["t"])
            ])
          ])
        ], 8, _hoisted_6$9),
        createBaseVNode("div", _hoisted_7$8, [
          createBaseVNode("div", _hoisted_8$8, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: normalizeClass(["form-control rounded-3", { "is-invalid": this.showInvalidFeedback, "is-valid": this.isValid }]),
              id: this.uuid,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.value = $event),
              onKeydown: _cache[1] || (_cache[1] = ($event) => this.changed = true),
              disabled: this.updating
            }, null, 42, _hoisted_9$6), [
              [vModelText, this.value]
            ]),
            createBaseVNode("div", _hoisted_10$5, toDisplayString(this.invalidFeedback), 1)
          ]),
          createBaseVNode("button", {
            onClick: _cache[2] || (_cache[2] = ($event) => this.useValidation()),
            disabled: !this.changed,
            class: "ms-auto btn rounded-3 border-success-subtle bg-success-subtle text-success-emphasis"
          }, [
            !this.updating ? (openBlock(), createElementBlock("i", _hoisted_12$3)) : (openBlock(), createElementBlock("span", _hoisted_13$2))
          ], 8, _hoisted_11$4)
        ]),
        $props.warning ? (openBlock(), createElementBlock("div", _hoisted_14$2, [
          createBaseVNode("small", null, [
            _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: $props.warningText }, null, 8, ["t"])
          ])
        ])) : createCommentVNode("", true)
      ])
    ])
  ]);
}
const DashboardSettingsInputWireguardConfigurationPath = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$9]]);
const _sfc_main$a = {
  name: "dashboardTheme",
  components: { LocaleText },
  setup() {
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { dashboardConfigurationStore };
  },
  methods: {
    async switchTheme(value) {
      await fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Server",
        key: "dashboard_theme",
        value
      }, (res) => {
        if (res.status) {
          this.dashboardConfigurationStore.Configuration.Server.dashboard_theme = value;
        }
      });
    }
  }
};
const _hoisted_1$a = { class: "text-muted mb-1 d-block" };
const _hoisted_2$a = { class: "d-flex gap-1" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("small", _hoisted_1$a, [
      createBaseVNode("strong", null, [
        createVNode(_component_LocaleText, { t: "Theme" })
      ])
    ]),
    createBaseVNode("div", _hoisted_2$a, [
      createBaseVNode("button", {
        class: normalizeClass(["btn bg-primary-subtle text-primary-emphasis flex-grow-1", { active: this.dashboardConfigurationStore.Configuration.Server.dashboard_theme === "light" }]),
        onClick: _cache[0] || (_cache[0] = ($event) => this.switchTheme("light"))
      }, [
        _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-sun-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Light" })
      ], 2),
      createBaseVNode("button", {
        class: normalizeClass(["btn bg-primary-subtle text-primary-emphasis flex-grow-1", { active: this.dashboardConfigurationStore.Configuration.Server.dashboard_theme === "dark" }]),
        onClick: _cache[1] || (_cache[1] = ($event) => this.switchTheme("dark"))
      }, [
        _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-moon-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Dark" })
      ], 2)
    ])
  ]);
}
const DashboardTheme = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$8]]);
const _sfc_main$9 = {
  name: "dashboardSettingsInputIPAddressAndPort",
  props: {
    // targetData: String,
    // title: String,
    // warning: false,
    // warningText: ""
  },
  setup() {
    const store = DashboardConfigurationStore();
    const uuid = `input_${v4()}`;
    return { store, uuid };
  },
  data() {
    return {
      app_ip: "",
      app_port: "",
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0,
      changed: false,
      updating: false
    };
  },
  mounted() {
    this.app_ip = this.store.Configuration.Server.app_ip;
    this.app_port = this.store.Configuration.Server.app_port;
  },
  methods: {
    async useValidation() {
      if (this.changed) {
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Server",
          key: this.targetData,
          value: this.value
        }, (res) => {
          if (res.status) {
            this.isValid = true;
            this.showInvalidFeedback = false;
            this.store.Configuration.Account[this.targetData] = this.value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.isValid = false, 5e3);
          } else {
            this.isValid = false;
            this.showInvalidFeedback = true;
            this.invalidFeedback = res.message;
          }
        });
      }
    }
  }
};
const _hoisted_1$9 = { class: "invalid-feedback d-block mt-0" };
const _hoisted_2$9 = { class: "row" };
const _hoisted_3$9 = { class: "form-group mb-2 col-sm" };
const _hoisted_4$8 = ["for"];
const _hoisted_5$8 = ["id"];
const _hoisted_6$8 = { class: "form-group col-sm" };
const _hoisted_7$7 = ["for"];
const _hoisted_8$7 = ["id"];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$9, toDisplayString(this.invalidFeedback), 1),
    createBaseVNode("div", _hoisted_2$9, [
      createBaseVNode("div", _hoisted_3$9, [
        createBaseVNode("label", {
          for: "app_ip_" + this.uuid,
          class: "text-muted mb-1"
        }, _cache[2] || (_cache[2] = [
          createBaseVNode("strong", null, [
            createBaseVNode("small", null, "Dashboard IP Address")
          ], -1)
        ]), 8, _hoisted_4$8),
        withDirectives(createBaseVNode("input", {
          type: "text",
          class: "form-control mb-2",
          id: "app_ip_" + this.uuid,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.app_ip = $event)
        }, null, 8, _hoisted_5$8), [
          [vModelText, this.app_ip]
        ]),
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "px-2 py-1 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-2 d-inline-block" }, [
          createBaseVNode("small", null, [
            createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-2" }),
            createBaseVNode("code", null, "0.0.0.0"),
            createTextVNode(" means it can be access by anyone with your server IP Address.")
          ])
        ], -1))
      ]),
      createBaseVNode("div", _hoisted_6$8, [
        createBaseVNode("label", {
          for: "app_port_" + this.uuid,
          class: "text-muted mb-1"
        }, _cache[4] || (_cache[4] = [
          createBaseVNode("strong", null, [
            createBaseVNode("small", null, "Dashboard Port")
          ], -1)
        ]), 8, _hoisted_7$7),
        withDirectives(createBaseVNode("input", {
          type: "text",
          class: "form-control mb-2",
          id: "app_port_" + this.uuid,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.app_port = $event)
        }, null, 8, _hoisted_8$7), [
          [vModelText, this.app_port]
        ])
      ])
    ]),
    _cache[5] || (_cache[5] = createBaseVNode("button", { class: "btn btn-success btn-sm fw-bold rounded-3" }, [
      createBaseVNode("i", { class: "bi bi-floppy-fill me-2" }),
      createTextVNode("Update Dashboard Settings & Restart ")
    ], -1))
  ]);
}
const DashboardSettingsInputIPAddressAndPort = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$7]]);
const _sfc_main$8 = {
  name: "newDashboardAPIKey",
  components: { LocaleText, VueDatePicker: Vn },
  data() {
    return {
      newKeyData: {
        ExpiredAt: dayjs().add(7, "d").format("YYYY-MM-DD HH:mm:ss"),
        NeverExpire: false
      },
      submitting: false
    };
  },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  mounted() {
    console.log(this.newKeyData.ExpiredAt);
  },
  methods: {
    submitNewAPIKey() {
      this.submitting = true;
      fetchPost("/api/newDashboardAPIKey", this.newKeyData, (res) => {
        if (res.status) {
          this.$emit("created", res.data);
          this.store.newMessage("Server", "API Key created", "success");
          this.$emit("close");
        } else {
          this.store.newMessage("Server", res.message, "danger");
        }
        this.submitting = false;
      });
    },
    fixDate(date) {
      console.log(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
      return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
    },
    parseTime(modelData) {
      if (modelData) {
        this.newKeyData.ExpiredAt = dayjs(modelData).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.newKeyData.ExpiredAt = void 0;
      }
    }
  }
};
const _hoisted_1$8 = {
  class: "position-absolute w-100 h-100 top-0 start-0 rounded-bottom-3 p-3 d-flex",
  style: { "background-color": "#00000060", "backdrop-filter": "blur(3px)" }
};
const _hoisted_2$8 = { class: "card m-auto rounded-3 mt-5" };
const _hoisted_3$8 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_4$7 = { class: "mb-0" };
const _hoisted_5$7 = { class: "card-body d-flex gap-2 p-4 flex-column" };
const _hoisted_6$7 = { class: "text-muted" };
const _hoisted_7$6 = { class: "d-flex align-items-center gap-2" };
const _hoisted_8$6 = { class: "form-check" };
const _hoisted_9$5 = ["disabled"];
const _hoisted_10$4 = {
  class: "form-check-label",
  for: "neverExpire"
};
const _hoisted_11$3 = {
  key: 0,
  class: "bi bi-check-lg me-2"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_VueDatePicker = resolveComponent("VueDatePicker");
  return openBlock(), createElementBlock("div", _hoisted_1$8, [
    createBaseVNode("div", _hoisted_2$8, [
      createBaseVNode("div", _hoisted_3$8, [
        createBaseVNode("h6", _hoisted_4$7, [
          createVNode(_component_LocaleText, { t: "Create API Key" })
        ]),
        createBaseVNode("button", {
          type: "button",
          class: "btn-close ms-auto",
          onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
        })
      ]),
      createBaseVNode("div", _hoisted_5$7, [
        createBaseVNode("small", _hoisted_6$7, [
          createVNode(_component_LocaleText, { t: "When should this API Key expire?" })
        ]),
        createBaseVNode("div", _hoisted_7$6, [
          createVNode(_component_VueDatePicker, {
            is24: true,
            "min-date": /* @__PURE__ */ new Date(),
            "model-value": this.newKeyData.ExpiredAt,
            "onUpdate:modelValue": this.parseTime,
            "time-picker-inline": "",
            format: "yyyy-MM-dd HH:mm:ss",
            "preview-format": "yyyy-MM-dd HH:mm:ss",
            clearable: false,
            disabled: this.newKeyData.NeverExpire || this.submitting,
            dark: this.store.Configuration.Server.dashboard_theme === "dark"
          }, null, 8, ["min-date", "model-value", "onUpdate:modelValue", "disabled", "dark"])
        ]),
        createBaseVNode("div", _hoisted_8$6, [
          withDirectives(createBaseVNode("input", {
            class: "form-check-input",
            type: "checkbox",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.newKeyData.NeverExpire = $event),
            id: "neverExpire",
            disabled: this.submitting
          }, null, 8, _hoisted_9$5), [
            [vModelCheckbox, this.newKeyData.NeverExpire]
          ]),
          createBaseVNode("label", _hoisted_10$4, [
            createVNode(_component_LocaleText, { t: "Never Expire" }),
            _cache[3] || (_cache[3] = createTextVNode(" (")),
            _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-emoji-grimace-fill me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: "Don't think that's a good idea" }),
            _cache[5] || (_cache[5] = createTextVNode(") "))
          ])
        ]),
        createBaseVNode("button", {
          class: normalizeClass(["ms-auto btn bg-success-subtle text-success-emphasis border-1 border-success-subtle rounded-3 shadow-sm", { disabled: this.submitting }]),
          onClick: _cache[2] || (_cache[2] = ($event) => this.submitNewAPIKey())
        }, [
          !this.submitting ? (openBlock(), createElementBlock("i", _hoisted_11$3)) : createCommentVNode("", true),
          this.submitting ? (openBlock(), createBlock(_component_LocaleText, {
            key: 1,
            t: "Creating..."
          })) : (openBlock(), createBlock(_component_LocaleText, {
            key: 2,
            t: "Create"
          }))
        ], 2)
      ])
    ])
  ]);
}
const NewDashboardAPIKey = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$6]]);
const _sfc_main$7 = {
  name: "dashboardAPIKey",
  components: { LocaleText },
  props: {
    apiKey: Object
  },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  data() {
    return {
      confirmDelete: false
    };
  },
  methods: {
    deleteAPIKey() {
      fetchPost("/api/deleteDashboardAPIKey", {
        Key: this.apiKey.Key
      }, (res) => {
        if (res.status) {
          this.$emit("deleted", res.data);
          this.store.newMessage("Server", "API Key deleted", "success");
        } else {
          this.store.newMessage("Server", res.message, "danger");
        }
      });
    }
  }
};
const _hoisted_1$7 = { class: "card rounded-3 shadow-sm" };
const _hoisted_2$7 = {
  key: 0,
  class: "card-body d-flex gap-3 align-items-center apiKey-card-body"
};
const _hoisted_3$7 = { class: "d-flex align-items-center gap-2" };
const _hoisted_4$6 = { class: "text-muted" };
const _hoisted_5$6 = { style: { "word-break": "break-all" } };
const _hoisted_6$6 = { class: "d-flex align-items-center gap-2 ms-auto" };
const _hoisted_7$5 = { class: "text-muted" };
const _hoisted_8$5 = {
  key: 0,
  class: "card-body d-flex gap-3 align-items-center justify-content-end"
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1$7, [
    !this.confirmDelete ? (openBlock(), createElementBlock("div", _hoisted_2$7, [
      createBaseVNode("div", _hoisted_3$7, [
        createBaseVNode("small", _hoisted_4$6, [
          createVNode(_component_LocaleText, { t: "Key" })
        ]),
        createBaseVNode("span", _hoisted_5$6, toDisplayString(this.apiKey.Key), 1)
      ]),
      createBaseVNode("div", _hoisted_6$6, [
        createBaseVNode("small", _hoisted_7$5, [
          createVNode(_component_LocaleText, { t: "Expire At" })
        ]),
        !this.apiKey.ExpiredAt ? (openBlock(), createBlock(_component_LocaleText, {
          key: 0,
          t: "Never Expire"
        })) : createCommentVNode("", true),
        createBaseVNode("span", null, toDisplayString(this.apiKey.ExpiredAt), 1)
      ]),
      !this.store.getActiveCrossServer() ? (openBlock(), createElementBlock("a", {
        key: 0,
        role: "button",
        class: "btn btn-sm bg-danger-subtle text-danger-emphasis rounded-3",
        onClick: _cache[0] || (_cache[0] = ($event) => this.confirmDelete = true)
      }, _cache[3] || (_cache[3] = [
        createBaseVNode("i", { class: "bi bi-trash-fill" }, null, -1)
      ]))) : createCommentVNode("", true)
    ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      !this.store.getActiveCrossServer() ? (openBlock(), createElementBlock("div", _hoisted_8$5, [
        createVNode(_component_LocaleText, { t: "Are you sure to delete this API key?" }),
        createBaseVNode("a", {
          role: "button",
          class: "btn btn-sm bg-success-subtle text-success-emphasis rounded-3",
          onClick: _cache[1] || (_cache[1] = ($event) => this.deleteAPIKey())
        }, _cache[4] || (_cache[4] = [
          createBaseVNode("i", { class: "bi bi-check-lg" }, null, -1)
        ])),
        createBaseVNode("a", {
          role: "button",
          class: "btn btn-sm bg-secondary-subtle text-secondary-emphasis rounded-3",
          onClick: _cache[2] || (_cache[2] = ($event) => this.confirmDelete = false)
        }, _cache[5] || (_cache[5] = [
          createBaseVNode("i", { class: "bi bi-x-lg" }, null, -1)
        ]))
      ])) : createCommentVNode("", true)
    ], 64))
  ]);
}
const DashboardAPIKey = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$5], ["__scopeId", "data-v-a76253c8"]]);
const _sfc_main$6 = {
  name: "dashboardAPIKeys",
  components: { LocaleText, DashboardAPIKey, NewDashboardAPIKey },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  data() {
    return {
      value: this.store.Configuration.Server.dashboard_api_key,
      apiKeys: [],
      newDashboardAPIKey: false
    };
  },
  methods: {
    async toggleDashboardAPIKeys() {
      await fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Server",
        key: "dashboard_api_key",
        value: this.value
      }, (res) => {
        if (res.status) {
          this.store.Configuration.Peers[this.targetData] = this.value;
          this.store.newMessage(
            "Server",
            `API Keys function is successfully ${this.value ? "enabled" : "disabled"}`,
            "success"
          );
        } else {
          this.value = this.store.Configuration.Peers[this.targetData];
          this.store.newMessage(
            "Server",
            `API Keys function is failed to ${this.value ? "enabled" : "disabled"}`,
            "danger"
          );
        }
      });
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          fetchGet("/api/getDashboardAPIKeys", {}, (res) => {
            if (res.status) {
              this.apiKeys = res.data;
            } else {
              this.apiKeys = [];
              this.store.newMessage("Server", res.message, "danger");
            }
          });
        } else {
          this.apiKeys = [];
        }
      }
    }
  }
};
const _hoisted_1$6 = { class: "card rounded-3" };
const _hoisted_2$6 = { class: "my-2" };
const _hoisted_3$6 = {
  key: 0,
  class: "form-check form-switch ms-auto"
};
const _hoisted_4$5 = {
  class: "form-check-label",
  for: "allowAPIKeysSwitch"
};
const _hoisted_5$5 = {
  key: 0,
  class: "card-body position-relative d-flex flex-column gap-2"
};
const _hoisted_6$5 = {
  key: 1,
  class: "card",
  style: { "height": "300px" }
};
const _hoisted_7$4 = { class: "card-body d-flex text-muted" };
const _hoisted_8$4 = { class: "m-auto" };
const _hoisted_9$4 = {
  key: 2,
  class: "d-flex flex-column gap-2 position-relative",
  style: { "min-height": "300px" }
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_DashboardAPIKey = resolveComponent("DashboardAPIKey");
  const _component_NewDashboardAPIKey = resolveComponent("NewDashboardAPIKey");
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    createBaseVNode("div", {
      class: normalizeClass(["card-header d-flex align-items-center", { "border-bottom-0 rounded-3": !this.value }])
    }, [
      createBaseVNode("h6", _hoisted_2$6, [
        createVNode(_component_LocaleText, { t: "API Keys" })
      ]),
      !this.store.getActiveCrossServer() ? (openBlock(), createElementBlock("div", _hoisted_3$6, [
        withDirectives(createBaseVNode("input", {
          class: "form-check-input",
          type: "checkbox",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.value = $event),
          onChange: _cache[1] || (_cache[1] = ($event) => this.toggleDashboardAPIKeys()),
          role: "switch",
          id: "allowAPIKeysSwitch"
        }, null, 544), [
          [vModelCheckbox, this.value]
        ]),
        createBaseVNode("label", _hoisted_4$5, [
          this.value ? (openBlock(), createBlock(_component_LocaleText, {
            key: 0,
            t: "Enabled"
          })) : (openBlock(), createBlock(_component_LocaleText, {
            key: 1,
            t: "Disabled"
          }))
        ])
      ])) : createCommentVNode("", true)
    ], 2),
    this.value ? (openBlock(), createElementBlock("div", _hoisted_5$5, [
      !this.store.getActiveCrossServer() ? (openBlock(), createElementBlock("button", {
        key: 0,
        class: "btn bg-primary-subtle text-primary-emphasis border-1 border-primary-subtle rounded-3 shadow-sm",
        onClick: _cache[2] || (_cache[2] = ($event) => this.newDashboardAPIKey = true)
      }, [
        _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-plus-circle-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "API Key" })
      ])) : createCommentVNode("", true),
      this.apiKeys.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_6$5, [
        createBaseVNode("div", _hoisted_7$4, [
          createBaseVNode("span", _hoisted_8$4, [
            createVNode(_component_LocaleText, { t: "No WGDashboard API Key" })
          ])
        ])
      ])) : (openBlock(), createElementBlock("div", _hoisted_9$4, [
        createVNode(TransitionGroup, { name: "apiKey" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(this.apiKeys, (key) => {
              return openBlock(), createBlock(_component_DashboardAPIKey, {
                apiKey: key,
                key: key.Key,
                onDeleted: _cache[3] || (_cache[3] = (nkeys) => this.apiKeys = nkeys)
              }, null, 8, ["apiKey"]);
            }), 128))
          ]),
          _: 1
        })
      ])),
      createVNode(Transition, { name: "zoomReversed" }, {
        default: withCtx(() => [
          this.newDashboardAPIKey ? (openBlock(), createBlock(_component_NewDashboardAPIKey, {
            key: 0,
            onCreated: _cache[4] || (_cache[4] = (data) => this.apiKeys = data),
            onClose: _cache[5] || (_cache[5] = ($event) => this.newDashboardAPIKey = false)
          })) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ])) : createCommentVNode("", true)
  ]);
}
const DashboardAPIKeys = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$4], ["__scopeId", "data-v-100ee9f9"]]);
const _sfc_main$5 = {
  name: "accountSettingsMFA",
  components: { LocaleText },
  setup() {
    const store = DashboardConfigurationStore();
    const uuid = `input_${v4()}`;
    return { store, uuid };
  },
  data() {
    return {
      status: false
    };
  },
  mounted() {
    this.status = this.store.Configuration.Account["enable_totp"];
  },
  methods: {
    async resetMFA() {
      await fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Account",
        key: "totp_verified",
        value: "false"
      }, async (res) => {
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Account",
          key: "enable_totp",
          value: "false"
        }, (res2) => {
          if (res2.status) {
            this.$router.push("/2FASetup");
          }
        });
      });
    }
  }
};
const _hoisted_1$5 = { class: "d-flex align-items-center" };
const _hoisted_2$5 = { class: "form-check form-switch" };
const _hoisted_3$5 = { for: "allowMFAKeysSwitch" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$5, [
      createBaseVNode("div", _hoisted_2$5, [
        withDirectives(createBaseVNode("input", {
          class: "form-check-input",
          type: "checkbox",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.status = $event),
          role: "switch",
          id: "allowMFAKeysSwitch"
        }, null, 512), [
          [vModelCheckbox, this.status]
        ]),
        createBaseVNode("label", _hoisted_3$5, [
          this.status ? (openBlock(), createBlock(_component_LocaleText, {
            key: 0,
            t: "Enabled"
          })) : (openBlock(), createBlock(_component_LocaleText, {
            key: 1,
            t: "Disabled"
          }))
        ])
      ]),
      this.status ? (openBlock(), createElementBlock("button", {
        key: 0,
        class: "btn bg-warning-subtle text-warning-emphasis border-1 border-warning-subtle ms-auto rounded-3 shadow-sm",
        onClick: _cache[1] || (_cache[1] = ($event) => this.resetMFA())
      }, [
        _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-shield-lock-fill me-2" }, null, -1)),
        this.store.Configuration.Account["totp_verified"] ? (openBlock(), createBlock(_component_LocaleText, {
          key: 0,
          t: "Reset"
        })) : (openBlock(), createBlock(_component_LocaleText, {
          key: 1,
          t: "Setup"
        })),
        _cache[3] || (_cache[3] = createTextVNode(" MFA "))
      ])) : createCommentVNode("", true)
    ])
  ]);
}
const AccountSettingsMFA = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$3]]);
const _sfc_main$4 = {
  name: "dashboardLanguage",
  components: { LocaleText },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  data() {
    return {
      languages: void 0
    };
  },
  mounted() {
    fetchGet("/api/locale/available", {}, (res) => {
      this.languages = res.data;
    });
  },
  methods: {
    changeLanguage(lang_id) {
      fetchPost("/api/locale/update", {
        lang_id
      }, (res) => {
        if (res.status) {
          this.store.Configuration.Server.dashboard_language = lang_id;
          this.store.Locale = res.data;
        } else {
          this.store.newMessage("Server", "WGDashboard language update failed", "danger");
        }
      });
    }
  },
  computed: {
    currentLanguage() {
      let lang = this.store.Configuration.Server.dashboard_language;
      return this.languages.find((x) => x.lang_id === lang);
    }
  }
};
const _hoisted_1$4 = { class: "text-muted d-block mb-1" };
const _hoisted_2$4 = { class: "d-flex gap-2" };
const _hoisted_3$4 = { class: "dropdown w-100" };
const _hoisted_4$4 = ["disabled"];
const _hoisted_5$4 = { key: 1 };
const _hoisted_6$4 = {
  class: "dropdown-menu rounded-3 shadow",
  style: { "max-height": "500px", "overflow-y": "scroll" }
};
const _hoisted_7$3 = ["onClick"];
const _hoisted_8$3 = { class: "me-auto mb-0" };
const _hoisted_9$3 = {
  class: "d-block",
  style: { "font-size": "0.8rem" }
};
const _hoisted_10$3 = {
  key: 0,
  class: "bi bi-check text-primary fs-5"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("small", _hoisted_1$4, [
      createBaseVNode("strong", null, [
        createVNode(_component_LocaleText, { t: "Language" })
      ])
    ]),
    createBaseVNode("div", _hoisted_2$4, [
      createBaseVNode("div", _hoisted_3$4, [
        createBaseVNode("button", {
          class: "btn bg-primary-subtle text-primary-emphasis dropdown-toggle w-100 rounded-3",
          disabled: !this.languages,
          type: "button",
          "data-bs-toggle": "dropdown",
          "aria-expanded": "false"
        }, [
          !this.languages ? (openBlock(), createBlock(_component_LocaleText, {
            key: 0,
            t: "Loading..."
          })) : (openBlock(), createElementBlock("span", _hoisted_5$4, toDisplayString($options.currentLanguage?.lang_name_localized), 1))
        ], 8, _hoisted_4$4),
        createBaseVNode("ul", _hoisted_6$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.languages, (x) => {
            return openBlock(), createElementBlock("li", null, [
              createBaseVNode("a", {
                class: "dropdown-item d-flex align-items-center",
                role: "button",
                onClick: ($event) => this.changeLanguage(x.lang_id)
              }, [
                createBaseVNode("p", _hoisted_8$3, [
                  createTextVNode(toDisplayString(x.lang_name_localized) + " ", 1),
                  createBaseVNode("small", _hoisted_9$3, toDisplayString(x.lang_name), 1)
                ]),
                $options.currentLanguage?.lang_id === x.lang_id ? (openBlock(), createElementBlock("i", _hoisted_10$3)) : createCommentVNode("", true)
              ], 8, _hoisted_7$3)
            ]);
          }), 256))
        ])
      ])
    ])
  ]);
}
const DashboardLanguage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$2], ["__scopeId", "data-v-4e34593e"]]);
const _sfc_main$3 = {
  name: "dashboardIPPortInput",
  components: { LocaleText },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  data() {
    return {
      ipAddress: "",
      port: 0,
      invalidFeedback: "",
      showInvalidFeedback: false,
      isValid: false,
      timeout: void 0,
      changed: false,
      updating: false
    };
  },
  mounted() {
    this.ipAddress = this.store.Configuration.Server.app_ip;
    this.port = this.store.Configuration.Server.app_port;
  },
  methods: {
    async useValidation(e, targetData, value) {
      if (this.changed) {
        this.updating = true;
        await fetchPost("/api/updateDashboardConfigurationItem", {
          section: "Server",
          key: targetData,
          value
        }, (res) => {
          if (res.status) {
            e.target.classList.add("is-valid");
            this.showInvalidFeedback = false;
            this.store.Configuration.Server[targetData] = value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              e.target.classList.remove("is-valid");
            }, 5e3);
          } else {
            this.isValid = false;
            this.showInvalidFeedback = true;
            this.invalidFeedback = res.message;
          }
          this.changed = false;
          this.updating = false;
        });
      }
    }
  }
};
const _hoisted_1$3 = { class: "row g-2" };
const _hoisted_2$3 = { class: "col-sm" };
const _hoisted_3$3 = { class: "form-group" };
const _hoisted_4$3 = {
  for: "input_dashboard_ip",
  class: "text-muted mb-1"
};
const _hoisted_5$3 = ["disabled"];
const _hoisted_6$3 = { class: "invalid-feedback" };
const _hoisted_7$2 = { class: "col-sm" };
const _hoisted_8$2 = { class: "form-group" };
const _hoisted_9$2 = {
  for: "input_dashboard_ip",
  class: "text-muted mb-1"
};
const _hoisted_10$2 = ["disabled"];
const _hoisted_11$2 = { class: "invalid-feedback" };
const _hoisted_12$2 = { class: "px-2 py-1 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-2 d-inline-block mb-2 mt-2" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$3, [
      createBaseVNode("div", _hoisted_2$3, [
        createBaseVNode("div", _hoisted_3$3, [
          createBaseVNode("label", _hoisted_4$3, [
            createBaseVNode("strong", null, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "IP Address / Hostname" })
              ])
            ])
          ]),
          withDirectives(createBaseVNode("input", {
            type: "text",
            class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
            id: "input_dashboard_ip",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.ipAddress = $event),
            onKeydown: _cache[1] || (_cache[1] = ($event) => this.changed = true),
            onBlur: _cache[2] || (_cache[2] = ($event) => $options.useValidation($event, "app_ip", this.ipAddress)),
            disabled: this.updating
          }, null, 42, _hoisted_5$3), [
            [vModelText, this.ipAddress]
          ]),
          createBaseVNode("div", _hoisted_6$3, toDisplayString(this.invalidFeedback), 1)
        ])
      ]),
      createBaseVNode("div", _hoisted_7$2, [
        createBaseVNode("div", _hoisted_8$2, [
          createBaseVNode("label", _hoisted_9$2, [
            createBaseVNode("strong", null, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Listen Port" })
              ])
            ])
          ]),
          withDirectives(createBaseVNode("input", {
            type: "number",
            class: normalizeClass(["form-control", { "is-invalid": $data.showInvalidFeedback, "is-valid": $data.isValid }]),
            id: "input_dashboard_ip",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.port = $event),
            onKeydown: _cache[4] || (_cache[4] = ($event) => this.changed = true),
            onBlur: _cache[5] || (_cache[5] = ($event) => $options.useValidation($event, "app_port", this.port)),
            disabled: this.updating
          }, null, 42, _hoisted_10$2), [
            [vModelText, this.port]
          ]),
          createBaseVNode("div", _hoisted_11$2, toDisplayString(this.invalidFeedback), 1)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_12$2, [
      createBaseVNode("small", null, [
        _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Manual restart of WGDashboard is needed to apply changes on IP Address and Listen Port" })
      ])
    ])
  ]);
}
const DashboardIPPortInput = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1]]);
const _hoisted_1$2 = { class: "card rounded-3" };
const _hoisted_2$2 = { class: "card-header" };
const _hoisted_3$2 = { class: "my-2" };
const _hoisted_4$2 = { class: "card-body d-flex gap-2" };
const _hoisted_5$2 = { class: "list-group w-100" };
const _hoisted_6$2 = ["onClick"];
const _sfc_main$2 = {
  __name: "dashboardSettingsWireguardConfigurationAutostart",
  setup(__props) {
    const store = DashboardConfigurationStore();
    const wireguardConfigurationStore = WireguardConfigurationsStore();
    const data = ref(store.Configuration.WireGuardConfiguration.autostart);
    const configurations = computed(() => {
      return wireguardConfigurationStore.Configurations.map((x) => x.Name);
    });
    const updateAutostart = async () => {
      await fetchPost("/api/updateDashboardConfigurationItem", {
        section: "WireGuardConfiguration",
        key: "autostart",
        value: data.value
      }, async (res) => {
        if (res.status) {
          store.newMessage("Server", "Start up configurations saved", "success");
          data.value = res.data;
        } else {
          store.newMessage("Server", "Start up configurations failed to save", "danger");
        }
      });
    };
    const toggle = (c) => {
      if (data.value.includes(c)) {
        data.value = data.value.filter((x) => x !== c);
      } else {
        data.value.push(c);
      }
      updateAutostart();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("h6", _hoisted_3$2, [
            createVNode(LocaleText, { t: "Toggle When Start Up" })
          ])
        ]),
        createBaseVNode("div", _hoisted_4$2, [
          createBaseVNode("div", _hoisted_5$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(configurations.value, (c) => {
              return openBlock(), createElementBlock("button", {
                type: "button",
                key: c,
                onClick: ($event) => toggle(c),
                class: "list-group-item list-group-item-action py-2 w-100 d-flex align-items-center"
              }, [
                createBaseVNode("samp", null, toDisplayString(c), 1),
                createBaseVNode("i", {
                  class: normalizeClass(["ms-auto", [data.value.includes(c) ? "bi-check-circle-fill" : "bi-circle"]])
                }, null, 2)
              ], 8, _hoisted_6$2);
            }), 128))
          ])
        ])
      ]);
    };
  }
};
const DashboardSettingsWireguardConfigurationAutostart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4aa2aed9"]]);
const _hoisted_1$1 = { class: "card" };
const _hoisted_2$1 = { class: "card-header" };
const _hoisted_3$1 = { class: "my-2 d-flex" };
const _hoisted_4$1 = {
  key: 0,
  class: "text-success ms-auto"
};
const _hoisted_5$1 = { class: "card-body d-flex flex-column gap-3" };
const _hoisted_6$1 = { class: "row gx-2 gy-2" };
const _hoisted_7$1 = { class: "col-12 col-lg-4" };
const _hoisted_8$1 = { class: "form-group" };
const _hoisted_9$1 = {
  for: "server",
  class: "text-muted mb-1"
};
const _hoisted_10$1 = { class: "col-12 col-lg-4" };
const _hoisted_11$1 = { class: "form-group" };
const _hoisted_12$1 = {
  for: "port",
  class: "text-muted mb-1"
};
const _hoisted_13$1 = { class: "col-12 col-lg-4" };
const _hoisted_14$1 = { class: "form-group" };
const _hoisted_15$1 = {
  for: "encryption",
  class: "text-muted mb-1"
};
const _hoisted_16$1 = { value: "NOTLS" };
const _hoisted_17$1 = { class: "col-12 col-lg-4" };
const _hoisted_18$1 = { class: "form-group" };
const _hoisted_19$1 = {
  for: "username",
  class: "text-muted mb-1"
};
const _hoisted_20$1 = { class: "col-12 col-lg-4" };
const _hoisted_21$1 = { class: "form-group" };
const _hoisted_22$1 = {
  for: "email_password",
  class: "text-muted mb-1"
};
const _hoisted_23$1 = { class: "col-12 col-lg-4" };
const _hoisted_24$1 = { class: "form-group" };
const _hoisted_25$1 = {
  for: "send_from",
  class: "text-muted mb-1"
};
const _hoisted_26$1 = { key: 0 };
const _hoisted_27$1 = { key: 1 };
const _hoisted_28$1 = {
  class: "text-muted mb-1",
  for: "test_email"
};
const _hoisted_29$1 = { class: "fw-bold" };
const _hoisted_30$1 = ["disabled"];
const _hoisted_31$1 = ["disabled"];
const _hoisted_32$1 = {
  key: 0,
  class: "bi bi-send me-2"
};
const _hoisted_33 = {
  key: 1,
  class: "spinner-border spinner-border-sm me-2"
};
const _hoisted_34 = {
  class: "text-muted mb-1",
  for: "email_template"
};
const _hoisted_35 = { class: "fw-bold" };
const _sfc_main$1 = {
  __name: "dashboardEmailSettings",
  setup(__props) {
    const store = DashboardConfigurationStore();
    onMounted(() => {
      checkEmailReady();
      document.querySelectorAll("#emailAccount input, #emailAccount select, #email_template").forEach((x) => {
        x.addEventListener("change", async () => {
          let id = x.attributes.getNamedItem("id").value;
          await fetchPost("/api/updateDashboardConfigurationItem", {
            section: "Email",
            key: id,
            value: x.value
          }, (res) => {
            if (res.status) {
              x.classList.remove("is-invalid");
              x.classList.add("is-valid");
            } else {
              x.classList.remove("is-valid");
              x.classList.add("is-invalid");
            }
            checkEmailReady();
          });
        });
      });
    });
    const emailIsReady = ref(false);
    const testEmailReceiver = ref("");
    const testing = ref(false);
    const checkEmailReady = async () => {
      await fetchGet("/api/email/ready", {}, (res) => {
        emailIsReady.value = res.status;
      });
    };
    const sendTestEmail = async () => {
      testing.value = true;
      await fetchPost("/api/email/send", {
        Receiver: testEmailReceiver.value,
        Subject: "WGDashboard Testing Email",
        Body: "Test 1, 2, 3! Hello World :)"
      }, (res) => {
        if (res.status) {
          store.newMessage("Server", "Test email sent successfully!", "success");
        } else {
          store.newMessage("Server", `Test email sent failed! Reason: ${res.message}`, "danger");
        }
        testing.value = false;
      });
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("h6", _hoisted_3$1, [
            createVNode(LocaleText, { t: "Email Account" }),
            emailIsReady.value ? (openBlock(), createElementBlock("span", _hoisted_4$1, [
              _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-check-circle-fill me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Ready" })
            ])) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_5$1, [
          createBaseVNode("form", {
            onSubmit: _cache[6] || (_cache[6] = (e) => e.preventDefault(e)),
            id: "emailAccount"
          }, [
            createBaseVNode("div", _hoisted_6$1, [
              createBaseVNode("div", _hoisted_7$1, [
                createBaseVNode("div", _hoisted_8$1, [
                  createBaseVNode("label", _hoisted_9$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Server" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("input", {
                    id: "server",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(store).Configuration.Email.server = $event),
                    type: "text",
                    class: "form-control"
                  }, null, 512), [
                    [vModelText, unref(store).Configuration.Email.server]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_10$1, [
                createBaseVNode("div", _hoisted_11$1, [
                  createBaseVNode("label", _hoisted_12$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Port" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("input", {
                    id: "port",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(store).Configuration.Email.port = $event),
                    type: "text",
                    class: "form-control"
                  }, null, 512), [
                    [vModelText, unref(store).Configuration.Email.port]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_13$1, [
                createBaseVNode("div", _hoisted_14$1, [
                  createBaseVNode("label", _hoisted_15$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Encryption" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("select", {
                    class: "form-select",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(store).Configuration.Email.encryption = $event),
                    id: "encryption"
                  }, [
                    _cache[11] || (_cache[11] = createBaseVNode("option", { value: "STARTTLS" }, " STARTTLS ", -1)),
                    createBaseVNode("option", _hoisted_16$1, [
                      createVNode(LocaleText, { t: "No Encryption" })
                    ])
                  ], 512), [
                    [vModelSelect, unref(store).Configuration.Email.encryption]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_17$1, [
                createBaseVNode("div", _hoisted_18$1, [
                  createBaseVNode("label", _hoisted_19$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Username" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("input", {
                    id: "username",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(store).Configuration.Email.username = $event),
                    type: "text",
                    class: "form-control"
                  }, null, 512), [
                    [vModelText, unref(store).Configuration.Email.username]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_20$1, [
                createBaseVNode("div", _hoisted_21$1, [
                  createBaseVNode("label", _hoisted_22$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Password" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("input", {
                    id: "email_password",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(store).Configuration.Email.email_password = $event),
                    type: "password",
                    class: "form-control"
                  }, null, 512), [
                    [vModelText, unref(store).Configuration.Email.email_password]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_23$1, [
                createBaseVNode("div", _hoisted_24$1, [
                  createBaseVNode("label", _hoisted_25$1, [
                    createBaseVNode("strong", null, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "Send From" })
                      ])
                    ])
                  ]),
                  withDirectives(createBaseVNode("input", {
                    id: "send_from",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(store).Configuration.Email.send_from = $event),
                    type: "text",
                    class: "form-control"
                  }, null, 512), [
                    [vModelText, unref(store).Configuration.Email.send_from]
                  ])
                ])
              ])
            ])
          ], 32),
          emailIsReady.value ? (openBlock(), createElementBlock("hr", _hoisted_26$1)) : createCommentVNode("", true),
          emailIsReady.value ? (openBlock(), createElementBlock("div", _hoisted_27$1, [
            createBaseVNode("label", _hoisted_28$1, [
              createBaseVNode("small", _hoisted_29$1, [
                createVNode(LocaleText, { t: "Send Test Email" })
              ])
            ]),
            createBaseVNode("form", {
              onSubmit: _cache[8] || (_cache[8] = (e) => {
                e.preventDefault();
                sendTestEmail();
              }),
              class: "input-group"
            }, [
              withDirectives(createBaseVNode("input", {
                type: "email",
                class: "form-control rounded-start-3",
                id: "test_email",
                placeholder: "john@example.com",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => testEmailReceiver.value = $event),
                disabled: testing.value
              }, null, 8, _hoisted_30$1), [
                [vModelText, testEmailReceiver.value]
              ]),
              createBaseVNode("button", {
                class: "btn bg-primary-subtle text-primary-emphasis border-primary-subtle rounded-end-3",
                type: "submit",
                value: "Submit",
                disabled: testEmailReceiver.value.length === 0 || testing.value,
                id: "button-addon2"
              }, [
                !testing.value ? (openBlock(), createElementBlock("i", _hoisted_32$1)) : (openBlock(), createElementBlock("span", _hoisted_33)),
                createVNode(LocaleText, {
                  t: !testing.value ? "Send" : "Sending..."
                }, null, 8, ["t"])
              ], 8, _hoisted_31$1)
            ], 32)
          ])) : createCommentVNode("", true),
          _cache[12] || (_cache[12] = createBaseVNode("hr", null, null, -1)),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_34, [
              createBaseVNode("small", _hoisted_35, [
                createVNode(LocaleText, { t: "Email Body Template" })
              ])
            ]),
            withDirectives(createBaseVNode("textarea", {
              class: "form-control rounded-3 font-monospace",
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => unref(store).Configuration.Email.email_template = $event),
              id: "email_template",
              style: { "min-height": "400px" }
            }, null, 512), [
              [vModelText, unref(store).Configuration.Email.email_template]
            ])
          ])
        ])
      ]);
    };
  }
};
const _sfc_main = {
  name: "settings",
  methods: { ipV46RegexCheck },
  components: {
    DashboardEmailSettings: _sfc_main$1,
    DashboardSettingsWireguardConfigurationAutostart,
    DashboardIPPortInput,
    DashboardLanguage,
    LocaleText,
    AccountSettingsMFA,
    DashboardAPIKeys,
    DashboardSettingsInputIPAddressAndPort,
    DashboardTheme,
    DashboardSettingsInputWireguardConfigurationPath,
    AccountSettingsInputPassword,
    AccountSettingsInputUsername,
    PeersDefaultSettingsInput
  },
  setup() {
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { dashboardConfigurationStore };
  },
  data() {
    return {
      activeTab: "WGDashboard",
      tabs: [
        {
          id: "WGDashboard",
          title: "WGDashboard Settings"
        },
        {
          id: "Peers",
          title: "Peers Settings"
        },
        {
          id: "WireGuardConfiguration",
          title: "WireGuard Configuration Settings"
        }
      ]
    };
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body mb-3" };
const _hoisted_2 = { class: "container-md d-flex flex-column gap-4" };
const _hoisted_3 = { class: "nav nav-pills nav-justified align-items-center gap-2" };
const _hoisted_4 = { class: "nav-item" };
const _hoisted_5 = ["onClick"];
const _hoisted_6 = { class: "my-2" };
const _hoisted_7 = {
  key: 0,
  class: "d-flex gap-3 flex-column"
};
const _hoisted_8 = {
  key: 1,
  class: "d-flex gap-3 flex-column"
};
const _hoisted_9 = { class: "card rounded-3" };
const _hoisted_10 = { class: "card-header" };
const _hoisted_11 = { class: "my-2" };
const _hoisted_12 = { class: "card-body" };
const _hoisted_13 = {
  key: 2,
  class: "d-flex gap-3 flex-column"
};
const _hoisted_14 = { class: "card rounded-3" };
const _hoisted_15 = { class: "card-header" };
const _hoisted_16 = { class: "my-2" };
const _hoisted_17 = { class: "card-body" };
const _hoisted_18 = { class: "row g-2" };
const _hoisted_19 = { class: "col-sm" };
const _hoisted_20 = { class: "col-sm" };
const _hoisted_21 = { class: "card" };
const _hoisted_22 = { class: "card-header" };
const _hoisted_23 = { class: "my-2" };
const _hoisted_24 = { class: "card-body" };
const _hoisted_25 = { class: "card" };
const _hoisted_26 = { class: "card-header" };
const _hoisted_27 = { class: "my-2" };
const _hoisted_28 = { class: "card-body d-flex flex-column gap-3" };
const _hoisted_29 = { class: "card" };
const _hoisted_30 = { class: "card-header" };
const _hoisted_31 = { class: "my-2" };
const _hoisted_32 = { class: "card-body" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_DashboardSettingsInputWireguardConfigurationPath = resolveComponent("DashboardSettingsInputWireguardConfigurationPath");
  const _component_DashboardSettingsWireguardConfigurationAutostart = resolveComponent("DashboardSettingsWireguardConfigurationAutostart");
  const _component_PeersDefaultSettingsInput = resolveComponent("PeersDefaultSettingsInput");
  const _component_DashboardTheme = resolveComponent("DashboardTheme");
  const _component_DashboardLanguage = resolveComponent("DashboardLanguage");
  const _component_DashboardIPPortInput = resolveComponent("DashboardIPPortInput");
  const _component_AccountSettingsInputUsername = resolveComponent("AccountSettingsInputUsername");
  const _component_AccountSettingsInputPassword = resolveComponent("AccountSettingsInputPassword");
  const _component_AccountSettingsMFA = resolveComponent("AccountSettingsMFA");
  const _component_DashboardAPIKeys = resolveComponent("DashboardAPIKeys");
  const _component_DashboardEmailSettings = resolveComponent("DashboardEmailSettings");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", null, [
        createBaseVNode("ul", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.tabs, (t) => {
            return openBlock(), createElementBlock("li", _hoisted_4, [
              createBaseVNode("a", {
                class: normalizeClass(["nav-link rounded-3", { active: this.activeTab === t.id }]),
                onClick: ($event) => this.activeTab = t.id,
                role: "button"
              }, [
                createBaseVNode("h6", _hoisted_6, [
                  createVNode(_component_LocaleText, {
                    t: t.title
                  }, null, 8, ["t"])
                ])
              ], 10, _hoisted_5)
            ]);
          }), 256))
        ]),
        _cache[1] || (_cache[1] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", null, [
          createVNode(Transition, {
            name: "fade2",
            mode: "out-in"
          }, {
            default: withCtx(() => [
              $data.activeTab === "WireGuardConfiguration" ? (openBlock(), createElementBlock("div", _hoisted_7, [
                createVNode(_component_DashboardSettingsInputWireguardConfigurationPath, {
                  targetData: "wg_conf_path",
                  title: "Configurations Directory",
                  warning: true,
                  "warning-text": "Remember to remove / at the end of your path. e.g /etc/wireguard"
                }),
                createVNode(_component_DashboardSettingsWireguardConfigurationAutostart)
              ])) : $data.activeTab === "Peers" ? (openBlock(), createElementBlock("div", _hoisted_8, [
                createBaseVNode("div", _hoisted_9, [
                  createBaseVNode("div", _hoisted_10, [
                    createBaseVNode("h6", _hoisted_11, [
                      createVNode(_component_LocaleText, { t: "Peer Default Settings" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_12, [
                    createBaseVNode("div", null, [
                      createVNode(_component_PeersDefaultSettingsInput, {
                        targetData: "peer_global_dns",
                        title: "DNS"
                      }),
                      createVNode(_component_PeersDefaultSettingsInput, {
                        targetData: "peer_endpoint_allowed_ip",
                        title: "Endpoint Allowed IPs"
                      }),
                      createVNode(_component_PeersDefaultSettingsInput, {
                        targetData: "peer_mtu",
                        title: "MTU"
                      }),
                      createVNode(_component_PeersDefaultSettingsInput, {
                        targetData: "peer_keep_alive",
                        title: "Persistent Keepalive"
                      }),
                      createVNode(_component_PeersDefaultSettingsInput, {
                        targetData: "remote_endpoint",
                        title: "Peer Remote Endpoint",
                        warning: true,
                        warningText: "This will be changed globally, and will be apply to all peer's QR code and configuration file."
                      })
                    ])
                  ])
                ])
              ])) : $data.activeTab === "WGDashboard" ? (openBlock(), createElementBlock("div", _hoisted_13, [
                createBaseVNode("div", _hoisted_14, [
                  createBaseVNode("div", _hoisted_15, [
                    createBaseVNode("h6", _hoisted_16, [
                      createVNode(_component_LocaleText, { t: "Appearance" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_17, [
                    createBaseVNode("div", _hoisted_18, [
                      createBaseVNode("div", _hoisted_19, [
                        createVNode(_component_DashboardTheme)
                      ]),
                      createBaseVNode("div", _hoisted_20, [
                        createVNode(_component_DashboardLanguage)
                      ])
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_21, [
                  createBaseVNode("div", _hoisted_22, [
                    createBaseVNode("h6", _hoisted_23, [
                      createVNode(_component_LocaleText, { t: "Dashboard IP Address & Listen Port" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_24, [
                    createVNode(_component_DashboardIPPortInput)
                  ])
                ]),
                createBaseVNode("div", _hoisted_25, [
                  createBaseVNode("div", _hoisted_26, [
                    createBaseVNode("h6", _hoisted_27, [
                      createVNode(_component_LocaleText, { t: "Account Settings" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_28, [
                    createBaseVNode("div", null, [
                      createVNode(_component_AccountSettingsInputUsername, {
                        targetData: "username",
                        title: "Username"
                      })
                    ]),
                    _cache[0] || (_cache[0] = createBaseVNode("hr", null, null, -1)),
                    createBaseVNode("div", null, [
                      createVNode(_component_AccountSettingsInputPassword, { targetData: "password" })
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_29, [
                  createBaseVNode("div", _hoisted_30, [
                    createBaseVNode("h6", _hoisted_31, [
                      createVNode(_component_LocaleText, { t: "Multi-Factor Authentication (MFA)" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_32, [
                    !this.dashboardConfigurationStore.getActiveCrossServer() ? (openBlock(), createBlock(_component_AccountSettingsMFA, { key: 0 })) : createCommentVNode("", true)
                  ])
                ]),
                createVNode(_component_DashboardAPIKeys),
                createVNode(_component_DashboardEmailSettings)
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ])
      ])
    ])
  ]);
}
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  settings as default
};
