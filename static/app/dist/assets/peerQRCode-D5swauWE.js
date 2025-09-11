import { b as browser } from "./browser-CMVr0Ar6.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { _ as _export_sfc, D as DashboardConfigurationStore, g as fetchGet, k as resolveComponent, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, n as normalizeClass, e as createCommentVNode } from "./index-xvqfLBaG.js";
const _sfc_main = {
  name: "peerQRCode",
  components: { LocaleText },
  props: {
    selectedPeer: Object
  },
  setup() {
    const dashboardStore = DashboardConfigurationStore();
    return { dashboardStore };
  },
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    fetchGet("/api/downloadPeer/" + this.$route.params.id, {
      id: this.selectedPeer.id
    }, (res) => {
      this.loading = false;
      if (res.status) {
        let data = "";
        if (this.selectedPeer.configuration.Protocol === "awg") {
          let awgQRCodeObject = {
            containers: [
              {
                awg: {
                  isThirdPartyConfig: true,
                  last_config: res.data.file,
                  port: this.selectedPeer.configuration.ListenPort,
                  transport_proto: "udp"
                },
                container: "amnezia-awg"
              }
            ],
            defaultContainer: "amnezia-awg",
            description: this.selectedPeer.name,
            hostName: this.dashboardStore.Configuration.Peers.remote_endpoint
          };
          data = btoa(JSON.stringify(awgQRCodeObject));
        } else {
          data = res.data.file;
        }
        browser.toCanvas(document.querySelector("#qrcode"), data, (error) => {
          if (error) console.error(error);
        });
      } else {
        this.dashboardStore.newMessage("Server", res.message, "danger");
      }
    });
  }
};
const _hoisted_1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0" };
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = { class: "m-auto modal-dialog-centered dashboardModal justify-content-center" };
const _hoisted_4 = { class: "card rounded-3 shadow" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_6 = { class: "mb-0" };
const _hoisted_7 = { class: "card-body p-4" };
const _hoisted_8 = { class: "d-flex" };
const _hoisted_9 = {
  key: 0,
  class: "spinner-border m-auto",
  role: "status"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("div", _hoisted_3, [
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h4", _hoisted_6, [
              createVNode(_component_LocaleText, { t: "QR Code" })
            ]),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close ms-auto",
              onClick: _cache[0] || (_cache[0] = ($event) => this.$emit("close"))
            })
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("canvas", {
                id: "qrcode",
                class: normalizeClass(["rounded-3 shadow animate__animated animate__fadeIn animate__faster", { "d-none": $data.loading }])
              }, null, 2),
              $data.loading ? (openBlock(), createElementBlock("div", _hoisted_9, _cache[1] || (_cache[1] = [
                createBaseVNode("span", { class: "visually-hidden" }, "Loading...", -1)
              ]))) : createCommentVNode("", true)
            ])
          ])
        ])
      ])
    ])
  ]);
}
const peerQRCode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7c287bf3"]]);
export {
  peerQRCode as default
};
