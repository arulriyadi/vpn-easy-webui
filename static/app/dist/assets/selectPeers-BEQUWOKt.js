import { _ as _export_sfc, r as ref, q as computed, H as watch, N as useRoute, D as DashboardConfigurationStore, E as reactive, a6 as useTemplateRef, a as openBlock, c as createElementBlock, b as createBaseVNode, d as createVNode, e as createCommentVNode, m as withDirectives, y as vModelText, F as Fragment, h as renderList, n as normalizeClass, t as toDisplayString, f as createTextVNode, A as fetchPost, g as fetchGet } from "./index-xvqfLBaG.js";
import { L as LocaleText } from "./localeText-DQBGUudF.js";
const _hoisted_1 = {
  class: "peerSettingContainer w-100 h-100 position-absolute top-0 start-0 overflow-y-scroll",
  ref: "selectPeersContainer"
};
const _hoisted_2 = { class: "container d-flex h-100 w-100" };
const _hoisted_3 = {
  class: "m-auto modal-dialog-centered dashboardModal",
  style: { "width": "700px" }
};
const _hoisted_4 = { class: "card rounded-3 shadow flex-grow-1" };
const _hoisted_5 = { class: "card-header bg-transparent d-flex align-items-center gap-2 p-4 flex-column pb-3" };
const _hoisted_6 = { class: "mb-2 w-100 d-flex" };
const _hoisted_7 = { class: "mb-0" };
const _hoisted_8 = { class: "d-flex w-100 align-items-center gap-2" };
const _hoisted_9 = { class: "d-flex gap-3" };
const _hoisted_10 = {
  class: "card-body px-4 flex-grow-1 d-flex gap-2 flex-column position-relative",
  ref: "card-body",
  style: { "overflow-y": "scroll" }
};
const _hoisted_11 = ["onClick", "disabled", "data-id"];
const _hoisted_12 = { key: 0 };
const _hoisted_13 = { class: "d-flex flex-column" };
const _hoisted_14 = { class: "fw-bold" };
const _hoisted_15 = { class: "text-muted" };
const _hoisted_16 = {
  key: 1,
  class: "ms-auto"
};
const _hoisted_17 = {
  key: 0,
  class: "spinner-border spinner-border-sm",
  role: "status"
};
const _hoisted_18 = { class: "card-footer px-4 py-3 gap-2 d-flex align-items-center" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = {
  key: 0,
  class: "flex-grow-1 text-center"
};
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
  key: 0,
  class: "flex-grow-1 text-center"
};
const _hoisted_23 = ["disabled"];
const _hoisted_24 = {
  key: 0,
  class: "flex-grow-1 text-center"
};
const _hoisted_25 = ["disabled"];
const _sfc_main = {
  __name: "selectPeers",
  props: {
    configurationPeers: Array
  },
  emits: ["refresh", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const deleteConfirmation = ref(false);
    const downloadConfirmation = ref(false);
    const selectedPeers = ref([]);
    const selectPeersSearchInput = ref("");
    const togglePeers = (id) => {
      if (selectedPeers.value.find((x) => x === id)) {
        selectedPeers.value = selectedPeers.value.filter((x) => x !== id);
      } else {
        selectedPeers.value.push(id);
      }
    };
    const searchPeers = computed(() => {
      if (deleteConfirmation.value || downloadConfirmation.value) {
        return props.configurationPeers.filter(
          (x) => selectedPeers.value.find((y) => y === x.id)
        );
      }
      if (selectPeersSearchInput.value.length > 0) {
        return props.configurationPeers.filter((x) => {
          return x.id.includes(selectPeersSearchInput.value) || x.name.includes(selectPeersSearchInput.value);
        });
      }
      return props.configurationPeers;
    });
    watch(selectedPeers, () => {
      if (selectedPeers.value.length === 0) {
        deleteConfirmation.value = false;
        downloadConfirmation.value = false;
      }
    });
    const route = useRoute();
    const dashboardStore = DashboardConfigurationStore();
    const emit = __emit;
    const submitting = ref(false);
    const submitDelete = () => {
      submitting.value = true;
      fetchPost(`/api/deletePeers/${route.params.id}`, {
        peers: selectedPeers.value
      }, (res) => {
        dashboardStore.newMessage("Server", res.message, res.status ? "success" : "danger");
        if (res.status) {
          selectedPeers.value = [];
          deleteConfirmation.value = false;
        }
        emit("refresh");
        submitting.value = false;
      });
    };
    const downloaded = reactive({
      success: [],
      failed: []
    });
    const cardBody = useTemplateRef("card-body");
    const el = useTemplateRef("sp");
    const submitDownload = async () => {
      downloadConfirmation.value = true;
      for (const x of selectedPeers.value) {
        cardBody.value.scrollTo({
          top: el.value.find((y) => y.dataset.id === x).offsetTop - 20,
          behavior: "smooth"
        });
        await fetchGet("/api/downloadPeer/" + route.params.id, {
          id: x
        }, (res) => {
          if (res.status) {
            const blob = new Blob([res.data.file], { type: "text/plain" });
            const jsonObjectUrl = URL.createObjectURL(blob);
            const filename = `${res.data.fileName}.conf`;
            const anchorEl = document.createElement("a");
            anchorEl.href = jsonObjectUrl;
            anchorEl.download = filename;
            anchorEl.click();
            downloaded.success.push(x);
          } else {
            downloaded.failed.push(x);
          }
        });
      }
    };
    const clearDownload = () => {
      downloaded.success = [];
      downloaded.failed = [];
      downloadConfirmation.value = false;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("div", _hoisted_6, [
                  createBaseVNode("h4", _hoisted_7, [
                    createVNode(LocaleText, { t: "Select Peers" })
                  ]),
                  createBaseVNode("button", {
                    type: "button",
                    class: "btn-close ms-auto",
                    onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
                  })
                ]),
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("div", _hoisted_9, [
                    !downloadConfirmation.value && selectedPeers.value.length !== __props.configurationPeers.map((x) => x.id).length ? (openBlock(), createElementBlock("a", {
                      key: 0,
                      role: "button",
                      onClick: _cache[1] || (_cache[1] = ($event) => selectedPeers.value = __props.configurationPeers.map((x) => x.id)),
                      class: "text-decoration-none text-body"
                    }, [
                      createBaseVNode("small", null, [
                        _cache[9] || (_cache[9] = createBaseVNode("i", { class: "bi bi-check-all me-2" }, null, -1)),
                        createVNode(LocaleText, { t: "Select All" })
                      ])
                    ])) : createCommentVNode("", true),
                    selectedPeers.value.length > 0 && !downloadConfirmation.value ? (openBlock(), createElementBlock("a", {
                      key: 1,
                      role: "button",
                      class: "text-decoration-none text-body",
                      onClick: _cache[2] || (_cache[2] = ($event) => selectedPeers.value = [])
                    }, [
                      createBaseVNode("small", null, [
                        _cache[10] || (_cache[10] = createBaseVNode("i", { class: "bi bi-x-circle-fill me-2" }, null, -1)),
                        createVNode(LocaleText, { t: "Clear Selection" })
                      ])
                    ])) : createCommentVNode("", true)
                  ]),
                  _cache[11] || (_cache[11] = createBaseVNode("label", {
                    class: "ms-auto",
                    for: "selectPeersSearchInput"
                  }, [
                    createBaseVNode("i", { class: "bi bi-search" })
                  ], -1)),
                  withDirectives(createBaseVNode("input", {
                    class: "form-control form-control-sm rounded-3",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => selectPeersSearchInput.value = $event),
                    id: "selectPeersSearchInput",
                    style: { "width": "200px !important" },
                    type: "text"
                  }, null, 512), [
                    [vModelText, selectPeersSearchInput.value]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_10, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(searchPeers.value, (p) => {
                  return openBlock(), createElementBlock("button", {
                    type: "button",
                    class: normalizeClass(["btn w-100 peerBtn text-start rounded-3 d-flex align-items-center gap-3", { active: selectedPeers.value.find((x) => x === p.id) }]),
                    onClick: ($event) => togglePeers(p.id),
                    key: p.id,
                    disabled: deleteConfirmation.value || downloadConfirmation.value,
                    ref_for: true,
                    ref: "sp",
                    "data-id": p.id
                  }, [
                    !downloadConfirmation.value ? (openBlock(), createElementBlock("span", _hoisted_12, [
                      createBaseVNode("i", {
                        class: normalizeClass(["bi", [selectedPeers.value.find((x) => x === p.id) ? "bi-check-circle-fill" : "bi-circle"]])
                      }, null, 2)
                    ])) : createCommentVNode("", true),
                    createBaseVNode("span", _hoisted_13, [
                      createBaseVNode("small", _hoisted_14, toDisplayString(p.name ? p.name : "Untitled Peer"), 1),
                      createBaseVNode("small", _hoisted_15, [
                        createBaseVNode("samp", null, toDisplayString(p.id), 1)
                      ])
                    ]),
                    downloadConfirmation.value ? (openBlock(), createElementBlock("span", _hoisted_16, [
                      !downloaded.success.find((x) => x === p.id) && !downloaded.failed.find((x) => x === p.id) ? (openBlock(), createElementBlock("span", _hoisted_17)) : (openBlock(), createElementBlock("i", {
                        key: 1,
                        class: normalizeClass(["bi", [downloaded.failed.find((x) => x === p.id) ? "bi-x-circle-fill" : "bi-check-circle-fill"]])
                      }, null, 2))
                    ])) : createCommentVNode("", true)
                  ], 10, _hoisted_11);
                }), 128))
              ], 512),
              createBaseVNode("div", _hoisted_18, [
                !deleteConfirmation.value && !downloadConfirmation.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createBaseVNode("button", {
                    class: "btn bg-primary-subtle text-primary-emphasis border-primary-subtle rounded-3",
                    disabled: selectedPeers.value.length === 0 || submitting.value,
                    onClick: _cache[4] || (_cache[4] = ($event) => submitDownload())
                  }, _cache[12] || (_cache[12] = [
                    createBaseVNode("i", { class: "bi bi-download" }, null, -1)
                  ]), 8, _hoisted_19),
                  selectedPeers.value.length > 0 ? (openBlock(), createElementBlock("span", _hoisted_20, [
                    _cache[13] || (_cache[13] = createBaseVNode("i", { class: "bi bi-check-circle-fill me-2" }, null, -1)),
                    createVNode(LocaleText, {
                      t: selectedPeers.value.length + " Peer" + (selectedPeers.value.length > 1 ? "s" : "")
                    }, null, 8, ["t"])
                  ])) : createCommentVNode("", true),
                  createBaseVNode("button", {
                    class: "btn bg-danger-subtle text-danger-emphasis border-danger-subtle ms-auto rounded-3",
                    onClick: _cache[5] || (_cache[5] = ($event) => deleteConfirmation.value = true),
                    disabled: selectedPeers.value.length === 0 || submitting.value
                  }, _cache[14] || (_cache[14] = [
                    createBaseVNode("i", { class: "bi bi-trash" }, null, -1)
                  ]), 8, _hoisted_21)
                ], 64)) : downloadConfirmation.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  downloaded.failed.length + downloaded.success.length < selectedPeers.value.length ? (openBlock(), createElementBlock("strong", _hoisted_22, [
                    createVNode(LocaleText, { t: "Downloading" }),
                    _cache[15] || (_cache[15] = createTextVNode()),
                    createVNode(LocaleText, {
                      t: selectedPeers.value.length + " Peer" + (selectedPeers.value.length > 1 ? "s" : "")
                    }, null, 8, ["t"]),
                    _cache[16] || (_cache[16] = createTextVNode("... "))
                  ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    createBaseVNode("strong", null, [
                      createVNode(LocaleText, { t: "Download Finished" })
                    ]),
                    createBaseVNode("button", {
                      onClick: _cache[6] || (_cache[6] = ($event) => clearDownload()),
                      class: "btn bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle rounded-3 ms-auto"
                    }, [
                      createVNode(LocaleText, { t: "Done" })
                    ])
                  ], 64))
                ], 64)) : deleteConfirmation.value ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                  createBaseVNode("button", {
                    class: "btn btn-danger rounded-3",
                    disabled: selectedPeers.value.length === 0 || submitting.value,
                    onClick: _cache[7] || (_cache[7] = ($event) => submitDelete())
                  }, [
                    createVNode(LocaleText, { t: "Yes" })
                  ], 8, _hoisted_23),
                  selectedPeers.value.length > 0 ? (openBlock(), createElementBlock("strong", _hoisted_24, [
                    createVNode(LocaleText, { t: "Are you sure to delete" }),
                    _cache[17] || (_cache[17] = createTextVNode()),
                    createVNode(LocaleText, {
                      t: selectedPeers.value.length + " Peer" + (selectedPeers.value.length > 1 ? "s" : "")
                    }, null, 8, ["t"]),
                    _cache[18] || (_cache[18] = createTextVNode("? "))
                  ])) : createCommentVNode("", true),
                  createBaseVNode("button", {
                    class: "btn bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle ms-auto rounded-3",
                    disabled: selectedPeers.value.length === 0 || submitting.value,
                    onClick: _cache[8] || (_cache[8] = ($event) => deleteConfirmation.value = false)
                  }, [
                    createVNode(LocaleText, { t: "No" })
                  ], 8, _hoisted_25)
                ], 64)) : createCommentVNode("", true)
              ])
            ])
          ])
        ])
      ], 512);
    };
  }
};
const selectPeers = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-177407c1"]]);
export {
  selectPeers as default
};
