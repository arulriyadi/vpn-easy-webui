# VPN Easy WebUI - Complete VPN Management Solution

Advanced VPN management dashboard with comprehensive user management, organization-based access control, and automated VPN peer lifecycle management.

## 🚀 Features

- **🔐 WireGuard VPN Management**: Complete WireGuard server and peer management
- **👥 User Management System**: Create, manage, and delete users with role-based access
- **🏢 Organization Integration**: Organization-based subnet management and access control
- **⚡ Auto VPN Peer Generation**: Automatic VPN peer creation when users are created
- **🧹 Auto VPN Peer Cleanup**: Automatic VPN peer removal when users are deleted
- **🔒 Enhanced RBAC**: Role-based access control with organization-based restrictions
- **🔥 Firewall Management**: Add, delete, and reload iptables rules through web interface
- **🛣️ Routing Management**: Manage static routes and view routing table
- **📊 Comprehensive Logging**: Centralized logging system with activity tracking
- **🎯 Organization Subnet Integration**: WireGuard peers automatically use organization-specific allowed IPs

## Quick Start

### Prerequisites
- Ubuntu/Debian Linux system
- Python 3.6+
- iptables
- iproute2
- sudo access

### Installation & Running

### 🚀 **Quick Installation (Recommended)**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arulriyadi/vpn-easy-webui.git
   cd vpn-easy-webui
   ```

2. **Run the installer (as root):**
   ```bash
   sudo ./install.sh
   ```

3. **Access the dashboard:**
   - URL: `http://localhost:10081` (or your configured port)
   - Username: `admin` (or your configured username)
   - Password: `admin` (or your configured password)

### 🔧 **Manual Installation (Alternative)**

1. **Install system requirements:**
   ```bash
   sudo ./requirements.sh
   ```

2. **Run the application:**
   ```bash
   ./start.sh
   ```

3. **Access the dashboard:**
   - URL: `http://localhost:10081`
   - Username: `admin`
   - Password: `admin`

That's it! The scripts will automatically:
- Install all system dependencies (Python, pip, iptables, etc.)
- Create virtual environment
- Install required Python packages
- Start the WGDashboard with firewall & routing features

## 📁 File Structure

```
vpn-easy-webui/
├── install.sh              # System installer script
├── uninstall.sh            # System uninstaller script
├── start.sh                # Main startup script
├── requirements.txt        # Python dependencies
├── dashboard.py            # Main Flask application
├── wg-dashboard.ini        # Configuration file
├── modules/                # Backend modules
│   ├── EnhancedRBACManager.py    # Enhanced RBAC with organization support
│   ├── OrganizationManager.py    # Organization management
│   ├── UserManager.py            # User management system
│   ├── FirewallManager.py        # iptables management
│   ├── RouteManager.py           # routing table management
│   └── LoggingManager.py         # centralized logging system
├── db/                     # Database schemas and migrations
│   ├── rbac_schema.sql           # RBAC database schema
│   ├── organization_schema.sql   # Organization database schema
│   └── user_vpn_peers_migration.sql # VPN peer tracking schema
└── static/app/src/         # Frontend components
    ├── views/
    │   ├── userManagement.vue     # User management UI
    │   ├── organizations.vue      # Organization management UI
    │   ├── enhancedRbacManagement.vue # RBAC management UI
    │   ├── firewall.vue           # Firewall management UI
    │   ├── routing.vue            # Routing management UI
    │   └── logging.vue            # Logging management UI
    ├── components/
    │   └── navbar.vue             # Navigation with new menu items
    ├── router/
    │   └── router.js              # Vue router configuration
    └── utilities/
        └── fetch.js               # API utilities
```

## 🔌 API Endpoints

### 👥 User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user (auto-assigns to default group)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (auto-cleanup VPN peers)
- `GET /api/users/{id}/groups` - Get user's group memberships
- `GET /api/users/statistics` - Get user statistics

### 🏢 Organization Management
- `GET /api/organizations` - Get all organizations
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization
- `GET /api/organizations/{id}/subnets` - Get organization subnets

### 🔒 RBAC Management
- `GET /api/enhanced-rbac/groups` - Get all RBAC groups
- `POST /api/enhanced-rbac/groups` - Create new group
- `GET /api/enhanced-rbac/groups/{id}/organizations` - Get group organizations
- `POST /api/enhanced-rbac/groups/{id}/organizations/{org_id}` - Assign organization to group
- `GET /api/enhanced-rbac/groups/{id}/vpn-subnets` - Get group VPN subnets

### 🔐 WireGuard Management
- `GET /api/getWireguardConfigurations` - Get WireGuard configurations
- `GET /api/getWireguardConfigurationInfo` - Get specific configuration info
- `POST /api/assignUserToGroup` - Assign user to group (auto-generates VPN peer)

### 🔥 Firewall Management
- `GET /api/firewall/rules` - Get current firewall rules
- `POST /api/firewall/rules` - Add new firewall rule
- `DELETE /api/firewall/rules` - Delete firewall rule
- `POST /api/firewall/reload` - Reload firewall rules

### 🛣️ Routing Management
- `GET /api/routes` - Get current routing table
- `POST /api/routes` - Add new route
- `DELETE /api/routes` - Delete route
- `GET /api/system/info` - Get system information

### 📊 Logging Management
- `GET /api/logs` - Get activity logs with filtering
- `GET /api/logs/statistics` - Get logging statistics
- `GET /api/logs/system/{type}` - Get system log files
- `POST /api/logs/clear` - Clear logs from database
- `GET /api/logs/export` - Export logs in JSON/CSV format

## Configuration

Edit `wg-dashboard.ini` to customize:
- Server port
- Admin credentials
- Database settings
- Other WGDashboard options

## Manual Installation (Alternative)

If you prefer manual setup:

1. **Install dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Run directly:**
   ```bash
   python3 dashboard.py
   ```

## Troubleshooting

### Common Issues

1. **pip3 is not installed error:**
   ```bash
   sudo ./requirements.sh
   ```

2. **Permission denied on scripts:**
   ```bash
   chmod +x requirements.sh start.sh
   ```

3. **Python packages not found:**
   ```bash
   pip3 install -r requirements.txt
   ```

4. **iptables permission denied:**
   - Run with sudo or ensure user is in appropriate groups
   - Check iptables is installed: `sudo apt install iptables`

5. **Port already in use:**
   - Change port in `wg-dashboard.ini`
   - Or kill existing process: `sudo lsof -ti:10086 | xargs kill`

6. **System requirements missing:**
   - Run `sudo ./requirements.sh` to install all dependencies
   - This will install Python 3, pip3, iptables, iproute2, etc.

## Security Notes

- Change default admin password in production
- Use HTTPS in production environments
- Consider firewall rules for production deployment
- Regular security updates recommended

## License

This project extends WGDashboard and follows the same license terms.
