<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="mb-4">
          <h2 class="mb-0">
            <i class="bi bi-arrow-left-right me-2"></i>
            Firewall NAT
          </h2>
        </div>

        <!-- NAT Rules Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>
              Current NAT Rules
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="natRules.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-arrow-left-right fs-1"></i>
              <p class="mt-2">No NAT rules found</p>
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
                    v-for="(rule, index) in natRules" 
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
                      <span class="badge bg-secondary">{{ rule.chain }}</span>
                    </td>
                    <td>
                      <code>{{ rule.source || 'Any' }}</code>
                    </td>
                    <td>
                      <code>{{ rule.destination || 'Any' }}</code>
                    </td>
                    <td>
                      <span v-if="rule.protocol && rule.protocol !== 'any'" class="badge bg-info">
                        {{ rule.protocol }}
                      </span>
                      <span v-else class="text-muted">Any</span>
                    </td>
                    <td>
                      <code>{{ rule.port || 'Any' }}</code>
                    </td>
                    <td>
                      <span v-if="rule.target === 'ACCEPT'" class="badge bg-success">
                        {{ rule.target }}
                      </span>
                      <span v-else-if="rule.target === 'DROP'" class="badge bg-danger">
                        {{ rule.target }}
                      </span>
                      <span v-else-if="rule.target === 'MASQUERADE'" class="badge bg-warning">
                        {{ rule.target }}
                      </span>
                      <span v-else-if="rule.target === 'SNAT'" class="badge bg-primary">
                        {{ rule.target }}
                      </span>
                      <span v-else-if="rule.target === 'DNAT'" class="badge bg-info">
                        {{ rule.target }}
                      </span>
                      <span v-else class="badge bg-secondary">
                        {{ rule.target }}
                      </span>
                    </td>
                    <td>
                      <button 
                        class="btn btn-outline-danger btn-sm"
                        @click="deleteNatRule(rule.id)"
                        :disabled="loading"
                        title="Delete Rule"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Card Footer with Actions -->
          <div class="card-footer bg-light border-top">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="bi bi-info-circle me-2 text-muted"></i>
                <span class="text-muted">
                  Total NAT Rules: {{ natRules.length }}
                  <span v-if="hasUnsavedChanges" class="text-warning ms-2">
                    <i class="bi bi-exclamation-triangle"></i> Unsaved changes
                  </span>
                </span>
              </div>
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-primary"
                  @click="openAddNatRuleModal"
                  :disabled="loading"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  Add NAT Rule
                </button>
                <button 
                  v-if="hasUnsavedChanges"
                  class="btn btn-success"
                  @click="saveNatRuleOrder"
                  :disabled="savingOrder || loading"
                >
                  <span v-if="savingOrder" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  <i v-else class="bi bi-check-lg me-1"></i>
                  Save Changes
                </button>
                <button 
                  class="btn btn-outline-secondary"
                  @click="reloadNatRules"
                  :disabled="loading"
                >
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Reload NAT Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add NAT Rule Modal -->
    <div class="modal fade" id="addNatRuleModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Add NAT Rule
            </h5>
            <button type="button" class="btn-close" @click="closeAddNatRuleModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNatRule">
              <div class="row">
                <!-- Chain Selection -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Chain <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="newNatRule.chain" 
                    required
                    @change="onTargetChange"
                  >
                    <option value="">Select Chain</option>
                    <option value="PREROUTING">PREROUTING</option>
                    <option value="POSTROUTING">POSTROUTING</option>
                    <option value="OUTPUT">OUTPUT</option>
                  </select>
                  <div class="form-text">NAT chain for the rule</div>
                </div>

                <!-- Target Selection -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Target <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="newNatRule.target" 
                    required
                    @change="onTargetChange"
                  >
                    <option value="">Select Target</option>
                    <option value="DNAT">DNAT (Destination NAT)</option>
                    <option value="SNAT">SNAT (Source NAT)</option>
                    <option value="MASQUERADE">MASQUERADE</option>
                    <option value="REDIRECT">REDIRECT</option>
                  </select>
                  <div class="form-text">NAT target type</div>
                </div>
              </div>

              <div class="row">
                <!-- Source IP -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Source IP</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.source"
                    placeholder="192.168.1.0/24 (optional)"
                  >
                  <div class="form-text">Source IP address or subnet (optional)</div>
                </div>

                <!-- Destination IP -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Destination IP</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.destination"
                    placeholder="0.0.0.0/0 (optional)"
                  >
                  <div class="form-text">Destination IP address or subnet (optional)</div>
                </div>
              </div>

              <div class="row">
                <!-- Protocol -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Protocol</label>
                  <select class="form-select" v-model="newNatRule.protocol">
                    <option value="any">Any</option>
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp">ICMP</option>
                  </select>
                  <div class="form-text">Protocol for the rule</div>
                </div>

                <!-- Port -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">Port</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.port"
                    placeholder="80 (optional)"
                  >
                  <div class="form-text">Port number (optional)</div>
                </div>
              </div>

              <!-- Dynamic Fields Based on Target -->
              <div v-if="newNatRule.target === 'DNAT'" class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Translated IP <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.translatedIp"
                    placeholder="192.168.1.100"
                    required
                  >
                  <div class="form-text">Destination IP for DNAT</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Translated Port</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.translatedPort"
                    placeholder="80"
                  >
                  <div class="form-text">Destination port for DNAT (optional)</div>
                </div>
              </div>

              <div v-if="newNatRule.target === 'SNAT'" class="row">
                <div class="col-md-12 mb-3">
                  <label class="form-label">Translated IP <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.translatedIp"
                    placeholder="203.0.113.5"
                    required
                  >
                  <div class="form-text">Source IP for SNAT</div>
                </div>
              </div>

              <div v-if="newNatRule.target === 'REDIRECT'" class="row">
                <div class="col-md-12 mb-3">
                  <label class="form-label">Translated Port <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newNatRule.translatedPort"
                    placeholder="80"
                    required
                  >
                  <div class="form-text">Destination port for REDIRECT</div>
                </div>
              </div>

              <!-- MASQUERADE doesn't need additional fields -->

              <!-- Command Preview -->
              <div class="mt-4">
                <label class="form-label">Command Preview:</label>
                <div class="bg-dark text-light p-3 rounded">
                  <code>{{ generateIptablesCommand }}</code>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAddNatRuleModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addNatRule" :disabled="loading || !isFormValid">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              Add NAT Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const natRules = ref([])
