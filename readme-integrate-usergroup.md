# 🔐 User Management ↔ RBAC Groups ↔ VPN Peers Integration

## 📋 Overview

Sistem integrasi otomatis yang menghubungkan User Management dengan RBAC Groups untuk menghasilkan VPN Peers secara otomatis. Ketika user di-assign ke RBAC Group, sistem akan otomatis membuat akun VPN di server yang sudah di-assign oleh group tersebut.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User          │    │   RBAC Group     │    │   VPN Server    │
│   Management    │◄──►│   Management     │◄──►│   (WireGuard)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Groups   │    │   Organizations  │    │   VPN Peers     │
│   Relationship  │    │   (Subnets)      │    │   Auto-Generated│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 Core Workflow

### 1. **User Assignment to Group**
```
User → Assign to RBAC Group → Auto-generate VPN Peer → Push to VPN Server
```

### 2. **Automatic VPN Peer Generation**
```
User Assignment → Generate WireGuard Keys → Assign IP Pool → Update VPN Config → Apply Routes
```

### 3. **Route Management**
```
Organization Subnets → Group Assignment → VPN Peer Routes → Auto-apply to All Peers
```

## 📊 Database Schema

### 1. **User Groups Relationship Table** (`users.db`)
```sql
CREATE TABLE user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vpn_peer_generated BOOLEAN DEFAULT 0,
    peer_ip VARCHAR(50),
    peer_status VARCHAR(20) DEFAULT 'pending', -- pending, active, inactive
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);
```

### 2. **Enhanced RBAC Group Peers Table** (`rbac.db`)
```sql
-- Existing table enhanced for user-based peers
CREATE TABLE rbac_group_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    peer_name VARCHAR(100) NOT NULL, -- username
    peer_ip VARCHAR(50) NOT NULL,
    peer_public_key TEXT,
    peer_private_key TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    peer_type VARCHAR(20) DEFAULT 'user', -- user, manual
    user_id INTEGER, -- Reference to users table
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. **VPN Peer Status Tracking** (`users.db`)
```sql
CREATE TABLE user_vpn_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    vpn_server_name VARCHAR(50) NOT NULL,
    peer_ip VARCHAR(50) NOT NULL,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    config_generated BOOLEAN DEFAULT 0,
    config_downloaded BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE
);
```

## 🔧 Implementation Details

### 1. **Backend API Endpoints**

#### **User Group Assignment**
```python
# Assign user to RBAC group
@app.route('/api/users/<int:user_id>/groups', methods=['POST'])
def assign_user_to_group(user_id):
    """Assign user to RBAC group and auto-generate VPN peer"""
    
@app.route('/api/users/<int:user_id>/groups/<int:group_id>', methods=['DELETE'])
def remove_user_from_group(user_id, group_id):
    """Remove user from group and cleanup VPN peer"""

# Get user's group memberships
@app.route('/api/users/<int:user_id>/groups', methods=['GET'])
def get_user_groups(user_id):
    """Get all groups user belongs to with VPN peer status"""

# Get group's users
@app.route('/api/enhanced-rbac/groups/<int:group_id>/users', methods=['GET'])
def get_group_users(group_id):
    """Get all users in group with their VPN peer status"""
```

#### **VPN Peer Management**
```python
# Generate VPN peer for user
@app.route('/api/users/<int:user_id>/vpn-peer', methods=['POST'])
def generate_vpn_peer(user_id):
    """Generate VPN peer configuration for user"""

# Download VPN config
@app.route('/api/users/<int:user_id>/vpn-config', methods=['GET'])
def download_vpn_config(user_id):
    """Download VPN configuration file for user"""

# Update peer routes
@app.route('/api/enhanced-rbac/groups/<int:group_id>/update-routes', methods=['POST'])
def update_group_routes(group_id):
    """Update AllowedIPs for all peers in group"""
