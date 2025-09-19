# VPN Easy WebUI - Installer Package

## 📦 Package Overview

This is the **clean installer package** for VPN Easy WebUI. This package contains:

- ✅ **Clean Database Schema**: All databases start empty (except admin user)
- ✅ **No Development Data**: No test users, groups, or organizations
- ✅ **Production Ready**: Optimized for fresh installations
- ✅ **Complete Features**: All latest features included

## 🏗️ Project Structure

```
/home/ubuntu/vpn-easy-webui/          # Development Environment (Live Testing)
├── db/
│   ├── users.db                      # Contains development data
│   ├── rbac.db                       # Contains test groups
│   └── organization.db               # Contains test organizations
├── modules/                          # Python modules
├── static/app/                       # Frontend application
└── ...

/home/ubuntu/installer/vpn-easy-webui/ # Installer Package (Clean Distribution)
├── db/
│   ├── users_schema.sql              # Clean users schema
│   ├── rbac_new_schema.sql           # Clean RBAC schema  
│   ├── organization_schema.sql       # Clean organization schema
│   ├── cleanup_rbac_data.sql         # Cleanup scripts
│   └── cleanup_organization_data.sql
├── modules/                          # Python modules (same as dev)
├── static/app/                       # Frontend application (same as dev)
├── install.sh                        # Installation script
├── uninstall.sh                      # Uninstallation script
└── start.sh                          # Application startup script
```

## 🚀 Installation Process

### 1. Development Environment
```bash
cd /home/ubuntu/vpn-easy-webui
# Used for live development and testing
# Contains development data and test configurations
```

### 2. Installer Package
```bash
cd /home/ubuntu/installer/vpn-easy-webui
sudo ./install.sh
# Creates clean installation in /opt/vpn-easy/
# Databases start empty (except admin user)
# No test data or development configurations
```

## 🗄️ Database Initialization

### Fresh Installation Creates:

1. **users.db**
   - ✅ Only admin user (username: admin, password: admin123)
   - ✅ Clean user_groups table
   - ✅ No development/test users

2. **rbac.db** 
   - ✅ Empty rbac_groups table
   - ✅ No default groups (Admin, Engineer, etc.)
   - ✅ Clean group-organization relations
   - ✅ No test policies or rules

3. **organization.db**
   - ✅ Empty organizations table
   - ✅ No default organizations (EGOV, Elitery, etc.)
   - ✅ Clean organization_subnets table

## 🎯 Installation Features

### What Gets Installed:
- ✅ **WireGuard VPN Management**: Complete server and peer management
- ✅ **User Management System**: Auto VPN peer generation on user creation
- ✅ **Organization-based Access Control**: Define organizations with subnets
- ✅ **Enhanced RBAC Management**: Scalable role-based access control
- ✅ **Firewall Management**: iptables rules management
- ✅ **Routing Management**: Static routes and routing table
- ✅ **Comprehensive Logging**: Activity tracking and system logs
- ✅ **System Status Monitoring**: Real-time resource monitoring

### What's NOT Included:
- ❌ Development test data
- ❌ Sample users, groups, or organizations
- ❌ Test VPN configurations
- ❌ Development logs or cache files

## 🔧 Post-Installation Setup

After installation, you'll need to:

1. **Create Organizations** (if needed)
   - Go to Organization Management
   - Create your organization(s)
   - Add subnet definitions

2. **Create RBAC Groups** (if needed)
   - Go to Enhanced RBAC Management
   - Create groups (Admin, Engineer, Guest, etc.)
   - Attach organizations to groups

3. **Create Users**
   - Go to User Management
   - Create users (they'll be auto-assigned to default groups)
   - VPN peers will be automatically generated

## 📋 Installation Requirements

- **OS**: Ubuntu 18.04+ or Debian 10+
- **Python**: 3.8+
- **Node.js**: 18+
- **WireGuard**: Will be installed automatically
- **Root Access**: Required for system-level installation

## 🔄 Development vs Production

| Aspect | Development (`/home/ubuntu/vpn-easy-webui`) | Production (`/opt/vpn-easy/`) |
|--------|---------------------------------------------|------------------------------|
| **Purpose** | Live development & testing | Production deployment |
| **Database** | Contains test data | Clean, empty databases |
| **Users** | Multiple test users | Only admin user |
| **Groups** | Test groups (Admin, Engineer, etc.) | Empty (create as needed) |
| **Organizations** | Test orgs (EGOV, Elitery) | Empty (create as needed) |
| **Configuration** | Development settings | Production settings |
| **Logging** | Development logs | Production logging |

## 🚀 Quick Start

1. **Copy installer package** to target server
2. **Run installation**: `sudo ./install.sh`
3. **Access web interface**: `http://your-server:8080`
4. **Login**: admin / admin123
5. **Configure** organizations, groups, and users as needed

## 📞 Support

For installation issues or questions:
- Check installation logs in `/opt/vpn-easy/logs/`
- Verify system requirements
- Ensure proper network connectivity
- Review firewall settings

---

**Note**: This installer package is designed for clean, production-ready deployments. For development work, use the development environment in `/home/ubuntu/vpn-easy-webui/`.