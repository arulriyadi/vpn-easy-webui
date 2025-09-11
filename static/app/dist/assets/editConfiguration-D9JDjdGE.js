import { N as useRoute, r as ref, I as useRouter, D as DashboardConfigurationStore, o as onMounted, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, n as normalizeClass, m as withDirectives, y as vModelText, u as unref, i as createBlock, A as fetchPost, g as fetchGet, _ as _export_sfc, p as useCssVars, q as computed, w as withCtx, e as createCommentVNode, j as Transition, t as toDisplayString, f as createTextVNode, F as Fragment, h as renderList, T as TransitionGroup, E as reactive, W as WireguardConfigurationsStore, H as watch, k as resolveComponent, a7 as resolveDirective, s as normalizeStyle, C as withKeys, J as withModifiers, U as withAsyncContext, v as vModelCheckbox } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
const _hoisted_1$7 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2$6 = { class: "container d-flex h-100 w-100" };
const _hoisted_3$5 = {
  class: "m-auto modal-dialog-centered dashboardModal",
  style: { "width": "700px" }
};
const _hoisted_4$5 = {
  class: "card rounded-3 shadow flex-grow-1 bg-danger-subtle border-danger-subtle",
  id: "deleteConfigurationContainer"
};
const _hoisted_5$5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_6$5 = { class: "mb-0" };
const _hoisted_7$5 = { class: "card-body px-4 text-muted" };
const _hoisted_8$4 = { class: "mb-0" };
const _hoisted_9$4 = { key: 0 };
const _hoisted_10$4 = { key: 1 };
const _hoisted_11$4 = {
  key: 2,
  class: "d-flex align-items-center gap-2"
};
const _hoisted_12$3 = ["placeholder"];
const _hoisted_13$3 = ["disabled"];
const _sfc_main$7 = {
  __name: "deleteConfiguration",
  emits: ["backup", "close"],
  setup(__props, { emit: __emit }) {
    const route = useRoute();
    const configurationName = route.params.id;
    const input = ref("");
    const router = useRouter();
    const store = DashboardConfigurationStore();
    const deleting = ref(false);
    const deleteConfiguration = () => {
      clearInterval(store.Peers.RefreshInterval);
      deleting.value = true;
      fetchPost("/api/deleteWireguardConfiguration", {
        ConfigurationName: configurationName
      }, (res) => {
        if (res.status) {
          router.push("/");
          store.newMessage("Server", "Configuration deleted", "success");
        } else {
          deleting.value = false;
        }
      });
    };
    const loading = ref(true);
    const backups = ref([]);
    const getBackup = () => {
      loading.value = true;
      fetchGet("/api/getWireguardConfigurationBackup", {
        configurationName
      }, (res) => {
        backups.value = res.data;
        loading.value = false;
      });
    };
    onMounted(() => {
      getBackup();
    });
    const emits = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("div", _hoisted_3$5, [
            createBaseVNode("div", _hoisted_4$5, [
              createBaseVNode("div", _hoisted_5$5, [
                createBaseVNode("h5", _hoisted_6$5, [
                  createVNode(LocaleText, { t: "Are you sure to delete this configuration?" })
                ]),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close ms-auto",
                  onClick: _cache[0] || (_cache[0] = ($event) => emits("close"))
                })
              ]),
              createBaseVNode("div", _hoisted_7$5, [
                createBaseVNode("p", _hoisted_8$4, [
                  createVNode(LocaleText, { t: "Once you deleted this configuration:" })
                ]),
                createBaseVNode("ul", null, [
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "All connected peers will get disconnected" })
                  ]),
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "Both configuration file (.conf) and database table related to this configuration will get deleted" })
                  ])
                ]),
                createBaseVNode("div", {
                  class: normalizeClass(["alert", [loading.value ? "alert-secondary" : backups.value.length > 0 ? "alert-success" : "alert-danger"]])
                }, [
                  loading.value ? (openBlock(), createElementBlock("div", _hoisted_9$4, [
                    _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-search me-2" }, null, -1)),
                    createVNode(LocaleText, { t: "Checking backups..." })
                  ])) : backups.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_10$4, [
                    _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-check-circle-fill me-2" }, null, -1)),
                    createVNode(LocaleText, {
                      t: "This configuration have " + backups.value.length + " backups"
                    }, null, 8, ["t"])
                  ])) : (openBlock(), createElementBlock("div", _hoisted_11$4, [
                    _cache[9] || (_cache[9] = createBaseVNode("i", { class: "bi bi-x-circle-fill me-2" }, null, -1)),
                    createVNode(LocaleText, { t: "This configuration have no backup" }),
                    createBaseVNode("a", {
                      role: "button",
                      onClick: _cache[1] || (_cache[1] = ($event) => emits("backup")),
                      class: "ms-auto btn btn-sm btn-primary rounded-3"
                    }, [
                      _cache[7] || (_cache[7] = createBaseVNode("i", { class: "bi bi-clock-history me-2" }, null, -1)),
                      createVNode(LocaleText, { t: "Backup" })
                    ]),
                    createBaseVNode("a", {
                      role: "button",
                      onClick: _cache[2] || (_cache[2] = ($event) => getBackup()),
                      class: "btn btn-sm btn-primary rounded-3"
                    }, _cache[8] || (_cache[8] = [
                      createBaseVNode("i", { class: "bi bi-arrow-clockwise" }, null, -1)
                    ]))
                  ]))
                ], 2),
                _cache[11] || (_cache[11] = createBaseVNode("hr", null, null, -1)),
                createBaseVNode("p", null, [
                  createVNode(LocaleText, { t: "If you're sure, please type in the configuration name below and click Delete" })
                ]),
                withDirectives(createBaseVNode("input", {
                  class: "form-control rounded-3 mb-3",
                  placeholder: unref(configurationName),
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => input.value = $event),
                  type: "text"
                }, null, 8, _hoisted_12$3), [
                  [vModelText, input.value]
                ]),
                createBaseVNode("button", {
                  class: "btn btn-danger w-100",
                  onClick: _cache[4] || (_cache[4] = ($event) => deleteConfiguration()),
                  disabled: input.value !== unref(configurationName) || deleting.value
                }, [
                  _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-trash-fill me-2 rounded-3" }, null, -1)),
                  !deleting.value ? (openBlock(), createBlock(LocaleText, {
                    key: 0,
                    t: "Delete"
                  })) : (openBlock(), createBlock(LocaleText, {
                    key: 1,
                    t: "Deleting..."
                  }))
                ], 8, _hoisted_13$3)
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$6 = { class: "card my-0 rounded-3" };
const _hoisted_2$5 = { class: "card-body position-relative" };
const _hoisted_3$4 = {
  key: 0,
  class: "position-absolute w-100 h-100 confirmationContainer start-0 top-0 rounded-3 d-flex p-2"
};
const _hoisted_4$4 = { class: "m-auto" };
const _hoisted_5$4 = { class: "d-flex gap-2 align-items-center justify-content-center" };
const _hoisted_6$4 = ["disabled"];
const _hoisted_7$4 = ["disabled"];
const _hoisted_8$3 = {
  key: 0,
  class: "position-absolute w-100 h-100 confirmationContainer start-0 top-0 rounded-3 d-flex p-2"
};
const _hoisted_9$3 = { class: "m-auto" };
const _hoisted_10$3 = { class: "d-flex gap-2 align-items-center justify-content-center" };
const _hoisted_11$3 = ["disabled"];
const _hoisted_12$2 = ["disabled"];
const _hoisted_13$2 = { class: "d-flex gap-3" };
const _hoisted_14$1 = { class: "d-flex flex-column" };
const _hoisted_15$1 = { class: "text-muted" };
const _hoisted_16$1 = { class: "d-flex flex-column" };
const _hoisted_17$1 = { class: "text-muted" };
const _hoisted_18$1 = { class: "d-flex gap-2 align-items-center ms-auto" };
const _hoisted_19$1 = { class: "card rounded-3" };
const _hoisted_20$1 = {
  key: 0,
  class: "card-body"
};
const _hoisted_21$1 = ["value"];
const _hoisted_22$1 = { class: "d-flex" };
const _sfc_main$6 = {
  __name: "backup",
  props: ["b", "delay"],
  emits: ["refresh", "refreshPeersList"],
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "b32c1fd8": delaySeconds.value
    }));
    const props = __props;
    const deleteConfirmation = ref(false);
    const restoreConfirmation = ref(false);
    const route = useRoute();
    const emit = __emit;
    const store = DashboardConfigurationStore();
    const loading = ref(false);
    const deleteBackup = () => {
      loading.value = true;
      fetchPost("/api/deleteWireguardConfigurationBackup", {
        ConfigurationName: route.params.id,
        BackupFileName: props.b.filename
      }, (res) => {
        loading.value = false;
        if (res.status) {
          emit("refresh");
          store.newMessage("Server", "Backup deleted", "success");
        } else {
          store.newMessage("Server", "Backup failed to delete", "danger");
        }
      });
    };
    const restoreBackup = () => {
      loading.value = true;
      fetchPost("/api/restoreWireguardConfigurationBackup", {
        ConfigurationName: route.params.id,
        BackupFileName: props.b.filename
      }, (res) => {
        loading.value = false;
        restoreConfirmation.value = false;
        if (res.status) {
          emit("refreshPeersList");
          store.newMessage("Server", "Backup restored with " + props.b.filename, "success");
        } else {
          store.newMessage("Server", "Backup failed to restore", "danger");
        }
      });
    };
    const downloadBackup = () => {
      fetchGet("/api/downloadWireguardConfigurationBackup", {
        configurationName: route.params.id,
        backupFileName: props.b.filename
      }, (res) => {
        if (res.status) {
          window.open(`/fileDownload?file=${res.data}`, "_blank");
        }
      });
    };
    const delaySeconds = computed(() => {
      return props.delay + "s";
    });
    const showContent = ref(false);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", _hoisted_2$5, [
          createVNode(Transition, { name: "zoomReversed" }, {
            default: withCtx(() => [
              deleteConfirmation.value ? (openBlock(), createElementBlock("div", _hoisted_3$4, [
                createBaseVNode("div", _hoisted_4$4, [
                  createBaseVNode("h5", null, [
                    createVNode(LocaleText, { t: "Are you sure to delete this backup?" })
                  ]),
                  createBaseVNode("div", _hoisted_5$4, [
                    createBaseVNode("button", {
                      class: "btn btn-danger rounded-3",
                      disabled: loading.value,
                      onClick: _cache[0] || (_cache[0] = ($event) => deleteBackup())
                    }, [
                      createVNode(LocaleText, { t: "Yes" })
                    ], 8, _hoisted_6$4),
                    createBaseVNode("button", {
                      onClick: _cache[1] || (_cache[1] = ($event) => deleteConfirmation.value = false),
                      disabled: loading.value,
                      class: "btn bg-secondary-subtle text-secondary-emphasis border-secondary-subtle rounded-3"
                    }, [
                      createVNode(LocaleText, { t: "No" })
                    ], 8, _hoisted_7$4)
                  ])
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createVNode(Transition, { name: "zoomReversed" }, {
            default: withCtx(() => [
              restoreConfirmation.value ? (openBlock(), createElementBlock("div", _hoisted_8$3, [
                createBaseVNode("div", _hoisted_9$3, [
                  createBaseVNode("h5", null, [
                    createVNode(LocaleText, { t: "Are you sure to restore this backup?" })
                  ]),
                  createBaseVNode("div", _hoisted_10$3, [
                    createBaseVNode("button", {
                      disabled: loading.value,
                      onClick: _cache[2] || (_cache[2] = ($event) => restoreBackup()),
                      class: "btn btn-success rounded-3"
                    }, [
                      createVNode(LocaleText, { t: "Yes" })
                    ], 8, _hoisted_11$3),
                    createBaseVNode("button", {
                      onClick: _cache[3] || (_cache[3] = ($event) => restoreConfirmation.value = false),
                      disabled: loading.value,
                      class: "btn bg-secondary-subtle text-secondary-emphasis border-secondary-subtle rounded-3"
                    }, [
                      createVNode(LocaleText, { t: "No" })
                    ], 8, _hoisted_12$2)
                  ])
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_13$2, [
            createBaseVNode("div", _hoisted_14$1, [
              createBaseVNode("small", _hoisted_15$1, [
                createVNode(LocaleText, { t: "Backup" })
              ]),
              createBaseVNode("samp", null, toDisplayString(__props.b.filename), 1)
            ]),
            createBaseVNode("div", _hoisted_16$1, [
              createBaseVNode("small", _hoisted_17$1, [
                createVNode(LocaleText, { t: "Backup Date" })
              ]),
              createTextVNode(" " + toDisplayString(unref(dayjs)(__props.b.backupDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")), 1)
            ]),
            createBaseVNode("div", _hoisted_18$1, [
              createBaseVNode("button", {
                onClick: _cache[4] || (_cache[4] = ($event) => downloadBackup()),
                class: "btn bg-primary-subtle text-primary-emphasis border-primary-subtle rounded-3 btn-sm"
              }, _cache[8] || (_cache[8] = [
                createBaseVNode("i", { class: "bi bi-download" }, null, -1)
              ])),
              createBaseVNode("button", {
                onClick: _cache[5] || (_cache[5] = ($event) => restoreConfirmation.value = true),
                class: "btn bg-warning-subtle text-warning-emphasis border-warning-subtle rounded-3 btn-sm"
              }, _cache[9] || (_cache[9] = [
                createBaseVNode("i", { class: "bi bi-clock-history" }, null, -1)
              ])),
              createBaseVNode("button", {
                onClick: _cache[6] || (_cache[6] = ($event) => deleteConfirmation.value = true),
                class: "btn bg-danger-subtle text-danger-emphasis border-danger-subtle rounded-3 btn-sm"
              }, _cache[10] || (_cache[10] = [
                createBaseVNode("i", { class: "bi bi-trash-fill" }, null, -1)
              ]))
            ])
          ]),
          _cache[14] || (_cache[14] = createBaseVNode("hr", null, null, -1)),
          createBaseVNode("div", _hoisted_19$1, [
            createBaseVNode("a", {
              role: "button",
              class: normalizeClass(["card-header d-flex text-decoration-none align-items-center", { "border-bottom-0": !showContent.value }]),
              style: { "cursor": "pointer" },
              onClick: _cache[7] || (_cache[7] = ($event) => showContent.value = !showContent.value)
            }, [
              createBaseVNode("small", null, [
                _cache[11] || (_cache[11] = createTextVNode(".conf ")),
                createVNode(LocaleText, { t: "File" })
              ]),
              _cache[12] || (_cache[12] = createBaseVNode("i", { class: "bi bi-chevron-down ms-auto" }, null, -1))
            ], 2),
            showContent.value ? (openBlock(), createElementBlock("div", _hoisted_20$1, [
              createBaseVNode("textarea", {
                class: "form-control rounded-3",
                value: __props.b.content,
                disabled: "",
                style: { "height": "300px", "font-family": "var(--bs-font-monospace),sans-serif !important" }
              }, null, 8, _hoisted_21$1)
            ])) : createCommentVNode("", true)
          ]),
          _cache[15] || (_cache[15] = createBaseVNode("hr", null, null, -1)),
          createBaseVNode("div", _hoisted_22$1, [
            createBaseVNode("span", null, [
              _cache[13] || (_cache[13] = createBaseVNode("i", { class: "bi bi-database me-1" }, null, -1)),
              createVNode(LocaleText, { t: "Database File" })
            ]),
            createBaseVNode("i", {
              class: normalizeClass(["bi ms-auto", [__props.b.database ? "text-success bi-check-circle-fill" : "text-danger bi-x-circle-fill"]])
            }, null, 2)
          ])
        ])
      ]);
    };
  }
};
const Backup = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-9f0c0156"]]);
const _hoisted_1$5 = {
  class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll",
  ref: "editConfigurationContainer"
};
const _hoisted_2$4 = { class: "d-flex h-100 w-100" };
const _hoisted_3$3 = { class: "modal-dialog-centered dashboardModal w-100 h-100 overflow-x-scroll flex-column gap-3 mx-3" };
const _hoisted_4$3 = { class: "my-5 d-flex gap-3 flex-column position-relative" };
const _hoisted_5$3 = { class: "title" };
const _hoisted_6$3 = { class: "d-flex mb-3" };
const _hoisted_7$3 = { class: "mb-0" };
const _hoisted_8$2 = { class: "position-relative d-flex flex-column gap-3" };
const _hoisted_9$2 = {
  class: "text-center title",
  key: "spinner"
};
const _hoisted_10$2 = {
  class: "card my-0 rounded-3",
  key: "noBackups"
};
const _hoisted_11$2 = { class: "card-body text-center text-muted" };
const _sfc_main$5 = {
  __name: "configurationBackupRestore",
  emits: ["close", "refreshPeersList"],
  setup(__props, { emit: __emit }) {
    const route = useRoute();
    const backups = ref([]);
    const loading = ref(true);
    const emit = __emit;
    onMounted(() => {
      loadBackup();
    });
    const loadBackup = () => {
      loading.value = true;
      fetchGet("/api/getWireguardConfigurationBackup", {
        configurationName: route.params.id
      }, (res) => {
        backups.value = res.data;
        loading.value = false;
      });
    };
    const createBackup = () => {
      fetchGet("/api/createWireguardConfigurationBackup", {
        configurationName: route.params.id
      }, (res) => {
        backups.value = res.data;
        loading.value = false;
      });
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", _hoisted_3$3, [
            createBaseVNode("div", _hoisted_4$3, [
              createBaseVNode("div", _hoisted_5$3, [
                createBaseVNode("div", _hoisted_6$3, [
                  createBaseVNode("h4", _hoisted_7$3, [
                    createVNode(LocaleText, { t: "Backup & Restore" })
                  ]),
                  createBaseVNode("button", {
                    type: "button",
                    class: "btn-close ms-auto",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
                  })
                ]),
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => createBackup()),
                  class: "btn bg-primary-subtle text-primary-emphasis border-primary-subtle rounded-3 w-100"
                }, [
                  _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-plus-circle-fill me-2" }, null, -1)),
                  createVNode(LocaleText, { t: "Create Backup" })
                ])
              ]),
              createBaseVNode("div", _hoisted_8$2, [
                createVNode(TransitionGroup, { name: "list1" }, {
                  default: withCtx(() => [
                    loading.value && backups.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_9$2, _cache[5] || (_cache[5] = [
                      createBaseVNode("div", { class: "spinner-border" }, null, -1)
                    ]))) : !loading.value && backups.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_10$2, [
                      createBaseVNode("div", _hoisted_11$2, [
                        _cache[6] || (_cache[6] = createBaseVNode("i", { class: "bi bi-x-circle-fill me-2" }, null, -1)),
                        createVNode(LocaleText, { t: "No backup yet, click the button above to create backup." })
                      ])
                    ])) : createCommentVNode("", true),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(backups.value, (b) => {
                      return openBlock(), createBlock(Backup, {
                        onRefresh: _cache[2] || (_cache[2] = ($event) => loadBackup()),
                        onRefreshPeersList: _cache[3] || (_cache[3] = ($event) => emit("refreshPeersList")),
                        b,
                        key: b.filename
                      }, null, 8, ["b"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ])
            ])
          ])
        ])
      ], 512);
    };
  }
};
const ConfigurationBackupRestore = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1f718118"]]);
const _hoisted_1$4 = { class: "card rounded-3 flex-grow-1 bg-danger-subtle border-danger-subtle border shadow" };
const _hoisted_2$3 = { class: "card-body" };
const _hoisted_3$2 = { class: "d-flex align-items-center gap-3 inputGroup" };
const _hoisted_4$2 = ["value"];
const _hoisted_5$2 = { class: "mb-0" };
const _hoisted_6$2 = { class: "d-flex mt-3" };
const _hoisted_7$2 = ["disabled"];
const _sfc_main$4 = {
  __name: "updateConfigurationName",
  props: {
    configurationName: String
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const newConfigurationName = reactive({
      data: "",
      valid: false
    });
    const store = WireguardConfigurationsStore();
    onMounted(() => {
      watch(() => newConfigurationName.data, (newVal) => {
        newConfigurationName.valid = /^[a-zA-Z0-9_=+.-]{1,15}$/.test(newVal) && newVal.length > 0 && !store.Configurations.find((x) => x.Name === newVal);
      });
    });
    const dashboardConfigurationStore = DashboardConfigurationStore();
    const loading = ref(false);
    const router = useRouter();
    const rename = async () => {
      if (newConfigurationName.data) {
        loading.value = true;
        clearInterval(dashboardConfigurationStore.Peers.RefreshInterval);
        await fetchPost("/api/renameWireguardConfiguration", {
          ConfigurationName: props.configurationName,
          NewConfigurationName: newConfigurationName.data
        }, async (res) => {
          if (res.status) {
            await store.getConfigurations();
            dashboardConfigurationStore.newMessage("Server", "Configuration renamed", "success");
            router.push(`/configuration/${newConfigurationName.data}/peers`);
          } else {
            dashboardConfigurationStore.newMessage("Server", res.message, "danger");
            loading.value = false;
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("p", null, [
            createVNode(LocaleText, { t: "To update this configuration's name, WGDashboard will execute the following operations:" })
          ]),
          createBaseVNode("ol", null, [
            createBaseVNode("li", null, [
              createVNode(LocaleText, { t: "Duplicate current configuration's database table and .conf file with the new name" })
            ]),
            createBaseVNode("li", null, [
              createVNode(LocaleText, { t: "Delete current configuration's database table and .conf file" })
            ])
          ]),
          createBaseVNode("div", _hoisted_3$2, [
            createBaseVNode("input", {
              class: "form-control form-control-sm rounded-3",
              value: __props.configurationName,
              disabled: ""
            }, null, 8, _hoisted_4$2),
            _cache[3] || (_cache[3] = createBaseVNode("h3", { class: "mb-0" }, [
              createBaseVNode("i", { class: "bi bi-arrow-right" })
            ], -1)),
            withDirectives(createBaseVNode("input", {
              class: normalizeClass(["form-control form-control-sm rounded-3", [newConfigurationName.data ? newConfigurationName.valid ? "is-valid" : "is-invalid" : ""]]),
              id: "newConfigurationName",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => newConfigurationName.data = $event)
            }, null, 2), [
              [vModelText, newConfigurationName.data]
            ])
          ]),
          createBaseVNode("div", {
            class: normalizeClass(["invalid-feedback", { "d-block": !newConfigurationName.valid && newConfigurationName.data }])
          }, [
            createVNode(LocaleText, { t: "Configuration name is invalid. Possible reasons:" }),
            createBaseVNode("ul", _hoisted_5$2, [
              createBaseVNode("li", null, [
                createVNode(LocaleText, { t: "Configuration name already exist" })
              ]),
              createBaseVNode("li", null, [
                createVNode(LocaleText, { t: "Configuration name can only contain 15 lower/uppercase alphabet, numbers, underscore, equal sign, plus sign, period and hyphen." })
              ])
            ])
          ], 2),
          createBaseVNode("div", _hoisted_6$2, [
            createBaseVNode("button", {
              onClick: _cache[1] || (_cache[1] = ($event) => emit("close")),
              class: "btn btn-sm bg-secondary-subtle border-secondary-subtle text-secondary-emphasis rounded-3"
            }, [
              createVNode(LocaleText, { t: "Cancel" })
            ]),
            createBaseVNode("button", {
              onClick: _cache[2] || (_cache[2] = ($event) => rename()),
              disabled: !newConfigurationName.data || loading.value,
              class: "btn btn-sm btn-danger rounded-3 ms-auto"
            }, [
              createVNode(LocaleText, { t: "Save" })
            ], 8, _hoisted_7$2)
          ])
        ])
      ]);
    };
  }
};
const UpdateConfigurationName = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-33ea9576"]]);
const _sfc_main$3 = {
  name: "Dropdown",
  props: {
    width: {
      type: String,
      default: "80px"
    },
    height: {
      type: String,
      default: "auto"
    },
    title: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    defaultDisplay: {
      type: Boolean,
      default: false
    }
  }
};
const _hoisted_1$3 = { class: "title" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["dropdown", { disabled: $props.disabled }]),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.toggleDropdown && _ctx.toggleDropdown(...args)),
    onFocusout: _cache[1] || (_cache[1] = (...args) => _ctx.hideDropdown && _ctx.hideDropdown(...args)),
    tabindex: "0"
  }, [
    createBaseVNode("div", _hoisted_1$3, [
      createBaseVNode("div", null, toDisplayString($props.title), 1)
    ])
  ], 34);
}
const Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1]]);
const _sfc_main$2 = {
  components: {
    Dropdown
  },
  name: "CodeEditor",
  props: {
    lineNums: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String
    },
    value: {
      type: String
    },
    theme: {
      type: String,
      default: "github-dark"
    },
    tabSpaces: {
      type: Number,
      default: 2
    },
    wrap: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    header: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "540px"
    },
    height: {
      type: String,
      default: "auto"
    },
    maxWidth: {
      type: String
    },
    minWidth: {
      type: String
    },
    maxHeight: {
      type: String
    },
    minHeight: {
      type: String
    },
    borderRadius: {
      type: String,
      default: "12px"
    },
    languages: {
      type: Array,
      default: function() {
        return [["javascript", "JS"]];
      }
    },
    langListWidth: {
      type: String,
      default: "110px"
    },
    langListHeight: {
      type: String,
      default: "auto"
    },
    langListDisplay: {
      type: Boolean,
      default: false
    },
    displayLanguage: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: String,
      default: "0"
    },
    fontSize: {
      type: String,
      default: "17px"
    },
    padding: {
      type: String,
      default: "20px"
    }
  },
  directives: {
    highlight: {
      mounted(el, binding) {
        el.textContent = binding.value;
      },
      updated(el, binding) {
        if (el.scrolling) {
          el.scrolling = false;
        } else {
          el.textContent = binding.value;
        }
      }
    }
  },
  data() {
    return {
      scrollBarWidth: 0,
      scrollBarHeight: 0,
      top: 0,
      left: 0,
      languageClass: "hljs language-" + this.languages[0][0],
      languageTitle: this.languages[0][1] ? this.languages[0][1] : this.languages[0][0],
      content: this.value,
      cursorPosition: 0,
      insertTab: false,
      lineNum: 0,
      lineNumsWidth: 0,
      scrolling: false,
      textareaHeight: 0,
      showLineNums: this.wrap ? false : this.lineNums
    };
  },
  computed: {
    tabWidth() {
      let result = "";
      for (let i = 0; i < this.tabSpaces; i++) {
        result += " ";
      }
      return result;
    },
    contentValue() {
      return this.modelValue == void 0 ? this.content + "\n" : this.modelValue + "\n";
    },
    scroll() {
      return this.height == "auto" ? false : true;
    }
  },
  methods: {
    updateValue(e) {
      if (this.modelValue == void 0) {
        this.content = e.target.value;
      } else {
        this.$emit("update:modelValue", e.target.value);
      }
    },
    changeLang(lang) {
      this.languageTitle = lang[1] ? lang[1] : lang[0];
      this.languageClass = "language-" + lang[0];
      this.$emit("lang", lang[0]);
    },
    tab() {
      if (document.execCommand("insertText")) {
        document.execCommand("insertText", false, this.tabWidth);
      } else {
        const cursorPosition = this.$refs.textarea.selectionStart;
        this.content = this.content.substring(0, cursorPosition) + this.tabWidth + this.content.substring(cursorPosition);
        this.cursorPosition = cursorPosition + this.tabWidth.length;
        this.insertTab = true;
      }
    },
    calcScrollDistance(e) {
      this.$refs.code.scrolling = true;
      this.scrolling = true;
      this.top = -e.target.scrollTop;
      this.left = -e.target.scrollLeft;
    },
    resizer() {
      const textareaResizer = new ResizeObserver((entries) => {
        this.scrollBarWidth = entries[0].target.offsetWidth - entries[0].target.clientWidth;
        this.scrollBarHeight = entries[0].target.offsetHeight - entries[0].target.clientHeight;
        this.textareaHeight = entries[0].target.offsetHeight;
      });
      textareaResizer.observe(this.$refs.textarea);
      const lineNumsResizer = new ResizeObserver((entries) => {
        this.lineNumsWidth = entries[0].target.offsetWidth;
      });
      if (this.$refs.lineNums) {
        lineNumsResizer.observe(this.$refs.lineNums);
      }
    },
    copy() {
      if (document.execCommand("copy")) {
        this.$refs.textarea.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
      } else {
        navigator.clipboard.writeText(this.$refs.textarea.value);
      }
    },
    getLineNum() {
      const str = this.$refs.textarea.value;
      let lineNum = 0;
      let position = str.indexOf("\n");
      while (position !== -1) {
        lineNum++;
        position = str.indexOf("\n", position + 1);
      }
      const singleLineHeight = this.$refs.lineNums.firstChild.offsetHeight;
      const heightNum = parseInt(this.textareaHeight / singleLineHeight) - 1;
      this.lineNum = this.height == "auto" ? lineNum : lineNum > heightNum ? lineNum : heightNum;
    }
  },
  mounted() {
    this.$emit("lang", this.languages[0][0]);
    this.$emit("content", this.content);
    this.$emit("textarea", this.$refs.textarea);
    this.resizer();
  },
  updated() {
    if (this.insertTab) {
      this.$refs.textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      this.insertTab = false;
    }
    if (this.lineNums) {
      if (this.scrolling) {
        this.scrolling = false;
      } else {
        this.getLineNum();
      }
    }
  }
};
const _hoisted_1$2 = ["theme"];
const _hoisted_2$2 = ["readOnly", "autofocus", "value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Dropdown = resolveComponent("Dropdown");
  const _directive_highlight = resolveDirective("highlight");
  return openBlock(), createElementBlock("div", {
    theme: $props.theme,
    class: normalizeClass(["code-editor", {
      "hide-header": !$props.header,
      scroll: $options.scroll,
      "read-only": $props.readOnly,
      wrap: $props.wrap
    }]),
    style: normalizeStyle({
      width: $props.width,
      height: $props.height,
      zIndex: $props.zIndex,
      maxWidth: $props.maxWidth,
      minWidth: $props.minWidth,
      maxHeight: $props.maxHeight,
      minHeight: $props.minHeight
    })
  }, [
    createBaseVNode("div", {
      class: "hljs",
      style: normalizeStyle({ borderRadius: $props.borderRadius })
    }, [
      $props.header ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["header", { border: $data.showLineNums }]),
        style: normalizeStyle({ borderRadius: $props.borderRadius + " " + $props.borderRadius + " 0 0" })
      }, [
        $props.displayLanguage ? (openBlock(), createBlock(_component_Dropdown, {
          key: 0,
          width: $props.langListWidth,
          title: $data.languageTitle,
          disabled: $props.languages.length <= 1,
          defaultDisplay: $props.langListDisplay
        }, null, 8, ["width", "title", "disabled", "defaultDisplay"])) : createCommentVNode("", true)
      ], 6)) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: "code-area",
        style: normalizeStyle({ borderRadius: $props.header ? "0 0 " + $props.borderRadius + " " + $props.borderRadius : $props.borderRadius })
      }, [
        $data.showLineNums ? (openBlock(), createElementBlock("div", {
          key: 0,
          ref: "lineNums",
          class: "line-nums hljs",
          style: normalizeStyle({
            fontSize: $props.fontSize,
            paddingTop: $props.header ? "10px" : $props.padding,
            paddingBottom: $props.padding,
            top: $data.top + "px"
          })
        }, [
          _cache[3] || (_cache[3] = createBaseVNode("div", null, "1", -1)),
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.lineNum, (num) => {
            return openBlock(), createElementBlock("div", null, toDisplayString(num + 1), 1);
          }), 256)),
          _cache[4] || (_cache[4] = createBaseVNode("div", null, " ", -1))
        ], 4)) : createCommentVNode("", true),
        createBaseVNode("textarea", {
          title: "textarea",
          readOnly: $props.readOnly,
          style: normalizeStyle({
            fontSize: $props.fontSize,
            padding: !$props.header ? $props.padding : $props.lineNums ? "10px " + $props.padding + " " + $props.padding : "0 " + $props.padding + " " + $props.padding,
            marginLeft: $data.showLineNums ? $data.lineNumsWidth + "px" : "0",
            width: $data.showLineNums ? "calc(100% - " + $data.lineNumsWidth + "px)" : "100%"
          }),
          ref: "textarea",
          autofocus: $props.autofocus,
          spellcheck: "false",
          onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers((...args) => $options.tab && $options.tab(...args), ["prevent", "stop"]), ["tab"])),
          onScroll: _cache[1] || (_cache[1] = (...args) => $options.calcScrollDistance && $options.calcScrollDistance(...args)),
          value: $props.modelValue == void 0 ? $data.content : $props.modelValue,
          onInput: _cache[2] || (_cache[2] = (...args) => $options.updateValue && $options.updateValue(...args))
        }, null, 44, _hoisted_2$2),
        createBaseVNode("pre", {
          style: normalizeStyle({
            paddingRight: $data.scrollBarWidth + "px",
            paddingBottom: $data.scrollBarHeight + "px",
            marginLeft: $data.showLineNums ? $data.lineNumsWidth + "px" : "0",
            width: $data.showLineNums ? "calc(100% - " + $data.lineNumsWidth + "px)" : "100%"
          })
        }, [
          _cache[6] || (_cache[6] = createTextVNode("        ")),
          withDirectives((openBlock(), createElementBlock("code", {
            ref: "code",
            class: normalizeClass($data.languageClass),
            style: normalizeStyle({
              top: $data.top + "px",
              left: $data.left + "px",
              fontSize: $props.fontSize,
              padding: !$props.header ? $props.padding : $props.lineNums ? "10px " + $props.padding + " " + $props.padding : "0 " + $props.padding + " " + $props.padding
            })
          }, _cache[5] || (_cache[5] = [
            createTextVNode("\n        ")
          ]), 6)), [
            [_directive_highlight, $options.contentValue]
          ]),
          _cache[7] || (_cache[7] = createTextVNode("\n      "))
        ], 4)
      ], 4)
    ], 4)
  ], 14, _hoisted_1$2);
}
const CodeEditor = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
const _hoisted_1$1 = { class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll" };
const _hoisted_2$1 = { class: "container d-flex h-100 w-100" };
const _hoisted_3$1 = {
  class: "m-auto modal-dialog-centered dashboardModal",
  style: { "width": "1000px" }
};
const _hoisted_4$1 = {
  class: "card rounded-3 shadow flex-grow-1",
  id: "deleteConfigurationContainer"
};
const _hoisted_5$1 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4 pb-0" };
const _hoisted_6$1 = { class: "mb-0" };
const _hoisted_7$1 = { class: "card-body px-4 d-flex flex-column gap-3" };
const _hoisted_8$1 = {
  key: 0,
  class: "alert alert-danger rounded-3 mb-0"
};
const _hoisted_9$1 = { class: "mb-2" };
const _hoisted_10$1 = { class: "bg-body w-100 p-2 rounded-3" };
const _hoisted_11$1 = { class: "d-flex gap-2" };
const _hoisted_12$1 = ["disabled"];
const _hoisted_13$1 = ["disabled"];
const _sfc_main$1 = {
  __name: "editRawConfigurationFile",
  emits: ["close"],
  async setup(__props, { emit: __emit }) {
    let __temp, __restore;
    const emits = __emit;
    const route = useRoute();
    const content = ref("");
    const path = ref("");
    const error = ref(false);
    const errorMessage = ref("");
    const getRaw = async () => {
      await fetchGet("/api/getWireguardConfigurationRawFile", {
        configurationName: route.params.id
      }, (res) => {
        content.value = res.data.content;
        path.value = res.data.path;
      });
    };
    [__temp, __restore] = withAsyncContext(() => getRaw()), await __temp, __restore();
    const dashboardStore = DashboardConfigurationStore();
    const saving = ref(false);
    const saveRaw = async () => {
      saving.value = true;
      await fetchPost("/api/updateWireguardConfigurationRawFile", {
        configurationName: route.params.id,
        rawConfiguration: content.value
      }, (res) => {
        if (res.status) {
          error.value = false;
          dashboardStore.newMessage("Server", "Configuration saved", "success");
        } else {
          error.value = true;
          errorMessage.value = res.message;
        }
        saving.value = false;
      });
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("div", _hoisted_4$1, [
              createBaseVNode("div", _hoisted_5$1, [
                createBaseVNode("h5", _hoisted_6$1, [
                  createVNode(LocaleText, { t: "Edit Raw Configuration File" })
                ]),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close ms-auto",
                  onClick: _cache[0] || (_cache[0] = ($event) => emits("close"))
                })
              ]),
              createBaseVNode("div", _hoisted_7$1, [
                error.value ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
                  createBaseVNode("div", _hoisted_9$1, [
                    createBaseVNode("strong", null, [
                      createVNode(LocaleText, { t: "Failed to save configuration. Please see the following error message:" })
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_10$1, [
                    createBaseVNode("pre", null, toDisplayString(errorMessage.value), 1)
                  ])
                ])) : createCommentVNode("", true),
                createVNode(CodeEditor, {
                  disabled: true,
                  "read-only": saving.value,
                  modelValue: content.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => content.value = $event),
                  theme: unref(dashboardStore).Configuration.Server.dashboard_theme === "dark" ? "github-dark" : "github",
                  languages: [["ini", path.value]],
                  width: "100%",
                  height: "600px"
                }, null, 8, ["read-only", "modelValue", "theme", "languages"]),
                createBaseVNode("div", _hoisted_11$1, [
                  createBaseVNode("button", {
                    class: "btn bg-secondary-subtle border-secondary-subtle text-secondary-emphasis rounded-3 shadow ms-auto px-3 py-2",
                    disabled: saving.value,
                    onClick: _cache[2] || (_cache[2] = ($event) => getRaw())
                  }, [
                    _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-arrow-clockwise me-2" }, null, -1)),
                    createVNode(LocaleText, { t: "Reset" })
                  ], 8, _hoisted_12$1),
                  createBaseVNode("button", {
                    onClick: _cache[3] || (_cache[3] = ($event) => saveRaw()),
                    disabled: saving.value,
                    class: "btn bg-danger-subtle border-danger-subtle text-danger-emphasis rounded-3 px-3 py-2 shadow"
                  }, [
                    _cache[5] || (_cache[5] = createBaseVNode("i", { class: "bi bi-save-fill me-2" }, null, -1)),
                    !saving.value ? (openBlock(), createBlock(LocaleText, {
                      key: 0,
                      t: "Save"
                    })) : (openBlock(), createBlock(LocaleText, {
                      key: 1,
                      t: "Saving..."
                    }))
                  ], 8, _hoisted_13$1)
                ])
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1 = {
  class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0",
  ref: "editConfigurationContainer"
};
const _hoisted_2 = { class: "w-100 h-100 overflow-y-scroll" };
const _hoisted_3 = { class: "container d-flex h-100 w-100" };
const _hoisted_4 = {
  class: "m-auto modal-dialog-centered dashboardModal",
  style: { "width": "700px" }
};
const _hoisted_5 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_6 = { class: "card-header bg-transparent d-flex align-items-center gap-2 border-0 p-4" };
const _hoisted_7 = { class: "mb-0" };
const _hoisted_8 = { class: "card-body px-4 pb-4" };
const _hoisted_9 = { class: "d-flex gap-2 flex-column" };
const _hoisted_10 = {
  key: 0,
  class: "d-flex align-items-center gap-3"
};
const _hoisted_11 = { class: "text-muted" };
const _hoisted_12 = { class: "d-flex align-items-center gap-3" };
const _hoisted_13 = {
  class: "text-muted",
  style: { "word-break": "keep-all" }
};
const _hoisted_14 = {
  class: "ms-auto",
  style: { "word-break": "break-all" }
};
const _hoisted_15 = { class: "d-flex" };
const _hoisted_16 = {
  for: "configuration_private_key",
  class: "form-label"
};
const _hoisted_17 = { class: "text-muted d-block" };
const _hoisted_18 = { class: "form-check form-switch ms-auto" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = {
  for: "configuration_ipaddress_cidr",
  class: "form-label"
};
const _hoisted_21 = { class: "text-muted" };
const _hoisted_22 = ["disabled"];
const _hoisted_23 = {
  for: "configuration_listen_port",
  class: "form-label"
};
const _hoisted_24 = { class: "text-muted" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = {
  class: "accordion mt-2",
  id: "editConfigurationOptionalAccordion"
};
const _hoisted_27 = { class: "accordion-item" };
const _hoisted_28 = { class: "accordion-header" };
const _hoisted_29 = {
  class: "accordion-button collapsed px-3 py-2",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#editOptionalAccordionCollapse"
};
const _hoisted_30 = { class: "text-muted" };
const _hoisted_31 = {
  id: "editOptionalAccordionCollapse",
  class: "accordion-collapse collapse",
  "data-bs-parent": "#editConfigurationOptionalAccordion"
};
const _hoisted_32 = { class: "accordion-body d-flex flex-column gap-3" };
const _hoisted_33 = ["for"];
const _hoisted_34 = { class: "text-muted" };
const _hoisted_35 = ["disabled", "onUpdate:modelValue", "id"];
const _hoisted_36 = ["for"];
const _hoisted_37 = { class: "text-muted" };
const _hoisted_38 = ["disabled", "onUpdate:modelValue", "id"];
const _hoisted_39 = { class: "d-flex align-items-center gap-2 mt-4" };
const _hoisted_40 = ["disabled"];
const _hoisted_41 = ["disabled"];
const _hoisted_42 = { class: "mb-3" };
const _hoisted_43 = { class: "d-flex gap-2 flex-column" };
const _sfc_main = {
  __name: "editConfiguration",
  props: {
    configurationInfo: Object
  },
  emits: ["changed", "close", "refresh", "dataChanged"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const wgStore = WireguardConfigurationsStore();
    const store = DashboardConfigurationStore();
    const saving = ref(false);
    const data = reactive(JSON.parse(JSON.stringify(props.configurationInfo)));
    const editPrivateKey = ref(false);
    const dataChanged = ref(false);
    const reqField = reactive({
      PrivateKey: true,
      IPAddress: true,
      ListenPort: true
    });
    const genKey = () => {
      if (wgStore.checkWGKeyLength(data.PrivateKey)) {
        reqField.PrivateKey = true;
        data.PublicKey = window.wireguard.generatePublicKey(data.PrivateKey);
      } else {
        reqField.PrivateKey = false;
      }
    };
    const resetForm = () => {
      dataChanged.value = false;
      Object.assign(data, JSON.parse(JSON.stringify(props.configurationInfo)));
    };
    const emit = __emit;
    const saveForm = () => {
      saving.value = true;
      fetchPost("/api/updateWireguardConfiguration", data, (res) => {
        saving.value = false;
        if (res.status) {
          store.newMessage("Server", "Configuration saved", "success");
          dataChanged.value = false;
          emit("dataChanged", res.data);
        } else {
          store.newMessage("Server", res.message, "danger");
        }
      });
    };
    const updateConfigurationName = ref(false);
    watch(data, () => {
      dataChanged.value = JSON.stringify(data) !== JSON.stringify(props.configurationInfo);
    }, {
      deep: true
    });
    const editRawConfigurationFileModal = ref(false);
    const backupRestoreModal = ref(false);
    const deleteConfigurationModal = ref(false);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(TransitionGroup, { name: "zoom" }, {
            default: withCtx(() => [
              editRawConfigurationFileModal.value ? (openBlock(), createBlock(_sfc_main$1, {
                key: 0,
                name: "EditRawConfigurationFile",
                onClose: _cache[0] || (_cache[0] = ($event) => editRawConfigurationFileModal.value = false)
              })) : createCommentVNode("", true),
              deleteConfigurationModal.value ? (openBlock(), createBlock(_sfc_main$7, {
                key: "DeleteConfiguration",
                onBackup: _cache[1] || (_cache[1] = ($event) => backupRestoreModal.value = true),
                onClose: _cache[2] || (_cache[2] = ($event) => deleteConfigurationModal.value = false)
              })) : createCommentVNode("", true),
              backupRestoreModal.value ? (openBlock(), createBlock(ConfigurationBackupRestore, {
                key: 2,
                onClose: _cache[3] || (_cache[3] = ($event) => backupRestoreModal.value = false),
                onRefreshPeersList: _cache[4] || (_cache[4] = ($event) => emit("refresh"))
              })) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("div", _hoisted_6, [
                  createBaseVNode("h4", _hoisted_7, [
                    createVNode(LocaleText, { t: "Configuration Settings" })
                  ]),
                  createBaseVNode("button", {
                    type: "button",
                    class: "btn-close ms-auto",
                    onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("close"))
                  })
                ]),
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("div", _hoisted_9, [
                    !updateConfigurationName.value ? (openBlock(), createElementBlock("div", _hoisted_10, [
                      createBaseVNode("small", _hoisted_11, [
                        createVNode(LocaleText, { t: "Name" })
                      ]),
                      createBaseVNode("small", null, toDisplayString(data.Name), 1),
                      createBaseVNode("button", {
                        onClick: _cache[6] || (_cache[6] = ($event) => updateConfigurationName.value = true),
                        class: "btn btn-sm bg-danger-subtle border-danger-subtle text-danger-emphasis rounded-3 ms-auto"
                      }, [
                        createVNode(LocaleText, { t: "Update Name" })
                      ])
                    ])) : createCommentVNode("", true),
                    updateConfigurationName.value ? (openBlock(), createBlock(UpdateConfigurationName, {
                      key: 1,
                      onClose: _cache[7] || (_cache[7] = ($event) => updateConfigurationName.value = false),
                      "configuration-name": data.Name
                    }, null, 8, ["configuration-name"])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                      _cache[24] || (_cache[24] = createBaseVNode("hr", null, null, -1)),
                      createBaseVNode("div", _hoisted_12, [
                        createBaseVNode("small", _hoisted_13, [
                          createVNode(LocaleText, { t: "Public Key" })
                        ]),
                        createBaseVNode("small", _hoisted_14, toDisplayString(data.PublicKey), 1)
                      ]),
                      _cache[25] || (_cache[25] = createBaseVNode("hr", null, null, -1)),
                      createBaseVNode("div", null, [
                        createBaseVNode("div", _hoisted_15, [
                          createBaseVNode("label", _hoisted_16, [
                            createBaseVNode("small", _hoisted_17, [
                              createVNode(LocaleText, { t: "Private Key" })
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_18, [
                            withDirectives(createBaseVNode("input", {
                              class: "form-check-input",
                              type: "checkbox",
                              role: "switch",
                              id: "editPrivateKeySwitch",
                              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => editPrivateKey.value = $event)
                            }, null, 512), [
                              [vModelCheckbox, editPrivateKey.value]
                            ]),
                            _cache[18] || (_cache[18] = createBaseVNode("label", {
                              class: "form-check-label",
                              for: "editPrivateKeySwitch"
                            }, [
                              createBaseVNode("small", null, "Edit")
                            ], -1))
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "text",
                          class: normalizeClass(["form-control form-control-sm rounded-3", { "is-invalid": !reqField.PrivateKey }]),
                          disabled: saving.value || !editPrivateKey.value,
                          onKeyup: _cache[9] || (_cache[9] = ($event) => genKey()),
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => data.PrivateKey = $event),
                          id: "configuration_private_key"
                        }, null, 42, _hoisted_19), [
                          [vModelText, data.PrivateKey]
                        ])
                      ]),
                      createBaseVNode("div", null, [
                        createBaseVNode("label", _hoisted_20, [
                          createBaseVNode("small", _hoisted_21, [
                            createVNode(LocaleText, { t: "IP Address/CIDR" })
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "text",
                          class: "form-control form-control-sm rounded-3",
                          disabled: saving.value,
                          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => data.Address = $event),
                          id: "configuration_ipaddress_cidr"
                        }, null, 8, _hoisted_22), [
                          [vModelText, data.Address]
                        ])
                      ]),
                      createBaseVNode("div", null, [
                        createBaseVNode("label", _hoisted_23, [
                          createBaseVNode("small", _hoisted_24, [
                            createVNode(LocaleText, { t: "Listen Port" })
                          ])
                        ]),
                        withDirectives(createBaseVNode("input", {
                          type: "number",
                          class: "form-control form-control-sm rounded-3",
                          disabled: saving.value,
                          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => data.ListenPort = $event),
                          id: "configuration_listen_port"
                        }, null, 8, _hoisted_25), [
                          [vModelText, data.ListenPort]
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_26, [
                        createBaseVNode("div", _hoisted_27, [
                          createBaseVNode("h2", _hoisted_28, [
                            createBaseVNode("button", _hoisted_29, [
                              createBaseVNode("small", _hoisted_30, [
                                createVNode(LocaleText, { t: "Optional Settings" })
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_31, [
                            createBaseVNode("div", _hoisted_32, [
                              (openBlock(), createElementBlock(Fragment, null, renderList(["Table", "PreUp", "PreDown", "PostUp", "PostDown"], (key) => {
                                return createBaseVNode("div", null, [
                                  createBaseVNode("label", {
                                    for: "configuration_" + key,
                                    class: "form-label"
                                  }, [
                                    createBaseVNode("small", _hoisted_34, [
                                      createVNode(LocaleText, { t: key }, null, 8, ["t"])
                                    ])
                                  ], 8, _hoisted_33),
                                  withDirectives(createBaseVNode("input", {
                                    type: "text",
                                    class: "form-control form-control-sm rounded-3",
                                    disabled: saving.value,
                                    "onUpdate:modelValue": ($event) => data[key] = $event,
                                    id: "configuration_" + key
                                  }, null, 8, _hoisted_35), [
                                    [vModelText, data[key]]
                                  ])
                                ]);
                              }), 64)),
                              __props.configurationInfo.Protocol === "awg" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, renderList(["Jc", "Jmin", "Jmax", "S1", "S2", "H1", "H2", "H3", "H4"], (key) => {
                                return createBaseVNode("div", null, [
                                  createBaseVNode("label", {
                                    for: "configuration_" + key,
                                    class: "form-label"
                                  }, [
                                    createBaseVNode("small", _hoisted_37, [
                                      createVNode(LocaleText, { t: key }, null, 8, ["t"])
                                    ])
                                  ], 8, _hoisted_36),
                                  withDirectives(createBaseVNode("input", {
                                    type: "number",
                                    class: "form-control form-control-sm rounded-3",
                                    disabled: saving.value,
                                    "onUpdate:modelValue": ($event) => data[key] = $event,
                                    id: "configuration_" + key
                                  }, null, 8, _hoisted_38), [
                                    [vModelText, data[key]]
                                  ])
                                ]);
                              }), 64)) : createCommentVNode("", true)
                            ])
                          ])
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_39, [
                        createBaseVNode("button", {
                          class: "btn bg-secondary-subtle border-secondary-subtle text-secondary-emphasis rounded-3 shadow ms-auto",
                          onClick: _cache[13] || (_cache[13] = ($event) => resetForm()),
                          disabled: !dataChanged.value || saving.value
                        }, [
                          _cache[19] || (_cache[19] = createBaseVNode("i", { class: "bi bi-arrow-clockwise me-2" }, null, -1)),
                          createVNode(LocaleText, { t: "Reset" })
                        ], 8, _hoisted_40),
                        createBaseVNode("button", {
                          class: "btn bg-primary-subtle border-primary-subtle text-primary-emphasis rounded-3 shadow",
                          disabled: !dataChanged.value || saving.value,
                          onClick: _cache[14] || (_cache[14] = ($event) => saveForm())
                        }, [
                          _cache[20] || (_cache[20] = createBaseVNode("i", { class: "bi bi-save-fill me-2" }, null, -1)),
                          createVNode(LocaleText, { t: "Save" })
                        ], 8, _hoisted_41)
                      ]),
                      _cache[26] || (_cache[26] = createBaseVNode("hr", null, null, -1)),
                      createBaseVNode("h5", _hoisted_42, [
                        createVNode(LocaleText, { t: "Danger Zone" })
                      ]),
                      createBaseVNode("div", _hoisted_43, [
                        createBaseVNode("button", {
                          onClick: _cache[15] || (_cache[15] = ($event) => backupRestoreModal.value = true),
                          class: "btn bg-warning-subtle border-warning-subtle text-warning-emphasis rounded-3 text-start d-flex"
                        }, [
                          _cache[21] || (_cache[21] = createBaseVNode("i", { class: "bi bi-copy me-auto" }, null, -1)),
                          createVNode(LocaleText, { t: "Backup & Restore" })
                        ]),
                        createBaseVNode("button", {
                          onClick: _cache[16] || (_cache[16] = ($event) => editRawConfigurationFileModal.value = true),
                          class: "btn bg-warning-subtle border-warning-subtle text-warning-emphasis rounded-3 d-flex"
                        }, [
                          _cache[22] || (_cache[22] = createBaseVNode("i", { class: "bi bi-pen me-auto" }, null, -1)),
                          createVNode(LocaleText, { t: "Edit Raw Configuration File" })
                        ]),
                        createBaseVNode("button", {
                          onClick: _cache[17] || (_cache[17] = ($event) => deleteConfigurationModal.value = true),
                          class: "btn bg-danger-subtle border-danger-subtle text-danger-emphasis rounded-3 d-flex mt-4"
                        }, [
                          _cache[23] || (_cache[23] = createBaseVNode("i", { class: "bi bi-trash-fill me-auto" }, null, -1)),
                          createVNode(LocaleText, { t: "Delete Configuration" })
                        ])
                      ])
                    ], 64))
                  ])
                ])
              ])
            ])
          ])
        ])
      ], 512);
    };
  }
};
export {
  _sfc_main as default
};
