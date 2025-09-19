<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">
            <i class="bi bi-journal-text me-2"></i>
            Logging Management
          </h2>
          <div>
            <button class="btn btn-success me-2" @click="exportLogs">
              <i class="bi bi-download me-1"></i>
              Export Logs
            </button>
            <button class="btn btn-warning me-2" @click="showClearModal = true">
              <i class="bi bi-trash me-1"></i>
              Clear Logs
            </button>
            <button class="btn btn-primary" @click="refreshLogs">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 class="mb-0">{{ statistics.total_logs || 0 }}</h4>
                    <p class="mb-0">Total Logs</p>
                  </div>
                  <div class="align-self-center">
                    <i class="bi bi-journal-text fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 class="mb-0">{{ statistics.recent_activity || 0 }}</h4>
                    <p class="mb-0">Last 24h</p>
                  </div>
                  <div class="align-self-center">
                    <i class="bi bi-clock-history fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 class="mb-0">{{ Object.keys(statistics.by_category || {}).length }}</h4>
                    <p class="mb-0">Categories</p>
                  </div>
                  <div class="align-self-center">
                    <i class="bi bi-tags fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 class="mb-0">{{ Object.keys(statistics.by_level || {}).length }}</h4>
                    <p class="mb-0">Log Levels</p>
                  </div>
                  <div class="align-self-center">
                    <i class="bi bi-bar-chart fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-funnel me-2"></i>
              Filters
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <label for="categoryFilter" class="form-label">Category</label>
                <select id="categoryFilter" v-model="filters.category" class="form-select" @change="applyFilters">
                  <option value="">All Categories</option>
                  <option value="firewall">Firewall</option>
                  <option value="routing">Routing</option>
                  <option value="system">System</option>
                  <option value="wireguard">WireGuard</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label for="levelFilter" class="form-label">Level</label>
                <select id="levelFilter" v-model="filters.level" class="form-select" @change="applyFilters">
                  <option value="">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label for="startDate" class="form-label">Start Date</label>
                <input type="datetime-local" id="startDate" v-model="filters.start_date" class="form-control" @change="applyFilters">
              </div>
              <div class="col-md-3 mb-3">
                <label for="endDate" class="form-label">End Date</label>
                <input type="datetime-local" id="endDate" v-model="filters.end_date" class="form-control" @change="applyFilters">
              </div>
            </div>
          </div>
        </div>

        <!-- Logs Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>
              Activity Logs
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="logs.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-journal-x fs-1"></i>
              <p class="mt-2">No logs found</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Category</th>
                    <th>Message</th>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in logs" :key="log.id">
                    <td>
                      <small>{{ formatTimestamp(log.timestamp) }}</small>
                    </td>
                    <td>
                      <span class="badge" :class="getLevelBadgeClass(log.level)">
                        {{ log.level.toUpperCase() }}
                      </span>
                    </td>
                    <td>
                      <span class="badge bg-secondary">{{ log.category }}</span>
                    </td>
                    <td>
                      <span class="log-message">{{ log.message }}</span>
                    </td>
                    <td>{{ log.user || 'N/A' }}</td>
                    <td>{{ log.ip_address || 'N/A' }}</td>
                    <td>
                      <button v-if="log.details" class="btn btn-sm btn-outline-info" @click="showDetails(log)">
                        <i class="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="logs.length > 0" class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button class="btn btn-outline-primary" @click="loadPreviousPage" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-left"></i> Previous
                </button>
                <span class="mx-3">Page {{ currentPage }}</span>
                <button class="btn btn-outline-primary" @click="loadNextPage" :disabled="logs.length < pageSize">
                  Next <i class="bi bi-chevron-right"></i>
                </button>
              </div>
              <div>
                <select v-model="pageSize" @change="changePageSize" class="form-select d-inline-block w-auto">
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- System Logs Tab -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-terminal me-2"></i>
              System Logs
            </h5>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <select v-model="selectedSystemLog" @change="loadSystemLogs" class="form-select">
                  <option value="system">System Log</option>
                  <option value="auth">Auth Log</option>
                  <option value="kern">Kernel Log</option>
                  <option value="wireguard">WireGuard Log</option>
                  <option value="firewall">Firewall Log</option>
                  <option value="routing">Routing Log</option>
                </select>
              </div>
              <div class="col-md-6">
                <select v-model="systemLogLines" @change="loadSystemLogs" class="form-select">
                  <option value="50">Last 50 lines</option>
                  <option value="100">Last 100 lines</option>
                  <option value="200">Last 200 lines</option>
                  <option value="500">Last 500 lines</option>
                </select>
              </div>
            </div>
            
            <div v-if="systemLogsLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else class="system-logs">
              <pre class="bg-dark text-light p-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ systemLogs.join('\n') }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Logs Modal -->
    <div v-if="showClearModal" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-trash me-2"></i>
              Clear Logs
            </h5>
            <button type="button" class="btn-close" @click="showClearModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="clearCategory" class="form-label">Category</label>
              <select id="clearCategory" v-model="clearOptions.category" class="form-select">
                <option value="">All Categories</option>
                <option value="firewall">Firewall</option>
                <option value="routing">Routing</option>
                <option value="system">System</option>
                <option value="wireguard">WireGuard</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="clearDays" class="form-label">Clear logs older than (days)</label>
              <input type="number" id="clearDays" v-model="clearOptions.days" class="form-control" placeholder="Leave empty to clear all">
            </div>
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              This action cannot be undone!
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showClearModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="clearLogs" :disabled="clearingLogs">
              <span v-if="clearingLogs" class="spinner-border spinner-border-sm me-1"></span>
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="showDetailsModal" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-eye me-2"></i>
              Log Details
            </h5>
            <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
          </div>
          <div class="modal-body">
            <pre class="bg-light p-3 rounded">{{ JSON.stringify(selectedLogDetails, null, 2) }}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">Close</button>
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
import { ref, onMounted, computed } from 'vue'
import { fetchGet, fetchPost } from '@/utilities/fetch.js'

