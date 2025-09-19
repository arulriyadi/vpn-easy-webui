<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-0">
              <i class="bi bi-shield-shaded me-2"></i>
              RBAC Policy Management
            </h2>
            <p class="text-muted mb-0">Manage firewall policies for user groups</p>
          </div>
          <div class="btn-group" role="group">
            <button class="btn btn-primary" @click="openAddPolicyModal('filter')">
              <i class="bi bi-funnel me-2"></i>
              Add Filter Policy
            </button>
            <button class="btn btn-warning" @click="openAddPolicyModal('nat')">
              <i class="bi bi-arrow-left-right me-2"></i>
              Add NAT Policy
            </button>
          </div>
        </div>

        <!-- Groups with Policies -->
        <div v-if="loading" class="text-center p-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div v-for="group in groups" :key="group.id" class="card mb-4">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="me-2" 
                       :style="`width: 12px; height: 12px; background-color: ${group.color}; border-radius: 50%;`">
                  </div>
                  <h5 class="mb-0">{{ group.name }}</h5>
                  <span class="badge bg-secondary ms-2">{{ group.peer_count || 0 }} peers</span>
                </div>
                <div class="btn-group" role="group">
                  <button class="btn btn-sm btn-outline-primary" @click="openAddPolicyModal('filter', group)">
                    <i class="bi bi-funnel me-1"></i>
                    Filter
                  </button>
                  <button class="btn btn-sm btn-outline-warning" @click="openAddPolicyModal('nat', group)">
                    <i class="bi bi-arrow-left-right me-1"></i>
                    NAT
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div v-if="group.description" class="mb-3">
                <small class="text-muted">{{ group.description }}</small>
              </div>
              
              <!-- Filter Policies -->
              <div class="mb-4">
                <h6 class="text-primary">
                  <i class="bi bi-funnel me-2"></i>
                  Filter Policies
                </h6>
                <div v-if="getGroupFilterPolicies(group.id).length === 0" 
                     class="text-center p-3 border rounded bg-light">
                  <i class="bi bi-funnel text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No filter policies defined</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th>Protocol</th>
                        <th>Port</th>
                        <th>Action</th>
                        <th>Priority</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="policy in getGroupFilterPolicies(group.id)" :key="policy.id">
                        <td>{{ policy.destination }}</td>
                        <td>
                          <span class="badge bg-info">{{ policy.protocol }}</span>
                        </td>
                        <td>{{ policy.port || '-' }}</td>
                        <td>
                          <span class="badge" :class="policy.action === 'ACCEPT' ? 'bg-success' : 'bg-danger'">
                            {{ policy.action }}
                          </span>
                        </td>
                        <td>{{ policy.priority }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" 
                                  @click="deletePolicy('filter', policy.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- NAT Policies -->
              <div>
                <h6 class="text-warning">
                  <i class="bi bi-arrow-left-right me-2"></i>
                  NAT Policies
                </h6>
                <div v-if="getGroupNatPolicies(group.id).length === 0" 
                     class="text-center p-3 border rounded bg-light">
                  <i class="bi bi-arrow-left-right text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No NAT policies defined</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th>Action</th>
                        <th>Translated IP</th>
                        <th>Translated Port</th>
                        <th>Priority</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="policy in getGroupNatPolicies(group.id)" :key="policy.id">
                        <td>{{ policy.destination }}</td>
                        <td>
                          <span class="badge bg-warning">{{ policy.action }}</span>
                        </td>
                        <td>{{ policy.translated_ip || '-' }}</td>
                        <td>{{ policy.translated_port || '-' }}</td>
                        <td>{{ policy.priority }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" 
                                  @click="deletePolicy('nat', policy.id)">
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
      </div>
    </div>

    <!-- Add Policy Modal -->
    <div class="modal fade" id="policyModal" tabindex="-1" aria-labelledby="policyModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="policyModalLabel">
              {{ policyType === 'filter' ? 'Add Filter Policy' : 'Add NAT Policy' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePolicy">
              <!-- Group Selection -->
              <div class="mb-3">
                <label for="policyGroup" class="form-label">Group <span class="text-danger">*</span></label>
                <select class="form-select" id="policyGroup" v-model="policyForm.group_id" required>
                  <option value="">Select a group</option>
                  <option v-for="group in groups" :key="group.id" :value="group.id">
                    {{ group.name }}
                  </option>
                </select>
              </div>
              
              <!-- Destination -->
              <div class="mb-3">
                <label for="policyDestination" class="form-label">Destination <span class="text-danger">*</span></label>
                <input type="text" 
                       class="form-control" 
                       id="policyDestination" 
                       v-model="policyForm.destination" 
                       required 
                       placeholder="e.g., 192.168.1.0/24, 0.0.0.0/0">
                <div class="form-text">IP address or subnet</div>
              </div>
              
              <!-- Filter Policy Fields -->
              <div v-if="policyType === 'filter'">
                <div class="mb-3">
                  <label for="filterAction" class="form-label">Action <span class="text-danger">*</span></label>
                  <select class="form-select" id="filterAction" v-model="policyForm.action" required>
                    <option value="">Select action</option>
                    <option value="ACCEPT">ACCEPT</option>
                    <option value="DROP">DROP</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="filterProtocol" class="form-label">Protocol</label>
                  <select class="form-select" id="filterProtocol" v-model="policyForm.protocol">
                    <option value="any">Any</option>
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp">ICMP</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="filterPort" class="form-label">Port</label>
                  <input type="text" 
                         class="form-control" 
                         id="filterPort" 
                         v-model="policyForm.port" 
                         placeholder="e.g., 80, 443, 22">
                  <div class="form-text">Optional port number</div>
                </div>
              </div>
              
              <!-- NAT Policy Fields -->
              <div v-if="policyType === 'nat'">
                <div class="mb-3">
                  <label for="natAction" class="form-label">Action <span class="text-danger">*</span></label>
                  <select class="form-select" id="natAction" v-model="policyForm.action" required @change="onNatActionChange">
                    <option value="">Select action</option>
                    <option value="MASQUERADE">MASQUERADE</option>
                    <option value="SNAT">SNAT</option>
                    <option value="DNAT">DNAT</option>
                    <option value="REDIRECT">REDIRECT</option>
                  </select>
                </div>
                <div v-if="showTranslatedIp" class="mb-3">
                  <label for="translatedIp" class="form-label">Translated IP <span class="text-danger">*</span></label>
                  <input type="text" 
                         class="form-control" 
                         id="translatedIp" 
                         v-model="policyForm.translated_ip" 
                         :required="showTranslatedIp"
                         placeholder="e.g., 203.0.113.1">
                </div>
                <div v-if="showTranslatedPort" class="mb-3">
                  <label for="translatedPort" class="form-label">Translated Port <span class="text-danger">*</span></label>
                  <input type="text" 
                         class="form-control" 
                         id="translatedPort" 
                         v-model="policyForm.translated_port" 
                         :required="showTranslatedPort"
                         placeholder="e.g., 8080">
                </div>
              </div>
              
              <!-- Priority -->
              <div class="mb-3">
                <label for="policyPriority" class="form-label">Priority</label>
                <input type="number" 
                       class="form-control" 
                       id="policyPriority" 
                       v-model="policyForm.priority" 
                       min="1" 
                       max="1000" 
                       placeholder="100">
                <div class="form-text">Lower numbers have higher priority (1-1000)</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="savePolicy">
              {{ policyType === 'filter' ? 'Add Filter Policy' : 'Add NAT Policy' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { fetchGet, fetchPost, fetchDelete } from '@/utilities/fetch.js'
export default {
  name: 'RBACPolicies',
  setup() {
    
    // Reactive data
    const groups = ref([])
    const filterPolicies = ref([])
    const natPolicies = ref([])
    const loading = ref(false)
    const policyType = ref('filter')
    const selectedGroup = ref(null)
    
    const policyForm = ref({
      group_id: '',
      destination: '',
      action: '',
      protocol: 'any',
      port: '',
      translated_ip: '',
      translated_port: '',
      priority: 100
    })
    
    // Computed properties
    const showTranslatedIp = computed(() => {
      return policyType.value === 'nat' && 
             ['SNAT', 'DNAT'].includes(policyForm.value.action)
    })
    
    const showTranslatedPort = computed(() => {
      return policyType.value === 'nat' && 
             ['DNAT', 'REDIRECT'].includes(policyForm.value.action)
    })
    
    // Methods
    const loadData = async () => {
      loading.value = true
      try {
        // Load groups
        const groupsResponse = await fetch('/api/rbac/groups')
        const groupsResult = await groupsResponse.json()
        if (groupsResult.status) {
          groups.value = groupsResult.data
        }
        
        // Load all policies for each group
        for (const group of groups.value) {
          // Load filter policies
          const filterResponse = await fetch(`/api/rbac/groups/${group.id}/policies/filter`)
          const filterResult = await filterResponse.json()
          if (filterResult.status) {
            filterPolicies.value = filterPolicies.value.concat(filterResult.data)
          }
          
          // Load NAT policies
          const natResponse = await fetch(`/api/rbac/groups/${group.id}/policies/nat`)
          const natResult = await natResponse.json()
          if (natResult.status) {
            natPolicies.value = natPolicies.value.concat(natResult.data)
          }
        }
      } catch (error) {
        showToast('error', 'Error loading data: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    const getGroupFilterPolicies = (groupId) => {
      return filterPolicies.value.filter(p => p.group_id === groupId)
    }
    
    const getGroupNatPolicies = (groupId) => {
      return natPolicies.value.filter(p => p.group_id === groupId)
    }
    
    const openAddPolicyModal = (type, group = null) => {
      policyType.value = type
      selectedGroup.value = group
      
      policyForm.value = {
        group_id: group ? group.id : '',
        destination: '',
        action: '',
        protocol: 'any',
        port: '',
        translated_ip: '',
        translated_port: '',
        priority: 100
      }
      
      const modal = new bootstrap.Modal(document.getElementById('policyModal'))
      modal.show()
    }
    
    const onNatActionChange = () => {
      // Clear translated fields when action changes
      policyForm.value.translated_ip = ''
      policyForm.value.translated_port = ''
    }
    
    const savePolicy = async () => {
      try {
        const endpoint = policyType.value === 'filter' 
          ? `/api/rbac/groups/${policyForm.value.group_id}/policies/filter`
          : `/api/rbac/groups/${policyForm.value.group_id}/policies/nat`
        
        const payload = {
          destination: policyForm.value.destination,
          action: policyForm.value.action,
          priority: policyForm.value.priority
        }
        
        if (policyType.value === 'filter') {
          payload.protocol = policyForm.value.protocol
          payload.port = policyForm.value.port
        } else {
          payload.translated_ip = policyForm.value.translated_ip
          payload.translated_port = policyForm.value.translated_port
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const result = await response.json()
        if (result.status) {
          showToast('success', result.message)
          bootstrap.Modal.getInstance(document.getElementById('policyModal')).hide()
          // Reload data
          filterPolicies.value = []
          natPolicies.value = []
          await loadData()
        } else {
          showToast('error', result.message)
        }
      } catch (error) {
        showToast('error', 'Error saving policy: ' + error.message)
      }
    }
    
    const deletePolicy = async (type, policyId) => {
      const policyTypeName = type === 'filter' ? 'Filter' : 'NAT'
      if (confirm(`Are you sure you want to delete this ${policyTypeName} policy?`)) {
        try {
          const endpoint = type === 'filter' 
            ? `/api/rbac/policies/filter/${policyId}`
            : `/api/rbac/policies/nat/${policyId}`
          
          const response = await fetch(endpoint, {
            method: 'DELETE'
          })
          
          const result = await response.json()
          if (result.status) {
            showToast('success', result.message)
            // Reload data
            filterPolicies.value = []
            natPolicies.value = []
            await loadData()
          } else {
            showToast('error', result.message)
          }
        } catch (error) {
          showToast('error', 'Error deleting policy: ' + error.message)
        }
      }
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
      loadData()
    })
    
    return {
      groups,
      filterPolicies,
      natPolicies,
      loading,
      policyType,
      policyForm,
      showTranslatedIp,
      showTranslatedPort,
      getGroupFilterPolicies,
      getGroupNatPolicies,
      openAddPolicyModal,
      onNatActionChange,
      savePolicy,
      deletePolicy
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.table th {
  border-top: none;
  font-weight: 600;
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

.bg-light {
  background-color: #f8f9fa !important;
}

/* Dark mode overrides */
[data-bs-theme="dark"] .card {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .card-header {
  background-color: #374151 !important;
  border-bottom-color: #4a5568 !important;
}

[data-bs-theme="dark"] .table {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .table-hover tbody tr:hover {
  background-color: #374151 !important;
}

[data-bs-theme="dark"] .table th {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .text-muted {
  color: #a0aec0 !important;
}

[data-bs-theme="dark"] .border {
  border-color: #4a5568 !important;
}

[data-bs-theme="dark"] .bg-light {
  background-color: #374151 !important;
}

[data-bs-theme="dark"] .modal-content {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
}

[data-bs-theme="dark"] .modal-header {
  background-color: #374151 !important;
  border-bottom-color: #4a5568 !important;
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
}

[data-bs-theme="dark"] .form-text {
  color: #a0aec0 !important;
}

[data-bs-theme="dark"] .card-title {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .table {
  background-color: #2d3748 !important;
}

[data-bs-theme="dark"] .table th {
  background-color: #374151 !important;
  border-bottom-color: #4a5568 !important;
}

[data-bs-theme="dark"] .table tbody tr {
  background-color: #2d3748 !important;
}

[data-bs-theme="dark"] .table tbody tr td {
  border-top-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .bg-light {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .badge {
  color: #ffffff !important;
}

[data-bs-theme="dark"] .modal-title {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25) !important;
}

[data-bs-theme="dark"] .form-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] .form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25) !important;
}

[data-bs-theme="dark"] .input-group-text {
  background-color: #374151 !important;
  border-color: #4a5568 !important;
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
