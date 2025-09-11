const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/peerShareLinkModal-BU1JRJMj.js","assets/index-xvqfLBaG.js","assets/index-DBzoy11G.css","assets/dayjs.min-CfinB9vE.js","assets/vue-datepicker-CvNbCtAl.js","assets/localeText-DQBGUudF.js","assets/peerShareLinkModal-B-9-ZvfK.css","assets/peerJobs-Br3x6OMX.js","assets/schedulePeerJob-CTg28UTK.js","assets/schedulePeerJob-D7xbU8xX.css","assets/peerJobs-B0rg7Yc4.css","assets/peerQRCode-D5swauWE.js","assets/browser-CMVr0Ar6.js","assets/peerQRCode-eY6QVo5Q.css","assets/peerConfigurationFile-BfgPqC6w.js","assets/peerConfigurationFile-BXnvK0-p.css","assets/peerSettings-Be0G32ZW.js","assets/peerSettings-BSexD26C.css","assets/peerSearchBar-R1e9xfEo.js","assets/peerSearchBar-AiwWBdJR.css","assets/peerJobsAllModal-BTer0Ldx.js","assets/peerJobsLogsModal-DHADMS7W.js","assets/editConfiguration-D9JDjdGE.js","assets/editConfiguration-m_bf--m8.css","assets/selectPeers-BEQUWOKt.js","assets/selectPeers-D_oUy_Tc.css","assets/peerAddModal-BwpHXlAu.js","assets/peerAddModal-B6nlR94V.css"])))=>i.map(i=>d[i]);
import { r as ref, D as DashboardConfigurationStore, o as onMounted, H as watch, x as onBeforeUnmount, q as computed, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, u as unref, t as toDisplayString, e as createCommentVNode, N as useRoute, g as fetchGet, _ as _export_sfc, W as WireguardConfigurationsStore, G as GetLocale, A as fetchPost, F as Fragment, h as renderList, n as normalizeClass, k as resolveComponent, O as getCurrentScope, P as onScopeDispose, w as withCtx, j as Transition, f as createTextVNode, i as createBlock, T as TransitionGroup, Q as defineAsyncComponent, R as __vitePreload, U as withAsyncContext, m as withDirectives, v as vModelCheckbox, S as Suspense } from "./index-xvqfLBaG.js";
import { _ as _sfc_main$8 } from "./protocolBadge-B0bAD-AP.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { C as Chart, L as LineElement, B as BarElement, a as BarController, b as LineController, c as LinearScale, p as plugin_legend, d as plugin_title, e as plugin_tooltip, f as CategoryScale, P as PointElement, h as Bar, g as Line } from "./index-B5yBe-tE.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
const _hoisted_1$6 = { class: "row gx-2 gy-2 mb-3" };
const _hoisted_2$4 = { class: "col-12" };
const _hoisted_3$4 = {
  class: "card rounded-3 bg-transparent",
  style: { "height": "270px" }
};
const _hoisted_4$4 = { class: "card-header bg-transparent border-0" };
const _hoisted_5$4 = { class: "text-muted" };
const _hoisted_6$4 = { class: "card-body pt-1" };
const _hoisted_7$4 = { class: "col-sm col-lg-6" };
const _hoisted_8$4 = {
  class: "card rounded-3 bg-transparent",
  style: { "height": "270px" }
};
const _hoisted_9$4 = { class: "card-header bg-transparent border-0 d-flex align-items-center" };
const _hoisted_10$4 = { class: "text-muted" };
const _hoisted_11$4 = {
  key: 0,
  class: "text-primary fw-bold ms-auto"
};
const _hoisted_12$4 = { class: "card-body pt-1" };
const _hoisted_13$4 = { class: "col-sm col-lg-6" };
const _hoisted_14$3 = {
  class: "card rounded-3 bg-transparent",
  style: { "height": "270px" }
};
const _hoisted_15$2 = { class: "card-header bg-transparent border-0 d-flex align-items-center" };
const _hoisted_16$2 = { class: "text-muted" };
const _hoisted_17$2 = {
  key: 0,
  class: "text-success fw-bold ms-auto"
};
const _hoisted_18$2 = { class: "card-body pt-1" };
const _sfc_main$7 = {
  __name: "peerDataUsageCharts",
  props: {
    configurationPeers: Array,
    configurationInfo: Object
  },
  setup(__props) {
    Chart.register(
      LineElement,
      BarElement,
      BarController,
      LineController,
      LinearScale,
      plugin_legend,
      plugin_title,
      plugin_tooltip,
      CategoryScale,
      PointElement
    );
    const props = __props;
    const historySentData = ref({
      timestamp: [],
      data: []
    });
    const historyReceivedData = ref({
      timestamp: [],
      data: []
    });
    const route = useRoute();
    const dashboardStore = DashboardConfigurationStore();
    const fetchRealtimeTrafficInterval = ref(void 0);
    const fetchRealtimeTraffic = async () => {
      await fetchGet("/api/getWireguardConfigurationRealtimeTraffic", {
        configurationName: route.params.id
      }, (res) => {
        let timestamp = dayjs().format("hh:mm:ss A");
        if (res.data.sent !== 0 && res.data.recv !== 0) {
          historySentData.value.timestamp.push(timestamp);
          historySentData.value.data.push(res.data.sent);
          historyReceivedData.value.timestamp.push(timestamp);
          historyReceivedData.value.data.push(res.data.recv);
        } else {
          if (historySentData.value.data.length > 0 && historyReceivedData.value.data.length > 0) {
            historySentData.value.timestamp.push(timestamp);
            historySentData.value.data.push(res.data.sent);
            historyReceivedData.value.timestamp.push(timestamp);
            historyReceivedData.value.data.push(res.data.recv);
          }
        }
      });
    };
    const toggleFetchRealtimeTraffic = () => {
      clearInterval(fetchRealtimeTrafficInterval.value);
      fetchRealtimeTrafficInterval.value = void 0;
      if (props.configurationInfo.Status) {
        fetchRealtimeTrafficInterval.value = setInterval(() => {
          fetchRealtimeTraffic();
        }, parseInt(dashboardStore.Configuration.Server.dashboard_refresh_interval));
      }
    };
    onMounted(() => {
      toggleFetchRealtimeTraffic();
    });
    watch(() => props.configurationInfo.Status, () => {
      toggleFetchRealtimeTraffic();
    });
    watch(() => dashboardStore.Configuration.Server.dashboard_refresh_interval, () => {
      toggleFetchRealtimeTraffic();
    });
    onBeforeUnmount(() => {
      clearInterval(fetchRealtimeTrafficInterval.value);
      fetchRealtimeTrafficInterval.value = void 0;
    });
    const peersDataUsageChartData = computed(() => {
      let data = props.configurationPeers.filter((x) => x.cumu_data + x.total_data > 0);
      return {
        labels: data.map((x) => {
          if (x.name) return x.name;
          return `Untitled Peer - ${x.id}`;
        }),
        datasets: [{
          label: "Total Data Usage",
          data: data.map((x) => x.cumu_data + x.total_data),
          backgroundColor: data.map((x) => `#ffc107`),
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.formattedValue} GB`;
              }
            }
          }
        }]
      };
    });
    const peersRealtimeSentData = computed(() => {
      return {
        labels: [...historySentData.value.timestamp],
        datasets: [
          {
            label: "Data Sent",
            data: [...historySentData.value.data],
            fill: false,
            borderColor: "#198754",
            backgroundColor: "#198754",
            tension: 0
          }
        ]
      };
    });
    const peersRealtimeReceivedData = computed(() => {
      return {
        labels: [...historyReceivedData.value.timestamp],
        datasets: [
          {
            label: "Data Received",
            data: [...historyReceivedData.value.data],
            fill: false,
            borderColor: "#0d6efd",
            backgroundColor: "#0d6efd",
            tension: 0
          }
        ]
      };
    });
    const peersDataUsageChartOption = computed(() => {
      return {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              callback: (val, index) => {
                return `${Math.round((val + Number.EPSILON) * 1e3) / 1e3} GB`;
              }
            },
            grid: {
              display: false
            }
          }
        }
      };
    });
    const realtimePeersChartOption = computed(() => {
      return {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.formattedValue} MB/s`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: true
            }
          },
          y: {
            ticks: {
              callback: (val, index) => {
                return `${Math.round((val + Number.EPSILON) * 1e3) / 1e3} MB/s`;
              }
            },
            grid: {
              display: true
            }
          }
        }
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", _hoisted_3$4, [
            createBaseVNode("div", _hoisted_4$4, [
              createBaseVNode("small", _hoisted_5$4, [
                createVNode(LocaleText, { t: "Peers Data Usage" })
              ])
            ]),
            createBaseVNode("div", _hoisted_6$4, [
              createVNode(unref(Bar), {
                data: peersDataUsageChartData.value,
                options: peersDataUsageChartOption.value,
                style: { "width": "100%", "height": "200px", "max-height": "200px" }
              }, null, 8, ["data", "options"])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_7$4, [
          createBaseVNode("div", _hoisted_8$4, [
            createBaseVNode("div", _hoisted_9$4, [
              createBaseVNode("small", _hoisted_10$4, [
                createVNode(LocaleText, { t: "Real Time Received Data Usage" })
              ]),
              historyReceivedData.value.data.length > 0 ? (openBlock(), createElementBlock("small", _hoisted_11$4, toDisplayString(historyReceivedData.value.data[historyReceivedData.value.data.length - 1]) + " MB/s ", 1)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_12$4, [
              createVNode(unref(Line), {
                options: realtimePeersChartOption.value,
                data: peersRealtimeReceivedData.value,
                style: { "width": "100%", "height": "200px", "max-height": "200px" }
              }, null, 8, ["options", "data"])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_13$4, [
          createBaseVNode("div", _hoisted_14$3, [
            createBaseVNode("div", _hoisted_15$2, [
              createBaseVNode("small", _hoisted_16$2, [
                createVNode(LocaleText, { t: "Real Time Sent Data Usage" })
              ]),
              historySentData.value.data.length > 0 ? (openBlock(), createElementBlock("small", _hoisted_17$2, toDisplayString(historySentData.value.data[historySentData.value.data.length - 1]) + " MB/s ", 1)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_18$2, [
              createVNode(unref(Line), {
                options: realtimePeersChartOption.value,
                data: peersRealtimeSentData.value,
                style: { "width": "100%", "height": "200px", "max-height": "200px" }
              }, null, 8, ["options", "data"])
            ])
          ])
        ])
      ]);
    };
  }
};
const _sfc_main$6 = {
  name: "peerSearch",
  components: { LocaleText },
  setup() {
    const store = DashboardConfigurationStore();
    const wireguardConfigurationStore = WireguardConfigurationsStore();
    return { store, wireguardConfigurationStore };
  },
  props: {
    configuration: Object
  },
  data() {
    return {
      sort: {
        status: GetLocale("Status"),
        name: GetLocale("Name"),
        allowed_ip: GetLocale("Allowed IPs"),
        restricted: GetLocale("Restricted")
      },
      interval: {
        "5000": GetLocale("5 Seconds"),
        "10000": GetLocale("10 Seconds"),
        "30000": GetLocale("30 Seconds"),
        "60000": GetLocale("1 Minutes")
      },
      display: {
        grid: GetLocale("Grid"),
        list: GetLocale("List")
      },
      searchString: "",
      searchStringTimeout: void 0,
      showDisplaySettings: false,
      showMoreSettings: false
    };
  },
  methods: {
    debounce() {
      if (!this.searchStringTimeout) {
        this.searchStringTimeout = setTimeout(() => {
          this.wireguardConfigurationStore.searchString = this.searchString;
        }, 300);
      } else {
        clearTimeout(this.searchStringTimeout);
        this.searchStringTimeout = setTimeout(() => {
          this.wireguardConfigurationStore.searchString = this.searchString;
        }, 300);
      }
    },
    updateSort(sort) {
      fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Server",
        key: "dashboard_sort",
        value: sort
      }, (res) => {
        if (res.status) {
          this.store.getConfiguration();
        }
      });
    },
    updateRefreshInterval(refreshInterval) {
      fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Server",
        key: "dashboard_refresh_interval",
        value: refreshInterval
      }, (res) => {
        if (res.status) {
          this.store.getConfiguration();
        }
      });
    },
    updateDisplay(display) {
      fetchPost("/api/updateDashboardConfigurationItem", {
        section: "Server",
        key: "dashboard_peer_list_display",
        value: display
      }, (res) => {
        if (res.status) {
          this.store.getConfiguration();
        }
      });
    },
    downloadAllPeer() {
      fetchGet(`/api/downloadAllPeers/${this.configuration.Name}`, {}, (res) => {
        res.data.forEach((x) => {
          x.fileName = x.fileName + ".conf";
        });
        window.wireguard.generateZipFiles(res, this.configuration.Name);
      });
    }
  }
};
const _hoisted_1$5 = { class: "d-flex flex-column gap-2 my-4" };
const _hoisted_2$3 = { class: "d-flex gap-2 peerSearchContainer" };
const _hoisted_3$3 = { class: "dropdown" };
const _hoisted_4$3 = {
  "data-bs-toggle": "dropdown",
  class: "btn w-100 btn-sm text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle position-relative"
};
const _hoisted_5$3 = { class: "badge text-bg-primary ms-2" };
const _hoisted_6$3 = { class: "dropdown-menu rounded-3" };
const _hoisted_7$3 = ["onClick"];
const _hoisted_8$3 = { class: "ms-auto" };
const _hoisted_9$3 = {
  key: 0,
  class: "bi bi-check-circle-fill"
};
const _hoisted_10$3 = { class: "dropdown" };
const _hoisted_11$3 = {
  "data-bs-toggle": "dropdown",
  class: "btn btn-sm w-100 text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle position-relative"
};
const _hoisted_12$3 = { class: "badge text-bg-primary ms-2" };
const _hoisted_13$3 = { class: "dropdown-menu rounded-3" };
const _hoisted_14$2 = ["onClick"];
const _hoisted_15$1 = { class: "ms-auto" };
const _hoisted_16$1 = {
  key: 0,
  class: "bi bi-check-circle-fill"
};
const _hoisted_17$1 = { class: "dropdown" };
const _hoisted_18$1 = {
  "data-bs-toggle": "dropdown",
  class: "btn btn-sm w-100 text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle position-relative"
};
const _hoisted_19$1 = { class: "badge text-bg-primary ms-2" };
const _hoisted_20$1 = { class: "dropdown-menu rounded-3" };
const _hoisted_21$1 = ["onClick"];
const _hoisted_22$1 = { class: "ms-auto" };
const _hoisted_23$1 = {
  key: 0,
  class: "bi bi-check-circle-fill"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createBaseVNode("div", _hoisted_2$3, [
      createBaseVNode("div", _hoisted_3$3, [
        createBaseVNode("button", _hoisted_4$3, [
          _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-sort-up me-2" }, null, -1)),
          createVNode(_component_LocaleText, { t: "Sort By" }),
          createBaseVNode("span", _hoisted_5$3, toDisplayString(this.sort[$setup.store.Configuration.Server.dashboard_sort]), 1)
        ]),
        createBaseVNode("ul", _hoisted_6$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.sort, (value, key) => {
            return openBlock(), createElementBlock("li", null, [
              createBaseVNode("button", {
                class: "dropdown-item d-flex align-items-center",
                onClick: ($event) => this.updateSort(key)
              }, [
                createBaseVNode("small", null, toDisplayString(value), 1),
                createBaseVNode("small", _hoisted_8$3, [
                  $setup.store.Configuration.Server.dashboard_sort === key ? (openBlock(), createElementBlock("i", _hoisted_9$3)) : createCommentVNode("", true)
                ])
              ], 8, _hoisted_7$3)
            ]);
          }), 256))
        ])
      ]),
      createBaseVNode("div", _hoisted_10$3, [
        createBaseVNode("button", _hoisted_11$3, [
          _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-arrow-repeat me-2" }, null, -1)),
          createVNode(_component_LocaleText, { t: "Refresh Interval" }),
          createBaseVNode("span", _hoisted_12$3, toDisplayString(this.interval[$setup.store.Configuration.Server.dashboard_refresh_interval]), 1)
        ]),
        createBaseVNode("ul", _hoisted_13$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.interval, (value, key) => {
            return openBlock(), createElementBlock("li", null, [
              createBaseVNode("button", {
                class: "dropdown-item d-flex align-items-center",
                onClick: ($event) => this.updateRefreshInterval(key)
              }, [
                createBaseVNode("small", null, toDisplayString(value), 1),
                createBaseVNode("small", _hoisted_15$1, [
                  $setup.store.Configuration.Server.dashboard_refresh_interval === key ? (openBlock(), createElementBlock("i", _hoisted_16$1)) : createCommentVNode("", true)
                ])
              ], 8, _hoisted_14$2)
            ]);
          }), 256))
        ])
      ]),
      createBaseVNode("div", _hoisted_17$1, [
        createBaseVNode("button", _hoisted_18$1, [
          createBaseVNode("i", {
            class: normalizeClass(["bi me-2", "bi-" + $setup.store.Configuration.Server.dashboard_peer_list_display])
          }, null, 2),
          createVNode(_component_LocaleText, { t: "Display" }),
          createBaseVNode("span", _hoisted_19$1, toDisplayString(this.display[$setup.store.Configuration.Server.dashboard_peer_list_display]), 1)
        ]),
        createBaseVNode("ul", _hoisted_20$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.display, (value, key) => {
            return openBlock(), createElementBlock("li", null, [
              createBaseVNode("button", {
                class: "dropdown-item d-flex align-items-center",
                onClick: ($event) => this.updateDisplay(key)
              }, [
                createBaseVNode("small", null, toDisplayString(value), 1),
                createBaseVNode("small", _hoisted_22$1, [
                  $setup.store.Configuration.Server.dashboard_peer_list_display === key ? (openBlock(), createElementBlock("i", _hoisted_23$1)) : createCommentVNode("", true)
                ])
              ], 8, _hoisted_21$1)
            ]);
          }), 256))
        ])
      ]),
      createBaseVNode("button", {
        class: "btn btn-sm text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle ms-lg-auto",
        onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("search"))
      }, [
        _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-search me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Search" })
      ]),
      createBaseVNode("button", {
        class: "btn btn-sm text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle",
        onClick: _cache[1] || (_cache[1] = ($event) => this.downloadAllPeer())
      }, [
        _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-download me-2 me-lg-0 me-xl-2" }, null, -1)),
        createVNode(_component_LocaleText, {
          t: "Download All",
          class: "d-sm-block d-lg-none d-xl-block"
        })
      ]),
      createBaseVNode("button", {
        class: "btn btn-sm text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle",
        onClick: _cache[2] || (_cache[2] = ($event) => this.$emit("selectPeers"))
      }, [
        _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-check2-all me-2 me-lg-0 me-xl-2" }, null, -1)),
        createVNode(_component_LocaleText, {
          t: "Select Peers",
          class: "d-sm-block d-lg-none d-xl-block"
        })
      ]),
      createBaseVNode("button", {
        class: "btn btn-sm text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle",
        onClick: _cache[3] || (_cache[3] = ($event) => this.$emit("jobsAll")),
        type: "button",
        "aria-expanded": "false"
      }, [
        _cache[9] || (_cache[9] = createBaseVNode("i", { class: "bi bi-person-walking me-2 me-lg-0 me-xl-2" }, null, -1)),
        createVNode(_component_LocaleText, {
          t: "Active Jobs",
          class: "d-sm-block d-lg-none d-xl-block"
        })
      ])
    ])
  ]);
}
const PeerSearch = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2], ["__scopeId", "data-v-c96b078a"]]);
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
const isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
  var _a, _b;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let events2;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events2, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events2, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events2))
    events2 = [events2];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events2.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
