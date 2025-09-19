<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-0">
              <i class="bi bi-diagram-3 me-2"></i>
              Organization Subnet Management
            </h2>
            <p class="text-muted mb-0">Manage network subnets for organizations</p>
          </div>
        </div>

        <!-- Subnets Overview -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-diagram-3 me-2"></i>
              All Organization Subnets
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center p-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="subnets.length === 0" class="text-center p-4">
              <i class="bi bi-diagram-3 text-muted" style="font-size: 3rem;"></i>
              <p class="text-muted mt-2">No organization subnets found.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Organization</th>
                    <th>Subnet CIDR</th>
                    <th>Description</th>
                    <th>Primary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subnet in subnets" :key="subnet.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="me-2" 
                             :style="`width: 12px; height: 12px; background-color: ${subnet.org_color || '#007bff'}; border-radius: 50%;`">
                        </div>
                        <strong>{{ subnet.org_name }}</strong>
                      </div>
                    </td>
                    <td>
                      <code>{{ subnet.subnet_cidr }}</code>
                    </td>
                    <td>{{ subnet.description || '-' }}</td>
                    <td>
                      <span v-if="subnet.is_primary" class="badge bg-success">Primary</span>
                      <span v-else class="badge bg-secondary">Secondary</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" 
                              @click="editSubnet(subnet)" 
                              title="Edit Subnet">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" 
                              @click="deleteSubnet(subnet.id)" 
                              title="Delete Subnet">
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
    </div>

    <!-- Edit Subnet Modal -->
    <div class="modal fade" id="editSubnetModal" tabindex="-1" aria-labelledby="editSubnetModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSubnetModalLabel">Edit Subnet</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSubnet">
              <div class="mb-3">
                <label class="form-label">Organization</label>
                <input type="text" class="form-control" :value="editingSubnet.org_name" readonly>
              </div>
              <div class="mb-3">
                <label for="subnetCidr" class="form-label">Subnet CIDR <span class="text-danger">*</span></label>
                <input type="text" 
                       class="form-control" 
                       id="subnetCidr" 
                       v-model="subnetForm.subnet_cidr" 
                       required 
                       placeholder="e.g., 10.10.0.0/16">
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
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveSubnet">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'OrganizationSubnets',
  setup() {
    const subnets = ref([])
    const loading = ref(false)
    const editingSubnet = ref(null)
    
    const subnetForm = ref({
      subnet_cidr: '',
      description: '',
      is_primary: false
    })
    
    const loadSubnets = async () => {
      loading.value = true
      try {
        const response = await fetch('/api/organization/subnets/all')
        const result = await response.json()
        if (result.status) {
          subnets.value = result.data
        } else {
          showToast('error', 'Failed to load subnets: ' + result.message)
        }
      } catch (error) {
        showToast('error', 'Error loading subnets: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    const editSubnet = (subnet) => {
      editingSubnet.value = subnet
      subnetForm.value = {
        subnet_cidr: subnet.subnet_cidr,
        description: subnet.description || '',
        is_primary: subnet.is_primary
      }
      const modal = new bootstrap.Modal(document.getElementById('editSubnetModal'))
      modal.show()
    }
    
    const saveSubnet = async () => {
      try {
        const response = await fetch(`/api/organization/subnets/${editingSubnet.value.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subnetForm.value)
        })
        
        const result = await response.json()
        if (result.status) {
          showToast('success', result.message)
          bootstrap.Modal.getInstance(document.getElementById('editSubnetModal')).hide()
          loadSubnets()
        } else {
          showToast('error', result.message)
        }
      } catch (error) {
        showToast('error', 'Error saving subnet: ' + error.message)
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
            loadSubnets()
          } else {
            showToast('error', result.message)
          }
        } catch (error) {
          showToast('error', 'Error deleting subnet: ' + error.message)
        }
      }
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
      loadSubnets()
    })
    
    return {
      subnets,
      loading,
      editingSubnet,
      subnetForm,
      editSubnet,
      saveSubnet,
      deleteSubnet
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

[data-bs-theme="dark"] .form-check-label {
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

[data-bs-theme="dark"] code {
  background-color: #374151 !important;
  color: #e2e8f0 !important;
}
</style>








