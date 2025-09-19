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
        @click="openAddUserModal"
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
                <th>Groups</th>
                <th>VPN IP</th>
                <th>VPN Status</th>
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
                  <div v-if="user.user_groups && user.user_groups.length > 0">
                    <span 
                      v-for="group in user.user_groups" 
                      :key="group.group_id"
                      class="badge me-1 mb-1" 
                      :style="`background-color: ${group.group_color || '#6c757d'}; color: white;`"
                    >
                      {{ group.group_name }}
                    </span>
                  </div>
                  <span v-else class="text-muted">
                    <i class="bi bi-exclamation-circle"></i> No Groups
                  </span>
                </td>
                <td>
                  <span v-if="user.user_groups && user.user_groups.length > 0 && user.user_groups[0].vpn_peer_generated">{{ user.user_groups[0].peer_ip }}</span>
                  <span v-else>No VPN</span>
                </td>
                <td>
                  <span v-if="user.user_groups && user.user_groups.length > 0 && user.user_groups[0].vpn_peer_generated"
                        :class="['badge',
                          user.user_groups[0].peer_status === 'active' ? 'bg-success' :
                          user.user_groups[0].peer_status === 'pending' ? 'bg-warning' : 'bg-secondary']">
                    {{ user.user_groups[0].peer_status }}
                  </span>
                  <span v-else>No VPN</span>
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
                      class="btn btn-outline-success" 
                      @click="viewUserDetails(user)"
                      title="View Details"
                    >
                      <i class="bi bi-eye"></i>
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
                <label class="form-label">Groups</label>
                <select 
                  class="form-select" 
                  v-model="userForm.selectedGroupId"
                  @change="handleGroupSelection"
                >
                  <option value="">Choose a group...</option>
                  <option 
                    v-for="group in availableGroups"
                    :key="group.id"
                    :value="group.id"
                    :disabled="isUserInGroup(group.id)"
                  >
                    {{ group.name }} {{ isUserInGroup(group.id) ? '(Already assigned)' : '' }}
                  </option>
                </select>
                <div v-if="userForm.user_groups && userForm.user_groups.length > 0" class="mt-2">
                  <small class="text-muted">Current groups:</small>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <span 
                      v-for="group in userForm.user_groups" 
                      :key="group.group_id"
                      class="badge" 
                      :style="`background-color: ${group.group_color || '#6c757d'}; color: white;`"
                    >
                      {{ group.group_name }}
                      <i class="bi bi-x-circle ms-1" @click="removeUserFromGroup(group.group_id)" style="cursor: pointer;"></i>
                    </span>
                  </div>
                </div>
                <div v-else class="text-muted mt-1">
                  <i class="bi bi-exclamation-circle"></i> No Groups Assigned
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">VPN IP Address (Optional)</label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="userForm.manual_ip"
                    placeholder="Leave empty for auto-generation"
                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                    title="Enter a valid IP address (e.g., 10.110.56.5)"
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="generateSuggestedIp"
                    title="Generate suggested IP based on WireGuard subnet"
                  >
                    <i class="bi bi-lightning"></i> Suggest
                  </button>
                  <div class="dropdown">
                    <button 
                      class="btn btn-outline-info dropdown-toggle" 
                      type="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      :disabled="!availableIps || Object.keys(availableIps).length === 0"
                      title="Pick from available IP addresses"
                    >
                      <i class="bi bi-filter-circle me-1"></i>Pick IP
                    </button>
                    <ul class="dropdown-menu" style="width: 300px;">
                      <li v-if="availableIps && Object.keys(availableIps).length > 0">
                        <div class="px-3 d-flex gap-3 align-items-center">
                          <label class="text-muted">
                            <i class="bi bi-search"></i>
                          </label>
                          <input 
                            class="form-control form-control-sm"
                            v-model="ipSearchString"
                            placeholder="Search IP..."
                          >
                        </div>
                        <hr class="my-2">
                        <div class="px-3 overflow-x-scroll d-flex gap-2">
                          <small class="text-muted">Subnet</small>
                          <button 
                            v-for="subnet in Object.keys(availableIps)"
                            :key="subnet"
                            @click="selectedSubnet = subnet"
                            :class="{'bg-primary-subtle': selectedSubnet === subnet}"
                            class="btn btn-sm text-primary-emphasis rounded-3"
                          >
                            {{ subnet }}
                          </button>
                        </div>
                        <hr class="mt-2 mb-0">
                      </li>
                      <li>
                        <div class="overflow-y-scroll" style="height: 200px;">
                          <div v-for="ip in filteredAvailableIps" :key="ip">
                            <a class="dropdown-item" @click="selectAvailableIp(ip)">
                              <small>{{ ip }}</small>
                            </a>
                          </div>
                          <div v-if="filteredAvailableIps.length === 0" class="px-3 py-2">
                            <small class="text-muted">
                              {{ ipSearchString ? `No IP containing "${ipSearchString}"` : 'No available IPs' }}
                            </small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <small class="form-text text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  Leave empty to auto-generate, specify manually, or pick from available IPs
                </small>
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

    <!-- User Details Modal -->
    <div v-if="showUserDetailsModal" class="modal fade show" 
         style="display: block; background-color: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details - {{ selectedUser?.username }}</h5>
            <button type="button" class="btn-close" @click="showUserDetailsModal = false"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="userDetailsTabs">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'userInfo' }" 
                   href="#userInfo" @click.prevent="activeTab = 'userInfo'">User Info</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'userGroups' }" 
                   href="#userGroups" @click.prevent="activeTab = 'userGroups'">Groups</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'vpnPeers' }" 
                   href="#vpnPeers" @click.prevent="activeTab = 'vpnPeers'">VPN Peers</a>
              </li>
            </ul>
            
            <div class="tab-content">
              <!-- User Info Tab -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'userInfo' }" id="userInfo">
                <div class="row mt-3">
                  <div class="col-md-6">
                    <h6>Basic Information</h6>
                    <table class="table table-borderless">
                      <tr>
                        <td><strong>Username:</strong></td>
                        <td>{{ selectedUser?.username }}</td>
                      </tr>
                      <tr>
                        <td><strong>Full Name:</strong></td>
                        <td>{{ selectedUser?.full_name || 'Not set' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{{ selectedUser?.email || 'Not set' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Groups:</strong></td>
                        <td>
                          <div v-if="selectedUser?.user_groups && selectedUser.user_groups.length > 0">
                            <span 
                              v-for="group in selectedUser.user_groups" 
                              :key="group.group_id"
                              class="badge me-1 mb-1" 
                              :style="`background-color: ${group.group_color || '#6c757d'}; color: white;`"
                            >
                              {{ group.group_name }}
                            </span>
                          </div>
                          <span v-else class="text-muted">
                            <i class="bi bi-exclamation-circle"></i> No Groups Assigned
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          <span class="badge" :class="selectedUser?.is_active ? 'bg-success' : 'bg-danger'">
                            {{ selectedUser?.is_active ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="col-md-6">
                    <h6>Account Information</h6>
                    <table class="table table-borderless">
                      <tr>
                        <td><strong>Created:</strong></td>
                        <td>{{ formatDate(selectedUser?.created_at) }}</td>
                      </tr>
                      <tr>
                        <td><strong>Last Updated:</strong></td>
                        <td>{{ formatDate(selectedUser?.updated_at) }}</td>
                      </tr>
                      <tr>
                        <td><strong>Last Login:</strong></td>
                        <td>{{ selectedUser?.last_login ? formatDate(selectedUser.last_login) : 'Never' }}</td>
                      </tr>
                      <tr>
                        <td><strong>MFA Enabled:</strong></td>
                        <td>
                          <i class="bi" :class="selectedUser?.mfa_enabled ? 'bi-shield-check text-success' : 'bi-shield-x text-danger'"></i>
                          {{ selectedUser?.mfa_enabled ? 'Enabled' : 'Disabled' }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              
              <!-- Groups Tab -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'userGroups' }" id="userGroups">
                <div class="row mt-3">
                  <div class="col-md-8">
                    <h6>Group Memberships</h6>
                    <div v-if="loadingUserGroups" class="text-center p-3">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="userGroups.length === 0" class="text-center p-4 text-muted">
                      <i class="bi bi-people" style="font-size: 2rem;"></i>
                      <p class="mt-2 mb-0">User is not assigned to any groups</p>
                    </div>
                    <div v-else>
                      <div v-for="group in userGroups" :key="group.id" class="card mb-2">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <div class="d-flex align-items-center">
                                <div class="me-2" 
                                     :style="`width: 12px; height: 12px; background-color: ${group.color}; border-radius: 50%;`">
                                </div>
                                <strong>{{ group.group_name }}</strong>
                              </div>
                              <small class="text-muted">{{ group.description }}</small>
                            </div>
                            <div class="text-end">
                              <span class="badge" :class="getGroupStatusBadge(group)">
                                {{ group.vpn_peer_generated ? 'VPN Active' : 'No VPN' }}
                              </span>
                              <br>
                              <small class="text-muted">{{ group.vpn_server_name }}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <h6>Quick Actions</h6>
                    <div class="d-grid gap-2">
                      <button class="btn btn-primary btn-sm" @click="assignUserToGroup">
                        <i class="bi bi-plus-circle me-1"></i>
                        Assign to Group
                      </button>
                      <button class="btn btn-outline-secondary btn-sm" @click="loadUserGroups">
                        <i class="bi bi-arrow-clockwise me-1"></i>
                        Refresh Groups
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- VPN Peers Tab -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'vpnPeers' }" id="vpnPeers">
                <div class="row mt-3">
                  <div class="col-md-8">
                    <h6>VPN Peer Status</h6>
                    <div v-if="loadingVpnPeers" class="text-center p-3">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="vpnPeers.length === 0" class="text-center p-4 text-muted">
                      <i class="bi bi-shield-lock" style="font-size: 2rem;"></i>
                      <p class="mt-2 mb-0">No VPN peers generated</p>
                    </div>
                    <div v-else>
                      <div v-for="peer in vpnPeers" :key="peer.id" class="card mb-2">
                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <div class="d-flex align-items-center">
                                <div class="me-2" 
                                     :style="`width: 12px; height: 12px; background-color: ${peer.group_color}; border-radius: 50%;`">
                                </div>
                                <strong>{{ peer.group_name }}</strong>
                              </div>
                              <small class="text-muted">{{ peer.vpn_server_name }} • {{ peer.peer_ip }}</small>
                            </div>
                            <div class="text-end">
                              <span class="badge" :class="peer.config_generated ? 'bg-success' : 'bg-warning'">
                                {{ peer.config_generated ? 'Generated' : 'Pending' }}
                              </span>
                              <br>
                              <button class="btn btn-sm btn-outline-primary mt-1" @click="downloadVpnConfig(peer)">
                                <i class="bi bi-download me-1"></i>
                                Download Config
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <h6>VPN Summary</h6>
                    <div class="card">
                      <div class="card-body">
                        <div class="row text-center">
                          <div class="col-4">
                            <h4 class="text-primary">{{ vpnPeers.length }}</h4>
                            <small>Total Peers</small>
                          </div>
                          <div class="col-4">
                            <h4 class="text-success">{{ vpnPeers.filter(p => p.config_generated).length }}</h4>
                            <small>Generated</small>
                          </div>
                          <div class="col-4">
                            <h4 class="text-warning">{{ vpnPeers.filter(p => !p.config_generated).length }}</h4>
                            <small>Pending</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showUserDetailsModal = false">Close</button>
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
import {fetchGet, fetchPost, fetchPut, fetchDelete} from "@/utilities/fetch.js";

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
      showUserDetailsModal: false,
      editingUser: null,
      selectedUser: null,
      availableGroups: [],
      userPermissions: [],
      activeTab: 'userInfo',
      userGroups: [],
      vpnPeers: [],
      loadingUserGroups: false,
      loadingVpnPeers: false,
      userForm: {
        username: '',
        full_name: '',
        email: '',
        password: '',
        user_groups: [],
        selectedGroupId: '',
        manual_ip: '',
        is_active: true
      },
      availableIps: {},
      ipSearchString: '',
      selectedSubnet: '',
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
        
        if (result.status) {
          this.users = result.data;
          
          // Load groups for each user
          for (let user of this.users) {
            try {
              const groupsResult = await fetchGet(`/api/users/${user.id}/groups`);
              if (groupsResult.status) {
                user.user_groups = groupsResult.data || [];
              } else {
                user.user_groups = [];
              }
            } catch (error) {
              console.error(`Error loading groups for user ${user.id}:`, error);
              user.user_groups = [];
            }
          }
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
        
        if (result.status) {
          this.statistics = result.data;
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    },
    
    async openAddUserModal() {
      // Reset form
      this.userForm = {
        username: '',
        full_name: '',
        email: '',
        password: '',
        user_groups: [],
        selectedGroupId: '',
        is_active: true
      };
      
      // Load available groups for dropdown
      try {
        const result = await fetchGet('/api/enhanced-rbac/groups');
        if (result.status) {
          this.availableGroups = result.data || [];
        }
      } catch (error) {
        console.error('Error loading groups:', error);
      }
      
      // Load available IPs
      await this.loadAvailableIps();
      
      this.showCreateModal = true;
    },

    async editUser(user) {
      this.editingUser = user;
      this.userForm = {
        username: user.username,
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        user_groups: user.user_groups || [],
        selectedGroupId: '',
        is_active: user.is_active
      };
      
      // Load available groups for dropdown
      try {
        const result = await fetchGet('/api/enhanced-rbac/groups');
        if (result.status) {
          this.availableGroups = result.data || [];
        }
      } catch (error) {
        console.error('Error loading groups:', error);
      }
      
      // Load available IPs
      await this.loadAvailableIps();
      
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
          result = await fetchPut(`/api/users/${this.editingUser.id}`, this.userForm);
        } else {
          // For new users, remove groups from userForm before creating user
          const userFormForCreation = { ...this.userForm };
          const groupsToAssign = userFormForCreation.user_groups || [];
          delete userFormForCreation.user_groups;
          delete userFormForCreation.selectedGroupId;
          
          result = await fetchPost('/api/users', userFormForCreation);
          
          // After successful user creation, assign groups
          if (result.status && groupsToAssign.length > 0) {
            const newUserId = result.data?.id;
            if (newUserId) {
              for (const group of groupsToAssign) {
                try {
                  await fetchPost(`/api/users/${newUserId}/groups`, {
                    group_id: group.group_id,
                    manual_ip: this.userForm.manual_ip || null
                  });
                } catch (groupError) {
                  console.error(`Error assigning group ${group.group_name}:`, groupError);
                }
              }
              this.showAlert('success', `${result.message} Groups assigned successfully!`);
            }
          }
        }
        
        if (result.status) {
          if (this.editingUser) {
            this.showAlert('success', result.message);
          }
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
        password: '',
        user_groups: [],
        selectedGroupId: '',
        manual_ip: '',
        is_active: true
      };
    },

    // IP Generation Methods
    generateSuggestedIp() {
      // Generate a suggested IP based on WireGuard subnet (10.110.56.x)
      // This is a simple implementation - in real scenario, we'd check used IPs
      const baseSubnet = '10.110.56.';
      const suggestedHost = Math.floor(Math.random() * 250) + 5; // 5-254 range
      this.userForm.manual_ip = `${baseSubnet}${suggestedHost}`;
      this.showAlert('info', `Suggested IP: ${this.userForm.manual_ip}`);
    },

    // Available IP Methods
    async loadAvailableIps() {
      try {
        console.log('Loading available IPs...');
        const result = await fetchGet('/api/getAvailableIPs/wg0');
        console.log('Available IPs result:', result);
        
        if (result.status) {
          this.availableIps = result.data || {};
          console.log('Available IPs loaded:', this.availableIps);
          
          // Set default selected subnet
          if (Object.keys(this.availableIps).length > 0) {
            this.selectedSubnet = Object.keys(this.availableIps)[0];
            console.log('Default subnet selected:', this.selectedSubnet);
          }
        } else {
          console.warn('Failed to load available IPs:', result.message);
          this.availableIps = {};
        }
      } catch (error) {
        console.error('Error loading available IPs:', error);
        this.availableIps = {};
      }
    },

    selectAvailableIp(ip) {
      this.userForm.manual_ip = ip;
      this.showAlert('info', `Selected IP: ${ip}`);
    },
    
    // Computed Properties
    filteredAvailableIps() {
      if (!this.availableIps || !this.selectedSubnet || !this.availableIps[this.selectedSubnet]) {
        return [];
      }
      
      let ips = this.availableIps[this.selectedSubnet];
      
      // Filter by search string
      if (this.ipSearchString) {
        ips = ips.filter(ip => ip.includes(this.ipSearchString));
      }
      
      return ips;
    },
    
    // User Details Modal Methods
    async viewUserDetails(user) {
      this.selectedUser = user;
      this.activeTab = 'userInfo';
      this.showUserDetailsModal = true;
      
      // Load user groups and VPN peers
      await this.loadUserGroups();
      await this.loadVpnPeers();
    },
    
    async loadUserGroups() {
      if (!this.selectedUser) return;
      
      this.loadingUserGroups = true;
      try {
        const result = await fetchGet(`/api/users/${this.selectedUser.id}/groups`);
        
        if (result.status) {
          this.userGroups = result.data;
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to load user groups');
        console.error('Error loading user groups:', error);
      } finally {
        this.loadingUserGroups = false;
      }
    },
    
    async loadVpnPeers() {
      if (!this.selectedUser) return;
      
      this.loadingVpnPeers = true;
      try {
        const result = await fetchGet(`/api/users/${this.selectedUser.id}/vpn-peers`);
        
        if (result.status) {
          this.vpnPeers = result.data;
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to load VPN peers');
        console.error('Error loading VPN peers:', error);
      } finally {
        this.loadingVpnPeers = false;
      }
    },
    
    async assignUserToGroup() {
      // TODO: Implement group assignment modal
      this.showAlert('info', 'Group assignment feature coming soon');
    },
    
    async downloadVpnConfig(peer) {
      try {
        const result = await fetchGet(`/api/users/${this.selectedUser.id}/vpn-config`);
        
        if (result.status) {
          // Create and download config file
          const config = this.generateWireguardConfig(peer, result.data);
          this.downloadFile(config, `${this.selectedUser.username}-${peer.group_name}.conf`);
          this.showAlert('success', 'VPN config downloaded successfully');
        } else {
          this.showAlert('error', result.message);
        }
      } catch (error) {
        this.showAlert('error', 'Failed to download VPN config');
        console.error('Error downloading VPN config:', error);
      }
    },
    
    generateWireguardConfig(peer, configData) {
      return `[Interface]
PrivateKey = ${peer.private_key}
Address = ${peer.peer_ip}/32
DNS = 8.8.8.8

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = SERVER_ENDPOINT:51820
AllowedIPs = ${configData.peers.find(p => p.id === peer.id)?.allowed_ips?.join(',') || '0.0.0.0/0'}
PersistentKeepalive = 25`;
    },
    
    downloadFile(content, filename) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    
    getGroupStatusBadge(group) {
      if (group.vpn_peer_generated) {
        return 'bg-success';
      } else if (group.vpn_enabled) {
        return 'bg-info';
      } else {
        return 'bg-warning';
      }
    },

    // Group Assignment Methods
    async handleGroupSelection() {
      if (this.userForm.selectedGroupId && (this.editingUser || this.showCreateModal)) {
        console.log('Group selected:', this.userForm.selectedGroupId);
        await this.confirmGroupAssignment();
        // Reset dropdown selection
        this.userForm.selectedGroupId = '';
      }
    },

    isUserInGroup(groupId) {
      if (!this.userForm.user_groups) return false;
      return this.userForm.user_groups.some(group => group.group_id === groupId);
    },

    async confirmGroupAssignment() {
      const groupId = this.userForm.selectedGroupId;
      
      if (!groupId) return;

      // For Add User modal, we need to store the selected group and assign after user creation
      if (this.showCreateModal) {
        // Store the selected group to assign after user creation
        if (!this.userForm.user_groups) {
          this.userForm.user_groups = [];
        }
        
        // Find the group details
        const selectedGroup = this.availableGroups.find(g => g.id === parseInt(groupId));
        if (selectedGroup) {
          // Add to user_groups for display
          this.userForm.user_groups.push({
            group_id: selectedGroup.id,
            group_name: selectedGroup.name,
            group_color: selectedGroup.color
          });
          
          this.showAlert('success', `Group "${selectedGroup.name}" will be assigned after user creation.`);
        }
        
        // Reset dropdown selection
        this.userForm.selectedGroupId = '';
        return;
      }

      // For Edit User modal, assign immediately
      const userId = this.editingUser?.id;
      if (!userId) return;

      try {
        const result = await fetchPost(`/api/users/${userId}/groups`, {
          group_id: parseInt(groupId),
          manual_ip: this.userForm.manual_ip || null
        });

        if (result.status) {
          this.showAlert('success', `User successfully assigned to group! VPN peer generated.`);
          
          // Refresh user data
          await this.loadUsers();
          
          // Reset dropdown selection
          this.userForm.selectedGroupId = '';
        } else {
          this.showAlert('error', result.message || 'Failed to assign user to group');
        }
      } catch (error) {
        console.error('Error assigning user to group:', error);
        this.showAlert('error', 'Failed to assign user to group');
      }
    },

    async removeUserFromGroup(groupId) {
      // For Add User modal, just remove from userForm.user_groups
      if (this.showCreateModal) {
        if (this.userForm.user_groups) {
          this.userForm.user_groups = this.userForm.user_groups.filter(group => group.group_id !== groupId);
          this.showAlert('success', 'Group removed from assignment list.');
        }
        return;
      }

      // For Edit User modal, make API call
      const userId = this.editingUser?.id;
      if (!userId) return;

      try {
        const result = await fetchDelete(`/api/users/${userId}/groups/${groupId}`);

        if (result.status) {
          this.showAlert('success', 'User successfully removed from group!');
          
          // Refresh user data
          await this.loadUsers();
          
          // Update userForm if in edit mode
          if (this.showEditModal && this.userForm.user_groups) {
            this.userForm.user_groups = this.userForm.user_groups.filter(group => group.group_id !== groupId);
          }
        } else {
          this.showAlert('error', result.message || 'Failed to remove user from group');
        }
      } catch (error) {
        console.error('Error removing user from group:', error);
        this.showAlert('error', 'Failed to remove user from group');
      }
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
