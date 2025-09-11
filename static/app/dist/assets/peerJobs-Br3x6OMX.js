import { S as SchedulePeerJob, a as ScheduleDropdown } from "./schedulePeerJob-CTg28UTK.js";
import { _ as _export_sfc, W as WireguardConfigurationsStore, z as v4, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, w as withCtx, F as Fragment, h as renderList, i as createBlock, e as createCommentVNode, T as TransitionGroup } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import "./vue-datepicker-CvNbCtAl.js";
import "./dayjs.min-CfinB9vE.js";
const _sfc_main = {
  name: "peerJobs",
  setup() {
    const store = WireguardConfigurationsStore();
    return { store };
  },
  props: {
    selectedPeer: Object
  },
  components: {
    LocaleText,
    SchedulePeerJob,
    ScheduleDropdown
  },
  data() {
    return {};
  },
  methods: {
    deleteJob(j) {
      this.selectedPeer.jobs = this.selectedPeer.jobs.filter((x) => x.JobID !== j.JobID);
    },
    addJob() {
      this.selectedPeer.jobs.unshift(
        JSON.parse(JSON.stringify({
          JobID: v4().toString(),
          Configuration: this.selectedPeer.configuration.Name,
          Peer: this.selectedPeer.id,
          Field: this.store.PeerScheduleJobs.dropdowns.Field[0].value,
          Operator: this.store.PeerScheduleJobs.dropdowns.Operator[0].value,
          Value: "",
          CreationDate: "",
          ExpireDate: "",
          Action: this.store.PeerScheduleJobs.dropdowns.Action[0].value
        }))
      );
    }
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "m-auto modal-dialog-centered dashboardModal" };
const _hoisted_4 = {
  class: "card rounded-3 shadow",
  style: { "width": "700px" }
};
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-2" };
const _hoisted_6 = { class: "mb-0 fw-normal" };
const _hoisted_7 = { class: "card-body px-4 pb-4 pt-2 position-relative" };
const _hoisted_8 = { class: "d-flex align-items-center mb-3" };
const _hoisted_9 = {
  class: "card shadow-sm",
  key: "none",
  style: { "height": "153px" }
};
const _hoisted_10 = { class: "card-body text-muted text-center d-flex" };
const _hoisted_11 = { class: "m-auto" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_SchedulePeerJob = resolveComponent("SchedulePeerJob");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h4", _hoisted_6, [
              createVNode(_component_LocaleText, { t: "Schedule Jobs" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("button", {
                class: "btn bg-primary-subtle border-1 border-primary-subtle text-primary-emphasis rounded-3 shadow",
                onClick: _cache[1] || (_cache[1] = ($event) => this.addJob())
              }, [
                _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-plus-lg me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Job" })
              ])
            ]),
            createVNode(TransitionGroup, {
              name: "schedulePeerJobTransition",
              tag: "div",
              class: "position-relative"
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(this.selectedPeer.jobs, (job, index) => {
                  return openBlock(), createBlock(_component_SchedulePeerJob, {
                    onRefresh: _cache[2] || (_cache[2] = ($event) => this.$emit("refresh")),
                    onDelete: ($event) => this.deleteJob(job),
                    dropdowns: this.store.PeerScheduleJobs.dropdowns,
                    key: job.JobID,
                    pjob: job
                  }, null, 8, ["onDelete", "dropdowns", "pjob"]);
                }), 128)),
                this.selectedPeer.jobs.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_9, [
                  createBaseVNode("div", _hoisted_10, [
                    createBaseVNode("h6", _hoisted_11, [
                      createVNode(_component_LocaleText, { t: "This peer does not have any job yet." })
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ])
        ])
      ])
    ])
  ]);
}
const peerJobs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bbdd42b"]]);
export {
  peerJobs as default
};
