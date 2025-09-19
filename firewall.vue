<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">
            <i class="bi bi-shield-check me-2"></i>
            Firewall Management
          </h2>
          <div>
            <button class="btn btn-primary me-2" @click="showAddRuleModal = true">
              <i class="bi bi-plus-circle me-1"></i>
              Add Rule
            </button>
            <button class="btn btn-warning" @click="reloadRules">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Reload Rules
            </button>
          </div>
        </div>

        <!-- Firewall Rules Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>
              Current Firewall Rules
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="firewallRules.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-shield-x fs-1"></i>
              <p class="mt-2">No firewall rules found</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Chain</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Protocol</th>
                    <th>Port</th>
                    <th>Target</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rule in firewallRules" :key="rule.id">
                    <td>{{ rule.id }}</td>
                    <td>
                      <span class="badge bg-secondary">{{ rule.chain || 'N/A' }}</span>
                    </td>
                    <td>{{ rule.source || 'Any' }}</td>
                    <td>{{ rule.destination || 'Any' }}</td>
                    <td>
                      <span v-if="rule.protocol" class="badge bg-info">{{ rule.protocol }}</span>
                      <span v-else class="text-muted">Any</span>
                    </td>
                    <td>{{ rule.port || 'Any' }}</td>
                    <td>
                      <span class="badge" :class="getTargetBadgeClass(rule.target)">
                        {{ rule.target || 'N/A' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteRule(rule.id)">
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

    <!-- Add Rule Modal -->
    <div v-if="showAddRuleModal" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Add Firewall Rule
            </h5>
            <button type="button" class="btn-close" @click="showAddRuleModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addRule">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="chain" class="form-label">Chain</label>
                  <select id="chain" v-model="newRule.chain" class="form-select" required>
                    <option value="">Select Chain</option>
                    <option value="INPUT">INPUT</option>
                    <option value="OUTPUT">OUTPUT</option>
                    <option value="FORWARD">FORWARD</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="target" class="form-label">Target</label>
                  <select id="target" v-model="newRule.target" class="form-select" required>
                    <option value="">Select Target</option>
                    <option value="ACCEPT">ACCEPT</option>
                    <option value="DROP">DROP</option>
                    <option value="REJECT">REJECT</option>
                  </select>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="source" class="form-label">Source IP</label>
                  <input type="text" id="source" v-model="newRule.source" class="form-control" placeholder="e.g., 192.168.1.0/24">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="destination" class="form-label">Destination IP</label>
                  <input type="text" id="destination" v-model="newRule.destination" class="form-control" placeholder="e.g., 10.0.0.0/8">
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="protocol" class="form-label">Protocol</label>
                  <select id="protocol" v-model="newRule.protocol" class="form-select">
                    <option value="">Any</option>
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp">ICMP</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="port" class="form-label">Port</label>
                  <input type="text" id="port" v-model="newRule.port" class="form-control" placeholder="e.g., 80, 443, 22">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddRuleModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addRule" :disabled="addingRule">
              <span v-if="addingRule" class="spinner-border spinner-border-sm me-1"></span>
              Add Rule
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div v-if="toast.show" class="toast show" role="alert">
        <div class="toast-header">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success' : 'bi bi-exclamation-triangle-fill text-danger'"></i>
          <strong class="ms-2">{{ toast.type === 'success' ? 'Success' : 'Error' }}</strong>
          <button type="button" class="btn-close ms-auto" @click="toast.show = false"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchGet, fetchPost, fetchDelete } from '@/utilities/fetch.js'

// Reactive data
const loading = ref(true)
const addingRule = ref(false)
const showAddRuleModal = ref(false)
const firewallRules = ref([])
const newRule = ref({
  chain: '',
  target: '',
  source: '',
  destination: '',
  protocol: '',
  port: ''
})
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Methods
const loadFirewallRules = async () => {
  try {
    loading.value = true
    const response = await fetchGet('/api/firewall/rules')
    if (response.status) {
      firewallRules.value = response.data || []
    } else {
      showToast('error', 'Failed to load firewall rules')
    }
  } catch (error) {
    showToast('error', 'Error loading firewall rules: ' + error.message)
  } finally {
    loading.value = false
  }
}

const addRule = async () => {
  try {
    addingRule.value = true
    const response = await fetchPost('/api/firewall/rules', newRule.value)
    if (response.status) {
      showToast('success', 'Firewall rule added successfully')
      showAddRuleModal.value = false
      resetNewRule()
      await loadFirewallRules()
    } else {
      showToast('error', response.message || 'Failed to add firewall rule')
    }
  } catch (error) {
    showToast('error', 'Error adding firewall rule: ' + error.message)
  } finally {
    addingRule.value = false
  }
}

const deleteRule = async (ruleId) => {
  if (!confirm('Are you sure you want to delete this firewall rule?')) {
    return
  }
  
  try {
    const response = await fetchDelete(`/api/firewall/rules/${ruleId}`)
    if (response.status) {
      showToast('success', 'Firewall rule deleted successfully')
      await loadFirewallRules()
    } else {
      showToast('error', response.message || 'Failed to delete firewall rule')
    }
  } catch (error) {
    showToast('error', 'Error deleting firewall rule: ' + error.message)
  }
}

const reloadRules = async () => {
  try {
    const response = await fetchPost('/api/firewall/reload', {})
    if (response.status) {
      showToast('success', 'Firewall rules reloaded successfully')
      await loadFirewallRules()
    } else {
      showToast('error', response.message || 'Failed to reload firewall rules')
    }
  } catch (error) {
    showToast('error', 'Error reloading firewall rules: ' + error.message)
  }
}

const resetNewRule = () => {
  newRule.value = {
    chain: '',
    target: '',
    source: '',
    destination: '',
    protocol: '',
    port: ''
  }
}

const showToast = (type, message) => {
  toast.value = {
    show: true,
    type,
    message
  }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

const getTargetBadgeClass = (target) => {
  switch (target) {
    case 'ACCEPT': return 'bg-success'
    case 'DROP': return 'bg-danger'
    case 'REJECT': return 'bg-warning'
    default: return 'bg-secondary'
  }
}

// Lifecycle
onMounted(() => {
  loadFirewallRules()
})
</script>

<style scoped>
.table th {
  border-top: none;
}

.badge {
  font-size: 0.75em;
}

.modal {
  z-index: 1055;
}

.toast {
  z-index: 1060;
}
</style>
