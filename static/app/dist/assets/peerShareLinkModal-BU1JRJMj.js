import { _ as _export_sfc, r as ref, U as withAsyncContext, H as watch, a as openBlock, c as createElementBlock, b as createBaseVNode, t as toDisplayString, e as createCommentVNode, n as normalizeClass, A as fetchPost, g as fetchGet, D as DashboardConfigurationStore, E as reactive, k as resolveComponent, d as createVNode, m as withDirectives, y as vModelText, u as unref, G as GetLocale, v as vModelCheckbox, w as withCtx, s as normalizeStyle, i as createBlock, S as Suspense } from "./index-xvqfLBaG.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { V as Vn } from "./vue-datepicker-CvNbCtAl.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _hoisted_1$2 = {
  class: "card rounded-0 border-start-0 border-bottom-0 bg-body-secondary",
  style: { "height": "400px", "overflow": "scroll" }
};
const _hoisted_2$2 = { class: "card-body" };
const _hoisted_3$2 = {
  key: 0,
  class: "alert alert-danger rounded-3"
};
const _hoisted_4$2 = { class: "font-monospace" };
const _hoisted_5$2 = ["innerText"];
const _sfc_main$2 = {
  __name: "peerShareWithEmailBodyPreview",
  props: ["body", "selectedPeer"],
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const preview = ref("");
    const error = ref(false);
    const errorMsg = ref("");
    const getPreview = async () => {
      if (props.body) {
        error.value = false;
        preview.value = "";
        await fetchPost("/api/email/previewBody", {
          Body: props.body,
          ConfigurationName: props.selectedPeer.configuration.Name,
          Peer: props.selectedPeer.id
        }, (res) => {
          if (res.status) {
            preview.value = res.data;
          } else {
            errorMsg.value = res.message;
          }
          error.value = !res.status;
        });
      }
    };
    [__temp, __restore] = withAsyncContext(() => getPreview()), await __temp, __restore();
    let timeout = void 0;
    watch(() => {
      return props.body;
    }, async () => {
      if (timeout === void 0) {
        timeout = setTimeout(async () => {
          await getPreview();
        }, 500);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          await getPreview();
        }, 500);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          error.value && __props.body ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
            _cache[0] || (_cache[0] = createBaseVNode("i", { class: "bi bi-exclamation-triangle-fill me-2" }, null, -1)),
            createBaseVNode("span", _hoisted_4$2, toDisplayString(errorMsg.value), 1)
          ])) : createCommentVNode("", true),
          __props.body ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass({ "opacity-50": error.value }),
            innerText: preview.value
          }, null, 10, _hoisted_5$2)) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const PeerShareWithEmailBodyPreview = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8cfb4d4d"]]);
