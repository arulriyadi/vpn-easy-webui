"""
RBAC Manager Module for VPN Management System
Handles Role-Based Access Control for VPN users and firewall policies
"""

import sqlite3
import json
import subprocess
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

class RBACManager:
    def __init__(self, db_path: str = 'rbac.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database with RBAC schema"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Read and execute schema
            schema_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'rbac_schema.sql')
            if os.path.exists(schema_path):
                with open(schema_path, 'r') as f:
                    schema_sql = f.read()
                cursor.executescript(schema_sql)
            
            conn.commit()
            conn.close()
            print(f"[RBAC] Database initialized: {self.db_path}")
            
        except Exception as e:
            print(f"[RBAC] Error initializing database: {e}")
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    # ===== GROUP MANAGEMENT =====
    
    def get_all_groups(self) -> List[Dict[str, Any]]:
        """Get all RBAC groups"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT g.*, COUNT(gp.peer_name) as peer_count
                FROM rbac_groups g
                LEFT JOIN rbac_group_peers gp ON g.id = gp.group_id
                GROUP BY g.id
                ORDER BY g.name
            """)
            
            groups = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return groups
            
        except Exception as e:
            print(f"[RBAC] Error getting groups: {e}")
            return []
    
    def create_group(self, name: str, description: str = "", color: str = "#007bff") -> Dict[str, Any]:
        """Create new RBAC group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO rbac_groups (name, description, color)
                VALUES (?, ?, ?)
            """, (name, description, color))
            
            group_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            return {'status': True, 'message': f'Group "{name}" created successfully', 'id': group_id}
            
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Group "{name}" already exists'}
        except Exception as e:
            return {'status': False, 'message': f'Error creating group: {e}'}
    
    def update_group(self, group_id: int, name: str, description: str = "", color: str = "#007bff") -> Dict[str, Any]:
        """Update RBAC group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE rbac_groups 
                SET name = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (name, description, color, group_id))
            
            if cursor.rowcount > 0:
                conn.commit()
                conn.close()
                return {'status': True, 'message': f'Group "{name}" updated successfully'}
            else:
                conn.close()
                return {'status': False, 'message': 'Group not found'}
                
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Group "{name}" already exists'}
        except Exception as e:
            return {'status': False, 'message': f'Error updating group: {e}'}
    
    def delete_group(self, group_id: int) -> Dict[str, Any]:
        """Delete RBAC group and all associated data"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            # Get group name for message
            cursor.execute("SELECT name FROM rbac_groups WHERE id = ?", (group_id,))
            group = cursor.fetchone()
            if not group:
                conn.close()
                return {'status': False, 'message': 'Group not found'}
            
            group_name = group['name']
            
            # Delete group (cascading deletes will handle related records)
            cursor.execute("DELETE FROM rbac_groups WHERE id = ?", (group_id,))
            
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after deletion
            self.regenerate_all_rules()
            
            return {'status': True, 'message': f'Group "{group_name}" deleted successfully'}
            
        except Exception as e:
            return {'status': False, 'message': f'Error deleting group: {e}'}
    
    # ===== PEER MANAGEMENT =====
    
    def get_group_peers(self, group_id: int) -> List[Dict[str, Any]]:
        """Get peers assigned to a group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM rbac_group_peers 
                WHERE group_id = ?
                ORDER BY peer_name
            """, (group_id,))
            
            peers = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return peers
            
        except Exception as e:
            print(f"[RBAC] Error getting group peers: {e}")
            return []
    
    def assign_peer_to_group(self, group_id: int, peer_name: str, peer_ip: str = "") -> Dict[str, Any]:
        """Assign peer to group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO rbac_group_peers (group_id, peer_name, peer_ip)
                VALUES (?, ?, ?)
            """, (group_id, peer_name, peer_ip))
            
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after assignment
            self.regenerate_group_rules(group_id)
            
            return {'status': True, 'message': f'Peer "{peer_name}" assigned to group successfully'}
            
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Peer "{peer_name}" already assigned to this group'}
        except Exception as e:
            return {'status': False, 'message': f'Error assigning peer: {e}'}
    
    def remove_peer_from_group(self, group_id: int, peer_name: str) -> Dict[str, Any]:
        """Remove peer from group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                DELETE FROM rbac_group_peers 
                WHERE group_id = ? AND peer_name = ?
            """, (group_id, peer_name))
            
            if cursor.rowcount > 0:
                conn.commit()
                conn.close()
                
                # Regenerate firewall rules after removal
                self.regenerate_group_rules(group_id)
                
                return {'status': True, 'message': f'Peer "{peer_name}" removed from group successfully'}
            else:
                conn.close()
                return {'status': False, 'message': 'Peer not found in group'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error removing peer: {e}'}
    
    # ===== POLICY MANAGEMENT =====
    
    def get_group_filter_policies(self, group_id: int) -> List[Dict[str, Any]]:
        """Get filter policies for a group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM rbac_filter_policies 
                WHERE group_id = ? AND enabled = 1
                ORDER BY priority, id
            """, (group_id,))
            
            policies = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return policies
            
        except Exception as e:
            print(f"[RBAC] Error getting filter policies: {e}")
            return []
    
    def get_group_nat_policies(self, group_id: int) -> List[Dict[str, Any]]:
        """Get NAT policies for a group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM rbac_nat_policies 
                WHERE group_id = ? AND enabled = 1
                ORDER BY priority, id
            """, (group_id,))
            
            policies = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return policies
            
        except Exception as e:
            print(f"[RBAC] Error getting NAT policies: {e}")
            return []
    
    def add_filter_policy(self, group_id: int, destination: str, action: str, 
                         protocol: str = "any", port: str = "", priority: int = 100) -> Dict[str, Any]:
        """Add filter policy to group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO rbac_filter_policies 
                (group_id, destination, action, protocol, port, priority)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (group_id, destination, action, protocol, port, priority))
            
            policy_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after adding policy
            self.regenerate_group_rules(group_id)
            
            return {'status': True, 'message': 'Filter policy added successfully', 'id': policy_id}
            
        except Exception as e:
            return {'status': False, 'message': f'Error adding filter policy: {e}'}
    
    def add_nat_policy(self, group_id: int, destination: str, action: str,
                      translated_ip: str = "", translated_port: str = "", priority: int = 100) -> Dict[str, Any]:
        """Add NAT policy to group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO rbac_nat_policies 
                (group_id, destination, action, translated_ip, translated_port, priority)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (group_id, destination, action, translated_ip, translated_port, priority))
            
            policy_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after adding policy
            self.regenerate_group_rules(group_id)
            
            return {'status': True, 'message': 'NAT policy added successfully', 'id': policy_id}
            
        except Exception as e:
            return {'status': False, 'message': f'Error adding NAT policy: {e}'}
    
    def delete_filter_policy(self, policy_id: int) -> Dict[str, Any]:
        """Delete filter policy"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            # Get group_id before deletion
            cursor.execute("SELECT group_id FROM rbac_filter_policies WHERE id = ?", (policy_id,))
            policy = cursor.fetchone()
            if not policy:
                conn.close()
                return {'status': False, 'message': 'Policy not found'}
            
            group_id = policy['group_id']
            
            cursor.execute("DELETE FROM rbac_filter_policies WHERE id = ?", (policy_id,))
            
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after deletion
            self.regenerate_group_rules(group_id)
            
            return {'status': True, 'message': 'Filter policy deleted successfully'}
            
        except Exception as e:
            return {'status': False, 'message': f'Error deleting filter policy: {e}'}
    
    def delete_nat_policy(self, policy_id: int) -> Dict[str, Any]:
        """Delete NAT policy"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            # Get group_id before deletion
            cursor.execute("SELECT group_id FROM rbac_nat_policies WHERE id = ?", (policy_id,))
            policy = cursor.fetchone()
            if not policy:
                conn.close()
                return {'status': False, 'message': 'Policy not found'}
            
            group_id = policy['group_id']
            
            cursor.execute("DELETE FROM rbac_nat_policies WHERE id = ?", (policy_id,))
            
            conn.commit()
            conn.close()
            
            # Regenerate firewall rules after deletion
            self.regenerate_group_rules(group_id)
            
            return {'status': True, 'message': 'NAT policy deleted successfully'}
            
        except Exception as e:
            return {'status': False, 'message': f'Error deleting NAT policy: {e}'}
    
    # ===== FIREWALL RULE GENERATION =====
    
    def get_group_peer_ips(self, group_id: int) -> List[str]:
        """Get list of peer IPs for a group"""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT DISTINCT peer_ip FROM rbac_group_peers 
                WHERE group_id = ? AND peer_ip != '' AND peer_ip IS NOT NULL
            """, (group_id,))
            
            peer_ips = [row['peer_ip'] for row in cursor.fetchall()]
            conn.close()
            return peer_ips
            
        except Exception as e:
            print(f"[RBAC] Error getting group peer IPs: {e}")
            return []
    
    def generate_filter_rules(self, group_id: int) -> List[str]:
        """Generate iptables filter rules for a group"""
        try:
            peer_ips = self.get_group_peer_ips(group_id)
            if not peer_ips:
                return []
            
            policies = self.get_group_filter_policies(group_id)
            rules = []
            
            for policy in policies:
                for peer_ip in peer_ips:
                    rule_parts = ['iptables', '-A', 'FORWARD']
                    
                    # Source (peer IP)
                    if peer_ip:
                        rule_parts.extend(['-s', peer_ip])
                    
                    # Destination
                    rule_parts.extend(['-d', policy['destination']])
                    
                    # Protocol
                    if policy['protocol'] != 'any':
                        rule_parts.extend(['-p', policy['protocol']])
                    
                    # Port
                    if policy['port']:
                        rule_parts.extend(['--dport', policy['port']])
                    
                    # Action
                    rule_parts.extend(['-j', policy['action']])
                    
                    # Comment
                    rule_parts.extend(['-m', 'comment', '--comment', f'RBAC-{policy["group_id"]}-{policy["id"]}'])
                    
                    rules.append(' '.join(rule_parts))
            
            return rules
            
        except Exception as e:
            print(f"[RBAC] Error generating filter rules: {e}")
            return []
    
    def generate_nat_rules(self, group_id: int) -> List[str]:
        """Generate iptables NAT rules for a group"""
        try:
            peer_ips = self.get_group_peer_ips(group_id)
            if not peer_ips:
                return []
            
            policies = self.get_group_nat_policies(group_id)
            rules = []
            
            for policy in policies:
                for peer_ip in peer_ips:
                    rule_parts = ['iptables', '-t', 'nat', '-A', 'POSTROUTING']
                    
                    # Source (peer IP)
                    if peer_ip:
                        rule_parts.extend(['-s', peer_ip])
                    
                    # Destination
                    rule_parts.extend(['-d', policy['destination']])
                    
                    # Action
                    rule_parts.extend(['-j', policy['action']])
                    
                    # Translated IP/Port for SNAT/DNAT
                    if policy['action'] in ['SNAT', 'DNAT'] and policy['translated_ip']:
                        if policy['translated_port']:
                            rule_parts.extend(['--to-source', f"{policy['translated_ip']}:{policy['translated_port']}"])
                        else:
                            rule_parts.extend(['--to-source', policy['translated_ip']])
                    
                    # Comment
                    rule_parts.extend(['-m', 'comment', '--comment', f'RBAC-{policy["group_id"]}-{policy["id"]}'])
                    
                    rules.append(' '.join(rule_parts))
            
            return rules
            
        except Exception as e:
            print(f"[RBAC] Error generating NAT rules: {e}")
            return []
    
    def regenerate_group_rules(self, group_id: int):
        """Regenerate firewall rules for a specific group"""
        try:
            # Get group name
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM rbac_groups WHERE id = ?", (group_id,))
            group = cursor.fetchone()
            if not group:
                conn.close()
                return
            group_name = group['name']
            conn.close()
            
            # Remove existing RBAC rules for this group
            self.remove_rbac_rules_for_group(group_id)
            
            # Generate new rules
            filter_rules = self.generate_filter_rules(group_id)
            nat_rules = self.generate_nat_rules(group_id)
            
            # Apply new rules
            for rule in filter_rules + nat_rules:
                try:
                    subprocess.run(rule.split(), check=True)
                    print(f"[RBAC] Applied rule: {rule}")
                except subprocess.CalledProcessError as e:
                    print(f"[RBAC] Error applying rule '{rule}': {e}")
            
            print(f"[RBAC] Regenerated rules for group '{group_name}'")
            
        except Exception as e:
            print(f"[RBAC] Error regenerating group rules: {e}")
    
    def regenerate_all_rules(self):
        """Regenerate all RBAC firewall rules"""
        try:
            groups = self.get_all_groups()
            for group in groups:
                self.regenerate_group_rules(group['id'])
            print("[RBAC] Regenerated all RBAC rules")
        except Exception as e:
            print(f"[RBAC] Error regenerating all rules: {e}")
    
    def remove_rbac_rules_for_group(self, group_id: int):
        """Remove all RBAC rules for a specific group"""
        try:
            # Remove filter rules
            subprocess.run(['iptables', '-D', 'FORWARD', '-m', 'comment', '--comment', f'RBAC-{group_id}-*'], 
                         capture_output=True)
            
            # Remove NAT rules
            subprocess.run(['iptables', '-t', 'nat', '-D', 'POSTROUTING', '-m', 'comment', '--comment', f'RBAC-{group_id}-*'], 
                         capture_output=True)
            
            print(f"[RBAC] Removed existing rules for group {group_id}")
            
        except Exception as e:
            print(f"[RBAC] Error removing rules for group {group_id}: {e}")
    
    def get_available_peers(self) -> List[Dict[str, Any]]:
        """Get list of available WireGuard peers for assignment"""
        try:
            # This would integrate with WireGuardManager to get peer list
            # For now, return empty list - will be implemented later
            return []
        except Exception as e:
            print(f"[RBAC] Error getting available peers: {e}")
            return []
