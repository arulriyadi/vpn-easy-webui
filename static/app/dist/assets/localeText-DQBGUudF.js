import { _ as _export_sfc, G as GetLocale, a as openBlock, c as createElementBlock, t as toDisplayString } from "./index-xvqfLBaG.js";
const _sfc_main = {
  name: "localeText",
  props: {
    t: ""
  },
  computed: {
    getLocaleText() {
      return GetLocale(this.t);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", null, toDisplayString(this.getLocaleText), 1);
}
const LocaleText = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  LocaleText as L
};
