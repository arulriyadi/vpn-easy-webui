<template>
  <div class="user-management">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">User Management</h2>
        <p class="text-muted mb-0">Manage system users and permissions</p>
      </div>
      <button 
        class="btn btn-primary" 
        @click="showCreateModal = true"
        :disabled="loading"
      >
        <i class="bi bi-person-plus me-2"></i>Add User
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mb-0">{{ statistics.total_users || 0 }}</h4>
                <p class="mb-0">Total Users</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-people fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mb-0">{{ statistics.active_users || 0 }}</h4>
                <p class="mb-0">Active Users</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-person-check fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mb-0">{{ statistics.admin_users || 0 }}</h4>
                <p class="mb-0">Admin Users</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-shield-check fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mb-0">{{ statistics.active_sessions || 0 }}</h4>
                <p class="mb-0">Active Sessions</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-laptop fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Users</h5>
          <div class="d-flex gap-2">
            <input 
              type="text" 
              class="form-control form-control-sm" 
              placeholder="Search users..."
              v-model="searchQuery"
              style="width: 200px;"
            >
            <button 
              class="btn btn-outline-secondary btn-sm" 
              @click="loadUsers"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center p-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="text-center p-4">
          <i class="bi bi-people fs-1 text-muted"></i>
          <p class="text-muted mt-2">No users found</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover table-dark mb-0">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-person-circle me-2"></i>
                    <strong>{{ user.username }}</strong>
                  </div>
                </td>
                <td>{{ user.full_name || '-' }}</td>
                <td>{{ user.email || '-' }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="user.role === 'admin' ? 'bg-danger' : 'bg-primary'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="user.is_active ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <small class="text-muted">
                    {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
                  </small>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary" 
                      @click="editUser(user)"
                      title="Edit User"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-info" 
                      @click="viewPermissions(user)"
                      title="View Permissions"
                    >
                      <i class="bi bi-key"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      @click="deleteUser(user)"
                      :disabled="user.role === 'admin' && statistics.admin_users <= 1"
                      title="Delete User"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal fade show" 
         style="display: block; background-color: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingUser ? 'Edit User' : 'Create New User' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Username *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="userForm.username"
                  :disabled="editingUser"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="userForm.full_name"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="userForm.email"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Role *</label>
                <select class="form-select" v-model="userForm.role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Password {{ editingUser ? '(leave blank to keep current)' : '*' }}</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="userForm.password"
                  :required="!editingUser"
                >
              </div>
              <div v-if="editingUser" class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    v-model="userForm.is_active"
                    id="isActive"
                  >
                  <label class="form-check-label" for="isActive">
                    Active
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="saveUser"
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingUser ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions Modal -->
    <div v-if="showPermissionsModal" class="modal fade show" 
         style="display: block; background-color: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Permissions - {{ selectedUser?.username }}</h5>
            <button type="button" class="btn-close" @click="showPermissionsModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingPermissions" class="text-center p-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-md-6">
                  <h6>Available Permissions</h6>
                  <div class="list-group">
                    <button 
                      v-for="permission in availablePermissions" 
                      :key="permission"
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      @click="grantPermission(permission)"
                    >
                      {{ formatPermission(permission) }}
                      <i class="bi bi-plus-circle text-success"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <h6>Granted Permissions</h6>
                  <div class="list-group">
                    <div 
                      v-for="permission in userPermissions" 
                      :key="permission"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {{ formatPermission(permission) }}
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="revokePermission(permission)"
                      >
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showPermissionsModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="alert.show" class="alert alert-dismissible" :class="alert.type" role="alert">
      {{ alert.message }}
      <button type="button" class="btn-close" @click="alert.show = false"></button>
    </div>
  </div>
</template>

<script>
import {fetchGet, fetchPost, fetchDelete} from "@/utilities/fetch.js";

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      statistics: {},
      loading: false,
      saving: false,
      loadingPermissions: false,
      searchQuery: '',
      showCreateModal: false,
      showEditModal: false,
      showPermissionsModal: false,
      editingUser: null,
      selectedUser: null,
      userPermissions: [],
      userForm: {
        username: '',
        full_name: '',
        email: '',
        role: 'user',
        password: '',
        is_active: true
      },
      alert: {
        show: false,
        type: 'alert-success',
        message: ''
      },
      availablePermissions: [
        'dashboard_access',
        'user_management',
        'firewall_management',
        'routing_management',
        'logging_management',
        'system_status',
        'wireguard_management',
        'settings_management'
      ]
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => 
        user.username.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
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
        const result = await fetchGet('/api/users');
        console.log('Users API response:', result);
        
        if (result.status) {
          this.users = result.data;
          console.log('Users data set:', this.users);
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to load users');
        console.error('Error loading users:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadStatistics() {
      try {
        const result = await fetchGet('/api/users/statistics');
        console.log('Statistics API response:', result);
        
        if (result.status) {
          this.statistics = result.data;
          console.log('Statistics data set:', this.statistics);
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    },
    
    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        username: user.username,
        full_name: user.full_name || '',
        email: user.email || '',
        role: user.role,
        password: '',
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
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to load permissions');
        console.error('Error loading permissions:', error);
      } finally {
        this.loadingPermissions = false;
      }
    },
    
    async saveUser() {
      this.saving = true;
      try {
        let result;
        if (this.editingUser) {
          result = await fetchPost(`/api/users/${this.editingUser.id}`, this.userForm);
        } else {
          result = await fetchPost('/api/users', this.userForm);
        }
        
        if (result.status) {
          this.showAlert('success', result.message);
          this.closeModal();
          this.loadUsers();
          this.loadStatistics();
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to save user');
        console.error('Error saving user:', error);
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
          this.showAlert('success', result.message);
          this.loadUsers();
          this.loadStatistics();
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to delete user');
        console.error('Error deleting user:', error);
      }
    },
    
    async grantPermission(permission) {
      try {
        const result = await fetchPost(`/api/users/${this.selectedUser.id}/permissions`, { permission });
        
        if (result.status) {
          this.userPermissions.push(permission);
          this.showAlert('success', 'Permission granted successfully');
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to grant permission');
        console.error('Error granting permission:', error);
      }
    },
    
    async revokePermission(permission) {
      try {
        const result = await fetchDelete(`/api/users/${this.selectedUser.id}/permissions/${permission}`);
        
        if (result.status) {
          this.userPermissions = this.userPermissions.filter(p => p !== permission);
          this.showAlert('success', 'Permission revoked successfully');
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to revoke permission');
        console.error('Error revoking permission:', error);
      }
    },
    
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.editingUser = null;
      this.userForm = {
        username: '',
        full_name: '',
        email: '',
        role: 'user',
        password: '',
        is_active: true
      };
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Never';
      return new Date(dateString).toLocaleString();
    },
    
    formatPermission(permission) {
      return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    
    showAlert(type, message) {
      this.alert = {
        show: true,
        type: `alert-${type === 'error' ? 'danger' : type}`,
        message: message
      };
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.alert.show = false;
      }, 5000);
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal.show {
  display: block !important;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.badge {
  font-size: 0.75em;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.list-group-item {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  min-width: 300px;
}

/* Dark theme table styling */
.table-dark {
  --bs-table-bg: #212529;
  --bs-table-striped-bg: #2c3034;
  --bs-table-striped-color: #fff;
  --bs-table-active-bg: #373b3e;
  --bs-table-active-color: #fff;
  --bs-table-hover-bg: #323539;
  --bs-table-hover-color: #fff;
  color: #fff;
  border-color: #373b3e;
}

.table-dark th,
.table-dark td {
  border-color: #373b3e;
}

.table-dark thead th {
  border-color: #373b3e;
  background-color: #343a40;
  color: #fff;
}

.table-dark tbody tr:hover {
  background-color: #323539;
  color: #fff;
}
</style>
