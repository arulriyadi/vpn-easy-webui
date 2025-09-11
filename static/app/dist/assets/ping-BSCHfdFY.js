import { _ as _export_sfc, D as DashboardConfigurationStore, g as fetchGet, c as createElementBlock, b as createBaseVNode, d as createVNode, m as withDirectives, B as vModelSelect, F as Fragment, h as renderList, e as createCommentVNode, y as vModelText, t as toDisplayString, w as withCtx, j as Transition, a as openBlock, f as createTextVNode, n as normalizeClass, s as normalizeStyle, i as createBlock, k as resolveComponent } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { O as OSMap } from "./osmap-BmSfGAec.js";
const _sfc_main = {
  name: "ping",
  components: { OSMap, LocaleText },
  data() {
    return {
      loading: false,
      cips: {},
      selectedConfiguration: void 0,
      selectedPeer: void 0,
      selectedIp: void 0,
      count: 4,
      pingResult: void 0,
      pinging: false
    };
  },
  setup() {
    const store = DashboardConfigurationStore();
    return { store };
  },
  mounted() {
    fetchGet("/api/ping/getAllPeersIpAddress", {}, (res) => {
      if (res.status) {
        this.loading = true;
        this.cips = res.data;
        console.log(this.cips);
      }
    });
  },
  methods: {
    execute() {
      if (this.selectedIp) {
        this.pinging = true;
        this.pingResult = void 0;
        fetchGet("/api/ping/execute", {
          ipAddress: this.selectedIp,
          count: this.count
        }, (res) => {
          if (res.status) {
            this.pingResult = res.data;
          } else {
            this.store.newMessage("Server", res.message, "danger");
          }
          this.pinging = false;
        });
      }
    }
  },
  watch: {
    selectedConfiguration() {
      this.selectedPeer = void 0;
      this.selectedIp = void 0;
    },
    selectedPeer() {
      this.selectedIp = void 0;
    }
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body" };
const _hoisted_2 = { class: "container" };
const _hoisted_3 = { class: "row" };
const _hoisted_4 = { class: "col-sm-4 d-flex gap-2 flex-column" };
const _hoisted_5 = {
  class: "mb-1 text-muted",
  for: "configuration"
};
const _hoisted_6 = ["disabled"];
const _hoisted_7 = ["value"];
const _hoisted_8 = {
  class: "mb-1 text-muted",
  for: "peer"
};
const _hoisted_9 = ["disabled"];
const _hoisted_10 = ["value"];
const _hoisted_11 = {
  class: "mb-1 text-muted",
  for: "ip"
};
const _hoisted_12 = ["disabled"];
const _hoisted_13 = { class: "d-flex align-items-center gap-2" };
const _hoisted_14 = { class: "text-muted" };
const _hoisted_15 = {
  class: "mb-1 text-muted",
  for: "ipAddress"
};
const _hoisted_16 = ["disabled"];
const _hoisted_17 = {
  class: "mb-1 text-muted",
  for: "count"
};
const _hoisted_18 = { class: "d-flex gap-3 align-items-center" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = ["disabled"];
const _hoisted_21 = {
  key: 0,
  class: "d-block"
};
const _hoisted_22 = {
  key: 1,
  class: "d-block"
};
const _hoisted_23 = { class: "col-sm-8 position-relative" };
const _hoisted_24 = { key: "pingPlaceholder" };
const _hoisted_25 = {
  key: "pingResult",
  class: "d-flex flex-column gap-2 w-100"
};
const _hoisted_26 = {
  class: "card rounded-3 bg-transparent shadow-sm animate__animated animate__fadeIn",
  style: { "animation-delay": "0.15s" }
};
const _hoisted_27 = { class: "card-body row" };
const _hoisted_28 = { class: "col-sm" };
const _hoisted_29 = { class: "mb-0 text-muted" };
const _hoisted_30 = {
  key: 0,
  class: "col-sm"
};
const _hoisted_31 = { class: "mb-0 text-muted" };
const _hoisted_32 = {
  class: "card rounded-3 bg-transparent shadow-sm animate__animated animate__fadeIn",
  style: { "animation-delay": "0.3s" }
};
const _hoisted_33 = { class: "card-body" };
const _hoisted_34 = {
  class: "card rounded-3 bg-transparent shadow-sm animate__animated animate__fadeIn",
  style: { "animation-delay": "0.45s" }
};
const _hoisted_35 = { class: "card-body" };
const _hoisted_36 = { class: "mb-0 text-muted" };
const _hoisted_37 = {
  class: "card rounded-3 bg-transparent shadow-sm animate__animated animate__fadeIn",
  style: { "animation-delay": "0.6s" }
};
const _hoisted_38 = { class: "card-body" };
const _hoisted_39 = { class: "mb-0 text-muted" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_OSMap = resolveComponent("OSMap");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      _cache[19] || (_cache[19] = createBaseVNode("h3", { class: "mb-3 text-body" }, "Ping", -1)),
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_5, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Configuration" })
              ])
            ]),
            withDirectives(createBaseVNode("select", {
              class: "form-select",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.selectedConfiguration = $event),
              disabled: this.pinging
            }, [
              _cache[7] || (_cache[7] = createBaseVNode("option", {
                disabled: "",
                selected: "",
                value: void 0
              }, null, -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(this.cips, (val, key) => {
                return openBlock(), createElementBlock("option", { value: key }, toDisplayString(key), 9, _hoisted_7);
              }), 256))
            ], 8, _hoisted_6), [
              [vModelSelect, this.selectedConfiguration]
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_8, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Peer" })
              ])
            ]),
            withDirectives(createBaseVNode("select", {
              id: "peer",
              class: "form-select",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => this.selectedPeer = $event),
              disabled: this.selectedConfiguration === void 0 || this.pinging
            }, [
              _cache[8] || (_cache[8] = createBaseVNode("option", {
                disabled: "",
                selected: "",
                value: void 0
              }, null, -1)),
              this.selectedConfiguration !== void 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(this.cips[this.selectedConfiguration], (peer, key) => {
                return openBlock(), createElementBlock("option", { value: key }, toDisplayString(key), 9, _hoisted_10);
              }), 256)) : createCommentVNode("", true)
            ], 8, _hoisted_9), [
              [vModelSelect, this.selectedPeer]
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_11, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "IP Address" })
              ])
            ]),
            withDirectives(createBaseVNode("select", {
              id: "ip",
              class: "form-select",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.selectedIp = $event),
              disabled: this.selectedPeer === void 0 || this.pinging
            }, [
              _cache[9] || (_cache[9] = createBaseVNode("option", {
                disabled: "",
                selected: "",
                value: void 0
              }, null, -1)),
              this.selectedPeer !== void 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(this.cips[this.selectedConfiguration][this.selectedPeer].allowed_ips, (ip) => {
                return openBlock(), createElementBlock("option", null, toDisplayString(ip), 1);
              }), 256)) : createCommentVNode("", true)
            ], 8, _hoisted_12), [
              [vModelSelect, this.selectedIp]
            ])
          ]),
          createBaseVNode("div", _hoisted_13, [
            _cache[10] || (_cache[10] = createBaseVNode("div", { class: "flex-grow-1 border-top" }, null, -1)),
            createBaseVNode("small", _hoisted_14, [
              createVNode(_component_LocaleText, { t: "OR" })
            ]),
            _cache[11] || (_cache[11] = createBaseVNode("div", { class: "flex-grow-1 border-top" }, null, -1))
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_15, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Enter IP Address / Hostname" })
              ])
            ]),
            withDirectives(createBaseVNode("input", {
              class: "form-control",
              type: "text",
              id: "ipAddress",
              disabled: this.pinging,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.selectedIp = $event)
            }, null, 8, _hoisted_16), [
              [vModelText, this.selectedIp]
            ])
          ]),
          _cache[16] || (_cache[16] = createBaseVNode("div", { class: "w-100 border-top my-2" }, null, -1)),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_17, [
              createBaseVNode("small", null, [
                createVNode(_component_LocaleText, { t: "Count" })
              ])
            ]),
            createBaseVNode("div", _hoisted_18, [
              createBaseVNode("button", {
                onClick: _cache[4] || (_cache[4] = ($event) => this.count--),
                disabled: this.count === 1,
                class: "btn btn-sm bg-secondary-subtle text-secondary-emphasis"
              }, _cache[12] || (_cache[12] = [
                createBaseVNode("i", { class: "bi bi-dash-lg" }, null, -1)
              ]), 8, _hoisted_19),
              createBaseVNode("strong", null, toDisplayString(this.count), 1),
              createBaseVNode("button", {
                role: "button",
                onClick: _cache[5] || (_cache[5] = ($event) => this.count++),
                class: "btn btn-sm bg-secondary-subtle text-secondary-emphasis"
              }, _cache[13] || (_cache[13] = [
                createBaseVNode("i", { class: "bi bi-plus-lg" }, null, -1)
              ]))
            ])
          ]),
          createBaseVNode("button", {
            class: "btn btn-primary rounded-3 mt-3 position-relative",
            disabled: !this.selectedIp || this.pinging,
            onClick: _cache[6] || (_cache[6] = ($event) => this.execute())
          }, [
            createVNode(Transition, { name: "slide" }, {
              default: withCtx(() => [
                !this.pinging ? (openBlock(), createElementBlock("span", _hoisted_21, _cache[14] || (_cache[14] = [
                  createBaseVNode("i", { class: "bi bi-person-walking me-2" }, null, -1),
                  createTextVNode("Ping! ")
                ]))) : (openBlock(), createElementBlock("span", _hoisted_22, _cache[15] || (_cache[15] = [
                  createBaseVNode("span", {
                    class: "spinner-border spinner-border-sm",
                    "aria-hidden": "true"
                  }, null, -1),
                  createBaseVNode("span", {
                    class: "visually-hidden",
                    role: "status"
                  }, "Loading...", -1)
                ])))
              ]),
              _: 1
            })
          ], 8, _hoisted_20)
        ]),
        createBaseVNode("div", _hoisted_23, [
          createVNode(Transition, { name: "ping" }, {
            default: withCtx(() => [
              !this.pingResult ? (openBlock(), createElementBlock("div", _hoisted_24, [
                _cache[17] || (_cache[17] = createBaseVNode("div", {
                  class: "pingPlaceholder bg-body-secondary rounded-3 mb-3",
                  style: { "height": "300px" }
                }, null, -1)),
                (openBlock(), createElementBlock(Fragment, null, renderList(4, (x) => {
                  return createBaseVNode("div", {
                    class: normalizeClass(["pingPlaceholder bg-body-secondary rounded-3 mb-3", { "animate__animated animate__flash animate__slower animate__infinite": this.pinging }]),
                    style: normalizeStyle({ "animation-delay": `${x * 0.15}s` })
                  }, null, 6);
                }), 64))
              ])) : (openBlock(), createElementBlock("div", _hoisted_25, [
                this.pingResult.geo && this.pingResult.geo.status === "success" ? (openBlock(), createBlock(_component_OSMap, {
                  key: 0,
                  d: this.pingResult
                }, null, 8, ["d"])) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_26, [
                  createBaseVNode("div", _hoisted_27, [
                    createBaseVNode("div", _hoisted_28, [
                      createBaseVNode("p", _hoisted_29, [
                        createBaseVNode("small", null, [
                          createVNode(_component_LocaleText, { t: "IP Address" })
                        ])
                      ]),
                      createTextVNode(" " + toDisplayString(this.pingResult.address), 1)
                    ]),
                    this.pingResult.geo && this.pingResult.geo.status === "success" ? (openBlock(), createElementBlock("div", _hoisted_30, [
                      createBaseVNode("p", _hoisted_31, [
                        createBaseVNode("small", null, [
                          createVNode(_component_LocaleText, { t: "Geolocation" })
                        ])
                      ]),
                      createTextVNode(" " + toDisplayString(this.pingResult.geo.city) + ", " + toDisplayString(this.pingResult.geo.country), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                createBaseVNode("div", _hoisted_32, [
                  createBaseVNode("div", _hoisted_33, [
                    _cache[18] || (_cache[18] = createBaseVNode("p", { class: "mb-0 text-muted" }, [
                      createBaseVNode("small", null, "Is Alive")
                    ], -1)),
                    createBaseVNode("span", {
                      class: normalizeClass([this.pingResult.is_alive ? "text-success" : "text-danger"])
                    }, [
                      createBaseVNode("i", {
                        class: normalizeClass(["bi me-1", [this.pingResult.is_alive ? "bi-check-circle-fill" : "bi-x-circle-fill"]])
                      }, null, 2),
                      createTextVNode(" " + toDisplayString(this.pingResult.is_alive ? "Yes" : "No"), 1)
                    ], 2)
                  ])
                ]),
                createBaseVNode("div", _hoisted_34, [
                  createBaseVNode("div", _hoisted_35, [
                    createBaseVNode("p", _hoisted_36, [
                      createBaseVNode("small", null, [
                        createVNode(_component_LocaleText, { t: "Average / Min / Max Round Trip Time" })
                      ])
                    ]),
                    createBaseVNode("samp", null, toDisplayString(this.pingResult.avg_rtt) + "ms / " + toDisplayString(this.pingResult.min_rtt) + "ms / " + toDisplayString(this.pingResult.max_rtt) + "ms ", 1)
                  ])
                ]),
                createBaseVNode("div", _hoisted_37, [
                  createBaseVNode("div", _hoisted_38, [
                    createBaseVNode("p", _hoisted_39, [
                      createBaseVNode("small", null, [
                        createVNode(_component_LocaleText, { t: "Sent / Received / Lost Package" })
                      ])
                    ]),
                    createBaseVNode("samp", null, toDisplayString(this.pingResult.package_sent) + " / " + toDisplayString(this.pingResult.package_received) + " / " + toDisplayString(this.pingResult.package_loss), 1)
                  ])
                ])
              ]))
            ]),
            _: 1
          })
        ])
      ])
    ])
  ]);
}
const ping = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a08ce97e"]]);
export {
  ping as default
};