const _hoisted_1$1 = { key: 0 };
const _hoisted_2$1 = { class: "mb-3" };
const _hoisted_3$1 = { class: "position-relative" };
const _hoisted_4$1 = ["disabled", "placeholder"];
const _hoisted_5$1 = { class: "position-relative" };
const _hoisted_6$1 = ["placeholder", "disabled"];
const _hoisted_7$1 = { class: "row g-0" };
const _hoisted_8$1 = ["disabled", "placeholder"];
const _hoisted_9$1 = {
  key: 0,
  class: "col-6"
};
const _hoisted_10$1 = {
  class: "card border-top-0 rounded-top-0 rounded-bottom-3 bg-body-tertiary",
  style: { "border": "var(--bs-border-width) solid var(--bs-border-color)" }
};
const _hoisted_11$1 = { class: "card-body d-flex flex-column gap-2" };
const _hoisted_12$1 = { class: "form-check form-switch ms-auto" };
const _hoisted_13$1 = {
  class: "form-check-label",
  for: "livePreview"
};
const _hoisted_14$1 = { class: "form-check form-switch" };
const _hoisted_15$1 = {
  class: "form-check-label",
  for: "includeAttachment"
};
const _hoisted_16 = ["disabled"];
const _hoisted_17 = { key: 0 };
const _hoisted_18 = { key: 1 };
const _hoisted_19 = { key: 1 };
const _sfc_main$1 = {
  __name: "peerShareWithEmail",
  props: ["dataCopy", "selectedPeer"],
  emits: ["fullscreen"],
  async setup(__props, { emit: __emit }) {
    let __temp, __restore;
    const props = __props;
    const emailIsReady = ref(false);
    [__temp, __restore] = withAsyncContext(() => fetchGet("/api/email/ready", {}, (res) => {
      emailIsReady.value = res.status;
    })), await __temp, __restore();
    const store = DashboardConfigurationStore();
    const email = reactive({
      Receiver: "",
      Body: store.Configuration.Email.email_template,
      Subject: "",
      IncludeAttachment: false,
      ConfigurationName: props.selectedPeer.configuration.Name,
      Peer: props.selectedPeer.id
    });
    const livePreview = ref(false);
    const sending = ref(false);
    const sendEmail = async () => {
      sending.value = true;
      await fetchPost("/api/email/send", email, (res) => {
        if (res.status) {
          store.newMessage("Server", "Email sent successfully!", "success");
        } else {
          store.newMessage("Server", `Email sent failed! Reason: ${res.message}`, "danger");
        }
        sending.value = false;
      });
    };
    const emits = __emit;
    watch(livePreview, () => {
      emits("fullscreen", livePreview.value);
    });
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return emailIsReady.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("h6", _hoisted_2$1, [
          createVNode(LocaleText, { t: "Share with Email" })
        ]),
        createBaseVNode("form", {
          class: "d-flex gap-3 flex-column",
          onSubmit: _cache[5] || (_cache[5] = (e) => {
            e.preventDefault();
            sendEmail();
          })
        }, [
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_3$1, [
              _cache[6] || (_cache[6] = createBaseVNode("i", {
                class: "bi bi-person-circle",
                style: { "position": "absolute", "top": "0.4rem", "left": "0.75rem" }
              }, null, -1)),
              withDirectives(createBaseVNode("input", {
                type: "email",
                class: "form-control rounded-top-3 rounded-bottom-0",
                style: { "padding-left": "calc( 0.75rem + 24px )" },
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => email.Receiver = $event),
                disabled: sending.value,
                placeholder: unref(GetLocale)("Who are you sending to?"),
                required: "",
                id: "email_receiver",
                "aria-describedby": "emailHelp"
              }, null, 8, _hoisted_4$1), [
                [vModelText, email.Receiver]
              ])
            ]),
            createBaseVNode("div", _hoisted_5$1, [
              _cache[7] || (_cache[7] = createBaseVNode("i", {
                class: "bi bi-hash",
                style: { "position": "absolute", "top": "0.4rem", "left": "0.75rem" }
              }, null, -1)),
              withDirectives(createBaseVNode("input", {
                type: "text",
                class: "form-control rounded-0 border-top-0 border-bottom-0",
                style: { "padding-left": "calc( 0.75rem + 24px )" },
                placeholder: unref(GetLocale)("What's the subject?"),
                disabled: sending.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => email.Subject = $event),
                id: "email_subject",
                "aria-describedby": "emailHelp"
              }, null, 8, _hoisted_6$1), [
                [vModelText, email.Subject]
              ])
            ]),
            createBaseVNode("div", _hoisted_7$1, [
              createBaseVNode("div", {
                class: normalizeClass([livePreview.value ? "col-6" : "col-12"])
              }, [
                withDirectives(createBaseVNode("textarea", {
                  class: "form-control rounded-top-0 rounded-bottom-0 font-monospace border-bottom-0",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => email.Body = $event),
                  disabled: sending.value,
                  placeholder: unref(GetLocale)("What's the body?"),
                  style: { "height": "400px", "max-height": "400px" }
                }, null, 8, _hoisted_8$1), [
                  [vModelText, email.Body]
                ])
              ], 2),
              livePreview.value ? (openBlock(), createElementBlock("div", _hoisted_9$1, [
                createVNode(PeerShareWithEmailBodyPreview, {
                  body: email.Body,
                  selectedPeer: __props.selectedPeer
                }, null, 8, ["body", "selectedPeer"])
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_10$1, [
              createBaseVNode("div", _hoisted_11$1, [
                createBaseVNode("div", _hoisted_12$1, [
                  withDirectives(createBaseVNode("input", {
                    class: "form-check-input",
                    type: "checkbox",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => livePreview.value = $event),
                    role: "switch",
                    id: "livePreview"
                  }, null, 512), [
                    [vModelCheckbox, livePreview.value]
                  ]),
                  createBaseVNode("label", _hoisted_13$1, [
                    createVNode(LocaleText, { t: "Live Preview" })
                  ])
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_14$1, [
            withDirectives(createBaseVNode("input", {
              class: "form-check-input",
              type: "checkbox",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => email.IncludeAttachment = $event),
              role: "switch",
              id: "includeAttachment"
            }, null, 512), [
              [vModelCheckbox, email.IncludeAttachment]
            ]),
            createBaseVNode("label", _hoisted_15$1, [
              createVNode(LocaleText, { t: "Include configuration file as an attachment" })
            ])
          ]),
          createBaseVNode("button", {
            disabled: sending.value,
            class: "btn bg-primary-subtle text-primary-emphasis border-primary-subtle rounded-3"
          }, [
            !sending.value ? (openBlock(), createElementBlock("span", _hoisted_17, [
              _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-send me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Send" })
            ])) : (openBlock(), createElementBlock("span", _hoisted_18, [
              _cache[9] || (_cache[9] = createBaseVNode("span", { class: "spinner-border spinner-border-sm me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Sending..." })
            ]))
          ], 8, _hoisted_16)
        ], 32)
      ])) : (openBlock(), createElementBlock("div", _hoisted_19, [
        createBaseVNode("small", null, [
          createVNode(LocaleText, { t: "SMTP is not configured, please navigate to " }),
          createVNode(_component_RouterLink, { to: "/settings" }, {
            default: withCtx(() => [
              createVNode(LocaleText, { t: "Settings" })
            ]),
            _: 1
          }),
          createVNode(LocaleText, { t: " to finish setup" })
        ])
      ]));
    };
  }
};
const PeerShareWithEmail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6e705c87"]]);
const _sfc_main = {
  name: "peerShareLinkModal",
  props: {
    selectedPeer: Object
  },
  components: {
    PeerShareWithEmail,
    LocaleText,
    VueDatePicker: Vn
  },
  data() {
    return {
      dataCopy: void 0,
      loading: false,
      fullscreen: false
    };
  },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  mounted() {
    this.dataCopy = JSON.parse(JSON.stringify(this.selectedPeer.ShareLink)).at(0);
  },
  watch: {
    "selectedPeer.ShareLink": {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal.length !== newVal.length) {
          this.dataCopy = JSON.parse(JSON.stringify(this.selectedPeer.ShareLink)).at(0);
        }
      }
    }
  },
  methods: {
    startSharing() {
      this.loading = true;
      fetchPost("/api/sharePeer/create", {
        Configuration: this.selectedPeer.configuration.Name,
        Peer: this.selectedPeer.id,
        ExpireDate: dayjs().add(7, "d").format("YYYY-MM-DD HH:mm:ss")
      }, (res) => {
        if (res.status) {
          this.selectedPeer.ShareLink = res.data;
          this.dataCopy = res.data.at(0);
        } else {
          this.store.newMessage(
            "Server",
            "Share link failed to create. Reason: " + res.message,
            "danger"
          );
        }
        this.loading = false;
      });
    },
    updateLinkExpireDate() {
      fetchPost("/api/sharePeer/update", this.dataCopy, (res) => {
        if (res.status) {
          this.dataCopy = res.data.at(0);
          this.selectedPeer.ShareLink = res.data;
          this.store.newMessage("Server", "Link expire date updated", "success");
        } else {
          this.store.newMessage(
            "Server",
            "Link expire date failed to update. Reason: " + res.message,
            "danger"
          );
        }
        this.loading = false;
      });
    },
    stopSharing() {
      this.loading = true;
      this.dataCopy.ExpireDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.updateLinkExpireDate();
    },
    parseTime(modelData) {
      if (modelData) {
        this.dataCopy.ExpireDate = dayjs(modelData).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.dataCopy.ExpireDate = void 0;
      }
      this.updateLinkExpireDate();
    }
  },
  computed: {
    getUrl() {
      const crossServer = this.store.getActiveCrossServer();
      if (crossServer) {
        return `${crossServer.host}/${this.$router.resolve(
          { path: "/share", query: { "ShareID": this.dataCopy.ShareID } }
        ).href}`;
      }
      return window.location.origin + window.location.pathname + this.$router.resolve(
        { path: "/share", query: { "ShareID": this.dataCopy.ShareID } }
      ).href;
    }
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_4 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4" };
const _hoisted_5 = { class: "mb-0" };
const _hoisted_6 = {
  key: 0,
  class: "card-body px-4 pb-4"
};
const _hoisted_7 = { key: 0 };
const _hoisted_8 = { class: "mb-3 text-muted" };
const _hoisted_9 = ["disabled"];
const _hoisted_10 = { key: 1 };
const _hoisted_11 = { class: "d-flex gap-2 mb-4" };
const _hoisted_12 = ["href"];
const _hoisted_13 = { class: "d-flex flex-column gap-2 mb-3" };
const _hoisted_14 = ["disabled"];
const _hoisted_15 = { class: "text-muted" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_VueDatePicker = resolveComponent("VueDatePicker");
  const _component_PeerShareWithEmail = resolveComponent("PeerShareWithEmail");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", {
        class: "m-auto modal-dialog-centered dashboardModal",
        style: normalizeStyle([this.fullscreen ? "width: 100%" : "width: 700px"])
      }, [
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("h4", _hoisted_5, [
              createVNode(_component_LocaleText, { t: "Share Peer" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          this.selectedPeer.ShareLink ? (openBlock(), createElementBlock("div", _hoisted_6, [
            !this.dataCopy ? (openBlock(), createElementBlock("div", _hoisted_7, [
              createBaseVNode("h6", _hoisted_8, [
                createVNode(_component_LocaleText, { t: "Currently the peer is not sharing" })
              ]),
              createBaseVNode("button", {
                onClick: _cache[1] || (_cache[1] = ($event) => this.startSharing()),
                disabled: this.loading,
                class: "w-100 btn bg-success-subtle text-success-emphasis border-1 border-success-subtle rounded-3 shadow-sm"
              }, [
                createBaseVNode("span", {
                  class: normalizeClass({ "animate__animated animate__flash animate__infinite animate__slower": this.loading })
                }, _cache[4] || (_cache[4] = [
                  createBaseVNode("i", { class: "bi bi-send-fill me-2" }, null, -1)
                ]), 2),
                this.loading ? (openBlock(), createBlock(_component_LocaleText, {
                  key: 0,
                  t: "Sharing..."
                })) : (openBlock(), createBlock(_component_LocaleText, {
                  key: 1,
                  t: "Start Sharing"
                }))
              ], 8, _hoisted_9)
            ])) : (openBlock(), createElementBlock("div", _hoisted_10, [
              createBaseVNode("div", _hoisted_11, [
                _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-link-45deg" }, null, -1)),
                createBaseVNode("a", {
                  href: this.getUrl,
                  class: "text-decoration-none",
                  target: "_blank"
                }, toDisplayString($options.getUrl), 9, _hoisted_12)
              ]),
              createBaseVNode("div", _hoisted_13, [
                createBaseVNode("small", null, [
                  _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-calendar me-2" }, null, -1)),
                  createVNode(_component_LocaleText, { t: "Expire At" })
                ]),
                createVNode(_component_VueDatePicker, {
                  is24: true,
                  "min-date": /* @__PURE__ */ new Date(),
                  "model-value": this.dataCopy.ExpireDate,
                  "onUpdate:modelValue": this.parseTime,
                  "time-picker-inline": "",
                  format: "yyyy-MM-dd HH:mm:ss",
                  "preview-format": "yyyy-MM-dd HH:mm:ss",
                  dark: this.store.Configuration.Server.dashboard_theme === "dark"
                }, null, 8, ["min-date", "model-value", "onUpdate:modelValue", "dark"])
              ]),
              createBaseVNode("button", {
                onClick: _cache[2] || (_cache[2] = ($event) => this.stopSharing()),
                disabled: this.loading,
                class: "w-100 btn bg-danger-subtle text-danger-emphasis border-1 border-danger-subtle rounded-3 shadow-sm"
              }, [
                createBaseVNode("span", {
                  class: normalizeClass({ "animate__animated animate__flash animate__infinite animate__slower": this.loading })
                }, _cache[7] || (_cache[7] = [
                  createBaseVNode("i", { class: "bi bi-send-slash-fill me-2" }, null, -1)
                ]), 2),
                this.loading ? (openBlock(), createBlock(_component_LocaleText, {
                  key: 0,
                  t: "Stop Sharing..."
                })) : (openBlock(), createBlock(_component_LocaleText, {
                  key: 1,
                  t: "Stop Sharing"
                }))
              ], 8, _hoisted_14),
              _cache[9] || (_cache[9] = createBaseVNode("hr", null, null, -1)),
              (openBlock(), createBlock(Suspense, null, {
                fallback: withCtx(() => [
                  createBaseVNode("h6", _hoisted_15, [
                    _cache[8] || (_cache[8] = createBaseVNode("span", {
                      class: "spinner-border me-2 spinner-border-sm",
                      role: "status"
                    }, null, -1)),
                    createVNode(_component_LocaleText, { t: "Checking SMTP Configuration..." })
                  ])
                ]),
                default: withCtx(() => [
                  createVNode(_component_PeerShareWithEmail, {
                    onFullscreen: _cache[3] || (_cache[3] = (f) => {
                      this.fullscreen = f;
                    }),
                    selectedPeer: $props.selectedPeer,
                    dataCopy: $data.dataCopy
                  }, null, 8, ["selectedPeer", "dataCopy"])
                ]),
                _: 1
              }))
            ]))
          ])) : createCommentVNode("", true)
        ])
      ], 4)
    ])
  ]);
}
const peerShareLinkModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  peerShareLinkModal as default
};
