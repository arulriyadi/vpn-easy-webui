<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-0">
              <i class="bi bi-building me-2"></i>
              Organization Management
            </h2>
            <p class="text-muted mb-0">Manage organizations and their network subnets</p>
          </div>
          <button class="btn btn-primary" @click="openCreateOrgModal">
            <i class="bi bi-plus-circle me-2"></i>
            Add New Organization
          </button>
        </div>

        <!-- Organizations List -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-building me-2"></i>
              Organizations
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center p-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="organizations.length === 0" class="text-center p-4">
              <i class="bi bi-building text-muted" style="font-size: 3rem;"></i>
              <p class="text-muted mt-2">No organizations found. Create your first organization to get started.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Organization</th>
                    <th>Description</th>
                    <th>Subnets</th>
                    <th>Users</th>
                    <th>Created</th>
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
                        <strong>{{ org.name }}</strong>
                      </div>
                    </td>
                    <td>{{ org.description || '-' }}</td>
                    <td>
                      <span class="badge bg-info">{{ org.subnet_count || 0 }} subnets</span>
                    </td>
                    <td>
                      <span class="badge bg-secondary">{{ org.user_count || 0 }} users</span>
                    </td>
                    <td>{{ formatDate(org.created_at) }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" 
                                @click="viewOrganization(org)" 
                                title="View Details">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" 
                                @click="editOrganization(org)" 
                                title="Edit Organization">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" 
                                @click="deleteOrganization(org)" 
                                title="Delete Organization">
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
      </div>
    </div>

    <!-- Create/Edit Organization Modal -->
    <div class="modal fade" id="orgModal" tabindex="-1" aria-labelledby="orgModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orgModalLabel">
              {{ editingOrg ? 'Edit Organization' : 'Create New Organization' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveOrganization">
              <div class="mb-3">
                <label for="orgName" class="form-label">Organization Name <span class="text-danger">*</span></label>
                <input type="text" 
                       class="form-control" 
                       id="orgName" 
                       v-model="orgForm.name" 
                       required 
                       placeholder="Enter organization name (e.g., EGOV)">
              </div>
              <div class="mb-3">
                <label for="orgDescription" class="form-label">Description</label>
                <textarea class="form-control" 
                          id="orgDescription" 
                          v-model="orgForm.description" 
                          rows="3" 
                          placeholder="Enter organization description"></textarea>
              </div>
              <div class="mb-3">
                <label for="orgColor" class="form-label">Color</label>
                <div class="input-group">
                  <input type="color" 
                         class="form-control form-control-color" 
                         id="orgColor" 
                         v-model="orgForm.color">
                  <span class="input-group-text">{{ orgForm.color }}</span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveOrganization">
              {{ editingOrg ? 'Update Organization' : 'Create Organization' }}
            </button>
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
              {{ selectedOrg?.name }} - Details
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrg">
              <!-- Organization Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6>Organization Information</h6>
                  <p><strong>Name:</strong> {{ selectedOrg.name }}</p>
                  <p><strong>Description:</strong> {{ selectedOrg.description || 'No description' }}</p>
                  <p><strong>Created:</strong> {{ formatDate(selectedOrg.created_at) }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Color</h6>
                  <div class="d-flex align-items-center">
                    <div class="me-3" 
                         :style="`width: 30px; height: 30px; background-color: ${selectedOrg.color}; border-radius: 50%;`">
                    </div>
                    <code>{{ selectedOrg.color }}</code>
                  </div>
                </div>
              </div>

              <!-- Subnets -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6>Organization Subnets</h6>
                  <button class="btn btn-sm btn-primary" @click="openAddSubnetModal">
                    <i class="bi bi-plus-circle me-1"></i>
                    Add Subnet
                  </button>
                </div>
                <div v-if="orgSubnets.length === 0" class="text-center p-3 border rounded">
                  <i class="bi bi-diagram-3 text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No subnets defined for this organization</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Subnet CIDR</th>
                        <th>Description</th>
                        <th>Primary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="subnet in orgSubnets" :key="subnet.id">
                        <td>
                          <code>{{ subnet.subnet_cidr }}</code>
                          <span v-if="subnet.is_primary" class="badge bg-success ms-2">Primary</span>
                        </td>
                        <td>{{ subnet.description || '-' }}</td>
                        <td>
                          <i class="bi" :class="subnet.is_primary ? 'bi-check-circle text-success' : 'bi-circle text-muted'"></i>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" 
                                  @click="deleteSubnet(subnet.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="editOrganization(selectedOrg)">
              <i class="bi bi-pencil me-2"></i>
              Edit Organization
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Subnet Modal -->
    <div class="modal fade" id="addSubnetModal" tabindex="-1" aria-labelledby="addSubnetModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addSubnetModalLabel">Add Subnet to Organization</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addSubnet">
              <div class="mb-3">
                <label for="subnetCidr" class="form-label">Subnet CIDR <span class="text-danger">*</span></label>
                <input type="text" 
                       class="form-control" 
                       id="subnetCidr" 
                       v-model="subnetForm.subnet_cidr" 
                       required 
                       placeholder="e.g., 10.10.0.0/16">
                <div class="form-text">Enter the subnet in CIDR notation (e.g., 192.168.1.0/24)</div>
              </div>
              <div class="mb-3">
                <label for="subnetDescription" class="form-label">Description</label>
                <input type="text" 
                       class="form-control" 
                       id="subnetDescription" 
                       v-model="subnetForm.description" 
                       placeholder="Enter subnet description">
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="isPrimary" 
                         v-model="subnetForm.is_primary">
                  <label class="form-check-label" for="isPrimary">
                    Mark as primary subnet
                  </label>
                  <div class="form-text">Primary subnet is the main network for this organization</div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addSubnet">Add Subnet</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Organizations',
  setup() {
    // Reactive data
    const organizations = ref([])
    const loading = ref(false)
    const editingOrg = ref(null)
    const selectedOrg = ref(null)
    const orgSubnets = ref([])
    
    const orgForm = ref({
      name: '',
      description: '',
      color: '#007bff'
    })
    
    const subnetForm = ref({
      subnet_cidr: '',
      description: '',
      is_primary: false
    })
    
    
    // Methods
    const loadOrganizations = async () => {
      loading.value = true
      try {
        const response = await fetch('/api/organizations')
        const result = await response.json()
        if (result.status) {
          organizations.value = result.data
        } else {
          showToast('error', 'Failed to load organizations: ' + result.message)
        }
      } catch (error) {
        showToast('error', 'Error loading organizations: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    const loadOrganizationDetails = async (orgId) => {
      try {
        const response = await fetch(`/api/organizations/${orgId}`)
        const result = await response.json()
        console.log('Organization details response:', result)
        if (result.status) {
          selectedOrg.value = result.data
          orgSubnets.value = result.data.subnets || []
          console.log('Loaded subnets:', orgSubnets.value)
        } else {
          console.error('Failed to load organization details:', result.message)
        }
      } catch (error) {
        console.error('Error loading organization details:', error)
        showToast('error', 'Error loading organization details: ' + error.message)
      }
    }
    
    const openCreateOrgModal = () => {
      editingOrg.value = null
      orgForm.value = {
        name: '',
        description: '',
        color: '#007bff'
      }
      const modal = new bootstrap.Modal(document.getElementById('orgModal'))
      modal.show()
    }
    
    const editOrganization = (org) => {
      editingOrg.value = org
      orgForm.value = {
        name: org.name,
        description: org.description || '',
        color: org.color
      }
      const modal = new bootstrap.Modal(document.getElementById('orgModal'))
      modal.show()
    }
    
    const saveOrganization = async () => {
      try {
        let response
        if (editingOrg.value) {
          response = await fetch(`/api/organizations/${editingOrg.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orgForm.value)
          })
        } else {
          response = await fetch('/api/organizations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orgForm.value)
          })
        }
        
        const result = await response.json()
        if (result.status) {
          showToast('success', result.message)
          bootstrap.Modal.getInstance(document.getElementById('orgModal')).hide()
          loadOrganizations()
        } else {
          showToast('error', result.message)
        }
      } catch (error) {
        showToast('error', 'Error saving organization: ' + error.message)
      }
    }
    
    const deleteOrganization = async (org) => {
      if (confirm(`Are you sure you want to delete organization "${org.name}"? This action cannot be undone.`)) {
        try {
          const response = await fetch(`/api/organizations/${org.id}`, {
            method: 'DELETE'
          })
          const result = await response.json()
          if (result.status) {
            showToast('success', result.message)
            loadOrganizations()
          } else {
            showToast('error', result.message)
          }
        } catch (error) {
          showToast('error', 'Error deleting organization: ' + error.message)
        }
      }
    }
    
    const viewOrganization = async (org) => {
      selectedOrg.value = org
      await loadOrganizationDetails(org.id)
      const modal = new bootstrap.Modal(document.getElementById('orgDetailsModal'))
      modal.show()
    }
    
    const openAddSubnetModal = () => {
      subnetForm.value = { subnet_cidr: '', description: '', is_primary: false }
      const modal = new bootstrap.Modal(document.getElementById('addSubnetModal'))
      modal.show()
    }
    
    const addSubnet = async () => {
      try {
        const response = await fetch(`/api/organizations/${selectedOrg.value.id}/subnets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subnetForm.value)
        })
        
        const result = await response.json()
        if (result.status) {
          showToast('success', result.message)
          bootstrap.Modal.getInstance(document.getElementById('addSubnetModal')).hide()
          await loadOrganizationDetails(selectedOrg.value.id)
          loadOrganizations() // Refresh to update subnet count
        } else {
          showToast('error', result.message)
        }
      } catch (error) {
        showToast('error', 'Error adding subnet: ' + error.message)
      }
    }
    
    const deleteSubnet = async (subnetId) => {
      if (confirm('Are you sure you want to delete this subnet?')) {
        try {
          const response = await fetch(`/api/organization/subnets/${subnetId}`, {
            method: 'DELETE'
          })
          
          const result = await response.json()
          if (result.status) {
            showToast('success', result.message)
            await loadOrganizationDetails(selectedOrg.value.id)
            loadOrganizations() // Refresh to update subnet count
          } else {
            showToast('error', result.message)
          }
        } catch (error) {
          showToast('error', 'Error deleting subnet: ' + error.message)
        }
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString()
    }
    
    const showToast = (type, message) => {
      // Simple toast implementation
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
    
    // Lifecycle
    onMounted(() => {
      loadOrganizations()
    })
    
    return {
      organizations,
      loading,
      editingOrg,
      selectedOrg,
      orgSubnets,
      orgForm,
      subnetForm,
      loadOrganizations,
      openCreateOrgModal,
      editOrganization,
      saveOrganization,
      deleteOrganization,
      viewOrganization,
      openAddSubnetModal,
      addSubnet,
      deleteSubnet,
      formatDate
    }
  }
}
</script>

<style scoped>
.table th {
  border-top: none;
}

.badge {
  font-size: 0.75rem;
}

.btn-group .btn {
  border-radius: 0.25rem;
}

.btn-group .btn:not(:last-child) {
  margin-right: 0.25rem;
}

.modal-lg {
  max-width: 800px;
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

[data-bs-theme="dark"] .form-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .form-text {
  color: #a0aec0 !important;
}

[data-bs-theme="dark"] .form-check-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .input-group-text {
  background-color: #374151 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%) !important;
}

[data-bs-theme="dark"] .spinner-border {
  color: #3182ce !important;
}

[data-bs-theme="dark"] h2 {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] h5 {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] h6 {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] p {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] strong {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] code {
  background-color: #374151 !important;
  color: #e2e8f0 !important;
}
</style>