const originalNatRules = ref([])
const loading = ref(false)
const savingOrder = ref(false)
const hasUnsavedChanges = ref(false)
const draggedIndex = ref(-1)
const dragOverIndex = ref(-1)

// New NAT rule form
const newNatRule = ref({
  chain: '',
  target: '',
  source: '',
  destination: '',
  protocol: 'any',
  port: '',
  translatedIp: '',
  translatedPort: ''
})

// Computed properties
const isFormValid = computed(() => {
  const rule = newNatRule.value
  if (!rule.chain || !rule.target) return false
  
  // Check target-specific requirements
  if (rule.target === 'DNAT' && !rule.translatedIp) return false
  if (rule.target === 'SNAT' && !rule.translatedIp) return false
  if (rule.target === 'REDIRECT' && !rule.translatedPort) return false
  
  return true
})

const generateIptablesCommand = computed(() => {
  const rule = newNatRule.value
  if (!rule.chain || !rule.target) return 'Select chain and target to see command'
  
  let cmd = `iptables -t nat -A ${rule.chain}`
  
  if (rule.source) cmd += ` -s ${rule.source}`
  if (rule.destination) cmd += ` -d ${rule.destination}`
  if (rule.protocol !== 'any') cmd += ` -p ${rule.protocol}`
  if (rule.port) cmd += ` --dport ${rule.port}`
  
  cmd += ` -j ${rule.target}`
  
  if (rule.target === 'DNAT') {
    cmd += ` --to-destination ${rule.translatedIp}`
    if (rule.translatedPort) cmd += `:${rule.translatedPort}`
  } else if (rule.target === 'SNAT') {
    cmd += ` --to-source ${rule.translatedIp}`
  } else if (rule.target === 'REDIRECT') {
    cmd += ` --to-ports ${rule.translatedPort}`
  }
  
  return cmd
})

// Methods
const loadNatRules = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/firewall/nat')
    const data = await response.json()
    if (data.status) {
      natRules.value = data.data || []
      originalNatRules.value = JSON.parse(JSON.stringify(natRules.value))
      hasUnsavedChanges.value = false
    } else {
      console.error('Failed to load NAT rules:', data.message)
    }
  } catch (error) {
    console.error('Error loading NAT rules:', error)
  } finally {
    loading.value = false
  }
}

const addNatRule = async () => {
  if (!isFormValid.value) {
    showToast('error', 'Please fill in all required fields')
    return
  }
  
  loading.value = true
  try {
    const response = await fetch('/api/firewall/nat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNatRule.value)
    })
    
    const data = await response.json()
    
    if (data.status) {
      closeAddNatRuleModal()
      resetNewNatRuleForm()
      await loadNatRules()
      showToast('success', 'NAT rule added successfully')
    } else {
      showToast('error', data.message || 'Failed to add NAT rule')
    }
  } catch (error) {
    console.error('Error adding NAT rule:', error)
    showToast('error', 'Error adding NAT rule: ' + error.message)
  } finally {
    loading.value = false
  }
}

