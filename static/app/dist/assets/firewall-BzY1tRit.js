import { _ as _export_sfc, r as ref, o as onMounted, c as createElementBlock, b as createBaseVNode, f as createTextVNode, F as Fragment, h as renderList, J as withModifiers, m as withDirectives, B as vModelSelect, y as vModelText, e as createCommentVNode, n as normalizeClass, t as toDisplayString, g as fetchGet, A as fetchPost, a as openBlock, K as fetchDelete } from "./index-xvqfLBaG.js";
const _hoisted_1 = { class: "container-fluid" };
const _hoisted_2 = { class: "row" };
const _hoisted_3 = { class: "col-12" };
const _hoisted_4 = { class: "d-flex justify-content-between align-items-center mb-4" };
const _hoisted_5 = { class: "card" };
const _hoisted_6 = { class: "card-body" };
const _hoisted_7 = {
  key: 0,
  class: "text-center py-4"
};
const _hoisted_8 = {
  key: 1,
  class: "text-center py-4 text-muted"
};
const _hoisted_9 = {
  key: 2,
  class: "table-responsive"
};
const _hoisted_10 = { class: "table table-striped table-hover" };
const _hoisted_11 = { class: "badge bg-secondary" };
const _hoisted_12 = {
  key: 0,
  class: "badge bg-info"
};
const _hoisted_13 = {
  key: 1,
  class: "text-muted"
};
const _hoisted_14 = ["onClick"];
const _hoisted_15 = {
  key: 0,
  class: "modal show d-block",
  tabindex: "-1",
  style: { "background-color": "rgba(0,0,0,0.5)" }
};
const _hoisted_16 = { class: "modal-dialog modal-lg" };
const _hoisted_17 = { class: "modal-content" };
const _hoisted_18 = { class: "modal-header" };
const _hoisted_19 = { class: "modal-body" };
const _hoisted_20 = { class: "row" };
const _hoisted_21 = { class: "col-md-6 mb-3" };
const _hoisted_22 = { class: "col-md-6 mb-3" };
const _hoisted_23 = { class: "row" };
const _hoisted_24 = { class: "col-md-6 mb-3" };
const _hoisted_25 = { class: "col-md-6 mb-3" };
const _hoisted_26 = { class: "row" };
const _hoisted_27 = { class: "col-md-6 mb-3" };
const _hoisted_28 = { class: "col-md-6 mb-3" };
const _hoisted_29 = { class: "modal-footer" };
const _hoisted_30 = ["disabled"];
const _hoisted_31 = {
  key: 0,
  class: "spinner-border spinner-border-sm me-1"
};
const _hoisted_32 = { class: "toast-container position-fixed bottom-0 end-0 p-3" };
const _hoisted_33 = {
  key: 0,
  class: "toast show",
  role: "alert"
};
const _hoisted_34 = { class: "toast-header" };
const _hoisted_35 = { class: "ms-2" };
const _hoisted_36 = { class: "toast-body" };
const _sfc_main = {
  __name: "firewall",
  setup(__props) {
    const loading = ref(true);
    const addingRule = ref(false);
    const showAddRuleModal = ref(false);
    const firewallRules = ref([]);
    const newRule = ref({
      chain: "",
      target: "",
      source: "",
      destination: "",
      protocol: "",
      port: ""
    });
    const toast = ref({
      show: false,
      type: "success",
      message: ""
    });
    const loadFirewallRules = async () => {
      try {
        loading.value = true;
        const response = await fetchGet("/api/firewall/rules");
        if (response.status) {
          firewallRules.value = response.data || [];
        } else {
          showToast("error", "Failed to load firewall rules");
        }
      } catch (error) {
        showToast("error", "Error loading firewall rules: " + error.message);
      } finally {
        loading.value = false;
      }
    };
    const addRule = async () => {
      try {
        addingRule.value = true;
        const response = await fetchPost("/api/firewall/rules", newRule.value);
        if (response.status) {
          showToast("success", "Firewall rule added successfully");
          showAddRuleModal.value = false;
          resetNewRule();
          await loadFirewallRules();
        } else {
          showToast("error", response.message || "Failed to add firewall rule");
        }
      } catch (error) {
        showToast("error", "Error adding firewall rule: " + error.message);
      } finally {
        addingRule.value = false;
      }
    };
    const deleteRule = async (ruleId) => {
      if (!confirm("Are you sure you want to delete this firewall rule?")) {
        return;
      }
      try {
        const response = await fetchDelete(`/api/firewall/rules/${ruleId}`);
        if (response.status) {
          showToast("success", "Firewall rule deleted successfully");
          await loadFirewallRules();
        } else {
          showToast("error", response.message || "Failed to delete firewall rule");
        }
      } catch (error) {
        showToast("error", "Error deleting firewall rule: " + error.message);
      }
    };
    const reloadRules = async () => {
      try {
        const response = await fetchPost("/api/firewall/reload", {});
        if (response.status) {
          showToast("success", "Firewall rules reloaded successfully");
          await loadFirewallRules();
        } else {
          showToast("error", response.message || "Failed to reload firewall rules");
        }
      } catch (error) {
        showToast("error", "Error reloading firewall rules: " + error.message);
      }
    };
    const resetNewRule = () => {
      newRule.value = {
        chain: "",
        target: "",
        source: "",
        destination: "",
        protocol: "",
        port: ""
      };
    };
    const showToast = (type, message) => {
      toast.value = {
        show: true,
        type,
        message
      };
      setTimeout(() => {
        toast.value.show = false;
      }, 5e3);
    };
    const getTargetBadgeClass = (target) => {
      switch (target) {
        case "ACCEPT":
          return "bg-success";
        case "DROP":
          return "bg-danger";
        case "REJECT":
          return "bg-warning";
        default:
          return "bg-secondary";
      }
    };
    onMounted(() => {
      loadFirewallRules();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              _cache[12] || (_cache[12] = createBaseVNode("h2", { class: "mb-0" }, [
                createBaseVNode("i", { class: "bi bi-shield-check me-2" }),
                createTextVNode(" Firewall Management ")
              ], -1)),
              createBaseVNode("div", null, [
                createBaseVNode("button", {
                  class: "btn btn-primary me-2",
                  onClick: _cache[0] || (_cache[0] = ($event) => showAddRuleModal.value = true)
                }, _cache[10] || (_cache[10] = [
                  createBaseVNode("i", { class: "bi bi-plus-circle me-1" }, null, -1),
                  createTextVNode(" Add Rule ")
                ])),
                createBaseVNode("button", {
                  class: "btn btn-warning",
                  onClick: reloadRules
                }, _cache[11] || (_cache[11] = [
                  createBaseVNode("i", { class: "bi bi-arrow-clockwise me-1" }, null, -1),
                  createTextVNode(" Reload Rules ")
                ]))
              ])
            ]),
            createBaseVNode("div", _hoisted_5, [
              _cache[17] || (_cache[17] = createBaseVNode("div", { class: "card-header" }, [
                createBaseVNode("h5", { class: "mb-0" }, [
                  createBaseVNode("i", { class: "bi bi-list-ul me-2" }),
                  createTextVNode(" Current Firewall Rules ")
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_6, [
                loading.value ? (openBlock(), createElementBlock("div", _hoisted_7, _cache[13] || (_cache[13] = [
                  createBaseVNode("div", {
                    class: "spinner-border text-primary",
                    role: "status"
                  }, [
                    createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
                  ], -1)
                ]))) : firewallRules.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, _cache[14] || (_cache[14] = [
                  createBaseVNode("i", { class: "bi bi-shield-x fs-1" }, null, -1),
                  createBaseVNode("p", { class: "mt-2" }, "No firewall rules found", -1)
                ]))) : (openBlock(), createElementBlock("div", _hoisted_9, [
                  createBaseVNode("table", _hoisted_10, [
                    _cache[16] || (_cache[16] = createBaseVNode("thead", { class: "table-dark" }, [
                      createBaseVNode("tr", null, [
                        createBaseVNode("th", null, "ID"),
                        createBaseVNode("th", null, "Chain"),
                        createBaseVNode("th", null, "Source"),
                        createBaseVNode("th", null, "Destination"),
                        createBaseVNode("th", null, "Protocol"),
                        createBaseVNode("th", null, "Port"),
                        createBaseVNode("th", null, "Target"),
                        createBaseVNode("th", null, "Actions")
                      ])
                    ], -1)),
                    createBaseVNode("tbody", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(firewallRules.value, (rule) => {
                        return openBlock(), createElementBlock("tr", {
                          key: rule.id
                        }, [
                          createBaseVNode("td", null, toDisplayString(rule.id), 1),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", _hoisted_11, toDisplayString(rule.chain || "N/A"), 1)
                          ]),
                          createBaseVNode("td", null, toDisplayString(rule.source || "Any"), 1),
                          createBaseVNode("td", null, toDisplayString(rule.destination || "Any"), 1),
                          createBaseVNode("td", null, [
                            rule.protocol ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString(rule.protocol), 1)) : (openBlock(), createElementBlock("span", _hoisted_13, "Any"))
                          ]),
                          createBaseVNode("td", null, toDisplayString(rule.port || "Any"), 1),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", {
                              class: normalizeClass(["badge", getTargetBadgeClass(rule.target)])
                            }, toDisplayString(rule.target || "N/A"), 3)
                          ]),
                          createBaseVNode("td", null, [
                            createBaseVNode("button", {
                              class: "btn btn-sm btn-outline-danger",
                              onClick: ($event) => deleteRule(rule.id)
                            }, _cache[15] || (_cache[15] = [
                              createBaseVNode("i", { class: "bi bi-trash" }, null, -1)
                            ]), 8, _hoisted_14)
                          ])
                        ]);
                      }), 128))
                    ])
                  ])
                ]))
              ])
            ])
          ])
        ]),
        showAddRuleModal.value ? (openBlock(), createElementBlock("div", _hoisted_15, [
          createBaseVNode("div", _hoisted_16, [
            createBaseVNode("div", _hoisted_17, [
              createBaseVNode("div", _hoisted_18, [
                _cache[18] || (_cache[18] = createBaseVNode("h5", { class: "modal-title" }, [
                  createBaseVNode("i", { class: "bi bi-plus-circle me-2" }),
                  createTextVNode(" Add Firewall Rule ")
                ], -1)),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close",
                  onClick: _cache[1] || (_cache[1] = ($event) => showAddRuleModal.value = false)
                })
              ]),
              createBaseVNode("div", _hoisted_19, [
                createBaseVNode("form", {
                  onSubmit: withModifiers(addRule, ["prevent"])
                }, [
                  createBaseVNode("div", _hoisted_20, [
                    createBaseVNode("div", _hoisted_21, [
                      _cache[20] || (_cache[20] = createBaseVNode("label", {
                        for: "chain",
                        class: "form-label"
                      }, "Chain", -1)),
                      withDirectives(createBaseVNode("select", {
                        id: "chain",
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newRule.value.chain = $event),
                        class: "form-select",
                        required: ""
                      }, _cache[19] || (_cache[19] = [
                        createBaseVNode("option", { value: "" }, "Select Chain", -1),
                        createBaseVNode("option", { value: "INPUT" }, "INPUT", -1),
                        createBaseVNode("option", { value: "OUTPUT" }, "OUTPUT", -1),
                        createBaseVNode("option", { value: "FORWARD" }, "FORWARD", -1)
                      ]), 512), [
                        [vModelSelect, newRule.value.chain]
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_22, [
                      _cache[22] || (_cache[22] = createBaseVNode("label", {
                        for: "target",
                        class: "form-label"
                      }, "Target", -1)),
                      withDirectives(createBaseVNode("select", {
                        id: "target",
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newRule.value.target = $event),
                        class: "form-select",
                        required: ""
                      }, _cache[21] || (_cache[21] = [
                        createBaseVNode("option", { value: "" }, "Select Target", -1),
                        createBaseVNode("option", { value: "ACCEPT" }, "ACCEPT", -1),
                        createBaseVNode("option", { value: "DROP" }, "DROP", -1),
                        createBaseVNode("option", { value: "REJECT" }, "REJECT", -1)
                      ]), 512), [
                        [vModelSelect, newRule.value.target]
                      ])
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_23, [
                    createBaseVNode("div", _hoisted_24, [
                      _cache[23] || (_cache[23] = createBaseVNode("label", {
                        for: "source",
                        class: "form-label"
                      }, "Source IP", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "source",
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newRule.value.source = $event),
                        class: "form-control",
                        placeholder: "e.g., 192.168.1.0/24"
                      }, null, 512), [
                        [vModelText, newRule.value.source]
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_25, [
                      _cache[24] || (_cache[24] = createBaseVNode("label", {
                        for: "destination",
                        class: "form-label"
                      }, "Destination IP", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "destination",
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => newRule.value.destination = $event),
                        class: "form-control",
                        placeholder: "e.g., 10.0.0.0/8"
                      }, null, 512), [
                        [vModelText, newRule.value.destination]
                      ])
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_26, [
                    createBaseVNode("div", _hoisted_27, [
                      _cache[26] || (_cache[26] = createBaseVNode("label", {
                        for: "protocol",
                        class: "form-label"
                      }, "Protocol", -1)),
                      withDirectives(createBaseVNode("select", {
                        id: "protocol",
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => newRule.value.protocol = $event),
                        class: "form-select"
                      }, _cache[25] || (_cache[25] = [
                        createBaseVNode("option", { value: "" }, "Any", -1),
                        createBaseVNode("option", { value: "tcp" }, "TCP", -1),
                        createBaseVNode("option", { value: "udp" }, "UDP", -1),
                        createBaseVNode("option", { value: "icmp" }, "ICMP", -1)
                      ]), 512), [
                        [vModelSelect, newRule.value.protocol]
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_28, [
                      _cache[27] || (_cache[27] = createBaseVNode("label", {
                        for: "port",
                        class: "form-label"
                      }, "Port", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "port",
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => newRule.value.port = $event),
                        class: "form-control",
                        placeholder: "e.g., 80, 443, 22"
                      }, null, 512), [
                        [vModelText, newRule.value.port]
                      ])
                    ])
                  ])
                ], 32)
              ]),
              createBaseVNode("div", _hoisted_29, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  onClick: _cache[8] || (_cache[8] = ($event) => showAddRuleModal.value = false)
                }, "Cancel"),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-primary",
                  onClick: addRule,
                  disabled: addingRule.value
                }, [
                  addingRule.value ? (openBlock(), createElementBlock("span", _hoisted_31)) : createCommentVNode("", true),
                  _cache[28] || (_cache[28] = createTextVNode(" Add Rule "))
                ], 8, _hoisted_30)
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_32, [
          toast.value.show ? (openBlock(), createElementBlock("div", _hoisted_33, [
            createBaseVNode("div", _hoisted_34, [
              createBaseVNode("i", {
                class: normalizeClass(toast.value.type === "success" ? "bi bi-check-circle-fill text-success" : "bi bi-exclamation-triangle-fill text-danger")
              }, null, 2),
              createBaseVNode("strong", _hoisted_35, toDisplayString(toast.value.type === "success" ? "Success" : "Error"), 1),
              createBaseVNode("button", {
                type: "button",
                class: "btn-close ms-auto",
                onClick: _cache[9] || (_cache[9] = ($event) => toast.value.show = false)
              })
            ]),
            createBaseVNode("div", _hoisted_36, toDisplayString(toast.value.message), 1)
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const firewall = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0a61573"]]);
export {
  firewall as default
};
