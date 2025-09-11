import { _ as _export_sfc, p as useCssVars, r as ref, q as computed, a as openBlock, c as createElementBlock, d as createVNode, w as withCtx, s as normalizeStyle, n as normalizeClass, b as createBaseVNode, t as toDisplayString, e as createCommentVNode, j as Transition } from "./index-xvqfLBaG.js";
const _hoisted_1 = { class: "text-muted me-2" };
const _hoisted_2 = { class: "fw-bold" };
const _sfc_main = {
  __name: "cpuCore",
  props: {
    core_number: Number,
    percentage: Number,
    align: Boolean,
    square: Boolean
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "2ec4d3bc": squareHeight.value
    }));
    const props = __props;
    const show = ref(false);
    const squareHeight = computed(() => {
      return props.square ? "40px" : "25px";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "flex-grow-1 square rounded-3 border position-relative p-2",
        onMouseenter: _cache[0] || (_cache[0] = ($event) => show.value = true),
        onMouseleave: _cache[1] || (_cache[1] = ($event) => show.value = false),
        style: normalizeStyle({ "background-color": `rgb(13 110 253 / ${__props.percentage * 10}%)` })
      }, [
        createVNode(Transition, { name: "zoomReversed" }, {
          default: withCtx(() => [
            show.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              style: normalizeStyle([{ "white-space": "nowrap" }, { "top": squareHeight.value }]),
              class: normalizeClass(["floatingLabel z-3 border position-absolute d-block p-1 px-2 bg-body text-body rounded-3 border shadow d-flex", [__props.align ? "end-0" : "start-0"]])
            }, [
              createBaseVNode("small", _hoisted_1, " Core #" + toDisplayString(__props.core_number + 1), 1),
              createBaseVNode("small", _hoisted_2, toDisplayString(__props.percentage) + "% ", 1)
            ], 6)) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 36);
    };
  }
};
const CpuCore = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ad535bb"]]);
export {
  CpuCore as C
};
