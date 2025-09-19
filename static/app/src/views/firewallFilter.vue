<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="mb-4">
          <h2 class="mb-0">
            <i class="bi bi-funnel me-2"></i>
            Firewall Filter
          </h2>
        </div>

        <!-- Firewall Rules Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>
              Current Firewall Rules (Filter)
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
                    <th width="40"><i class="bi bi-grip-vertical text-muted"></i></th>
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
                  <tr 
                    v-for="(rule, index) in firewallRules" 
                    :key="rule.id"
                    :draggable="true"
                    @dragstart="handleDragStart(index, $event)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop(index, $event)"
                    @dragend="handleDragEnd"
                    :class="{ 'drag-over': draggedIndex === index && dragOverIndex === index }"
                    class="draggable-row"
                  >
                    <td class="drag-handle">
                      <i class="bi bi-grip-vertical text-muted cursor-grab"></i>
                    </td>
                    <td>
                      <span class="badge bg-primary">{{ index + 1 }}</span>
                    </td>
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
          
          <!-- Action Buttons Row (pfSense style) -->
          <div class="card-footer bg-subtle border-top">
            <div class="row align-items-center">
              <div class="col-md-4">
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  Total Rules: {{ firewallRules.length }}
                  <span v-if="hasUnsavedChanges" class="text-warning ms-2">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Unsaved changes
                  </span>
                </small>
              </div>
              <div class="col-md-8 text-end">
                <div class="btn-group" role="group">
                  <button class="btn btn-primary" @click="showAddRuleModal = true">
                    <i class="bi bi-plus-circle me-1"></i>
                    Add Rule
                  </button>
                  <button 
                    class="btn btn-success" 
                    @click="saveRuleOrder"
                    :disabled="!hasUnsavedChanges || savingOrder"
                  >
                    <i v-if="savingOrder" class="bi bi-hourglass-split me-1"></i>
                    <i v-else class="bi bi-check-circle me-1"></i>
                    {{ savingOrder ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button class="btn btn-outline-secondary" @click="reloadRules">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Reload Rules
                  </button>
                </div>
              </div>
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
const originalRules = ref([])
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

// Drag & Drop variables
const draggedIndex = ref(null)
const dragOverIndex = ref(null)
const hasUnsavedChanges = ref(false)
const savingOrder = ref(false)

// Methods
const loadFirewallRules = async () => {
  try {
    loading.value = true
    const response = await fetchGet('/api/firewall/rules')
    if (response.status) {
      firewallRules.value = response.data || []
      originalRules.value = JSON.parse(JSON.stringify(firewallRules.value))
      hasUnsavedChanges.value = false
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

// Drag & Drop Methods
const handleDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target.outerHTML)
  event.target.style.opacity = '0.5'
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (index, event) => {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === index) {
    return
  }
  
  // Move rule in array
  const draggedRule = firewallRules.value[draggedIndex.value]
  firewallRules.value.splice(draggedIndex.value, 1)
  firewallRules.value.splice(index, 0, draggedRule)
  
  // Mark as having unsaved changes
  hasUnsavedChanges.value = true
  
  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDragEnd = (event) => {
  event.target.style.opacity = ''
  draggedIndex.value = null
  dragOverIndex.value = null
}

const saveRuleOrder = async () => {
  try {
    savingOrder.value = true
    
    // Prepare rules data for API
    const rulesData = firewallRules.value.map((rule, index) => ({
      id: rule.id,
      position: index + 1
    }))
    
    const response = await fetch('/api/firewall/reorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rules: rulesData })
    }).then(res => res.json())
    
    if (response.status) {
      showToast('success', 'Firewall rules reordered successfully')
      originalRules.value = JSON.parse(JSON.stringify(firewallRules.value))
      hasUnsavedChanges.value = false
    } else {
      showToast('error', response.message || 'Failed to save rule order')
      // Revert to original order
      firewallRules.value = JSON.parse(JSON.stringify(originalRules.value))
    }
  } catch (error) {
    showToast('error', 'Error saving rule order: ' + error.message)
    // Revert to original order
    firewallRules.value = JSON.parse(JSON.stringify(originalRules.value))
  } finally {
    savingOrder.value = false
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

/* pfSense-style improvements */
.card-footer {
  padding: 1rem;
  background-color: #f8f9fa !important;
  border-top: 1px solid #e9ecef !important;
}

/* Dark theme card footer */
[data-bs-theme="dark"] .card-footer {
  background-color: #2d3748 !important;
  border-top: 1px solid #4a5568 !important;
}

.bg-subtle {
  background-color: #f8f9fa !important;
}

/* Dark theme subtle background */
[data-bs-theme="dark"] .bg-subtle {
  background-color: #2d3748 !important;
}

.btn-group .btn {
  margin-left: 0.25rem;
}

.btn-group .btn:first-child {
  margin-left: 0;
}

.table-responsive {
  border-radius: 0.375rem;
}

.table thead th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #343a40;
  color: #ffffff;
}

/* Dark theme table header */
[data-bs-theme="dark"] .table thead th {
  background-color: #4a5568;
  color: #ffffff;
}

.table tbody td {
  vertical-align: middle;
  font-size: 0.875rem;
  background-color: #ffffff;
}

/* Dark theme table body */
[data-bs-theme="dark"] .table tbody td {
  background-color: #1a202c;
  color: #e2e8f0;
}

.table tbody tr:nth-child(even) td {
  background-color: #f8f9fa;
}

/* Dark theme even rows */
[data-bs-theme="dark"] .table tbody tr:nth-child(even) td {
  background-color: #2d3748;
}

.table tbody tr:hover td {
  background-color: #e9ecef;
}

/* Dark theme hover */
[data-bs-theme="dark"] .table tbody tr:hover td {
  background-color: #4a5568;
}

/* Enhanced button styling - softer colors */
.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-outline-secondary {
  background-color: transparent;
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #ffffff;
}

/* Rule counter styling */
.text-muted {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d !important;
}

/* Dark theme rule counter */
[data-bs-theme="dark"] .text-muted {
  color: #a0aec0 !important;
}

/* Card styling improvements */
.card {
  border: 1px solid #dee2e6;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Dark theme card */
[data-bs-theme="dark"] .card {
  border: 1px solid #4a5568;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
  background-color: #1a202c;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
}

/* Dark theme card header */
[data-bs-theme="dark"] .card-header {
  background-color: #2d3748;
  border-bottom: 1px solid #4a5568;
  color: #e2e8f0;
}

/* Badge improvements */
.badge {
  font-size: 0.75em;
  font-weight: 500;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
}

.badge.bg-info {
  background-color: #0dcaf0 !important;
}

.badge.bg-success {
  background-color: #198754 !important;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #000000 !important;
}

/* Drag & Drop Styling */
.draggable-row {
  cursor: move;
  transition: all 0.2s ease;
}

.draggable-row:hover {
  background-color: #f8f9fa;
}

[data-bs-theme="dark"] .draggable-row:hover {
  background-color: #2d3748;
}

.draggable-row.drag-over {
  border-top: 2px solid #0d6efd;
  background-color: #e3f2fd;
}

[data-bs-theme="dark"] .draggable-row.drag-over {
  border-top: 2px solid #0d6efd;
  background-color: #1e3a8a;
}

.drag-handle {
  cursor: grab;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

/* Save button styling */
.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-success:hover:not(:disabled) {
  background-color: #157347;
  border-color: #146c43;
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
