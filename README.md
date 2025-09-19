# VPN Easy WebUI - Final Installer Package

## 🚀 Quick Installation

```bash
# Download and extract the installer
cd installer-final/vpn-easy-webui

# Run the installer
sudo ./install.sh
```

## 📋 Installation Process

The installer will prompt you for:
1. **Port**: Default is 8080
2. **Admin Username**: Default is `admin`
3. **Admin Password**: You'll set this during installation
4. **Confirm Password**: Confirm your admin password
5. **Create WireGuard Config**: Choose `y` to create default WireGuard configuration

## ✅ Features Included

- **WireGuard VPN Management**: Complete VPN server management
- **User Management System**: Auto VPN peer generation for users
- **Organization-based Access Control**: Subnet-based routing
- **Enhanced RBAC Management**: Role-based access control
- **Firewall Rules Management**: Advanced firewall configuration
- **Routing Table Management**: Custom routing rules
- **Comprehensive Logging System**: Full audit trail

## 🔧 Post-Installation Setup

After installation, access the web interface and:

1. **Login** with your admin credentials
2. **Create Organizations** with subnets in Organization Management
3. **Create RBAC Groups** and attach them to organizations
4. **Enable VPN** for groups and attach WireGuard servers
5. **Create Users** and assign them to groups for auto VPN peer generation

## 🌐 Access Information

- **Web Interface**: http://localhost:8080 (or your configured port)
- **Network Access**: http://YOUR_SERVER_IP:8080
- **Default Admin**: Username and password set during installation

## 📁 Directory Structure

```
/opt/vpn-easy/                 # Main installation directory
├── db/                        # Database files
├── static/                    # Frontend files
├── modules/                   # Backend modules
├── configurations/            # WireGuard configurations
├── dashboard.py              # Main application
├── start.sh                  # Service startup script
└── requirements.txt          # Python dependencies
```

## 🛠️ Management Commands

```bash
# Service management
sudo systemctl start vpn-easy
sudo systemctl stop vpn-easy
sudo systemctl restart vpn-easy
sudo systemctl status vpn-easy

# View logs
journalctl -u vpn-easy -f

# Uninstall
sudo ./uninstall.sh
```

## 🔒 Security Notes

- Change default password after first login
- Configure firewall rules as needed
- Review and customize WireGuard configurations
- Monitor logs regularly for security events
- Use strong passwords for admin accounts

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change port during installation or stop conflicting services
2. **Permission denied**: Ensure running with sudo privileges
3. **Database errors**: Check if sqlite3 is installed
4. **WireGuard issues**: Verify WireGuard is installed and configured

### Logs Location

- **Service logs**: `journalctl -u vpn-easy -f`
- **Application logs**: `/var/log/vpn-easy/`
- **WireGuard logs**: `journalctl -u wg-quick@wg0`

## 📞 Support

For issues and support, check the logs first and ensure all prerequisites are met.

---

**Version**: Final Release  
**Last Updated**: September 2025  
**Compatible**: Ubuntu 20.04+ / Debian 11+