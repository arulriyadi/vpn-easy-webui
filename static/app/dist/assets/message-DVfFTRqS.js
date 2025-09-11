import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { _ as _export_sfc, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, w as withCtx, f as createTextVNode, t as toDisplayString, j as Transition, n as normalizeClass, k as resolveComponent } from "./index-xvqfLBaG.js";
const _sfc_main = {
  name: "message",
  methods: {
    dayjs,
    hide() {
      this.ct();
      this.message.show = false;
    },
    show() {
      this.timeout = setTimeout(() => {
        this.message.show = false;
      }, 5e3);
    },
    ct() {
      clearTimeout(this.timeout);
    }
  },
  components: { LocaleText },
  props: {
    message: Object
  },
  mounted() {
    this.show();
  },
  data() {
    return {
      dismiss: false,
      timeout: null
    };
  }
};
const _hoisted_1 = ["id"];
const _hoisted_2 = {
  key: 0,
  class: "d-flex"
};
const _hoisted_3 = {
  class: "fw-bold d-block",
  style: { "text-transform": "uppercase" }
};
const _hoisted_4 = { class: "ms-auto" };
const _hoisted_5 = { key: 1 };
const _hoisted_6 = { class: "card-body d-flex align-items-center gap-3" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    onMouseenter: _cache[1] || (_cache[1] = ($event) => {
      $data.dismiss = true;
      this.ct();
    }),
    onMouseleave: _cache[2] || (_cache[2] = ($event) => {
      $data.dismiss = false;
      this.show();
    }),
    class: "card shadow rounded-3 position-relative message ms-auto",
    id: this.message.id
  }, [
    createBaseVNode("div", {
      class: normalizeClass([{
        "text-bg-danger": this.message.type === "danger",
        "text-bg-success": this.message.type === "success",
        "text-bg-warning": this.message.type === "warning"
      }, "card-header pos"])
    }, [
      createVNode(Transition, {
        name: "zoom",
        mode: "out-in"
      }, {
        default: withCtx(() => [
          !$data.dismiss ? (openBlock(), createElementBlock("div", _hoisted_2, [
            createBaseVNode("small", _hoisted_3, [
              createVNode(_component_LocaleText, { t: "FROM " }),
              createTextVNode(" " + toDisplayString(this.message.from), 1)
            ]),
            createBaseVNode("small", _hoisted_4, toDisplayString($options.dayjs().format("hh:mm A")), 1)
          ])) : (openBlock(), createElementBlock("div", _hoisted_5, [
            createBaseVNode("small", {
              onClick: _cache[0] || (_cache[0] = ($event) => $options.hide()),
              class: "d-block mx-auto w-100 text-center",
              style: { "cursor": "pointer" }
            }, [
              _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-x-lg me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Dismiss" })
            ])
          ]))
        ]),
        _: 1
      })
    ], 2),
    createBaseVNode("div", _hoisted_6, [
      createBaseVNode("div", null, toDisplayString(this.message.content), 1)
    ])
  ], 40, _hoisted_1);
}
const Message = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-94c76b54"]]);
export {
  Message as M
};