const deleteNatRule = async (ruleId) => {
  if (!confirm('Are you sure you want to delete this NAT rule?')) return
  
  loading.value = true
  try {
    const response = await fetch(`/api/firewall/nat/${ruleId}`, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    
    if (data.status) {
      await loadNatRules()
      showToast('success', 'NAT rule deleted successfully')
    } else {
      showToast('error', data.message || 'Failed to delete NAT rule')
    }
  } catch (error) {
    console.error('Error deleting NAT rule:', error)
    showToast('error', 'Error deleting NAT rule: ' + error.message)
  } finally {
    loading.value = false
  }
}

const reloadNatRules = async () => {
  await loadNatRules()
  showToast('info', 'NAT rules reloaded')
}

const onTargetChange = () => {
  // Reset dynamic fields when target changes
  newNatRule.value.translatedIp = ''
  newNatRule.value.translatedPort = ''
}

const resetNewNatRuleForm = () => {
  newNatRule.value = {
    chain: '',
    target: '',
    source: '',
    destination: '',
    protocol: 'any',
    port: '',
    translatedIp: '',
    translatedPort: ''
  }
}

const openAddNatRuleModal = () => {
  resetNewNatRuleForm()
  const modal = new bootstrap.Modal(document.getElementById('addNatRuleModal'))
  modal.show()
}

const closeAddNatRuleModal = () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('addNatRuleModal'))
  if (modal) {
    modal.hide()
  }
}

// Drag & Drop methods
const handleDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.5'
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = (event, dropIndex) => {
  event.preventDefault()
  dragOverIndex.value = dropIndex
  
  if (draggedIndex.value !== dropIndex) {
    // Reorder the array
    const draggedRule = natRules.value[draggedIndex.value]
    natRules.value.splice(draggedIndex.value, 1)
    natRules.value.splice(dropIndex, 0, draggedRule)
    
    // Mark as having unsaved changes
    hasUnsavedChanges.value = true
  }
}

const handleDragEnd = (event) => {
  event.target.style.opacity = ''
  draggedIndex.value = -1
  dragOverIndex.value = -1
}

const saveNatRuleOrder = async () => {
  try {
    savingOrder.value = true
    
    const rulesData = natRules.value.map((rule, index) => ({
      id: rule.id,
      position: index + 1
    }))
    
    const response = await fetch('/api/firewall/nat/reorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rules: rulesData })
    }).then(res => res.json())
    
    if (response.status) {
      showToast('success', 'NAT rules reordered successfully')
      originalNatRules.value = JSON.parse(JSON.stringify(natRules.value))
      hasUnsavedChanges.value = false
    } else {
      showToast('error', response.message || 'Failed to save NAT rule order')
      // Revert to original order
      natRules.value = JSON.parse(JSON.stringify(originalNatRules.value))
    }
  } catch (error) {
    showToast('error', 'Error saving NAT rule order: ' + error.message)
    // Revert to original order
    natRules.value = JSON.parse(JSON.stringify(originalNatRules.value))
  } finally {
    savingOrder.value = false
  }
}

const showToast = (type, message) => {
  // Simple toast implementation - you can replace with your toast system
  const toast = document.createElement('div')
  toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`
  toast.style.top = '20px'
  toast.style.right = '20px'
  toast.style.zIndex = '9999'
  toast.innerHTML = `
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
  loadNatRules()
})
</script>

<style scoped>
/* Card Footer Styling */
.card-footer {
  background-color: #f8f9fa !important;
  border-top: 1px solid #dee2e6 !important;
}

[data-bs-theme="dark"] .card-footer {
  background-color: #2d3748 !important;
  border-top-color: #4a5568 !important;
}

/* Table Styling */
.table thead th {
  background-color: #343a40 !important;
  border-color: #454d55 !important;
  color: white !important;
}

[data-bs-theme="dark"] .table thead th {
  background-color: #212529 !important;
  border-color: #495057 !important;
}

.table tbody tr {
  background-color: #ffffff !important;
}

[data-bs-theme="dark"] .table tbody tr {
  background-color: #1a202c !important;
}

.table tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa !important;
}

[data-bs-theme="dark"] .table tbody tr:nth-of-type(odd) {
  background-color: #2d3748 !important;
}

.table tbody tr:hover {
  background-color: #e9ecef !important;
}

[data-bs-theme="dark"] .table tbody tr:hover {
  background-color: #4a5568 !important;
}

/* Card Styling */
.card {
  background-color: #ffffff !important;
  border: 1px solid #dee2e6 !important;
}

[data-bs-theme="dark"] .card {
  background-color: #1a202c !important;
  border-color: #4a5568 !important;
}

.card-header {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #dee2e6 !important;
}

[data-bs-theme="dark"] .card-header {
  background-color: #2d3748 !important;
  border-bottom-color: #4a5568 !important;
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

/* Success Button Styling */
.btn-success {
  background-color: #198754;
  border-color: #198754;
}

.btn-success:hover {
  background-color: #157347;
  border-color: #146c43;
}

.btn-success:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
}

[data-bs-theme="dark"] .text-muted {
  color: #adb5bd !important;
}

/* Command Preview Styling */
.bg-dark {
  background-color: #212529 !important;
}

[data-bs-theme="dark"] .bg-dark {
  background-color: #1a202c !important;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #f8f9fa !important;
}

.form-text {
  font-size: 0.875em;
  color: #6c757d;
}

[data-bs-theme="dark"] .form-text {
  color: #a0aec0;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
