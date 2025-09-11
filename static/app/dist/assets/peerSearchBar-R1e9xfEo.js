import { _ as _export_sfc, q as computed, G as GetLocale, r as ref, W as WireguardConfigurationsStore, a6 as useTemplateRef, o as onMounted, a as openBlock, i as createBlock, w as withCtx, b as createBaseVNode, m as withDirectives, y as vModelText, d as createVNode, j as Transition } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _hoisted_1 = {
  class: "fixed-bottom w-100 bottom-0 z-2",
  style: { "z-index": "1" }
};
const _hoisted_2 = { class: "container-fluid" };
const _hoisted_3 = { class: "row g-0" };
const _hoisted_4 = { class: "col-md-9 col-lg-10 d-flex justify-content-center py-2" };
const _hoisted_5 = { class: "rounded-3 p-2 border shadow searchPeersContainer bg-body-tertiary" };
const _hoisted_6 = { class: "d-flex gap-1 align-items-center px-2" };
const _hoisted_7 = ["placeholder"];
const _sfc_main = {
  __name: "peerSearchBar",
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const searchBarPlaceholder = computed(() => {
      return GetLocale("Search Peers...");
    });
    let searchStringTimeout = void 0;
    const searchString = ref("");
    const wireguardConfigurationStore = WireguardConfigurationsStore();
    const debounce = () => {
      if (!searchStringTimeout) {
        searchStringTimeout = setTimeout(() => {
          wireguardConfigurationStore.searchString = searchString.value;
        }, 300);
      } else {
        clearTimeout(searchStringTimeout);
        searchStringTimeout = setTimeout(() => {
          wireguardConfigurationStore.searchString = searchString.value;
        }, 300);
      }
    };
    const emits = __emit;
    const input = useTemplateRef("searchBar");
    onMounted(() => {
      input.value.focus();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, {
        name: "slideUp",
        appear: "",
        type: "animation",
        style: { "animation-delay": "1s" }
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("div", _hoisted_3, [
                _cache[5] || (_cache[5] = createBaseVNode("div", { class: "col-md-3 col-lg-2" }, null, -1)),
                createBaseVNode("div", _hoisted_4, [
                  createBaseVNode("div", _hoisted_5, [
                    createBaseVNode("div", _hoisted_6, [
                      _cache[4] || (_cache[4] = createBaseVNode("h6", { class: "mb-0 me-2" }, [
                        createBaseVNode("label", { for: "searchPeers" }, [
                          createBaseVNode("i", { class: "bi bi-search" })
                        ])
                      ], -1)),
                      withDirectives(createBaseVNode("input", {
                        ref: "searchBar",
                        class: "flex-grow-1 form-control rounded-3 bg-secondary-subtle border-1 border-secondary-subtle",
                        placeholder: searchBarPlaceholder.value,
                        id: "searchPeers",
                        onKeyup: _cache[0] || (_cache[0] = ($event) => debounce()),
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchString.value = $event)
                      }, null, 40, _hoisted_7), [
                        [vModelText, searchString.value]
                      ]),
                      createBaseVNode("button", {
                        onClick: _cache[2] || (_cache[2] = ($event) => emits("close")),
                        style: { "white-space": "nowrap" },
                        class: "btn bg-secondary-subtle text-secondary-emphasis border-secondary-subtle rounded-3 d-flex align-items-center"
                      }, [
                        createBaseVNode("span", null, [
                          _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-x-circle-fill me-2" }, null, -1)),
                          createVNode(LocaleText, { t: "Done" })
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ]),
        _: 1
      });
    };
  }
};
const peerSearchBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b741afe7"]]);
export {
  peerSearchBar as default
};