```

### 2. **Automatic VPN Peer Generation Process**

#### **Step 1: User Assignment**
```python
def assign_user_to_group(user_id: int, group_id: int) -> Dict:
    """Assign user to group and auto-generate VPN peer"""
    try:
        # 1. Validate group has VPN enabled
        group = enhanced_rbac_manager.get_group(group_id)
        if not group['vpn_enabled']:
            return {'status': False, 'message': 'Group VPN not enabled'}
        
        # 2. Assign user to group
        with sqlite3.connect(users_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_groups (user_id, group_id, assigned_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
            """, (user_id, group_id))
            conn.commit()
        
        # 3. Auto-generate VPN peer
        peer_result = generate_vpn_peer_for_user(user_id, group_id)
        
        return {'status': True, 'message': 'User assigned and VPN peer generated', 'peer': peer_result}
        
    except Exception as e:
        return {'status': False, 'message': f'Error assigning user: {str(e)}'}
```

#### **Step 2: VPN Peer Generation**
```python
def generate_vpn_peer_for_user(user_id: int, group_id: int) -> Dict:
    """Generate WireGuard peer for user"""
    try:
        # 1. Get user info
        user = user_manager.get_user(user_id)
        
        # 2. Get group VPN config
        group = enhanced_rbac_manager.get_group(group_id)
        vpn_server = group['vpn_server_name']
        
        # 3. Generate WireGuard keys
        private_key, public_key = generate_wireguard_keys()
        
        # 4. Assign IP from pool
        peer_ip = get_next_available_ip(vpn_server)
        
        # 5. Get organization subnets for routes
        subnets = enhanced_rbac_manager.get_group_vpn_subnets(group_id)
        allowed_ips = [subnet['subnet_cidr'] for subnet in subnets]
        
        # 6. Create peer in VPN server
        peer_config = {
            'name': user['username'],
            'public_key': public_key,
            'allowed_ips': ','.join(allowed_ips)
        }
        
        # 7. Add to WireGuard config
        wireguard_manager.add_peer(vpn_server, peer_config)
        
        # 8. Save to database
        save_vpn_peer_to_db(user_id, group_id, vpn_server, peer_ip, public_key, private_key)
        
        return {
            'status': True,
            'peer_ip': peer_ip,
            'public_key': public_key,
            'allowed_ips': allowed_ips,
            'config_generated': True
        }
        
    except Exception as e:
        return {'status': False, 'message': f'Error generating VPN peer: {str(e)}'}
```

#### **Step 3: Route Management**
```python
def update_group_routes(group_id: int) -> Dict:
    """Update AllowedIPs for all peers in group when subnets change"""
    try:
        # 1. Get all users in group
        users = enhanced_rbac_manager.get_group_users(group_id)
        
        # 2. Get updated subnets
        subnets = enhanced_rbac_manager.get_group_vpn_subnets(group_id)
        allowed_ips = [subnet['subnet_cidr'] for subnet in subnets]
        
        # 3. Update each user's peer routes
        for user in users:
            if user['vpn_peer_generated']:
                update_peer_routes(user['user_id'], group_id, allowed_ips)
        
        return {'status': True, 'message': f'Updated routes for {len(users)} users'}
        
    except Exception as e:
        return {'status': False, 'message': f'Error updating routes: {str(e)}'}
```

### 3. **Frontend UI Updates**

#### **User Details Modal Enhancement**
```vue
<!-- User Details Modal - New VPN Peers Tab -->
<div class="modal-body">
  <ul class="nav nav-tabs" id="userDetailsTabs">
    <li class="nav-item">
      <a class="nav-link" href="#userInfo">User Info</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#userGroups">Groups</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" href="#vpnPeers">VPN Peers</a>
    </li>
  </ul>
  
  <div class="tab-content">
    <!-- VPN Peers Tab -->
    <div class="tab-pane fade show active" id="vpnPeers">
      <div class="row">
        <div class="col-md-6">
          <h6>Group Memberships</h6>
          <div v-for="group in userGroups" :key="group.id" class="card mb-2">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ group.name }}</strong>
                  <br>
                  <small class="text-muted">{{ group.description }}</small>
                </div>
                <div class="text-end">
                  <span class="badge" :class="getGroupStatusBadge(group)">
                    {{ group.vpn_peer_generated ? 'VPN Active' : 'No VPN' }}
                  </span>
                  <br>
                  <small class="text-muted">{{ group.vpn_server_name }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <h6>VPN Peer Status</h6>
          <div v-if="vpnPeers.length > 0">
            <div v-for="peer in vpnPeers" :key="peer.id" class="card mb-2">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ peer.vpn_server_name }}</strong>
                    <br>
                    <code>{{ peer.peer_ip }}</code>
                  </div>
                  <div>
                    <button class="btn btn-sm btn-primary" @click="downloadConfig(peer)">
                      <i class="bi bi-download"></i> Download Config
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted">
            <i class="bi bi-shield-lock" style="font-size: 2rem;"></i>
            <p>No VPN peers generated</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### **RBAC Group Details Modal Enhancement**
```vue
<!-- RBAC Group Details Modal - New Users & Peers Tab -->
<div class="modal-body">
  <ul class="nav nav-tabs" id="groupDetailsTabs">
    <li class="nav-item">
      <a class="nav-link active" href="#groupInfo">Group Info</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#organizations">Organizations</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#vpnIntegration">VPN Integration</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#usersPeers">Users & Peers</a>
    </li>
  </ul>
  
  <div class="tab-content">
    <!-- Users & Peers Tab -->
    <div class="tab-pane fade show active" id="usersPeers">
      <div class="row">
        <div class="col-md-6">
          <h6>Group Members</h6>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>VPN Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in groupUsers" :key="user.id">
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="getUserVpnStatusBadge(user)">
                      {{ user.vpn_peer_generated ? 'Active' : 'Pending' }}
                    </span>
                  </td>
                  <td>
                    <button v-if="!user.vpn_peer_generated" 
                            class="btn btn-sm btn-success" 
                            @click="generateVpnPeer(user.id)">
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
        
        <div class="col-md-6">
          <h6>VPN Peers Summary</h6>
          <div class="card">
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <h4 class="text-primary">{{ vpnPeersSummary.total }}</h4>
                  <small>Total Peers</small>
                </div>
                <div class="col-4">
                  <h4 class="text-success">{{ vpnPeersSummary.active }}</h4>
                  <small>Active</small>
                </div>
                <div class="col-4">
                  <h4 class="text-warning">{{ vpnPeersSummary.pending }}</h4>
                  <small>Pending</small>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-3">
            <button class="btn btn-primary" @click="addUserToGroup">
              <i class="bi bi-plus-circle"></i> Add User to Group
            </button>
            <button class="btn btn-outline-secondary" @click="updateAllRoutes">
              <i class="bi bi-arrow-repeat"></i> Update All Routes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 🚀 Deployment Steps

### 1. **Database Migration**
```bash
# Create user_groups table
sqlite3 db/users.db < db/user_groups_migration.sql

# Create user_vpn_peers table
sqlite3 db/users.db < db/user_vpn_peers_migration.sql

# Update rbac_group_peers table
sqlite3 db/rbac.db < db/rbac_group_peers_migration.sql
```

### 2. **Backend Implementation**
```bash
# Update EnhancedRBACManager.py
# Add user group assignment methods
# Add VPN peer generation methods
# Add route update methods

# Update dashboard.py
# Add new API endpoints
# Update whitelist for authentication
```

### 3. **Frontend Implementation**
```bash
# Update userManagement.vue
# Add VPN Peers tab to User Details modal
# Add group membership display

# Update enhancedRbacManagement.vue
# Add Users & Peers tab to Group Details modal
# Add user management functionality
```

### 4. **Testing**
```bash
# Test user assignment to group
# Test VPN peer generation
# Test route updates
# Test config download
# Test user removal from group
```

## 🔄 Workflow Examples

### **Example 1: Engineer Joins Company**
```
1. Admin creates user "john.doe" in User Management
2. Admin assigns "john.doe" to "Engineer" group
3. System automatically:
   - Generates WireGuard keys for john.doe
   - Assigns IP from Engineer group pool
   - Gets all subnets from organizations attached to Engineer group
   - Creates VPN peer in wg0 server
   - Updates AllowedIPs with organization subnets
4. john.doe can download VPN config and connect
```

### **Example 2: Organization Subnet Changes**
```
1. Admin adds new subnet to "EGOV" organization
2. "EGOV" organization is attached to "Engineer" group
3. System automatically:
   - Detects subnet change
   - Updates AllowedIPs for all Engineer group peers
   - Pushes updated routes to VPN server
4. All Engineer group users get access to new subnet
```

### **Example 3: User Leaves Company**
```
1. Admin removes "john.doe" from "Engineer" group
2. System automatically:
   - Removes VPN peer from wg0 server
   - Deletes peer configuration
   - Cleans up database records
3. john.doe loses VPN access immediately
```

## 📋 API Reference

### **User Group Assignment**
- `POST /api/users/{user_id}/groups` - Assign user to group
- `DELETE /api/users/{user_id}/groups/{group_id}` - Remove user from group
- `GET /api/users/{user_id}/groups` - Get user's groups
- `GET /api/enhanced-rbac/groups/{group_id}/users` - Get group's users

### **VPN Peer Management**
- `POST /api/users/{user_id}/vpn-peer` - Generate VPN peer
- `GET /api/users/{user_id}/vpn-config` - Download VPN config
- `POST /api/enhanced-rbac/groups/{group_id}/update-routes` - Update group routes

### **Status Tracking**
- `GET /api/users/{user_id}/vpn-status` - Get user's VPN status
- `GET /api/enhanced-rbac/groups/{group_id}/peers-summary` - Get group peers summary

## 🔒 Security Considerations

1. **Key Management**: WireGuard private keys stored encrypted in database
2. **Access Control**: Only admins can assign users to groups
3. **Audit Trail**: All user assignments and VPN peer generation logged
4. **IP Pool Management**: Automatic IP assignment with conflict detection
5. **Route Validation**: Subnet validation before applying to peers

## 🎯 Benefits

1. **Automation**: Zero-touch VPN peer generation
2. **Scalability**: Supports unlimited users and groups
3. **Flexibility**: Easy group-based access control
4. **Maintenance**: Automatic route updates when configurations change
5. **Security**: Centralized VPN management with audit trails

## 📈 Future Enhancements

1. **OpenVPN Support**: Extend to support OpenVPN user/pass authentication
2. **Multi-Server**: Support for multiple VPN servers per group
3. **Advanced Routing**: Custom routing policies per user
4. **Monitoring**: VPN connection monitoring and analytics
5. **Integration**: LDAP/AD integration for user management

---

**Status**: ✅ Ready for Implementation  
**Priority**: High  
**Estimated Time**: 2-3 days for full implementation



