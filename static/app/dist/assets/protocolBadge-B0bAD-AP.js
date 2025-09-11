import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { a as openBlock, c as createElementBlock, f as createTextVNode, i as createBlock, e as createCommentVNode } from "./index-xvqfLBaG.js";
const _hoisted_1 = {
  key: 0,
  class: "badge wireguardBg rounded-3 shadow"
};
const _hoisted_2 = {
  key: 1,
  class: "badge amneziawgBg rounded-3 shadow"
};
const _sfc_main = {
  __name: "protocolBadge",
  props: {
    protocol: String,
    mini: false
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return __props.protocol === "wg" ? (openBlock(), createElementBlock("span", _hoisted_1, [
        _cache[0] || (_cache[0] = createTextVNode(" WireGuard ")),
        !__props.mini ? (openBlock(), createBlock(LocaleText, {
          key: 0,
          t: "Configuration"
        })) : createCommentVNode("", true)
      ])) : __props.protocol === "awg" ? (openBlock(), createElementBlock("span", _hoisted_2, [
        _cache[1] || (_cache[1] = createTextVNode(" AmneziaWG ")),
        !__props.mini ? (openBlock(), createBlock(LocaleText, {
          key: 0,
          t: "Configuration"
        })) : createCommentVNode("", true)
      ])) : createCommentVNode("", true);
    };
  }
};
export {
  _sfc_main as _
};
