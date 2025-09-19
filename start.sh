#!/bin/bash

# WGDashboard with Firewall & Routing Extension
# Start script for complete WGDashboard setup

set -e

echo "🚀 Starting WGDashboard with Firewall & Routing Extension..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_warning "Running as root. This is not recommended for production."
fi

# Check if this is a git repository and pull latest changes
if [ -d ".git" ]; then
    print_status "Checking for updates..."
    git pull origin main
    print_success "Repository updated."
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Check if iptables is available
if ! command -v iptables &> /dev/null; then
    print_error "iptables is not installed. Please install iptables first."
    exit 1
fi

# Check if ip command is available
if ! command -v ip &> /dev/null; then
    print_error "ip command is not available. Please install iproute2 first."
    exit 1
fi

# Check if WireGuard is installed
if ! command -v wg &> /dev/null; then
    print_warning "WireGuard is not installed. Installing WireGuard..."
    if [[ $EUID -eq 0 ]]; then
        apt update
        apt install -y wireguard wireguard-tools
        print_success "WireGuard installed successfully."
    else
        print_error "WireGuard installation requires root privileges."
        print_status "Please run: sudo apt update && sudo apt install -y wireguard wireguard-tools"
        print_status "Or run this script as root: sudo ./start.sh"
        exit 1
    fi
else
    print_success "WireGuard is already installed."
fi

print_status "All required tools are available."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created."
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install required packages
print_status "Installing required Python packages..."
pip install --upgrade pip --disable-pip-version-check 2>/dev/null || pip install --upgrade pip
pip install -r requirements.txt --disable-pip-version-check 2>/dev/null || pip install -r requirements.txt

print_success "Python packages installed."

# Check if wg-dashboard.ini exists
if [ ! -f "wg-dashboard.ini" ]; then
    print_error "wg-dashboard.ini not found. Please ensure the configuration file exists."
    exit 1
fi

# Check if dashboard.py exists
if [ ! -f "dashboard.py" ]; then
    print_error "dashboard.py not found. Please ensure the main application file exists."
    exit 1
fi

# Check if required modules exist
if [ ! -f "modules/EnhancedRBACManager.py" ] || [ ! -f "modules/UserManager.py" ] || [ ! -f "modules/OrganizationManager.py" ]; then
    print_error "Required modules not found. Please ensure EnhancedRBACManager.py, UserManager.py, and OrganizationManager.py exist in modules/ directory."
    exit 1
fi

# Check if frontend files exist
if [ ! -f "static/app/src/views/userManagement.vue" ] || [ ! -f "static/app/src/views/organizations.vue" ]; then
    print_error "Required frontend files not found. Please ensure userManagement.vue and organizations.vue exist in static/app/src/views/ directory."
    exit 1
fi

print_success "All required files are present."

# Set default port from config or use 10081
PORT=$(grep -o 'app_port = [0-9]*' wg-dashboard.ini | cut -d' ' -f3)
if [ -z "$PORT" ]; then
    PORT=10081
fi

print_status "Starting WGDashboard on port $PORT..."

# Start the application
print_status "Launching WGDashboard with Firewall & Routing Extension..."
echo ""
print_success "🎉 WGDashboard is starting up!"
echo ""
print_status "Access the dashboard at: http://localhost:$PORT"
print_status "Default credentials: Check wg-dashboard.ini for username/password"
echo ""
print_status "Features available:"
print_status "  - WireGuard VPN Management"
print_status "  - User Management System with Auto VPN Peer Generation"
print_status "  - Organization-based Access Control"
print_status "  - Enhanced RBAC Management"
print_status "  - Firewall & Routing Management"
print_status "  - Comprehensive Logging System"
echo ""
print_warning "Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python3 dashboard.py
