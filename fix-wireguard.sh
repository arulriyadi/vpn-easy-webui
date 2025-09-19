#!/bin/bash

# Fix WireGuard permissions and installation for WGDashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🔧 Fixing WireGuard permissions and installation..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root or with sudo"
    print_status "Please run: sudo ./fix-wireguard.sh"
    exit 1
fi

# Install WireGuard if not installed
print_status "Checking WireGuard installation..."
if ! command -v wg &> /dev/null; then
    print_status "Installing WireGuard..."
    apt update
    apt install -y wireguard wireguard-tools
    print_success "WireGuard installed."
else
    print_success "WireGuard already installed."
fi

# Create WireGuard directory if it doesn't exist
print_status "Creating WireGuard directory..."
mkdir -p /etc/wireguard
chmod 700 /etc/wireguard

# Set proper permissions
print_status "Setting proper permissions..."
chown -R root:root /etc/wireguard
chmod 700 /etc/wireguard

# Enable IP forwarding
print_status "Enabling IP forwarding..."
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' >> /etc/sysctl.conf
sysctl -p

# Enable WireGuard service
print_status "Enabling WireGuard service..."
systemctl enable wg-quick@wg0 2>/dev/null || true

print_success "WireGuard setup completed!"
echo ""
print_status "Next steps:"
print_status "1. Restart WGDashboard: ./start.sh"
print_status "2. Try creating WireGuard configuration again"
print_status "3. If still having issues, check WGDashboard logs"
