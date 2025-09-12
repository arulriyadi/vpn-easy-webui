#!/bin/bash

# VPN Easy WebUI Uninstaller
# This script removes VPN Easy WebUI systemd service and files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="vpn-easy"
INSTALL_DIR="/opt/vpn-easy"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
LOG_DIR="/var/log/vpn-easy"

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

# Function to confirm uninstallation
confirm_uninstall() {
    echo "=========================================="
    echo "VPN Easy WebUI Uninstaller"
    echo "=========================================="
    echo
    print_warning "This will completely remove VPN Easy WebUI from your system:"
    echo "  - Stop and disable the $SERVICE_NAME service"
    echo "  - Remove service file: $SERVICE_FILE"
    echo "  - Remove installation directory: $INSTALL_DIR"
    echo "  - Remove log directory: $LOG_DIR"
    echo "  - Remove systemd configuration"
    echo
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Uninstallation cancelled"
        exit 0
    fi
}

# Function to ask about WireGuard configuration removal
ask_wireguard_removal() {
    echo
    print_warning "WireGuard Configuration Options:"
    echo "  - Keep WireGuard configurations (recommended for reinstallation)"
    echo "  - Remove WireGuard configurations (complete cleanup)"
    echo
    read -p "Do you want to remove WireGuard configurations? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        REMOVE_WIREGUARD=true
        print_status "WireGuard configurations will be removed"
    else
        REMOVE_WIREGUARD=false
        print_status "WireGuard configurations will be preserved"
    fi
}

# Function to stop and disable service
stop_service() {
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_status "Stopping $SERVICE_NAME service..."
        systemctl stop $SERVICE_NAME
        print_success "Service stopped"
    else
        print_status "Service is not running"
    fi
    
    if systemctl is-enabled --quiet $SERVICE_NAME; then
        print_status "Disabling $SERVICE_NAME service..."
        systemctl disable $SERVICE_NAME
        print_success "Service disabled"
    else
        print_status "Service is not enabled"
    fi
}

# Function to remove systemd service file
remove_service_file() {
    if [[ -f $SERVICE_FILE ]]; then
        print_status "Removing systemd service file: $SERVICE_FILE"
        rm -f $SERVICE_FILE
        print_success "Service file removed"
    else
        print_status "Service file not found: $SERVICE_FILE"
    fi
}

# Function to remove installation directory
remove_install_dir() {
    if [[ -d $INSTALL_DIR ]]; then
        print_status "Removing installation directory: $INSTALL_DIR"
        rm -rf $INSTALL_DIR
        print_success "Installation directory removed"
    else
        print_status "Installation directory not found: $INSTALL_DIR"
    fi
}

# Function to remove log directory
remove_log_dir() {
    if [[ -d $LOG_DIR ]]; then
        print_status "Removing log directory: $LOG_DIR"
        rm -rf $LOG_DIR
        print_success "Log directory removed"
    else
        print_status "Log directory not found: $LOG_DIR"
    fi
}

# Function to remove WireGuard configurations
remove_wireguard_configs() {
    if [[ "$REMOVE_WIREGUARD" == "true" ]]; then
        print_status "Removing WireGuard configurations..."
        
        # Stop all WireGuard interfaces
        for interface in $(wg show interfaces); do
            print_status "Stopping WireGuard interface: $interface"
            wg-quick down $interface 2>/dev/null || true
        done
        
        # Remove WireGuard configuration files
        if [[ -d "/etc/wireguard" ]]; then
            print_status "Removing WireGuard configuration directory: /etc/wireguard"
            rm -rf /etc/wireguard/*
            print_success "WireGuard configurations removed"
        fi
        
        # Remove WireGuard systemd service files
        for service_file in /etc/systemd/system/wg-quick@*.service; do
            if [[ -f "$service_file" ]]; then
                service_name=$(basename "$service_file")
                print_status "Disabling and removing WireGuard service: $service_name"
                systemctl disable "$service_name" 2>/dev/null || true
                rm -f "$service_file"
            fi
        done
        
        # Reload systemd after removing services
        systemctl daemon-reload
        
        print_success "WireGuard configurations removed successfully"
    else
        print_status "WireGuard configurations preserved"
    fi
}

# Function to reload systemd
reload_systemd() {
    print_status "Reloading systemd daemon..."
    systemctl daemon-reload
    print_success "Systemd daemon reloaded"
}

# Function to show uninstallation summary
show_uninstall_summary() {
    print_success "Uninstallation completed successfully!"
    echo
    echo "Removed components:"
    echo "  - Service: $SERVICE_NAME"
    echo "  - Service file: $SERVICE_FILE"
    echo "  - Installation directory: $INSTALL_DIR"
    echo "  - Log directory: $LOG_DIR"
    
    if [[ "$REMOVE_WIREGUARD" == "true" ]]; then
        echo "  - WireGuard configurations: /etc/wireguard/*"
        echo "  - WireGuard systemd services: wg-quick@*.service"
    fi
    
    echo
    print_status "VPN Easy WebUI has been completely removed from your system"
    echo
    
    if [[ "$REMOVE_WIREGUARD" == "true" ]]; then
        print_warning "Note: WireGuard configurations have been removed"
        print_warning "If you want to remove WireGuard completely, run: apt remove wireguard"
    else
        print_warning "Note: WireGuard configurations have been preserved"
        print_warning "If you want to remove WireGuard completely, run: apt remove wireguard"
    fi
}

# Function to check if service exists
check_service_exists() {
    if ! systemctl list-unit-files | grep -q $SERVICE_NAME; then
        print_warning "Service $SERVICE_NAME is not installed"
        print_status "Nothing to uninstall"
        exit 0
    fi
}

# Main uninstallation function
main() {
    check_root
    confirm_uninstall
    ask_wireguard_removal
    check_service_exists
    stop_service
    remove_wireguard_configs
    remove_service_file
    remove_install_dir
    remove_log_dir
    reload_systemd
    show_uninstall_summary
}

# Run main function
main "$@"
