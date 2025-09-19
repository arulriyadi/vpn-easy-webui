<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">
            <i class="bi bi-diagram-3 me-2"></i>
            Routing Management
          </h2>
          <div>
            <button class="btn btn-primary" @click="showAddRouteModal = true">
              <i class="bi bi-plus-circle me-1"></i>
              Add Route
            </button>
          </div>
        </div>


        <!-- Routing Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-diagram-3 me-2"></i>
              Routing Table
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else-if="routes.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-diagram-3 fs-1"></i>
              <p class="mt-2">No routes found</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Destination</th>
                    <th>Gateway</th>
                    <th>Interface</th>
                    <th>Metric</th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="route in routes" :key="route.id">
                    <td>{{ route.id }}</td>
                    <td>
                      <span class="badge bg-primary">{{ route.destination || 'default' }}</span>
                    </td>
                    <td>{{ route.gateway || 'N/A' }}</td>
                    <td>
                      <span v-if="route.interface" class="badge bg-info">{{ route.interface }}</span>
                      <span v-else class="text-muted">N/A</span>
                    </td>
                    <td>{{ route.metric || 'N/A' }}</td>
                    <td>{{ route.source || 'N/A' }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteRoute(route.id)">
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

    <!-- Add Route Modal -->
    <div v-if="showAddRouteModal" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Add Static Route
            </h5>
            <button type="button" class="btn-close" @click="showAddRouteModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addRoute">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="destination" class="form-label">Destination Network</label>
                  <input type="text" id="destination" v-model="newRoute.destination" class="form-control" 
                         placeholder="e.g., 192.168.1.0/24" required>
                  <div class="form-text">Network address with CIDR notation</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="gateway" class="form-label">Gateway</label>
                  <input type="text" id="gateway" v-model="newRoute.gateway" class="form-control" 
                         placeholder="e.g., 192.168.1.1" required>
                  <div class="form-text">Next hop IP address</div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="interface" class="form-label">Interface</label>
                  <select id="interface" v-model="newRoute.interface" class="form-select">
                    <option value="">Auto-detect</option>
                    <option value="ens18">ens18</option>
                    <option value="docker0">docker0</option>
                    <option value="tailscale0">tailscale0</option>
                    <option value="wg0">wg0</option>
                    <option value="lo">lo</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="metric" class="form-label">Metric</label>
                  <input type="number" id="metric" v-model="newRoute.metric" class="form-control" 
                         placeholder="e.g., 100" min="1" max="65535">
                  <div class="form-text">Route priority (lower = higher priority)</div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="source" class="form-label">Source IP</label>
                  <input type="text" id="source" v-model="newRoute.source" class="form-control" 
                         placeholder="e.g., 192.168.1.100">
                  <div class="form-text">Optional: Source IP for the route</div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddRouteModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addRoute" :disabled="addingRoute">
              <span v-if="addingRoute" class="spinner-border spinner-border-sm me-1"></span>
              Add Route
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
const addingRoute = ref(false)
const showAddRouteModal = ref(false)
const routes = ref([])
const newRoute = ref({
  destination: '',
  gateway: '',
  interface: '',
  metric: '',
  source: ''
})
const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

// Methods
const loadRoutes = async () => {
  try {
    loading.value = true
    const response = await fetchGet('/api/routes')
    if (response.status) {
      routes.value = response.data || []
    } else {
      showToast('error', 'Failed to load routes')
    }
  } catch (error) {
    showToast('error', 'Error loading routes: ' + error.message)
  } finally {
    loading.value = false
  }
}


const addRoute = async () => {
  try {
    addingRoute.value = true
    const response = await fetchPost('/api/routes', newRoute.value)
    if (response.status) {
      showToast('success', 'Route added successfully')
      showAddRouteModal.value = false
      resetNewRoute()
      await loadRoutes()
    } else {
      showToast('error', response.message || 'Failed to add route')
    }
  } catch (error) {
    showToast('error', 'Error adding route: ' + error.message)
  } finally {
    addingRoute.value = false
  }
}

const deleteRoute = async (routeId) => {
  if (!confirm('Are you sure you want to delete this route?')) {
    return
  }
  
  try {
    const response = await fetchDelete(`/api/routes/${routeId}`)
    if (response.status) {
      showToast('success', 'Route deleted successfully')
      await loadRoutes()
    } else {
      showToast('error', response.message || 'Failed to delete route')
    }
  } catch (error) {
    showToast('error', 'Error deleting route: ' + error.message)
  }
}

const resetNewRoute = () => {
  newRoute.value = {
    destination: '',
    gateway: '',
    interface: '',
    metric: '',
    source: ''
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
  loadRoutes()
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

.card.bg-light {
  border: 1px solid #dee2e6;
}

.progress {
  background-color: #e9ecef;
}
</style>
