import { _ as _export_sfc, W as WireguardConfigurationsStore, g as fetchGet, c as createElementBlock, b as createBaseVNode, d as createVNode, m as withDirectives, y as vModelText, C as withKeys, w as withCtx, j as Transition, a as openBlock, f as createTextVNode, F as Fragment, h as renderList, n as normalizeClass, s as normalizeStyle, t as toDisplayString, k as resolveComponent } from "./index-xvqfLBaG.js";
import { O as OSMap } from "./osmap-BmSfGAec.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main = {
  name: "traceroute",
  components: { LocaleText, OSMap },
  data() {
    return {
      tracing: false,
      ipAddress: void 0,
      tracerouteResult: void 0
    };
  },
  setup() {
    const store = WireguardConfigurationsStore();
    return { store };
  },
  methods: {
    execute() {
      if (this.ipAddress) {
        this.tracing = true;
        this.tracerouteResult = void 0;
        fetchGet("/api/traceroute/execute", {
          ipAddress: this.ipAddress
        }, (res) => {
          if (res.status) {
            this.tracerouteResult = res.data;
          } else {
            this.store.newMessage("Server", res.message, "danger");
          }
          this.tracing = false;
        });
      }
    }
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body" };
const _hoisted_2 = { class: "container-md" };
const _hoisted_3 = { class: "mb-3 text-body" };
const _hoisted_4 = { class: "d-flex gap-2 mb-3 flex-column" };
const _hoisted_5 = { class: "flex-grow-1" };
const _hoisted_6 = {
  class: "mb-1 text-muted",
  for: "ipAddress"
};
const _hoisted_7 = ["disabled"];
const _hoisted_8 = ["disabled"];
const _hoisted_9 = {
  key: 0,
  class: "d-block"
};
const _hoisted_10 = {
  key: 1,
  class: "d-block"
};
const _hoisted_11 = { class: "position-relative" };
const _hoisted_12 = { key: "pingPlaceholder" };
const _hoisted_13 = { key: 1 };
const _hoisted_14 = {
  key: "table",
  class: "w-100 mt-2"
};
const _hoisted_15 = { class: "table table-sm rounded-3 w-100" };
const _hoisted_16 = { scope: "col" };
const _hoisted_17 = { scope: "col" };
const _hoisted_18 = { scope: "col" };
const _hoisted_19 = { scope: "col" };
const _hoisted_20 = { scope: "col" };
const _hoisted_21 = { scope: "col" };
const _hoisted_22 = { key: 0 };
const _hoisted_23 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_OSMap = resolveComponent("OSMap");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("h3", _hoisted_3, [
        createVNode(_component_LocaleText, { t: "Traceroute" })
      ]),
      createBaseVNode("div", _hoisted_4, [
        createBaseVNode("div", _hoisted_5, [
          createBaseVNode("label", _hoisted_6, [
            createBaseVNode("small", null, [
              createVNode(_component_LocaleText, { t: "Enter IP Address / Hostname" })
            ])
          ]),
          withDirectives(createBaseVNode("input", {
            disabled: this.tracing,
            id: "ipAddress",
            class: "form-control rounded-3",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.ipAddress = $event),
            onKeyup: _cache[1] || (_cache[1] = withKeys(($event) => this.execute(), ["enter"])),
            type: "text"
          }, null, 40, _hoisted_7), [
            [vModelText, this.ipAddress]
          ])
        ]),
        createBaseVNode("button", {
          class: "btn btn-primary rounded-3 position-relative flex-grow-1",
          disabled: this.tracing || !this.ipAddress,
          onClick: _cache[2] || (_cache[2] = ($event) => this.execute())
        }, [
          createVNode(Transition, { name: "slide" }, {
            default: withCtx(() => [
              !this.tracing ? (openBlock(), createElementBlock("span", _hoisted_9, _cache[3] || (_cache[3] = [
                createBaseVNode("i", { class: "bi bi-person-walking me-2" }, null, -1),
                createTextVNode("Trace! ")
              ]))) : (openBlock(), createElementBlock("span", _hoisted_10, _cache[4] || (_cache[4] = [
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
        ], 8, _hoisted_8)
      ]),
      createBaseVNode("div", _hoisted_11, [
        createVNode(Transition, { name: "ping" }, {
          default: withCtx(() => [
            !this.tracerouteResult ? (openBlock(), createElementBlock("div", _hoisted_12, [
              _cache[5] || (_cache[5] = createBaseVNode("div", {
                class: "pingPlaceholder bg-body-secondary rounded-3 mb-3",
                style: { "height": "300px !important" }
              }, null, -1)),
              (openBlock(), createElementBlock(Fragment, null, renderList(5, (x) => {
                return createBaseVNode("div", {
                  class: normalizeClass(["pingPlaceholder bg-body-secondary rounded-3 mb-3", { "animate__animated animate__flash animate__slower animate__infinite": this.tracing }]),
                  style: normalizeStyle({ "animation-delay": `${x * 0.05}s` })
                }, null, 6);
              }), 64))
            ])) : (openBlock(), createElementBlock("div", _hoisted_13, [
              createVNode(_component_OSMap, {
                d: this.tracerouteResult,
                type: "traceroute"
              }, null, 8, ["d"]),
              createBaseVNode("div", _hoisted_14, [
                createBaseVNode("table", _hoisted_15, [
                  createBaseVNode("thead", null, [
                    createBaseVNode("tr", null, [
                      createBaseVNode("th", _hoisted_16, [
                        createVNode(_component_LocaleText, { t: "Hop" })
                      ]),
                      createBaseVNode("th", _hoisted_17, [
                        createVNode(_component_LocaleText, { t: "IP Address" })
                      ]),
                      createBaseVNode("th", _hoisted_18, [
                        createVNode(_component_LocaleText, { t: "Average RTT (ms)" })
                      ]),
                      createBaseVNode("th", _hoisted_19, [
                        createVNode(_component_LocaleText, { t: "Min RTT (ms)" })
                      ]),
                      createBaseVNode("th", _hoisted_20, [
                        createVNode(_component_LocaleText, { t: "Max RTT (ms)" })
                      ]),
                      createBaseVNode("th", _hoisted_21, [
                        createVNode(_component_LocaleText, { t: "Geolocation" })
                      ])
                    ])
                  ]),
                  createBaseVNode("tbody", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(this.tracerouteResult, (hop, key) => {
                      return openBlock(), createElementBlock("tr", null, [
                        createBaseVNode("td", null, [
                          createBaseVNode("small", null, toDisplayString(hop.hop), 1)
                        ]),
                        createBaseVNode("td", null, [
                          createBaseVNode("small", null, [
                            createBaseVNode("samp", null, toDisplayString(hop.ip), 1)
                          ])
                        ]),
                        createBaseVNode("td", null, [
                          createBaseVNode("small", null, [
                            createBaseVNode("samp", null, toDisplayString(hop.avg_rtt), 1)
                          ])
                        ]),
                        createBaseVNode("td", null, [
                          createBaseVNode("small", null, [
                            createBaseVNode("samp", null, toDisplayString(hop.min_rtt), 1)
                          ])
                        ]),
                        createBaseVNode("td", null, [
                          createBaseVNode("small", null, [
                            createBaseVNode("samp", null, toDisplayString(hop.max_rtt), 1)
                          ])
                        ]),
                        createBaseVNode("td", null, [
                          hop.geo.city && hop.geo.country ? (openBlock(), createElementBlock("span", _hoisted_22, [
                            createBaseVNode("small", null, toDisplayString(hop.geo.city) + ", " + toDisplayString(hop.geo.country), 1)
                          ])) : (openBlock(), createElementBlock("span", _hoisted_23, " - "))
                        ])
                      ]);
                    }), 256))
                  ])
                ])
              ])
            ]))
          ]),
          _: 1
        })
      ])
    ])
  ]);
}
const traceroute = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3e75b4d4"]]);
export {
  traceroute as default
};
