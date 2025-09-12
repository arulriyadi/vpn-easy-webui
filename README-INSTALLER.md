# VPN Easy WebUI - Systemd Service Installer

## Overview
VPN Easy WebUI adalah aplikasi web untuk mengelola WireGuard VPN dengan fitur firewall dan routing management. Installer ini akan mengatur aplikasi sebagai systemd service yang berjalan otomatis saat boot.

## Prerequisites
- Ubuntu/Debian Linux
- Root access
- Internet connection untuk download dependencies

## Installation

### 1. Download dan Extract
```bash
# Clone repository
git clone https://github.com/arulriyadi/vpn-easy-webui.git
cd vpn-easy-webui

# Atau download dan extract dari release
wget https://github.com/arulriyadi/vpn-easy-webui/archive/main.zip
unzip main.zip
cd vpn-easy-webui-main
```

### 2. Run Installer
```bash
# Jalankan installer sebagai root
sudo ./install.sh
```

### 3. Installation Process
Installer akan:
- ✅ Menampilkan informasi instalasi
- ✅ Meminta konfirmasi user
- ✅ Install semua dependencies yang diperlukan:
  - Python 3 + pip + venv
  - WireGuard + tools
  - iptables + iptables-persistent
  - Node.js + npm
  - Build tools dan libraries
  - Network utilities
- ✅ Copy aplikasi ke `/opt/vpn-easy`
- ✅ Buat systemd service
- ✅ Enable dan start service
- ✅ Tampilkan informasi lengkap

## Default Configuration

### Service Information
- **Service Name:** `vpn-easy`
- **Install Directory:** `/opt/vpn-easy`
- **Log Directory:** `/var/log/vpn-easy`
- **Web Port:** `10081`

### Default Credentials
- **Username:** `admin`
- **Password:** `admin`

### Web Interface
- **Local URL:** http://localhost:10081
- **Network URL:** http://[SERVER_IP]:10081

## Management Commands

### Service Management
```bash
# Start service
sudo systemctl start vpn-easy

# Stop service
sudo systemctl stop vpn-easy

# Restart service
sudo systemctl restart vpn-easy

# Check status
sudo systemctl status vpn-easy

# View logs
sudo journalctl -u vpn-easy -f

# Enable auto-start on boot
sudo systemctl enable vpn-easy

# Disable auto-start on boot
sudo systemctl disable vpn-easy
```

### Logs
```bash
# View real-time logs
sudo journalctl -u vpn-easy -f

# View recent logs
sudo journalctl -u vpn-easy --since "1 hour ago"

# View all logs
sudo journalctl -u vpn-easy
```

## Features

### ✅ WireGuard VPN Management
- Create, edit, delete VPN configurations
- Manage peers and keys
- Monitor connection status
- Generate client configs

### ✅ Firewall Rules Management
- iptables rules management
- Port forwarding
- Access control
- Rule persistence

### ✅ Routing Table Management
- Static routes configuration
- Route monitoring
- Network interface management

### ✅ User Management System
- Multi-user support
- Role-based access control
- User authentication
- Session management

### ✅ Comprehensive Logging
- System logs
- Application logs
- Security events
- Performance monitoring

## Uninstallation

### Remove Service
```bash
# Jalankan uninstaller
sudo ./uninstall.sh
```

Uninstaller akan:
- ✅ Stop dan disable service
- ✅ Remove systemd service file
- ✅ Remove installation directory
- ✅ Remove log directory
- ✅ Reload systemd daemon

### Manual Cleanup (if needed)
```bash
# Remove service file
sudo rm -f /etc/systemd/system/vpn-easy.service

# Remove directories
sudo rm -rf /opt/vpn-easy
sudo rm -rf /var/log/vpn-easy

# Reload systemd
sudo systemctl daemon-reload
```

## Security Notes

### ⚠️ Important Security Recommendations
1. **Change Default Password**
   - Login ke web interface
   - Ganti password default `admin`

2. **Firewall Configuration**
   - Review dan customize firewall rules
   - Restrict access ke port 10081 jika diperlukan

3. **WireGuard Security**
   - Generate new keys untuk production
   - Review peer configurations
   - Monitor connection logs

4. **System Security**
   - Keep system updated
   - Monitor logs regularly
   - Use strong passwords
   - Consider SSL/TLS untuk web interface

## Troubleshooting

### Service Won't Start
```bash
# Check service status
sudo systemctl status vpn-easy

# Check logs
sudo journalctl -u vpn-easy --no-pager

# Check if port is in use
sudo netstat -tlnp | grep 10081
```

### Web Interface Not Accessible
```bash
# Check if service is running
sudo systemctl is-active vpn-easy

# Check firewall
sudo ufw status
sudo iptables -L

# Check network connectivity
curl -I http://localhost:10081
```

### Dependencies Issues
```bash
# Reinstall dependencies
sudo apt update
sudo apt install -y python3 python3-pip python3-venv wireguard iptables nodejs npm

# Rebuild frontend
cd /opt/vpn-easy
npm install
npm run build
```

## Support

### Documentation
- GitHub Repository: https://github.com/arulriyadi/vpn-easy-webui
- Issues: https://github.com/arulriyadi/vpn-easy-webui/issues

### Logs Location
- Service Logs: `journalctl -u vpn-easy`
- Application Logs: `/var/log/vpn-easy/`
- System Logs: `/var/log/syslog`

## License
This project is licensed under the MIT License - see the LICENSE file for details.