// Reactive data
const loading = ref(true)
const systemLogsLoading = ref(false)
const clearingLogs = ref(false)
const showClearModal = ref(false)
const showDetailsModal = ref(false)
const logs = ref([])
const systemLogs = ref([])
const statistics = ref({})
const selectedSystemLog = ref('system')
const systemLogLines = ref(100)
const selectedLogDetails = ref({})

// Filters
const filters = ref({
  category: '',
  level: '',
  start_date: '',
  end_date: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(50)
const offset = computed(() => (currentPage.value - 1) * pageSize.value)

// Clear options
const clearOptions = ref({
  category: '',
  days: ''
})

// Toast
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Methods
const loadLogs = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      limit: pageSize.value,
      offset: offset.value
    })
    
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.level) params.append('level', filters.value.level)
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)
    
    const response = await fetchGet(`/api/logs?${params}`)
    if (response.status) {
      logs.value = response.data || []
    } else {
      showToast('error', 'Failed to load logs')
    }
  } catch (error) {
    showToast('error', 'Error loading logs: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await fetchGet('/api/logs/statistics')
    if (response.status) {
      statistics.value = response.data || {}
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

const loadSystemLogs = async () => {
  try {
    systemLogsLoading.value = true
    const response = await fetchGet(`/api/logs/system/${selectedSystemLog.value}?lines=${systemLogLines.value}`)
    if (response.status) {
      systemLogs.value = response.data || []
    } else {
      showToast('error', 'Failed to load system logs')
    }
  } catch (error) {
    showToast('error', 'Error loading system logs: ' + error.message)
  } finally {
    systemLogsLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadLogs()
}

const loadPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadLogs()
  }
}

const loadNextPage = () => {
  currentPage.value++
  loadLogs()
}

const changePageSize = () => {
  currentPage.value = 1
  loadLogs()
}

const refreshLogs = () => {
  loadLogs()
  loadStatistics()
}

const clearLogs = async () => {
  try {
    clearingLogs.value = true
    const data = {}
    if (clearOptions.value.category) data.category = clearOptions.value.category
    if (clearOptions.value.days) data.days = parseInt(clearOptions.value.days)
    
    const response = await fetchPost('/api/logs/clear', data)
    if (response.status) {
      showToast('success', response.message)
      showClearModal.value = false
      refreshLogs()
    } else {
      showToast('error', response.message || 'Failed to clear logs')
    }
  } catch (error) {
    showToast('error', 'Error clearing logs: ' + error.message)
  } finally {
    clearingLogs.value = false
  }
}

const exportLogs = async () => {
  try {
    const params = new URLSearchParams({ format: 'json' })
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)
    
    const response = await fetchGet(`/api/logs/export?${params}`)
    if (response.status) {
      const dataStr = JSON.stringify(response.data.data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logs-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      showToast('success', 'Logs exported successfully')
    } else {
      showToast('error', 'Failed to export logs')
    }
  } catch (error) {
    showToast('error', 'Error exporting logs: ' + error.message)
  }
}

const showDetails = (log) => {
  selectedLogDetails.value = log
  showDetailsModal.value = true
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const getLevelBadgeClass = (level) => {
  switch (level) {
    case 'error': return 'bg-danger'
    case 'warning': return 'bg-warning'
    case 'info': return 'bg-info'
    case 'debug': return 'bg-secondary'
    default: return 'bg-secondary'
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

// Lifecycle
onMounted(() => {
  loadLogs()
  loadStatistics()
  loadSystemLogs()
})
</script>

<style scoped>
.log-message {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.system-logs pre {
  font-size: 0.875rem;
  line-height: 1.4;
}

.modal {
  z-index: 1055;
}

.toast {
  z-index: 1060;
}

.badge {
  font-size: 0.75em;
}

.table th {
  border-top: none;
}
</style>

