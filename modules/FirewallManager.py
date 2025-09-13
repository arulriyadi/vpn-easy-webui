#!/usr/bin/env python3
"""
FirewallManager - Module for managing iptables firewall rules
Integrated with WGDashboard for comprehensive network management
"""

import subprocess
import json
import os
import re
from typing import List, Dict, Any, Optional
from datetime import datetime

class FirewallManager:
    def __init__(self):
        self.rules_file_ubuntu = "/etc/iptables/rules.v4"
        self.rules_file_centos = "/etc/sysconfig/iptables"
        self.log_file = "/var/log/wgdashboard-firewall.log"
        
    def log_message(self, message: str):
        """Log firewall operations"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"{timestamp} - {message}\n"
        try:
            with open(self.log_file, "a") as f:
                f.write(log_entry)
        except:
            pass  # Ignore logging errors
    
    def log_activity(self, level: str, message: str, user: str = None, ip_address: str = None, details: str = None):
        """Log activity to centralized logging system"""
        try:
            # Import here to avoid circular imports
            from modules.LoggingManager import LoggingManager
            LoggingManager().log_activity(
                level=level,
                category='firewall',
                message=message,
                user=user,
                ip_address=ip_address,
                details=details
            )
        except:
            pass  # Fallback to file logging if centralized logging fails
    
    def get_firewall_rules(self) -> List[Dict[str, Any]]:
        """Get current iptables rules"""
        try:
            # Get iptables rules
            result = subprocess.run(['iptables-save'], capture_output=True, text=True, check=True)
            rules = []
            
            for line in result.stdout.strip().split('\n'):
                if line.startswith('-A'):
                    # Parse rule
                    parts = line.split()
                    if len(parts) >= 2:
                        chain = parts[1]
                        rule_data = {
                            'id': len(rules) + 1,
                            'chain': chain,
                            'rule': line,
                            'raw': line
                        }
                        
                        # Parse common parameters
                        for i, part in enumerate(parts[2:], 2):
                            if part == '-s':
                                rule_data['source'] = parts[i + 1] if i + 1 < len(parts) else ''
                            elif part == '-d':
                                rule_data['destination'] = parts[i + 1] if i + 1 < len(parts) else ''
                            elif part == '-p':
                                rule_data['protocol'] = parts[i + 1] if i + 1 < len(parts) else ''
                            elif part == '--dport':
                                rule_data['port'] = parts[i + 1] if i + 1 < len(parts) else ''
                            elif part == '-j':
                                rule_data['target'] = parts[i + 1] if i + 1 < len(parts) else ''
                        
                        rules.append(rule_data)
            
            self.log_message(f"Retrieved {len(rules)} firewall rules")
            return rules
            
        except subprocess.CalledProcessError as e:
            self.log_message(f"Error getting firewall rules: {e}")
            return []
        except Exception as e:
            self.log_message(f"Unexpected error getting firewall rules: {e}")
            return []
    
    def add_firewall_rule(self, rule_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new firewall rule"""
        try:
            # Build iptables command
            cmd = ['iptables']
            
            # Add chain
            if 'chain' in rule_data:
                cmd.extend(['-A', rule_data['chain']])
            
            # Add source
            if 'source' in rule_data and rule_data['source']:
                cmd.extend(['-s', rule_data['source']])
            
            # Add destination
            if 'destination' in rule_data and rule_data['destination']:
                cmd.extend(['-d', rule_data['destination']])
            
            # Add protocol
            if 'protocol' in rule_data and rule_data['protocol']:
                cmd.extend(['-p', rule_data['protocol']])
            
            # Add port
            if 'port' in rule_data and rule_data['port']:
                cmd.extend(['--dport', rule_data['port']])
            
            # Add target
            if 'target' in rule_data and rule_data['target']:
                cmd.extend(['-j', rule_data['target']])
            
            # Execute command
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Save rules
            self.save_firewall_rules()
            
            self.log_message(f"Added firewall rule: {' '.join(cmd)}")
            return {
                'status': True,
                'message': 'Firewall rule added successfully',
                'rule': ' '.join(cmd)
            }
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Error adding firewall rule: {e.stderr}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
        except Exception as e:
            error_msg = f"Unexpected error adding firewall rule: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def delete_firewall_rule(self, rule_id: int) -> Dict[str, Any]:
        """Delete a firewall rule by ID"""
        try:
            rules = self.get_firewall_rules()
            if rule_id < 1 or rule_id > len(rules):
                return {
                    'status': False,
                    'message': 'Invalid rule ID'
                }
            
            rule = rules[rule_id - 1]
            rule_parts = rule['raw'].split()
            
            # Build delete command (replace -A with -D)
            delete_cmd = ['iptables'] + rule_parts[1:]  # Skip 'iptables-save' part
            delete_cmd[1] = '-D'  # Replace -A with -D
            
            # Execute delete command
            result = subprocess.run(delete_cmd, capture_output=True, text=True, check=True)
            
            # Save rules
            self.save_firewall_rules()
            
            self.log_message(f"Deleted firewall rule: {' '.join(delete_cmd)}")
            return {
                'status': True,
                'message': 'Firewall rule deleted successfully'
            }
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Error deleting firewall rule: {e.stderr}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
        except Exception as e:
            error_msg = f"Unexpected error deleting firewall rule: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def save_firewall_rules(self) -> bool:
        """Save current iptables rules to file"""
        try:
            # Determine which file to use based on system
            if os.path.exists('/etc/debian_version'):
                rules_file = self.rules_file_ubuntu
            else:
                rules_file = self.rules_file_centos
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(rules_file), exist_ok=True)
            
            # Save rules
            result = subprocess.run(['iptables-save'], capture_output=True, text=True, check=True)
            
            with open(rules_file, 'w') as f:
                f.write(result.stdout)
            
            self.log_message(f"Firewall rules saved to {rules_file}")
            return True
            
        except Exception as e:
            self.log_message(f"Error saving firewall rules: {e}")
            return False
    
    def reorder_firewall_rules(self, new_order: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Reorder firewall rules based on new order"""
        try:
            # Get current rules
            current_rules = self.get_firewall_rules()
            if not current_rules:
                return {
                    'status': False,
                    'message': 'No firewall rules found to reorder'
                }
            
            # Validate new order
            if len(new_order) != len(current_rules):
                return {
                    'status': False,
                    'message': f'Invalid order: expected {len(current_rules)} rules, got {len(new_order)}'
                }
            
            # Create temporary rules file with new order
            temp_file = '/tmp/iptables_reorder.rules'
            
            # Start with iptables-save header
            result = subprocess.run(['iptables-save'], capture_output=True, text=True, check=True)
            lines = result.stdout.strip().split('\n')
            
            # Find rules section
            rules_start = -1
            for i, line in enumerate(lines):
                if line.startswith('-A'):
                    rules_start = i
                    break
            
            if rules_start == -1:
                return {
                    'status': False,
                    'message': 'No rules found in current iptables configuration'
                }
            
            # Build new rules file
            new_rules_lines = []
            
            # Add header lines (before rules)
            for i in range(rules_start):
                new_rules_lines.append(lines[i])
            
            # Add rules in new order
            for rule_order in new_order:
                rule_id = rule_order.get('id')
                if 1 <= rule_id <= len(current_rules):
                    rule = current_rules[rule_id - 1]
                    new_rules_lines.append(rule['raw'])
            
            # Add commit line
            new_rules_lines.append('COMMIT')
            
            # Write temporary file
            with open(temp_file, 'w') as f:
                f.write('\n'.join(new_rules_lines) + '\n')
            
            # Clear existing rules
            subprocess.run(['iptables', '-F'], check=True)
            
            # Restore with new order
            with open(temp_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            # Save the new order
            self.save_firewall_rules()
            
            # Clean up
            os.remove(temp_file)
            
            self.log_message(f"Firewall rules reordered successfully")
            return {
                'status': True,
                'message': 'Firewall rules reordered successfully'
            }
            
        except Exception as e:
            error_msg = f"Error reordering firewall rules: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }

    def reload_firewall_rules(self) -> Dict[str, Any]:
        """Reload firewall rules from file"""
        try:
            # Determine which file to use
            if os.path.exists('/etc/debian_version'):
                rules_file = self.rules_file_ubuntu
            else:
                rules_file = self.rules_file_centos
            
            if not os.path.exists(rules_file):
                return {
                    'status': False,
                    'message': f'No rules file found at {rules_file}'
                }
            
            # Clear existing rules (but keep custom chains)
            subprocess.run(['iptables', '-F'], check=True)
            # Don't delete custom chains with -X as it might cause errors
            
            # Load rules
            with open(rules_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            self.log_message(f"Firewall rules reloaded from {rules_file}")
            return {
                'status': True,
                'message': 'Firewall rules reloaded successfully'
            }
            
        except Exception as e:
            error_msg = f"Error reloading firewall rules: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
