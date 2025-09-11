import { _ as _export_sfc, D as DashboardConfigurationStore, A as fetchPost, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, t as toDisplayString, m as withDirectives, y as vModelText, n as normalizeClass, a3 as vModelDynamic, e as createCommentVNode } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main = {
  name: "peerSettings",
  components: { LocaleText },
  props: {
    selectedPeer: Object
  },
  data() {
    return {
      data: void 0,
      dataChanged: false,
      showKey: false,
      saving: false
    };
  },
  setup() {
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { dashboardConfigurationStore };
  },
  methods: {
    reset() {
      if (this.selectedPeer) {
        this.data = JSON.parse(JSON.stringify(this.selectedPeer));
        this.dataChanged = false;
      }
    },
    savePeer() {
      this.saving = true;
      fetchPost(`/api/updatePeerSettings/${this.$route.params.id}`, this.data, (res) => {
        this.saving = false;
        if (res.status) {
          this.dashboardConfigurationStore.newMessage("Server", "Peer saved", "success");
        } else {
          this.dashboardConfigurationStore.newMessage("Server", res.message, "danger");
        }
        this.$emit("refresh");
      });
    },
    resetPeerData(type) {
      this.saving = true;
      fetchPost(`/api/resetPeerData/${this.$route.params.id}`, {
        id: this.data.id,
        type
      }, (res) => {
        this.saving = false;
        if (res.status) {
          this.dashboardConfigurationStore.newMessage("Server", "Peer data usage reset successfully", "success");
        } else {
          this.dashboardConfigurationStore.newMessage("Server", res.message, "danger");
        }
        this.$emit("refresh");
      });
    }
  },
  beforeMount() {
    this.reset();
  },
  mounted() {
    this.$el.querySelectorAll("input").forEach((x) => {
      x.addEventListener("change", () => {
        this.dataChanged = true;
      });
    });
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "m-auto modal-dialog-centered dashboardModal" };
const _hoisted_4 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-2" };
const _hoisted_6 = { class: "mb-0" };
const _hoisted_7 = {
  key: 0,
  class: "card-body px-4"
};
const _hoisted_8 = { class: "d-flex flex-column gap-2 mb-4" };
const _hoisted_9 = { class: "d-flex align-items-center" };
const _hoisted_10 = { class: "text-muted" };
const _hoisted_11 = { class: "ms-auto" };
const _hoisted_12 = {
  for: "peer_name_textbox",
  class: "form-label"
};
const _hoisted_13 = { class: "text-muted" };
const _hoisted_14 = ["disabled"];
const _hoisted_15 = { class: "d-flex position-relative" };
const _hoisted_16 = {
  for: "peer_private_key_textbox",
  class: "form-label"
};
const _hoisted_17 = { class: "text-muted" };
const _hoisted_18 = ["type", "disabled"];
const _hoisted_19 = {
  for: "peer_allowed_ip_textbox",
  class: "form-label"
};
const _hoisted_20 = { class: "text-muted" };
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
  for: "peer_endpoint_allowed_ips",
  class: "form-label"
};
const _hoisted_23 = { class: "text-muted" };
const _hoisted_24 = ["disabled"];
const _hoisted_25 = {
  for: "peer_DNS_textbox",
  class: "form-label"
};
const _hoisted_26 = { class: "text-muted" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = {
  class: "accordion my-3",
  id: "peerSettingsAccordion"
};
const _hoisted_29 = { class: "accordion-item" };
const _hoisted_30 = { class: "accordion-header" };
const _hoisted_31 = {
  class: "accordion-button rounded-3 collapsed",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#peerSettingsAccordionOptional"
};
const _hoisted_32 = {
  id: "peerSettingsAccordionOptional",
  class: "accordion-collapse collapse",
  "data-bs-parent": "#peerSettingsAccordion"
};
const _hoisted_33 = { class: "accordion-body d-flex flex-column gap-2 mb-2" };
const _hoisted_34 = {
  for: "peer_preshared_key_textbox",
  class: "form-label"
};
const _hoisted_35 = { class: "text-muted" };
const _hoisted_36 = ["disabled"];
const _hoisted_37 = {
  for: "peer_mtu",
  class: "form-label"
};
const _hoisted_38 = { class: "text-muted" };
const _hoisted_39 = ["disabled"];
const _hoisted_40 = {
  for: "peer_keep_alive",
  class: "form-label"
};
const _hoisted_41 = { class: "text-muted" };
const _hoisted_42 = ["disabled"];
const _hoisted_43 = { class: "d-flex align-items-center gap-2" };
const _hoisted_44 = ["disabled"];
const _hoisted_45 = ["disabled"];
const _hoisted_46 = { class: "d-flex gap-2 align-items-center" };
const _hoisted_47 = { class: "d-flex gap-2 ms-auto" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h4", _hoisted_6, [
              createVNode(_component_LocaleText, { t: "Peer Settings" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          this.data ? (openBlock(), createElementBlock("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                createBaseVNode("small", _hoisted_10, [
                  createVNode(_component_LocaleText, { t: "Public Key" })
                ]),
                createBaseVNode("small", _hoisted_11, [
                  createBaseVNode("samp", null, toDisplayString(this.data.id), 1)
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_12, [
                  createBaseVNode("small", _hoisted_13, [
                    createVNode(_component_LocaleText, { t: "Name" })
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control form-control-sm rounded-3",
                  disabled: this.saving,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.data.name = $event),
                  id: "peer_name_textbox",
                  placeholder: ""
                }, null, 8, _hoisted_14), [
                  [vModelText, this.data.name]
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("div", _hoisted_15, [
                  createBaseVNode("label", _hoisted_16, [
                    createBaseVNode("small", _hoisted_17, [
                      createVNode(_component_LocaleText, { t: "Private Key" }),
                      createBaseVNode("code", null, [
                        createVNode(_component_LocaleText, { t: "(Required for QR Code and Download)" })
                      ])
                    ])
                  ]),
                  createBaseVNode("a", {
                    role: "button",
                    class: "ms-auto text-decoration-none toggleShowKey",
                    onClick: _cache[2] || (_cache[2] = ($event) => this.showKey = !this.showKey)
                  }, [
                    createBaseVNode("i", {
                      class: normalizeClass(["bi", [this.showKey ? "bi-eye-slash-fill" : "bi-eye-fill"]])
                    }, null, 2)
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: [this.showKey ? "text" : "password"],
                  class: "form-control form-control-sm rounded-3",
                  disabled: this.saving,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.data.private_key = $event),
                  id: "peer_private_key_textbox",
                  style: { "padding-right": "40px" }
                }, null, 8, _hoisted_18), [
                  [vModelDynamic, this.data.private_key]
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_19, [
                  createBaseVNode("small", _hoisted_20, [
                    createVNode(_component_LocaleText, { t: "Allowed IPs" }),
                    createBaseVNode("code", null, [
                      createVNode(_component_LocaleText, { t: "(Required)" })
                    ])
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control form-control-sm rounded-3",
                  disabled: this.saving,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => this.data.allowed_ip = $event),
                  id: "peer_allowed_ip_textbox"
                }, null, 8, _hoisted_21), [
                  [vModelText, this.data.allowed_ip]
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_22, [
                  createBaseVNode("small", _hoisted_23, [
                    createVNode(_component_LocaleText, { t: "Endpoint Allowed IPs" }),
                    createBaseVNode("code", null, [
                      createVNode(_component_LocaleText, { t: "(Required)" })
                    ])
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control form-control-sm rounded-3",
                  disabled: this.saving,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => this.data.endpoint_allowed_ip = $event),
                  id: "peer_endpoint_allowed_ips"
                }, null, 8, _hoisted_24), [
                  [vModelText, this.data.endpoint_allowed_ip]
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_25, [
                  createBaseVNode("small", _hoisted_26, [
                    createVNode(_component_LocaleText, { t: "DNS" })
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control form-control-sm rounded-3",
                  disabled: this.saving,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => this.data.DNS = $event),
                  id: "peer_DNS_textbox"
                }, null, 8, _hoisted_27), [
                  [vModelText, this.data.DNS]
                ])
              ]),
              createBaseVNode("div", _hoisted_28, [
                createBaseVNode("div", _hoisted_29, [
                  createBaseVNode("h2", _hoisted_30, [
                    createBaseVNode("button", _hoisted_31, [
                      createVNode(_component_LocaleText, { t: "Optional Settings" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_32, [
                    createBaseVNode("div", _hoisted_33, [
                      createBaseVNode("div", null, [
                        createBaseVNode("label", _hoisted_34, [
                          createBaseVNode("small", _hoisted_35, [
                            createVNode(_component_LocaleText, { t: "Pre-Shared Key" })
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "text",
                          class: "form-control form-control-sm rounded-3",
                          disabled: this.saving,
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => this.data.preshared_key = $event),
                          id: "peer_preshared_key_textbox"
                        }, null, 8, _hoisted_36), [
                          [vModelText, this.data.preshared_key]
                        ])
                      ]),
                      createBaseVNode("div", null, [
                        createBaseVNode("label", _hoisted_37, [
                          createBaseVNode("small", _hoisted_38, [
                            createVNode(_component_LocaleText, { t: "MTU" })
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "number",
                          class: "form-control form-control-sm rounded-3",
                          disabled: this.saving,
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => this.data.mtu = $event),
                          id: "peer_mtu"
                        }, null, 8, _hoisted_39), [
                          [vModelText, this.data.mtu]
                        ])
                      ]),
                      createBaseVNode("div", null, [
                        createBaseVNode("label", _hoisted_40, [
                          createBaseVNode("small", _hoisted_41, [
                            createVNode(_component_LocaleText, { t: "Persistent Keepalive" })
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "number",
                          class: "form-control form-control-sm rounded-3",
                          disabled: this.saving,
                          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => this.data.keepalive = $event),
                          id: "peer_keep_alive"
                        }, null, 8, _hoisted_42), [
                          [vModelText, this.data.keepalive]
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_43, [
                createBaseVNode("button", {
                  class: "btn bg-secondary-subtle border-secondary-subtle text-secondary-emphasis rounded-3 shadow ms-auto px-3 py-2",
                  onClick: _cache[10] || (_cache[10] = ($event) => this.reset()),
                  disabled: !this.dataChanged || this.saving
                }, [
                  _cache[15] || (_cache[15] = createBaseVNode("i", { class: "bi bi-arrow-clockwise me-2" }, null, -1)),
                  createVNode(_component_LocaleText, { t: "Reset" })
                ], 8, _hoisted_44),
                createBaseVNode("button", {
                  class: "btn bg-primary-subtle border-primary-subtle text-primary-emphasis rounded-3 px-3 py-2 shadow",
                  disabled: !this.dataChanged || this.saving,
                  onClick: _cache[11] || (_cache[11] = ($event) => this.savePeer())
                }, [
                  _cache[16] || (_cache[16] = createBaseVNode("i", { class: "bi bi-save-fill me-2" }, null, -1)),
                  createVNode(_component_LocaleText, { t: "Save" })
                ], 8, _hoisted_45)
              ]),
              _cache[20] || (_cache[20] = createBaseVNode("hr", null, null, -1)),
              createBaseVNode("div", _hoisted_46, [
                createBaseVNode("strong", null, [
                  createVNode(_component_LocaleText, { t: "Reset Data Usage" })
                ]),
                createBaseVNode("div", _hoisted_47, [
                  createBaseVNode("button", {
                    class: "btn bg-primary-subtle text-primary-emphasis rounded-3 flex-grow-1 shadow-sm",
                    onClick: _cache[12] || (_cache[12] = ($event) => this.resetPeerData("total"))
                  }, [
                    _cache[17] || (_cache[17] = createBaseVNode("i", { class: "bi bi-arrow-down-up me-2" }, null, -1)),
                    createVNode(_component_LocaleText, { t: "Total" })
                  ]),
                  createBaseVNode("button", {
                    class: "btn bg-primary-subtle text-primary-emphasis rounded-3 flex-grow-1 shadow-sm",
                    onClick: _cache[13] || (_cache[13] = ($event) => this.resetPeerData("receive"))
                  }, [
                    _cache[18] || (_cache[18] = createBaseVNode("i", { class: "bi bi-arrow-down me-2" }, null, -1)),
                    createVNode(_component_LocaleText, { t: "Received" })
                  ]),
                  createBaseVNode("button", {
                    class: "btn bg-primary-subtle text-primary-emphasis rounded-3 flex-grow-1 shadow-sm",
                    onClick: _cache[14] || (_cache[14] = ($event) => this.resetPeerData("sent"))
                  }, [
                    _cache[19] || (_cache[19] = createBaseVNode("i", { class: "bi bi-arrow-up me-2" }, null, -1)),
                    createVNode(_component_LocaleText, { t: "Sent" })
                  ])
                ])
              ])
            ])
          ])) : createCommentVNode("", true)
        ])
      ])
    ])
  ]);
}
const peerSettings = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-12b3ae8e"]]);
export {
  peerSettings as default
};
