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
        """Get current iptables filter rules (INPUT, OUTPUT, FORWARD only)"""
        try:
            # Get iptables rules from filter table only
            result = subprocess.run(['iptables-save'], capture_output=True, text=True, check=True)
            rules = []
            current_table = 'filter'  # Default to filter table
            
            for line in result.stdout.strip().split('\n'):
                # Check for table declaration
                if line.startswith('*'):
                    current_table = line[1:]  # Remove the * prefix
                    continue
                
                # Only process rules from filter table
                if current_table == 'filter' and line.startswith('-A'):
                    # Parse rule
                    parts = line.split()
                    if len(parts) >= 2:
                        chain = parts[1]
                        
                        # Only include filter table chains (INPUT, OUTPUT, FORWARD)
                        if chain in ['INPUT', 'OUTPUT', 'FORWARD']:
                            rule_data = {
                                'id': len(rules) + 1,
                                'chain': chain,
                                'rule': line,
                                'raw': line,
                                'source': 'Any',
                                'destination': 'Any',
                                'protocol': 'Any',
                                'port': 'Any',
                                'target': 'ACCEPT'
                            }
                            
                            # Parse common parameters
                            for i, part in enumerate(parts[2:], 2):
                                if part == '-s' and i + 1 < len(parts):
                                    rule_data['source'] = parts[i + 1]
                                elif part == '-d' and i + 1 < len(parts):
                                    rule_data['destination'] = parts[i + 1]
                                elif part == '-p' and i + 1 < len(parts):
                                    rule_data['protocol'] = parts[i + 1]
                                elif part == '--dport' and i + 1 < len(parts):
                                    rule_data['port'] = parts[i + 1]
                                elif part == '--sport' and i + 1 < len(parts):
                                    rule_data['port'] = parts[i + 1]
                                elif part == '-j' and i + 1 < len(parts):
                                    rule_data['target'] = parts[i + 1]
                            
                            rules.append(rule_data)
            
            self.log_message(f"Retrieved {len(rules)} filter firewall rules")
            return rules
            
        except subprocess.CalledProcessError as e:
            self.log_message(f"Error getting firewall rules: {e}")
            return []
        except Exception as e:
            self.log_message(f"Unexpected error getting firewall rules: {e}")
            return []
    
    def add_firewall_rule(self, rule_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new firewall rule to filter table"""
        try:
            # Build iptables command for filter table
            cmd = ['iptables']
            
            # Add chain (only allow filter table chains)
            if 'chain' in rule_data and rule_data['chain'] in ['INPUT', 'OUTPUT', 'FORWARD']:
                cmd.extend(['-A', rule_data['chain']])
            else:
                return {
                    'status': False,
                    'message': 'Invalid chain. Only INPUT, OUTPUT, and FORWARD are allowed for filter rules.'
                }
            
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
            
            self.log_message(f"Added filter firewall rule: {' '.join(cmd)}")
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
        """Delete a firewall rule by ID from filter table"""
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
            
            self.log_message(f"Deleted filter firewall rule: {' '.join(delete_cmd)}")
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
        """Reorder firewall rules based on new order (filter table only)"""
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
            
            # Find filter table rules section
            rules_start = -1
            current_table = 'filter'
            for i, line in enumerate(lines):
                if line.startswith('*'):
                    current_table = line[1:]
                    continue
                if current_table == 'filter' and line.startswith('-A'):
                    rules_start = i
                    break
            
            if rules_start == -1:
                return {
                    'status': False,
                    'message': 'No filter rules found in current iptables configuration'
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
            
            # Clear existing rules (filter table only)
            subprocess.run(['iptables', '-F'], check=True)
            
            # Restore with new order
            with open(temp_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            # Save the new order
            self.save_firewall_rules()
            
            # Clean up
            os.remove(temp_file)
            
            self.log_message(f"Filter firewall rules reordered successfully")
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
        """Reload firewall rules from file (filter table only)"""
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
            
            # Clear existing rules (filter table only, but keep custom chains)
            subprocess.run(['iptables', '-F'], check=True)
            # Don't delete custom chains with -X as it might cause errors
            
            # Load rules
            with open(rules_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            self.log_message(f"Filter firewall rules reloaded from {rules_file}")
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
    
    # =============================================================================
    # NAT MANAGEMENT METHODS
    # =============================================================================
    
    def get_nat_rules(self) -> List[Dict[str, Any]]:
        """Get current NAT rules from iptables NAT table"""
        try:
            # Get NAT table rules using iptables-save for better parsing
            result = subprocess.run(['iptables-save', '-t', 'nat'], capture_output=True, text=True, check=True)
            rules = []
            
            for line in result.stdout.strip().split('\n'):
                if line.startswith('-A'):
                    # Parse rule
                    parts = line.split()
                    if len(parts) >= 2:
                        chain = parts[1]
                        
                        # Only include NAT table chains (PREROUTING, POSTROUTING, OUTPUT)
                        if chain in ['PREROUTING', 'POSTROUTING', 'OUTPUT']:
                            rule_data = {
                                'id': len(rules) + 1,
                                'chain': chain,
                                'rule': line,
                                'raw': line,
                                'source': 'Any',
                                'destination': 'Any',
                                'protocol': 'Any',
                                'port': 'Any',
                                'target': 'ACCEPT'
                            }
                            
                            # Parse common parameters
                            for i, part in enumerate(parts[2:], 2):
                                if part == '-s' and i + 1 < len(parts):
                                    rule_data['source'] = parts[i + 1]
                                elif part == '-d' and i + 1 < len(parts):
                                    rule_data['destination'] = parts[i + 1]
                                elif part == '-p' and i + 1 < len(parts):
                                    rule_data['protocol'] = parts[i + 1]
                                elif part == '--dport' and i + 1 < len(parts):
                                    rule_data['port'] = parts[i + 1]
                                elif part == '--sport' and i + 1 < len(parts):
                                    rule_data['port'] = parts[i + 1]
                                elif part == '-j' and i + 1 < len(parts):
                                    rule_data['target'] = parts[i + 1]
                            
                            rules.append(rule_data)
            
            self.log_message(f"Retrieved {len(rules)} NAT rules")
            return rules
            
        except Exception as e:
            self.log_message(f"Error getting NAT rules: {e}")
            return []
    
    def add_nat_rule(self, rule_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new NAT rule to NAT table"""
        try:
            chain = rule_data.get('chain', 'POSTROUTING')
            target = rule_data.get('target', 'MASQUERADE')
            source = rule_data.get('source', '')
            destination = rule_data.get('destination', '')
            protocol = rule_data.get('protocol', 'any')
            port = rule_data.get('port', '')
            
            # Validate chain (only allow NAT table chains)
            if chain not in ['PREROUTING', 'POSTROUTING', 'OUTPUT']:
                return {
                    'status': False,
                    'message': 'Invalid chain. Only PREROUTING, POSTROUTING, and OUTPUT are allowed for NAT rules.'
                }
            
            # Build iptables command for NAT table
            cmd = ['iptables', '-t', 'nat', '-A', chain]
            
            # Add source
            if source:
                cmd.extend(['-s', source])
            
            # Add destination
            if destination:
                cmd.extend(['-d', destination])
            
            # Add protocol
            if protocol and protocol != 'any':
                cmd.extend(['-p', protocol])
            
            # Add port
            if port:
                if ':' in port:
                    cmd.extend(['--dport', port])
                else:
                    cmd.extend(['--dport', port])
            
            # Add target and options
            cmd.append('-j')
            cmd.append(target)
            
            # Add target-specific options
            if target == 'SNAT' and rule_data.get('toSource'):
                cmd.extend(['--to-source', rule_data['toSource']])
            elif target == 'DNAT' and rule_data.get('toDestination'):
                cmd.extend(['--to-destination', rule_data['toDestination']])
            
            # Execute command
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Save rules
            self.save_firewall_rules()
            
            self.log_message(f"NAT rule added: {' '.join(cmd)}")
            return {
                'status': True,
                'message': 'NAT rule added successfully'
            }
            
        except Exception as e:
            error_msg = f"Error adding NAT rule: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def delete_nat_rule(self, rule_id: int) -> Dict[str, Any]:
        """Delete a NAT rule by ID from NAT table"""
        try:
            # Get current rules
            rules = self.get_nat_rules()
            if rule_id < 1 or rule_id > len(rules):
                return {
                    'status': False,
                    'message': f'Invalid rule ID: {rule_id}'
                }
            
            rule = rules[rule_id - 1]
            chain = rule['chain']
            
            # Build delete command for NAT table
            cmd = ['iptables', '-t', 'nat', '-D', chain, str(rule_id)]
            
            # Execute command
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            # Save rules
            self.save_firewall_rules()
            
            self.log_message(f"NAT rule deleted: {' '.join(cmd)}")
            return {
                'status': True,
                'message': 'NAT rule deleted successfully'
            }
            
        except Exception as e:
            error_msg = f"Error deleting NAT rule: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
    
    def reorder_nat_rules(self, new_order: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Reorder NAT rules based on new order (NAT table only)"""
        try:
            current_rules = self.get_nat_rules()
            if not current_rules:
                return {'status': False, 'message': 'No NAT rules found to reorder'}
            
            if len(new_order) != len(current_rules):
                return {'status': False, 'message': f'Invalid order: expected {len(current_rules)} rules, got {len(new_order)}'}
            
            # For NAT rules, we'll need to flush and recreate
            # This is a simplified implementation
            temp_file = '/tmp/iptables_nat_reorder.rules'
            result = subprocess.run(['iptables-save', '-t', 'nat'], capture_output=True, text=True, check=True)
            lines = result.stdout.strip().split('\n')
            
            # Filter and reorder NAT rules
            nat_rules_start = -1
            for i, line in enumerate(lines):
                if line.startswith('-A') and any(chain in line for chain in ['POSTROUTING', 'PREROUTING', 'OUTPUT']):
                    nat_rules_start = i
                    break
            
            if nat_rules_start == -1:
                return {'status': False, 'message': 'No NAT rules found in current configuration'}
            
            new_rules_lines = []
            for i in range(nat_rules_start):
                new_rules_lines.append(lines[i])
            
            for rule_order in new_order:
                rule_id = rule_order.get('id')
                if 1 <= rule_id <= len(current_rules):
                    rule = current_rules[rule_id - 1]
                    new_rules_lines.append(rule['raw'])
            
            new_rules_lines.append('COMMIT')
            
            with open(temp_file, 'w') as f:
                f.write('\n'.join(new_rules_lines) + '\n')
            
            # Apply new order (NAT table only)
            subprocess.run(['iptables', '-t', 'nat', '-F'], check=True)
            with open(temp_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            self.save_firewall_rules()
            os.remove(temp_file)
            
            self.log_message(f"NAT rules reordered successfully")
            return {'status': True, 'message': 'NAT rules reordered successfully'}
            
        except Exception as e:
            error_msg = f"Error reordering NAT rules: {e}"
            self.log_message(error_msg)
            return {'status': False, 'message': error_msg}
    
    def reload_nat_rules(self) -> Dict[str, Any]:
        """Reload NAT rules from file (NAT table only)"""
        try:
            # Determine rules file path
            if os.path.exists('/etc/debian_version'):
                rules_file = self.rules_file_ubuntu
            else:
                rules_file = self.rules_file_centos
            
            if not os.path.exists(rules_file):
                return {
                    'status': False,
                    'message': f'Rules file not found: {rules_file}'
                }
            
            # Flush NAT table
            subprocess.run(['iptables', '-t', 'nat', '-F'], check=True)
            
            # Load rules
            with open(rules_file, 'r') as f:
                subprocess.run(['iptables-restore'], stdin=f, check=True)
            
            self.log_message(f"NAT rules reloaded from {rules_file}")
            return {
                'status': True,
                'message': 'NAT rules reloaded successfully'
            }
            
        except Exception as e:
            error_msg = f"Error reloading NAT rules: {e}"
            self.log_message(error_msg)
            return {
                'status': False,
                'message': error_msg
            }
