import { _ as _export_sfc, g as fetchGet, M as fetchPut, A as fetchPost, K as fetchDelete, c as createElementBlock, b as createBaseVNode, f as createTextVNode, t as toDisplayString, m as withDirectives, y as vModelText, F as Fragment, h as renderList, J as withModifiers, B as vModelSelect, v as vModelCheckbox, e as createCommentVNode, n as normalizeClass, a as openBlock } from "./index-xvqfLBaG.js";
const _sfc_main = {
  name: "UserManagement",
  data() {
    return {
      users: [],
      statistics: {},
      loading: false,
      saving: false,
      loadingPermissions: false,
      searchQuery: "",
      showCreateModal: false,
      showEditModal: false,
      showPermissionsModal: false,
      editingUser: null,
      selectedUser: null,
      userPermissions: [],
      userForm: {
        username: "",
        full_name: "",
        email: "",
        role: "user",
        password: "",
        is_active: true
      },
      alert: {
        show: false,
        type: "alert-success",
        message: ""
      },
      availablePermissions: [
        "dashboard_access",
        "user_management",
        "firewall_management",
        "routing_management",
        "logging_management",
        "system_status",
        "wireguard_management",
        "settings_management"
      ]
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(
        (user) => user.username.toLowerCase().includes(query) || user.full_name && user.full_name.toLowerCase().includes(query) || user.email && user.email.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.loadUsers();
    this.loadStatistics();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const result = await fetchGet("/api/users");
        console.log("Users API response:", result);
        if (result.status) {
          this.users = result.data;
          console.log("Users data set:", this.users);
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to load users");
        console.error("Error loading users:", error);
      } finally {
        this.loading = false;
      }
    },
    async loadStatistics() {
      try {
        const result = await fetchGet("/api/users/statistics");
        console.log("Statistics API response:", result);
        if (result.status) {
          this.statistics = result.data;
          console.log("Statistics data set:", this.statistics);
        }
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        username: user.username,
        full_name: user.full_name || "",
        email: user.email || "",
        role: user.role,
        password: "",
        is_active: user.is_active
      };
      this.showEditModal = true;
    },
    async viewPermissions(user) {
      this.selectedUser = user;
      this.loadingPermissions = true;
      this.showPermissionsModal = true;
      try {
        const result = await fetchGet(`/api/users/${user.id}/permissions`);
        if (result.status) {
          this.userPermissions = result.data;
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to load permissions");
        console.error("Error loading permissions:", error);
      } finally {
        this.loadingPermissions = false;
      }
    },
    async saveUser() {
      this.saving = true;
      try {
        let result;
        if (this.editingUser) {
          result = await fetchPut(`/api/users/${this.editingUser.id}`, this.userForm);
        } else {
          result = await fetchPost("/api/users", this.userForm);
        }
        if (result.status) {
          this.showAlert("success", result.message);
          this.closeModal();
          this.loadUsers();
          this.loadStatistics();
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to save user");
        console.error("Error saving user:", error);
      } finally {
        this.saving = false;
      }
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
        return;
      }
      try {
        const result = await fetchDelete(`/api/users/${user.id}`);
        if (result.status) {
          this.showAlert("success", result.message);
          this.loadUsers();
          this.loadStatistics();
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to delete user");
        console.error("Error deleting user:", error);
      }
    },
    async grantPermission(permission) {
      try {
        const result = await fetchPost(`/api/users/${this.selectedUser.id}/permissions`, { permission });
        if (result.status) {
          this.userPermissions.push(permission);
          this.showAlert("success", "Permission granted successfully");
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to grant permission");
        console.error("Error granting permission:", error);
      }
    },
    async revokePermission(permission) {
      try {
        const result = await fetchDelete(`/api/users/${this.selectedUser.id}/permissions/${permission}`);
        if (result.status) {
          this.userPermissions = this.userPermissions.filter((p) => p !== permission);
          this.showAlert("success", "Permission revoked successfully");
        } else {
          this.showAlert("error", result.message);
        }
      } catch (error) {
        this.showAlert("error", "Failed to revoke permission");
        console.error("Error revoking permission:", error);
      }
    },
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.editingUser = null;
      this.userForm = {
        username: "",
        full_name: "",
        email: "",
        role: "user",
        password: "",
        is_active: true
      };
    },
    formatDate(dateString) {
      if (!dateString) return "Never";
      return new Date(dateString).toLocaleString();
    },
    formatPermission(permission) {
      return permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    },
    showAlert(type, message) {
      this.alert = {
        show: true,
        type: `alert-${type === "error" ? "danger" : type}`,
        message
      };
      setTimeout(() => {
        this.alert.show = false;
      }, 5e3);
    }
  }
};
const _hoisted_1 = { class: "user-management" };
const _hoisted_2 = { class: "d-flex justify-content-between align-items-center mb-4" };
const _hoisted_3 = ["disabled"];
const _hoisted_4 = { class: "row mb-4" };
const _hoisted_5 = { class: "col-md-3" };
const _hoisted_6 = { class: "card bg-primary text-white" };
const _hoisted_7 = { class: "card-body" };
const _hoisted_8 = { class: "d-flex justify-content-between" };
const _hoisted_9 = { class: "mb-0" };
const _hoisted_10 = { class: "col-md-3" };
const _hoisted_11 = { class: "card bg-success text-white" };
const _hoisted_12 = { class: "card-body" };
const _hoisted_13 = { class: "d-flex justify-content-between" };
const _hoisted_14 = { class: "mb-0" };
const _hoisted_15 = { class: "col-md-3" };
const _hoisted_16 = { class: "card bg-warning text-white" };
const _hoisted_17 = { class: "card-body" };
const _hoisted_18 = { class: "d-flex justify-content-between" };
const _hoisted_19 = { class: "mb-0" };
const _hoisted_20 = { class: "col-md-3" };
const _hoisted_21 = { class: "card bg-info text-white" };
const _hoisted_22 = { class: "card-body" };
const _hoisted_23 = { class: "d-flex justify-content-between" };
const _hoisted_24 = { class: "mb-0" };
const _hoisted_25 = { class: "card" };
const _hoisted_26 = { class: "card-header" };
const _hoisted_27 = { class: "d-flex justify-content-between align-items-center" };
const _hoisted_28 = { class: "d-flex gap-2" };
const _hoisted_29 = ["disabled"];
const _hoisted_30 = { class: "card-body p-0" };
const _hoisted_31 = {
  key: 0,
  class: "text-center p-4"
};
const _hoisted_32 = {
  key: 1,
  class: "text-center p-4"
};
const _hoisted_33 = {
  key: 2,
  class: "table-responsive"
};
const _hoisted_34 = { class: "table table-hover table-dark mb-0" };
const _hoisted_35 = { class: "d-flex align-items-center" };
const _hoisted_36 = { class: "text-muted" };
const _hoisted_37 = { class: "btn-group btn-group-sm" };
const _hoisted_38 = ["onClick"];
const _hoisted_39 = ["onClick"];
const _hoisted_40 = ["onClick", "disabled"];
const _hoisted_41 = {
  key: 0,
  class: "modal fade show",
  style: { "display": "block", "background-color": "rgba(0,0,0,0.5)" },
  tabindex: "-1"
};
const _hoisted_42 = { class: "modal-dialog" };
const _hoisted_43 = { class: "modal-content" };
const _hoisted_44 = { class: "modal-header" };
const _hoisted_45 = { class: "modal-title" };
const _hoisted_46 = { class: "modal-body" };
const _hoisted_47 = { class: "mb-3" };
const _hoisted_48 = ["disabled"];
const _hoisted_49 = { class: "mb-3" };
const _hoisted_50 = { class: "mb-3" };
const _hoisted_51 = { class: "mb-3" };
const _hoisted_52 = { class: "mb-3" };
const _hoisted_53 = { class: "form-label" };
const _hoisted_54 = ["required"];
const _hoisted_55 = {
  key: 0,
  class: "mb-3"
};
const _hoisted_56 = { class: "form-check" };
const _hoisted_57 = { class: "modal-footer" };
const _hoisted_58 = ["disabled"];
const _hoisted_59 = {
  key: 0,
  class: "spinner-border spinner-border-sm me-2"
};
const _hoisted_60 = {
  key: 1,
  class: "modal fade show",
  style: { "display": "block", "background-color": "rgba(0,0,0,0.5)" },
  tabindex: "-1"
};
const _hoisted_61 = { class: "modal-dialog modal-lg" };
const _hoisted_62 = { class: "modal-content" };
const _hoisted_63 = { class: "modal-header" };
const _hoisted_64 = { class: "modal-title" };
const _hoisted_65 = { class: "modal-body" };
const _hoisted_66 = {
  key: 0,
  class: "text-center p-4"
};
const _hoisted_67 = { key: 1 };
const _hoisted_68 = { class: "row" };
const _hoisted_69 = { class: "col-md-6" };
const _hoisted_70 = { class: "list-group" };
const _hoisted_71 = ["onClick"];
const _hoisted_72 = { class: "col-md-6" };
const _hoisted_73 = { class: "list-group" };
const _hoisted_74 = ["onClick"];
const _hoisted_75 = { class: "modal-footer" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      _cache[17] || (_cache[17] = createBaseVNode("div", null, [
        createBaseVNode("h2", { class: "mb-1" }, "User Management"),
        createBaseVNode("p", { class: "text-muted mb-0" }, "Manage system users and permissions")
      ], -1)),
      createBaseVNode("button", {
        class: "btn btn-primary",
        onClick: _cache[0] || (_cache[0] = ($event) => $data.showCreateModal = true),
        disabled: $data.loading
      }, _cache[16] || (_cache[16] = [
        createBaseVNode("i", { class: "bi bi-person-plus me-2" }, null, -1),
        createTextVNode("Add User ")
      ]), 8, _hoisted_3)
    ]),
    createBaseVNode("div", _hoisted_4, [
      createBaseVNode("div", _hoisted_5, [
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("div", null, [
                createBaseVNode("h4", _hoisted_9, toDisplayString($data.statistics.total_users || 0), 1),
                _cache[18] || (_cache[18] = createBaseVNode("p", { class: "mb-0" }, "Total Users", -1))
              ]),
              _cache[19] || (_cache[19] = createBaseVNode("div", { class: "align-self-center" }, [
                createBaseVNode("i", { class: "bi bi-people fs-1" })
              ], -1))
            ])
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_10, [
        createBaseVNode("div", _hoisted_11, [
          createBaseVNode("div", _hoisted_12, [
            createBaseVNode("div", _hoisted_13, [
              createBaseVNode("div", null, [
                createBaseVNode("h4", _hoisted_14, toDisplayString($data.statistics.active_users || 0), 1),
                _cache[20] || (_cache[20] = createBaseVNode("p", { class: "mb-0" }, "Active Users", -1))
              ]),
              _cache[21] || (_cache[21] = createBaseVNode("div", { class: "align-self-center" }, [
                createBaseVNode("i", { class: "bi bi-person-check fs-1" })
              ], -1))
            ])
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_15, [
        createBaseVNode("div", _hoisted_16, [
          createBaseVNode("div", _hoisted_17, [
            createBaseVNode("div", _hoisted_18, [
              createBaseVNode("div", null, [
                createBaseVNode("h4", _hoisted_19, toDisplayString($data.statistics.admin_users || 0), 1),
                _cache[22] || (_cache[22] = createBaseVNode("p", { class: "mb-0" }, "Admin Users", -1))
              ]),
              _cache[23] || (_cache[23] = createBaseVNode("div", { class: "align-self-center" }, [
                createBaseVNode("i", { class: "bi bi-shield-check fs-1" })
              ], -1))
            ])
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_20, [
        createBaseVNode("div", _hoisted_21, [
          createBaseVNode("div", _hoisted_22, [
            createBaseVNode("div", _hoisted_23, [
              createBaseVNode("div", null, [
                createBaseVNode("h4", _hoisted_24, toDisplayString($data.statistics.active_sessions || 0), 1),
                _cache[24] || (_cache[24] = createBaseVNode("p", { class: "mb-0" }, "Active Sessions", -1))
              ]),
              _cache[25] || (_cache[25] = createBaseVNode("div", { class: "align-self-center" }, [
                createBaseVNode("i", { class: "bi bi-laptop fs-1" })
              ], -1))
            ])
          ])
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_25, [
      createBaseVNode("div", _hoisted_26, [
        createBaseVNode("div", _hoisted_27, [
          _cache[27] || (_cache[27] = createBaseVNode("h5", { class: "mb-0" }, "Users", -1)),
          createBaseVNode("div", _hoisted_28, [
            withDirectives(createBaseVNode("input", {
              type: "text",
              class: "form-control form-control-sm",
              placeholder: "Search users...",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.searchQuery = $event),
              style: { "width": "200px" }
            }, null, 512), [
              [vModelText, $data.searchQuery]
            ]),
            createBaseVNode("button", {
              class: "btn btn-outline-secondary btn-sm",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.loadUsers && $options.loadUsers(...args)),
              disabled: $data.loading
            }, _cache[26] || (_cache[26] = [
              createBaseVNode("i", { class: "bi bi-arrow-clockwise" }, null, -1)
            ]), 8, _hoisted_29)
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_30, [
        $data.loading ? (openBlock(), createElementBlock("div", _hoisted_31, _cache[28] || (_cache[28] = [
          createBaseVNode("div", {
            class: "spinner-border",
            role: "status"
          }, [
            createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
          ], -1)
        ]))) : $options.filteredUsers.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_32, _cache[29] || (_cache[29] = [
          createBaseVNode("i", { class: "bi bi-people fs-1 text-muted" }, null, -1),
          createBaseVNode("p", { class: "text-muted mt-2" }, "No users found", -1)
        ]))) : (openBlock(), createElementBlock("div", _hoisted_33, [
          createBaseVNode("table", _hoisted_34, [
            _cache[34] || (_cache[34] = createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, "Username"),
                createBaseVNode("th", null, "Full Name"),
                createBaseVNode("th", null, "Email"),
                createBaseVNode("th", null, "Role"),
                createBaseVNode("th", null, "Status"),
                createBaseVNode("th", null, "Last Login"),
                createBaseVNode("th", null, "Actions")
              ])
            ], -1)),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($options.filteredUsers, (user) => {
                return openBlock(), createElementBlock("tr", {
                  key: user.id
                }, [
                  createBaseVNode("td", null, [
                    createBaseVNode("div", _hoisted_35, [
                      _cache[30] || (_cache[30] = createBaseVNode("i", { class: "bi bi-person-circle me-2" }, null, -1)),
                      createBaseVNode("strong", null, toDisplayString(user.username), 1)
                    ])
                  ]),
                  createBaseVNode("td", null, toDisplayString(user.full_name || "-"), 1),
                  createBaseVNode("td", null, toDisplayString(user.email || "-"), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", {
                      class: normalizeClass(["badge", user.role === "admin" ? "bg-danger" : "bg-primary"])
                    }, toDisplayString(user.role), 3)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", {
                      class: normalizeClass(["badge", user.is_active ? "bg-success" : "bg-secondary"])
                    }, toDisplayString(user.is_active ? "Active" : "Inactive"), 3)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("small", _hoisted_36, toDisplayString(user.last_login ? $options.formatDate(user.last_login) : "Never"), 1)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("div", _hoisted_37, [
                      createBaseVNode("button", {
                        class: "btn btn-outline-primary",
                        onClick: ($event) => $options.editUser(user),
                        title: "Edit User"
                      }, _cache[31] || (_cache[31] = [
                        createBaseVNode("i", { class: "bi bi-pencil" }, null, -1)
                      ]), 8, _hoisted_38),
                      createBaseVNode("button", {
                        class: "btn btn-outline-info",
                        onClick: ($event) => $options.viewPermissions(user),
                        title: "View Permissions"
                      }, _cache[32] || (_cache[32] = [
                        createBaseVNode("i", { class: "bi bi-key" }, null, -1)
                      ]), 8, _hoisted_39),
                      createBaseVNode("button", {
                        class: "btn btn-outline-danger",
                        onClick: ($event) => $options.deleteUser(user),
                        disabled: user.role === "admin" && $data.statistics.admin_users <= 1,
                        title: "Delete User"
                      }, _cache[33] || (_cache[33] = [
                        createBaseVNode("i", { class: "bi bi-trash" }, null, -1)
                      ]), 8, _hoisted_40)
                    ])
                  ])
                ]);
              }), 128))
            ])
          ])
        ]))
      ])
    ]),
    $data.showCreateModal || $data.showEditModal ? (openBlock(), createElementBlock("div", _hoisted_41, [
      createBaseVNode("div", _hoisted_42, [
        createBaseVNode("div", _hoisted_43, [
          createBaseVNode("div", _hoisted_44, [
            createBaseVNode("h5", _hoisted_45, toDisplayString($data.editingUser ? "Edit User" : "Create New User"), 1),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.closeModal && $options.closeModal(...args))
            })
          ]),
          createBaseVNode("div", _hoisted_46, [
            createBaseVNode("form", {
              onSubmit: _cache[10] || (_cache[10] = withModifiers((...args) => $options.saveUser && $options.saveUser(...args), ["prevent"]))
            }, [
              createBaseVNode("div", _hoisted_47, [
                _cache[35] || (_cache[35] = createBaseVNode("label", { class: "form-label" }, "Username *", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.userForm.username = $event),
                  disabled: $data.editingUser,
                  required: ""
                }, null, 8, _hoisted_48), [
                  [vModelText, $data.userForm.username]
                ])
              ]),
              createBaseVNode("div", _hoisted_49, [
                _cache[36] || (_cache[36] = createBaseVNode("label", { class: "form-label" }, "Full Name", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.userForm.full_name = $event)
                }, null, 512), [
                  [vModelText, $data.userForm.full_name]
                ])
              ]),
              createBaseVNode("div", _hoisted_50, [
                _cache[37] || (_cache[37] = createBaseVNode("label", { class: "form-label" }, "Email", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "email",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.userForm.email = $event)
                }, null, 512), [
                  [vModelText, $data.userForm.email]
                ])
              ]),
              createBaseVNode("div", _hoisted_51, [
                _cache[39] || (_cache[39] = createBaseVNode("label", { class: "form-label" }, "Role *", -1)),
                withDirectives(createBaseVNode("select", {
                  class: "form-select",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.userForm.role = $event),
                  required: ""
                }, _cache[38] || (_cache[38] = [
                  createBaseVNode("option", { value: "user" }, "User", -1),
                  createBaseVNode("option", { value: "admin" }, "Admin", -1)
                ]), 512), [
                  [vModelSelect, $data.userForm.role]
                ])
              ]),
              createBaseVNode("div", _hoisted_52, [
                createBaseVNode("label", _hoisted_53, "Password " + toDisplayString($data.editingUser ? "(leave blank to keep current)" : "*"), 1),
                withDirectives(createBaseVNode("input", {
                  type: "password",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.userForm.password = $event),
                  required: !$data.editingUser
                }, null, 8, _hoisted_54), [
                  [vModelText, $data.userForm.password]
                ])
              ]),
              $data.editingUser ? (openBlock(), createElementBlock("div", _hoisted_55, [
                createBaseVNode("div", _hoisted_56, [
                  withDirectives(createBaseVNode("input", {
                    class: "form-check-input",
                    type: "checkbox",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.userForm.is_active = $event),
                    id: "isActive"
                  }, null, 512), [
                    [vModelCheckbox, $data.userForm.is_active]
                  ]),
                  _cache[40] || (_cache[40] = createBaseVNode("label", {
                    class: "form-check-label",
                    for: "isActive"
                  }, " Active ", -1))
                ])
              ])) : createCommentVNode("", true)
            ], 32)
          ]),
          createBaseVNode("div", _hoisted_57, [
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-secondary",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "Cancel"),
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-primary",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.saveUser && $options.saveUser(...args)),
              disabled: $data.saving
            }, [
              $data.saving ? (openBlock(), createElementBlock("span", _hoisted_59)) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString($data.editingUser ? "Update" : "Create"), 1)
            ], 8, _hoisted_58)
          ])
        ])
      ])
    ])) : createCommentVNode("", true),
    $data.showPermissionsModal ? (openBlock(), createElementBlock("div", _hoisted_60, [
      createBaseVNode("div", _hoisted_61, [
        createBaseVNode("div", _hoisted_62, [
          createBaseVNode("div", _hoisted_63, [
            createBaseVNode("h5", _hoisted_64, "User Permissions - " + toDisplayString($data.selectedUser?.username), 1),
            createBaseVNode("button", {
              type: "button",
              class: "btn-close",
              onClick: _cache[13] || (_cache[13] = ($event) => $data.showPermissionsModal = false)
            })
          ]),
          createBaseVNode("div", _hoisted_65, [
            $data.loadingPermissions ? (openBlock(), createElementBlock("div", _hoisted_66, _cache[41] || (_cache[41] = [
              createBaseVNode("div", {
                class: "spinner-border",
                role: "status"
              }, [
                createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
              ], -1)
            ]))) : (openBlock(), createElementBlock("div", _hoisted_67, [
              createBaseVNode("div", _hoisted_68, [
                createBaseVNode("div", _hoisted_69, [
                  _cache[43] || (_cache[43] = createBaseVNode("h6", null, "Available Permissions", -1)),
                  createBaseVNode("div", _hoisted_70, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList($data.availablePermissions, (permission) => {
                      return openBlock(), createElementBlock("button", {
                        key: permission,
                        class: "list-group-item list-group-item-action d-flex justify-content-between align-items-center",
                        onClick: ($event) => $options.grantPermission(permission)
                      }, [
                        createTextVNode(toDisplayString($options.formatPermission(permission)) + " ", 1),
                        _cache[42] || (_cache[42] = createBaseVNode("i", { class: "bi bi-plus-circle text-success" }, null, -1))
                      ], 8, _hoisted_71);
                    }), 128))
                  ])
                ]),
                createBaseVNode("div", _hoisted_72, [
                  _cache[45] || (_cache[45] = createBaseVNode("h6", null, "Granted Permissions", -1)),
                  createBaseVNode("div", _hoisted_73, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList($data.userPermissions, (permission) => {
                      return openBlock(), createElementBlock("div", {
                        key: permission,
                        class: "list-group-item d-flex justify-content-between align-items-center"
                      }, [
                        createTextVNode(toDisplayString($options.formatPermission(permission)) + " ", 1),
                        createBaseVNode("button", {
                          class: "btn btn-sm btn-outline-danger",
                          onClick: ($event) => $options.revokePermission(permission)
                        }, _cache[44] || (_cache[44] = [
                          createBaseVNode("i", { class: "bi bi-x-circle" }, null, -1)
                        ]), 8, _hoisted_74)
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ]))
          ]),
          createBaseVNode("div", _hoisted_75, [
            createBaseVNode("button", {
              type: "button",
              class: "btn btn-secondary",
              onClick: _cache[14] || (_cache[14] = ($event) => $data.showPermissionsModal = false)
            }, "Close")
          ])
        ])
      ])
    ])) : createCommentVNode("", true),
    $data.alert.show ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(["alert alert-dismissible", $data.alert.type]),
      role: "alert"
    }, [
      createTextVNode(toDisplayString($data.alert.message) + " ", 1),
      createBaseVNode("button", {
        type: "button",
        class: "btn-close",
        onClick: _cache[15] || (_cache[15] = ($event) => $data.alert.show = false)
      })
    ], 2)) : createCommentVNode("", true)
  ]);
}
const userManagement = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-85caffcb"]]);
export {
  userManagement as default
};
