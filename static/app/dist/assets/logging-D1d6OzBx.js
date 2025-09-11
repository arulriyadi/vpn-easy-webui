import { _ as _export_sfc, r as ref, q as computed, o as onMounted, c as createElementBlock, b as createBaseVNode, f as createTextVNode, t as toDisplayString, m as withDirectives, B as vModelSelect, L as createStaticVNode, y as vModelText, F as Fragment, h as renderList, e as createCommentVNode, n as normalizeClass, g as fetchGet, A as fetchPost, a as openBlock } from "./index-xvqfLBaG.js";
const _hoisted_1 = { class: "container-fluid" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-12" };
const _hoisted_4 = { class: "d-flex justify-content-between align-items-center mb-4" };
const _hoisted_5 = { class: "row mb-4" };
const _hoisted_6 = { class: "col-md-3 mb-3" };
const _hoisted_7 = { class: "card bg-primary text-white" };
const _hoisted_8 = { class: "card-body" };
const _hoisted_9 = { class: "d-flex justify-content-between" };
const _hoisted_10 = { class: "mb-0" };
const _hoisted_11 = { class: "col-md-3 mb-3" };
const _hoisted_12 = { class: "card bg-success text-white" };
const _hoisted_13 = { class: "card-body" };
const _hoisted_14 = { class: "d-flex justify-content-between" };
const _hoisted_15 = { class: "mb-0" };
const _hoisted_16 = { class: "col-md-3 mb-3" };
const _hoisted_17 = { class: "card bg-info text-white" };
const _hoisted_18 = { class: "card-body" };
const _hoisted_19 = { class: "d-flex justify-content-between" };
const _hoisted_20 = { class: "mb-0" };
const _hoisted_21 = { class: "col-md-3 mb-3" };
const _hoisted_22 = { class: "card bg-warning text-white" };
const _hoisted_23 = { class: "card-body" };
const _hoisted_24 = { class: "d-flex justify-content-between" };
const _hoisted_25 = { class: "mb-0" };
const _hoisted_26 = { class: "card mb-4" };
const _hoisted_27 = { class: "card-body" };
const _hoisted_28 = { class: "row" };
const _hoisted_29 = { class: "col-md-3 mb-3" };
const _hoisted_30 = { class: "col-md-3 mb-3" };
const _hoisted_31 = { class: "col-md-3 mb-3" };
const _hoisted_32 = { class: "col-md-3 mb-3" };
const _hoisted_33 = { class: "card" };
const _hoisted_34 = { class: "card-body" };
const _hoisted_35 = {
  key: 0,
  class: "text-center py-4"
};
const _hoisted_36 = {
  key: 1,
  class: "text-center py-4 text-muted"
};
const _hoisted_37 = {
  key: 2,
  class: "table-responsive"
};
const _hoisted_38 = { class: "table table-striped table-hover" };
const _hoisted_39 = { class: "badge bg-secondary" };
const _hoisted_40 = { class: "log-message" };
const _hoisted_41 = ["onClick"];
const _hoisted_42 = {
  key: 3,
  class: "d-flex justify-content-between align-items-center mt-3"
};
const _hoisted_43 = ["disabled"];
const _hoisted_44 = { class: "mx-3" };
const _hoisted_45 = ["disabled"];
const _hoisted_46 = { class: "card mt-4" };
const _hoisted_47 = { class: "card-body" };
const _hoisted_48 = { class: "row mb-3" };
const _hoisted_49 = { class: "col-md-6" };
const _hoisted_50 = { class: "col-md-6" };
const _hoisted_51 = {
  key: 0,
  class: "text-center py-4"
};
const _hoisted_52 = {
  key: 1,
  class: "system-logs"
};
const _hoisted_53 = {
  class: "bg-dark text-light p-3 rounded",
  style: { "max-height": "400px", "overflow-y": "auto" }
};
const _hoisted_54 = {
  key: 0,
  class: "modal show d-block",
  tabindex: "-1",
  style: { "background-color": "rgba(0,0,0,0.5)" }
};
const _hoisted_55 = { class: "modal-dialog" };
const _hoisted_56 = { class: "modal-content" };
const _hoisted_57 = { class: "modal-header" };
const _hoisted_58 = { class: "modal-body" };
const _hoisted_59 = { class: "mb-3" };
const _hoisted_60 = { class: "mb-3" };
const _hoisted_61 = { class: "modal-footer" };
const _hoisted_62 = ["disabled"];
const _hoisted_63 = {
  key: 0,
  class: "spinner-border spinner-border-sm me-1"
};
const _hoisted_64 = {
  key: 1,
  class: "modal show d-block",
  tabindex: "-1",
  style: { "background-color": "rgba(0,0,0,0.5)" }
};
const _hoisted_65 = { class: "modal-dialog modal-lg" };
const _hoisted_66 = { class: "modal-content" };
const _hoisted_67 = { class: "modal-header" };
const _hoisted_68 = { class: "modal-body" };
const _hoisted_69 = { class: "bg-light p-3 rounded" };
const _hoisted_70 = { class: "modal-footer" };
const _hoisted_71 = { class: "toast-container position-fixed bottom-0 end-0 p-3" };
const _hoisted_72 = {
  key: 0,
  class: "toast show",
  role: "alert"
};
const _hoisted_73 = { class: "toast-header" };
const _hoisted_74 = { class: "ms-2" };
const _hoisted_75 = { class: "toast-body" };
const _sfc_main = {
  __name: "logging",
  setup(__props) {
    const loading = ref(true);
    const systemLogsLoading = ref(false);
    const clearingLogs = ref(false);
    const showClearModal = ref(false);
    const showDetailsModal = ref(false);
    const logs = ref([]);
    const systemLogs = ref([]);
    const statistics = ref({});
    const selectedSystemLog = ref("system");
    const systemLogLines = ref(100);
    const selectedLogDetails = ref({});
    const filters = ref({
      category: "",
      level: "",
      start_date: "",
      end_date: ""
    });
    const currentPage = ref(1);
    const pageSize = ref(50);
    const offset = computed(() => (currentPage.value - 1) * pageSize.value);
    const clearOptions = ref({
      category: "",
      days: ""
    });
    const toast = ref({
      show: false,
      type: "success",
      message: ""
    });
    const loadLogs = async () => {
      try {
        loading.value = true;
        const params = new URLSearchParams({
          limit: pageSize.value,
          offset: offset.value
        });
        if (filters.value.category) params.append("category", filters.value.category);
        if (filters.value.level) params.append("level", filters.value.level);
        if (filters.value.start_date) params.append("start_date", filters.value.start_date);
        if (filters.value.end_date) params.append("end_date", filters.value.end_date);
        const response = await fetchGet(`/api/logs?${params}`);
        if (response.status) {
          logs.value = response.data || [];
        } else {
          showToast("error", "Failed to load logs");
        }
      } catch (error) {
        showToast("error", "Error loading logs: " + error.message);
      } finally {
        loading.value = false;
      }
    };
    const loadStatistics = async () => {
      try {
        const response = await fetchGet("/api/logs/statistics");
        if (response.status) {
          statistics.value = response.data || {};
        }
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    };
    const loadSystemLogs = async () => {
      try {
        systemLogsLoading.value = true;
        const response = await fetchGet(`/api/logs/system/${selectedSystemLog.value}?lines=${systemLogLines.value}`);
        if (response.status) {
          systemLogs.value = response.data || [];
        } else {
          showToast("error", "Failed to load system logs");
        }
      } catch (error) {
        showToast("error", "Error loading system logs: " + error.message);
      } finally {
        systemLogsLoading.value = false;
      }
    };
    const applyFilters = () => {
      currentPage.value = 1;
      loadLogs();
    };
    const loadPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        loadLogs();
      }
    };
    const loadNextPage = () => {
      currentPage.value++;
      loadLogs();
    };
    const changePageSize = () => {
      currentPage.value = 1;
      loadLogs();
    };
    const refreshLogs = () => {
      loadLogs();
      loadStatistics();
    };
    const clearLogs = async () => {
      try {
        clearingLogs.value = true;
        const data = {};
        if (clearOptions.value.category) data.category = clearOptions.value.category;
        if (clearOptions.value.days) data.days = parseInt(clearOptions.value.days);
        const response = await fetchPost("/api/logs/clear", data);
        if (response.status) {
          showToast("success", response.message);
          showClearModal.value = false;
          refreshLogs();
        } else {
          showToast("error", response.message || "Failed to clear logs");
        }
      } catch (error) {
        showToast("error", "Error clearing logs: " + error.message);
      } finally {
        clearingLogs.value = false;
      }
    };
    const exportLogs = async () => {
      try {
        const params = new URLSearchParams({ format: "json" });
        if (filters.value.category) params.append("category", filters.value.category);
        if (filters.value.start_date) params.append("start_date", filters.value.start_date);
        if (filters.value.end_date) params.append("end_date", filters.value.end_date);
        const response = await fetchGet(`/api/logs/export?${params}`);
        if (response.status) {
          const dataStr = JSON.stringify(response.data.data, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
          showToast("success", "Logs exported successfully");
        } else {
          showToast("error", "Failed to export logs");
        }
      } catch (error) {
        showToast("error", "Error exporting logs: " + error.message);
      }
    };
    const showDetails = (log) => {
      selectedLogDetails.value = log;
      showDetailsModal.value = true;
    };
    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleString();
    };
    const getLevelBadgeClass = (level) => {
      switch (level) {
        case "error":
          return "bg-danger";
        case "warning":
          return "bg-warning";
        case "info":
          return "bg-info";
        case "debug":
          return "bg-secondary";
        default:
          return "bg-secondary";
      }
    };
    const showToast = (type, message) => {
      toast.value = {
        show: true,
        type,
        message
      };
      setTimeout(() => {
        toast.value.show = false;
      }, 5e3);
    };
    onMounted(() => {
      loadLogs();
      loadStatistics();
      loadSystemLogs();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              _cache[18] || (_cache[18] = createBaseVNode("h2", { class: "mb-0" }, [
                createBaseVNode("i", { class: "bi bi-journal-text me-2" }),
                createTextVNode(" Logging Management ")
              ], -1)),
              createBaseVNode("div", null, [
                createBaseVNode("button", {
                  class: "btn btn-success me-2",
                  onClick: exportLogs
                }, _cache[15] || (_cache[15] = [
                  createBaseVNode("i", { class: "bi bi-download me-1" }, null, -1),
                  createTextVNode(" Export Logs ")
                ])),
                createBaseVNode("button", {
                  class: "btn btn-warning me-2",
                  onClick: _cache[0] || (_cache[0] = ($event) => showClearModal.value = true)
                }, _cache[16] || (_cache[16] = [
                  createBaseVNode("i", { class: "bi bi-trash me-1" }, null, -1),
                  createTextVNode(" Clear Logs ")
                ])),
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: refreshLogs
                }, _cache[17] || (_cache[17] = [
                  createBaseVNode("i", { class: "bi bi-arrow-clockwise me-1" }, null, -1),
                  createTextVNode(" Refresh ")
                ]))
              ])
            ]),
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("div", _hoisted_6, [
                createBaseVNode("div", _hoisted_7, [
                  createBaseVNode("div", _hoisted_8, [
                    createBaseVNode("div", _hoisted_9, [
                      createBaseVNode("div", null, [
                        createBaseVNode("h4", _hoisted_10, toDisplayString(statistics.value.total_logs || 0), 1),
                        _cache[19] || (_cache[19] = createBaseVNode("p", { class: "mb-0" }, "Total Logs", -1))
                      ]),
                      _cache[20] || (_cache[20] = createBaseVNode("div", { class: "align-self-center" }, [
                        createBaseVNode("i", { class: "bi bi-journal-text fs-1" })
                      ], -1))
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_11, [
                createBaseVNode("div", _hoisted_12, [
                  createBaseVNode("div", _hoisted_13, [
                    createBaseVNode("div", _hoisted_14, [
                      createBaseVNode("div", null, [
                        createBaseVNode("h4", _hoisted_15, toDisplayString(statistics.value.recent_activity || 0), 1),
                        _cache[21] || (_cache[21] = createBaseVNode("p", { class: "mb-0" }, "Last 24h", -1))
                      ]),
                      _cache[22] || (_cache[22] = createBaseVNode("div", { class: "align-self-center" }, [
                        createBaseVNode("i", { class: "bi bi-clock-history fs-1" })
                      ], -1))
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("div", _hoisted_17, [
                  createBaseVNode("div", _hoisted_18, [
                    createBaseVNode("div", _hoisted_19, [
                      createBaseVNode("div", null, [
                        createBaseVNode("h4", _hoisted_20, toDisplayString(Object.keys(statistics.value.by_category || {}).length), 1),
                        _cache[23] || (_cache[23] = createBaseVNode("p", { class: "mb-0" }, "Categories", -1))
                      ]),
                      _cache[24] || (_cache[24] = createBaseVNode("div", { class: "align-self-center" }, [
                        createBaseVNode("i", { class: "bi bi-tags fs-1" })
                      ], -1))
                    ])
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_21, [
                createBaseVNode("div", _hoisted_22, [
                  createBaseVNode("div", _hoisted_23, [
                    createBaseVNode("div", _hoisted_24, [
                      createBaseVNode("div", null, [
                        createBaseVNode("h4", _hoisted_25, toDisplayString(Object.keys(statistics.value.by_level || {}).length), 1),
                        _cache[25] || (_cache[25] = createBaseVNode("p", { class: "mb-0" }, "Log Levels", -1))
                      ]),
                      _cache[26] || (_cache[26] = createBaseVNode("div", { class: "align-self-center" }, [
                        createBaseVNode("i", { class: "bi bi-bar-chart fs-1" })
                      ], -1))
                    ])
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_26, [
              _cache[33] || (_cache[33] = createBaseVNode("div", { class: "card-header" }, [
                createBaseVNode("h5", { class: "mb-0" }, [
                  createBaseVNode("i", { class: "bi bi-funnel me-2" }),
                  createTextVNode(" Filters ")
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_27, [
                createBaseVNode("div", _hoisted_28, [
                  createBaseVNode("div", _hoisted_29, [
                    _cache[28] || (_cache[28] = createBaseVNode("label", {
                      for: "categoryFilter",
                      class: "form-label"
                    }, "Category", -1)),
                    withDirectives(createBaseVNode("select", {
                      id: "categoryFilter",
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filters.value.category = $event),
                      class: "form-select",
                      onChange: applyFilters
                    }, _cache[27] || (_cache[27] = [
                      createStaticVNode('<option value="" data-v-c57d580a>All Categories</option><option value="firewall" data-v-c57d580a>Firewall</option><option value="routing" data-v-c57d580a>Routing</option><option value="system" data-v-c57d580a>System</option><option value="wireguard" data-v-c57d580a>WireGuard</option>', 5)
                    ]), 544), [
                      [vModelSelect, filters.value.category]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_30, [
                    _cache[30] || (_cache[30] = createBaseVNode("label", {
                      for: "levelFilter",
                      class: "form-label"
                    }, "Level", -1)),
                    withDirectives(createBaseVNode("select", {
                      id: "levelFilter",
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filters.value.level = $event),
                      class: "form-select",
                      onChange: applyFilters
                    }, _cache[29] || (_cache[29] = [
                      createStaticVNode('<option value="" data-v-c57d580a>All Levels</option><option value="info" data-v-c57d580a>Info</option><option value="warning" data-v-c57d580a>Warning</option><option value="error" data-v-c57d580a>Error</option><option value="debug" data-v-c57d580a>Debug</option>', 5)
                    ]), 544), [
                      [vModelSelect, filters.value.level]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_31, [
                    _cache[31] || (_cache[31] = createBaseVNode("label", {
                      for: "startDate",
                      class: "form-label"
                    }, "Start Date", -1)),
                    withDirectives(createBaseVNode("input", {
                      type: "datetime-local",
                      id: "startDate",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filters.value.start_date = $event),
                      class: "form-control",
                      onChange: applyFilters
                    }, null, 544), [
                      [vModelText, filters.value.start_date]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_32, [
                    _cache[32] || (_cache[32] = createBaseVNode("label", {
                      for: "endDate",
                      class: "form-label"
                    }, "End Date", -1)),
                    withDirectives(createBaseVNode("input", {
                      type: "datetime-local",
                      id: "endDate",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => filters.value.end_date = $event),
                      class: "form-control",
                      onChange: applyFilters
                    }, null, 544), [
                      [vModelText, filters.value.end_date]
                    ])
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_33, [
              _cache[41] || (_cache[41] = createBaseVNode("div", { class: "card-header" }, [
                createBaseVNode("h5", { class: "mb-0" }, [
                  createBaseVNode("i", { class: "bi bi-list-ul me-2" }),
                  createTextVNode(" Activity Logs ")
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_34, [
                loading.value ? (openBlock(), createElementBlock("div", _hoisted_35, _cache[34] || (_cache[34] = [
                  createBaseVNode("div", {
                    class: "spinner-border text-primary",
                    role: "status"
                  }, [
                    createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
                  ], -1)
                ]))) : logs.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_36, _cache[35] || (_cache[35] = [
                  createBaseVNode("i", { class: "bi bi-journal-x fs-1" }, null, -1),
                  createBaseVNode("p", { class: "mt-2" }, "No logs found", -1)
                ]))) : (openBlock(), createElementBlock("div", _hoisted_37, [
                  createBaseVNode("table", _hoisted_38, [
                    _cache[37] || (_cache[37] = createBaseVNode("thead", { class: "table-dark" }, [
                      createBaseVNode("tr", null, [
                        createBaseVNode("th", null, "Timestamp"),
                        createBaseVNode("th", null, "Level"),
                        createBaseVNode("th", null, "Category"),
                        createBaseVNode("th", null, "Message"),
                        createBaseVNode("th", null, "User"),
                        createBaseVNode("th", null, "IP Address"),
                        createBaseVNode("th", null, "Actions")
                      ])
                    ], -1)),
                    createBaseVNode("tbody", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(logs.value, (log) => {
                        return openBlock(), createElementBlock("tr", {
                          key: log.id
                        }, [
                          createBaseVNode("td", null, [
                            createBaseVNode("small", null, toDisplayString(formatTimestamp(log.timestamp)), 1)
                          ]),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", {
                              class: normalizeClass(["badge", getLevelBadgeClass(log.level)])
                            }, toDisplayString(log.level.toUpperCase()), 3)
                          ]),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", _hoisted_39, toDisplayString(log.category), 1)
                          ]),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", _hoisted_40, toDisplayString(log.message), 1)
                          ]),
                          createBaseVNode("td", null, toDisplayString(log.user || "N/A"), 1),
                          createBaseVNode("td", null, toDisplayString(log.ip_address || "N/A"), 1),
                          createBaseVNode("td", null, [
                            log.details ? (openBlock(), createElementBlock("button", {
                              key: 0,
                              class: "btn btn-sm btn-outline-info",
                              onClick: ($event) => showDetails(log)
                            }, _cache[36] || (_cache[36] = [
                              createBaseVNode("i", { class: "bi bi-eye" }, null, -1)
                            ]), 8, _hoisted_41)) : createCommentVNode("", true)
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ])),
                logs.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_42, [
                  createBaseVNode("div", null, [
                    createBaseVNode("button", {
                      class: "btn btn-outline-primary",
                      onClick: loadPreviousPage,
                      disabled: currentPage.value === 1
                    }, _cache[38] || (_cache[38] = [
                      createBaseVNode("i", { class: "bi bi-chevron-left" }, null, -1),
                      createTextVNode(" Previous ")
                    ]), 8, _hoisted_43),
                    createBaseVNode("span", _hoisted_44, "Page " + toDisplayString(currentPage.value), 1),
                    createBaseVNode("button", {
                      class: "btn btn-outline-primary",
                      onClick: loadNextPage,
                      disabled: logs.value.length < pageSize.value
                    }, _cache[39] || (_cache[39] = [
                      createTextVNode(" Next "),
                      createBaseVNode("i", { class: "bi bi-chevron-right" }, null, -1)
                    ]), 8, _hoisted_45)
                  ]),
                  createBaseVNode("div", null, [
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => pageSize.value = $event),
                      onChange: changePageSize,
                      class: "form-select d-inline-block w-auto"
                    }, _cache[40] || (_cache[40] = [
                      createBaseVNode("option", { value: "25" }, "25 per page", -1),
                      createBaseVNode("option", { value: "50" }, "50 per page", -1),
                      createBaseVNode("option", { value: "100" }, "100 per page", -1)
                    ]), 544), [
                      [vModelSelect, pageSize.value]
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])
            ]),
            createBaseVNode("div", _hoisted_46, [
              _cache[45] || (_cache[45] = createBaseVNode("div", { class: "card-header" }, [
                createBaseVNode("h5", { class: "mb-0" }, [
                  createBaseVNode("i", { class: "bi bi-terminal me-2" }),
                  createTextVNode(" System Logs ")
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_47, [
                createBaseVNode("div", _hoisted_48, [
                  createBaseVNode("div", _hoisted_49, [
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => selectedSystemLog.value = $event),
                      onChange: loadSystemLogs,
                      class: "form-select"
                    }, _cache[42] || (_cache[42] = [
                      createStaticVNode('<option value="system" data-v-c57d580a>System Log</option><option value="auth" data-v-c57d580a>Auth Log</option><option value="kern" data-v-c57d580a>Kernel Log</option><option value="wireguard" data-v-c57d580a>WireGuard Log</option><option value="firewall" data-v-c57d580a>Firewall Log</option><option value="routing" data-v-c57d580a>Routing Log</option>', 6)
                    ]), 544), [
                      [vModelSelect, selectedSystemLog.value]
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_50, [
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => systemLogLines.value = $event),
                      onChange: loadSystemLogs,
                      class: "form-select"
                    }, _cache[43] || (_cache[43] = [
                      createBaseVNode("option", { value: "50" }, "Last 50 lines", -1),
                      createBaseVNode("option", { value: "100" }, "Last 100 lines", -1),
                      createBaseVNode("option", { value: "200" }, "Last 200 lines", -1),
                      createBaseVNode("option", { value: "500" }, "Last 500 lines", -1)
                    ]), 544), [
                      [vModelSelect, systemLogLines.value]
                    ])
                  ])
                ]),
                systemLogsLoading.value ? (openBlock(), createElementBlock("div", _hoisted_51, _cache[44] || (_cache[44] = [
                  createBaseVNode("div", {
                    class: "spinner-border text-primary",
                    role: "status"
                  }, [
                    createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
                  ], -1)
                ]))) : (openBlock(), createElementBlock("div", _hoisted_52, [
                  createBaseVNode("pre", _hoisted_53, toDisplayString(systemLogs.value.join("\n")), 1)
                ]))
              ])
            ])
          ])
        ]),
        showClearModal.value ? (openBlock(), createElementBlock("div", _hoisted_54, [
          createBaseVNode("div", _hoisted_55, [
            createBaseVNode("div", _hoisted_56, [
              createBaseVNode("div", _hoisted_57, [
                _cache[46] || (_cache[46] = createBaseVNode("h5", { class: "modal-title" }, [
                  createBaseVNode("i", { class: "bi bi-trash me-2" }),
                  createTextVNode(" Clear Logs ")
                ], -1)),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close",
                  onClick: _cache[8] || (_cache[8] = ($event) => showClearModal.value = false)
                })
              ]),
              createBaseVNode("div", _hoisted_58, [
                createBaseVNode("div", _hoisted_59, [
                  _cache[48] || (_cache[48] = createBaseVNode("label", {
                    for: "clearCategory",
                    class: "form-label"
                  }, "Category", -1)),
                  withDirectives(createBaseVNode("select", {
                    id: "clearCategory",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => clearOptions.value.category = $event),
                    class: "form-select"
                  }, _cache[47] || (_cache[47] = [
                    createStaticVNode('<option value="" data-v-c57d580a>All Categories</option><option value="firewall" data-v-c57d580a>Firewall</option><option value="routing" data-v-c57d580a>Routing</option><option value="system" data-v-c57d580a>System</option><option value="wireguard" data-v-c57d580a>WireGuard</option>', 5)
                  ]), 512), [
                    [vModelSelect, clearOptions.value.category]
                  ])
                ]),
                createBaseVNode("div", _hoisted_60, [
                  _cache[49] || (_cache[49] = createBaseVNode("label", {
                    for: "clearDays",
                    class: "form-label"
                  }, "Clear logs older than (days)", -1)),
                  withDirectives(createBaseVNode("input", {
                    type: "number",
                    id: "clearDays",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => clearOptions.value.days = $event),
                    class: "form-control",
                    placeholder: "Leave empty to clear all"
                  }, null, 512), [
                    [vModelText, clearOptions.value.days]
                  ])
                ]),
                _cache[50] || (_cache[50] = createBaseVNode("div", { class: "alert alert-warning" }, [
                  createBaseVNode("i", { class: "bi bi-exclamation-triangle me-2" }),
                  createTextVNode(" This action cannot be undone! ")
                ], -1))
              ]),
              createBaseVNode("div", _hoisted_61, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  onClick: _cache[11] || (_cache[11] = ($event) => showClearModal.value = false)
                }, "Cancel"),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-danger",
                  onClick: clearLogs,
                  disabled: clearingLogs.value
                }, [
                  clearingLogs.value ? (openBlock(), createElementBlock("span", _hoisted_63)) : createCommentVNode("", true),
                  _cache[51] || (_cache[51] = createTextVNode(" Clear Logs "))
                ], 8, _hoisted_62)
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        showDetailsModal.value ? (openBlock(), createElementBlock("div", _hoisted_64, [
          createBaseVNode("div", _hoisted_65, [
            createBaseVNode("div", _hoisted_66, [
              createBaseVNode("div", _hoisted_67, [
                _cache[52] || (_cache[52] = createBaseVNode("h5", { class: "modal-title" }, [
                  createBaseVNode("i", { class: "bi bi-eye me-2" }),
                  createTextVNode(" Log Details ")
                ], -1)),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close",
                  onClick: _cache[12] || (_cache[12] = ($event) => showDetailsModal.value = false)
                })
              ]),
              createBaseVNode("div", _hoisted_68, [
                createBaseVNode("pre", _hoisted_69, toDisplayString(JSON.stringify(selectedLogDetails.value, null, 2)), 1)
              ]),
              createBaseVNode("div", _hoisted_70, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  onClick: _cache[13] || (_cache[13] = ($event) => showDetailsModal.value = false)
                }, "Close")
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_71, [
          toast.value.show ? (openBlock(), createElementBlock("div", _hoisted_72, [
            createBaseVNode("div", _hoisted_73, [
              createBaseVNode("i", {
                class: normalizeClass(toast.value.type === "success" ? "bi bi-check-circle-fill text-success" : "bi bi-exclamation-triangle-fill text-danger")
              }, null, 2),
              createBaseVNode("strong", _hoisted_74, toDisplayString(toast.value.type === "success" ? "Success" : "Error"), 1),
              createBaseVNode("button", {
                type: "button",
                class: "btn-close ms-auto",
                onClick: _cache[14] || (_cache[14] = ($event) => toast.value.show = false)
              })
            ]),
            createBaseVNode("div", _hoisted_75, toDisplayString(toast.value.message), 1)
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const logging = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c57d580a"]]);
export {
  logging as default
};
