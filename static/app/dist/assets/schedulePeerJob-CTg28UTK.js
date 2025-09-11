import { _ as _export_sfc, a as openBlock, c as createElementBlock, b as createBaseVNode, t as toDisplayString, n as normalizeClass, F as Fragment, h as renderList, e as createCommentVNode, r as ref, D as DashboardConfigurationStore, A as fetchPost, k as resolveComponent, d as createVNode, i as createBlock, m as withDirectives, y as vModelText, f as createTextVNode } from "./index-xvqfLBaG.js";
import { V as Vn } from "./vue-datepicker-CvNbCtAl.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main$1 = {
  name: "scheduleDropdown",
  props: {
    options: Array,
    data: String,
    edit: false
  },
  setup(props) {
    if (props.data === void 0) {
      this.$emit("update", this.options[0].value);
    }
  },
  computed: {
    currentSelection() {
      return this.options.find((x) => x.value === this.data);
    }
  }
};
const _hoisted_1$1 = { class: "dropdown scheduleDropdown" };
const _hoisted_2$1 = {
  class: "dropdown-menu rounded-3 shadow",
  style: { "font-size": "0.875rem", "width": "200px" }
};
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = {
  key: 0,
  class: "bi bi-check ms-auto"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode("button", {
      class: normalizeClass(["btn btn-sm btn-outline-primary rounded-3", { "disabled border-transparent": !$props.edit }]),
      type: "button",
      "data-bs-toggle": "dropdown",
      "aria-expanded": "false"
    }, [
      createBaseVNode("samp", null, toDisplayString(this.currentSelection.display), 1)
    ], 2),
    createBaseVNode("ul", _hoisted_2$1, [
      $props.edit ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(this.options, (x) => {
        return openBlock(), createElementBlock("li", null, [
          createBaseVNode("a", {
            class: "dropdown-item d-flex align-items-center",
            role: "button",
            onClick: ($event) => _ctx.$emit("update", x.value)
          }, [
            createBaseVNode("samp", null, toDisplayString(x.display), 1),
            x.value === this.currentSelection.value ? (openBlock(), createElementBlock("i", _hoisted_4$1)) : createCommentVNode("", true)
          ], 8, _hoisted_3$1)
        ]);
      }), 256)) : createCommentVNode("", true)
    ])
  ]);
}
const ScheduleDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-6a5aba2a"]]);
const _sfc_main = {
  name: "schedulePeerJob",
  components: { LocaleText, VueDatePicker: Vn, ScheduleDropdown },
  props: {
    dropdowns: Array[Object],
    pjob: Object,
    viewOnly: false
  },
  setup(props) {
    const job = ref({});
    const edit = ref(false);
    const newJob = ref(false);
    job.value = JSON.parse(JSON.stringify(props.pjob));
    if (!job.value.CreationDate) {
      edit.value = true;
      newJob.value = true;
    }
    const store = DashboardConfigurationStore();
    return { job, edit, newJob, store };
  },
  data() {
    return {
      inputType: void 0
    };
  },
  watch: {
    pjob: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (!this.edit) {
          this.job = JSON.parse(JSON.stringify(newValue));
        }
      }
    }
  },
  methods: {
    save() {
      if (this.job.Field && this.job.Operator && this.job.Action && this.job.Value) {
        fetchPost(`/api/savePeerScheduleJob`, {
          Job: this.job
        }, (res) => {
          if (res.status) {
            this.edit = false;
            this.store.newMessage("Server", "Peer job saved", "success");
            console.log(res.data);
            this.$emit("refresh", res.data[0]);
            this.newJob = false;
          } else {
            this.store.newMessage("Server", res.message, "danger");
          }
        });
      } else {
        this.alert();
      }
    },
    alert() {
      let animation = "animate__flash";
      let dropdowns = this.$el.querySelectorAll(".scheduleDropdown");
      let inputs = this.$el.querySelectorAll("input");
      dropdowns.forEach((x) => x.classList.add("animate__animated", animation));
      inputs.forEach((x) => x.classList.add("animate__animated", animation));
      setTimeout(() => {
        dropdowns.forEach((x) => x.classList.remove("animate__animated", animation));
        inputs.forEach((x) => x.classList.remove("animate__animated", animation));
      }, 2e3);
    },
    reset() {
      if (this.job.CreationDate) {
        this.job = JSON.parse(JSON.stringify(this.pjob));
        this.edit = false;
      } else {
        this.$emit("delete");
      }
    },
    delete() {
      if (this.job.CreationDate) {
        fetchPost(`/api/deletePeerScheduleJob`, {
          Job: this.job
        }, (res) => {
          if (!res.status) {
            this.store.newMessage("Server", res.message, "danger");
            this.$emit("delete");
          } else {
            this.store.newMessage("Server", "Peer job deleted", "success");
          }
        });
      }
      this.$emit("delete");
    },
    parseTime(modelData) {
      if (modelData) {
        this.job.Value = dayjs(modelData).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }
};
const _hoisted_1 = { class: "card-header bg-transparent text-muted border-0" };
const _hoisted_2 = {
  key: 0,
  class: "d-flex"
};
const _hoisted_3 = { class: "me-auto" };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { class: "badge text-bg-warning" };
const _hoisted_6 = {
  class: "card-body pt-1",
  style: { "font-family": "var(--bs-font-monospace)" }
};
const _hoisted_7 = { class: "d-flex gap-2 align-items-center mb-2" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { class: "px-5 d-flex gap-2 align-items-center" };
const _hoisted_10 = { class: "d-flex gap-3" };
const _hoisted_11 = {
  key: 0,
  class: "ms-auto d-flex gap-3"
};
const _hoisted_12 = {
  key: 1,
  class: "ms-auto d-flex gap-3"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_ScheduleDropdown = resolveComponent("ScheduleDropdown");
  const _component_VueDatePicker = resolveComponent("VueDatePicker");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["card shadow-sm rounded-3 mb-2", { "border-warning-subtle": this.newJob }])
  }, [
    createBaseVNode("div", _hoisted_1, [
      !this.newJob ? (openBlock(), createElementBlock("small", _hoisted_2, [
        createBaseVNode("strong", _hoisted_3, [
          createVNode(_component_LocaleText, { t: "Job ID" })
        ]),
        createBaseVNode("samp", null, toDisplayString(this.job.JobID), 1)
      ])) : (openBlock(), createElementBlock("small", _hoisted_4, [
        createBaseVNode("span", _hoisted_5, [
          createVNode(_component_LocaleText, { t: "Unsaved Job" })
        ])
      ]))
    ]),
    createBaseVNode("div", _hoisted_6, [
      createBaseVNode("div", _hoisted_7, [
        createBaseVNode("samp", null, [
          createVNode(_component_LocaleText, { t: "if" })
        ]),
        createVNode(_component_ScheduleDropdown, {
          edit: $setup.edit,
          options: this.dropdowns.Field,
          data: this.job.Field,
          onUpdate: _cache[0] || (_cache[0] = (value) => {
            this.job.Field = value;
          })
        }, null, 8, ["edit", "options", "data"]),
        createBaseVNode("samp", null, [
          createVNode(_component_LocaleText, { t: "is" })
        ]),
        createVNode(_component_ScheduleDropdown, {
          edit: $setup.edit,
          options: this.dropdowns.Operator,
          data: this.job.Operator,
          onUpdate: _cache[1] || (_cache[1] = (value) => this.job.Operator = value)
        }, null, 8, ["edit", "options", "data"]),
        this.job.Field === "date" ? (openBlock(), createBlock(_component_VueDatePicker, {
          key: 0,
          is24: true,
          "min-date": /* @__PURE__ */ new Date(),
          "model-value": this.job.Value,
          "onUpdate:modelValue": this.parseTime,
          "time-picker-inline": "",
          format: "yyyy-MM-dd HH:mm:ss",
          "preview-format": "yyyy-MM-dd HH:mm:ss",
          clearable: false,
          disabled: !$setup.edit,
          dark: this.store.Configuration.Server.dashboard_theme === "dark"
        }, null, 8, ["min-date", "model-value", "onUpdate:modelValue", "disabled", "dark"])) : withDirectives((openBlock(), createElementBlock("input", {
          key: 1,
          class: "form-control form-control-sm form-control-dark rounded-3 flex-grow-1",
          disabled: !$setup.edit,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => this.job.Value = $event),
          style: { "width": "auto" }
        }, null, 8, _hoisted_8)), [
          [vModelText, this.job.Value]
        ]),
        createBaseVNode("samp", null, toDisplayString(this.dropdowns.Field.find((x) => x.value === this.job.Field)?.unit) + " { ", 1)
      ]),
      createBaseVNode("div", _hoisted_9, [
        createBaseVNode("samp", null, [
          createVNode(_component_LocaleText, { t: "then" })
        ]),
        createVNode(_component_ScheduleDropdown, {
          edit: $setup.edit,
          options: this.dropdowns.Action,
          data: this.job.Action,
          onUpdate: _cache[3] || (_cache[3] = (value) => this.job.Action = value)
        }, null, 8, ["edit", "options", "data"])
      ]),
      createBaseVNode("div", _hoisted_10, [
        _cache[12] || (_cache[12] = createBaseVNode("samp", null, "}", -1)),
        !this.edit ? (openBlock(), createElementBlock("div", _hoisted_11, [
          createBaseVNode("a", {
            role: "button",
            class: "ms-auto text-decoration-none",
            onClick: _cache[4] || (_cache[4] = ($event) => this.edit = true)
          }, [
            _cache[8] || (_cache[8] = createTextVNode("[E] ")),
            createVNode(_component_LocaleText, { t: "Edit" })
          ]),
          createBaseVNode("a", {
            role: "button",
            onClick: _cache[5] || (_cache[5] = ($event) => this.delete()),
            class: "text-danger text-decoration-none"
          }, [
            _cache[9] || (_cache[9] = createTextVNode("[D] ")),
            createVNode(_component_LocaleText, { t: "Delete" })
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_12, [
          createBaseVNode("a", {
            role: "button",
            class: "text-secondary text-decoration-none",
            onClick: _cache[6] || (_cache[6] = ($event) => this.reset())
          }, [
            _cache[10] || (_cache[10] = createTextVNode("[C] ")),
            createVNode(_component_LocaleText, { t: "Cancel" })
          ]),
          createBaseVNode("a", {
            role: "button",
            class: "text-primary ms-auto text-decoration-none",
            onClick: _cache[7] || (_cache[7] = ($event) => this.save())
          }, [
            _cache[11] || (_cache[11] = createTextVNode("[S] ")),
            createVNode(_component_LocaleText, { t: "Save" })
          ])
        ]))
      ])
    ])
  ], 2);
}
const SchedulePeerJob = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4aa63a3e"]]);
export {
  SchedulePeerJob as S,
  ScheduleDropdown as a
};
