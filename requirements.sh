#!/bin/bash

# WGDashboard Requirements Installer
# Installs all required system packages and dependencies

set -e

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

echo "🔧 Installing WGDashboard Requirements..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root or with sudo"
    print_status "Please run: sudo ./requirements.sh"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    print_error "Cannot detect OS version"
    exit 1
fi

print_status "Detected OS: $OS $VER"

# Update package lists
print_status "Updating package lists..."
apt update

# Install Python 3 and pip3
print_status "Installing Python 3 and pip3..."
apt install -y python3 python3-pip python3-venv

# Install iptables
print_status "Installing iptables..."
apt install -y iptables

# Install iproute2 (ip command)
print_status "Installing iproute2..."
apt install -y iproute2

# Install curl (for testing)
print_status "Installing curl..."
apt install -y curl

# Install git (if not already installed)
if ! command -v git &> /dev/null; then
    print_status "Installing git..."
    apt install -y git
fi

# Install build essentials (for some Python packages)
print_status "Installing build essentials..."
apt install -y build-essential python3-dev

# Install WireGuard
print_status "Installing WireGuard..."
apt install -y wireguard wireguard-tools

# Upgrade pip
print_status "Upgrading pip..."
python3 -m pip install --upgrade pip --disable-pip-version-check

print_success "All system requirements installed successfully!"
echo ""
print_status "Installed packages:"
print_status "  ✅ Python 3"
print_status "  ✅ pip3"
print_status "  ✅ iptables"
print_status "  ✅ iproute2"
print_status "  ✅ curl"
print_status "  ✅ git"
print_status "  ✅ build-essential"
print_status "  ✅ WireGuard"
echo ""
print_success "🎉 You can now run ./start.sh to start WGDashboard!"
echo ""
print_warning "Note: Make sure to run ./start.sh as non-root user for better security"
