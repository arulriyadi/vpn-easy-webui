import { _ as _export_sfc, D as DashboardConfigurationStore, r as ref, o as onMounted, N as useRoute, g as fetchGet, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, n as normalizeClass, e as createCommentVNode, w as withCtx, j as Transition } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import "./browser-CMVr0Ar6.js";
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "m-auto modal-dialog-centered dashboardModal justify-content-center" };
const _hoisted_4 = { class: "card rounded-3 shadow w-100" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_6 = { class: "mb-0" };
const _hoisted_7 = { class: "card-body p-4 d-flex flex-column gap-3" };
const _hoisted_8 = {
  style: { "height": "300px" },
  class: "d-flex"
};
const _hoisted_9 = ["value"];
const _hoisted_10 = {
  key: 0,
  class: "spinner-border m-auto",
  role: "status"
};
const _hoisted_11 = { class: "d-flex" };
const _hoisted_12 = ["disabled"];
const _hoisted_13 = {
  key: 0,
  class: "d-block"
};
const _hoisted_14 = {
  key: 1,
  class: "d-block",
  id: "check"
};
const _sfc_main = {
  __name: "peerConfigurationFile",
  props: {
    selectedPeer: Object
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const store = DashboardConfigurationStore();
    const copied = ref(false);
    const configurationFile = ref("");
    const loading = ref(true);
    ref({
      error: false,
      message: void 0
    });
    onMounted(() => {
      const route = useRoute();
      fetchGet("/api/downloadPeer/" + route.params.id, {
        id: props.selectedPeer.id
      }, (res) => {
        if (res.status) {
          configurationFile.value = res.data.file;
          loading.value = false;
        } else {
          this.dashboardStore.newMessage("Server", res.message, "danger");
        }
      });
    });
    const copy = async () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(configurationFile.value).then(() => {
          copied.value = true;
          setTimeout(() => {
            copied.value = false;
          }, 3e3);
        }).catch(() => {
          store.newMessage("WGDashboard", "Failed to copy", "danger");
        });
      } else {
        const ele = document.querySelector("#peerConfigurationFile");
        ele.select();
        const successful = document.execCommand("copy");
        if (successful) {
          copied.value = true;
          setTimeout(() => {
            copied.value = false;
          }, 3e3);
        } else {
          store.newMessage("WGDashboard", "Failed to copy", "danger");
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("h4", _hoisted_6, [
                  createVNode(LocaleText, { t: "Peer Configuration File" })
                ]),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close ms-auto",
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
                })
              ]),
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("textarea", {
                    style: { "height": "300px" },
                    class: normalizeClass(["form-control w-100 rounded-3 animate__fadeIn animate__faster animate__animated", { "d-none": loading.value }]),
                    id: "peerConfigurationFile",
                    value: configurationFile.value
                  }, null, 10, _hoisted_9),
                  loading.value ? (openBlock(), createElementBlock("div", _hoisted_10, _cache[2] || (_cache[2] = [
                    createBaseVNode("span", { class: "visually-hidden" }, "Loading...", -1)
                  ]))) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("button", {
                    onClick: _cache[1] || (_cache[1] = ($event) => copy()),
                    disabled: copied.value || loading.value,
                    class: "ms-auto btn bg-primary-subtle border-primary-subtle text-primary-emphasis rounded-3 position-relative"
                  }, [
                    createVNode(Transition, {
                      name: "slide-up",
                      mode: "out-in"
                    }, {
                      default: withCtx(() => [
                        !copied.value ? (openBlock(), createElementBlock("span", _hoisted_13, _cache[3] || (_cache[3] = [
                          createBaseVNode("i", { class: "bi bi-clipboard-fill" }, null, -1)
                        ]))) : (openBlock(), createElementBlock("span", _hoisted_14, _cache[4] || (_cache[4] = [
                          createBaseVNode("i", { class: "bi bi-check-circle-fill" }, null, -1)
                        ])))
                      ]),
                      _: 1
                    })
                  ], 8, _hoisted_12)
                ])
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const peerConfigurationFile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0ea2d46"]]);
export {
  peerConfigurationFile as default
};
