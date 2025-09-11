import { _ as _export_sfc, r as ref, o as onMounted, c as createElementBlock, b as createBaseVNode, f as createTextVNode, F as Fragment, h as renderList, J as withModifiers, m as withDirectives, y as vModelText, B as vModelSelect, L as createStaticVNode, e as createCommentVNode, n as normalizeClass, t as toDisplayString, g as fetchGet, A as fetchPost, a as openBlock, K as fetchDelete } from "./index-xvqfLBaG.js";
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
const _hoisted_11 = { class: "badge bg-primary" };
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
const _hoisted_27 = { class: "col-md-12 mb-3" };
const _hoisted_28 = { class: "modal-footer" };
const _hoisted_29 = ["disabled"];
const _hoisted_30 = {
  key: 0,
  class: "spinner-border spinner-border-sm me-1"
};
const _hoisted_31 = { class: "toast-container position-fixed bottom-0 end-0 p-3" };
const _hoisted_32 = {
  key: 0,
  class: "toast show",
  role: "alert"
};
const _hoisted_33 = { class: "toast-header" };
const _hoisted_34 = { class: "ms-2" };
const _hoisted_35 = { class: "toast-body" };
const _sfc_main = {
  __name: "routing",
  setup(__props) {
    const loading = ref(true);
    const addingRoute = ref(false);
    const showAddRouteModal = ref(false);
    const routes = ref([]);
    const newRoute = ref({
      destination: "",
      gateway: "",
      interface: "",
      metric: "",
      source: ""
    });
    const toast = ref({
      show: false,
      type: "success",
      message: ""
    });
    const loadRoutes = async () => {
      try {
        loading.value = true;
        const response = await fetchGet("/api/routes");
        if (response.status) {
          routes.value = response.data || [];
        } else {
          showToast("error", "Failed to load routes");
        }
      } catch (error) {
        showToast("error", "Error loading routes: " + error.message);
      } finally {
        loading.value = false;
      }
    };
    const addRoute = async () => {
      try {
        addingRoute.value = true;
        const response = await fetchPost("/api/routes", newRoute.value);
        if (response.status) {
          showToast("success", "Route added successfully");
          showAddRouteModal.value = false;
          resetNewRoute();
          await loadRoutes();
        } else {
          showToast("error", response.message || "Failed to add route");
        }
      } catch (error) {
        showToast("error", "Error adding route: " + error.message);
      } finally {
        addingRoute.value = false;
      }
    };
    const deleteRoute = async (routeId) => {
      if (!confirm("Are you sure you want to delete this route?")) {
        return;
      }
      try {
        const response = await fetchDelete(`/api/routes/${routeId}`);
        if (response.status) {
          showToast("success", "Route deleted successfully");
          await loadRoutes();
        } else {
          showToast("error", response.message || "Failed to delete route");
        }
      } catch (error) {
        showToast("error", "Error deleting route: " + error.message);
      }
    };
    const resetNewRoute = () => {
      newRoute.value = {
        destination: "",
        gateway: "",
        interface: "",
        metric: "",
        source: ""
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
    onMounted(() => {
      loadRoutes();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              _cache[10] || (_cache[10] = createBaseVNode("h2", { class: "mb-0" }, [
                createBaseVNode("i", { class: "bi bi-diagram-3 me-2" }),
                createTextVNode(" Routing Management ")
              ], -1)),
              createBaseVNode("div", null, [
                createBaseVNode("button", {
                  class: "btn btn-primary",
                  onClick: _cache[0] || (_cache[0] = ($event) => showAddRouteModal.value = true)
                }, _cache[9] || (_cache[9] = [
                  createBaseVNode("i", { class: "bi bi-plus-circle me-1" }, null, -1),
                  createTextVNode(" Add Route ")
                ]))
              ])
            ]),
            createBaseVNode("div", _hoisted_5, [
              _cache[15] || (_cache[15] = createBaseVNode("div", { class: "card-header" }, [
                createBaseVNode("h5", { class: "mb-0" }, [
                  createBaseVNode("i", { class: "bi bi-diagram-3 me-2" }),
                  createTextVNode(" Routing Table ")
                ])
              ], -1)),
              createBaseVNode("div", _hoisted_6, [
                loading.value ? (openBlock(), createElementBlock("div", _hoisted_7, _cache[11] || (_cache[11] = [
                  createBaseVNode("div", {
                    class: "spinner-border text-primary",
                    role: "status"
                  }, [
                    createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
                  ], -1)
                ]))) : routes.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, _cache[12] || (_cache[12] = [
                  createBaseVNode("i", { class: "bi bi-diagram-3 fs-1" }, null, -1),
                  createBaseVNode("p", { class: "mt-2" }, "No routes found", -1)
                ]))) : (openBlock(), createElementBlock("div", _hoisted_9, [
                  createBaseVNode("table", _hoisted_10, [
                    _cache[14] || (_cache[14] = createBaseVNode("thead", { class: "table-dark" }, [
                      createBaseVNode("tr", null, [
                        createBaseVNode("th", null, "ID"),
                        createBaseVNode("th", null, "Destination"),
                        createBaseVNode("th", null, "Gateway"),
                        createBaseVNode("th", null, "Interface"),
                        createBaseVNode("th", null, "Metric"),
                        createBaseVNode("th", null, "Source"),
                        createBaseVNode("th", null, "Actions")
                      ])
                    ], -1)),
                    createBaseVNode("tbody", null, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(routes.value, (route) => {
                        return openBlock(), createElementBlock("tr", {
                          key: route.id
                        }, [
                          createBaseVNode("td", null, toDisplayString(route.id), 1),
                          createBaseVNode("td", null, [
                            createBaseVNode("span", _hoisted_11, toDisplayString(route.destination || "default"), 1)
                          ]),
                          createBaseVNode("td", null, toDisplayString(route.gateway || "N/A"), 1),
                          createBaseVNode("td", null, [
                            route.interface ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString(route.interface), 1)) : (openBlock(), createElementBlock("span", _hoisted_13, "N/A"))
                          ]),
                          createBaseVNode("td", null, toDisplayString(route.metric || "N/A"), 1),
                          createBaseVNode("td", null, toDisplayString(route.source || "N/A"), 1),
                          createBaseVNode("td", null, [
                            createBaseVNode("button", {
                              class: "btn btn-sm btn-outline-danger",
                              onClick: ($event) => deleteRoute(route.id)
                            }, _cache[13] || (_cache[13] = [
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
        showAddRouteModal.value ? (openBlock(), createElementBlock("div", _hoisted_15, [
          createBaseVNode("div", _hoisted_16, [
            createBaseVNode("div", _hoisted_17, [
              createBaseVNode("div", _hoisted_18, [
                _cache[16] || (_cache[16] = createBaseVNode("h5", { class: "modal-title" }, [
                  createBaseVNode("i", { class: "bi bi-plus-circle me-2" }),
                  createTextVNode(" Add Static Route ")
                ], -1)),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn-close",
                  onClick: _cache[1] || (_cache[1] = ($event) => showAddRouteModal.value = false)
                })
              ]),
              createBaseVNode("div", _hoisted_19, [
                createBaseVNode("form", {
                  onSubmit: withModifiers(addRoute, ["prevent"])
                }, [
                  createBaseVNode("div", _hoisted_20, [
                    createBaseVNode("div", _hoisted_21, [
                      _cache[17] || (_cache[17] = createBaseVNode("label", {
                        for: "destination",
                        class: "form-label"
                      }, "Destination Network", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "destination",
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newRoute.value.destination = $event),
                        class: "form-control",
                        placeholder: "e.g., 192.168.1.0/24",
                        required: ""
                      }, null, 512), [
                        [vModelText, newRoute.value.destination]
                      ]),
                      _cache[18] || (_cache[18] = createBaseVNode("div", { class: "form-text" }, "Network address with CIDR notation", -1))
                    ]),
                    createBaseVNode("div", _hoisted_22, [
                      _cache[19] || (_cache[19] = createBaseVNode("label", {
                        for: "gateway",
                        class: "form-label"
                      }, "Gateway", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "gateway",
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newRoute.value.gateway = $event),
                        class: "form-control",
                        placeholder: "e.g., 192.168.1.1",
                        required: ""
                      }, null, 512), [
                        [vModelText, newRoute.value.gateway]
                      ]),
                      _cache[20] || (_cache[20] = createBaseVNode("div", { class: "form-text" }, "Next hop IP address", -1))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_23, [
                    createBaseVNode("div", _hoisted_24, [
                      _cache[22] || (_cache[22] = createBaseVNode("label", {
                        for: "interface",
                        class: "form-label"
                      }, "Interface", -1)),
                      withDirectives(createBaseVNode("select", {
                        id: "interface",
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newRoute.value.interface = $event),
                        class: "form-select"
                      }, _cache[21] || (_cache[21] = [
                        createStaticVNode('<option value="" data-v-f90df6d2>Auto-detect</option><option value="ens18" data-v-f90df6d2>ens18</option><option value="docker0" data-v-f90df6d2>docker0</option><option value="tailscale0" data-v-f90df6d2>tailscale0</option><option value="wg0" data-v-f90df6d2>wg0</option><option value="lo" data-v-f90df6d2>lo</option>', 6)
                      ]), 512), [
                        [vModelSelect, newRoute.value.interface]
                      ])
                    ]),
                    createBaseVNode("div", _hoisted_25, [
                      _cache[23] || (_cache[23] = createBaseVNode("label", {
                        for: "metric",
                        class: "form-label"
                      }, "Metric", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "number",
                        id: "metric",
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => newRoute.value.metric = $event),
                        class: "form-control",
                        placeholder: "e.g., 100",
                        min: "1",
                        max: "65535"
                      }, null, 512), [
                        [vModelText, newRoute.value.metric]
                      ]),
                      _cache[24] || (_cache[24] = createBaseVNode("div", { class: "form-text" }, "Route priority (lower = higher priority)", -1))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_26, [
                    createBaseVNode("div", _hoisted_27, [
                      _cache[25] || (_cache[25] = createBaseVNode("label", {
                        for: "source",
                        class: "form-label"
                      }, "Source IP", -1)),
                      withDirectives(createBaseVNode("input", {
                        type: "text",
                        id: "source",
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => newRoute.value.source = $event),
                        class: "form-control",
                        placeholder: "e.g., 192.168.1.100"
                      }, null, 512), [
                        [vModelText, newRoute.value.source]
                      ]),
                      _cache[26] || (_cache[26] = createBaseVNode("div", { class: "form-text" }, "Optional: Source IP for the route", -1))
                    ])
                  ])
                ], 32)
              ]),
              createBaseVNode("div", _hoisted_28, [
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-secondary",
                  onClick: _cache[7] || (_cache[7] = ($event) => showAddRouteModal.value = false)
                }, "Cancel"),
                createBaseVNode("button", {
                  type: "button",
                  class: "btn btn-primary",
                  onClick: addRoute,
                  disabled: addingRoute.value
                }, [
                  addingRoute.value ? (openBlock(), createElementBlock("span", _hoisted_30)) : createCommentVNode("", true),
                  _cache[27] || (_cache[27] = createTextVNode(" Add Route "))
                ], 8, _hoisted_29)
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_31, [
          toast.value.show ? (openBlock(), createElementBlock("div", _hoisted_32, [
            createBaseVNode("div", _hoisted_33, [
              createBaseVNode("i", {
                class: normalizeClass(toast.value.type === "success" ? "bi bi-check-circle-fill text-success" : "bi bi-exclamation-triangle-fill text-danger")
              }, null, 2),
              createBaseVNode("strong", _hoisted_34, toDisplayString(toast.value.type === "success" ? "Success" : "Error"), 1),
              createBaseVNode("button", {
                type: "button",
                class: "btn-close ms-auto",
                onClick: _cache[8] || (_cache[8] = ($event) => toast.value.show = false)
              })
            ]),
            createBaseVNode("div", _hoisted_35, toDisplayString(toast.value.message), 1)
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const routing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f90df6d2"]]);
export {
  routing as default
};
