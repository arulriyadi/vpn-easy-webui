import { _ as _export_sfc, c as createElementBlock, d as createVNode, w as withCtx, k as resolveComponent, a as openBlock, j as Transition, i as createBlock, l as resolveDynamicComponent, S as Suspense } from "./index-xvqfLBaG.js";
const _sfc_main = {
  name: "configuration"
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RouterView = resolveComponent("RouterView");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_RouterView, null, {
      default: withCtx(({ Component, route }) => [
        createVNode(Transition, {
          name: "fade2",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            (openBlock(), createBlock(Suspense, null, {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(Component), {
                  key: route.path
                }))
              ]),
              _: 2
            }, 1024))
          ]),
          _: 2
        }, 1024)
      ]),
      _: 1
    })
  ]);
}
const configuration = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  configuration as default
};
