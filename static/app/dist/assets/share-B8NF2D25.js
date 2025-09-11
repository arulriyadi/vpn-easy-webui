import { _ as _export_sfc, r as ref, D as DashboardConfigurationStore, g as fetchGet, c as createElementBlock, b as createBaseVNode, d as createVNode, N as useRoute, a as openBlock, k as resolveComponent } from "./index-xvqfLBaG.js";
import { b as browser } from "./browser-CMVr0Ar6.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _sfc_main = {
  name: "share",
  components: { LocaleText },
  async setup() {
    const route = useRoute();
    const loaded = ref(false);
    const store = DashboardConfigurationStore();
    const theme = ref("");
    const peerConfiguration = ref(void 0);
    const blob = ref(new Blob());
    await fetchGet("/api/getDashboardTheme", {}, (res) => {
      theme.value = res.data;
    });
    const id = route.query.ShareID;
    if (id === void 0 || id.length === 0) {
      peerConfiguration.value = void 0;
      loaded.value = true;
    } else {
      await fetchGet("/api/sharePeer/get", {
        ShareID: id
      }, (res) => {
        if (res.status) {
          peerConfiguration.value = res.data;
          blob.value = new Blob([peerConfiguration.value.file], { type: "text/plain" });
        } else {
          peerConfiguration.value = void 0;
        }
        loaded.value = true;
      });
    }
    return { store, theme, peerConfiguration, blob };
  },
  mounted() {
    if (this.peerConfiguration) {
      browser.toCanvas(document.querySelector("#qrcode"), this.peerConfiguration.file, (error) => {
        if (error) console.error(error);
      });
    }
  },
  methods: {
    download() {
      const blob = new Blob([this.peerConfiguration.file], { type: "text/plain" });
      const jsonObjectUrl = URL.createObjectURL(blob);
      const filename = `${this.peerConfiguration.fileName}.conf`;
      const anchorEl = document.createElement("a");
      anchorEl.href = jsonObjectUrl;
      anchorEl.download = filename;
      anchorEl.click();
    }
  },
  computed: {
    getBlob() {
      return URL.createObjectURL(this.blob);
    }
  }
};
const _hoisted_1 = ["data-bs-theme"];
const _hoisted_2 = {
  class: "m-auto text-body",
  style: { "width": "500px" }
};
const _hoisted_3 = {
  key: 0,
  class: "text-center position-relative",
  style: {}
};
const _hoisted_4 = {
  class: "position-absolute w-100 h-100 top-0 start-0 d-flex animate__animated animate__fadeInUp",
  style: { "animation-delay": "0.1s" }
};
const _hoisted_5 = { class: "m-auto" };
const _hoisted_6 = {
  key: 1,
  class: "d-flex align-items-center flex-column gap-3"
};
const _hoisted_7 = { class: "h1 dashboardLogo text-center animate__animated animate__fadeInUp" };
const _hoisted_8 = {
  id: "qrcode",
  class: "rounded-3 shadow animate__animated animate__fadeInUp mb-3",
  ref: "qrcode"
};
const _hoisted_9 = {
  class: "text-muted animate__animated animate__fadeInUp mb-1",
  style: { "animation-delay": "0.2s" }
};
const _hoisted_10 = ["download", "href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  return openBlock(), createElementBlock("div", {
    class: "container-fluid login-container-fluid d-flex main pt-5 overflow-scroll",
    "data-bs-theme": this.theme
  }, [
    createBaseVNode("div", _hoisted_2, [
      !this.peerConfiguration ? (openBlock(), createElementBlock("div", _hoisted_3, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "animate__animated animate__fadeInUp" }, [
          createBaseVNode("h1", {
            style: { "font-size": "20rem", "filter": "blur(1rem)", "animation-duration": "7s" },
            class: "animate__animated animate__flash animate__infinite"
          }, [
            createBaseVNode("i", { class: "bi bi-file-binary" })
          ])
        ], -1)),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("h3", _hoisted_5, [
            createVNode(_component_LocaleText, { t: "Oh no... This link is either expired or invalid." })
          ])
        ])
      ])) : (openBlock(), createElementBlock("div", _hoisted_6, [
        createBaseVNode("div", _hoisted_7, [
          _cache[1] || (_cache[1] = createBaseVNode("h6", null, "WGDashboard", -1)),
          createVNode(_component_LocaleText, { t: "Scan QR Code with the WireGuard App to add peer" })
        ]),
        createBaseVNode("canvas", _hoisted_8, null, 512),
        createBaseVNode("p", _hoisted_9, [
          createVNode(_component_LocaleText, { t: "or click the button below to download the " }),
          _cache[2] || (_cache[2] = createBaseVNode("samp", null, ".conf", -1)),
          createVNode(_component_LocaleText, { t: " file" })
        ]),
        createBaseVNode("a", {
          download: this.peerConfiguration.fileName + ".conf",
          href: $options.getBlob,
          class: "btn btn-lg bg-primary-subtle text-primary-emphasis border-1 border-primary-subtle animate__animated animate__fadeInUp shadow-sm",
          style: { "animation-delay": "0.25s" }
        }, _cache[3] || (_cache[3] = [
          createBaseVNode("i", { class: "bi bi-download" }, null, -1)
        ]), 8, _hoisted_10)
      ]))
    ])
  ], 8, _hoisted_1);
}
const share = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1b44aacd"]]);
export {
  share as default
};
