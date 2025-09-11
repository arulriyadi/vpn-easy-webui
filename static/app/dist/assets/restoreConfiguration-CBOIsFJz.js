import { _ as _export_sfc, r as ref, o as onMounted, a as openBlock, c as createElementBlock, b as createBaseVNode, t as toDisplayString, F as Fragment, h as renderList, i as createBlock, d as createVNode, n as normalizeClass, u as unref, e as createCommentVNode, E as reactive, W as WireguardConfigurationsStore, q as computed, H as watch, D as DashboardConfigurationStore, I as useRouter, m as withDirectives, y as vModelText, f as createTextVNode, A as fetchPost, g as fetchGet, w as withCtx, j as Transition, k as resolveComponent } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
import { d as dayjs } from "./dayjs.min-CfinB9vE.js";
import { _ as _sfc_main$3 } from "./protocolBadge-B0bAD-AP.js";
import { p as parse } from "./index-Q14vox-x.js";
const _hoisted_1$2 = { class: "card rounded-3 shadow-sm" };
const _hoisted_2$2 = { class: "mb-0 d-flex align-items-center gap-3" };
const _hoisted_3$2 = { class: "text-muted ms-auto d-block" };
const _hoisted_4$2 = {
  key: 0,
  class: "card-footer p-3 d-flex flex-column gap-2"
};
const _hoisted_5$2 = ["onClick", "id"];
const _hoisted_6$2 = { class: "card-body d-flex p-3 gap-3 align-items-center" };
const _sfc_main$2 = {
  __name: "backupGroup",
  props: {
    configurationName: String,
    backups: Array,
    open: false,
    selectedConfigurationBackup: Object,
    protocol: Array
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showBackups = ref(props.open);
    onMounted(() => {
      if (props.selectedConfigurationBackup) {
        document.querySelector(`#${props.selectedConfigurationBackup.filename.replace(".conf", "")}`).scrollIntoView({
          behavior: "smooth"
        });
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("a", {
          role: "button",
          class: "card-body d-flex align-items-center text-decoration-none d-flex gap-3",
          onClick: _cache[0] || (_cache[0] = ($event) => showBackups.value = !showBackups.value)
        }, [
          createBaseVNode("h6", _hoisted_2$2, [
            createBaseVNode("samp", null, toDisplayString(__props.configurationName), 1),
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.protocol, (p) => {
              return openBlock(), createBlock(_sfc_main$3, { protocol: p }, null, 8, ["protocol"]);
            }), 256))
          ]),
          createBaseVNode("small", _hoisted_3$2, [
            createVNode(LocaleText, {
              t: __props.backups.length + (__props.backups.length > 1 ? " Backups" : " Backup")
            }, null, 8, ["t"])
          ]),
          createBaseVNode("h5", {
            class: normalizeClass(["mb-0 dropdownIcon text-muted", { active: showBackups.value }])
          }, _cache[1] || (_cache[1] = [
            createBaseVNode("i", { class: "bi bi-chevron-down" }, null, -1)
          ]), 2)
        ]),
        showBackups.value ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.backups, (b) => {
            return openBlock(), createElementBlock("div", {
              class: "card rounded-3 shadow-sm animate__animated",
              key: b.filename,
              onClick: () => {
                emit("select", b);
              },
              id: b.filename.replace(".conf", ""),
              role: "button"
            }, [
              createBaseVNode("div", _hoisted_6$2, [
                createBaseVNode("small", null, [
                  _cache[2] || (_cache[2] = createBaseVNode("i", { class: "bi bi-file-earmark me-2" }, null, -1)),
                  createBaseVNode("samp", null, toDisplayString(b.filename), 1)
                ]),
                createBaseVNode("small", null, [
                  _cache[3] || (_cache[3] = createBaseVNode("i", { class: "bi bi-clock-history me-2" }, null, -1)),
                  createBaseVNode("samp", null, toDisplayString(unref(dayjs)(b.backupDate).format("YYYY-MM-DD HH:mm:ss")), 1)
                ]),
                createBaseVNode("small", null, [
                  _cache[4] || (_cache[4] = createBaseVNode("i", { class: "bi bi-database me-2" }, null, -1)),
                  b.database ? (openBlock(), createBlock(LocaleText, {
                    key: 0,
                    t: "Yes"
                  })) : (openBlock(), createBlock(LocaleText, {
                    key: 1,
                    t: "No"
                  }))
                ]),
                _cache[5] || (_cache[5] = createBaseVNode("small", { class: "text-muted ms-auto" }, [
                  createBaseVNode("i", { class: "bi bi-chevron-right" })
                ], -1))
              ])
            ], 8, _hoisted_5$2);
          }), 128))
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const BackupGroup = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ccf48ac7"]]);
const _hoisted_1$1 = {
  class: "d-flex flex-column gap-5",
  id: "confirmBackup"
};
const _hoisted_2$1 = { class: "d-flex flex-column gap-3" };
const _hoisted_3$1 = { class: "d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3" };
const _hoisted_4$1 = { class: "mb-0" };
const _hoisted_5$1 = { class: "text-muted mb-1" };
const _hoisted_6$1 = { class: "mb-0" };
const _hoisted_7$1 = {
  class: "text-muted mb-1",
  for: "ConfigurationName"
};
const _hoisted_8$1 = { class: "invalid-feedback" };
const _hoisted_9$1 = { key: 0 };
const _hoisted_10$1 = { key: 1 };
const _hoisted_11$1 = { class: "mb-0" };
const _hoisted_12$1 = { class: "row g-3" };
const _hoisted_13$1 = { class: "col-sm" };
const _hoisted_14$1 = {
  class: "text-muted mb-1",
  for: "PrivateKey"
};
const _hoisted_15$1 = { class: "input-group" };
const _hoisted_16$1 = { class: "col-sm" };
const _hoisted_17$1 = {
  class: "text-muted mb-1",
  for: "PublicKey"
};
const _hoisted_18$1 = {
  class: "text-muted mb-1",
  for: "ListenPort"
};
const _hoisted_19$1 = { class: "invalid-feedback" };
const _hoisted_20 = { key: 0 };
const _hoisted_21 = { key: 1 };
const _hoisted_22 = { class: "mb-0" };
const _hoisted_23 = {
  class: "text-muted mb-1 d-flex",
  for: "ListenPort"
};
const _hoisted_24 = { class: "invalid-feedback" };
const _hoisted_25 = { key: 0 };
const _hoisted_26 = { key: 1 };
const _hoisted_27 = {
  class: "accordion",
  id: "newConfigurationOptionalAccordion"
};
const _hoisted_28 = { class: "accordion-item" };
const _hoisted_29 = { class: "accordion-header" };
const _hoisted_30 = {
  class: "accordion-button collapsed rounded-3",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#newConfigurationOptionalAccordionCollapse"
};
const _hoisted_31 = {
  id: "newConfigurationOptionalAccordionCollapse",
  class: "accordion-collapse collapse",
  "data-bs-parent": "#newConfigurationOptionalAccordion"
};
const _hoisted_32 = { class: "accordion-body d-flex flex-column gap-3" };
const _hoisted_33 = {
  class: "text-muted mb-1",
  for: "PreUp"
};
const _hoisted_34 = {
  class: "text-muted mb-1",
  for: "PreDown"
};
const _hoisted_35 = {
  class: "text-muted mb-1",
  for: "PostUp"
};
const _hoisted_36 = {
  class: "text-muted mb-1",
  for: "PostDown"
};
const _hoisted_37 = { class: "d-flex flex-column gap-3" };
const _hoisted_38 = { class: "d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3" };
const _hoisted_39 = { class: "mb-0" };
const _hoisted_40 = { key: 0 };
const _hoisted_41 = { class: "row g-3" };
const _hoisted_42 = { class: "col-sm" };
const _hoisted_43 = { class: "card text-bg-success rounded-3" };
const _hoisted_44 = { class: "card-body" };
const _hoisted_45 = { class: "col-sm" };
const _hoisted_46 = { class: "card text-bg-warning rounded-3" };
const _hoisted_47 = { class: "card-body" };
const _hoisted_48 = { class: "d-flex" };
const _hoisted_49 = ["disabled"];
const _sfc_main$1 = {
  __name: "confirmBackup",
  props: {
    selectedConfigurationBackup: Object
  },
  setup(__props) {
    const props = __props;
    const newConfiguration = reactive({
      ConfigurationName: props.selectedConfigurationBackup.filename.split("_")[0],
      Backup: props.selectedConfigurationBackup.filename,
      Protocol: props.selectedConfigurationBackup.protocol
    });
    const lineSplit = props.selectedConfigurationBackup.content.split("\n");
    for (let line of lineSplit) {
      if (line === "[Peer]") break;
      if (line.length > 0) {
        let l = line.replace(" = ", "=").split("=");
        if (l[0] === "ListenPort") {
          newConfiguration[l[0]] = parseInt(l[1]);
        } else {
          newConfiguration[l[0]] = l[1];
        }
      }
    }
    const error = ref(false);
    const loading = ref(false);
    const errorMessage = ref("");
    const store = WireguardConfigurationsStore();
    const validateConfigurationName = computed(() => {
      return /^[a-zA-Z0-9_=+.-]{1,15}$/.test(newConfiguration.ConfigurationName) && newConfiguration.ConfigurationName.length > 0 && !store.Configurations.find((x) => x.Name === newConfiguration.ConfigurationName);
    });
    const validatePrivateKey = computed(() => {
      try {
        window.wireguard.generatePublicKey(newConfiguration.PrivateKey);
      } catch (e) {
        return false;
      }
      return true;
    });
    const validateListenPort = computed(() => {
      return newConfiguration.ListenPort > 0 && newConfiguration.ListenPort <= 65353 && Number.isInteger(newConfiguration.ListenPort) && !store.Configurations.find((x) => parseInt(x.ListenPort) === newConfiguration.ListenPort);
    });
    const validateAddress = computed(() => {
      try {
        parse(newConfiguration.Address);
        return true;
      } catch (e) {
        return false;
      }
    });
    const validateForm = computed(() => {
      return validateAddress.value && validateListenPort.value && validatePrivateKey.value && validateConfigurationName.value;
    });
    onMounted(() => {
      document.querySelector("main").scrollTo({
        top: 0,
        behavior: "smooth"
      });
      watch(() => validatePrivateKey, (newVal) => {
        if (newVal) {
          newConfiguration.PublicKey = window.wireguard.generatePublicKey(newConfiguration.PrivateKey);
        }
      }, {
        immediate: true
      });
    });
    const availableIPAddress = computed(() => {
      let p;
      try {
        p = parse(newConfiguration.Address);
      } catch (e) {
        return 0;
      }
      return p.end - p.start;
    });
    const peersCount = computed(() => {
      if (props.selectedConfigurationBackup.database) {
        let l = props.selectedConfigurationBackup.databaseContent.split("\n");
        return l.filter((x) => x.search(`INSERT INTO "${newConfiguration.ConfigurationName}"`) >= 0).length;
      }
      return 0;
    });
    const restrictedPeersCount = computed(() => {
      if (props.selectedConfigurationBackup.database) {
        let l = props.selectedConfigurationBackup.databaseContent.split("\n");
        return l.filter((x) => x.search(`INSERT INTO "${newConfiguration.ConfigurationName}_restrict_access"`) >= 0).length;
      }
      return 0;
    });
    const dashboardStore = DashboardConfigurationStore();
    const router = useRouter();
    const submitRestore = async () => {
      if (validateForm.value) {
        loading.value = true;
        await fetchPost("/api/addWireguardConfiguration", newConfiguration, async (res) => {
          if (res.status) {
            dashboardStore.newMessage("Server", "Configuration restored", "success");
            await store.getConfigurations();
            await router.push(`/configuration/${newConfiguration.ConfigurationName}/peers`);
          } else {
            loading.value = false;
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("form", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("h4", _hoisted_4$1, [
              createVNode(LocaleText, { t: "Configuration" })
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_5$1, [
              createBaseVNode("small", null, [
                createVNode(LocaleText, { t: "Protocol" })
              ])
            ]),
            createBaseVNode("h5", _hoisted_6$1, [
              createVNode(_sfc_main$3, {
                protocol: __props.selectedConfigurationBackup.protocol,
                mini: true
              }, null, 8, ["protocol"])
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_7$1, [
              createBaseVNode("small", null, [
                createVNode(LocaleText, { t: "Configuration Name" })
              ])
            ]),
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: normalizeClass(["form-control rounded-3", [validateConfigurationName.value ? "is-valid" : "is-invalid"]]),
              placeholder: "ex. wg1",
              id: "ConfigurationName",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => newConfiguration.ConfigurationName = $event),
              disabled: "",
              required: ""
            }, null, 2), [
              [vModelText, newConfiguration.ConfigurationName]
            ]),
            createBaseVNode("div", _hoisted_8$1, [
              error.value ? (openBlock(), createElementBlock("div", _hoisted_9$1, toDisplayString(errorMessage.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_10$1, [
                createVNode(LocaleText, { t: "Configuration name is invalid. Possible reasons:" }),
                createBaseVNode("ul", _hoisted_11$1, [
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "Configuration name already exist." })
                  ]),
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "Configuration name can only contain 15 lower/uppercase alphabet, numbers, underscore, equal sign, plus sign, period and hyphen." })
                  ])
                ])
              ]))
            ])
          ]),
          createBaseVNode("div", _hoisted_12$1, [
            createBaseVNode("div", _hoisted_13$1, [
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_14$1, [
                  createBaseVNode("small", null, [
                    createVNode(LocaleText, { t: "Private Key" })
                  ])
                ]),
                createBaseVNode("div", _hoisted_15$1, [
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    class: normalizeClass(["form-control rounded-start-3", [validatePrivateKey.value ? "is-valid" : "is-invalid"]]),
                    id: "PrivateKey",
                    required: "",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => newConfiguration.PrivateKey = $event),
                    disabled: ""
                  }, null, 2), [
                    [vModelText, newConfiguration.PrivateKey]
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_16$1, [
              createBaseVNode("div", null, [
                createBaseVNode("label", _hoisted_17$1, [
                  createBaseVNode("small", null, [
                    createVNode(LocaleText, { t: "Public Key" })
                  ])
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control rounded-3",
                  id: "PublicKey",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newConfiguration.PublicKey = $event),
                  disabled: ""
                }, null, 512), [
                  [vModelText, newConfiguration.PublicKey]
                ])
              ])
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_18$1, [
              createBaseVNode("small", null, [
                createVNode(LocaleText, { t: "Listen Port" })
              ])
            ]),
            withDirectives(createBaseVNode("input", {
              type: "number",
              class: normalizeClass(["form-control rounded-3", [validateListenPort.value ? "is-valid" : "is-invalid"]]),
              placeholder: "0-65353",
              id: "ListenPort",
              min: "1",
              max: "65353",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newConfiguration.ListenPort = $event),
              disabled: "",
              required: ""
            }, null, 2), [
              [vModelText, newConfiguration.ListenPort]
            ]),
            createBaseVNode("div", _hoisted_19$1, [
              error.value ? (openBlock(), createElementBlock("div", _hoisted_20, toDisplayString(errorMessage.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_21, [
                createVNode(LocaleText, { t: "Listen Port is invalid. Possible reasons:" }),
                createBaseVNode("ul", _hoisted_22, [
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "Invalid port." })
                  ]),
                  createBaseVNode("li", null, [
                    createVNode(LocaleText, { t: "Port is assigned to existing WireGuard Configuration." })
                  ])
                ])
              ]))
            ])
          ]),
          createBaseVNode("div", null, [
            createBaseVNode("label", _hoisted_23, [
              createBaseVNode("small", null, [
                createVNode(LocaleText, { t: "IP Address/CIDR" })
              ]),
              createBaseVNode("small", {
                class: normalizeClass(["ms-auto", [availableIPAddress.value > 0 ? "text-success" : "text-danger"]])
              }, [
                createVNode(LocaleText, {
                  t: availableIPAddress.value + " Available IP Address"
                }, null, 8, ["t"])
              ], 2)
            ]),
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: normalizeClass(["form-control", [validateAddress.value ? "is-valid" : "is-invalid"]]),
              placeholder: "Ex: 10.0.0.1/24",
              id: "Address",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newConfiguration.Address = $event),
              disabled: "",
              required: ""
            }, null, 2), [
              [vModelText, newConfiguration.Address]
            ]),
            createBaseVNode("div", _hoisted_24, [
              error.value ? (openBlock(), createElementBlock("div", _hoisted_25, toDisplayString(errorMessage.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_26, [
                createVNode(LocaleText, { t: "IP Address/CIDR is invalid" })
              ]))
            ])
          ]),
          createBaseVNode("div", _hoisted_27, [
            createBaseVNode("div", _hoisted_28, [
              createBaseVNode("h2", _hoisted_29, [
                createBaseVNode("button", _hoisted_30, [
                  createVNode(LocaleText, { t: "Optional Settings" })
                ])
              ]),
              createBaseVNode("div", _hoisted_31, [
                createBaseVNode("div", _hoisted_32, [
                  createBaseVNode("div", null, [
                    createBaseVNode("label", _hoisted_33, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "PreUp" })
                      ])
                    ]),
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control rounded-3",
                      id: "PreUp",
                      disabled: "",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => newConfiguration.PreUp = $event)
                    }, null, 512), [
                      [vModelText, newConfiguration.PreUp]
                    ])
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("label", _hoisted_34, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "PreDown" })
                      ])
                    ]),
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control rounded-3",
                      id: "PreDown",
                      disabled: "",
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => newConfiguration.PreDown = $event)
                    }, null, 512), [
                      [vModelText, newConfiguration.PreDown]
                    ])
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("label", _hoisted_35, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "PostUp" })
                      ])
                    ]),
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control rounded-3",
                      id: "PostUp",
                      disabled: "",
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => newConfiguration.PostUp = $event)
                    }, null, 512), [
                      [vModelText, newConfiguration.PostUp]
                    ])
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("label", _hoisted_36, [
                      createBaseVNode("small", null, [
                        createVNode(LocaleText, { t: "PostDown" })
                      ])
                    ]),
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      class: "form-control rounded-3",
                      id: "PostDown",
                      disabled: "",
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => newConfiguration.PostDown = $event)
                    }, null, 512), [
                      [vModelText, newConfiguration.PostDown]
                    ])
                  ])
                ])
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_37, [
          createBaseVNode("div", _hoisted_38, [
            createBaseVNode("h4", _hoisted_39, [
              createVNode(LocaleText, { t: "Database File" })
            ]),
            createBaseVNode("h4", {
              class: normalizeClass(["mb-0 ms-auto", [__props.selectedConfigurationBackup.database ? "text-success" : "text-danger"]])
            }, [
              createBaseVNode("i", {
                class: normalizeClass(["bi", [__props.selectedConfigurationBackup.database ? "bi-check-circle-fill" : "bi-x-circle-fill"]])
              }, null, 2)
            ], 2)
          ]),
          __props.selectedConfigurationBackup.database ? (openBlock(), createElementBlock("div", _hoisted_40, [
            createBaseVNode("div", _hoisted_41, [
              createBaseVNode("div", _hoisted_42, [
                createBaseVNode("div", _hoisted_43, [
                  createBaseVNode("div", _hoisted_44, [
                    _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-person-fill me-2" }, null, -1)),
                    createVNode(LocaleText, { t: "Contain" }),
                    _cache[11] || (_cache[11] = createTextVNode()),
                    createBaseVNode("strong", null, toDisplayString(peersCount.value), 1),
                    _cache[12] || (_cache[12] = createTextVNode()),
                    peersCount.value > 1 ? (openBlock(), createBlock(LocaleText, {
                      key: 0,
                      t: "Peer"
                    })) : (openBlock(), createBlock(LocaleText, {
                      key: 1,
                      t: "Peer"
                    }))
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_45, [
                createBaseVNode("div", _hoisted_46, [
                  createBaseVNode("div", _hoisted_47, [
                    _cache[13] || (_cache[13] = createBaseVNode("i", { class: "bi bi-person-fill-lock me-2" }, null, -1)),
                    createVNode(LocaleText, { t: "Contain" }),
                    _cache[14] || (_cache[14] = createTextVNode()),
                    createBaseVNode("strong", null, toDisplayString(restrictedPeersCount.value), 1),
                    _cache[15] || (_cache[15] = createTextVNode()),
                    restrictedPeersCount.value > 1 ? (openBlock(), createBlock(LocaleText, {
                      key: 0,
                      t: "Restricted Peers"
                    })) : (openBlock(), createBlock(LocaleText, {
                      key: 1,
                      t: "Restricted Peers"
                    }))
                  ])
                ])
              ])
            ])
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_48, [
          createBaseVNode("button", {
            class: "btn btn-dark btn-brand rounded-3 px-3 py-2 shadow ms-auto",
            disabled: !validateForm.value || loading.value,
            onClick: _cache[9] || (_cache[9] = ($event) => submitRestore())
          }, [
            _cache[16] || (_cache[16] = createBaseVNode("i", { class: "bi bi-clock-history me-2" }, null, -1)),
            createVNode(LocaleText, {
              t: !loading.value ? "Restore" : "Restoring..."
            }, null, 8, ["t"])
          ], 8, _hoisted_49)
        ])
      ]);
    };
  }
};
const _hoisted_1 = { class: "mt-md-5 mt-3 text-body" };
const _hoisted_2 = { class: "container mb-4" };
const _hoisted_3 = { class: "mb-5 d-flex align-items-center gap-4" };
const _hoisted_4 = { class: "mb-0" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = { class: "d-flex text-decoration-none text-body flex-grow-1 align-items-center gap-3" };
const _hoisted_7 = { class: "mb-0" };
const _hoisted_8 = { class: "text-muted" };
const _hoisted_9 = {
  key: 0,
  class: "ms-sm-auto"
};
const _hoisted_10 = { class: "text-muted" };
const _hoisted_11 = {
  key: 0,
  id: "step1Detail"
};
const _hoisted_12 = { class: "mb-4" };
const _hoisted_13 = { class: "d-flex gap-3 flex-column" };
const _hoisted_14 = { key: 0 };
const _hoisted_15 = { class: "card rounded-3" };
const _hoisted_16 = { class: "card-body" };
const _hoisted_17 = { class: "mb-0" };
const _hoisted_18 = {
  class: "my-5",
  key: "step2",
  id: "step2"
};
const _hoisted_19 = { class: "text-muted" };
const _sfc_main = {
  __name: "restoreConfiguration",
  setup(__props) {
    const backups = ref(void 0);
    DashboardConfigurationStore();
    ref(false);
    onMounted(() => {
      fetchGet("/api/getAllWireguardConfigurationBackup", {}, (res) => {
        backups.value = res.data;
      });
    });
    const confirm = ref(false);
    const selectedConfigurationBackup = ref(void 0);
    const selectedConfiguration = ref("");
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_component_RouterLink, {
              to: "/",
              class: "btn btn-dark btn-brand p-2 shadow",
              style: { "border-radius": "100%" }
            }, {
              default: withCtx(() => _cache[1] || (_cache[1] = [
                createBaseVNode("h2", {
                  class: "mb-0",
                  style: { "line-height": "0" }
                }, [
                  createBaseVNode("i", { class: "bi bi-arrow-left-circle" })
                ], -1)
              ])),
              _: 1
            }),
            createBaseVNode("h2", _hoisted_4, [
              createVNode(LocaleText, { t: "Restore Configuration" })
            ])
          ]),
          createVNode(Transition, {
            name: "fade",
            appear: ""
          }, {
            default: withCtx(() => [
              backups.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
                createBaseVNode("div", {
                  class: normalizeClass(["d-flex mb-5 align-items-center steps", { active: !confirm.value }]),
                  role: "button",
                  onClick: _cache[0] || (_cache[0] = ($event) => confirm.value = false),
                  key: "step1"
                }, [
                  createBaseVNode("div", _hoisted_6, [
                    _cache[2] || (_cache[2] = createBaseVNode("h1", {
                      class: "mb-0",
                      style: { "line-height": "0" }
                    }, [
                      createBaseVNode("i", { class: "bi bi-1-circle-fill" })
                    ], -1)),
                    createBaseVNode("div", null, [
                      createBaseVNode("h4", _hoisted_7, [
                        createVNode(LocaleText, { t: "Step 1" })
                      ]),
                      createBaseVNode("small", _hoisted_8, [
                        !confirm.value ? (openBlock(), createBlock(LocaleText, {
                          key: 0,
                          t: "Select a backup you want to restore"
                        })) : (openBlock(), createBlock(LocaleText, {
                          key: 1,
                          t: "Click to change a backup"
                        }))
                      ])
                    ])
                  ]),
                  createVNode(Transition, { name: "zoomReversed" }, {
                    default: withCtx(() => [
                      confirm.value ? (openBlock(), createElementBlock("div", _hoisted_9, [
                        createBaseVNode("small", _hoisted_10, [
                          createVNode(LocaleText, { t: "Selected Backup" })
                        ]),
                        createBaseVNode("h6", null, [
                          createBaseVNode("samp", null, toDisplayString(selectedConfigurationBackup.value.filename), 1)
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ], 2),
                !confirm.value ? (openBlock(), createElementBlock("div", _hoisted_11, [
                  createBaseVNode("div", _hoisted_12, [
                    createBaseVNode("div", _hoisted_13, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(backups.value.NonExistingConfigurations), (c) => {
                        return openBlock(), createBlock(BackupGroup, {
                          onSelect: (b) => {
                            selectedConfigurationBackup.value = b;
                            selectedConfiguration.value = c;
                            confirm.value = true;
                          },
                          selectedConfigurationBackup: selectedConfigurationBackup.value,
                          open: selectedConfiguration.value === c,
                          protocol: [...new Set(backups.value.NonExistingConfigurations[c].map((x) => x.protocol))],
                          "configuration-name": c,
                          backups: backups.value.NonExistingConfigurations[c]
                        }, null, 8, ["onSelect", "selectedConfigurationBackup", "open", "protocol", "configuration-name", "backups"]);
                      }), 256)),
                      Object.keys(backups.value.NonExistingConfigurations).length === 0 ? (openBlock(), createElementBlock("div", _hoisted_14, [
                        createBaseVNode("div", _hoisted_15, [
                          createBaseVNode("div", _hoisted_16, [
                            createBaseVNode("p", _hoisted_17, [
                              createVNode(LocaleText, { t: "You don't have any configuration to restore" })
                            ])
                          ])
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_18, [
                  createBaseVNode("div", {
                    class: normalizeClass(["steps d-flex text-decoration-none text-body flex-grow-1 align-items-center gap-3", { active: confirm.value }])
                  }, [
                    _cache[4] || (_cache[4] = createBaseVNode("h1", {
                      class: "mb-0",
                      style: { "line-height": "0" }
                    }, [
                      createBaseVNode("i", { class: "bi bi-2-circle-fill" })
                    ], -1)),
                    createBaseVNode("div", null, [
                      _cache[3] || (_cache[3] = createBaseVNode("h4", { class: "mb-0" }, "Step 2", -1)),
                      createBaseVNode("small", _hoisted_19, [
                        !confirm.value ? (openBlock(), createBlock(LocaleText, {
                          key: 0,
                          t: "Backup not selected"
                        })) : (openBlock(), createBlock(LocaleText, {
                          key: 1,
                          t: "Confirm & edit restore information"
                        }))
                      ])
                    ])
                  ], 2)
                ]),
                confirm.value ? (openBlock(), createBlock(_sfc_main$1, {
                  selectedConfigurationBackup: selectedConfigurationBackup.value,
                  key: "confirm"
                }, null, 8, ["selectedConfigurationBackup"])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ])
      ]);
    };
  }
};
const restoreConfiguration = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-324df2b1"]]);
export {
  restoreConfiguration as default
};
