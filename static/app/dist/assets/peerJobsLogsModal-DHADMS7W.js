import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { _ as _export_sfc, g as fetchGet, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, f as createTextVNode, t as toDisplayString, m as withDirectives, v as vModelCheckbox, e as createCommentVNode, F as Fragment, h as renderList, n as normalizeClass } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main = {
  name: "peerJobsLogsModal",
  components: { LocaleText },
  props: {
    configurationInfo: Object
  },
  data() {
    return {
      dataLoading: true,
      data: [],
      logFetchTime: void 0,
      showLogID: false,
      showJobID: true,
      showSuccessJob: true,
      showFailedJob: true,
      showLogAmount: 10
    };
  },
  async mounted() {
    await this.fetchLog();
  },
  methods: {
    async fetchLog() {
      this.dataLoading = true;
      await fetchGet(`/api/getPeerScheduleJobLogs/${this.configurationInfo.Name}`, {}, (res) => {
        this.data = res.data;
        this.logFetchTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        this.dataLoading = false;
      });
    }
  },
  computed: {
    getLogs() {
      return this.data.filter((x) => {
        return this.showSuccessJob && x.Status === "1" || this.showFailedJob && x.Status === "0";
      });
    },
    showLogs() {
      return this.getLogs.slice(0, this.showLogAmount);
    }
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2 = { class: "container-fluid d-flex h-100 w-100" };
const _hoisted_3 = {
  class: "m-auto mt-0 modal-dialog-centered dashboardModal",
  style: { "width": "100%" }
};
const _hoisted_4 = { class: "card rounded-3 shadow w-100" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_6 = { class: "mb-0" };
const _hoisted_7 = { class: "card-body px-4 pb-4 pt-2" };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { class: "mb-2 d-flex gap-3" };
const _hoisted_10 = { class: "d-flex gap-3 align-items-center" };
const _hoisted_11 = { class: "text-muted" };
const _hoisted_12 = { class: "form-check" };
const _hoisted_13 = {
  class: "form-check-label",
  for: "jobLogsShowSuccessCheck"
};
const _hoisted_14 = { class: "badge text-success-emphasis bg-success-subtle" };
const _hoisted_15 = { class: "form-check" };
const _hoisted_16 = {
  class: "form-check-label",
  for: "jobLogsShowFailedCheck"
};
const _hoisted_17 = { class: "badge text-danger-emphasis bg-danger-subtle" };
const _hoisted_18 = { class: "d-flex gap-3 align-items-center ms-auto" };
const _hoisted_19 = { class: "text-muted" };
const _hoisted_20 = { class: "form-check" };
const _hoisted_21 = {
  class: "form-check-label",
  for: "jobLogsShowJobIDCheck"
};
const _hoisted_22 = { class: "form-check" };
const _hoisted_23 = {
  class: "form-check-label",
  for: "jobLogsShowLogIDCheck"
};
const _hoisted_24 = { class: "table" };
const _hoisted_25 = { scope: "col" };
const _hoisted_26 = {
  key: 0,
  scope: "col"
};
const _hoisted_27 = {
  key: 1,
  scope: "col"
};
const _hoisted_28 = { scope: "col" };
const _hoisted_29 = { scope: "col" };
const _hoisted_30 = { style: { "font-size": "0.875rem" } };
const _hoisted_31 = { scope: "row" };
const _hoisted_32 = { key: 0 };
const _hoisted_33 = { class: "text-muted" };
const _hoisted_34 = { key: 1 };
const _hoisted_35 = { class: "text-muted" };
const _hoisted_36 = { class: "d-flex gap-2" };
const _hoisted_37 = {
  key: 1,
  class: "d-flex align-items-center flex-column"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h4", _hoisted_6, [
              createVNode(_component_LocaleText, { t: "Jobs Logs" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          createBaseVNode("div", _hoisted_7, [
            !this.dataLoading ? (openBlock(), createElementBlock("div", _hoisted_8, [
              createBaseVNode("p", null, [
                createVNode(_component_LocaleText, { t: "Updated at" }),
                createTextVNode(" : " + toDisplayString(this.logFetchTime), 1)
              ]),
              createBaseVNode("div", _hoisted_9, [
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => this.fetchLog()),
                  class: "btn btn-sm rounded-3 shadow-sm text-info-emphasis bg-info-subtle border-1 border-info-subtle me-1"
                }, [
                  _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-arrow-clockwise me-2" }, null, -1)),
                  createVNode(_component_LocaleText, { t: "Refresh" })
                ]),
                createBaseVNode("div", _hoisted_10, [
                  createBaseVNode("span", _hoisted_11, [
                    createVNode(_component_LocaleText, { t: "Filter" })
                  ]),
                  createBaseVNode("div", _hoisted_12, [
                    withDirectives(createBaseVNode("input", {
                      class: "form-check-input",
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.showSuccessJob = $event),
                      id: "jobLogsShowSuccessCheck"
                    }, null, 512), [
                      [vModelCheckbox, this.showSuccessJob]
                    ]),
                    createBaseVNode("label", _hoisted_13, [
                      createBaseVNode("span", _hoisted_14, [
                        createVNode(_component_LocaleText, { t: "Success" })
                      ])
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_15, [
                    withDirectives(createBaseVNode("input", {
                      class: "form-check-input",
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => this.showFailedJob = $event),
                      id: "jobLogsShowFailedCheck"
                    }, null, 512), [
                      [vModelCheckbox, this.showFailedJob]
                    ]),
                    createBaseVNode("label", _hoisted_16, [
                      createBaseVNode("span", _hoisted_17, [
                        createVNode(_component_LocaleText, { t: "Failed" })
                      ])
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_18, [
                  createBaseVNode("span", _hoisted_19, [
                    createVNode(_component_LocaleText, { t: "Display" })
                  ]),
                  createBaseVNode("div", _hoisted_20, [
                    withDirectives(createBaseVNode("input", {
                      class: "form-check-input",
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.showJobID = $event),
                      id: "jobLogsShowJobIDCheck"
                    }, null, 512), [
                      [vModelCheckbox, $data.showJobID]
                    ]),
                    createBaseVNode("label", _hoisted_21, [
                      createVNode(_component_LocaleText, { t: "Job ID" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_22, [
                    withDirectives(createBaseVNode("input", {
                      class: "form-check-input",
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.showLogID = $event),
                      id: "jobLogsShowLogIDCheck"
                    }, null, 512), [
                      [vModelCheckbox, $data.showLogID]
                    ]),
                    createBaseVNode("label", _hoisted_23, [
                      createVNode(_component_LocaleText, { t: "Log ID" })
                    ])
                  ])
                ])
              ]),
              createBaseVNode("table", _hoisted_24, [
                createBaseVNode("thead", null, [
                  createBaseVNode("tr", null, [
                    createBaseVNode("th", _hoisted_25, [
                      createVNode(_component_LocaleText, { t: "Date" })
                    ]),
                    $data.showLogID ? (openBlock(), createElementBlock("th", _hoisted_26, [
                      createVNode(_component_LocaleText, { t: "Log ID" })
                    ])) : createCommentVNode("", true),
                    $data.showJobID ? (openBlock(), createElementBlock("th", _hoisted_27, [
                      createVNode(_component_LocaleText, { t: "Job ID" })
                    ])) : createCommentVNode("", true),
                    createBaseVNode("th", _hoisted_28, [
                      createVNode(_component_LocaleText, { t: "Status" })
                    ]),
                    createBaseVNode("th", _hoisted_29, [
                      createVNode(_component_LocaleText, { t: "Message" })
                    ])
                  ])
                ]),
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(this.showLogs, (log) => {
                    return openBlock(), createElementBlock("tr", _hoisted_30, [
                      createBaseVNode("th", _hoisted_31, toDisplayString(log.LogDate), 1),
                      $data.showLogID ? (openBlock(), createElementBlock("td", _hoisted_32, [
                        createBaseVNode("samp", _hoisted_33, toDisplayString(log.LogID), 1)
                      ])) : createCommentVNode("", true),
                      $data.showJobID ? (openBlock(), createElementBlock("td", _hoisted_34, [
                        createBaseVNode("samp", _hoisted_35, toDisplayString(log.JobID), 1)
                      ])) : createCommentVNode("", true),
                      createBaseVNode("td", null, [
                        createBaseVNode("span", {
                          class: normalizeClass(["badge", [log.Status === "1" ? "text-success-emphasis bg-success-subtle" : "text-danger-emphasis bg-danger-subtle"]])
                        }, toDisplayString(log.Status === "1" ? "Success" : "Failed"), 3)
                      ]),
                      createBaseVNode("td", null, toDisplayString(log.Message), 1)
                    ]);
                  }), 256))
                ])
              ]),
              createBaseVNode("div", _hoisted_36, [
                this.getLogs.length > this.showLogAmount ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  onClick: _cache[6] || (_cache[6] = ($event) => this.showLogAmount += 20),
                  class: "btn btn-sm rounded-3 shadow-sm text-primary-emphasis bg-primary-subtle border-1 border-primary-subtle"
                }, _cache[9] || (_cache[9] = [
                  createBaseVNode("i", { class: "bi bi-chevron-down me-2" }, null, -1),
                  createTextVNode(" Show More ")
                ]))) : createCommentVNode("", true),
                this.showLogAmount > 20 ? (openBlock(), createElementBlock("button", {
                  key: 1,
                  onClick: _cache[7] || (_cache[7] = ($event) => this.showLogAmount = 20),
                  class: "btn btn-sm rounded-3 shadow-sm text-primary-emphasis bg-primary-subtle border-1 border-primary-subtle"
                }, _cache[10] || (_cache[10] = [
                  createBaseVNode("i", { class: "bi bi-chevron-up me-2" }, null, -1),
                  createTextVNode(" Collapse ")
                ]))) : createCommentVNode("", true)
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_37, _cache[11] || (_cache[11] = [
              createBaseVNode("div", {
                class: "spinner-border text-body",
                role: "status"
              }, [
                createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
              ], -1)
            ])))
          ])
        ])
      ])
    ])
  ]);
}
const peerJobsLogsModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  peerJobsLogsModal as default
};
