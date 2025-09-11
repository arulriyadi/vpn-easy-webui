import { _ as _export_sfc, a as openBlock, c as createElementBlock, b as createBaseVNode, t as toDisplayString, D as DashboardConfigurationStore, q as computed, o as onMounted, x as onBeforeUnmount, r as ref, g as fetchGet, d as createVNode, s as normalizeStyle, F as Fragment, h as renderList, u as unref, w as withCtx, T as TransitionGroup, f as createTextVNode, e as createCommentVNode, i as createBlock, G as GetLocale } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { C as CpuCore } from "./storageMount.vue_vue_type_style_index_0_scoped_9509d7a0_lang-CFLDAtyl.js";
import { C as Chart, L as LineElement, B as BarElement, a as BarController, b as LineController, c as LinearScale, p as plugin_legend, d as plugin_title, e as plugin_tooltip, f as CategoryScale, P as PointElement, i as index, g as Line } from "./index-B5yBe-tE.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
const _hoisted_1$1 = { class: "mb-1 d-flex gap-5" };
const _hoisted_2$1 = { class: "title" };
const _hoisted_3$1 = { class: "ms-auto" };
const _sfc_main$1 = {
  __name: "process",
  props: ["process", "cpu"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("small", _hoisted_2$1, [
          _cache[0] || (_cache[0] = createBaseVNode("i", { class: "bi bi-code-square me-2" }, null, -1)),
          createBaseVNode("samp", null, toDisplayString(__props.process.command ? __props.process.command : __props.process.name), 1)
        ]),
        createBaseVNode("small", _hoisted_3$1, toDisplayString(Math.round((__props.process.percent + Number.EPSILON) * 10) / 10) + "% ", 1)
      ]);
    };
  }
};
const Process = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ffe5ad8f"]]);
const _hoisted_1 = { class: "text-body row g-2 mb-2" };
const _hoisted_2 = { class: "col-sm-6" };
const _hoisted_3 = { class: "card rounded-3 h-100 shadow" };
const _hoisted_4 = { class: "card-body p-4" };
const _hoisted_5 = { class: "d-flex flex-column gap-3" };
const _hoisted_6 = {
  class: "d-flex flex-column gap-3",
  style: { "height": "130px" }
};
const _hoisted_7 = { class: "d-flex align-items-center" };
const _hoisted_8 = { class: "text-muted mb-0" };
const _hoisted_9 = { class: "ms-auto mb-0" };
const _hoisted_10 = { key: 0 };
const _hoisted_11 = {
  key: 1,
  class: "spinner-border"
};
const _hoisted_12 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "10px" }
};
const _hoisted_13 = { class: "d-flex gap-1" };
const _hoisted_14 = { class: "d-flex align-items-center" };
const _hoisted_15 = { class: "mb-0" };
const _hoisted_16 = { class: "mb-0 ms-auto text-muted" };
const _hoisted_17 = { class: "position-relative" };
const _hoisted_18 = { class: "col-sm-6" };
const _hoisted_19 = { class: "card rounded-3 h-100 shadow" };
const _hoisted_20 = { class: "card-body p-4" };
const _hoisted_21 = { class: "d-flex flex-column gap-3" };
const _hoisted_22 = {
  class: "d-flex flex-column gap-3",
  style: { "height": "130px" }
};
const _hoisted_23 = { class: "d-flex align-items-center" };
const _hoisted_24 = { class: "text-muted" };
const _hoisted_25 = { class: "ms-auto" };
const _hoisted_26 = { key: 0 };
const _hoisted_27 = {
  key: 1,
  class: "spinner-border"
};
const _hoisted_28 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "10px" }
};
const _hoisted_29 = { class: "d-flex align-items-center" };
const _hoisted_30 = { class: "mb-0" };
const _hoisted_31 = { class: "mb-0 ms-auto" };
const _hoisted_32 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "10px" }
};
const _hoisted_33 = { class: "d-flex align-items-center" };
const _hoisted_34 = { class: "mb-0" };
const _hoisted_35 = { class: "mb-0 ms-auto text-muted" };
const _hoisted_36 = { class: "position-relative" };
const _hoisted_37 = { class: "col-sm-12" };
const _hoisted_38 = { class: "card rounded-3 h-100 shadow" };
const _hoisted_39 = { class: "card-body p-4 d-flex gap-3 flex-column" };
const _hoisted_40 = { class: "d-flex align-items-center gap-3" };
const _hoisted_41 = { class: "text-muted mb-0" };
const _hoisted_42 = { class: "ms-auto mb-0" };
const _hoisted_43 = { key: 0 };
const _hoisted_44 = {
  key: 1,
  class: "spinner-border"
};
const _hoisted_45 = {
  key: 0,
  class: "mb-0 text-end"
};
const _hoisted_46 = { class: "text-info" };
const _hoisted_47 = { class: "text-warning" };
const _hoisted_48 = {
  key: 0,
  class: "row g-3"
};
const _hoisted_49 = { class: "col-sm-6 fadeIn" };
const _hoisted_50 = { class: "d-flex mb-2" };
const _hoisted_51 = { class: "mb-0" };
const _hoisted_52 = { class: "mb-0 ms-auto d-flex gap-2" };
const _hoisted_53 = { class: "text-info" };
const _hoisted_54 = { class: "text-warning" };
const _hoisted_55 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "10px" }
};
const _hoisted_56 = { class: "col-sm-12" };
const _hoisted_57 = { class: "card rounded-3 h-100 shadow" };
const _hoisted_58 = { class: "card-body p-4 d-flex gap-3 flex-column" };
const _hoisted_59 = { class: "d-flex align-items-center" };
const _hoisted_60 = { class: "text-muted mb-0" };
const _hoisted_61 = { class: "ms-auto mb-0" };
const _hoisted_62 = { key: 0 };
const _hoisted_63 = {
  key: 1,
  class: "spinner-border"
};
const _hoisted_64 = { class: "row g-3" };
const _hoisted_65 = { class: "col-sm-6 fadeIn" };
const _hoisted_66 = { class: "d-flex mb-2" };
const _hoisted_67 = { class: "mb-0" };
const _hoisted_68 = { class: "mb-0 ms-auto d-flex gap-2" };
const _hoisted_69 = { class: "text-success" };
const _hoisted_70 = {
  class: "progress",
  role: "progressbar",
  style: { "height": "20px" }
};
const _sfc_main = {
  __name: "systemStatus",
  setup(__props) {
    const dashboardStore = DashboardConfigurationStore();
    const data = computed(() => {
      return dashboardStore.SystemStatus;
    });
    let interval = null;
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
      PointElement,
      index
    );
    onMounted(() => {
      getData();
      interval = setInterval(() => {
        getData();
      }, 5e3);
    });
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    const historicalChartTimestamp = ref([]);
    const historicalCpuUsage = ref([]);
    const historicalVirtualMemoryUsage = ref([]);
    const historicalSwapMemoryUsage = ref([]);
    const historicalNetworkData = ref({
      bytes_recv: [],
      bytes_sent: []
    });
    const historicalNetworkSpeed = ref({
      bytes_recv: [],
      bytes_sent: []
    });
    const getData = () => {
      fetchGet("/api/systemStatus", {}, (res) => {
        historicalChartTimestamp.value.push(dayjs().format("HH:mm:ss A"));
        dashboardStore.SystemStatus = res.data;
        historicalCpuUsage.value.push(res.data.CPU.cpu_percent);
        historicalVirtualMemoryUsage.value.push(res.data.Memory.VirtualMemory.percent);
        historicalSwapMemoryUsage.value.push(res.data.Memory.SwapMemory.percent);
        historicalNetworkData.value.bytes_recv.push(
          Object.values(res.data.NetworkInterfaces).map((x) => x.bytes_recv).reduce((x, y) => x + y)
        );
        historicalNetworkData.value.bytes_sent.push(
          Object.values(res.data.NetworkInterfaces).map((x) => x.bytes_sent).reduce((x, y) => x + y)
        );
        if (historicalNetworkData.value.bytes_recv.length === 1 && historicalNetworkData.value.bytes_sent.length === 1) {
          historicalNetworkSpeed.value.bytes_recv.push(0);
          historicalNetworkSpeed.value.bytes_sent.push(0);
        } else {
          let bytes_recv_diff = historicalNetworkData.value.bytes_recv[historicalNetworkData.value.bytes_recv.length - 1] - historicalNetworkData.value.bytes_recv[historicalNetworkData.value.bytes_recv.length - 2];
          let bytes_sent_diff = historicalNetworkData.value.bytes_sent[historicalNetworkData.value.bytes_sent.length - 1] - historicalNetworkData.value.bytes_sent[historicalNetworkData.value.bytes_sent.length - 2];
          historicalNetworkSpeed.value.bytes_recv.push(Math.round((bytes_recv_diff / 1024e3 + Number.EPSILON) * 1e4) / 1e4);
          historicalNetworkSpeed.value.bytes_sent.push(Math.round((bytes_sent_diff / 1024e3 + Number.EPSILON) * 1e4) / 1e4);
        }
      });
    };
    const chartOption = computed(() => {
      return {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.formattedValue}%`;
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
              display: false
            }
          },
          y: {
            ticks: {
              callback: (val, index2) => {
                return `${val}%`;
              }
            },
            grid: {
              display: false
            }
          }
        }
      };
    });
    const networkSpeedChartOption = computed(() => {
      return {
        responsive: true,
        plugins: {
          legend: {
            display: true
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
              display: false
            }
          },
          y: {
            ticks: {
              callback: (val, index2) => {
                return `${val} MB/s`;
              }
            },
            grid: {
              display: false
            }
          }
        }
      };
    });
    const cpuHistoricalChartData = computed(() => {
      return {
        labels: [...historicalChartTimestamp.value],
        datasets: [
          {
            label: GetLocale("CPU Usage"),
            data: [...historicalCpuUsage.value],
            fill: "start",
            backgroundColor: "#0d6efd90",
            borderColor: "#0d6efd",
            tension: 0,
            pointRadius: 2,
            borderWidth: 1
          }
        ]
      };
    });
    const memoryHistoricalChartData = computed(() => {
      return {
        labels: [...historicalChartTimestamp.value],
        datasets: [
          {
            label: GetLocale("Memory Usage"),
            data: [...historicalVirtualMemoryUsage.value],
            fill: 1,
            borderColor: "#0dcaf0",
            backgroundColor: "#0dcaf090",
            tension: 0,
            pointRadius: 2,
            borderWidth: 1
          },
          {
            label: GetLocale("Swap Memory Usage"),
            data: [...historicalSwapMemoryUsage.value],
            fill: "start",
            backgroundColor: "#ffc10790",
            borderColor: "#ffc107",
            tension: 0,
            pointRadius: 2,
            borderWidth: 1
          }
        ]
      };
    });
    const networkSpeedHistoricalChartData = computed(() => {
      return {
        labels: [...historicalChartTimestamp.value],
        datasets: [
          {
            label: GetLocale("Real Time Received Data Usage"),
            data: [...historicalNetworkSpeed.value.bytes_recv],
            fill: "origin",
            borderColor: "#0dcaf0",
            backgroundColor: "#0dcaf090",
            tension: 0,
            pointRadius: 2,
            borderWidth: 1
          },
          {
            label: GetLocale("Real Time Sent Data Usage"),
            data: [...historicalNetworkSpeed.value.bytes_sent],
            fill: "origin",
            backgroundColor: "#ffc10790",
            borderColor: "#ffc107",
            tension: 0,
            pointRadius: 2,
            borderWidth: 1
          }
        ]
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("div", _hoisted_6, [
                  createBaseVNode("div", _hoisted_7, [
                    createBaseVNode("h3", _hoisted_8, [
                      _cache[0] || (_cache[0] = createBaseVNode("i", { class: "bi bi-cpu-fill me-2" }, null, -1)),
                      createVNode(LocaleText, { t: "CPU" })
                    ]),
                    createBaseVNode("h3", _hoisted_9, [
                      data.value ? (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(data.value.CPU.cpu_percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_11))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_12, [
                    createBaseVNode("div", {
                      class: "progress-bar",
                      style: normalizeStyle({ width: `${data.value?.CPU.cpu_percent}%` })
                    }, null, 4)
                  ]),
                  createBaseVNode("div", _hoisted_13, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(data.value?.CPU.cpu_percent_per_cpu, (cpu, count) => {
                      return openBlock(), createBlock(CpuCore, {
                        square: true,
                        key: count,
                        align: count + 1 > Math.round(data.value?.CPU.cpu_percent_per_cpu.length / 2),
                        core_number: count,
                        percentage: cpu
                      }, null, 8, ["align", "core_number", "percentage"]);
                    }), 128))
                  ])
                ]),
                createVNode(unref(Line), {
                  options: chartOption.value,
                  data: cpuHistoricalChartData.value,
                  style: { "width": "100%", "height": "200px", "max-height": "200px" }
                }, null, 8, ["options", "data"]),
                createBaseVNode("div", _hoisted_14, [
                  createBaseVNode("h5", _hoisted_15, [
                    createVNode(LocaleText, { t: "Processes" })
                  ]),
                  createBaseVNode("h6", _hoisted_16, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "CPU Usage" })
                    ])
                  ])
                ]),
                _cache[1] || (_cache[1] = createBaseVNode("hr", { class: "my-1" }, null, -1)),
                createBaseVNode("div", _hoisted_17, [
                  createVNode(TransitionGroup, { name: "process" }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(data.value?.Processes.cpu_top_10, (p) => {
                        return openBlock(), createBlock(Process, {
                          key: p.pid,
                          cpu: true,
                          process: p
                        }, null, 8, ["process"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ])
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_18, [
          createBaseVNode("div", _hoisted_19, [
            createBaseVNode("div", _hoisted_20, [
              createBaseVNode("div", _hoisted_21, [
                createBaseVNode("div", _hoisted_22, [
                  createBaseVNode("div", _hoisted_23, [
                    createBaseVNode("h3", _hoisted_24, [
                      _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-memory me-2" }, null, -1)),
                      createVNode(LocaleText, { t: "Memory" })
                    ]),
                    createBaseVNode("h3", _hoisted_25, [
                      data.value ? (openBlock(), createElementBlock("span", _hoisted_26, toDisplayString(data.value?.Memory.VirtualMemory.percent) + "% ", 1)) : (openBlock(), createElementBlock("span", _hoisted_27))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_28, [
                    createBaseVNode("div", {
                      class: "progress-bar bg-info",
                      style: normalizeStyle({ width: `${data.value?.Memory.VirtualMemory.percent}%` })
                    }, null, 4)
                  ]),
                  createBaseVNode("div", _hoisted_29, [
                    createBaseVNode("h6", _hoisted_30, [
                      createVNode(LocaleText, { t: "Swap Memory" })
                    ]),
                    createBaseVNode("h6", _hoisted_31, toDisplayString(data.value?.Memory.SwapMemory.percent) + "%", 1)
                  ]),
                  createBaseVNode("div", _hoisted_32, [
                    createBaseVNode("div", {
                      class: "progress-bar bg-info-subtle",
                      style: normalizeStyle({ width: `${data.value?.Memory.SwapMemory.percent}%` })
                    }, null, 4)
                  ])
                ]),
                createVNode(unref(Line), {
                  options: chartOption.value,
                  data: memoryHistoricalChartData.value,
                  style: { "width": "100%", "height": "200px", "max-height": "200px" }
                }, null, 8, ["options", "data"]),
                createBaseVNode("div", _hoisted_33, [
                  createBaseVNode("h5", _hoisted_34, [
                    createVNode(LocaleText, { t: "Processes" })
                  ]),
                  createBaseVNode("h6", _hoisted_35, [
                    createBaseVNode("small", null, [
                      createVNode(LocaleText, { t: "Memory Usage" })
                    ])
                  ])
                ]),
                _cache[3] || (_cache[3] = createBaseVNode("hr", { class: "my-1" }, null, -1)),
                createBaseVNode("div", _hoisted_36, [
                  createVNode(TransitionGroup, { name: "process" }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(data.value?.Processes.memory_top_10, (p) => {
                        return openBlock(), createBlock(Process, {
                          key: p.pid,
                          process: p
                        }, null, 8, ["process"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ])
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_37, [
          createBaseVNode("div", _hoisted_38, [
            createBaseVNode("div", _hoisted_39, [
              createBaseVNode("div", _hoisted_40, [
                createBaseVNode("h3", _hoisted_41, [
                  _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-ethernet me-2" }, null, -1)),
                  createVNode(LocaleText, { t: "Network" })
                ]),
                createBaseVNode("h3", _hoisted_42, [
                  data.value ? (openBlock(), createElementBlock("span", _hoisted_43, [
                    createVNode(LocaleText, {
                      t: Object.keys(data.value.NetworkInterfaces).length + " Interface" + (Object.keys(data.value.NetworkInterfaces).length > 1 ? "s" : "")
                    }, null, 8, ["t"])
                  ])) : (openBlock(), createElementBlock("span", _hoisted_44))
                ])
              ]),
              createBaseVNode("div", null, [
                data.value ? (openBlock(), createElementBlock("h5", _hoisted_45, [
                  createBaseVNode("span", _hoisted_46, [
                    _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-arrow-down" }, null, -1)),
                    createTextVNode(" " + toDisplayString(historicalNetworkSpeed.value.bytes_recv[historicalNetworkSpeed.value.bytes_recv.length - 1]) + " MB/s ", 1)
                  ]),
                  createBaseVNode("span", _hoisted_47, [
                    _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-arrow-up" }, null, -1)),
                    createTextVNode(" " + toDisplayString(historicalNetworkSpeed.value.bytes_sent[historicalNetworkSpeed.value.bytes_sent.length - 1]) + " MB/s ", 1)
                  ])
                ])) : createCommentVNode("", true)
              ]),
              createVNode(unref(Line), {
                options: networkSpeedChartOption.value,
                data: networkSpeedHistoricalChartData.value,
                style: { "width": "100%", "height": "300px", "max-height": "300px" }
              }, null, 8, ["options", "data"]),
              data.value ? (openBlock(), createElementBlock("div", _hoisted_48, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(data.value.NetworkInterfaces).sort(), (key) => {
                  return openBlock(), createElementBlock("div", _hoisted_49, [
                    createBaseVNode("div", _hoisted_50, [
                      createBaseVNode("h6", _hoisted_51, [
                        createBaseVNode("samp", null, toDisplayString(key), 1)
                      ]),
                      createBaseVNode("h6", _hoisted_52, [
                        createBaseVNode("span", _hoisted_53, [
                          _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-arrow-down" }, null, -1)),
                          createTextVNode(" " + toDisplayString(Math.round((data.value.NetworkInterfaces[key].bytes_recv / 1024e6 + Number.EPSILON) * 1e4) / 1e4) + " GB ", 1)
                        ]),
                        createBaseVNode("span", _hoisted_54, [
                          _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-arrow-up" }, null, -1)),
                          createTextVNode(" " + toDisplayString(Math.round((data.value.NetworkInterfaces[key].bytes_sent / 1024e6 + Number.EPSILON) * 1e4) / 1e4) + " GB ", 1)
                        ])
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_55, [
                      data.value.NetworkInterfaces[key].bytes_recv > 0 ? (openBlock(), createElementBlock("div", {
                        key: 0,
                        class: "progress-bar bg-info",
                        style: normalizeStyle({ width: `${data.value.NetworkInterfaces[key].bytes_recv / (data.value.NetworkInterfaces[key].bytes_sent + data.value.NetworkInterfaces[key].bytes_recv) * 100}%` })
                      }, null, 4)) : createCommentVNode("", true),
                      data.value.NetworkInterfaces[key].bytes_sent > 0 ? (openBlock(), createElementBlock("div", {
                        key: 1,
                        class: "progress-bar bg-warning",
                        style: normalizeStyle({ width: `${data.value.NetworkInterfaces[key].bytes_sent / (data.value.NetworkInterfaces[key].bytes_sent + data.value.NetworkInterfaces[key].bytes_recv) * 100}%` })
                      }, null, 4)) : createCommentVNode("", true)
                    ])
                  ]);
                }), 256))
              ])) : createCommentVNode("", true)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_56, [
          createBaseVNode("div", _hoisted_57, [
            createBaseVNode("div", _hoisted_58, [
              createBaseVNode("div", _hoisted_59, [
                createBaseVNode("h3", _hoisted_60, [
                  _cache[9] || (_cache[9] = createBaseVNode("i", { class: "bi bi-device-ssd-fill me-2" }, null, -1)),
                  createVNode(LocaleText, { t: "Storage" })
                ]),
                createBaseVNode("h3", _hoisted_61, [
                  data.value ? (openBlock(), createElementBlock("span", _hoisted_62, [
                    createVNode(LocaleText, {
                      t: data.value.Disks.length + " Partition" + (data.value.Disks.length > 1 ? "s" : "")
                    }, null, 8, ["t"])
                  ])) : (openBlock(), createElementBlock("span", _hoisted_63))
                ])
              ]),
              createBaseVNode("div", _hoisted_64, [
                data.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(data.value.Disks, (disk) => {
                  return openBlock(), createElementBlock("div", _hoisted_65, [
                    createBaseVNode("div", _hoisted_66, [
                      createBaseVNode("h6", _hoisted_67, [
                        createBaseVNode("samp", null, toDisplayString(disk.mountPoint), 1)
                      ]),
                      createBaseVNode("h6", _hoisted_68, [
                        createBaseVNode("span", _hoisted_69, [
                          createVNode(LocaleText, {
                            t: Math.round((disk.used / 1024e6 + Number.EPSILON) * 100) / 100 + " / " + Math.round((disk.total / 1024e6 + Number.EPSILON) * 100) / 100 + " GB Used"
                          }, null, 8, ["t"])
                        ])
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_70, [
                      createBaseVNode("div", {
                        class: "progress-bar bg-success",
                        style: normalizeStyle({ width: `${disk.percent}%` })
                      }, toDisplayString(disk.percent) + "% ", 5)
                    ])
                  ]);
                }), 256)) : createCommentVNode("", true)
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const systemStatus = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-977dc46d"]]);
export {
  systemStatus as default
};
