import { _ as _export_sfc, D as DashboardConfigurationStore, g as fetchGet, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, w as withCtx, n as normalizeClass, t as toDisplayString, f as createTextVNode, i as createBlock, e as createCommentVNode, m as withDirectives, v as vModelCheckbox, p as useCssVars, k as resolveComponent, r as ref, q as computed, s as normalizeStyle, j as Transition, o as onMounted, x as onBeforeUnmount, F as Fragment, h as renderList, W as WireguardConfigurationsStore, G as GetLocale, T as TransitionGroup, y as vModelText } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { _ as _sfc_main$4 } from "./protocolBadge-B0bAD-AP.js";
import { C as CpuCore } from "./storageMount.vue_vue_type_style_index_0_scoped_9509d7a0_lang-CFLDAtyl.js";
const _sfc_main$3 = {
  name: "configurationCard",
  components: { ProtocolBadge: _sfc_main$4, LocaleText },
  props: {
    c: {
      Name: String,
      Status: Boolean,
      PublicKey: String,
      PrivateKey: String
    },
    delay: String,
    display: String
  },
  data() {
    return {
      configurationToggling: false
    };
  },
  setup() {
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { dashboardConfigurationStore };
  },
  methods: {
    toggle() {
      this.configurationToggling = true;
      fetchGet("/api/toggleWireguardConfiguration", {
        configurationName: this.c.Name
      }, (res) => {
        if (res.status) {
          this.dashboardConfigurationStore.newMessage(
            "Server",
            `${this.c.Name} ${res.data ? "is on" : "is off"}`
          );
        } else {
          this.dashboardConfigurationStore.newMessage(
            "Server",
            res.message,
            "danger"
          );
        }
        this.c.Status = res.data;
        this.configurationToggling = false;
      });
    }
  }
};
const __injectCSSVars__ = () => {
  useCssVars((_ctx) => ({
    "7d032b58": _ctx.delay
  }));
};
const __setup__ = _sfc_main$3.setup;
_sfc_main$3.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
const _hoisted_1$3 = { class: "card conf_card rounded-3 shadow text-decoration-none" };
const _hoisted_2$3 = { class: "mb-0" };
const _hoisted_3$2 = { class: "card-title mb-0 d-flex align-items-center gap-2" };
const _hoisted_4$2 = { class: "card-footer d-flex gap-2 flex-column" };
const _hoisted_5$2 = { class: "row" };
const _hoisted_6$2 = { class: "d-flex gap-2 align-items-center" };
const _hoisted_7$2 = { class: "text-muted" };
const _hoisted_8$2 = { class: "mb-0 d-block d-lg-inline-block" };
const _hoisted_9$2 = { style: { "line-break": "anywhere" } };
const _hoisted_10$2 = { class: "form-check form-switch ms-auto" };
const _hoisted_11$2 = ["for"];
const _hoisted_12$2 = {
  key: 4,
  class: "spinner-border spinner-border-sm ms-2",
  "aria-hidden": "true"
};
const _hoisted_13$2 = ["disabled", "id"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ProtocolBadge = resolveComponent("ProtocolBadge");
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["col-12", { "col-lg-6 col-xl-4": this.display === "Grid" }])
  }, [
    createBaseVNode("div", _hoisted_1$3, [
      createVNode(_component_RouterLink, {
        to: "/configuration/" + $props.c.Name + "/peers",
        class: "card-body d-flex align-items-center gap-3 flex-wrap text-decoration-none"
      }, {
        default: withCtx(() => [
          createBaseVNode("h6", _hoisted_2$3, [
            createBaseVNode("span", {
              class: normalizeClass(["dot", { active: $props.c.Status }])
            }, null, 2)
          ]),
          createBaseVNode("h6", _hoisted_3$2, [
            createBaseVNode("samp", null, toDisplayString($props.c.Name), 1),
            createBaseVNode("small", null, [
              createVNode(_component_ProtocolBadge, {
                protocol: $props.c.Protocol,
                mini: true
              }, null, 8, ["protocol"])
            ])
          ]),
          _cache[2] || (_cache[2] = createBaseVNode("h6", { class: "mb-0 ms-auto" }, [
            createBaseVNode("i", { class: "bi bi-chevron-right" })
          ], -1))
        ]),
        _: 1
      }, 8, ["to"]),
      createBaseVNode("div", _hoisted_4$2, [
        createBaseVNode("div", _hoisted_5$2, [
          createBaseVNode("small", {
            class: normalizeClass(["col-6", { "col-md-3": this.display === "List" }])
          }, [
            _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-arrow-down-up me-2" }, null, -1)),
            createTextVNode(toDisplayString($props.c.DataUsage.Total > 0 ? $props.c.DataUsage.Total.toFixed(4) : 0) + " GB ", 1)
          ], 2),
          createBaseVNode("small", {
            class: normalizeClass(["text-primary-emphasis col-6", { "col-md-3": this.display === "List" }])
          }, [
            _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-arrow-down me-2" }, null, -1)),
            createTextVNode(toDisplayString($props.c.DataUsage.Receive > 0 ? $props.c.DataUsage.Receive.toFixed(4) : 0) + " GB ", 1)
          ], 2),
          createBaseVNode("small", {
            class: normalizeClass(["text-success-emphasis col-6", { "col-md-3": this.display === "List" }])
          }, [
            _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-arrow-up me-2" }, null, -1)),
            createTextVNode(toDisplayString($props.c.DataUsage.Sent > 0 ? $props.c.DataUsage.Sent.toFixed(4) : 0) + " GB ", 1)
          ], 2),
          createBaseVNode("small", {
            class: normalizeClass(["col-6", { "col-md-3 text-md-end ": this.display === "List" }])
          }, [
            createBaseVNode("span", {
              class: normalizeClass(["dot me-2", { active: $props.c.ConnectedPeers > 0 }])
            }, null, 2),
            createTextVNode(" " + toDisplayString($props.c.ConnectedPeers) + " / " + toDisplayString($props.c.TotalPeers) + " ", 1),
            createVNode(_component_LocaleText, { t: "Peers" })
          ], 2)
        ]),
        createBaseVNode("div", {
          class: normalizeClass(["d-flex gap-2", [this.display === "Grid" ? "flex-column" : "gap-lg-3 flex-column flex-lg-row"]])
        }, [
          createBaseVNode("div", _hoisted_6$2, [
            createBaseVNode("small", _hoisted_7$2, [
              createBaseVNode("strong", null, [
                createVNode(_component_LocaleText, { t: "Public Key" })
              ])
            ]),
            createBaseVNode("small", _hoisted_8$2, [
              createBaseVNode("samp", _hoisted_9$2, toDisplayString($props.c.PublicKey), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_10$2, [
            createBaseVNode("label", {
              class: "form-check-label",
              style: { "cursor": "pointer" },
              for: "switch" + $props.c.PrivateKey
            }, [
              !$props.c.Status && this.configurationToggling ? (openBlock(), createBlock(_component_LocaleText, {
                key: 0,
                t: "Turning Off..."
              })) : $props.c.Status && this.configurationToggling ? (openBlock(), createBlock(_component_LocaleText, {
                key: 1,
                t: "Turning On..."
              })) : $props.c.Status && !this.configurationToggling ? (openBlock(), createBlock(_component_LocaleText, {
                key: 2,
                t: "On"
              })) : !$props.c.Status && !this.configurationToggling ? (openBlock(), createBlock(_component_LocaleText, {
                key: 3,
                t: "Off"
              })) : createCommentVNode("", true),
              this.configurationToggling ? (openBlock(), createElementBlock("span", _hoisted_12$2)) : createCommentVNode("", true)
            ], 8, _hoisted_11$2),
            withDirectives(createBaseVNode("input", {
              class: "form-check-input",
              style: { "cursor": "pointer" },
              disabled: this.configurationToggling,
              type: "checkbox",
              role: "switch",
              id: "switch" + $props.c.PrivateKey,
              onChange: _cache[0] || (_cache[0] = ($event) => this.toggle()),
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $props.c.Status = $event)
            }, null, 40, _hoisted_13$2), [
              [vModelCheckbox, $props.c.Status]
            ])
          ])
        ], 2)
      ])
    ])
  ], 2);
}
const ConfigurationCard = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1], ["__scopeId", "data-v-dafd6275"]]);
const _hoisted_1$2 = { class: "text-muted me-2" };
const _hoisted_2$2 = { class: "fw-bold" };
const _sfc_main$2 = {
  __name: "storageMount",
  props: {
    mount: Object,
    align: Boolean,
    square: Boolean
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "2dc8ab7e": squareHeight.value
    }));
    const props = __props;
    const show = ref(false);
    const squareHeight = computed(() => {
      return props.square ? "40px" : "25px";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "flex-grow-1 square rounded-3 border position-relative",
        onMouseenter: _cache[0] || (_cache[0] = ($event) => show.value = true),
        onMouseleave: _cache[1] || (_cache[1] = ($event) => show.value = false),
        style: normalizeStyle({ "background-color": `rgb(25 135 84 / ${__props.mount.percent}%)` })
      }, [
        createVNode(Transition, { name: "zoomReversed" }, {
          default: withCtx(() => [
            show.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              style: normalizeStyle([{ "white-space": "nowrap" }, { "top": squareHeight.value }]),
              class: normalizeClass(["floatingLabel z-3 border position-absolute d-block p-1 px-2 bg-body text-body rounded-3 border shadow d-flex", [__props.align ? "end-0" : "start-0"]])
            }, [
              createBaseVNode("small", _hoisted_1$2, [
                createBaseVNode("samp", null, toDisplayString(__props.mount.mountPoint), 1)
              ]),
              createBaseVNode("small", _hoisted_2$2, toDisplayString(__props.mount.percent) + "% ", 1)
            ], 6)) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 36);
    };
  }
};
const StorageMount = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-9509d7a0"]]);
const _hoisted_1$1 = { class: "row text-body g-3 mb-5" };
const _hoisted_2$1 = { class: "col-md-6 col-sm-12 col-xl-3" };
const _hoisted_3$1 = { class: "d-flex align-items-center" };
const _hoisted_4$1 = { class: "text-muted" };
const _hoisted_5$1 = { class: "ms-auto" };
const _hoisted_6$1 = { key: 0 };
const _hoisted_7$1 = {
  key: 1,
  class: "spinner-border spinner-border-sm"
};
const _hoisted_8$1 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "6px" }
};
const _hoisted_9$1 = { class: "d-flex mt-2 gap-1" };
const _hoisted_10$1 = { class: "col-md-6 col-sm-12 col-xl-3" };
const _hoisted_11$1 = { class: "d-flex align-items-center" };
const _hoisted_12$1 = { class: "text-muted" };
const _hoisted_13$1 = { class: "ms-auto" };
const _hoisted_14$1 = { key: 0 };
const _hoisted_15$1 = {
  key: 1,
  class: "spinner-border spinner-border-sm"
};
const _hoisted_16$1 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "6px" }
};
const _hoisted_17 = { class: "d-flex mt-2 gap-1" };
const _hoisted_18 = { class: "col-md-6 col-sm-12 col-xl-3" };
const _hoisted_19 = { class: "d-flex align-items-center" };
const _hoisted_20 = { class: "text-muted" };
const _hoisted_21 = { class: "ms-auto" };
const _hoisted_22 = { key: 0 };
const _hoisted_23 = {
  key: 1,
  class: "spinner-border spinner-border-sm"
};
const _hoisted_24 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "6px" }
};
const _hoisted_25 = { class: "col-md-6 col-sm-12 col-xl-3" };
const _hoisted_26 = { class: "d-flex align-items-center" };
const _hoisted_27 = { class: "text-muted" };
const _hoisted_28 = { class: "ms-auto" };
const _hoisted_29 = { key: 0 };
const _hoisted_30 = {
  key: 1,
  class: "spinner-border spinner-border-sm"
};
const _sfc_main$1 = {
  __name: "systemStatusWidget",
  setup(__props) {
    const dashboardStore = DashboardConfigurationStore();
    let interval = null;
    onMounted(() => {
      getData();
      interval = setInterval(() => {
        getData();
      }, 5e3);
    });
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    const getData = () => {
      fetchGet("/api/systemStatus", {}, (res) => {
        dashboardStore.SystemStatus = res.data;
      });
    };
    const data = computed(() => {
      return dashboardStore.SystemStatus;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("h6", _hoisted_4$1, [
              _cache[0] || (_cache[0] = createBaseVNode("i", { class: "bi bi-cpu-fill me-2" }, null, -1)),
              createVNode(LocaleText, { t: "CPU" })
            ]),
            createBaseVNode("h6", _hoisted_5$1, [
              data.value ? (openBlock(), createElementBlock("span", _hoisted_6$1, toDisplayString(data.value.CPU.cpu_percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_7$1))
            ])
          ]),
          createBaseVNode("div", _hoisted_8$1, [
            createBaseVNode("div", {
              class: "progress-bar",
              style: normalizeStyle({ width: `${data.value?.CPU.cpu_percent}%` })
            }, null, 4)
          ]),
          createBaseVNode("div", _hoisted_9$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(data.value?.CPU.cpu_percent_per_cpu, (cpu, count) => {
              return openBlock(), createBlock(CpuCore, {
                key: count,
                align: count + 1 > Math.round(data.value?.CPU.cpu_percent_per_cpu.length / 2),
                core_number: count,
                percentage: cpu
              }, null, 8, ["align", "core_number", "percentage"]);
            }), 128))
          ])
        ]),
        createBaseVNode("div", _hoisted_10$1, [
          createBaseVNode("div", _hoisted_11$1, [
            createBaseVNode("h6", _hoisted_12$1, [
              _cache[1] || (_cache[1] = createBaseVNode("i", { class: "bi bi-device-ssd-fill me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Storage" })
            ]),
            createBaseVNode("h6", _hoisted_13$1, [
              data.value ? (openBlock(), createElementBlock("span", _hoisted_14$1, toDisplayString(data.value.Disks.find((x) => x.mountPoint === "/") ? data.value?.Disks.find((x) => x.mountPoint === "/").percent : data.value?.Disks[0].percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_15$1))
            ])
          ]),
          createBaseVNode("div", _hoisted_16$1, [
            createBaseVNode("div", {
              class: "progress-bar bg-success",
              style: normalizeStyle({ width: `${data.value?.Disks.find((x) => x.mountPoint === "/") ? data.value?.Disks.find((x) => x.mountPoint === "/").percent : data.value?.Disks[0].percent}%` })
            }, null, 4)
          ]),
          createBaseVNode("div", _hoisted_17, [
            data.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(data.value?.Disks, (disk, count) => {
              return openBlock(), createBlock(StorageMount, {
                key: disk.mountPoint,
                align: count + 1 > Math.round(data.value?.Disks.length / 2),
                mount: disk
              }, null, 8, ["align", "mount"]);
            }), 128)) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_18, [
          createBaseVNode("div", _hoisted_19, [
            createBaseVNode("h6", _hoisted_20, [
              _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-memory me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Memory" })
            ]),
            createBaseVNode("h6", _hoisted_21, [
              data.value ? (openBlock(), createElementBlock("span", _hoisted_22, toDisplayString(data.value?.Memory.VirtualMemory.percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_23))
            ])
          ]),
          createBaseVNode("div", _hoisted_24, [
            createBaseVNode("div", {
              class: "progress-bar bg-info",
              style: normalizeStyle({ width: `${data.value?.Memory.VirtualMemory.percent}%` })
            }, null, 4)
          ])
        ]),
        createBaseVNode("div", _hoisted_25, [
          createBaseVNode("div", _hoisted_26, [
            createBaseVNode("h6", _hoisted_27, [
              _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-memory me-2" }, null, -1)),
              createVNode(LocaleText, { t: "Swap Memory" })
            ]),
            createBaseVNode("h6", _hoisted_28, [
              data.value ? (openBlock(), createElementBlock("span", _hoisted_29, toDisplayString(data.value?.Memory.SwapMemory.percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_30))
            ])
          ]),
          _cache[4] || (_cache[4] = createBaseVNode("div", {
            class: "progress",
            role: "progressbar",
            style: { "height": "6px" }
          }, [
            createBaseVNode("div", {
              class: "progress-bar bg-warning",
              style: { width: `$ data?.Memory.SwapMemory.percent}%` }
            })
          ], -1))
        ])
      ]);
    };
  }
};
const SystemStatus = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-851170e4"]]);
const _sfc_main = {
  name: "configurationList",
  components: { SystemStatus, LocaleText, ConfigurationCard },
  async setup() {
    const wireguardConfigurationsStore = WireguardConfigurationsStore();
    return { wireguardConfigurationsStore };
  },
  data() {
    return {
      configurationLoaded: false,
      sort: {
        Name: GetLocale("Name"),
        Status: GetLocale("Status"),
        "DataUsage.Total": GetLocale("Total Usage")
      },
      currentSort: {
        key: "Name",
        order: "asc"
      },
      currentDisplay: "List",
      searchKey: ""
    };
  },
  async mounted() {
    if (!window.localStorage.getItem("ConfigurationListSort")) {
      window.localStorage.setItem("ConfigurationListSort", JSON.stringify(this.currentSort));
    } else {
      this.currentSort = JSON.parse(window.localStorage.getItem("ConfigurationListSort"));
    }
    if (!window.localStorage.getItem("ConfigurationListDisplay")) {
      window.localStorage.setItem("ConfigurationListDisplay", this.currentDisplay);
    } else {
      this.currentDisplay = window.localStorage.getItem("ConfigurationListDisplay");
    }
    await this.wireguardConfigurationsStore.getConfigurations();
    this.configurationLoaded = true;
    this.wireguardConfigurationsStore.ConfigurationListInterval = setInterval(() => {
      this.wireguardConfigurationsStore.getConfigurations();
    }, 1e4);
  },
  beforeUnmount() {
    clearInterval(this.wireguardConfigurationsStore.ConfigurationListInterval);
  },
  computed: {
    configurations() {
      return [...this.wireguardConfigurationsStore.Configurations].filter((x) => x.Name.toLowerCase().includes(this.searchKey) || x.PublicKey.includes(this.searchKey) || !this.searchKey).sort((a, b) => {
        if (this.currentSort.order === "desc") {
          return this.dotNotation(a, this.currentSort.key) < this.dotNotation(b, this.currentSort.key) ? 1 : this.dotNotation(a, this.currentSort.key) > this.dotNotation(b, this.currentSort.key) ? -1 : 0;
        } else {
          return this.dotNotation(a, this.currentSort.key) > this.dotNotation(b, this.currentSort.key) ? 1 : this.dotNotation(a, this.currentSort.key) < this.dotNotation(b, this.currentSort.key) ? -1 : 0;
        }
      });
    }
  },
  methods: {
    dotNotation(object, dotNotation) {
      let result = dotNotation.split(".").reduce((o, key) => o && o[key], object);
      if (typeof result === "string") {
        return result.toLowerCase();
      }
      return result;
    },
    updateSort(key) {
      if (this.currentSort.key === key) {
        if (this.currentSort.order === "asc") this.currentSort.order = "desc";
        else this.currentSort.order = "asc";
      } else {
        this.currentSort.key = key;
      }
      window.localStorage.setItem("ConfigurationListSort", JSON.stringify(this.currentSort));
    },
    updateDisplay(key) {
      if (this.currentDisplay !== key) {
        this.currentDisplay = key;
        window.localStorage.setItem("ConfigurationListDisplay", this.currentDisplay);
      }
    }
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3" };
const _hoisted_2 = { class: "container-fluid" };
const _hoisted_3 = { class: "d-flex mb-4 configurationListTitle align-items-md-center gap-2 flex-column flex-md-row" };
const _hoisted_4 = { class: "text-body d-flex mb-0" };
const _hoisted_5 = {
  key: 0,
  class: "text-body filter mb-3 d-flex gap-2 flex-column flex-md-row"
};
const _hoisted_6 = { class: "d-flex align-items-center gap-3 align-items-center mb-3 mb-md-0" };
const _hoisted_7 = { class: "text-muted" };
const _hoisted_8 = { class: "d-flex ms-auto ms-lg-0" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = { class: "align-items-center gap-3 align-items-center mb-3 mb-md-0 d-none d-lg-flex" };
const _hoisted_11 = { class: "text-muted" };
const _hoisted_12 = { class: "d-flex ms-auto ms-lg-0" };
const _hoisted_13 = ["onClick"];
const _hoisted_14 = { class: "d-flex align-items-center ms-md-auto" };
const _hoisted_15 = { class: "row g-3 mb-2" };
const _hoisted_16 = {
  class: "text-muted col-12",
  key: "noConfiguration"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SystemStatus = resolveComponent("SystemStatus");
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_ConfigurationCard = resolveComponent("ConfigurationCard");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createVNode(_component_SystemStatus),
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("h2", _hoisted_4, [
          createVNode(_component_LocaleText, { t: "WireGuard Configurations" })
        ]),
        createVNode(_component_RouterLink, {
          to: "/new_configuration",
          class: "ms-md-auto py-2 text-decoration-none btn text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle"
        }, {
          default: withCtx(() => [
            _cache[1] || (_cache[1] = createBaseVNode("i", { class: "bi bi-plus-circle me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: "Configuration" })
          ]),
          _: 1
        }),
        createVNode(_component_RouterLink, {
          to: "/restore_configuration",
          class: "py-2 text-decoration-none btn text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle"
        }, {
          default: withCtx(() => [
            _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-clock-history me-2" }, null, -1)),
            createVNode(_component_LocaleText, { t: "Restore" })
          ]),
          _: 1
        })
      ]),
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          this.configurationLoaded ? (openBlock(), createElementBlock("div", _hoisted_5, [
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("small", _hoisted_7, [
                createVNode(_component_LocaleText, { t: "Sort By" })
              ]),
              createBaseVNode("div", _hoisted_8, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(this.sort, (s, sv) => {
                  return openBlock(), createElementBlock("a", {
                    role: "button",
                    onClick: ($event) => $options.updateSort(sv),
                    class: normalizeClass([{ "bg-primary-subtle text-primary-emphasis": this.currentSort.key === sv }, "px-2 py-1 rounded-3"])
                  }, [
                    createBaseVNode("small", null, [
                      this.currentSort.key === sv ? (openBlock(), createElementBlock("i", {
                        key: 0,
                        class: normalizeClass(["bi me-2", [this.currentSort.order === "asc" ? "bi-sort-up" : "bi-sort-down"]])
                      }, null, 2)) : createCommentVNode("", true),
                      createTextVNode(toDisplayString(s), 1)
                    ])
                  ], 10, _hoisted_9);
                }), 256))
              ])
            ]),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("small", _hoisted_11, [
                createVNode(_component_LocaleText, { t: "Display as" })
              ]),
              createBaseVNode("div", _hoisted_12, [
                (openBlock(), createElementBlock(Fragment, null, renderList([{ name: "List", key: "list" }, { name: "Grid", key: "grid" }], (x) => {
                  return createBaseVNode("a", {
                    role: "button",
                    onClick: ($event) => $options.updateDisplay(x.name),
                    class: normalizeClass([{ "bg-primary-subtle text-primary-emphasis": this.currentDisplay === x.name }, "px-2 py-1 rounded-3"])
                  }, [
                    createBaseVNode("small", null, [
                      createBaseVNode("i", {
                        class: normalizeClass(["bi me-2", "bi-" + x.key])
                      }, null, 2),
                      _cache[3] || (_cache[3] = createTextVNode()),
                      createVNode(_component_LocaleText, {
                        t: x.name
                      }, null, 8, ["t"])
                    ])
                  ], 10, _hoisted_13);
                }), 64))
              ])
            ]),
            createBaseVNode("div", _hoisted_14, [
              _cache[4] || (_cache[4] = createBaseVNode("label", {
                for: "configurationSearch",
                class: "text-muted"
              }, [
                createBaseVNode("i", { class: "bi bi-search me-2" })
              ], -1)),
              withDirectives(createBaseVNode("input", {
                class: "form-control form-control-sm rounded-3",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => this.searchKey = $event),
                id: "configurationSearch"
              }, null, 512), [
                [vModelText, this.searchKey]
              ])
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      }),
      createBaseVNode("div", _hoisted_15, [
        createVNode(TransitionGroup, { name: "fade" }, {
          default: withCtx(() => [
            this.configurationLoaded && this.wireguardConfigurationsStore.Configurations.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_16, [
              createVNode(_component_LocaleText, { t: "You don't have any WireGuard configurations yet. Please check the configuration folder or change it in Settings. By default the folder is /etc/wireguard." })
            ])) : this.configurationLoaded ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList($options.configurations, (c, index) => {
              return openBlock(), createBlock(_component_ConfigurationCard, {
                display: this.currentDisplay,
                delay: index * 0.03 + "s",
                key: c.Name,
                c
              }, null, 8, ["display", "delay", "c"]);
            }), 128)) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ])
    ])
  ]);
}
const configurationList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ea61b607"]]);
export {
  configurationList as default
};
