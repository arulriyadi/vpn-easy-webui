<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          <i class="bi bi-shield-check me-2"></i>
          Enhanced RBAC Management
        </h2>
        <p class="text-muted mb-0">Scalable User ↔ Group ↔ Organization ↔ Policy Management</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="refreshData">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
        <button class="btn btn-primary" @click="openCreateGroupModal">
          <i class="bi bi-plus-circle me-1"></i>
          Create Group
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h4 class="mb-1">{{ stats.totalGroups }}</h4>
                <p class="mb-0">Total Groups</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-people-fill" style="font-size: 2rem;"></i>
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
                <h4 class="mb-1">{{ stats.totalOrganizations }}</h4>
                <p class="mb-0">Organizations</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-building" style="font-size: 2rem;"></i>
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
                <h4 class="mb-1">{{ stats.totalPeers }}</h4>
                <p class="mb-0">Assigned Peers</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-person-check" style="font-size: 2rem;"></i>
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
                <h4 class="mb-1">{{ stats.activeRelations }}</h4>
                <p class="mb-0">Group ↔ Org Relations</p>
              </div>
              <div class="align-self-center">
                <i class="bi bi-diagram-3" style="font-size: 2rem;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Groups Table -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-people me-2"></i>
          Enhanced Groups with Organization Relations
        </h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Group</th>
                <th>Organizations</th>
                <th>Peers</th>
                <th>Policies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="group in enhancedGroups" :key="group.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="me-3" 
                         :style="`width: 12px; height: 12px; background-color: ${group.color}; border-radius: 50%;`">
                    </div>
                    <div>
                      <strong>{{ group.name }}</strong>
                      <br>
                      <small class="text-muted">{{ group.description || 'No description' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span v-if="group.organization_count === 0" class="text-muted">
                    <i class="bi bi-exclamation-circle me-1"></i>
                    No organizations
                  </span>
                  <span v-else class="badge bg-primary">
                    {{ group.organization_count }} organization{{ group.organization_count > 1 ? 's' : '' }}
                  </span>
                </td>
                <td>
                  <span v-if="group.peer_count === 0" class="text-muted">
                    <i class="bi bi-person-x me-1"></i>
                    No peers
                  </span>
                  <span v-else class="badge bg-success">
                    {{ group.peer_count }} peer{{ group.peer_count > 1 ? 's' : '' }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <span class="badge bg-info">Filter</span>
                    <span class="badge bg-warning">NAT</span>
                  </div>
                </td>
                <td>
                  <i class="bi" :class="group.inherit_org_policies ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'"></i>
                  <span class="ms-1">{{ group.inherit_org_policies ? 'Yes' : 'No' }}</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="viewGroupDetails(group)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" @click="manageOrganizations(group)">
                      <i class="bi bi-building"></i>
                    </button>
                    <button class="btn btn-outline-info" @click="viewEffectiveAccess(group)">
                      <i class="bi bi-diagram-3"></i>
                    </button>
                    <button class="btn btn-outline-warning" @click="editGroup(group)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteGroup(group)">
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

    <!-- Group Details Modal -->
    <div class="modal fade" id="groupDetailsModal" tabindex="-1" aria-labelledby="groupDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="groupDetailsModalLabel">
              <i class="bi bi-people me-2"></i>
              {{ selectedGroup?.name }} - Details
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedGroup">
              <!-- Tab Navigation -->
              <ul class="nav nav-tabs" id="groupDetailsTabs">
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeGroupTab === 'groupInfo' }" 
                     href="#groupInfo" @click.prevent="activeGroupTab = 'groupInfo'">Group Info</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeGroupTab === 'organizations' }" 
                     href="#organizations" @click.prevent="activeGroupTab = 'organizations'">Organizations</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeGroupTab === 'vpnIntegration' }" 
                     href="#vpnIntegration" @click.prevent="activeGroupTab = 'vpnIntegration'">VPN Integration</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeGroupTab === 'usersPeers' }" 
                     href="#usersPeers" @click.prevent="activeGroupTab = 'usersPeers'">Users & Peers</a>
                </li>
              </ul>
              
              <div class="tab-content">
                <!-- Group Info Tab -->
                <div class="tab-pane fade" :class="{ 'show active': activeGroupTab === 'groupInfo' }" id="groupInfo">
              <!-- Group Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h6>Group Information</h6>
                  <p><strong>Name:</strong> {{ selectedGroup.name }}</p>
                  <p><strong>Description:</strong> {{ selectedGroup.description || 'No description' }}</p>
                  <p><strong>Created:</strong> {{ formatDate(selectedGroup.created_at) }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Color</h6>
                  <div class="d-flex align-items-center">
                    <div class="me-3" 
                         :style="`width: 30px; height: 30px; background-color: ${selectedGroup.color}; border-radius: 50%;`">
                    </div>
                    <code>{{ selectedGroup.color }}</code>
                  </div>
                </div>
              </div>

              <!-- Attached Organizations -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6>Attached Organizations</h6>
                  <button class="btn btn-sm btn-primary" @click="openAttachOrgModal">
                    <i class="bi bi-plus-circle me-1"></i>
                    Attach Organization
                  </button>
                </div>
                <div v-if="groupOrganizations.length === 0" class="text-center p-3 border rounded">
                  <i class="bi bi-building text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No organizations attached to this group</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Organization</th>
                        <th>Subnets</th>
                        <th>Attached</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="org in groupOrganizations" :key="org.id">
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
                          <span class="badge bg-info">{{ org.subnet_count || 0 }} subnet{{ (org.subnet_count || 0) > 1 ? 's' : '' }}</span>
                        </td>
                        <td>{{ formatDate(org.attached_at) }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-danger" @click="detachOrganization(org.id)">
                            <i class="bi bi-unlink"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


              <!-- VPN Server Integration -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6>VPN Server Integration</h6>
                  <button class="btn btn-sm btn-warning" @click="openVpnAssignmentModal">
                    <i class="bi bi-gear me-1"></i>
                    Configure VPN
                  </button>
                </div>
                
                <div v-if="!vpnAssignment.vpn_enabled" class="text-center p-3 border rounded">
                  <i class="bi bi-shield-lock text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">VPN integration not configured</p>
                  <button class="btn btn-sm btn-primary mt-2" @click="openVpnAssignmentModal">
                    <i class="bi bi-plus-circle me-1"></i>
                    Enable VPN Integration
                  </button>
                </div>
                
                <div v-else>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-shield-check text-success me-2"></i>
                        <strong>VPN Integration Active</strong>
                      </div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-router me-2"></i>
                        <span><strong>VPN Type:</strong> {{ vpnAssignment.vpn_type }}</span>
                      </div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-server me-2"></i>
                        <span><strong>VPN Server:</strong> {{ vpnAssignment.vpn_server_name }}</span>
                      </div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-arrow-repeat me-2"></i>
                        <span><strong>Auto-Route Subnets:</strong> 
                          <i class="bi bi-check-circle text-success" v-if="vpnAssignment.auto_route_subnets"></i>
                          <i class="bi bi-x-circle text-danger" v-else></i>
                        </span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <h6 class="text-muted">Configuration Options</h6>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-gear me-2"></i>
                        <span><strong>Custom Routing:</strong> 
                          <i class="bi bi-check-circle text-success" v-if="vpnAssignment.custom_routing_enabled"></i>
                          <i class="bi bi-x-circle text-danger" v-else></i>
                        </span>
                      </div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-fire me-2"></i>
                        <span><strong>Firewall Rules:</strong> 
                          <i class="bi bi-check-circle text-success" v-if="vpnAssignment.firewall_rules_enabled"></i>
                          <i class="bi bi-x-circle text-danger" v-else></i>
                        </span>
                      </div>
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-clock me-2"></i>
                        <span><strong>Last Updated:</strong> {{ formatDate(vpnAssignment.vpn_assignment_updated) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="testVpnConnection">
                      <i class="bi bi-wifi me-1"></i>
                      Test Connection
                    </button>
                    <button class="btn btn-sm btn-outline-info" @click="viewVpnConfig">
                      <i class="bi bi-eye me-1"></i>
                      View Generated Config
                    </button>
                  </div>
                </div>
              </div>

              <!-- VPN Subnets Preview -->
              <div v-if="vpnAssignment.vpn_enabled && vpnSubnets.length > 0" class="mb-4">
                <h6>VPN Subnets Preview ({{ vpnSubnets.length }} subnets)</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Subnet</th>
                        <th>Description</th>
                        <th>Organization</th>
                        <th>Primary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="subnet in vpnSubnets" :key="subnet.id">
                        <td>
                          <code>{{ subnet.subnet_cidr }}</code>
                        </td>
                        <td>{{ subnet.description || 'No description' }}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="me-2" 
                                 :style="`width: 12px; height: 12px; background-color: ${subnet.organization_color}; border-radius: 50%;`">
                            </div>
                            {{ subnet.organization_name }}
                          </div>
                        </td>
                        <td>
                          <i class="bi bi-check-circle text-success" v-if="subnet.is_primary"></i>
                          <i class="bi bi-circle text-muted" v-else></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                </div>
                
                <!-- Organizations Tab -->
                <div class="tab-pane fade" :class="{ 'show active': activeGroupTab === 'organizations' }" id="organizations">
                  <div class="mt-3">
                    <!-- Attached Organizations -->
                    <div class="mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6>Attached Organizations</h6>
                        <button class="btn btn-sm btn-primary" @click="openAttachOrgModal">
                          <i class="bi bi-plus-circle me-1"></i>
                          Attach Organization
                        </button>
                      </div>
                      <div v-if="groupOrganizations.length === 0" class="text-center p-3 border rounded">
                        <i class="bi bi-building text-muted" style="font-size: 2rem;"></i>
                        <p class="text-muted mt-2 mb-0">No organizations attached to this group</p>
                      </div>
                      <div v-else class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Organization</th>
                              <th>Subnets</th>
                              <th>Attached</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="org in groupOrganizations" :key="org.id">
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
                                <span class="badge bg-info">{{ org.subnet_count || 0 }} subnet{{ (org.subnet_count || 0) > 1 ? 's' : '' }}</span>
                              </td>
                              <td>{{ formatDate(org.attached_at) }}</td>
                              <td>
                                <button class="btn btn-sm btn-outline-danger" @click="detachOrganization(org.id)">
                                  <i class="bi bi-unlink"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- VPN Integration Tab -->
                <div class="tab-pane fade" :class="{ 'show active': activeGroupTab === 'vpnIntegration' }" id="vpnIntegration">
                  <div class="mt-3">
                    <!-- VPN Server Integration -->
                    <div class="mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6>VPN Server Integration</h6>
                        <button class="btn btn-sm btn-warning" @click="openVpnAssignmentModal">
                          <i class="bi bi-gear me-1"></i>
                          Configure VPN
                        </button>
                      </div>
                      
                      <div v-if="!vpnAssignment.vpn_enabled" class="text-center p-3 border rounded">
                        <i class="bi bi-shield-lock text-muted" style="font-size: 2rem;"></i>
                        <p class="text-muted mt-2 mb-0">VPN integration not configured</p>
                        <button class="btn btn-sm btn-primary mt-2" @click="openVpnAssignmentModal">
                          <i class="bi bi-plus-circle me-1"></i>
                          Enable VPN Integration
                        </button>
                      </div>
                      
                      <div v-else>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-shield-check text-success me-2"></i>
                              <strong>VPN Integration Active</strong>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-router me-2"></i>
                              <span><strong>VPN Type:</strong> {{ vpnAssignment.vpn_type }}</span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-server me-2"></i>
                              <span><strong>VPN Server:</strong> {{ vpnAssignment.vpn_server_name }}</span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-arrow-repeat me-2"></i>
                              <span><strong>Auto-Route Subnets:</strong> 
                                <i class="bi bi-check-circle text-success" v-if="vpnAssignment.auto_route_subnets"></i>
                                <i class="bi bi-x-circle text-danger" v-else></i>
                              </span>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <h6 class="text-muted">Configuration Options</h6>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-gear me-2"></i>
                              <span><strong>Custom Routing:</strong> 
                                <i class="bi bi-check-circle text-success" v-if="vpnAssignment.custom_routing_enabled"></i>
                                <i class="bi bi-x-circle text-danger" v-else></i>
                              </span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-fire me-2"></i>
                              <span><strong>Firewall Rules:</strong> 
                                <i class="bi bi-check-circle text-success" v-if="vpnAssignment.firewall_rules_enabled"></i>
                                <i class="bi bi-x-circle text-danger" v-else></i>
                              </span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                              <i class="bi bi-clock me-2"></i>
                              <span><strong>Last Updated:</strong> {{ formatDate(vpnAssignment.vpn_assignment_updated) }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mt-3">
                          <button class="btn btn-sm btn-outline-primary me-2" @click="testVpnConnection">
                            <i class="bi bi-wifi me-1"></i>
                            Test Connection
                          </button>
                          <button class="btn btn-sm btn-outline-info" @click="viewVpnConfig">
                            <i class="bi bi-eye me-1"></i>
                            View Generated Config
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- VPN Subnets Preview -->
                    <div v-if="vpnAssignment.vpn_enabled && vpnSubnets.length > 0" class="mb-4">
                      <h6>VPN Subnets Preview ({{ vpnSubnets.length }} subnets)</h6>
                      <div class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Subnet</th>
                              <th>Description</th>
                              <th>Organization</th>
                              <th>Primary</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="subnet in vpnSubnets" :key="subnet.id">
                              <td>
                                <code>{{ subnet.subnet_cidr }}</code>
                              </td>
                              <td>{{ subnet.description || 'No description' }}</td>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="me-2" 
                                       :style="`width: 12px; height: 12px; background-color: ${subnet.organization_color}; border-radius: 50%;`">
                                  </div>
                                  {{ subnet.organization_name }}
                                </div>
                              </td>
                              <td>
                                <i class="bi bi-check-circle text-success" v-if="subnet.is_primary"></i>
                                <i class="bi bi-circle text-muted" v-else></i>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Users & Peers Tab -->
                <div class="tab-pane fade" :class="{ 'show active': activeGroupTab === 'usersPeers' }" id="usersPeers">
                  <div class="mt-3">
                    <div class="row">
                      <div class="col-md-8">
                        <h6>Group Members</h6>
                        <div v-if="loadingGroupUsers" class="text-center p-3">
                          <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        <div v-else-if="groupUsers.length === 0" class="text-center p-4 text-muted">
                          <i class="bi bi-people" style="font-size: 2rem;"></i>
                          <p class="mt-2 mb-0">No users assigned to this group</p>
                        </div>
                        <div v-else class="table-responsive">
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>VPN Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="user in groupUsers" :key="user.id">
                                <td>
                                  <strong>{{ user.username }}</strong>
                                </td>
                                <td>{{ user.email || 'Not set' }}</td>
                                <td>{{ user.full_name || 'Not set' }}</td>
                                <td>
                                  <span class="badge" :class="getUserVpnStatusBadge(user)">
                                    {{ user.vpn_peer_generated ? 'Active' : 'Pending' }}
                                  </span>
                                </td>
                                <td>
                                  <button v-if="!user.vpn_peer_generated" 
                                          class="btn btn-sm btn-success" 
                                          @click="generateVpnPeer(user.id)"
                                          :disabled="loadingVpnGeneration">
                                    <i class="bi bi-plus-circle"></i> Generate VPN
                                  </button>
                                  <button v-else 
                                          class="btn btn-sm btn-outline-danger" 
                                          @click="removeUserFromGroup(user.id)">
                                    <i class="bi bi-trash"></i> Remove
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div class="col-md-4">
                        <h6>VPN Peers Summary</h6>
                        <div class="card">
                          <div class="card-body">
                            <div class="row text-center">
                              <div class="col-4">
                                <h4 class="text-primary">{{ vpnPeersSummary.total || 0 }}</h4>
                                <small>Total Peers</small>
                              </div>
                              <div class="col-4">
                                <h4 class="text-success">{{ vpnPeersSummary.active || 0 }}</h4>
                                <small>Active</small>
                              </div>
                              <div class="col-4">
                                <h4 class="text-warning">{{ vpnPeersSummary.pending || 0 }}</h4>
                                <small>Pending</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mt-3">
                          <button class="btn btn-primary btn-sm w-100" @click="addUserToGroup">
                            <i class="bi bi-plus-circle"></i> Add User to Group
                          </button>
                          <button class="btn btn-outline-secondary btn-sm w-100 mt-2" @click="updateAllRoutes">
                            <i class="bi bi-arrow-repeat"></i> Update All Routes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="editGroup(selectedGroup)">
              <i class="bi bi-pencil me-2"></i>
              Edit Group
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attach Organization Modal -->
    <div class="modal fade" id="attachOrgModal" tabindex="-1" aria-labelledby="attachOrgModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="attachOrgModalLabel">Attach Organization to Group</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="availableOrganizations.length === 0" class="text-center p-3">
              <i class="bi bi-info-circle text-muted" style="font-size: 2rem;"></i>
              <p class="text-muted mt-2 mb-0">No available organizations to attach</p>
            </div>
            <div v-else>
              <p>Select an organization to attach to <strong>{{ selectedGroup?.name }}</strong>:</p>
              <div class="list-group">
                <button v-for="org in availableOrganizations" 
                        :key="org.id"
                        class="list-group-item list-group-item-action"
                        @click="attachOrganization(org.id)">
                  <div class="d-flex align-items-center">
                    <div class="me-3" 
                         :style="`width: 12px; height: 12px; background-color: ${org.color}; border-radius: 50%;`">
                    </div>
                    <div>
                      <strong>{{ org.name }}</strong>
                      <br>
                      <small class="text-muted">{{ org.description || 'No description' }}</small>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- VPN Assignment Modal -->
    <div class="modal fade" id="vpnAssignmentModal" tabindex="-1" aria-labelledby="vpnAssignmentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="vpnAssignmentModalLabel">
              <i class="bi bi-shield-lock me-2"></i>
              VPN Assignment - {{ selectedGroup?.name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveVpnAssignment">
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="vpnEnabled" 
                         v-model="vpnForm.vpn_enabled">
                  <label class="form-check-label" for="vpnEnabled">
                    <strong>Enable VPN Integration</strong>
                  </label>
                </div>
                <small class="form-text text-muted">
                  Enable VPN server integration for this group
                </small>
              </div>

              <div v-if="vpnForm.vpn_enabled">
                <div class="mb-3">
                  <label for="vpnType" class="form-label">VPN Type</label>
                  <select class="form-select" id="vpnType" v-model="vpnForm.vpn_type" required>
                    <option value="wireguard">WireGuard</option>
                    <option value="openvpn" disabled>OpenVPN (Coming Soon)</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="vpnServer" class="form-label">VPN Server</label>
                  <select class="form-select" id="vpnServer" v-model="vpnForm.vpn_server_name" required>
                    <option value="">Select VPN Server</option>
                    <option v-for="server in availableVpnServers" 
                            :key="server.name" 
                            :value="server.name">
                      {{ server.name }} - {{ server.status }} ({{ server.peer_count }} peers)
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <h6>Auto-Route Options</h6>
                  <div class="form-check">
                    <input class="form-check-input" 
                           type="checkbox" 
                           id="autoRouteSubnets" 
                           v-model="vpnForm.auto_route_subnets">
                    <label class="form-check-label" for="autoRouteSubnets">
                      Push all organization subnets to group users
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" 
                           type="checkbox" 
                           id="customRouting" 
                           v-model="vpnForm.custom_routing_enabled">
                    <label class="form-check-label" for="customRouting">
                      Allow custom routing rules
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" 
                           type="checkbox" 
                           id="firewallRules" 
                           v-model="vpnForm.firewall_rules_enabled">
                    <label class="form-check-label" for="firewallRules">
                      Enable firewall rules for organization traffic
                    </label>
                  </div>
                </div>

                <div v-if="vpnSubnets.length > 0" class="mb-3">
                  <h6>VPN Subnets Preview ({{ vpnSubnets.length }} subnets)</h6>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Subnet</th>
                          <th>Description</th>
                          <th>Organization</th>
                          <th>Primary</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="subnet in vpnSubnets" :key="subnet.id">
                          <td><code>{{ subnet.subnet_cidr }}</code></td>
                          <td>{{ subnet.description || 'No description' }}</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="me-2" 
                                   :style="`width: 12px; height: 12px; background-color: ${subnet.organization_color}; border-radius: 50%;`">
                              </div>
                              {{ subnet.organization_name }}
                            </div>
                          </td>
                          <td>
                            <i class="bi bi-check-circle text-success" v-if="subnet.is_primary"></i>
                            <i class="bi bi-circle text-muted" v-else></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveVpnAssignment">
              <i class="bi bi-check-circle me-2"></i>
              Save VPN Assignment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div class="modal fade" id="createGroupModal" tabindex="-1" aria-labelledby="createGroupModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createGroupModalLabel">Create New Group</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createGroup">
              <div class="mb-3">
                <label for="groupName" class="form-label">Group Name <span class="text-danger">*</span></label>
                <input type="text" 
                       class="form-control" 
                       id="groupName" 
                       v-model="groupForm.name" 
                       required>
              </div>
              <div class="mb-3">
                <label for="groupDescription" class="form-label">Description</label>
                <textarea class="form-control" 
                          id="groupDescription" 
                          rows="3" 
                          v-model="groupForm.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="groupColor" class="form-label">Color</label>
                <input type="color" 
                       class="form-control form-control-color" 
                       id="groupColor" 
                       v-model="groupForm.color">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="createGroup">
              <i class="bi bi-plus-circle me-2"></i>
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchDelete } from '@/utilities/fetch.js'

// Reactive data
const loading = ref(false)
const enhancedGroups = ref([])
const selectedGroup = ref(null)
const groupOrganizations = ref([])
const availableOrganizations = ref([])
const effectivePolicies = ref({
  filter_policies: [],
  nat_policies: [],
  organizations: []
})

const groupForm = ref({
  name: '',
  description: '',
  color: '#007bff'
})

// VPN Integration data
const vpnAssignment = ref({
  vpn_enabled: false,
  vpn_type: 'wireguard',
  vpn_server_name: '',
  auto_route_subnets: true,
  custom_routing_enabled: true,
  firewall_rules_enabled: true,
  vpn_assignment_updated: null
})

const vpnSubnets = ref([])
const availableVpnServers = ref([])

const vpnForm = ref({
  vpn_enabled: false,
  vpn_type: 'wireguard',
  vpn_server_name: '',
  auto_route_subnets: true,
  custom_routing_enabled: true,
  firewall_rules_enabled: true
})

// Users & Peers tab data
const groupUsers = ref([])
const loadingGroupUsers = ref(false)
const vpnPeersSummary = ref({
  total: 0,
  active: 0,
  pending: 0
})
const loadingVpnGeneration = ref(false)
const activeGroupTab = ref('groupInfo')

// Computed properties
const stats = computed(() => {
  return {
    totalGroups: enhancedGroups.value.length,
    totalOrganizations: enhancedGroups.value.reduce((sum, group) => sum + (group.organization_count || 0), 0),
    totalPeers: enhancedGroups.value.reduce((sum, group) => sum + (group.peer_count || 0), 0),
    activeRelations: enhancedGroups.value.filter(group => group.organization_count > 0).length
  }
})

// Methods
const loadEnhancedGroups = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/enhanced-rbac/groups')
    const result = await response.json()
    if (result.status) {
      enhancedGroups.value = result.data
    } else {
      showToast('error', 'Failed to load enhanced groups: ' + result.message)
    }
  } catch (error) {
    showToast('error', 'Error loading enhanced groups: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadGroupOrganizations = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/organizations`)
    const result = await response.json()
    if (result.status) {
      groupOrganizations.value = result.data
    } else {
      showToast('error', 'Failed to load group organizations: ' + result.message)
    }
  } catch (error) {
    showToast('error', 'Error loading group organizations: ' + error.message)
  }
}

const loadAvailableOrganizations = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/available-organizations`)
    const result = await response.json()
    if (result.status) {
      availableOrganizations.value = result.data
    } else {
      showToast('error', 'Failed to load available organizations: ' + result.message)
    }
  } catch (error) {
    showToast('error', 'Error loading available organizations: ' + error.message)
  }
}

const loadEffectivePolicies = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/effective-policies`)
    const result = await response.json()
    if (result.status) {
      effectivePolicies.value = result.data
    } else {
      showToast('error', 'Failed to load effective policies: ' + result.message)
    }
  } catch (error) {
    showToast('error', 'Error loading effective policies: ' + error.message)
  }
}

const viewGroupDetails = async (group) => {
  selectedGroup.value = group
  activeGroupTab.value = 'groupInfo' // Reset to first tab
  await loadGroupOrganizations(group.id)
  await loadEffectivePolicies(group.id)
  await loadVpnAssignment(group.id)
  await loadVpnSubnets(group.id)
  await loadGroupUsers(group.id)
  await loadVpnPeersSummary(group.id)
  const modal = new bootstrap.Modal(document.getElementById('groupDetailsModal'))
  modal.show()
}

const openAttachOrgModal = async () => {
  await loadAvailableOrganizations(selectedGroup.value.id)
  const modal = new bootstrap.Modal(document.getElementById('attachOrgModal'))
  modal.show()
}

const attachOrganization = async (orgId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${selectedGroup.value.id}/organizations/${orgId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const result = await response.json()
    if (result.status) {
      showToast('success', result.message)
      closeModalSafely('attachOrgModal')
      await loadGroupOrganizations(selectedGroup.value.id)
      await loadEnhancedGroups() // Refresh stats
    } else {
      showToast('error', result.message)
    }
  } catch (error) {
    showToast('error', 'Error attaching organization: ' + error.message)
  }
}

const detachOrganization = async (orgId) => {
  if (confirm('Are you sure you want to detach this organization from the group?')) {
    try {
      const response = await fetch(`/api/enhanced-rbac/groups/${selectedGroup.value.id}/organizations/${orgId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.status) {
        showToast('success', result.message)
        await loadGroupOrganizations(selectedGroup.value.id)
        await loadEnhancedGroups() // Refresh stats
      } else {
        showToast('error', result.message)
      }
    } catch (error) {
      showToast('error', 'Error detaching organization: ' + error.message)
    }
  }
}

const refreshEffectivePolicies = async () => {
  await loadEffectivePolicies(selectedGroup.value.id)
}

const openCreateGroupModal = () => {
  groupForm.value = {
    name: '',
    description: '',
    color: '#007bff'
  }
  const modal = new bootstrap.Modal(document.getElementById('createGroupModal'))
  modal.show()
}

const createGroup = async () => {
  try {
    const response = await fetch('/api/enhanced-rbac/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupForm.value)
    })
    const result = await response.json()
    if (result.status) {
      showToast('success', result.message)
      closeModalSafely('createGroupModal')
      await loadEnhancedGroups()
    } else {
      showToast('error', result.message)
    }
  } catch (error) {
    showToast('error', 'Error creating group: ' + error.message)
  }
}

const editGroup = (group) => {
  // TODO: Implement edit group functionality
  showToast('info', 'Edit group functionality coming soon!')
}

const deleteGroup = async (group) => {
  if (confirm(`Are you sure you want to delete group "${group.name}"?`)) {
    try {
      loading.value = true
      
      const response = await fetchDelete(`/api/rbac/groups/${group.id}`)
      
      if (response.status) {
        showToast('success', response.message || 'Group deleted successfully')
        await loadEnhancedGroups() // Refresh the groups list
      } else {
        showToast('error', response.message || 'Failed to delete group')
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      showToast('error', 'Failed to delete group')
    } finally {
      loading.value = false
    }
  }
}

const manageOrganizations = (group) => {
  viewGroupDetails(group)
}

const viewEffectiveAccess = (group) => {
  // TODO: Implement effective access view
  showToast('info', 'Effective access view coming soon!')
}

const refreshData = async () => {
  await loadEnhancedGroups()
}

const getSourceBadgeClass = (source) => {
  switch (source) {
    case 'org_default': return 'bg-secondary'
    case 'group_override': return 'bg-warning'
    case 'group_policy': return 'bg-info'
    default: return 'bg-light text-dark'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const closeModalSafely = (modalId) => {
  const modal = bootstrap.Modal.getInstance(document.getElementById(modalId))
  if (modal) {
    modal.hide()
  } else {
    // Fallback: manually remove modal and backdrop
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      modalElement.classList.remove('show')
      modalElement.style.display = 'none'
      modalElement.setAttribute('aria-hidden', 'true')
      modalElement.removeAttribute('aria-modal')
    }
    // Remove backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop')
    backdrops.forEach(backdrop => backdrop.remove())
    // Remove modal-open class from body
    document.body.classList.remove('modal-open')
    document.body.style.overflow = ''
  }
}

const showToast = (type, message) => {
  // Simple toast implementation
  const toast = document.createElement('div')
  toast.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
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

// VPN Integration methods
const loadVpnAssignment = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/vpn-assignment`)
    const result = await response.json()
    
    if (result.status) {
      vpnAssignment.value = {
        vpn_enabled: result.data?.vpn_enabled || false,
        vpn_type: result.data?.vpn_type || 'wireguard',
        vpn_server_name: result.data?.vpn_server_name || '',
        auto_route_subnets: result.data?.auto_route_subnets || true,
        custom_routing_enabled: result.data?.custom_routing_enabled || true,
        firewall_rules_enabled: result.data?.firewall_rules_enabled || true,
        vpn_assignment_updated: result.data?.vpn_assignment_updated || null
      }
    }
  } catch (error) {
    console.error('Error loading VPN assignment:', error)
  }
}

const loadVpnSubnets = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/vpn-subnets`)
    const result = await response.json()
    
    if (result.status) {
      vpnSubnets.value = result.data || []
    }
  } catch (error) {
    console.error('Error loading VPN subnets:', error)
  }
}

const loadAvailableVpnServers = async () => {
  try {
    const response = await fetch('/api/wireguard-configurations')
    const result = await response.json()
    
    if (result.status) {
      availableVpnServers.value = result.data.map(server => ({
        name: server.name,
        status: server.status || 'Active',
        peer_count: server.peer_count || 0
      }))
    }
  } catch (error) {
    console.error('Error loading VPN servers:', error)
  }
}

const openVpnAssignmentModal = async () => {
  if (selectedGroup.value) {
    // Load current VPN assignment
    await loadVpnAssignment(selectedGroup.value.id)
    await loadVpnSubnets(selectedGroup.value.id)
    await loadAvailableVpnServers()
    
    // Populate form with current values
    vpnForm.value = {
      vpn_enabled: vpnAssignment.value.vpn_enabled,
      vpn_type: vpnAssignment.value.vpn_type,
      vpn_server_name: vpnAssignment.value.vpn_server_name,
      auto_route_subnets: vpnAssignment.value.auto_route_subnets,
      custom_routing_enabled: vpnAssignment.value.custom_routing_enabled,
      firewall_rules_enabled: vpnAssignment.value.firewall_rules_enabled
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('vpnAssignmentModal'))
    modal.show()
  }
}

const saveVpnAssignment = async () => {
  if (!selectedGroup.value) return
  
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${selectedGroup.value.id}/vpn-assignment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vpnForm.value)
    })
    
    const result = await response.json()
    
    if (result.status) {
      showToast('VPN assignment updated successfully', 'success')
      
      // Reload VPN assignment and subnets
      await loadVpnAssignment(selectedGroup.value.id)
      await loadVpnSubnets(selectedGroup.value.id)
      
      // Close modal
      closeModalSafely('vpnAssignmentModal')
    } else {
      showToast(result.message || 'Failed to update VPN assignment', 'error')
    }
  } catch (error) {
    console.error('Error saving VPN assignment:', error)
    showToast('Error saving VPN assignment', 'error')
  }
}

const testVpnConnection = () => {
  showToast('VPN connection test feature coming soon', 'info')
}

const viewVpnConfig = () => {
  showToast('VPN config viewer feature coming soon', 'info')
}

// Users & Peers tab methods
const loadGroupUsers = async (groupId) => {
  loadingGroupUsers.value = true
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/users`)
    const result = await response.json()
    if (result.status) {
      groupUsers.value = result.data || []
    } else {
      showToast('Failed to load group users: ' + result.message, 'error')
    }
  } catch (error) {
    showToast('Error loading group users: ' + error.message, 'error')
  } finally {
    loadingGroupUsers.value = false
  }
}

