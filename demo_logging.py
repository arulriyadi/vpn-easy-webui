#!/usr/bin/env python3
"""
Demo script untuk testing fitur logging WGDashboard
Menambahkan beberapa sample log entries untuk demonstrasi
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.LoggingManager import LoggingManager
from datetime import datetime, timedelta
import time

def demo_logging():
    """Demo logging functionality"""
    print("🚀 Starting WGDashboard Logging Demo...")
    
    # Initialize LoggingManager
    logging_manager = LoggingManager()
    
    print("📝 Adding sample log entries...")
    
    # Sample authentication logs
    logging_manager.log_activity(
        level='info',
        category='authentication',
        message='User login successful: admin',
        user='admin',
        ip_address='192.168.1.100'
    )
    
    logging_manager.log_activity(
        level='warning',
        category='authentication',
        message='Failed login attempt: hacker',
        user='hacker',
        ip_address='10.0.0.50'
    )
    
    # Sample firewall logs
    logging_manager.log_activity(
        level='info',
        category='firewall',
        message='Firewall rule added: INPUT -> DROP',
        user='admin',
        ip_address='192.168.1.100',
        details='{"chain": "INPUT", "target": "DROP", "source": "192.168.1.0/24"}'
    )
    
    logging_manager.log_activity(
        level='info',
        category='firewall',
        message='Firewall rule deleted: ID 5',
        user='admin',
        ip_address='192.168.1.100'
    )
    
    # Sample routing logs
    logging_manager.log_activity(
        level='info',
        category='routing',
        message='Route added: 10.0.0.0/8 via 192.168.1.1',
        user='admin',
        ip_address='192.168.1.100',
        details='{"destination": "10.0.0.0/8", "gateway": "192.168.1.1", "interface": "ens18"}'
    )
    
    # Sample WireGuard logs
    logging_manager.log_activity(
        level='info',
        category='wireguard',
        message='WireGuard configuration started: wg0',
        user='admin',
        ip_address='192.168.1.100'
    )
    
    logging_manager.log_activity(
        level='info',
        category='wireguard',
        message='WireGuard configuration deleted: test-config',
        user='admin',
        ip_address='192.168.1.100'
    )
    
    # Sample system logs
    logging_manager.log_activity(
        level='info',
        category='system',
        message='System backup completed successfully',
        user='admin',
        ip_address='192.168.1.100'
    )
    
    logging_manager.log_activity(
        level='error',
        category='system',
        message='Disk space warning: /var/log is 85% full',
        user='system',
        ip_address='127.0.0.1'
    )
    
    print("✅ Sample logs added successfully!")
    
    # Get and display statistics
    print("\n📊 Logging Statistics:")
    stats = logging_manager.get_log_statistics()
    print(f"Total logs: {stats.get('total_logs', 0)}")
    print(f"Recent activity (24h): {stats.get('recent_activity', 0)}")
    print(f"Logs by level: {stats.get('by_level', {})}")
    print(f"Logs by category: {stats.get('by_category', {})}")
    
    # Get recent logs
    print("\n📋 Recent Logs:")
    logs = logging_manager.get_logs(limit=5)
    for log in logs:
        timestamp = log['timestamp']
        level = log['level'].upper()
        category = log['category']
        message = log['message']
        print(f"[{timestamp}] {level} {category}: {message}")
    
    print("\n🎉 Demo completed! You can now access the logging interface at:")
    print("   http://localhost:10081/#/logging")
    print("\nFeatures available:")
    print("  - View all activity logs with filtering")
    print("  - Export logs in JSON/CSV format")
    print("  - Clear logs by category or date range")
    print("  - View system logs (syslog, auth, kernel, etc.)")
    print("  - Real-time statistics and monitoring")

if __name__ == "__main__":
    demo_logging()

