import { p as parse } from "./index-Q14vox-x.js";
import { _ as _export_sfc, W as WireguardConfigurationsStore, r as ref, g as fetchGet, D as DashboardConfigurationStore, A as fetchPost, c as createElementBlock, b as createBaseVNode, d as createVNode, w as withCtx, n as normalizeClass, e as createCommentVNode, m as withDirectives, y as vModelText, t as toDisplayString, f as createTextVNode, F as Fragment, h as renderList, k as resolveComponent, a as openBlock } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const parseInterface = (conf) => {
  const lineSplit = conf.split("\n");
  const configuration = {};
  for (let line of lineSplit) {
    if (line === "[Peer]") break;
    if (line.length > 0) {
      let l = line.replace(" = ", "=");
      if (l.indexOf("=") > -1) {
        l = [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)];
        if (l[0] === "ListenPort") {
          configuration[l[0]] = parseInt(l[1]);
        } else {
          configuration[l[0]] = l[1];
        }
      }
    }
  }
  return configuration;
};
const parsePeers = (conf) => {
  const lineSplit = conf.split("\n");
  const peers = [];
  let pCounter = -1;
  const firstPeer = lineSplit.indexOf("[Peer]");
  if (firstPeer === -1) return false;
  for (let l = firstPeer; l < lineSplit.length; l++) {
    if (lineSplit[l] === "[Peer]") {
      pCounter += 1;
      peers.push({});
      peers[pCounter]["name"] = "";
    } else {
      let line = lineSplit[l].replace(" = ", "=");
      if (line.indexOf("=") > -1) {
        line = [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)];
        peers[pCounter][line[0]] = line[1];
      }
    }
  }
  return peers;
};
const _sfc_main = {
  name: "newConfiguration",
  components: { LocaleText },
  async setup() {
    const store = WireguardConfigurationsStore();
    const protocols = ref([]);
    await fetchGet("/api/protocolsEnabled", {}, (res) => {
      protocols.value = res.data;
    });
    const dashboardStore = DashboardConfigurationStore();
    return { store, protocols, dashboardStore };
  },
  data() {
    return {
      newConfiguration: {
        ConfigurationName: "",
        Address: "",
        ListenPort: "",
        PrivateKey: "",
        PublicKey: "",
        PresharedKey: "",
        PreUp: "",
        PreDown: "",
        PostUp: "",
        PostDown: "",
        Table: "",
        Protocol: "wg",
        Jc: 5,
        Jmin: 49,
        Jmax: 998,
        S1: 17,
        S2: 110,
        H1: 0,
        H2: 0,
        H3: 0,
        H4: 0
      },
      numberOfAvailableIPs: "0",
      error: false,
      errorMessage: "",
      success: false,
      loading: false,
      parseInterfaceResult: void 0,
      parsePeersResult: void 0
    };
  },
  created() {
    this.wireguardGenerateKeypair();
    let hValue = [];
    while ([...new Set(hValue)].length !== 4) {
      hValue = [this.rand(1, 2 ** 31 - 1), this.rand(1, 2 ** 31 - 1), this.rand(1, 2 ** 31 - 1), this.rand(1, 2 ** 31 - 1)];
    }
    this.newConfiguration.H1 = hValue[0];
    this.newConfiguration.H2 = hValue[1];
    this.newConfiguration.H3 = hValue[2];
    this.newConfiguration.H4 = hValue[3];
  },
  methods: {
    rand(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    wireguardGenerateKeypair() {
      const wg = window.wireguard.generateKeypair();
      this.newConfiguration.PrivateKey = wg.privateKey;
      this.newConfiguration.PublicKey = wg.publicKey;
      this.newConfiguration.PresharedKey = wg.presharedKey;
    },
    async saveNewConfiguration() {
      if (this.goodToSubmit) {
        this.loading = true;
        await fetchPost("/api/addWireguardConfiguration", this.newConfiguration, async (res) => {
          if (res.status) {
            this.success = true;
            await this.store.getConfigurations();
            this.$router.push(`/configuration/${this.newConfiguration.ConfigurationName}/peers`);
          } else {
            this.error = true;
            this.errorMessage = res.message;
            document.querySelector(`#${res.data}`).classList.remove("is-valid");
            document.querySelector(`#${res.data}`).classList.add("is-invalid");
            this.loading = false;
          }
        });
      }
    },
    openFileUpload() {
      document.querySelector("#fileUpload").click();
    },
    readFile(e) {
      const file = e.target.files[0];
      if (!file) return false;
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.parseInterfaceResult = parseInterface(evt.target.result);
        this.parsePeersResult = parsePeers(evt.target.result);
        let appliedFields = 0;
        if (this.parseInterfaceResult) {
          this.newConfiguration.ConfigurationName = file.name.replace(".conf", "");
          for (let i of Object.keys(this.parseInterfaceResult)) {
            if (Object.keys(this.newConfiguration).includes(i)) {
              this.newConfiguration[i] = this.parseInterfaceResult[i];
              appliedFields += 1;
            }
          }
        }
        if (appliedFields > 0) {
          this.dashboardStore.newMessage("WGDashboard", `Parse successful! Updated ${appliedFields} field(s)`, "success");
        } else {
          this.dashboardStore.newMessage("WGDashboard", `Parse failed`, "danger");
        }
      };
      reader.readAsText(file);
    }
  },
  computed: {
    goodToSubmit() {
      let requirements = ["ConfigurationName", "Address", "ListenPort", "PrivateKey"];
      let elements = [...document.querySelectorAll("input[required]")];
      return requirements.find((x) => {
        return this.newConfiguration[x].length === 0;
      }) === void 0 && elements.find((x) => {
        return x.classList.contains("is-invalid");
      }) === void 0;
    }
  },
  watch: {
    "newConfiguration.Address"(newVal) {
      let ele = document.querySelector("#Address");
      ele.classList.remove("is-invalid", "is-valid");
      try {
        if (newVal.trim().split("/").filter((x) => x.length > 0).length !== 2) {
          throw Error();
        }
        let p = parse(newVal);
        let i = p.end - p.start;
        this.numberOfAvailableIPs = i.toLocaleString();
        ele.classList.add("is-valid");
      } catch (e) {
        this.numberOfAvailableIPs = "0";
        ele.classList.add("is-invalid");
      }
    },
    "newConfiguration.ListenPort"(newVal) {
      let ele = document.querySelector("#ListenPort");
      ele.classList.remove("is-invalid", "is-valid");
      if (newVal < 0 || newVal > 65353 || !Number.isInteger(newVal)) {
        ele.classList.add("is-invalid");
      } else {
        ele.classList.add("is-valid");
      }
    },
    "newConfiguration.ConfigurationName"(newVal) {
      let ele = document.querySelector("#ConfigurationName");
      ele.classList.remove("is-invalid", "is-valid");
      if (!/^[a-zA-Z0-9_=+.-]{1,15}$/.test(newVal) || newVal.length === 0 || this.store.Configurations.find((x) => x.Name === newVal)) {
        ele.classList.add("is-invalid");
      } else {
        ele.classList.add("is-valid");
      }
    },
    "newConfiguration.PrivateKey"(newVal) {
      let ele = document.querySelector("#PrivateKey");
      ele.classList.remove("is-invalid", "is-valid");
      try {
        wireguard.generatePublicKey(newVal);
        ele.classList.add("is-valid");
      } catch (e) {
        ele.classList.add("is-invalid");
      }
    }
  },
  mounted() {
    const fileUpload = document.querySelector("#fileUpload");
    fileUpload.addEventListener("change", this.readFile, false);
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body" };
const _hoisted_2 = { class: "container mb-4" };
const _hoisted_3 = { class: "mb-4 d-flex align-items-center gap-4 align-items-center" };
const _hoisted_4 = { class: "mb-0" };
const _hoisted_5 = { class: "d-flex gap-2 ms-auto" };
const _hoisted_6 = { class: "card rounded-3 shadow" };
const _hoisted_7 = { class: "card-header" };
const _hoisted_8 = { class: "card-body d-flex gap-2 protocolBtnGroup" };
const _hoisted_9 = {
  key: 0,
  class: "bi bi-check-circle-fill me-2"
};
const _hoisted_10 = {
  key: 1,
  class: "bi bi-circle me-2"
};
const _hoisted_11 = {
  key: 0,
  class: "bi bi-check-circle-fill me-2"
};
const _hoisted_12 = {
  key: 1,
  class: "bi bi-circle me-2"
};
const _hoisted_13 = { class: "card rounded-3 shadow" };
const _hoisted_14 = { class: "card-header" };
const _hoisted_15 = { class: "card-body" };
const _hoisted_16 = ["disabled"];
const _hoisted_17 = { class: "invalid-feedback" };
const _hoisted_18 = { key: 0 };
const _hoisted_19 = { key: 1 };
const _hoisted_20 = { class: "mb-0" };
const _hoisted_21 = { class: "card rounded-3 shadow" };
const _hoisted_22 = { class: "card-header" };
const _hoisted_23 = {
  class: "card-body",
  style: { "font-family": "var(--bs-font-monospace)" }
};
const _hoisted_24 = { class: "mb-2" };
const _hoisted_25 = { class: "text-muted fw-bold mb-1" };
const _hoisted_26 = { class: "input-group" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = { class: "text-muted fw-bold mb-1" };
const _hoisted_29 = { class: "card rounded-3 shadow" };
const _hoisted_30 = { class: "card-header" };
const _hoisted_31 = { class: "card-body" };
const _hoisted_32 = ["disabled"];
const _hoisted_33 = { class: "invalid-feedback" };
const _hoisted_34 = { key: 0 };
const _hoisted_35 = { key: 1 };
const _hoisted_36 = { class: "card rounded-3 shadow" };
const _hoisted_37 = { class: "card-header d-flex align-items-center" };
const _hoisted_38 = { class: "badge rounded-pill text-bg-success ms-auto" };
const _hoisted_39 = { class: "card-body" };
const _hoisted_40 = ["disabled"];
const _hoisted_41 = { class: "invalid-feedback" };
const _hoisted_42 = { key: 0 };
const _hoisted_43 = { key: 1 };
const _hoisted_44 = {
  class: "accordion",
  id: "newConfigurationOptionalAccordion"
};
const _hoisted_45 = { class: "accordion-item" };
const _hoisted_46 = { class: "accordion-header" };
const _hoisted_47 = {
  class: "accordion-button collapsed",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#newConfigurationOptionalAccordionCollapse"
};
const _hoisted_48 = {
  id: "newConfigurationOptionalAccordionCollapse",
  class: "accordion-collapse collapse",
  "data-bs-parent": "#newConfigurationOptionalAccordion"
};
const _hoisted_49 = { class: "accordion-body d-flex flex-column gap-3" };
const _hoisted_50 = { class: "card rounded-3" };
const _hoisted_51 = { class: "card-header" };
const _hoisted_52 = { class: "card-body" };
const _hoisted_53 = ["id", "onUpdate:modelValue"];
const _hoisted_54 = { class: "card rounded-3" };
const _hoisted_55 = { class: "card-header" };
const _hoisted_56 = { class: "card-body" };
const _hoisted_57 = ["id", "onUpdate:modelValue"];
const _hoisted_58 = ["disabled"];
const _hoisted_59 = {
  key: 0,
  class: "d-flex w-100"
};
const _hoisted_60 = {
  key: 1,
  class: "d-flex w-100"
};
const _hoisted_61 = {
  key: 2,
  class: "d-flex w-100 align-items-center"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createVNode(_component_RouterLink, {
          to: "/",
          class: "btn btn-dark btn-brand p-2 shadow",
          style: { "border-radius": "100%" }
        }, {
          default: withCtx(() => _cache[10] || (_cache[10] = [
            createBaseVNode("h2", {
              class: "mb-0",
              style: { "line-height": "0" }
            }, [
              createBaseVNode("i", { class: "bi bi-arrow-left-circle" })
            ], -1)
          ])),
          _: 1
        }),
        createBaseVNode("h2", _hoisted_4, [
          createVNode(_component_LocaleText, { t: "New Configuration" })
        ]),
        createBaseVNode("div", _hoisted_5, [
          createBaseVNode("button", {
            class: "titleBtn py-2 text-decoration-none btn text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.openFileUpload()),
            type: "button",
            "aria-expanded": "false"
          }, [
            _cache[11] || (_cache[11] = createBaseVNode("i", { class: "bi bi-upload me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: "Open File" })
          ]),
          _cache[12] || (_cache[12] = createBaseVNode("input", {
            type: "file",
            id: "fileUpload",
            multiple: "",
            class: "d-none",
            accept: "text/plain"
          }, null, -1))
        ])
      ]),
      createBaseVNode("form", {
        class: "text-body d-flex flex-column gap-3",
        onSubmit: _cache[9] || (_cache[9] = (e) => {
          e.preventDefault();
          this.saveNewConfiguration();
        })
      }, [
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", _hoisted_7, [
            createVNode(_component_LocaleText, { t: "Protocol" })
          ]),
          createBaseVNode("div", _hoisted_8, [
            this.protocols.includes("wg") ? (openBlock(), createElementBlock("a", {
              key: 0,
              onClick: _cache[1] || (_cache[1] = ($event) => this.newConfiguration.Protocol = "wg"),
              class: normalizeClass([{ "opacity-50": this.newConfiguration.Protocol !== "wg" }, "btn btn-primary wireguardBg border-0"]),
              style: { "flex-basis": "100%" }
            }, [
              this.newConfiguration.Protocol === "wg" ? (openBlock(), createElementBlock("i", _hoisted_9)) : (openBlock(), createElementBlock("i", _hoisted_10)),
              _cache[13] || (_cache[13] = createBaseVNode("strong", null, " WireGuard ", -1))
            ], 2)) : createCommentVNode("", true),
            this.protocols.includes("awg") ? (openBlock(), createElementBlock("a", {
              key: 1,
              onClick: _cache[2] || (_cache[2] = ($event) => this.newConfiguration.Protocol = "awg"),
              class: normalizeClass([{ "opacity-50": this.newConfiguration.Protocol !== "awg" }, "btn btn-primary amneziawgBg border-0"]),
              style: { "flex-basis": "100%" }
            }, [
              this.newConfiguration.Protocol === "awg" ? (openBlock(), createElementBlock("i", _hoisted_11)) : (openBlock(), createElementBlock("i", _hoisted_12)),
              _cache[14] || (_cache[14] = createBaseVNode("strong", null, " AmneziaWG ", -1))
            ], 2)) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_13, [
          createBaseVNode("div", _hoisted_14, [
            createVNode(_component_LocaleText, { t: "Configuration Name" })
          ]),
          createBaseVNode("div", _hoisted_15, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: "form-control",
              placeholder: "ex. wg1",
              id: "ConfigurationName",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.newConfiguration.ConfigurationName = $event),
              disabled: this.loading,
              required: ""
            }, null, 8, _hoisted_16), [
              [vModelText, this.newConfiguration.ConfigurationName]
            ]),
            createBaseVNode("div", _hoisted_17, [
              this.error ? (openBlock(), createElementBlock("div", _hoisted_18, toDisplayString(this.errorMessage), 1)) : (openBlock(), createElementBlock("div", _hoisted_19, [
                createVNode(_component_LocaleText, { t: "Configuration name is invalid. Possible reasons:" }),
                createBaseVNode("ul", _hoisted_20, [
                  createBaseVNode("li", null, [
                    createVNode(_component_LocaleText, { t: "Configuration name already exist." })
                  ]),
                  createBaseVNode("li", null, [
                    createVNode(_component_LocaleText, { t: "Configuration name can only contain 15 lower/uppercase alphabet, numbers, underscore, equal sign, plus sign, period and hyphen." })
                  ])
                ])
              ]))
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_21, [
          createBaseVNode("div", _hoisted_22, [
            createVNode(_component_LocaleText, { t: "Private Key" }),
            _cache[15] || (_cache[15] = createTextVNode(" & ")),
            createVNode(_component_LocaleText, { t: "Public Key" })
          ]),
          createBaseVNode("div", _hoisted_23, [
            createBaseVNode("div", _hoisted_24, [
              createBaseVNode("label", _hoisted_25, [
                createBaseVNode("small", null, [
                  createVNode(_component_LocaleText, { t: "Private Key" })
                ])
              ]),
              createBaseVNode("div", _hoisted_26, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control",
                  id: "PrivateKey",
                  required: "",
                  disabled: this.loading,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => this.newConfiguration.PrivateKey = $event)
                }, null, 8, _hoisted_27), [
                  [vModelText, this.newConfiguration.PrivateKey]
                ]),
                createBaseVNode("button", {
                  class: "btn btn-outline-primary",
                  type: "button",
                  title: "Regenerate Private Key",
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.wireguardGenerateKeypair())
                }, _cache[16] || (_cache[16] = [
                  createBaseVNode("i", { class: "bi bi-arrow-repeat" }, null, -1)
                ]))
              ])
            ]),
            createBaseVNode("div", null, [
              createBaseVNode("label", _hoisted_28, [
                createBaseVNode("small", null, [
                  createVNode(_component_LocaleText, { t: "Public Key" })
                ])
              ]),
              withDirectives(createBaseVNode("input", {
                type: "text",
                class: "form-control",
                id: "PublicKey",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => this.newConfiguration.PublicKey = $event),
                disabled: ""
              }, null, 512), [
                [vModelText, this.newConfiguration.PublicKey]
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_29, [
          createBaseVNode("div", _hoisted_30, [
            createVNode(_component_LocaleText, { t: "Listen Port" })
          ]),
          createBaseVNode("div", _hoisted_31, [
            withDirectives(createBaseVNode("input", {
              type: "number",
              class: "form-control",
              placeholder: "0-65353",
              id: "ListenPort",
              min: "1",
              max: "65353",
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => this.newConfiguration.ListenPort = $event),
              disabled: this.loading,
              required: ""
            }, null, 8, _hoisted_32), [
              [vModelText, this.newConfiguration.ListenPort]
            ]),
            createBaseVNode("div", _hoisted_33, [
              this.error ? (openBlock(), createElementBlock("div", _hoisted_34, toDisplayString(this.errorMessage), 1)) : (openBlock(), createElementBlock("div", _hoisted_35, [
                createVNode(_component_LocaleText, { t: "Invalid port" })
              ]))
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_36, [
          createBaseVNode("div", _hoisted_37, [
            createVNode(_component_LocaleText, { t: "IP Address/CIDR" }),
            createBaseVNode("span", _hoisted_38, [
              createVNode(_component_LocaleText, {
                t: $data.numberOfAvailableIPs + " Available IP Address"
              }, null, 8, ["t"])
            ])
          ]),
          createBaseVNode("div", _hoisted_39, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: "form-control",
              placeholder: "Ex: 10.0.0.1/24",
              id: "Address",
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => this.newConfiguration.Address = $event),
              disabled: this.loading,
              required: ""
            }, null, 8, _hoisted_40), [
              [vModelText, this.newConfiguration.Address]
            ]),
            createBaseVNode("div", _hoisted_41, [
              this.error ? (openBlock(), createElementBlock("div", _hoisted_42, toDisplayString(this.errorMessage), 1)) : (openBlock(), createElementBlock("div", _hoisted_43, " IP Address/CIDR is invalid "))
            ])
          ])
        ]),
        _cache[21] || (_cache[21] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", _hoisted_44, [
          createBaseVNode("div", _hoisted_45, [
            createBaseVNode("h2", _hoisted_46, [
              createBaseVNode("button", _hoisted_47, [
                createVNode(_component_LocaleText, { t: "Optional Settings" })
              ])
            ]),
            createBaseVNode("div", _hoisted_48, [
              createBaseVNode("div", _hoisted_49, [
                (openBlock(), createElementBlock(Fragment, null, renderList(["Table", "PreUp", "PreDown", "PostUp", "PostDown"], (key) => {
                  return createBaseVNode("div", _hoisted_50, [
                    createBaseVNode("div", _hoisted_51, toDisplayString(key), 1),
                    createBaseVNode("div", _hoisted_52, [
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        class: "form-control font-monospace",
                        id: key,
                        "onUpdate:modelValue": ($event) => this.newConfiguration[key] = $event
                      }, null, 8, _hoisted_53), [
                        [vModelText, this.newConfiguration[key]]
                      ])
                    ])
                  ]);
                }), 64)),
                this.newConfiguration.Protocol === "awg" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, renderList(["Jc", "Jmin", "Jmax", "S1", "S2", "H1", "H2", "H3", "H4"], (key) => {
                  return createBaseVNode("div", _hoisted_54, [
                    createBaseVNode("div", _hoisted_55, toDisplayString(key), 1),
                    createBaseVNode("div", _hoisted_56, [
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        class: "form-control font-monospace",
                        id: key,
                        "onUpdate:modelValue": ($event) => this.newConfiguration[key] = $event
                      }, null, 8, _hoisted_57), [
                        [vModelText, this.newConfiguration[key]]
                      ])
                    ])
                  ]);
                }), 64)) : createCommentVNode("", true)
              ])
            ])
          ])
        ]),
        createBaseVNode("button", {
          class: "btn btn-dark btn-brand rounded-3 px-3 py-2 shadow ms-auto",
          disabled: !this.goodToSubmit || this.loading || this.success
        }, [
          this.success ? (openBlock(), createElementBlock("span", _hoisted_59, [
            createVNode(_component_LocaleText, { t: "Success" }),
            _cache[17] || (_cache[17] = createTextVNode("! ")),
            _cache[18] || (_cache[18] = createBaseVNode("i", { class: "bi bi-check-circle-fill ms-2" }, null, -1))
          ])) : !this.loading ? (openBlock(), createElementBlock("span", _hoisted_60, [
            _cache[19] || (_cache[19] = createBaseVNode("i", { class: "bi bi-save-fill me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: "Save" })
          ])) : (openBlock(), createElementBlock("span", _hoisted_61, [
            createVNode(_component_LocaleText, { t: "Saving..." }),
            _cache[20] || (_cache[20] = createBaseVNode("span", {
              class: "ms-2 spinner-border spinner-border-sm",
              role: "status"
            }, null, -1))
          ]))
        ], 8, _hoisted_58)
      ], 32)
    ])
  ]);
}
const newConfiguration = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b97242f3"]]);
export {
  newConfiguration as default
};