const loadVpnPeersSummary = async (groupId) => {
  try {
    const response = await fetch(`/api/enhanced-rbac/groups/${groupId}/peers-summary`)
    const result = await response.json()
    if (result.status) {
      vpnPeersSummary.value = result.data || { total: 0, active: 0, pending: 0 }
    } else {
      showToast('Failed to load VPN peers summary: ' + result.message, 'error')
    }
  } catch (error) {
    showToast('Error loading VPN peers summary: ' + error.message, 'error')
  }
}

const generateVpnPeer = async (userId) => {
  loadingVpnGeneration.value = true
  try {
    const response = await fetch(`/api/users/${userId}/vpn-peer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: selectedGroup.value.id })
    })
    const result = await response.json()
    if (result.status) {
      showToast('VPN peer generated successfully', 'success')
      // Reload group users and summary
      await loadGroupUsers(selectedGroup.value.id)
      await loadVpnPeersSummary(selectedGroup.value.id)
    } else {
      showToast('Failed to generate VPN peer: ' + result.message, 'error')
    }
  } catch (error) {
    showToast('Error generating VPN peer: ' + error.message, 'error')
  } finally {
    loadingVpnGeneration.value = false
  }
}

const removeUserFromGroup = async (userId) => {
  if (!confirm('Are you sure you want to remove this user from the group? This will also remove their VPN peer.')) {
    return
  }
  
  try {
    const response = await fetch(`/api/users/${userId}/groups/${selectedGroup.value.id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status) {
      showToast('User removed from group successfully', 'success')
      // Reload group users and summary
      await loadGroupUsers(selectedGroup.value.id)
      await loadVpnPeersSummary(selectedGroup.value.id)
    } else {
      showToast('Failed to remove user from group: ' + result.message, 'error')
    }
  } catch (error) {
    showToast('Error removing user from group: ' + error.message, 'error')
  }
}

const addUserToGroup = () => {
  showToast('Add user to group feature coming soon', 'info')
}

const updateAllRoutes = () => {
  showToast('Update all routes feature coming soon', 'info')
}

const getUserVpnStatusBadge = (user) => {
  if (user.vpn_peer_generated) {
    return 'bg-success'
  } else {
    return 'bg-warning'
  }
}

// Lifecycle
onMounted(() => {
  loadEnhancedGroups()
})
</script>

<style scoped>
.card {
  border: 1px solid rgba(255, 255, 255, 0.125);
  background-color: rgba(255, 255, 255, 0.05);
}

.card-header {
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.125);
}

.table {
  --bs-table-bg: transparent;
}

.table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.075);
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
}

.badge {
  font-size: 0.75em;
}

.list-group-item {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-content {
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.125);
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.125);
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.125);
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.125);
  color: white;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.table-sm td {
  padding: 0.5rem;
}
</style>



