#!/bin/bash

# VPN Easy WebUI Installer
# This script installs VPN Easy WebUI as a systemd service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="vpn-easy"
SERVICE_USER="root"
INSTALL_DIR="/opt/vpn-easy"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
LOG_DIR="/var/log/vpn-easy"

# Default values (will be overridden by user input)
DEFAULT_PORT="10081"
DEFAULT_USER="admin"
DEFAULT_PASS="admin"

# User input variables
CUSTOM_PORT=""
CUSTOM_USER=""
CUSTOM_PASS=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Function to get user configuration
get_user_configuration() {
    echo "=========================================="
    echo "VPN Easy WebUI Configuration"
    echo "=========================================="
    echo
    echo "Please configure your VPN Easy WebUI installation:"
    echo
    
    # Get web port
    while true; do
        read -p "Web Interface Port (default: $DEFAULT_PORT): " CUSTOM_PORT
        if [[ -z "$CUSTOM_PORT" ]]; then
            CUSTOM_PORT="$DEFAULT_PORT"
        fi
        
        # Validate port number
        if [[ "$CUSTOM_PORT" =~ ^[0-9]+$ ]] && [ "$CUSTOM_PORT" -ge 1024 ] && [ "$CUSTOM_PORT" -le 65535 ]; then
            break
        else
            print_error "Please enter a valid port number (1024-65535)"
        fi
    done
    
    # Get admin username
    while true; do
        read -p "Admin Username (default: $DEFAULT_USER): " CUSTOM_USER
        if [[ -z "$CUSTOM_USER" ]]; then
            CUSTOM_USER="$DEFAULT_USER"
        fi
        
        # Validate username
        if [[ "$CUSTOM_USER" =~ ^[a-zA-Z0-9_-]+$ ]] && [ ${#CUSTOM_USER} -ge 3 ]; then
            break
        else
            print_error "Username must be at least 3 characters and contain only letters, numbers, underscore, or dash"
        fi
    done
    
    # Get admin password
    while true; do
        read -s -p "Admin Password (default: $DEFAULT_PASS): " CUSTOM_PASS
        echo
        if [[ -z "$CUSTOM_PASS" ]]; then
            CUSTOM_PASS="$DEFAULT_PASS"
        fi
        
        # Validate password
        if [ ${#CUSTOM_PASS} -ge 6 ]; then
            break
        else
            print_error "Password must be at least 6 characters long"
        fi
    done
    
    # Confirm password
    while true; do
        read -s -p "Confirm Admin Password: " CONFIRM_PASS
        echo
        if [[ "$CUSTOM_PASS" == "$CONFIRM_PASS" ]]; then
            break
        else
            print_error "Passwords do not match. Please try again."
        fi
    done
    
    echo
    print_success "Configuration saved!"
}

# Function to show installation information
show_installation_info() {
    echo "=========================================="
    echo "VPN Easy WebUI Installation Information"
    echo "=========================================="
    echo
    echo "Installation Details:"
    echo "  Service Name: $SERVICE_NAME"
    echo "  Install Directory: $INSTALL_DIR"
    echo "  Log Directory: $LOG_DIR"
    echo "  Web Port: $CUSTOM_PORT"
    echo
    echo "Admin Credentials:"
    echo "  Username: $CUSTOM_USER"
    echo "  Password: [HIDDEN]"
    echo
    echo "Web Interface:"
    echo "  URL: http://localhost:$CUSTOM_PORT"
    echo "  URL: http://$(hostname -I | awk '{print $1}'):$CUSTOM_PORT"
    echo
    echo "Features:"
    echo "  - WireGuard VPN Management"
    echo "  - User Management System with Auto VPN Peer Generation"
    echo "  - Organization-based Access Control"
    echo "  - Enhanced RBAC Management"
    echo "  - Firewall Rules Management"
    echo "  - Routing Table Management"
    echo "  - Comprehensive Logging System"
    echo
    read -p "Do you want to continue with the installation? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installation cancelled by user"
        exit 0
    fi
}

# Function to check and install system requirements
check_requirements() {
    print_status "Checking and installing system requirements..."
    
    # Update package list
    print_status "Updating package list..."
    apt-get update -y
    
    # Check if systemd is available
    if ! command -v systemctl &> /dev/null; then
        print_error "systemd is not available on this system"
        exit 1
    fi
    
    # Always install/update Python 3 and related packages
    print_status "Installing/updating Python 3 and pip..."
    apt-get install -y python3 python3-pip python3-venv python3-dev
    
    # Verify pip3 installation
    if ! command -v pip3 &> /dev/null; then
        print_error "Failed to install pip3. Trying alternative installation..."
        apt-get install -y python3-distutils
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python3 get-pip.py
        rm -f get-pip.py
    fi
    
    # Verify installation
    if command -v python3 &> /dev/null && command -v pip3 &> /dev/null; then
        print_success "Python 3 and pip3 are ready"
        python3 --version
        pip3 --version
    else
        print_error "Failed to install Python 3 or pip3"
        exit 1
    fi
    
    # Check and install WireGuard
    if ! command -v wg &> /dev/null; then
        print_status "Installing WireGuard..."
        apt-get install -y wireguard wireguard-tools
    else
        print_success "WireGuard is already installed"
    fi
    
    # Check and install iptables
    if ! command -v iptables &> /dev/null; then
        print_status "Installing iptables..."
        apt-get install -y iptables iptables-persistent
    else
        print_success "iptables is already installed"
    fi
    
    # Check and install other required tools
    REQUIRED_PACKAGES=(
        "curl"
        "wget"
        "git"
        "rsync"
        "net-tools"
        "iproute2"
        "systemd"
        "build-essential"
        "libssl-dev"
        "libffi-dev"
        "python3-dev"
    )
    
    for package in "${REQUIRED_PACKAGES[@]}"; do
        if ! dpkg -l | grep -q "^ii  $package "; then
            print_status "Installing $package..."
            apt-get install -y "$package"
        else
            print_success "$package is already installed"
        fi
    done
    
    # Check and install Node.js and npm for frontend build
    if ! command -v node &> /dev/null; then
        print_status "Installing Node.js and npm..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    else
        print_success "Node.js is already installed"
    fi
    
    print_success "All system requirements installed successfully"
}

# Function to stop existing service if running
stop_existing_service() {
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_status "Stopping existing $SERVICE_NAME service..."
        systemctl stop $SERVICE_NAME
    fi
    
    if systemctl is-enabled --quiet $SERVICE_NAME; then
        print_status "Disabling existing $SERVICE_NAME service..."
        systemctl disable $SERVICE_NAME
    fi
}

# Function to create installation directory
create_install_dir() {
    print_status "Creating installation directory: $INSTALL_DIR"
    mkdir -p $INSTALL_DIR
    mkdir -p $LOG_DIR
}

# Function to copy application files
copy_application_files() {
    print_status "Copying application files to $INSTALL_DIR"
    
    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # Copy all files except .git directory and development data
    rsync -av --exclude='.git' --exclude='*.log' --exclude='__pycache__' --exclude='db/*.db' --exclude='db/*.sqlite' "$SCRIPT_DIR/" "$INSTALL_DIR/"
    
    # Create clean database directory
    mkdir -p $INSTALL_DIR/db
    
    # Ensure required schema files exist
    if [ ! -f "$INSTALL_DIR/db/organization_schema.sql" ]; then
        print_error "organization_schema.sql not found in db/ directory"
        exit 1
    fi
    
    if [ ! -f "$INSTALL_DIR/db/rbac_new_schema.sql" ]; then
        print_error "rbac_new_schema.sql not found in db/ directory"
        exit 1
    fi
    
    print_success "All required schema files found"
    
    # Initialize database schemas
    print_status "Initializing database schemas..."
    
    # Initialize RBAC schema
    if [ -f "$INSTALL_DIR/db/rbac_new_schema.sql" ]; then
        sqlite3 "$INSTALL_DIR/db/rbac.db" < "$INSTALL_DIR/db/rbac_new_schema.sql"
        print_success "RBAC schema initialized"
    fi
    
    # Initialize Organization schema
    if [ -f "$INSTALL_DIR/db/organization_schema.sql" ]; then
        sqlite3 "$INSTALL_DIR/db/organization.db" < "$INSTALL_DIR/db/organization_schema.sql"
        print_success "Organization schema initialized"
    fi
    
    # Remove old schema files that contain default data
    if [ -f "$INSTALL_DIR/db/rbac_schema.sql" ]; then
        rm "$INSTALL_DIR/db/rbac_schema.sql"
        print_success "Removed old rbac_schema.sql with default data"
    fi
    
    # Cleanup default/demo data for fresh installation
    print_status "Cleaning up default data for fresh installation..."
    if [ -f "$INSTALL_DIR/db/cleanup_rbac_data.sql" ]; then
        sqlite3 "$INSTALL_DIR/db/rbac.db" < "$INSTALL_DIR/db/cleanup_rbac_data.sql"
        print_success "RBAC default data cleaned up - only Admin group remains"
    fi
    if [ -f "$INSTALL_DIR/db/cleanup_organization_data.sql" ]; then
        sqlite3 "$INSTALL_DIR/db/organization.db" < "$INSTALL_DIR/db/cleanup_organization_data.sql"
        print_success "Organization default data cleaned up - no organizations remain"
    fi
    
    print_success "Database schemas initialized successfully"
    
    # Set proper permissions
    chown -R $SERVICE_USER:$SERVICE_USER $INSTALL_DIR
    chmod +x $INSTALL_DIR/start.sh
    chmod +x $INSTALL_DIR/install.sh
    chmod +x $INSTALL_DIR/uninstall.sh
}

# Function to setup Python virtual environment and dependencies
setup_python_dependencies() {
    print_status "Setting up Python virtual environment and dependencies..."
    
    cd $INSTALL_DIR
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment and install dependencies
    print_status "Installing Python packages in virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip --disable-pip-version-check
    
    # Install requirements
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt --disable-pip-version-check
        print_success "Python packages installed successfully"
    else
        print_error "requirements.txt not found!"
        exit 1
    fi
    
    # Verify critical packages
    python -c "import bcrypt, pyotp" 2>/dev/null || {
        print_error "Failed to import required packages (bcrypt, pyotp)"
        print_status "Trying to install them manually..."
        pip install bcrypt pyotp
    }
    
    # Set proper ownership
    chown -R $SERVICE_USER:$SERVICE_USER venv/
    
    print_success "Python virtual environment setup complete"
}

# Function to update configuration file
update_configuration() {
    print_status "Creating clean configuration file with user settings..."
    
    CONFIG_FILE="$INSTALL_DIR/wg-dashboard.ini"
    
    # Remove existing config file to ensure clean installation
    if [ -f "$CONFIG_FILE" ]; then
        rm "$CONFIG_FILE"
    fi
    
    # Create new clean configuration file using virtual environment Python
    cat > "$CONFIG_FILE" << EOF
[Account]
username = $CUSTOM_USER
password = $($INSTALL_DIR/venv/bin/python -c "import bcrypt; print(bcrypt.hashpw('$CUSTOM_PASS'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))")
enable_totp = false
totp_verified = false
totp_key = $($INSTALL_DIR/venv/bin/python -c "import pyotp; print(pyotp.random_base32())")

[Server]
wg_conf_path = /etc/wireguard
awg_conf_path = /etc/amnezia/amneziawg
app_prefix = 
app_ip = 0.0.0.0
app_port = $CUSTOM_PORT
auth_req = true
version = v4.2.5
dashboard_refresh_interval = 60000
dashboard_peer_list_display = grid
dashboard_sort = status
dashboard_theme = dark
dashboard_api_key = false
dashboard_language = en

[Peers]
peer_global_dns = 1.1.1.1
peer_endpoint_allowed_ip = 0.0.0.0/0
peer_display_mode = grid
remote_endpoint = 
peer_mtu = 1420
peer_keep_alive = 21

[Other]
welcome_session = false

[Database]
type = sqlite

[Email]
server = 
port = 
encryption = 
username = 
email_password = 
send_from = 
email_template = 

[WireGuardConfiguration]
autostart = 
EOF
    
    print_success "Clean configuration file created"
}

# Function to create systemd service file
create_systemd_service() {
    print_status "Creating systemd service file: $SERVICE_FILE"
    
    cat > $SERVICE_FILE << EOF
[Unit]
Description=VPN Easy WebUI - WireGuard VPN Management Dashboard
Documentation=https://github.com/arulriyadi/vpn-easy-webui
After=network.target
Wants=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/start.sh
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=vpn-easy

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=false
ProtectHome=false
ReadWritePaths=$INSTALL_DIR $LOG_DIR /etc/wireguard /root/.local

# Environment
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=PYTHONPATH=$INSTALL_DIR

[Install]
WantedBy=multi-user.target
EOF

    print_success "Systemd service file created"
}

# Function to reload systemd and enable service
enable_service() {
    print_status "Reloading systemd daemon..."
    systemctl daemon-reload
    
    print_status "Enabling $SERVICE_NAME service..."
    systemctl enable $SERVICE_NAME
    
    print_success "Service enabled successfully"
}

# Function to start the service
start_service() {
    print_status "Starting $SERVICE_NAME service..."
    systemctl start $SERVICE_NAME
    
    # Wait a moment for the service to start
    sleep 3
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "Service started successfully"
    else
        print_error "Failed to start service"
        print_status "Checking service status..."
        systemctl status $SERVICE_NAME --no-pager
        exit 1
    fi
}

# Function to show service information
show_service_info() {
    print_success "Installation completed successfully!"
    echo
    echo "=========================================="
    echo "VPN Easy WebUI Installation Complete"
    echo "=========================================="
    echo
    echo "Service Information:"
    echo "  Service Name: $SERVICE_NAME"
    echo "  Install Directory: $INSTALL_DIR"
    echo "  Log Directory: $LOG_DIR"
    echo "  Service File: $SERVICE_FILE"
    echo
    echo "Web Interface:"
    echo "  Local URL: http://localhost:$CUSTOM_PORT"
    echo "  Network URL: http://$(hostname -I | awk '{print $1}'):$CUSTOM_PORT"
    echo "  Username: $CUSTOM_USER"
    echo "  Password: [HIDDEN]"
    echo
    echo "Management Commands:"
    echo "  Start:   systemctl start $SERVICE_NAME"
    echo "  Stop:    systemctl stop $SERVICE_NAME"
    echo "  Restart: systemctl restart $SERVICE_NAME"
    echo "  Status:  systemctl status $SERVICE_NAME"
    echo "  Logs:    journalctl -u $SERVICE_NAME -f"
    echo
    echo "Features Available:"
    echo "  ✅ WireGuard VPN Management"
    echo "  ✅ User Management System with Auto VPN Peer Generation"
    echo "  ✅ Organization-based Access Control"
    echo "  ✅ Enhanced RBAC Management"
    echo "  ✅ Firewall Rules Management"
    echo "  ✅ Routing Table Management"
    echo "  ✅ Comprehensive Logging System"
    echo
    print_status "Service is now running and will start automatically on boot"
    echo
    print_warning "Important Security Notes:"
    echo "  - Change default password after first login"
    echo "  - Configure firewall rules as needed"
    echo "  - Review and customize WireGuard configurations"
    echo "  - Monitor logs regularly for security events"
}

# Main installation function
main() {
    check_root
    get_user_configuration
    show_installation_info
    check_requirements
    stop_existing_service
    create_install_dir
    copy_application_files
    setup_python_dependencies
    update_configuration
    create_systemd_service
    enable_service
    start_service
    show_service_info
}

# Run main function
main "$@"
