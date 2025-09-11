import { _ as _export_sfc, W as WireguardConfigurationsStore, D as DashboardConfigurationStore, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, f as createTextVNode, m as withDirectives, y as vModelText, n as normalizeClass, r as ref, G as GetLocale, v as vModelCheckbox, w as withCtx, F as Fragment, h as renderList, t as toDisplayString, T as TransitionGroup, C as withKeys, e as createCommentVNode, g as fetchGet, N as useRoute, U as withAsyncContext, q as computed, H as watch, i as createBlock, A as fetchPost } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main$9 = {
  name: "endpointAllowedIps",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean
  },
  setup() {
    const store = WireguardConfigurationsStore();
    const dashboardStore = DashboardConfigurationStore();
    return { store, dashboardStore };
  },
  data() {
    return {
      endpointAllowedIps: JSON.parse(JSON.stringify(this.data.endpoint_allowed_ip)),
      error: false
    };
  },
  methods: {
    checkAllowedIP() {
      let i = this.endpointAllowedIps.split(",").map((x) => x.replaceAll(" ", ""));
      for (let ip in i) {
        if (!this.store.checkCIDR(i[ip])) {
          if (!this.error) {
            this.dashboardStore.newMessage("WGDashboard", "Endpoint Allowed IPs format is incorrect", "danger");
          }
          this.data.endpoint_allowed_ip = "";
          this.error = true;
          return;
        }
      }
      this.error = false;
      this.data.endpoint_allowed_ip = this.endpointAllowedIps;
    }
  },
  watch: {
    "endpointAllowedIps"() {
      this.checkAllowedIP();
    }
  }
};
const _hoisted_1$9 = {
  for: "peer_endpoint_allowed_ips",
  class: "form-label"
};
const _hoisted_2$9 = { class: "text-muted" };
const _hoisted_3$9 = ["disabled"];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("label", _hoisted_1$9, [
      createBaseVNode("small", _hoisted_2$9, [
        createVNode(_component_LocaleText, { t: "Endpoint Allowed IPs" }),
        _cache[2] || (_cache[2] = createTextVNode()),
        createBaseVNode("code", null, [
          createVNode(_component_LocaleText, { t: "(Required)" })
        ])
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: normalizeClass(["form-control form-control-sm rounded-3", { "is-invalid": $data.error }]),
      disabled: this.saving,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.endpointAllowedIps = $event),
      onBlur: _cache[1] || (_cache[1] = ($event) => this.checkAllowedIP()),
      id: "peer_endpoint_allowed_ips"
    }, null, 42, _hoisted_3$9), [
      [vModelText, this.endpointAllowedIps]
    ])
  ]);
}
const EndpointAllowedIps = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8]]);
const _sfc_main$8 = {
  name: "allowedIPsInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean,
    bulk: Boolean,
    availableIp: void 0
  },
  data() {
    return {
      allowedIp: [],
      availableIpSearchString: "",
      customAvailableIp: "",
      allowedIpFormatError: false
    };
  },
  setup(props) {
    const store = WireguardConfigurationsStore();
    const dashboardStore = DashboardConfigurationStore();
    const selectedSubnet = ref("");
    if (Object.keys(props.availableIp).length > 0) {
      selectedSubnet.value = Object.keys(props.availableIp)[0];
    }
    return { store, dashboardStore, selectedSubnet };
  },
  computed: {
    searchAvailableIps() {
      return this.availableIpSearchString ? this.availableIp[this.selectedSubnet].filter((x) => x.includes(this.availableIpSearchString) && !this.data.allowed_ips.includes(x)) : this.availableIp[this.selectedSubnet].filter((x) => !this.data.allowed_ips.includes(x));
    },
    inputGetLocale() {
      return GetLocale("Enter IP Address/CIDR");
    }
  },
  methods: {
    addAllowedIp(ip) {
      let list = ip.split(",");
      for (let i = 0; i < list.length; i++) {
        let ipaddress = list[i].trim();
        if (this.store.checkCIDR(ipaddress)) {
          this.data.allowed_ips.push(ipaddress);
        } else {
          this.allowedIpFormatError = true;
          this.dashboardStore.newMessage(
            "WGDashboard",
            `This Allowed IP address is invalid: ${ipaddress}`,
            "danger"
          );
          return false;
        }
      }
      this.customAvailableIp = "";
      return true;
    }
  },
  watch: {
    customAvailableIp() {
      this.allowedIpFormatError = false;
    }
  },
  mounted() {
    if (this.availableIp !== void 0 && Object.keys(this.availableIp).length > 0 && this.data.allowed_ips.length === 0) {
      for (let subnet in this.availableIp) {
        if (this.availableIp[subnet].length > 0) {
          this.addAllowedIp(this.availableIp[subnet][0]);
        }
      }
    }
  }
};
const _hoisted_1$8 = { class: "d-flex flex-column flex-md-row mb-2" };
const _hoisted_2$8 = {
  for: "peer_allowed_ip_textbox",
  class: "form-label mb-0"
};
const _hoisted_3$8 = { class: "text-muted" };
const _hoisted_4$4 = { class: "form-check form-switch ms-md-auto" };
const _hoisted_5$4 = {
  class: "form-check-label",
  for: "disableIPValidation"
};
const _hoisted_6$3 = { class: "d-flex" };
const _hoisted_7$3 = ["onClick"];
const _hoisted_8$2 = { class: "d-flex gap-2 align-items-center" };
const _hoisted_9$2 = { class: "input-group" };
const _hoisted_10$2 = ["placeholder", "disabled"];
const _hoisted_11$2 = ["disabled"];
const _hoisted_12$2 = { class: "text-muted" };
const _hoisted_13$1 = { class: "dropdown flex-grow-1" };
const _hoisted_14$1 = ["disabled"];
const _hoisted_15$1 = {
  key: 0,
  class: "dropdown-menu mt-2 shadow w-100 dropdown-menu-end rounded-3 pb-0",
  style: { "width": "300px !important" }
};
const _hoisted_16$1 = { class: "px-3 d-flex gap-3 align-items-center" };
const _hoisted_17$1 = { class: "px-3 overflow-x-scroll d-flex overflow-x-scroll overflow-y-hidden align-items-center gap-2" };
const _hoisted_18$1 = ["onClick"];
const _hoisted_19$1 = {
  class: "overflow-y-scroll",
  style: { "height": "270px" }
};
const _hoisted_20$1 = ["onClick"];
const _hoisted_21$1 = { class: "me-auto" };
const _hoisted_22$1 = {
  key: 0,
  class: "px-3 py-2"
};
const _hoisted_23$1 = {
  key: 0,
  class: "text-muted"
};
const _hoisted_24$1 = {
  key: 1,
  class: "text-muted"
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass({ inactiveField: this.bulk })
  }, [
    createBaseVNode("div", _hoisted_1$8, [
      createBaseVNode("label", _hoisted_2$8, [
        createBaseVNode("small", _hoisted_3$8, [
          createVNode(_component_LocaleText, { t: "Allowed IPs" }),
          _cache[5] || (_cache[5] = createTextVNode()),
          createBaseVNode("code", null, [
            createVNode(_component_LocaleText, { t: "(Required)" })
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_4$4, [
        withDirectives(createBaseVNode("input", {
          class: "form-check-input",
          type: "checkbox",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.allowed_ips_validation = $event),
          role: "switch",
          id: "disableIPValidation"
        }, null, 512), [
          [vModelCheckbox, this.data.allowed_ips_validation]
        ]),
        createBaseVNode("label", _hoisted_5$4, [
          createBaseVNode("small", null, [
            createVNode(_component_LocaleText, { t: "Allowed IPs Validation" })
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_6$3, [
      createBaseVNode("div", {
        class: normalizeClass(["d-flex gap-2 flex-wrap", { "mb-2": this.data.allowed_ips.length > 0 }])
      }, [
        createVNode(TransitionGroup, { name: "list" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(this.data.allowed_ips, (ip, index) => {
              return openBlock(), createElementBlock("span", {
                class: "badge rounded-pill text-bg-success",
                key: ip
              }, [
                createTextVNode(toDisplayString(ip) + " ", 1),
                createBaseVNode("a", {
                  role: "button",
                  onClick: ($event) => this.data.allowed_ips.splice(index, 1)
                }, _cache[6] || (_cache[6] = [
                  createBaseVNode("i", { class: "bi bi-x-circle-fill ms-1" }, null, -1)
                ]), 8, _hoisted_7$3)
              ]);
            }), 128))
          ]),
          _: 1
        })
      ], 2)
    ]),
    createBaseVNode("div", _hoisted_8$2, [
      createBaseVNode("div", _hoisted_9$2, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          class: normalizeClass(["form-control form-control-sm rounded-start-3", { "is-invalid": this.allowedIpFormatError }]),
          placeholder: this.inputGetLocale,
          onKeyup: _cache[1] || (_cache[1] = withKeys(($event) => this.customAvailableIp ? this.addAllowedIp(this.customAvailableIp) : void 0, ["enter"])),
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.customAvailableIp = $event),
          id: "peer_allowed_ip_textbox",
          disabled: $props.bulk
        }, null, 42, _hoisted_10$2), [
          [vModelText, $data.customAvailableIp]
        ]),
        createBaseVNode("button", {
          class: normalizeClass(["btn btn-sm rounded-end-3", [this.customAvailableIp ? "btn-success" : "btn-outline-success"]]),
          disabled: $props.bulk || !this.customAvailableIp,
          onClick: _cache[3] || (_cache[3] = ($event) => this.addAllowedIp(this.customAvailableIp)),
          type: "button",
          id: "button-addon2"
        }, _cache[7] || (_cache[7] = [
          createBaseVNode("i", { class: "bi bi-plus-lg" }, null, -1)
        ]), 10, _hoisted_11$2)
      ]),
      createBaseVNode("small", _hoisted_12$2, [
        createVNode(_component_LocaleText, { t: "or" })
      ]),
      createBaseVNode("div", _hoisted_13$1, [
        createBaseVNode("button", {
          class: "btn btn-outline-secondary btn-sm dropdown-toggle rounded-3 w-100",
          disabled: !$props.availableIp || $props.bulk,
          "data-bs-auto-close": "outside",
          type: "button",
          "data-bs-toggle": "dropdown",
          "aria-expanded": "false"
        }, [
          _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-filter-circle me-2" }, null, -1)),
          createVNode(_component_LocaleText, { t: "Pick Available IP" })
        ], 8, _hoisted_14$1),
        this.availableIp ? (openBlock(), createElementBlock("ul", _hoisted_15$1, [
          createBaseVNode("li", null, [
            createBaseVNode("div", _hoisted_16$1, [
              _cache[9] || (_cache[9] = createBaseVNode("label", {
                for: "availableIpSearchString",
                class: "text-muted"
              }, [
                createBaseVNode("i", { class: "bi bi-search" })
              ], -1)),
              withDirectives(createBaseVNode("input", {
                id: "availableIpSearchString",
                class: "form-control form-control-sm rounded-3",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => this.availableIpSearchString = $event)
              }, null, 512), [
                [vModelText, this.availableIpSearchString]
              ])
            ]),
            _cache[11] || (_cache[11] = createBaseVNode("hr", { class: "my-2" }, null, -1)),
            createBaseVNode("div", _hoisted_17$1, [
              _cache[10] || (_cache[10] = createBaseVNode("small", { class: "text-muted" }, "Subnet", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(this.availableIp), (key) => {
                return openBlock(), createElementBlock("button", {
                  key,
                  onClick: ($event) => this.selectedSubnet = key,
                  class: normalizeClass([{ "bg-primary-subtle": this.selectedSubnet === key }, "btn btn-sm text-primary-emphasis rounded-3"])
                }, toDisplayString(key), 11, _hoisted_18$1);
              }), 128))
            ]),
            _cache[12] || (_cache[12] = createBaseVNode("hr", { class: "mt-2 mb-0" }, null, -1))
          ]),
          createBaseVNode("li", null, [
            createBaseVNode("div", _hoisted_19$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(this.searchAvailableIps, (ip) => {
                return openBlock(), createElementBlock("div", {
                  style: {},
                  key: ip
                }, [
                  createBaseVNode("a", {
                    class: "dropdown-item d-flex",
                    role: "button",
                    onClick: ($event) => this.addAllowedIp(ip)
                  }, [
                    createBaseVNode("span", _hoisted_21$1, [
                      createBaseVNode("small", null, toDisplayString(ip), 1)
                    ])
                  ], 8, _hoisted_20$1)
                ]);
              }), 128)),
              this.searchAvailableIps.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_22$1, [
                this.availableIpSearchString ? (openBlock(), createElementBlock("small", _hoisted_23$1, [
                  createVNode(_component_LocaleText, { t: "No available IP containing" }),
                  createTextVNode('"' + toDisplayString(this.availableIpSearchString) + '"', 1)
                ])) : (openBlock(), createElementBlock("small", _hoisted_24$1, [
                  createVNode(_component_LocaleText, { t: "No more IP address available in this subnet" })
                ]))
              ])) : createCommentVNode("", true)
            ])
          ])
        ])) : createCommentVNode("", true)
      ])
    ])
  ], 2);
}
const AllowedIPsInput = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-ed72944d"]]);
const _sfc_main$7 = {
  name: "dnsInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean
  },
  data() {
    return {
      error: false,
      dns: JSON.parse(JSON.stringify(this.data.DNS))
    };
  },
  setup() {
    const store = WireguardConfigurationsStore();
    const dashboardStore = DashboardConfigurationStore();
    return { store, dashboardStore };
  },
  methods: {
    checkDNS() {
      if (this.dns) {
        let i = this.dns.split(",").map((x) => x.replaceAll(" ", ""));
        for (let ip in i) {
          if (!this.store.regexCheckIP(i[ip])) {
            if (!this.error) {
              this.dashboardStore.newMessage("WGDashboard", "DNS format is incorrect", "danger");
            }
            this.error = true;
            this.data.DNS = "";
            return;
          }
        }
        this.error = false;
        this.data.DNS = this.dns;
      }
    }
  },
  watch: {
    "dns"() {
      this.checkDNS();
    }
  }
};
const _hoisted_1$7 = {
  for: "peer_DNS_textbox",
  class: "form-label"
};
const _hoisted_2$7 = { class: "text-muted" };
const _hoisted_3$7 = ["disabled"];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("label", _hoisted_1$7, [
      createBaseVNode("small", _hoisted_2$7, [
        createVNode(_component_LocaleText, { t: "DNS" })
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: normalizeClass(["form-control form-control-sm rounded-3", { "is-invalid": this.error }]),
      disabled: this.saving,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.dns = $event),
      id: "peer_DNS_textbox"
    }, null, 10, _hoisted_3$7), [
      [vModelText, this.dns]
    ])
  ]);
}
const DnsInput = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6]]);
const _sfc_main$6 = {
  name: "nameInput",
  components: { LocaleText },
  props: {
    bulk: Boolean,
    data: Object,
    saving: Boolean
  }
};
const _hoisted_1$6 = {
  for: "peer_name_textbox",
  class: "form-label"
};
const _hoisted_2$6 = { class: "text-muted" };
const _hoisted_3$6 = ["disabled"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass({ inactiveField: this.bulk })
  }, [
    createBaseVNode("label", _hoisted_1$6, [
      createBaseVNode("small", _hoisted_2$6, [
        createVNode(_component_LocaleText, { t: "Name" })
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: "form-control form-control-sm rounded-3",
      disabled: this.saving || this.bulk,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.name = $event),
      id: "peer_name_textbox",
      placeholder: ""
    }, null, 8, _hoisted_3$6), [
      [vModelText, this.data.name]
    ])
  ], 2);
}
const NameInput = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5]]);
const _sfc_main$5 = {
  name: "privatePublicKeyInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean,
    bulk: Boolean
  },
  setup() {
    const dashboardStore = DashboardConfigurationStore();
    const wgStore = WireguardConfigurationsStore();
    return { dashboardStore, wgStore };
  },
  data() {
    return {
      keypair: {
        publicKey: "",
        privateKey: "",
        presharedKey: ""
      },
      editKey: false,
      error: false
    };
  },
  methods: {
    genKeyPair() {
      this.editKey = false;
      this.keypair = window.wireguard.generateKeypair();
      this.data.private_key = this.keypair.privateKey;
      this.data.public_key = this.keypair.publicKey;
    },
    testKey(key) {
      const reg = /^[A-Za-z0-9+/]{43}=?=?$/;
      return reg.test(key);
    },
    checkMatching() {
      try {
        if (this.keypair.privateKey) {
          if (this.wgStore.checkWGKeyLength(this.keypair.privateKey)) {
            this.keypair.publicKey = window.wireguard.generatePublicKey(this.keypair.privateKey);
            if (window.wireguard.generatePublicKey(this.keypair.privateKey) !== this.keypair.publicKey) {
              this.error = true;
              this.dashboardStore.newMessage("WGDashboard", "Private key does not match with the public key", "danger");
            } else {
              this.data.private_key = this.keypair.privateKey;
              this.data.public_key = this.keypair.publicKey;
            }
          }
        }
      } catch (e) {
        this.error = true;
        this.data.private_key = "";
        this.data.public_key = "";
      }
    }
  },
  mounted() {
    this.genKeyPair();
  },
  watch: {
    keypair: {
      deep: true,
      handler() {
        this.error = false;
        this.checkMatching();
      }
    }
  }
};
const _hoisted_1$5 = {
  for: "peer_private_key_textbox",
  class: "form-label"
};
const _hoisted_2$5 = { class: "text-muted" };
const _hoisted_3$5 = { class: "input-group" };
const _hoisted_4$3 = ["disabled"];
const _hoisted_5$3 = ["disabled"];
const _hoisted_6$2 = { class: "d-flex flex-column flex-md-row mb-2" };
const _hoisted_7$2 = {
  for: "public_key",
  class: "form-label mb-0"
};
const _hoisted_8$1 = { class: "text-muted" };
const _hoisted_9$1 = { class: "form-check form-switch ms-md-auto" };
const _hoisted_10$1 = ["disabled"];
const _hoisted_11$1 = {
  class: "form-check-label",
  for: "enablePublicKeyEdit"
};
const _hoisted_12$1 = ["disabled"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["d-flex gap-2 flex-column", { inactiveField: this.bulk }])
  }, [
    createBaseVNode("div", null, [
      createBaseVNode("label", _hoisted_1$5, [
        createBaseVNode("small", _hoisted_2$5, [
          createVNode(_component_LocaleText, { t: "Private Key" }),
          _cache[6] || (_cache[6] = createTextVNode()),
          createBaseVNode("code", null, [
            createVNode(_component_LocaleText, { t: "(Required for QR Code and Download)" })
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_3$5, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          class: normalizeClass(["form-control form-control-sm rounded-start-3", { "is-invalid": this.error }]),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.keypair.privateKey = $event),
          disabled: !this.editKey || this.bulk,
          onBlur: _cache[1] || (_cache[1] = ($event) => this.checkMatching()),
          id: "peer_private_key_textbox"
        }, null, 42, _hoisted_4$3), [
          [vModelText, this.keypair.privateKey]
        ]),
        createBaseVNode("button", {
          class: "btn btn-outline-info btn-sm rounded-end-3",
          onClick: _cache[2] || (_cache[2] = ($event) => this.genKeyPair()),
          disabled: this.bulk,
          type: "button",
          id: "button-addon2"
        }, _cache[7] || (_cache[7] = [
          createBaseVNode("i", { class: "bi bi-arrow-repeat" }, null, -1)
        ]), 8, _hoisted_5$3)
      ])
    ]),
    createBaseVNode("div", null, [
      createBaseVNode("div", _hoisted_6$2, [
        createBaseVNode("label", _hoisted_7$2, [
          createBaseVNode("small", _hoisted_8$1, [
            createVNode(_component_LocaleText, { t: "Public Key" }),
            _cache[8] || (_cache[8] = createTextVNode()),
            createBaseVNode("code", null, [
              createVNode(_component_LocaleText, { t: "(Required)" })
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_9$1, [
          withDirectives(createBaseVNode("input", {
            class: "form-check-input",
            type: "checkbox",
            role: "switch",
            disabled: this.bulk,
            id: "enablePublicKeyEdit",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.editKey = $event)
          }, null, 8, _hoisted_10$1), [
            [vModelCheckbox, this.editKey]
          ]),
          createBaseVNode("label", _hoisted_11$1, [
            createBaseVNode("small", null, [
              createVNode(_component_LocaleText, { t: "Use your own Private and Public Key" })
            ])
          ])
        ])
      ]),
      withDirectives(createBaseVNode("input", {
        class: normalizeClass(["form-control-sm form-control rounded-3", { "is-invalid": this.error }]),
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => this.keypair.publicKey = $event),
        onBlur: _cache[5] || (_cache[5] = ($event) => this.checkMatching()),
        disabled: !this.editKey || this.bulk,
        type: "text",
        id: "public_key"
      }, null, 42, _hoisted_12$1), [
        [vModelText, this.keypair.publicKey]
      ])
    ])
  ], 2);
}
const PrivatePublicKeyInput = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4]]);
const _sfc_main$4 = {
  name: "bulkAdd",
  components: { LocaleText },
  props: {
    saving: Boolean,
    data: Object,
    availableIp: void 0
  },
  data() {
    return {
      numberOfAvailableIPs: null
    };
  },
  computed: {
    bulkAddGetLocale() {
      return GetLocale("How many peers you want to add?");
    },
    getNumberOfAvailableIPs() {
      if (!this.numberOfAvailableIPs) {
        return "...";
      } else {
        return Object.values(this.numberOfAvailableIPs).reduce((x, y) => {
          return x + y;
        });
      }
    }
  },
  watch: {
    "data.bulkAdd": {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          fetchGet("/api/getNumberOfAvailableIPs/" + this.$route.params.id, {}, (res) => {
            if (res.status) {
              this.numberOfAvailableIPs = res.data;
            }
          });
        }
      }
    }
  }
};
const _hoisted_1$4 = { class: "form-check form-switch" };
const _hoisted_2$4 = ["disabled"];
const _hoisted_3$4 = {
  class: "form-check-label me-2",
  for: "bulk_add"
};
const _hoisted_4$2 = { class: "text-muted d-block" };
const _hoisted_5$2 = {
  key: 0,
  class: "form-group"
};
const _hoisted_6$1 = ["max", "placeholder"];
const _hoisted_7$1 = { class: "text-muted" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$4, [
      withDirectives(createBaseVNode("input", {
        class: "form-check-input",
        type: "checkbox",
        role: "switch",
        disabled: !this.availableIp,
        id: "bulk_add",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.bulkAdd = $event)
      }, null, 8, _hoisted_2$4), [
        [vModelCheckbox, this.data.bulkAdd]
      ]),
      createBaseVNode("label", _hoisted_3$4, [
        createBaseVNode("small", null, [
          createBaseVNode("strong", null, [
            createVNode(_component_LocaleText, { t: "Bulk Add" })
          ])
        ])
      ])
    ]),
    createBaseVNode("p", {
      class: normalizeClass({ "mb-0": !this.data.bulkAdd })
    }, [
      createBaseVNode("small", _hoisted_4$2, [
        createVNode(_component_LocaleText, { t: "By adding peers by bulk, each peer's name will be auto generated, and Allowed IP will be assign to the next available IP." })
      ])
    ], 2),
    this.data.bulkAdd ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
      withDirectives(createBaseVNode("input", {
        class: "form-control form-control-sm rounded-3 mb-1",
        type: "number",
        min: "1",
        id: "bulk_add_count",
        max: this.availableIp.length,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.data.bulkAddAmount = $event),
        placeholder: this.bulkAddGetLocale
      }, null, 8, _hoisted_6$1), [
        [vModelText, this.data.bulkAddAmount]
      ]),
      createBaseVNode("small", _hoisted_7$1, [
        createVNode(_component_LocaleText, {
          t: `You can add up to ` + $options.getNumberOfAvailableIPs + " peers"
        }, null, 8, ["t"])
      ])
    ])) : createCommentVNode("", true)
  ]);
}
const BulkAdd = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3]]);
const _sfc_main$3 = {
  name: "presharedKeyInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean
  },
  data() {
    return {
      enable: false
    };
  },
  watch: {
    enable() {
      if (this.enable) {
        this.data.preshared_key = window.wireguard.generateKeypair().presharedKey;
      } else {
        this.data.preshared_key = "";
      }
    }
  }
};
const _hoisted_1$3 = { class: "d-flex align-items-start" };
const _hoisted_2$3 = {
  for: "peer_preshared_key_textbox",
  class: "form-label"
};
const _hoisted_3$3 = { class: "text-muted" };
const _hoisted_4$1 = { class: "form-check form-switch ms-auto" };
const _hoisted_5$1 = ["disabled"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$3, [
      createBaseVNode("label", _hoisted_2$3, [
        createBaseVNode("small", _hoisted_3$3, [
          createVNode(_component_LocaleText, { t: "Pre-Shared Key" })
        ])
      ]),
      createBaseVNode("div", _hoisted_4$1, [
        withDirectives(createBaseVNode("input", {
          class: "form-check-input",
          type: "checkbox",
          role: "switch",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.enable = $event),
          id: "peer_preshared_key_switch"
        }, null, 512), [
          [vModelCheckbox, this.enable]
        ])
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "text",
      class: "form-control form-control-sm rounded-3",
      disabled: this.saving || !this.enable,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.data.preshared_key = $event),
      id: "peer_preshared_key_textbox"
    }, null, 8, _hoisted_5$1), [
      [vModelText, this.data.preshared_key]
    ])
  ]);
}
const PresharedKeyInput = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2]]);
const _sfc_main$2 = {
  name: "mtuInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean
  }
};
const _hoisted_1$2 = {
  for: "peer_mtu",
  class: "form-label"
};
const _hoisted_2$2 = { class: "text-muted" };
const _hoisted_3$2 = ["disabled"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("label", _hoisted_1$2, [
      createBaseVNode("small", _hoisted_2$2, [
        createVNode(_component_LocaleText, { t: "MTU" })
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "number",
      class: "form-control form-control-sm rounded-3",
      disabled: this.saving,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.mtu = $event),
      min: "0",
      id: "peer_mtu"
    }, null, 8, _hoisted_3$2), [
      [vModelText, this.data.mtu]
    ])
  ]);
}
const MtuInput = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
const _sfc_main$1 = {
  name: "persistentKeepAliveInput",
  components: { LocaleText },
  props: {
    data: Object,
    saving: Boolean
  }
};
const _hoisted_1$1 = {
  for: "peer_keep_alive",
  class: "form-label"
};
const _hoisted_2$1 = { class: "text-muted" };
const _hoisted_3$1 = ["disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("label", _hoisted_1$1, [
      createBaseVNode("small", _hoisted_2$1, [
        createVNode(_component_LocaleText, { t: "Persistent Keepalive" })
      ])
    ]),
    withDirectives(createBaseVNode("input", {
      type: "number",
      class: "form-control form-control-sm rounded-3",
      disabled: this.saving,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.data.keepalive = $event),
      id: "peer_keep_alive"
    }, null, 8, _hoisted_3$1), [
      [vModelText, this.data.keepalive]
    ])
  ]);
}
const PersistentKeepAliveInput = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
const _hoisted_1 = {
  class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll",
  ref: "editConfigurationContainer"
};
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = {
  class: "m-auto modal-dialog-centered dashboardModal",
  style: { "width": "1000px" }
};
const _hoisted_4 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4" };
const _hoisted_6 = { class: "mb-0" };
const _hoisted_7 = { class: "card-body px-4 pb-4" };
const _hoisted_8 = { class: "d-flex flex-column gap-2" };
const _hoisted_9 = {
  class: "accordion mb-3",
  id: "peerAddModalAccordion"
};
const _hoisted_10 = { class: "accordion-item" };
const _hoisted_11 = { class: "accordion-header" };
const _hoisted_12 = {
  class: "accordion-button collapsed rounded-3",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#peerAddModalAccordionAdvancedOptions"
};
const _hoisted_13 = {
  id: "peerAddModalAccordionAdvancedOptions",
  class: "accordion-collapse collapse collapsed",
  "data-bs-parent": "#peerAddModalAccordion"
};
const _hoisted_14 = { class: "accordion-body rounded-bottom-3" };
const _hoisted_15 = { class: "d-flex flex-column gap-2" };
const _hoisted_16 = { class: "row gy-3" };
const _hoisted_17 = {
  key: 0,
  class: "col-sm"
};
const _hoisted_18 = { class: "col-sm" };
const _hoisted_19 = { class: "col-sm" };
const _hoisted_20 = {
  key: 1,
  class: "col-12"
};
const _hoisted_21 = { class: "form-check form-switch" };
const _hoisted_22 = {
  class: "form-check-label",
  for: "bullAdd_PresharedKey_Switch"
};
const _hoisted_23 = { class: "fw-bold" };
const _hoisted_24 = { class: "d-flex mt-2" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = {
  key: 0,
  class: "bi bi-plus-circle-fill me-2"
};
const _sfc_main = {
  __name: "peerAddModal",
  emits: ["close", "addedPeers"],
  async setup(__props, { emit: __emit }) {
    let __temp, __restore;
    const dashboardStore = DashboardConfigurationStore();
    const wireguardStore = WireguardConfigurationsStore();
    const peerData = ref({
      bulkAdd: false,
      bulkAddAmount: 0,
      name: "",
      allowed_ips: [],
      private_key: "",
      public_key: "",
      DNS: dashboardStore.Configuration.Peers.peer_global_dns,
      endpoint_allowed_ip: dashboardStore.Configuration.Peers.peer_endpoint_allowed_ip,
      keepalive: parseInt(dashboardStore.Configuration.Peers.peer_keep_alive),
      mtu: parseInt(dashboardStore.Configuration.Peers.peer_mtu),
      preshared_key: "",
      preshared_key_bulkAdd: false,
      advanced_security: "off",
      allowed_ips_validation: true
    });
    const availableIp = ref([]);
    const saving = ref(false);
    const route = useRoute();
    [__temp, __restore] = withAsyncContext(() => fetchGet("/api/getAvailableIPs/" + route.params.id, {}, (res) => {
      if (res.status) {
        availableIp.value = res.data;
      }
    })), await __temp, __restore();
    const emits = __emit;
    computed(() => {
      return wireguardStore.Configurations.find((x) => x.Name === route.params.id).Protocol;
    });
    const allRequireFieldsFilled = computed(() => {
      let status = true;
      if (peerData.value.bulkAdd) {
        if (peerData.value.bulkAddAmount.length === 0 || peerData.value.bulkAddAmount > availableIp.value.length) {
          status = false;
        }
      } else {
        let requireFields = ["allowed_ips", "private_key", "public_key", "endpoint_allowed_ip", "keepalive", "mtu"];
        requireFields.forEach((x) => {
          if (peerData.value[x].length === 0) status = false;
        });
      }
      return status;
    });
    const peerCreate = () => {
      saving.value = true;
      fetchPost("/api/addPeers/" + route.params.id, peerData.value, (res) => {
        if (res.status) {
          dashboardStore.newMessage("Server", "Peer created successfully", "success");
          emits("addedPeers");
        } else {
          dashboardStore.newMessage("Server", res.message, "danger");
        }
        saving.value = false;
      });
    };
    watch(() => {
      return peerData.value.bulkAddAmount;
    }, () => {
      if (peerData.value.bulkAddAmount > availableIp.value.length) {
        peerData.value.bulkAddAmount = availableIp.value.length;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("h4", _hoisted_6, [
                  createVNode(LocaleText, { t: "Add Peers" })
                ]),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close ms-auto",
                  onClick: _cache[0] || (_cache[0] = ($event) => emits("close"))
                })
              ]),
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("div", _hoisted_8, [
                  createVNode(BulkAdd, {
                    saving: saving.value,
                    data: peerData.value,
                    availableIp: availableIp.value
                  }, null, 8, ["saving", "data", "availableIp"]),
                  !peerData.value.bulkAdd ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    _cache[3] || (_cache[3] = createBaseVNode("hr", { class: "mb-0 mt-2" }, null, -1)),
                    createVNode(NameInput, {
                      saving: saving.value,
                      data: peerData.value
                    }, null, 8, ["saving", "data"]),
                    createVNode(PrivatePublicKeyInput, {
                      saving: saving.value,
                      data: peerData.value
                    }, null, 8, ["saving", "data"]),
                    createVNode(AllowedIPsInput, {
                      availableIp: availableIp.value,
                      saving: saving.value,
                      data: peerData.value
                    }, null, 8, ["availableIp", "saving", "data"])
                  ], 64)) : createCommentVNode("", true)
                ]),
                _cache[5] || (_cache[5] = createBaseVNode("hr", null, null, -1)),
                createBaseVNode("div", _hoisted_9, [
                  createBaseVNode("div", _hoisted_10, [
                    createBaseVNode("h2", _hoisted_11, [
                      createBaseVNode("button", _hoisted_12, [
                        createVNode(LocaleText, { t: "Advanced Options" })
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_13, [
                      createBaseVNode("div", _hoisted_14, [
                        createBaseVNode("div", _hoisted_15, [
                          createVNode(DnsInput, {
                            saving: saving.value,
                            data: peerData.value
                          }, null, 8, ["saving", "data"]),
                          createVNode(EndpointAllowedIps, {
                            saving: saving.value,
                            data: peerData.value
                          }, null, 8, ["saving", "data"]),
                          createBaseVNode("div", _hoisted_16, [
                            !peerData.value.bulkAdd ? (openBlock(), createElementBlock("div", _hoisted_17, [
                              createVNode(PresharedKeyInput, {
                                saving: saving.value,
                                data: peerData.value,
                                bulk: peerData.value.bulkAdd
                              }, null, 8, ["saving", "data", "bulk"])
                            ])) : createCommentVNode("", true),
                            createBaseVNode("div", _hoisted_18, [
                              createVNode(MtuInput, {
                                saving: saving.value,
                                data: peerData.value
                              }, null, 8, ["saving", "data"])
                            ]),
                            createBaseVNode("div", _hoisted_19, [
                              createVNode(PersistentKeepAliveInput, {
                                saving: saving.value,
                                data: peerData.value
                              }, null, 8, ["saving", "data"])
                            ]),
                            peerData.value.bulkAdd ? (openBlock(), createElementBlock("div", _hoisted_20, [
                              createBaseVNode("div", _hoisted_21, [
                                withDirectives(createBaseVNode("input", {
                                  class: "form-check-input",
                                  type: "checkbox",
                                  role: "switch",
                                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => peerData.value.preshared_key_bulkAdd = $event),
                                  id: "bullAdd_PresharedKey_Switch",
                                  checked: ""
                                }, null, 512), [
                                  [vModelCheckbox, peerData.value.preshared_key_bulkAdd]
                                ]),
                                createBaseVNode("label", _hoisted_22, [
                                  createBaseVNode("small", _hoisted_23, [
                                    createVNode(LocaleText, { t: "Pre-Shared Key" }),
                                    _cache[4] || (_cache[4] = createTextVNode()),
                                    peerData.value.preshared_key_bulkAdd ? (openBlock(), createBlock(LocaleText, {
                                      key: 0,
                                      t: "Enabled"
                                    })) : (openBlock(), createBlock(LocaleText, {
                                      key: 1,
                                      t: "Disabled"
                                    }))
                                  ])
                                ])
                              ])
                            ])) : createCommentVNode("", true)
                          ])
                        ])
                      ])
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_24, [
                  createBaseVNode("button", {
                    class: "ms-auto btn btn-dark btn-brand rounded-3 px-3 py-2 shadow",
                    disabled: !allRequireFieldsFilled.value || saving.value,
                    onClick: _cache[2] || (_cache[2] = ($event) => peerCreate())
                  }, [
                    !saving.value ? (openBlock(), createElementBlock("i", _hoisted_26)) : createCommentVNode("", true),
                    saving.value ? (openBlock(), createBlock(LocaleText, {
                      key: 1,
                      t: "Adding..."
                    })) : (openBlock(), createBlock(LocaleText, {
                      key: 2,
                      t: "Add"
                    }))
                  ], 8, _hoisted_25)
                ])
              ])
            ])
          ])
        ])
      ], 512);
    };
  }
};
export {
  _sfc_main as default
};
