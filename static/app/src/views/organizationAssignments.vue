<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-0">
              <i class="bi bi-people me-2"></i>
              Organization User Assignments
            </h2>
            <p class="text-muted mb-0">Manage user assignments to organizations</p>
          </div>
          <button class="btn btn-primary" @click="openAssignUserModal">
            <i class="bi bi-plus-circle me-2"></i>
            Assign User to Organization
          </button>
        </div>

        <!-- Quick Stats -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="bi bi-building me-3" style="font-size: 2rem;"></i>
                  <div>
                    <h4 class="mb-0">{{ organizations.length }}</h4>
                    <small>Total Organizations</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="bi bi-person-check me-3" style="font-size: 2rem;"></i>
                  <div>
                    <h4 class="mb-0">{{ totalAssignments }}</h4>
                    <small>Total Assignments</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="bi bi-people me-3" style="font-size: 2rem;"></i>
                  <div>
                    <h4 class="mb-0">{{ users.length }}</h4>
                    <small>Total Users</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Organizations with Users -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-building me-2"></i>
              Organizations & User Assignments
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center p-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Organization</th>
                    <th>Assigned Users</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="org in organizations" :key="org.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="me-2" 
                             :style="`width: 12px; height: 12px; background-color: ${org.color}; border-radius: 50%;`">
                        </div>
                        <div>
                          <strong>{{ org.name }}</strong>
                          <br>
                          <small class="text-muted">{{ org.description || 'No description' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div v-if="getOrgUsers(org.id).length === 0" class="text-muted">
                        No users assigned
                      </div>
                      <div v-else>
                        <span v-for="user in getOrgUsers(org.id)" :key="user.id" 
                              class="badge bg-secondary me-1 mb-1">
                          {{ user.username }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" 
                              @click="viewOrgDetails(org)" 
                              title="View Details">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success" 
                              @click="openAssignUserModal(org)" 
                              title="Assign User">
                        <i class="bi bi-person-plus"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Organization Details Modal -->
    <div class="modal fade" id="orgDetailsModal" tabindex="-1" aria-labelledby="orgDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orgDetailsModalLabel">
              <i class="bi bi-building me-2"></i>
              {{ selectedOrg?.name }} - User Assignments
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrg">
              <div class="mb-3">
                <button class="btn btn-primary" @click="openAssignUserModal(selectedOrg)">
                  <i class="bi bi-person-plus me-2"></i>
                  Assign New User
                </button>
              </div>
              
              <div v-if="orgUsers.length === 0" class="text-center p-3 border rounded">
                <i class="bi bi-person-x text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted mt-2 mb-0">No users assigned to this organization</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Assigned Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in orgUsers" :key="user.id">
                      <td>{{ user.username }}</td>
                      <td>{{ user.email || '-' }}</td>
                      <td>{{ formatDate(user.assigned_at) }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-danger" 
                                @click="removeUserFromOrg(user.id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign User Modal -->
    <div class="modal fade" id="assignUserModal" tabindex="-1" aria-labelledby="assignUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="assignUserModalLabel">Assign User to Organization</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="assignUser">
              <div class="mb-3">
                <label for="selectedOrg" class="form-label">Organization <span class="text-danger">*</span></label>
                <select class="form-select" id="selectedOrg" v-model="assignmentForm.organization_id" required>
                  <option value="">Select Organization</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">
                    {{ org.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="selectedUser" class="form-label">User <span class="text-danger">*</span></label>
                <select class="form-select" id="selectedUser" v-model="assignmentForm.user_id" required>
                  <option value="">Select User</option>
                  <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.username }} {{ user.email ? `(${user.email})` : '' }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="assignUser">Assign User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'OrganizationAssignments',
  setup() {
    const organizations = ref([])
    const users = ref([])
    const userOrganizations = ref([])
    const loading = ref(false)
    const selectedOrg = ref(null)
    const orgUsers = ref([])
    
    const assignmentForm = ref({
      user_id: '',
      organization_id: ''
    })
    
    const totalAssignments = computed(() => {
      return userOrganizations.value.length
    })
    
    const availableUsers = computed(() => {
      // Filter out users who are already assigned to the selected organization
      const assignedUserIds = userOrganizations.value
        .filter(uo => uo.organization_id === parseInt(assignmentForm.value.organization_id))
        .map(uo => uo.user_id)
      
      return users.value.filter(user => !assignedUserIds.includes(user.id))
    })
    
    const loadData = async () => {
      loading.value = true
      try {
        // Load organizations
        const orgsResponse = await fetch('/api/organizations')
        const orgsResult = await orgsResponse.json()
        if (orgsResult.status) {
          organizations.value = orgsResult.data
        }
        
        // Load users
        const usersResponse = await fetch('/api/users')
        const usersResult = await usersResponse.json()
        if (usersResult.status) {
          users.value = usersResult.data
        }
        
        // Load user-organization assignments
        for (const org of organizations.value) {
          const response = await fetch(`/api/organizations/${org.id}/users`)
          const result = await response.json()
          if (result.status) {
            result.data.forEach(user => {
              userOrganizations.value.push({
                user_id: user.id,
                organization_id: org.id,
                username: user.username,
                email: user.email,
                assigned_at: user.assigned_at
              })
            })
          }
        }
      } catch (error) {
        showToast('error', 'Error loading data: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    const getOrgUsers = (orgId) => {
      return userOrganizations.value.filter(uo => uo.organization_id === orgId)
    }
    
    const viewOrgDetails = async (org) => {
      selectedOrg.value = org
      try {
        const response = await fetch(`/api/organizations/${org.id}/users`)
        const result = await response.json()
        if (result.status) {
          orgUsers.value = result.data
        }
      } catch (error) {
        showToast('error', 'Error loading organization users: ' + error.message)
      }
      const modal = new bootstrap.Modal(document.getElementById('orgDetailsModal'))
      modal.show()
    }
    
    const openAssignUserModal = (org = null) => {
      assignmentForm.value = {
        user_id: '',
        organization_id: org ? org.id : ''
      }
      const modal = new bootstrap.Modal(document.getElementById('assignUserModal'))
      modal.show()
    }
    
    const assignUser = async () => {
      try {
        const response = await fetch(`/api/organization/users/${assignmentForm.value.user_id}/organizations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: assignmentForm.value.user_id,
            organization_id: assignmentForm.value.organization_id
          })
        })
        
        const result = await response.json()
        if (result.status) {
          showToast('success', result.message)
          bootstrap.Modal.getInstance(document.getElementById('assignUserModal')).hide()
          // Reload data
          userOrganizations.value = []
          orgUsers.value = []
          await loadData()
        } else {
          showToast('error', result.message)
        }
      } catch (error) {
        showToast('error', 'Error assigning user: ' + error.message)
      }
    }
    
    const removeUserFromOrg = async (userId) => {
      if (confirm('Are you sure you want to remove this user from the organization?')) {
        try {
          const response = await fetch(`/api/organization/users/${userId}/organizations/${selectedOrg.value.id}`, {
            method: 'DELETE'
          })
          
          const result = await response.json()
          if (result.status) {
            showToast('success', result.message)
            // Reload data
            userOrganizations.value = []
            orgUsers.value = []
            await loadData()
          } else {
            showToast('error', result.message)
          }
        } catch (error) {
          showToast('error', 'Error removing user: ' + error.message)
        }
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString()
    }
    
    const showToast = (type, message) => {
      const toast = document.createElement('div')
      toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`
      toast.style.top = '20px'
      toast.style.right = '20px'
      toast.style.zIndex = '9999'
      toast.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(toast)
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 5000)
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      organizations,
      users,
      userOrganizations,
      loading,
      selectedOrg,
      orgUsers,
      assignmentForm,
      totalAssignments,
      availableUsers,
      getOrgUsers,
      viewOrgDetails,
      openAssignUserModal,
      assignUser,
      removeUserFromOrg,
      formatDate
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.badge {
  font-size: 0.75rem;
}

/* Dark mode overrides */
[data-bs-theme="dark"] .card {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
}

[data-bs-theme="dark"] .card-header {
  background-color: #374151 !important;
  border-bottom-color: #4a5568 !important;
}

[data-bs-theme="dark"] .card-title {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .table {
  color: #e2e8f0 !important;
  background-color: #2d3748 !important;
}

[data-bs-theme="dark"] .table-hover tbody tr:hover {
  background-color: #374151 !important;
}

[data-bs-theme="dark"] .table-light {
  background-color: #374151 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .table-light th {
  background-color: #374151 !important;
  color: #e2e8f0 !important;
  border-bottom-color: #4a5568 !important;
}

[data-bs-theme="dark"] .table tbody tr {
  background-color: #2d3748 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .table tbody tr td {
  border-top-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .text-muted {
  color: #a0aec0 !important;
}

[data-bs-theme="dark"] .border {
  border-color: #4a5568 !important;
}

[data-bs-theme="dark"] .badge {
  color: #ffffff !important;
}

[data-bs-theme="dark"] .modal-content {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
}

[data-bs-theme="dark"] .modal-header {
  background-color: #374151 !important;
  border-bottom-color: #4a5568 !important;
}

[data-bs-theme="dark"] .modal-title {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .modal-footer {
  background-color: #374151 !important;
  border-top-color: #4a5568 !important;
}

[data-bs-theme="dark"] .form-control {
  background-color: #374151 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .form-control:focus {
  background-color: #374151 !important;
  border-color: #3182ce !important;
  color: #e2e8f0 !important;
  box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25) !important;
}

[data-bs-theme="dark"] .form-select {
  background-color: #374151 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .form-select:focus {
  background-color: #374151 !important;
  border-color: #3182ce !important;
  color: #e2e8f0 !important;
  box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25) !important;
}

[data-bs-theme="dark"] .form-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%) !important;
}

[data-bs-theme="dark"] h2 {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] h5 {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] p {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] strong {
  color: #e2e8f0 !important;
}
</style>