let _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return noop;
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
    window2.document.documentElement.addEventListener("click", noop);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
const _hoisted_1$4 = {
  key: 0,
  class: "position-absolute d-block p-1 px-2 bg-body text-body rounded-3 border shadow"
};
const _sfc_main$5 = {
  __name: "peerSettingsDropdownTool",
  props: {
    icon: String,
    title: String
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const show = ref(false);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: "dropdown-item text-center px-0 rounded-3 position-relative",
        role: "button",
        onMouseenter: _cache[0] || (_cache[0] = ($event) => show.value = true),
        onMouseleave: _cache[1] || (_cache[1] = ($event) => show.value = false),
        onClick: _cache[2] || (_cache[2] = ($event) => emit("click"))
      }, [
        createBaseVNode("i", {
          class: normalizeClass(["me-auto bi", __props.icon])
        }, null, 2),
        createVNode(Transition, { name: "zoomReversed" }, {
          default: withCtx(() => [
            show.value ? (openBlock(), createElementBlock("span", _hoisted_1$4, [
              createBaseVNode("small", null, [
                createVNode(LocaleText, { t: __props.title }, null, 8, ["t"])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 32);
    };
  }
};
const PeerSettingsDropdownTool = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-d4e41a56"]]);
const _sfc_main$4 = {
  name: "peerSettingsDropdown",
  components: { PeerSettingsDropdownTool, LocaleText },
  setup() {
    const dashboardStore = DashboardConfigurationStore();
    return { dashboardStore };
  },
  props: {
    Peer: Object
  },
  data() {
    return {
      deleteBtnDisabled: false,
      restrictBtnDisabled: false,
      allowAccessBtnDisabled: false,
      confirmDelete: false
    };
  },
  methods: {
    downloadPeer() {
      fetchGet("/api/downloadPeer/" + this.$route.params.id, {
        id: this.Peer.id
      }, (res) => {
        if (res.status) {
          const blob = new Blob([res.data.file], { type: "text/plain" });
          const jsonObjectUrl = URL.createObjectURL(blob);
          const filename = `${res.data.fileName}.conf`;
          const anchorEl = document.createElement("a");
          anchorEl.href = jsonObjectUrl;
          anchorEl.download = filename;
          anchorEl.click();
          this.dashboardStore.newMessage("WGDashboard", "Peer download started", "success");
        } else {
          this.dashboardStore.newMessage("Server", res.message, "danger");
        }
      });
    },
    downloadQRCode(emit) {
      fetchGet("/api/downloadPeer/" + this.$route.params.id, {
        id: this.Peer.id
      }, (res) => {
        if (res.status) {
          this.$emit(emit, res.data.file);
        } else {
          this.dashboardStore.newMessage("Server", res.message, "danger");
        }
      });
    },
    deletePeer() {
      this.deleteBtnDisabled = true;
      fetchPost(`/api/deletePeers/${this.$route.params.id}`, {
        peers: [this.Peer.id]
      }, (res) => {
        this.dashboardStore.newMessage("Server", res.message, res.status ? "success" : "danger");
        this.$emit("refresh");
        this.deleteBtnDisabled = false;
      });
    },
    restrictPeer() {
      this.restrictBtnDisabled = true;
      fetchPost(`/api/restrictPeers/${this.$route.params.id}`, {
        peers: [this.Peer.id]
      }, (res) => {
        this.dashboardStore.newMessage("Server", res.message, res.status ? "success" : "danger");
        this.$emit("refresh");
        this.restrictBtnDisabled = false;
      });
    },
    allowAccessPeer() {
      this.allowAccessBtnDisabled = true;
      fetchPost(`/api/allowAccessPeers/${this.$route.params.id}`, {
        peers: [this.Peer.id]
      }, (res) => {
        this.dashboardStore.newMessage("Server", res.message, res.status ? "success" : "danger");
        this.$emit("refresh");
        this.allowAccessBtnDisabled = false;
      });
    }
  }
};
const _hoisted_1$3 = {
  class: "dropdown-menu mt-2 shadow-lg d-block rounded-3",
  style: { "max-width": "200px" }
};
const _hoisted_2$2 = { style: { "font-size": "0.8rem", "padding-left": "var(--bs-dropdown-item-padding-x)", "padding-right": "var(--bs-dropdown-item-padding-x)" } };
const _hoisted_3$2 = { class: "text-body d-flex" };
const _hoisted_4$2 = { class: "ms-auto" };
const _hoisted_5$2 = { key: 1 };
const _hoisted_6$2 = {
  class: "w-100 dropdown-item text-muted",
  style: { "white-space": "break-spaces", "font-size": "0.7rem" }
};
const _hoisted_7$2 = { key: 2 };
const _hoisted_8$2 = {
  class: "d-flex",
  style: { "padding-left": "var(--bs-dropdown-item-padding-x)", "padding-right": "var(--bs-dropdown-item-padding-x)" }
};
const _hoisted_9$2 = {
  key: 1,
  class: "confirmDelete"
};
const _hoisted_10$2 = {
  style: { "white-space": "break-spaces" },
  class: "mb-2 d-block fw-bold"
};
const _hoisted_11$2 = { class: "d-flex w-100 gap-2" };
const _hoisted_12$2 = ["disabled"];
const _hoisted_13$2 = ["disabled"];
const _hoisted_14$1 = { key: 1 };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_PeerSettingsDropdownTool = resolveComponent("PeerSettingsDropdownTool");
  return openBlock(), createElementBlock("ul", _hoisted_1$3, [
    !this.Peer.restricted ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      !this.confirmDelete ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        this.Peer.status === "running" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("li", _hoisted_2$2, [
            createBaseVNode("span", _hoisted_3$2, [
              _cache[11] || (_cache[11] = createBaseVNode("i", { class: "bi bi-box-arrow-in-right" }, null, -1)),
              createBaseVNode("span", _hoisted_4$2, toDisplayString(this.Peer.endpoint), 1)
            ])
          ]),
          _cache[12] || (_cache[12] = createBaseVNode("li", null, [
            createBaseVNode("hr", { class: "dropdown-divider" })
          ], -1))
        ], 64)) : createCommentVNode("", true),
        !this.Peer.private_key ? (openBlock(), createElementBlock("li", _hoisted_5$2, [
          createBaseVNode("small", _hoisted_6$2, [
            createVNode(_component_LocaleText, { t: "Download & QR Code is not available due to no private key set for this peer" })
          ])
        ])) : (openBlock(), createElementBlock("li", _hoisted_7$2, [
          _cache[13] || (_cache[13] = createBaseVNode("div", { class: "text-center text-muted" }, null, -1)),
          createBaseVNode("div", _hoisted_8$2, [
            createVNode(_component_PeerSettingsDropdownTool, {
              icon: "bi-download",
              title: "Download",
              onClick: _cache[0] || (_cache[0] = ($event) => this.downloadPeer())
            }),
            createVNode(_component_PeerSettingsDropdownTool, {
              icon: "bi-qr-code",
              title: "QR Code",
              onClick: _cache[1] || (_cache[1] = ($event) => this.$emit("qrcode"))
            }),
            createVNode(_component_PeerSettingsDropdownTool, {
              icon: "bi-body-text",
              title: "Configuration File",
              onClick: _cache[2] || (_cache[2] = ($event) => this.$emit("configurationFile"))
            }),
            createVNode(_component_PeerSettingsDropdownTool, {
              icon: "bi-share",
              title: "Share Peer",
              onClick: _cache[3] || (_cache[3] = ($event) => this.$emit("share"))
            })
          ])
        ])),
        _cache[20] || (_cache[20] = createBaseVNode("li", null, [
          createBaseVNode("hr", { class: "dropdown-divider" })
        ], -1)),
        createBaseVNode("li", null, [
          createBaseVNode("a", {
            class: "dropdown-item d-flex",
            role: "button",
            onClick: _cache[4] || (_cache[4] = ($event) => this.$emit("setting"))
          }, [
            _cache[14] || (_cache[14] = createBaseVNode("i", { class: "me-auto bi bi-pen" }, null, -1)),
            _cache[15] || (_cache[15] = createTextVNode()),
            createVNode(_component_LocaleText, { t: "Peer Settings" })
          ])
        ]),
        createBaseVNode("li", null, [
          createBaseVNode("a", {
            class: "dropdown-item d-flex",
            role: "button",
            onClick: _cache[5] || (_cache[5] = ($event) => this.$emit("jobs"))
          }, [
            _cache[16] || (_cache[16] = createBaseVNode("i", { class: "me-auto bi bi-app-indicator" }, null, -1)),
            _cache[17] || (_cache[17] = createTextVNode()),
            createVNode(_component_LocaleText, { t: "Schedule Jobs" })
          ])
        ]),
        _cache[21] || (_cache[21] = createBaseVNode("li", null, [
          createBaseVNode("hr", { class: "dropdown-divider" })
        ], -1)),
        createBaseVNode("li", null, [
          createBaseVNode("a", {
            class: normalizeClass(["dropdown-item d-flex text-warning", { disabled: this.restrictBtnDisabled }]),
            onClick: _cache[6] || (_cache[6] = ($event) => this.restrictPeer()),
            role: "button"
          }, [
            _cache[18] || (_cache[18] = createBaseVNode("i", { class: "me-auto bi bi-lock" }, null, -1)),
            !this.restrictBtnDisabled ? (openBlock(), createBlock(_component_LocaleText, {
              key: 0,
              t: "Restrict Access"
            })) : (openBlock(), createBlock(_component_LocaleText, {
              key: 1,
              t: "Restricting..."
            }))
          ], 2)
        ]),
        createBaseVNode("li", null, [
          createBaseVNode("a", {
            class: normalizeClass(["dropdown-item d-flex fw-bold text-danger", { disabled: this.deleteBtnDisabled }]),
            onClick: _cache[7] || (_cache[7] = ($event) => this.confirmDelete = true),
            role: "button"
          }, [
            _cache[19] || (_cache[19] = createBaseVNode("i", { class: "me-auto bi bi-trash" }, null, -1)),
            !this.deleteBtnDisabled ? (openBlock(), createBlock(_component_LocaleText, {
              key: 0,
              t: "Delete"
            })) : (openBlock(), createBlock(_component_LocaleText, {
              key: 1,
              t: "Deleting..."
            }))
          ], 2)
        ])
      ], 64)) : (openBlock(), createElementBlock("li", _hoisted_9$2, [
        createBaseVNode("p", _hoisted_10$2, [
          createVNode(_component_LocaleText, { t: "Are you sure to delete this peer?" })
        ]),
        createBaseVNode("div", _hoisted_11$2, [
          createBaseVNode("button", {
            onClick: _cache[8] || (_cache[8] = ($event) => this.deletePeer()),
            disabled: this.deleteBtnDisabled,
            class: "flex-grow-1 ms-auto btn btn-sm bg-danger"
          }, [
            createVNode(_component_LocaleText, { t: "Yes" })
          ], 8, _hoisted_12$2),
          createBaseVNode("button", {
            disabled: this.deleteBtnDisabled,
            onClick: _cache[9] || (_cache[9] = ($event) => this.confirmDelete = false),
            class: "flex-grow-1 btn btn-sm bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle"
          }, [
            createVNode(_component_LocaleText, { t: "No" })
          ], 8, _hoisted_13$2)
        ])
      ]))
    ], 64)) : (openBlock(), createElementBlock("li", _hoisted_14$1, [
      createBaseVNode("a", {
        class: normalizeClass(["dropdown-item d-flex text-warning", { disabled: this.allowAccessBtnDisabled }]),
        onClick: _cache[10] || (_cache[10] = ($event) => this.allowAccessPeer()),
        role: "button"
      }, [
        _cache[22] || (_cache[22] = createBaseVNode("i", { class: "me-auto bi bi-unlock" }, null, -1)),
        !this.allowAccessBtnDisabled ? (openBlock(), createBlock(_component_LocaleText, {
          key: 0,
          t: "Allow Access"
        })) : (openBlock(), createBlock(_component_LocaleText, {
          key: 1,
          t: "Allowing Access..."
        }))
      ], 2)
    ]))
  ]);
}
const PeerSettingsDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__scopeId", "data-v-ebeddf70"]]);
const _sfc_main$3 = {
  name: "peer",
  methods: { GetLocale },
  components: { LocaleText, PeerSettingsDropdown },
  props: {
    Peer: Object
  },
  data() {
    return {};
  },
  setup() {
    const target = ref(null);
    const subMenuOpened = ref(false);
    const dashboardStore = DashboardConfigurationStore();
    onClickOutside(target, (event) => {
      subMenuOpened.value = false;
    });
    return { target, subMenuOpened, dashboardStore };
  },
  computed: {
    getLatestHandshake() {
      if (this.Peer.latest_handshake.includes(",")) {
        return this.Peer.latest_handshake.split(",")[0];
      }
      return this.Peer.latest_handshake;
    }
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "card-header bg-transparent d-flex align-items-center gap-2 border-0"
};
const _hoisted_2$1 = {
  key: 0,
  style: { "font-size": "0.8rem", "color": "#28a745" },
  class: "d-flex align-items-center"
};
const _hoisted_3$1 = {
  style: { "font-size": "0.8rem" },
  class: "ms-auto d-flex gap-2"
};
const _hoisted_4$1 = { class: "text-primary" };
const _hoisted_5$1 = { class: "text-success" };
const _hoisted_6$1 = {
  key: 0,
  class: "text-secondary"
};
const _hoisted_7$1 = {
  key: 1,
  class: "border-0 card-header bg-transparent text-warning fw-bold",
  style: { "font-size": "0.8rem" }
};
const _hoisted_8$1 = {
  class: "card-body pt-1",
  style: { "font-size": "0.9rem" }
};
const _hoisted_9$1 = { class: "text-muted" };
const _hoisted_10$1 = { class: "d-block" };
const _hoisted_11$1 = { class: "text-muted" };
const _hoisted_12$1 = { class: "d-block" };
const _hoisted_13$1 = { class: "d-flex align-items-end ms-auto" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_PeerSettingsDropdown = resolveComponent("PeerSettingsDropdown");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["card shadow-sm rounded-3 peerCard", { "border-warning": $props.Peer.restricted }])
  }, [
    createBaseVNode("div", null, [
      !$props.Peer.restricted ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", {
          class: normalizeClass(["dot ms-0", { active: $props.Peer.status === "running" }])
        }, null, 2),
        $setup.dashboardStore.Configuration.Server.dashboard_peer_list_display === "list" && $props.Peer.status === "running" ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-box-arrow-in-right me-2" }, null, -1)),
          createBaseVNode("span", null, toDisplayString($props.Peer.endpoint), 1)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3$1, [
          createBaseVNode("span", _hoisted_4$1, [
            _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-arrow-down" }, null, -1)),
            createBaseVNode("strong", null, toDisplayString(($props.Peer.cumu_receive + $props.Peer.total_receive).toFixed(4)), 1),
            _cache[9] || (_cache[9] = createTextVNode(" GB "))
          ]),
          createBaseVNode("span", _hoisted_5$1, [
            _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-arrow-up" }, null, -1)),
            createBaseVNode("strong", null, toDisplayString(($props.Peer.cumu_sent + $props.Peer.total_sent).toFixed(4)), 1),
            _cache[11] || (_cache[11] = createTextVNode(" GB "))
          ]),
          $props.Peer.latest_handshake !== "No Handshake" ? (openBlock(), createElementBlock("span", _hoisted_6$1, [
            _cache[12] || (_cache[12] = createBaseVNode("i", { class: "bi bi-arrows-angle-contract" }, null, -1)),
            createTextVNode(" " + toDisplayString($options.getLatestHandshake) + " ago ", 1)
          ])) : createCommentVNode("", true)
        ])
      ])) : (openBlock(), createElementBlock("div", _hoisted_7$1, [
        _cache[13] || (_cache[13] = createBaseVNode("i", { class: "bi-lock-fill me-2" }, null, -1)),
        createVNode(_component_LocaleText, { t: "Access Restricted" })
      ]))
    ]),
    createBaseVNode("div", _hoisted_8$1, [
      createBaseVNode("h6", null, toDisplayString($props.Peer.name ? $props.Peer.name : $options.GetLocale("Untitled Peer")), 1),
      createBaseVNode("div", {
        class: normalizeClass(["d-flex", [$setup.dashboardStore.Configuration.Server.dashboard_peer_list_display === "grid" ? "gap-1 flex-column" : "flex-row gap-3"]])
      }, [
        createBaseVNode("div", {
          class: normalizeClass({ "d-flex gap-2 align-items-center": $setup.dashboardStore.Configuration.Server.dashboard_peer_list_display === "list" })
        }, [
          createBaseVNode("small", _hoisted_9$1, [
            createVNode(_component_LocaleText, { t: "Public Key" })
          ]),
          createBaseVNode("small", _hoisted_10$1, [
            createBaseVNode("samp", null, toDisplayString($props.Peer.id), 1)
          ])
        ], 2),
        createBaseVNode("div", {
          class: normalizeClass({ "d-flex gap-2 align-items-center": $setup.dashboardStore.Configuration.Server.dashboard_peer_list_display === "list" })
        }, [
          createBaseVNode("small", _hoisted_11$1, [
            createVNode(_component_LocaleText, { t: "Allowed IPs" })
          ]),
          createBaseVNode("small", _hoisted_12$1, [
            createBaseVNode("samp", null, toDisplayString($props.Peer.allowed_ip), 1)
          ])
        ], 2),
        createBaseVNode("div", _hoisted_13$1, [
          createBaseVNode("div", {
            class: normalizeClass(["ms-auto px-2 rounded-3 subMenuBtn", { active: this.subMenuOpened }])
          }, [
            createBaseVNode("a", {
              role: "button",
              class: "text-body",
              onClick: _cache[0] || (_cache[0] = ($event) => this.subMenuOpened = true)
            }, _cache[14] || (_cache[14] = [
              createBaseVNode("h5", { class: "mb-0" }, [
                createBaseVNode("i", { class: "bi bi-three-dots" })
              ], -1)
            ])),
            createVNode(Transition, { name: "slide-fade" }, {
              default: withCtx(() => [
                this.subMenuOpened ? (openBlock(), createBlock(_component_PeerSettingsDropdown, {
                  key: 0,
                  onQrcode: _cache[1] || (_cache[1] = ($event) => this.$emit("qrcode")),
                  onConfigurationFile: _cache[2] || (_cache[2] = ($event) => this.$emit("configurationFile")),
                  onSetting: _cache[3] || (_cache[3] = ($event) => this.$emit("setting")),
                  onJobs: _cache[4] || (_cache[4] = ($event) => this.$emit("jobs")),
                  onRefresh: _cache[5] || (_cache[5] = ($event) => this.$emit("refresh")),
                  onShare: _cache[6] || (_cache[6] = ($event) => this.$emit("share")),
                  Peer: $props.Peer,
                  ref: "target"
                }, null, 8, ["Peer"])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ], 2)
        ])
      ], 2)
    ])
  ], 2);
}
const Peer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__scopeId", "data-v-61d5584d"]]);
const _sfc_main$2 = {
  __name: "peerListModals",
  props: {
    configurationModals: Object,
    configurationModalSelectedPeer: Object
  },
  emits: ["refresh"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const PeerShareLinkModal = defineAsyncComponent(() => __vitePreload(() => import("./peerShareLinkModal-BU1JRJMj.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0));
    const PeerJobsModal = defineAsyncComponent(() => __vitePreload(() => import("./peerJobs-Br3x6OMX.js"), true ? __vite__mapDeps([7,8,1,2,4,3,5,9,10]) : void 0));
    const PeerQRCodeModal = defineAsyncComponent(() => __vitePreload(() => import("./peerQRCode-D5swauWE.js"), true ? __vite__mapDeps([11,12,5,1,2,13]) : void 0));
    const PeerConfigurationFileModal = defineAsyncComponent(() => __vitePreload(() => import("./peerConfigurationFile-BfgPqC6w.js"), true ? __vite__mapDeps([14,1,2,5,12,15]) : void 0));
    const PeerSettingsModal = defineAsyncComponent(() => __vitePreload(() => import("./peerSettings-Be0G32ZW.js"), true ? __vite__mapDeps([16,1,2,5,17]) : void 0));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(TransitionGroup, { name: "zoom" }, {
        default: withCtx(() => [
          __props.configurationModals.peerSetting.modalOpen ? (openBlock(), createBlock(unref(PeerSettingsModal), {
            key: "PeerSettingsModal",
            selectedPeer: __props.configurationModalSelectedPeer,
            onRefresh: _cache[0] || (_cache[0] = ($event) => emits("refresh")),
            onClose: _cache[1] || (_cache[1] = ($event) => __props.configurationModals.peerSetting.modalOpen = false)
          }, null, 8, ["selectedPeer"])) : createCommentVNode("", true),
          __props.configurationModals.peerQRCode.modalOpen ? (openBlock(), createBlock(unref(PeerQRCodeModal), {
            key: "PeerQRCodeModal",
            selectedPeer: __props.configurationModalSelectedPeer,
            onClose: _cache[2] || (_cache[2] = ($event) => __props.configurationModals.peerQRCode.modalOpen = false)
          }, null, 8, ["selectedPeer"])) : createCommentVNode("", true),
          __props.configurationModals.peerScheduleJobs.modalOpen ? (openBlock(), createBlock(unref(PeerJobsModal), {
            key: "PeerJobsModal",
            onRefresh: _cache[3] || (_cache[3] = ($event) => emits("refresh")),
            selectedPeer: __props.configurationModalSelectedPeer,
            onClose: _cache[4] || (_cache[4] = ($event) => __props.configurationModals.peerScheduleJobs.modalOpen = false)
          }, null, 8, ["selectedPeer"])) : createCommentVNode("", true),
          __props.configurationModals.peerShare.modalOpen ? (openBlock(), createBlock(unref(PeerShareLinkModal), {
            key: "PeerShareLinkModal",
            onClose: _cache[5] || (_cache[5] = ($event) => {
              __props.configurationModals.peerShare.modalOpen = false;
            }),
            selectedPeer: __props.configurationModalSelectedPeer
          }, null, 8, ["selectedPeer"])) : createCommentVNode("", true),
          __props.configurationModals.peerConfigurationFile.modalOpen ? (openBlock(), createBlock(unref(PeerConfigurationFileModal), {
            key: 4,
            onClose: _cache[6] || (_cache[6] = ($event) => __props.configurationModals.peerConfigurationFile.modalOpen = false),
            selectedPeer: __props.configurationModalSelectedPeer
          }, null, 8, ["selectedPeer"])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const _hoisted_1$1 = {
  style: { "margin-bottom": "20px", "height": "1px" },
  id: "loadMore"
};
const _sfc_main$1 = {
  __name: "peerIntersectionObserver",
  props: ["peerListLength", "showPeersCount"],
  emits: ["loadMore"],
  setup(__props, { emit: __emit }) {
    const observer = ref(void 0);
    const emits = __emit;
    onMounted(() => {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            emits("loadMore");
          }
        });
      }, {
        rootMargin: "20px",
        threshold: 1
      });
      observer.value.observe(document.querySelector("#loadMore"));
    });
    onBeforeUnmount(() => {
      observer.value.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1);
    };
  }
};
const _hoisted_1 = { class: "container-fluid" };
const _hoisted_2 = { class: "d-flex align-items-sm-center flex-column flex-sm-row gap-3" };
const _hoisted_3 = { class: "text-muted d-flex align-items-center gap-2" };
const _hoisted_4 = { class: "mb-0" };
const _hoisted_5 = { class: "d-flex align-items-center gap-3" };
const _hoisted_6 = { class: "mb-0 display-4" };
const _hoisted_7 = { class: "ms-sm-auto d-flex gap-2 flex-column" };
const _hoisted_8 = { class: "card rounded-3 bg-transparent" };
const _hoisted_9 = { class: "card-body py-2 d-flex align-items-center" };
const _hoisted_10 = { class: "text-muted" };
const _hoisted_11 = { class: "form-check form-switch mb-0 ms-auto pe-0 me-0" };
const _hoisted_12 = ["for"];
const _hoisted_13 = {
  key: 2,
  class: "spinner-border spinner-border-sm ms-2",
  "aria-hidden": "true"
};
const _hoisted_14 = ["disabled", "id"];
const _hoisted_15 = { class: "d-flex gap-2" };
const _hoisted_16 = { class: "row mt-3 gy-2 gx-2 mb-2" };
const _hoisted_17 = { class: "col-12 col-lg-3" };
const _hoisted_18 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_19 = { class: "card-body py-2 d-flex flex-column justify-content-center" };
const _hoisted_20 = { class: "mb-0 text-muted" };
const _hoisted_21 = { class: "col-12 col-lg-3" };
const _hoisted_22 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_23 = { class: "card-body py-2 d-flex flex-column justify-content-center" };
const _hoisted_24 = { class: "mb-0 text-muted" };
const _hoisted_25 = {
  style: { "word-break": "break-all" },
  class: "col-12 col-lg-6"
};
const _hoisted_26 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_27 = { class: "card-body py-2 d-flex flex-column justify-content-center" };
const _hoisted_28 = { class: "mb-0 text-muted" };
const _hoisted_29 = { class: "row gx-2 gy-2 mb-2" };
const _hoisted_30 = { class: "col-12 col-lg-3" };
const _hoisted_31 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_32 = { class: "card-body d-flex" };
const _hoisted_33 = { class: "mb-0 text-muted" };
const _hoisted_34 = { class: "h4" };
const _hoisted_35 = { class: "col-12 col-lg-3" };
const _hoisted_36 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_37 = { class: "card-body d-flex" };
const _hoisted_38 = { class: "mb-0 text-muted" };
const _hoisted_39 = { class: "h4" };
const _hoisted_40 = { class: "col-12 col-lg-3" };
const _hoisted_41 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_42 = { class: "card-body d-flex" };
const _hoisted_43 = { class: "mb-0 text-muted" };
const _hoisted_44 = { class: "h4 text-primary" };
const _hoisted_45 = { class: "col-12 col-lg-3" };
const _hoisted_46 = { class: "card rounded-3 bg-transparent h-100" };
const _hoisted_47 = { class: "card-body d-flex" };
const _hoisted_48 = { class: "mb-0 text-muted" };
const _hoisted_49 = { class: "h4 text-success" };
const _hoisted_50 = { style: { "margin-bottom": "80px" } };
const showPeersThreshold = 20;
const _sfc_main = {
  __name: "peerList",
  async setup(__props) {
    let __temp, __restore;
    const PeerSearchBar = defineAsyncComponent(() => __vitePreload(() => import("./peerSearchBar-R1e9xfEo.js"), true ? __vite__mapDeps([18,1,2,5,19]) : void 0));
    const PeerJobsAllModal = defineAsyncComponent(() => __vitePreload(() => import("./peerJobsAllModal-BTer0Ldx.js"), true ? __vite__mapDeps([20,8,1,2,4,3,5,9]) : void 0));
    const PeerJobsLogsModal = defineAsyncComponent(() => __vitePreload(() => import("./peerJobsLogsModal-DHADMS7W.js"), true ? __vite__mapDeps([21,3,1,2,5]) : void 0));
    const EditConfigurationModal = defineAsyncComponent(() => __vitePreload(() => import("./editConfiguration-D9JDjdGE.js"), true ? __vite__mapDeps([22,1,2,5,3,23]) : void 0));
    const SelectPeersModal = defineAsyncComponent(() => __vitePreload(() => import("./selectPeers-BEQUWOKt.js"), true ? __vite__mapDeps([24,1,2,5,25]) : void 0));
    const PeerAddModal = defineAsyncComponent(() => __vitePreload(() => import("./peerAddModal-BwpHXlAu.js"), true ? __vite__mapDeps([26,1,2,5,27]) : void 0));
    const dashboardStore = DashboardConfigurationStore();
    const wireguardConfigurationStore = WireguardConfigurationsStore();
    const route = useRoute();
    const configurationInfo = ref({});
    const configurationPeers = ref([]);
    const configurationToggling = ref(false);
    const configurationModalSelectedPeer = ref({});
    const configurationModals = ref({
      peerNew: {
        modalOpen: false
      },
      peerSetting: {
        modalOpen: false
      },
      peerScheduleJobs: {
        modalOpen: false
      },
      peerQRCode: {
        modalOpen: false
      },
      peerConfigurationFile: {
        modalOpen: false
      },
      peerCreate: {
        modalOpen: false
      },
      peerScheduleJobsAll: {
        modalOpen: false
      },
      peerScheduleJobsLogs: {
        modalOpen: false
      },
      peerShare: {
        modalOpen: false
      },
      editConfiguration: {
        modalOpen: false
      },
      selectPeers: {
        modalOpen: false
      },
      backupRestore: {
        modalOpen: false
      },
      deleteConfiguration: {
        modalOpen: false
      },
      editRawConfigurationFile: {
        modalOpen: false
      }
    });
    const peerSearchBar = ref(false);
    const fetchPeerList = async () => {
      await fetchGet("/api/getWireguardConfigurationInfo", {
        configurationName: route.params.id
      }, (res) => {
        if (res.status) {
          configurationInfo.value = res.data.configurationInfo;
          configurationPeers.value = res.data.configurationPeers;
          configurationPeers.value.forEach((p) => {
            p.restricted = false;
          });
          res.data.configurationRestrictedPeers.forEach((x) => {
            x.restricted = true;
            configurationPeers.value.push(x);
          });
        }
      });
    };
    [__temp, __restore] = withAsyncContext(() => fetchPeerList()), await __temp, __restore();
    const fetchPeerListInterval = ref(void 0);
    const setFetchPeerListInterval = () => {
      clearInterval(fetchPeerListInterval.value);
      fetchPeerListInterval.value = setInterval(async () => {
        await fetchPeerList();
      }, parseInt(dashboardStore.Configuration.Server.dashboard_refresh_interval));
    };
    setFetchPeerListInterval();
    onBeforeUnmount(() => {
      clearInterval(fetchPeerListInterval.value);
      fetchPeerListInterval.value = void 0;
    });
    watch(() => {
      return dashboardStore.Configuration.Server.dashboard_refresh_interval;
    }, () => {
      setFetchPeerListInterval();
    });
    const toggleConfiguration = async () => {
      configurationToggling.value = true;
      await fetchGet("/api/toggleWireguardConfiguration", {
        configurationName: configurationInfo.value.Name
      }, (res) => {
        if (res.status) {
          dashboardStore.newMessage(
            "Server",
            `${configurationInfo.value.Name} ${res.data ? "is on" : "is off"}`,
            "success"
          );
        } else {
          dashboardStore.newMessage("Server", res.message, "danger");
        }
        wireguardConfigurationStore.Configurations.find((x) => x.Name === configurationInfo.value.Name).Status = res.data;
        configurationInfo.value.Status = res.data;
        configurationToggling.value = false;
      });
    };
    const configurationSummary = computed(() => {
      return {
        connectedPeers: configurationPeers.value.filter((x) => x.status === "running").length,
        totalUsage: configurationPeers.value.length > 0 ? configurationPeers.value.filter((x) => !x.restricted).map((x) => x.total_data + x.cumu_data).reduce((a, b) => a + b, 0).toFixed(4) : 0,
        totalReceive: configurationPeers.value.length > 0 ? configurationPeers.value.filter((x) => !x.restricted).map((x) => x.total_receive + x.cumu_receive).reduce((a, b) => a + b, 0).toFixed(4) : 0,
        totalSent: configurationPeers.value.length > 0 ? configurationPeers.value.filter((x) => !x.restricted).map((x) => x.total_sent + x.cumu_sent).reduce((a, b) => a + b, 0).toFixed(4) : 0
      };
    });
    const showPeersCount = ref(10);
    const searchPeers = computed(() => {
      const result = wireguardConfigurationStore.searchString ? configurationPeers.value.filter((x) => {
        return x.name.includes(wireguardConfigurationStore.searchString) || x.id.includes(wireguardConfigurationStore.searchString) || x.allowed_ip.includes(wireguardConfigurationStore.searchString);
      }) : configurationPeers.value;
      if (dashboardStore.Configuration.Server.dashboard_sort === "restricted") {
        return result.sort((a, b) => {
          if (a[dashboardStore.Configuration.Server.dashboard_sort] < b[dashboardStore.Configuration.Server.dashboard_sort]) {
            return 1;
          }
          if (a[dashboardStore.Configuration.Server.dashboard_sort] > b[dashboardStore.Configuration.Server.dashboard_sort]) {
            return -1;
          }
          return 0;
        }).slice(0, showPeersCount.value);
      }
      return result.sort((a, b) => {
        if (a[dashboardStore.Configuration.Server.dashboard_sort] < b[dashboardStore.Configuration.Server.dashboard_sort]) {
          return -1;
        }
        if (a[dashboardStore.Configuration.Server.dashboard_sort] > b[dashboardStore.Configuration.Server.dashboard_sort]) {
          return 1;
        }
        return 0;
      }).slice(0, showPeersCount.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_3, [
              createBaseVNode("h5", _hoisted_4, [
                createVNode(_sfc_main$8, {
                  protocol: configurationInfo.value.Protocol
                }, null, 8, ["protocol"])
              ])
            ]),
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("h1", _hoisted_6, [
                createBaseVNode("samp", null, toDisplayString(configurationInfo.value.Name), 1)
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                createBaseVNode("small", _hoisted_10, [
                  createVNode(LocaleText, { t: "Status" })
                ]),
                createBaseVNode("div", {
                  class: normalizeClass(["dot ms-2", { active: configurationInfo.value.Status }])
                }, null, 2),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("label", {
                    class: "form-check-label",
                    style: { "cursor": "pointer" },
                    for: "switch" + configurationInfo.value.id
                  }, [
                    configurationInfo.value.Status && !configurationToggling.value ? (openBlock(), createBlock(LocaleText, {
                      key: 0,
                      t: "On"
                    })) : !configurationInfo.value.Status && !configurationToggling.value ? (openBlock(), createBlock(LocaleText, {
                      key: 1,
                      t: "Off"
                    })) : createCommentVNode("", true),
                    configurationToggling.value ? (openBlock(), createElementBlock("span", _hoisted_13)) : createCommentVNode("", true)
                  ], 8, _hoisted_12),
                  withDirectives(createBaseVNode("input", {
                    class: "form-check-input",
                    style: { "cursor": "pointer" },
                    disabled: configurationToggling.value,
                    type: "checkbox",
                    role: "switch",
                    id: "switch" + configurationInfo.value.id,
                    onChange: _cache[0] || (_cache[0] = ($event) => toggleConfiguration()),
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => configurationInfo.value.Status = $event)
                  }, null, 40, _hoisted_14), [
                    [vModelCheckbox, configurationInfo.value.Status]
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("a", {
                role: "button",
                onClick: _cache[2] || (_cache[2] = ($event) => configurationModals.value.peerNew.modalOpen = true),
                class: "titleBtn py-2 text-decoration-none btn text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle"
              }, [
                _cache[29] || (_cache[29] = createBaseVNode("i", { class: "bi bi-plus-circle me-2" }, null, -1)),
                createVNode(LocaleText, { t: "Peer" })
              ]),
              createBaseVNode("button", {
                class: "titleBtn py-2 text-decoration-none btn text-primary-emphasis bg-primary-subtle rounded-3 border-1 border-primary-subtle",
                onClick: _cache[3] || (_cache[3] = ($event) => configurationModals.value.editConfiguration.modalOpen = true),
                type: "button",
                "aria-expanded": "false"
              }, [
                _cache[30] || (_cache[30] = createBaseVNode("i", { class: "bi bi-gear-fill me-2" }, null, -1)),
                createVNode(LocaleText, { t: "Configuration Settings" })
              ])
            ])
          ])
        ]),
        _cache[35] || (_cache[35] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", _hoisted_16, [
          createBaseVNode("div", _hoisted_17, [
            createBaseVNode("div", _hoisted_18, [
              createBaseVNode("div", _hoisted_19, [
                createBaseVNode("p", _hoisted_20, [
                  createBaseVNode("small", null, [
                    createVNode(LocaleText, { t: "Address" })
                  ])
                ]),
                createTextVNode(" " + toDisplayString(configurationInfo.value.Address), 1)
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_21, [
            createBaseVNode("div", _hoisted_22, [
              createBaseVNode("div", _hoisted_23, [
                createBaseVNode("p", _hoisted_24, [
                  createBaseVNode("small", null, [
                    createVNode(LocaleText, { t: "Listen Port" })
                  ])
                ]),
                createTextVNode(" " + toDisplayString(configurationInfo.value.ListenPort), 1)
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_25, [
            createBaseVNode("div", _hoisted_26, [
              createBaseVNode("div", _hoisted_27, [
                createBaseVNode("p", _hoisted_28, [
                  createBaseVNode("small", null, [
                    createVNode(LocaleText, { t: "Public Key" })
                  ])
                ]),
                createBaseVNode("samp", null, toDisplayString(configurationInfo.value.PublicKey), 1)
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_29, [
          createBaseVNode("div", _hoisted_30, [
            createBaseVNode("div", _hoisted_31, [
              createBaseVNode("div", _hoisted_32, [
                createBaseVNode("div", null, [
                  createBaseVNode("p", _hoisted_33, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "Connected Peers" })
                    ])
                  ]),
                  createBaseVNode("strong", _hoisted_34, toDisplayString(configurationSummary.value.connectedPeers) + " / " + toDisplayString(configurationPeers.value.length), 1)
                ]),
                _cache[31] || (_cache[31] = createBaseVNode("i", { class: "bi bi-ethernet ms-auto h2 text-muted" }, null, -1))
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_35, [
            createBaseVNode("div", _hoisted_36, [
              createBaseVNode("div", _hoisted_37, [
                createBaseVNode("div", null, [
                  createBaseVNode("p", _hoisted_38, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "Total Usage" })
                    ])
                  ]),
                  createBaseVNode("strong", _hoisted_39, toDisplayString(configurationSummary.value.totalUsage) + " GB", 1)
                ]),
                _cache[32] || (_cache[32] = createBaseVNode("i", { class: "bi bi-arrow-down-up ms-auto h2 text-muted" }, null, -1))
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_40, [
            createBaseVNode("div", _hoisted_41, [
              createBaseVNode("div", _hoisted_42, [
                createBaseVNode("div", null, [
                  createBaseVNode("p", _hoisted_43, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "Total Received" })
                    ])
                  ]),
                  createBaseVNode("strong", _hoisted_44, toDisplayString(configurationSummary.value.totalReceive) + " GB", 1)
                ]),
                _cache[33] || (_cache[33] = createBaseVNode("i", { class: "bi bi-arrow-down ms-auto h2 text-muted" }, null, -1))
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_45, [
            createBaseVNode("div", _hoisted_46, [
              createBaseVNode("div", _hoisted_47, [
                createBaseVNode("div", null, [
                  createBaseVNode("p", _hoisted_48, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "Total Sent" })
                    ])
                  ]),
                  createBaseVNode("strong", _hoisted_49, toDisplayString(configurationSummary.value.totalSent) + " GB", 1)
                ]),
                _cache[34] || (_cache[34] = createBaseVNode("i", { class: "bi bi-arrow-up ms-auto h2 text-muted" }, null, -1))
              ])
            ])
          ])
        ]),
        createVNode(_sfc_main$7, {
          configurationPeers: configurationPeers.value,
          configurationInfo: configurationInfo.value
        }, null, 8, ["configurationPeers", "configurationInfo"]),
        _cache[36] || (_cache[36] = createBaseVNode("hr", null, null, -1)),
        createBaseVNode("div", _hoisted_50, [
          configurationPeers.value.length > 0 ? (openBlock(), createBlock(PeerSearch, {
            key: 0,
            onSearch: _cache[4] || (_cache[4] = ($event) => peerSearchBar.value = true),
            onJobsAll: _cache[5] || (_cache[5] = ($event) => configurationModals.value.peerScheduleJobsAll.modalOpen = true),
            onJobLogs: _cache[6] || (_cache[6] = ($event) => configurationModals.value.peerScheduleJobsLogs.modalOpen = true),
            onEditConfiguration: _cache[7] || (_cache[7] = ($event) => configurationModals.value.editConfiguration.modalOpen = true),
            onSelectPeers: _cache[8] || (_cache[8] = ($event) => configurationModals.value.selectPeers.modalOpen = true),
            onBackupRestore: _cache[9] || (_cache[9] = ($event) => configurationModals.value.backupRestore.modalOpen = true),
            onDeleteConfiguration: _cache[10] || (_cache[10] = ($event) => configurationModals.value.deleteConfiguration.modalOpen = true),
            configuration: configurationInfo.value
          }, null, 8, ["configuration"])) : createCommentVNode("", true),
          createVNode(TransitionGroup, {
            name: "peerList",
            tag: "div",
            class: "row gx-2 gy-2 z-0 position-relative"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(searchPeers.value, (peer) => {
                return openBlock(), createElementBlock("div", {
                  class: normalizeClass(["col-12", { "col-lg-6 col-xl-4": unref(dashboardStore).Configuration.Server.dashboard_peer_list_display === "grid" }]),
                  key: peer.id
                }, [
                  createVNode(Peer, {
                    Peer: peer,
                    onShare: ($event) => {
                      configurationModals.value.peerShare.modalOpen = true;
                      configurationModalSelectedPeer.value = peer;
                    },
                    onRefresh: _cache[11] || (_cache[11] = ($event) => fetchPeerList()),
                    onJobs: ($event) => {
                      configurationModals.value.peerScheduleJobs.modalOpen = true;
                      configurationModalSelectedPeer.value = peer;
                    },
                    onSetting: ($event) => {
                      configurationModals.value.peerSetting.modalOpen = true;
                      configurationModalSelectedPeer.value = peer;
                    },
                    onQrcode: ($event) => {
                      configurationModalSelectedPeer.value = peer;
                      configurationModals.value.peerQRCode.modalOpen = true;
                    },
                    onConfigurationFile: ($event) => {
                      configurationModalSelectedPeer.value = peer;
                      configurationModals.value.peerConfigurationFile.modalOpen = true;
                    }
                  }, null, 8, ["Peer", "onShare", "onJobs", "onSetting", "onQrcode", "onConfigurationFile"])
                ], 2);
              }), 128))
            ]),
            _: 1
          })
        ]),
        createVNode(Transition, { name: "slideUp" }, {
          default: withCtx(() => [
            peerSearchBar.value ? (openBlock(), createBlock(unref(PeerSearchBar), {
              key: 0,
              onClose: _cache[12] || (_cache[12] = ($event) => peerSearchBar.value = false)
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_sfc_main$2, {
          configurationModals: configurationModals.value,
          configurationModalSelectedPeer: configurationModalSelectedPeer.value,
          onRefresh: _cache[13] || (_cache[13] = ($event) => fetchPeerList())
        }, null, 8, ["configurationModals", "configurationModalSelectedPeer"]),
        createVNode(TransitionGroup, { name: "zoom" }, {
          default: withCtx(() => [
            (openBlock(), createBlock(Suspense, { key: "PeerAddModal" }, {
              default: withCtx(() => [
                configurationModals.value.peerNew.modalOpen ? (openBlock(), createBlock(unref(PeerAddModal), {
                  key: 0,
                  onClose: _cache[14] || (_cache[14] = ($event) => configurationModals.value.peerNew.modalOpen = false),
                  onAddedPeers: _cache[15] || (_cache[15] = ($event) => {
                    configurationModals.value.peerNew.modalOpen = false;
                    fetchPeerList();
                  })
                })) : createCommentVNode("", true)
              ]),
              _: 1
            })),
            configurationModals.value.peerScheduleJobsAll.modalOpen ? (openBlock(), createBlock(unref(PeerJobsAllModal), {
              key: "PeerJobsAllModal",
              onRefresh: _cache[16] || (_cache[16] = ($event) => fetchPeerList()),
              onAllLogs: _cache[17] || (_cache[17] = ($event) => configurationModals.value.peerScheduleJobsLogs.modalOpen = true),
              onClose: _cache[18] || (_cache[18] = ($event) => configurationModals.value.peerScheduleJobsAll.modalOpen = false),
              configurationPeers: configurationPeers.value
            }, null, 8, ["configurationPeers"])) : createCommentVNode("", true),
            configurationModals.value.peerScheduleJobsLogs.modalOpen ? (openBlock(), createBlock(unref(PeerJobsLogsModal), {
              key: "PeerJobsLogsModal",
              onClose: _cache[19] || (_cache[19] = ($event) => configurationModals.value.peerScheduleJobsLogs.modalOpen = false),
              configurationInfo: configurationInfo.value
            }, null, 8, ["configurationInfo"])) : createCommentVNode("", true),
            configurationModals.value.editConfiguration.modalOpen ? (openBlock(), createBlock(unref(EditConfigurationModal), {
              key: "EditConfigurationModal",
              onEditRaw: _cache[20] || (_cache[20] = ($event) => configurationModals.value.editRawConfigurationFile.modalOpen = true),
              onClose: _cache[21] || (_cache[21] = ($event) => configurationModals.value.editConfiguration.modalOpen = false),
              onDataChanged: _cache[22] || (_cache[22] = (d) => configurationInfo.value = d),
              onRefresh: _cache[23] || (_cache[23] = ($event) => fetchPeerList()),
              onBackupRestore: _cache[24] || (_cache[24] = ($event) => configurationModals.value.backupRestore.modalOpen = true),
              onDeleteConfiguration: _cache[25] || (_cache[25] = ($event) => configurationModals.value.deleteConfiguration.modalOpen = true),
              configurationInfo: configurationInfo.value
            }, null, 8, ["configurationInfo"])) : createCommentVNode("", true),
            configurationModals.value.selectPeers.modalOpen ? (openBlock(), createBlock(unref(SelectPeersModal), {
              key: 3,
              onRefresh: _cache[26] || (_cache[26] = ($event) => fetchPeerList()),
              configurationPeers: configurationPeers.value,
              onClose: _cache[27] || (_cache[27] = ($event) => configurationModals.value.selectPeers.modalOpen = false)
            }, null, 8, ["configurationPeers"])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_sfc_main$1, {
          showPeersCount: showPeersCount.value,
          peerListLength: searchPeers.value.length,
          onLoadMore: _cache[28] || (_cache[28] = ($event) => showPeersCount.value += showPeersThreshold)
        }, null, 8, ["showPeersCount", "peerListLength"])
      ]);
    };
  }
};
const peerList = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4fe6960d"]]);
export {
  peerList as default
};
