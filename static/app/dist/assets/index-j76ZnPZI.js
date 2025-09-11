import { r as ref, o as onMounted, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, e as createCommentVNode, f as createTextVNode, t as toDisplayString, _ as _export_sfc, D as DashboardConfigurationStore, w as withCtx, T as TransitionGroup, n as normalizeClass, u as unref, W as WireguardConfigurationsStore, g as fetchGet, G as GetLocale, F as Fragment, h as renderList, i as createBlock, j as Transition, k as resolveComponent, l as resolveDynamicComponent, S as Suspense } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { M as Message } from "./message-DVfFTRqS.js";
import "./dayjs.min-CfinB9vE.js";
const _hoisted_1$3 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2$3 = { class: "container d-flex h-100 w-100" };
const _hoisted_3$3 = { class: "m-auto modal-dialog-centered dashboardModal" };
const _hoisted_4$3 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_5$2 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-2" };
const _hoisted_6$2 = { class: "mb-0" };
const _hoisted_7$2 = { class: "card-body px-4 pb-4 d-flex flex-column gap-2" };
const _hoisted_8$2 = {
  class: "card text-decoration-none",
  target: "_blank",
  role: "button",
  href: "https://discord.gg/72TwzjeuWm"
};
const _hoisted_9$2 = { class: "card-body d-flex gap-4 align-items-center" };
const _hoisted_10$1 = { class: "d-flex align-items-center" };
const _hoisted_11$1 = { class: "badge rounded-pill text-bg-primary ms-2" };
const _hoisted_12$1 = {
  key: 0,
  class: "spinner-border spinner-border-sm",
  style: { "width": "0.7rem", "height": "0.7rem" }
};
const _hoisted_13$1 = { key: 1 };
const _hoisted_14$1 = { class: "text-muted" };
const _hoisted_15$1 = {
  class: "card text-decoration-none",
  href: "https://docs.wgdashboard.dev/",
  target: "_blank"
};
const _hoisted_16$1 = { class: "card-body d-flex gap-4 align-items-center" };
const _hoisted_17$1 = { class: "mb-0" };
const _hoisted_18$1 = { class: "text-muted" };
const _sfc_main$3 = {
  __name: "helpModal",
  setup(__props) {
    const discordLoading = ref(true);
    const discord = ref(void 0);
    onMounted(() => {
      discordLoading.value = true;
      fetch("https://discord.com/api/guilds/1276818723637956628/widget.json").then((res) => res.json()).then((res) => {
        discord.value = res;
        discordLoading.value = false;
      }).catch(() => {
        discordLoading.value = false;
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$3, [
            createBaseVNode("div", _hoisted_4$3, [
              createBaseVNode("div", _hoisted_5$2, [
                createBaseVNode("h4", _hoisted_6$2, [
                  createVNode(LocaleText, { t: "Help" })
                ]),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close ms-auto",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
                })
              ]),
              createBaseVNode("div", _hoisted_7$2, [
                createBaseVNode("a", _hoisted_8$2, [
                  createBaseVNode("div", _hoisted_9$2, [
                    _cache[3] || (_cache[3] = createBaseVNode("h1", { class: "mb-0" }, [
                      createBaseVNode("i", { class: "bi bi-discord" })
                    ], -1)),
                    createBaseVNode("div", null, [
                      createBaseVNode("div", _hoisted_10$1, [
                        _cache[2] || (_cache[2] = createBaseVNode("h5", { class: "mb-0" }, " Discord Server ", -1)),
                        createBaseVNode("span", _hoisted_11$1, [
                          discordLoading.value ? (openBlock(), createElementBlock("span", _hoisted_12$1)) : createCommentVNode("", true),
                          discord.value !== void 0 && !discordLoading.value ? (openBlock(), createElementBlock("span", _hoisted_13$1, [
                            _cache[1] || (_cache[1] = createBaseVNode("i", { class: "bi bi-person-fill me-2" }, null, -1)),
                            createTextVNode(toDisplayString(discord.value.presence_count) + " Online ", 1)
                          ])) : createCommentVNode("", true)
                        ])
                      ]),
                      createBaseVNode("small", _hoisted_14$1, [
                        createVNode(LocaleText, { t: "Join our Discord server for quick help or chat about WGDashboard!" })
                      ])
                    ])
                  ])
                ]),
                createBaseVNode("a", _hoisted_15$1, [
                  createBaseVNode("div", _hoisted_16$1, [
                    _cache[4] || (_cache[4] = createBaseVNode("h1", { class: "mb-0" }, [
                      createBaseVNode("i", { class: "bi bi-hash" })
                    ], -1)),
                    createBaseVNode("div", null, [
                      createBaseVNode("h5", _hoisted_17$1, [
                        createVNode(LocaleText, { t: "Official Documentation" })
                      ]),
                      createBaseVNode("small", _hoisted_18$1, [
                        createVNode(LocaleText, { t: "Official documentation contains User Guides and more..." })
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$2 = {
  key: "header",
  class: "shadow"
};
const _hoisted_2$2 = { class: "p-3 d-flex gap-2 flex-column" };
const _hoisted_3$2 = { class: "d-flex text-body" };
const _hoisted_4$2 = { class: "d-flex flex-column align-items-start gap-1" };
const _hoisted_5$1 = { class: "mb-0" };
const _hoisted_6$1 = { class: "mb-0" };
const _hoisted_7$1 = { class: "list-group" };
const _hoisted_8$1 = {
  href: "https://docs.wgdashboard.dev/",
  target: "_blank",
  class: "list-group-item list-group-item-action d-flex align-items-center"
};
const _hoisted_9$1 = {
  target: "_blank",
  role: "button",
  href: "https://discord.gg/72TwzjeuWm",
  class: "list-group-item list-group-item-action d-flex align-items-center"
};
const _sfc_main$2 = {
  __name: "agentModal",
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const store = DashboardConfigurationStore();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["agentContainer m-2 rounded-3 d-flex flex-column text-body", { "enabled": unref(store).HelpAgent.Enable }])
      }, [
        createVNode(TransitionGroup, { name: "agent-message" }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_1$2, [
              createBaseVNode("div", _hoisted_2$2, [
                createBaseVNode("div", _hoisted_3$2, [
                  createBaseVNode("div", _hoisted_4$2, [
                    createBaseVNode("h5", _hoisted_5$1, [
                      createVNode(LocaleText, { t: "Help" })
                    ])
                  ]),
                  createBaseVNode("a", {
                    role: "button",
                    class: "ms-auto text-body",
                    onClick: _cache[0] || (_cache[0] = ($event) => emits("close"))
                  }, _cache[1] || (_cache[1] = [
                    createBaseVNode("h5", { class: "mb-0" }, [
                      createBaseVNode("i", { class: "bi bi-x-lg" })
                    ], -1)
                  ]))
                ]),
                createBaseVNode("p", _hoisted_6$1, [
                  createVNode(LocaleText, { t: "You can visit our: " })
                ]),
                createBaseVNode("div", _hoisted_7$1, [
                  createBaseVNode("a", _hoisted_8$1, [
                    _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-book-fill" }, null, -1)),
                    createVNode(LocaleText, {
                      class: "ms-auto",
                      t: "Official Documentation"
                    })
                  ]),
                  createBaseVNode("a", _hoisted_9$1, [
                    _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-discord" }, null, -1)),
                    createVNode(LocaleText, {
                      class: "ms-auto",
                      t: "Discord Server"
                    })
                  ])
                ])
              ])
            ])
          ]),
          _: 1
        })
      ], 2);
    };
  }
};
const AgentModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f37f608d"]]);
const _sfc_main$1 = {
  name: "navbar",
  components: { HelpModal: _sfc_main$3, LocaleText, AgentModal },
  setup() {
    const wireguardConfigurationsStore = WireguardConfigurationsStore();
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { wireguardConfigurationsStore, dashboardConfigurationStore };
  },
  data() {
    return {
      updateAvailable: false,
      updateMessage: "Checking for update...",
      updateUrl: "",
      openHelpModal: false,
      openAgentModal: false
    };
  },
  computed: {
    getActiveCrossServer() {
      if (this.dashboardConfigurationStore.ActiveServerConfiguration) {
        return new URL(this.dashboardConfigurationStore.CrossServerConfiguration.ServerList[this.dashboardConfigurationStore.ActiveServerConfiguration].host);
      }
      return void 0;
    }
  },
  mounted() {
    fetchGet("/api/getDashboardUpdate", {}, (res) => {
      if (res.status) {
        if (res.data) {
          this.updateAvailable = true;
          this.updateUrl = res.data;
        }
        this.updateMessage = res.message;
      } else {
        this.updateMessage = GetLocale("Failed to check available update");
        console.log(`Failed to get update: ${res.message}`);
      }
    });
  }
};
const _hoisted_1$1 = ["data-bs-theme"];
const _hoisted_2$1 = {
  id: "sidebarMenu",
  class: "bg-body-tertiary sidebar border h-100 rounded-3 shadow overflow-y-scroll"
};
const _hoisted_3$1 = { class: "sidebar-sticky" };
const _hoisted_4$1 = { class: "text-white text-center m-0 py-3 mb-2 btn-brand" };
const _hoisted_5 = {
  key: 0,
  class: "ms-auto"
};
const _hoisted_6 = { class: "nav flex-column px-2 gap-1" };
const _hoisted_7 = { class: "nav-item" };
const _hoisted_8 = { class: "nav-item" };
const _hoisted_9 = { class: "nav-item" };
const _hoisted_10 = { class: "nav flex-column px-2 gap-1" };
const _hoisted_11 = { class: "nav-item" };
const _hoisted_12 = { class: "nav flex-column px-2 gap-1" };
const _hoisted_13 = { class: "nav-item" };
const _hoisted_14 = { class: "nav-item" };
const _hoisted_15 = { class: "nav-item" };
const _hoisted_16 = { class: "nav-item" };
const _hoisted_17 = { class: "nav-item" };
const _hoisted_18 = { class: "nav-item" };
const _hoisted_19 = { class: "nav-item" };
const _hoisted_20 = { class: "nav flex-column px-2 mb-3" };
const _hoisted_21 = { class: "nav-item" };
const _hoisted_22 = {
  class: "nav-item",
  style: { "font-size": "0.8rem" }
};
const _hoisted_23 = ["href"];
const _hoisted_24 = { class: "nav-link text-muted rounded-3" };
const _hoisted_25 = {
  key: 1,
  class: "nav-link text-muted rounded-3"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LocaleText = resolveComponent("LocaleText");
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_HelpModal = resolveComponent("HelpModal");
  const _component_AgentModal = resolveComponent("AgentModal");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["col-md-3 col-lg-2 d-md-block p-2 navbar-container", { active: this.dashboardConfigurationStore.ShowNavBar }]),
    "data-bs-theme": $setup.dashboardConfigurationStore.Configuration.Server.dashboard_theme
  }, [
    createBaseVNode("nav", _hoisted_2$1, [
      createBaseVNode("div", _hoisted_3$1, [
        createBaseVNode("div", _hoisted_4$1, [
          _cache[5] || (_cache[5] = createBaseVNode("h5", { class: "mb-0" }, " WGDashboard ", -1)),
          $options.getActiveCrossServer !== void 0 ? (openBlock(), createElementBlock("small", _hoisted_5, [
            _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-hdd-rack-fill me-2" }, null, -1)),
            createTextVNode(toDisplayString($options.getActiveCrossServer.host), 1)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("ul", _hoisted_6, [
          createBaseVNode("li", _hoisted_7, [
            createVNode(_component_RouterLink, {
              class: "nav-link rounded-3",
              to: "/",
              "exact-active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-house me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Home" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_8, [
            createVNode(_component_RouterLink, {
              class: "nav-link rounded-3",
              to: "/settings",
              "exact-active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-gear me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Settings" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_9, [
            createBaseVNode("a", {
              class: "nav-link rounded-3",
              role: "button",
              onClick: _cache[0] || (_cache[0] = ($event) => $data.openAgentModal = true)
            }, [
              _cache[8] || (_cache[8] = createBaseVNode("i", { class: "bi bi-question-circle me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Help" })
            ])
          ])
        ]),
        _cache[18] || (_cache[18] = createBaseVNode("hr", { class: "text-body my-2" }, null, -1)),
        createBaseVNode("h6", {
          class: normalizeClass(["sidebar-heading px-3 mt-3 mb-1 text-center", $setup.dashboardConfigurationStore.Configuration.Server.dashboard_theme === "dark" ? "text-light-emphasis" : "text-muted"])
        }, [
          createVNode(_component_LocaleText, { t: "WireGuard Configurations" })
        ], 2),
        createBaseVNode("ul", _hoisted_10, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(this.wireguardConfigurationsStore.Configurations, (c) => {
            return openBlock(), createElementBlock("li", _hoisted_11, [
              createVNode(_component_RouterLink, {
                to: "/configuration/" + c.Name + "/peers",
                class: "nav-link nav-conf-link rounded-3",
                "active-class": "active"
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", {
                    class: normalizeClass(["dot me-2", { active: c.Status }])
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(c.Name), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ]);
          }), 256))
        ]),
        _cache[19] || (_cache[19] = createBaseVNode("hr", { class: "text-body my-2" }, null, -1)),
        createBaseVNode("h6", {
          class: normalizeClass(["sidebar-heading px-3 mt-3 mb-1 text-center", $setup.dashboardConfigurationStore.Configuration.Server.dashboard_theme === "dark" ? "text-light-emphasis" : "text-muted"])
        }, [
          createVNode(_component_LocaleText, { t: "Tools" })
        ], 2),
        createBaseVNode("ul", _hoisted_12, [
          createBaseVNode("li", _hoisted_13, [
            createVNode(_component_RouterLink, {
              to: "/system_status",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[9] || (_cache[9] = createBaseVNode("i", { class: "bi bi-cpu me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "System Status" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_14, [
            createVNode(_component_RouterLink, {
              to: "/firewall",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-shield-check me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Firewall Management" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_15, [
            createVNode(_component_RouterLink, {
              to: "/routing",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[11] || (_cache[11] = createBaseVNode("i", { class: "bi bi-diagram-3 me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Routing Management" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_16, [
            createVNode(_component_RouterLink, {
              to: "/logging",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[12] || (_cache[12] = createBaseVNode("i", { class: "bi bi-journal-text me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Logging Management" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_17, [
            createVNode(_component_RouterLink, {
              to: "/user_management",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[13] || (_cache[13] = createBaseVNode("i", { class: "bi bi-people me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "User Management" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_18, [
            createVNode(_component_RouterLink, {
              to: "/ping",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[14] || (_cache[14] = createBaseVNode("i", { class: "bi bi-broadcast me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Ping" })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", _hoisted_19, [
            createVNode(_component_RouterLink, {
              to: "/traceroute",
              class: "nav-link rounded-3",
              "active-class": "active"
            }, {
              default: withCtx(() => [
                _cache[15] || (_cache[15] = createBaseVNode("i", { class: "bi bi-diagram-2 me-2" }, null, -1)),
                createVNode(_component_LocaleText, { t: "Traceroute" })
              ]),
              _: 1
            })
          ])
        ]),
        _cache[20] || (_cache[20] = createBaseVNode("hr", { class: "text-body my-2" }, null, -1)),
        createBaseVNode("ul", _hoisted_20, [
          createBaseVNode("li", _hoisted_21, [
            createBaseVNode("a", {
              class: "nav-link text-danger rounded-3",
              onClick: _cache[1] || (_cache[1] = ($event) => this.dashboardConfigurationStore.signOut()),
              role: "button",
              style: { "font-weight": "bold" }
            }, [
              _cache[16] || (_cache[16] = createBaseVNode("i", { class: "bi bi-box-arrow-left me-2" }, null, -1)),
              createVNode(_component_LocaleText, { t: "Sign Out" })
            ])
          ]),
          createBaseVNode("li", _hoisted_22, [
            this.updateAvailable ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: this.updateUrl,
              class: "text-decoration-none rounded-3",
              target: "_blank"
            }, [
              createBaseVNode("small", _hoisted_24, [
                createVNode(_component_LocaleText, {
                  t: this.updateMessage
                }, null, 8, ["t"]),
                _cache[17] || (_cache[17] = createTextVNode(" (")),
                createVNode(_component_LocaleText, { t: "Current Version:" }),
                createTextVNode(" " + toDisplayString($setup.dashboardConfigurationStore.Configuration.Server.version) + ") ", 1)
              ])
            ], 8, _hoisted_23)) : (openBlock(), createElementBlock("small", _hoisted_25, [
              createVNode(_component_LocaleText, {
                t: this.updateMessage
              }, null, 8, ["t"]),
              createTextVNode(" (" + toDisplayString($setup.dashboardConfigurationStore.Configuration.Server.version) + ") ", 1)
            ]))
          ])
        ])
      ])
    ]),
    createVNode(Transition, { name: "zoom" }, {
      default: withCtx(() => [
        this.openHelpModal ? (openBlock(), createBlock(_component_HelpModal, {
          key: 0,
          onClose: _cache[2] || (_cache[2] = ($event) => {
            $data.openHelpModal = false;
          })
        })) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createVNode(Transition, { name: "slideIn" }, {
      default: withCtx(() => [
        this.openAgentModal ? (openBlock(), createBlock(_component_AgentModal, {
          key: 0,
          onClose: _cache[3] || (_cache[3] = ($event) => $data.openAgentModal = false)
        })) : createCommentVNode("", true)
      ]),
      _: 1
    })
  ], 10, _hoisted_1$1);
}
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-04d882b3"]]);
const _sfc_main = {
  name: "index",
  components: { Message, Navbar },
  async setup() {
    const dashboardConfigurationStore = DashboardConfigurationStore();
    return { dashboardConfigurationStore };
  },
  computed: {
    getMessages() {
      return this.dashboardConfigurationStore.Messages.filter((x) => x.show);
    }
  }
};
const _hoisted_1 = ["data-bs-theme"];
const _hoisted_2 = { class: "row h-100" };
const _hoisted_3 = { class: "col-md-9 col-lg-10 overflow-y-scroll mb-0 pt-2" };
const _hoisted_4 = { class: "messageCentre text-body position-absolute d-flex" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Navbar = resolveComponent("Navbar");
  const _component_RouterView = resolveComponent("RouterView");
  const _component_Message = resolveComponent("Message");
  return openBlock(), createElementBlock("div", {
    class: "container-fluid flex-grow-1 main",
    "data-bs-theme": this.dashboardConfigurationStore.Configuration.Server.dashboard_theme
  }, [
    createBaseVNode("div", _hoisted_2, [
      createVNode(_component_Navbar),
      createBaseVNode("main", _hoisted_3, [
        (openBlock(), createBlock(Suspense, null, {
          default: withCtx(() => [
            createVNode(_component_RouterView, null, {
              default: withCtx(({ Component }) => [
                createVNode(Transition, {
                  name: "fade2",
                  mode: "out-in",
                  appear: ""
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(Component)))
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 1
            })
          ]),
          _: 1
        })),
        createBaseVNode("div", _hoisted_4, [
          createVNode(TransitionGroup, {
            name: "message",
            tag: "div",
            class: "position-relative flex-sm-grow-0 flex-grow-1 d-flex align-items-end ms-sm-auto flex-column gap-2"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList($options.getMessages.slice().reverse(), (m) => {
                return openBlock(), createBlock(_component_Message, {
                  message: m,
                  key: m.id
                }, null, 8, ["message"]);
              }), 128))
            ]),
            _: 1
          })
        ])
      ])
    ])
  ], 8, _hoisted_1);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0c6a5068"]]);
export {
  index as default
};
