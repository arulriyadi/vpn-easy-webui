import { S as SchedulePeerJob } from "./schedulePeerJob-CTg28UTK.js";
import { _ as _export_sfc, W as WireguardConfigurationsStore, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, F as Fragment, h as renderList, t as toDisplayString, e as createCommentVNode, i as createBlock } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import "./vue-datepicker-CvNbCtAl.js";
import "./dayjs.min-CfinB9vE.js";
const _sfc_main = {
  name: "peerJobsAllModal",
  setup() {
    const store = WireguardConfigurationsStore();
    return { store };
  },
  components: { LocaleText, SchedulePeerJob },
  props: {
    configurationPeers: Array[Object]
  },
  computed: {
    getAllJobs() {
      return this.configurationPeers.filter((x) => x.jobs.length > 0);
    }
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "m-auto modal-dialog-centered dashboardModal" };
const _hoisted_4 = {
  class: "card rounded-3 shadow",
  style: { "width": "900px" }
};
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-2" };
const _hoisted_6 = { class: "mb-0 fw-normal" };
const _hoisted_7 = { class: "card-body px-4 pb-4 pt-2" };
const _hoisted_8 = {
  key: 0,
  class: "accordion",
  id: "peerJobsLogsModalAccordion"
};
const _hoisted_9 = { class: "accordion-header" };
const _hoisted_10 = ["data-bs-target"];
const _hoisted_11 = { key: 0 };
const _hoisted_12 = { class: "text-muted" };
const _hoisted_13 = ["id"];
const _hoisted_14 = { class: "accordion-body" };
const _hoisted_15 = {
  key: 1,
  class: "card shadow-sm",
  style: { "height": "153px" }
};
const _hoisted_16 = { class: "card-body text-muted text-center d-flex" };
const _hoisted_17 = { class: "m-auto" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_SchedulePeerJob = resolveComponent("SchedulePeerJob");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h4", _hoisted_6, [
              createVNode(_component_LocaleText, { t: "All Active Jobs" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("button", {
              class: "btn bg-primary-subtle border-1 border-primary-subtle text-primary-emphasis rounded-3 shadow mb-2",
              onClick: _cache[1] || (_cache[1] = ($event) => this.$emit("allLogs"))
            }, [
              _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-clock me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Logs" })
            ]),
            this.getAllJobs.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_8, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(this.getAllJobs, (p, index) => {
                return openBlock(), createElementBlock("div", {
                  class: "accordion-item",
                  key: p.id
                }, [
                  createBaseVNode("h2", _hoisted_9, [
                    createBaseVNode("button", {
                      class: "accordion-button collapsed",
                      type: "button",
                      "data-bs-toggle": "collapse",
                      "data-bs-target": "#collapse_" + index
                    }, [
                      createBaseVNode("small", null, [
                        createBaseVNode("strong", null, [
                          p.name ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(p.name) + " • ", 1)) : createCommentVNode("", true),
                          createBaseVNode("samp", _hoisted_12, toDisplayString(p.id), 1)
                        ])
                      ])
                    ], 8, _hoisted_10)
                  ]),
                  createBaseVNode("div", {
                    id: "collapse_" + index,
                    class: "accordion-collapse collapse",
                    "data-bs-parent": "#peerJobsLogsModalAccordion"
                  }, [
                    createBaseVNode("div", _hoisted_14, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(p.jobs, (job) => {
                        return openBlock(), createBlock(_component_SchedulePeerJob, {
                          onDelete: _cache[2] || (_cache[2] = ($event) => this.$emit("refresh")),
                          onRefresh: _cache[3] || (_cache[3] = ($event) => this.$emit("refresh")),
                          dropdowns: this.store.PeerScheduleJobs.dropdowns,
                          viewOnly: true,
                          key: job.JobID,
                          pjob: job
                        }, null, 8, ["dropdowns", "pjob"]);
                      }), 128))
                    ])
                  ], 8, _hoisted_13)
                ]);
              }), 128))
            ])) : (openBlock(), createElementBlock("div", _hoisted_15, [
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("span", _hoisted_17, [
                  createVNode(_component_LocaleText, { t: "No active job at the moment." })
                ])
              ])
            ]))
          ])
        ])
      ])
    ])
  ]);
}
const peerJobsAllModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  peerJobsAllModal as default
};
