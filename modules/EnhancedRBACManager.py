#!/usr/bin/env python3
"""
Enhanced RBAC Manager
Supports scalable User ↔ Group ↔ Organization ↔ Subnet/Policy model
"""

import sqlite3
import os
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple

class EnhancedRBACManager:
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'rbac.db')
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database connection and verify schema"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Verify required tables exist
                cursor.execute("""
                    SELECT name FROM sqlite_master 
                    WHERE type='table' AND name IN (
                        'rbac_groups', 'organizations', 'rbac_group_organizations',
                        'rbac_group_filter_policies_new', 'rbac_group_nat_policies_new',
                        'rbac_effective_access', 'rbac_effective_rules'
                    )
                """)
                tables = [row['name'] for row in cursor.fetchall()]
                
                if len(tables) < 7:
                    print(f"⚠️ Warning: Some RBAC tables missing. Found: {tables}")
                
                print(f"[EnhancedRBAC] Database initialized: {self.db_path}")
        except Exception as e:
            print(f"[EnhancedRBAC] Database initialization error: {e}")
    
    # ==================== ORGANIZATION MANAGEMENT ====================
    
    def get_all_organizations(self) -> Dict:
        """Get all organizations with subnet counts"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT o.*, 
                           COUNT(os.id) as subnet_count,
                           COUNT(DISTINCT go.group_id) as group_count
                    FROM organizations o
                    LEFT JOIN organization_subnets os ON o.id = os.organization_id
                    LEFT JOIN rbac_group_organizations go ON o.id = go.organization_id
                    GROUP BY o.id
                    ORDER BY o.name
                """)
                
                organizations = []
                for row in cursor.fetchall():
                    org = dict(row)
                    organizations.append(org)
                
                return {'status': True, 'data': organizations, 'message': 'Organizations retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organizations: {str(e)}', 'data': None}
    
    def create_organization(self, name: str, description: str = '', color: str = '#007bff') -> Dict:
        """Create new organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO organizations (name, description, color, default_filter_policy, default_nat_policy)
                    VALUES (?, ?, ?, 'allow', 'none')
                """, (name, description, color))
                
                org_id = cursor.lastrowid
                conn.commit()
                
                return {'status': True, 'data': {'id': org_id}, 'message': f'Organization "{name}" created successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Organization "{name}" already exists', 'data': None}
        except Exception as e:
            return {'status': False, 'message': f'Error creating organization: {str(e)}', 'data': None}
    
    # ==================== GROUP MANAGEMENT ====================
    
    def get_all_groups(self) -> Dict:
        """Get all groups with organization and peer counts"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT g.*,
                           COUNT(DISTINCT go.organization_id) as organization_count,
                           COUNT(DISTINCT gp.peer_name) as peer_count
                    FROM rbac_groups g
                    LEFT JOIN rbac_group_organizations go ON g.id = go.group_id
                    LEFT JOIN rbac_group_peers gp ON g.id = gp.group_id
                    GROUP BY g.id
                    ORDER BY g.name
                """)
                
                groups = []
                for row in cursor.fetchall():
                    group = dict(row)
                    groups.append(group)
                
                return {'status': True, 'data': groups, 'message': 'Groups retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching groups: {str(e)}', 'data': None}
    
    def get_group(self, group_id: int) -> Dict:
        """Get a specific RBAC group by ID"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT * FROM rbac_groups WHERE id = ?
                """, (group_id,))
                
                group = cursor.fetchone()
                
                if group:
                    return {'status': True, 'data': dict(group), 'message': 'Group retrieved successfully'}
                else:
                    return {'status': False, 'message': 'Group not found', 'data': None}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group: {str(e)}', 'data': None}
    
    def create_group(self, name: str, description: str = '', color: str = '#007bff') -> Dict:
        """Create new group"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rbac_groups (name, description, color, inherit_org_policies)
                    VALUES (?, ?, ?, 1)
                """, (name, description, color))
                
                group_id = cursor.lastrowid
                conn.commit()
                
                return {'status': True, 'data': {'id': group_id}, 'message': f'Group "{name}" created successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Group "{name}" already exists', 'data': None}
        except Exception as e:
            return {'status': False, 'message': f'Error creating group: {str(e)}', 'data': None}
    
    # ==================== GROUP ↔ ORGANIZATION RELATIONS ====================
    
    def attach_group_to_organization(self, group_id: int, organization_id: int) -> Dict:
        """Attach group to organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rbac_group_organizations (group_id, organization_id)
                    VALUES (?, ?)
                """, (group_id, organization_id))
                
                conn.commit()
                
                return {'status': True, 'message': 'Group attached to organization successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': 'Group is already attached to this organization'}
        except Exception as e:
            return {'status': False, 'message': f'Error attaching group to organization: {str(e)}'}
    
    def detach_group_from_organization(self, group_id: int, organization_id: int) -> Dict:
        """Detach group from organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    DELETE FROM rbac_group_organizations 
                    WHERE group_id = ? AND organization_id = ?
                """, (group_id, organization_id))
                
                # Also remove related policies
                cursor.execute("""
                    DELETE FROM rbac_group_filter_policies_new 
                    WHERE group_id = ? AND organization_id = ?
                """, (group_id, organization_id))
                
                cursor.execute("""
                    DELETE FROM rbac_group_nat_policies_new 
                    WHERE group_id = ? AND organization_id = ?
                """, (group_id, organization_id))
                
                conn.commit()
                
                return {'status': True, 'message': 'Group detached from organization successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error detaching group from organization: {str(e)}'}
    
    def get_group_organizations(self, group_id: int) -> Dict:
        """Get organizations attached to a group"""
        try:
            # Get attached organization IDs from rbac.db
            with sqlite3.connect(self.db_path) as rbac_conn:
                rbac_cursor = rbac_conn.cursor()
                rbac_cursor.execute("""
                    SELECT organization_id, attached_at
                    FROM rbac_group_organizations
                    WHERE group_id = ?
                    ORDER BY attached_at
                """, (group_id,))
                attached_orgs = rbac_cursor.fetchall()
            
            if not attached_orgs:
                return {'status': True, 'data': [], 'message': 'Group organizations retrieved successfully'}
            
            # Get organization details from organization.db
            org_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'organization.db')
            org_ids = [org[0] for org in attached_orgs]
            placeholders = ','.join(['?' for _ in org_ids])
            
            with sqlite3.connect(org_db_path) as org_conn:
                org_conn.row_factory = sqlite3.Row
                org_cursor = org_conn.cursor()
                org_cursor.execute(f"""
                    SELECT o.*, 
                           COUNT(os.id) as subnet_count,
                           COUNT(uo.user_id) as user_count
                    FROM organizations o
                    LEFT JOIN organization_subnets os ON o.id = os.organization_id
                    LEFT JOIN user_organizations uo ON o.id = uo.organization_id
                    WHERE o.id IN ({placeholders})
                    GROUP BY o.id
                    ORDER BY o.name
                """, org_ids)
                
                organizations = [dict(row) for row in org_cursor.fetchall()]
                
                # Add attached_at timestamp
                attached_dict = {org[0]: org[1] for org in attached_orgs}
                for org in organizations:
                    org['attached_at'] = attached_dict[org['id']]
                
                return {'status': True, 'data': organizations, 'message': 'Group organizations retrieved successfully'}                                                                                                 
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group organizations: {str(e)}', 'data': None}
    
    def update_group_vpn_assignment(self, group_id: int, vpn_data: Dict) -> Dict:
        """Update VPN assignment for a group"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    UPDATE rbac_groups 
                    SET vpn_enabled = ?, 
                        vpn_type = ?, 
                        vpn_server_name = ?, 
                        auto_route_subnets = ?, 
                        custom_routing_enabled = ?, 
                        firewall_rules_enabled = ?,
                        vpn_assignment_updated = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (
                    vpn_data.get('vpn_enabled', False),
                    vpn_data.get('vpn_type', 'wireguard'),
                    vpn_data.get('vpn_server_name'),
                    vpn_data.get('auto_route_subnets', True),
                    vpn_data.get('custom_routing_enabled', True),
                    vpn_data.get('firewall_rules_enabled', True),
                    group_id
                ))
                
                conn.commit()
                
                if cursor.rowcount > 0:
                    return {'status': True, 'message': 'Group VPN assignment updated successfully'}
                else:
                    return {'status': False, 'message': 'Group not found'}
                    
        except Exception as e:
            return {'status': False, 'message': f'Error updating group VPN assignment: {str(e)}'}
    
    def get_group_vpn_assignment(self, group_id: int) -> Dict:
        """Get VPN assignment for a group"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT vpn_enabled, vpn_type, vpn_server_name, 
                           auto_route_subnets, custom_routing_enabled, 
                           firewall_rules_enabled, vpn_assignment_updated
                    FROM rbac_groups 
                    WHERE id = ?
                """, (group_id,))
                
                result = cursor.fetchone()
                
                if result:
                    return {'status': True, 'data': dict(result), 'message': 'Group VPN assignment retrieved successfully'}
                else:
                    return {'status': False, 'message': 'Group not found', 'data': None}
                    
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group VPN assignment: {str(e)}', 'data': None}
    
    def get_group_vpn_subnets(self, group_id: int) -> Dict:
        """Get all subnets from attached organizations for VPN routing"""
        try:
            # Get attached organizations
            orgs_result = self.get_group_organizations(group_id)
            if not orgs_result['status']:
                return {'status': False, 'message': 'Error fetching group organizations', 'data': []}
            
            organizations = orgs_result['data']
            if not organizations:
                return {'status': True, 'data': [], 'message': 'No organizations attached to group'}
            
            # Get subnets from all attached organizations
            org_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'organization.db')
            org_ids = [org['id'] for org in organizations]
            placeholders = ','.join(['?' for _ in org_ids])
            
            with sqlite3.connect(org_db_path) as org_conn:
                org_conn.row_factory = sqlite3.Row
                org_cursor = org_conn.cursor()
                
                org_cursor.execute(f"""
                    SELECT os.*, o.name as organization_name, o.color as organization_color
                    FROM organization_subnets os
                    JOIN organizations o ON os.organization_id = o.id
                    WHERE os.organization_id IN ({placeholders})
                    ORDER BY o.name, os.is_primary DESC, os.subnet_cidr
                """, org_ids)
                
                subnets = [dict(row) for row in org_cursor.fetchall()]
                
                return {'status': True, 'data': subnets, 'message': f'Retrieved {len(subnets)} subnets from {len(organizations)} organizations'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group VPN subnets: {str(e)}', 'data': None}
    
    def get_groups_by_vpn_server(self, server_name: str) -> Dict:
        """Get all groups assigned to a specific VPN server"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT id, name, description, color, vpn_enabled, vpn_type, 
                           vpn_server_name, vpn_assignment_updated
                    FROM rbac_groups 
                    WHERE vpn_enabled = 1 AND vpn_server_name = ?
                    ORDER BY name
                """, (server_name,))
                
                groups = [dict(row) for row in cursor.fetchall()]
                
                return {'status': True, 'data': groups, 'message': f'Retrieved {len(groups)} groups for VPN server {server_name}'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching groups by VPN server: {str(e)}', 'data': None}
    
    def get_organization_groups(self, organization_id: int) -> Dict:
        """Get groups attached to an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT g.*, go.attached_at
                    FROM rbac_groups g
                    JOIN rbac_group_organizations go ON g.id = go.group_id
                    WHERE go.organization_id = ?
                    ORDER BY g.name
                """, (organization_id,))
                
                groups = [dict(row) for row in cursor.fetchall()]
                
                return {'status': True, 'data': groups, 'message': 'Organization groups retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organization groups: {str(e)}', 'data': None}
    
    # ==================== POLICY INHERITANCE ====================
    
    def get_effective_policies_for_group(self, group_id: int) -> Dict:
        """Get effective policies for a group (inherited + overridden)"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Get group's attached organizations
                cursor.execute("""
                    SELECT o.id, o.name, o.default_filter_policy, o.default_nat_policy
                    FROM organizations o
                    JOIN rbac_group_organizations go ON o.id = go.organization_id
                    WHERE go.group_id = ?
                """, (group_id,))
                
                organizations = cursor.fetchall()
                
                effective_policies = {
                    'filter_policies': [],
                    'nat_policies': [],
                    'organizations': [dict(org) for org in organizations]
                }
                
                # Get group-specific filter policies (overrides)
                cursor.execute("""
                    SELECT f.*, o.name as organization_name
                    FROM rbac_group_filter_policies_new f
                    LEFT JOIN organizations o ON f.organization_id = o.id
                    WHERE f.group_id = ?
                    ORDER BY f.priority DESC, f.created_at
                """, (group_id,))
                
                for policy in cursor.fetchall():
                    policy_dict = dict(policy)
                    policy_dict['source'] = 'group_override' if policy_dict['is_override'] else 'group_policy'
                    effective_policies['filter_policies'].append(policy_dict)
                
                # Get group-specific NAT policies (overrides)
                cursor.execute("""
                    SELECT n.*, o.name as organization_name
                    FROM rbac_group_nat_policies_new n
                    LEFT JOIN organizations o ON n.organization_id = o.id
                    WHERE n.group_id = ?
                    ORDER BY n.priority DESC, n.created_at
                """, (group_id,))
                
                for policy in cursor.fetchall():
                    policy_dict = dict(policy)
                    policy_dict['source'] = 'group_override' if policy_dict['is_override'] else 'group_policy'
                    effective_policies['nat_policies'].append(policy_dict)
                
                return {'status': True, 'data': effective_policies, 'message': 'Effective policies retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching effective policies: {str(e)}', 'data': None}
    
    def add_group_filter_policy(self, group_id: int, organization_id: int, destination: str, 
                               action: str, protocol: str = 'any', port: str = None, 
                               priority: int = 100, is_override: bool = False) -> Dict:
        """Add filter policy to group (can be organization-specific)"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rbac_group_filter_policies_new
                    (group_id, organization_id, destination, action, protocol, port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (group_id, organization_id, destination, action, protocol, port, priority, is_override, datetime.now().isoformat()))
                
                policy_id = cursor.lastrowid
                conn.commit()
                
                return {'status': True, 'data': {'id': policy_id}, 'message': 'Filter policy added successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error adding filter policy: {str(e)}', 'data': None}
    
    def add_group_nat_policy(self, group_id: int, organization_id: int, destination: str, 
                            action: str, translated_ip: str = None, translated_port: str = None, 
                            priority: int = 100, is_override: bool = False) -> Dict:
        """Add NAT policy to group (can be organization-specific)"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rbac_group_nat_policies_new
                    (group_id, organization_id, destination, action, translated_ip, translated_port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (group_id, organization_id, destination, action, translated_ip, translated_port, priority, is_override, datetime.now().isoformat()))
                
                policy_id = cursor.lastrowid
                conn.commit()
                
                return {'status': True, 'data': {'id': policy_id}, 'message': 'NAT policy added successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error adding NAT policy: {str(e)}', 'data': None}
    
    # ==================== EFFECTIVE ACCESS CALCULATION ====================
    
    def calculate_effective_access(self, peer_name: str) -> Dict:
        """Calculate effective access for a peer based on their group memberships"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Get peer's groups
                cursor.execute("""
                    SELECT g.id as group_id, g.name as group_name, g.inherit_org_policies
                    FROM rbac_groups g
                    JOIN rbac_group_peers gp ON g.id = gp.group_id
                    WHERE gp.peer_name = ?
                """, (peer_name,))
                
                peer_groups = cursor.fetchall()
                
                effective_access = {
                    'peer_name': peer_name,
                    'groups': [dict(group) for group in peer_groups],
                    'subnets': [],
                    'filter_rules': [],
                    'nat_rules': []
                }
                
                for group in peer_groups:
                    group_id = group['group_id']
                    group_name = group['group_name']
                    inherit_org_policies = group['inherit_org_policies']
                    
                    # Get organizations attached to this group
                    cursor.execute("""
                        SELECT o.id, o.name, o.default_filter_policy, o.default_nat_policy
                        FROM organizations o
                        JOIN rbac_group_organizations go ON o.id = go.organization_id
                        WHERE go.group_id = ?
                    """, (group_id,))
                    
                    organizations = cursor.fetchall()
                    
                    for org in organizations:
                        org_id = org['id']
                        org_name = org['name']
                        
                        # Get organization subnets
                        cursor.execute("""
                            SELECT subnet_cidr, description, is_primary
                            FROM organization_subnets
                            WHERE organization_id = ? AND routing_enabled = 1
                        """, (org_id,))
                        
                        subnets = cursor.fetchall()
                        
                        for subnet in subnets:
                            subnet_info = {
                                'subnet_cidr': subnet['subnet_cidr'],
                                'description': subnet['description'],
                                'is_primary': subnet['is_primary'],
                                'organization_name': org_name,
                                'group_name': group_name,
                                'source': 'org_subnet'
                            }
                            effective_access['subnets'].append(subnet_info)
                        
                        # Get group-specific policies for this organization
                        if inherit_org_policies:
                            # Add organization default policies
                            if org['default_filter_policy'] != 'none':
                                rule = {
                                    'type': 'filter',
                                    'action': org['default_filter_policy'],
                                    'destination': f"{org_name}_default",
                                    'organization_name': org_name,
                                    'group_name': group_name,
                                    'source': 'org_default',
                                    'priority': 50
                                }
                                effective_access['filter_rules'].append(rule)
                        
                        # Get group override policies
                        cursor.execute("""
                            SELECT destination, action, protocol, port, priority, is_override
                            FROM rbac_group_filter_policies_new
                            WHERE group_id = ? AND organization_id = ?
                        """, (group_id, org_id))
                        
                        for policy in cursor.fetchall():
                            rule = {
                                'type': 'filter',
                                'action': policy['action'],
                                'destination': policy['destination'],
                                'protocol': policy['protocol'],
                                'port': policy['port'],
                                'organization_name': org_name,
                                'group_name': group_name,
                                'source': 'group_override' if policy['is_override'] else 'group_policy',
                                'priority': policy['priority']
                            }
                            effective_access['filter_rules'].append(rule)
                        
                        # Get NAT policies
                        cursor.execute("""
                            SELECT destination, action, translated_ip, translated_port, priority, is_override
                            FROM rbac_group_nat_policies_new
                            WHERE group_id = ? AND organization_id = ?
                        """, (group_id, org_id))
                        
                        for policy in cursor.fetchall():
                            rule = {
                                'type': 'nat',
                                'action': policy['action'],
                                'destination': policy['destination'],
                                'translated_ip': policy['translated_ip'],
                                'translated_port': policy['translated_port'],
                                'organization_name': org_name,
                                'group_name': group_name,
                                'source': 'group_override' if policy['is_override'] else 'group_policy',
                                'priority': policy['priority']
                            }
                            effective_access['nat_rules'].append(rule)
                
                # Remove duplicates and sort by priority
                effective_access['subnets'] = list({v['subnet_cidr']: v for v in effective_access['subnets']}.values())
                effective_access['filter_rules'].sort(key=lambda x: x['priority'], reverse=True)
                effective_access['nat_rules'].sort(key=lambda x: x['priority'], reverse=True)
                
                return {'status': True, 'data': effective_access, 'message': 'Effective access calculated successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error calculating effective access: {str(e)}', 'data': None}
    
    def save_effective_access(self, peer_name: str, effective_access: Dict) -> Dict:
        """Save calculated effective access to database for caching"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Clear existing effective access for this peer
                cursor.execute("DELETE FROM rbac_effective_access WHERE peer_name = ?", (peer_name,))
                cursor.execute("DELETE FROM rbac_effective_rules WHERE peer_name = ?", (peer_name,))
                
                # Save effective access
                for subnet in effective_access['subnets']:
                    cursor.execute("""
                        INSERT INTO rbac_effective_access
                        (peer_name, group_id, organization_id, subnet_cidr, filter_action, nat_action, last_updated)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        peer_name, 
                        subnet.get('group_id', 0),
                        subnet.get('organization_id', 0),
                        subnet['subnet_cidr'],
                        'allow',  # Default filter action
                        'none',   # Default NAT action
                        datetime.now().isoformat()
                    ))
                
                # Save effective rules
                for rule in effective_access['filter_rules'] + effective_access['nat_rules']:
                    cursor.execute("""
                        INSERT INTO rbac_effective_rules
                        (peer_name, group_id, organization_id, rule_type, rule_content, source, generated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        peer_name,
                        rule.get('group_id', 0),
                        rule.get('organization_id', 0),
                        rule['type'],
                        json.dumps(rule),
                        rule['source'],
                        datetime.now().isoformat()
                    ))
                
                conn.commit()
                
                return {'status': True, 'message': 'Effective access saved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error saving effective access: {str(e)}'}
    
    # ==================== UTILITY METHODS ====================
    
    def get_available_organizations_for_group(self, group_id: int) -> Dict:
        """Get organizations not yet attached to a group"""
        try:
            # Get all organizations from organization.db
            org_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'organization.db')
            
            with sqlite3.connect(org_db_path) as org_conn:
                org_conn.row_factory = sqlite3.Row
                org_cursor = org_conn.cursor()
                org_cursor.execute("SELECT * FROM organizations ORDER BY name")
                all_organizations = [dict(row) for row in org_cursor.fetchall()]
            
            # Get attached organizations from rbac.db
            with sqlite3.connect(self.db_path) as rbac_conn:
                rbac_cursor = rbac_conn.cursor()
                rbac_cursor.execute("""
                    SELECT organization_id 
                    FROM rbac_group_organizations 
                    WHERE group_id = ?
                """, (group_id,))
                attached_org_ids = [row[0] for row in rbac_cursor.fetchall()]
            
            # Filter out attached organizations
            available_organizations = [
                org for org in all_organizations 
                if org['id'] not in attached_org_ids
            ]
            
            return {'status': True, 'data': available_organizations, 'message': 'Available organizations retrieved successfully'}                                                                                             
        except Exception as e:
            return {'status': False, 'message': f'Error fetching available organizations: {str(e)}', 'data': None}
    
    def get_available_groups_for_organization(self, organization_id: int) -> Dict:
        """Get groups not yet attached to an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT g.*
                    FROM rbac_groups g
                    WHERE g.id NOT IN (
                        SELECT group_id 
                        FROM rbac_group_organizations 
                        WHERE organization_id = ?
                    )
                    ORDER BY g.name
                """, (organization_id,))
                
                groups = [dict(row) for row in cursor.fetchall()]
                
                return {'status': True, 'data': groups, 'message': 'Available groups retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching available groups: {str(e)}', 'data': None}

    # ==================== USER GROUP ASSIGNMENT ====================
    
    def assign_user_to_group(self, user_id: int, group_id: int, manual_ip: str = None) -> Dict:
        """Assign user to RBAC group and auto-generate VPN peer"""
        try:
            # 1. Validate group has VPN enabled
            group = self.get_group(group_id)
            if not group['status']:
                return {'status': False, 'message': 'Group not found'}
            
            group_data = group['data']
            if not group_data.get('vpn_enabled'):
                return {'status': False, 'message': 'Group VPN not enabled'}
            
            # 2. Assign user to group in users.db
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                
                # Check if user already assigned to this group
                cursor.execute("""
                    SELECT id FROM user_groups 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                
                if cursor.fetchone():
                    return {'status': False, 'message': 'User already assigned to this group'}
                
                # Insert user group assignment
                cursor.execute("""
                    INSERT INTO user_groups (user_id, group_id, assigned_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                """, (user_id, group_id))
                conn.commit()
            
            # 3. Auto-generate VPN peer
            peer_result = self.generate_vpn_peer_for_user(user_id, group_id, manual_ip)
            
            if peer_result['status']:
                # Update user_groups with peer info
                with sqlite3.connect(users_db_path) as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        UPDATE user_groups 
                        SET vpn_peer_generated = 1, 
                            peer_ip = ?, 
                            peer_status = 'active'
                        WHERE user_id = ? AND group_id = ?
                    """, (peer_result['peer_ip'], user_id, group_id))
                    conn.commit()
                
                return {'status': True, 'message': 'User assigned and VPN peer generated successfully', 'peer': peer_result}
            else:
                return {'status': False, 'message': f'User assigned but VPN peer generation failed: {peer_result["message"]}'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error assigning user to group: {str(e)}'}
    
    def remove_user_from_group(self, user_id: int, group_id: int) -> Dict:
        """Remove user from group and cleanup VPN peer"""
        try:
            # 1. Remove VPN peer from WireGuard config
            vpn_result = self.remove_vpn_peer_for_user(user_id, group_id)
            
            # 2. Remove from user_groups table
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    DELETE FROM user_groups 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                
                deleted_count = cursor.rowcount
                conn.commit()
            
            # 3. Remove from user_vpn_peers table
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    DELETE FROM user_vpn_peers 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                conn.commit()
            
            # 4. Remove from rbac_group_peers table
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    DELETE FROM rbac_group_peers 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                conn.commit()
            
            return {'status': True, 'message': f'User removed from group successfully. VPN peer cleanup: {vpn_result.get("message", "Unknown")}'}
            
        except Exception as e:
            return {'status': False, 'message': f'Error removing user from group: {str(e)}'}
    
    def update_existing_peer_endpoint_allowed_ips(self, user_id: int, group_id: int) -> Dict:
        """Update existing peer's endpoint_allowed_ip to use organization subnets"""
        try:
            # Get user info
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
                user = cursor.fetchone()
                
                if not user:
                    return {'status': False, 'message': 'User not found'}
            
            # Get organization subnets for the group
            subnets = self.get_group_vpn_subnets(group_id)
            if subnets['status'] and subnets['data']:
                allowed_ips = [subnet['subnet_cidr'] for subnet in subnets['data']]
                endpoint_allowed_ips = ",".join(allowed_ips)
            else:
                endpoint_allowed_ips = "0.0.0.0/0"
            
            # Get peer info
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT * FROM user_vpn_peers 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                peer_info = cursor.fetchone()
                
                if not peer_info:
                    return {'status': False, 'message': 'VPN peer not found'}
            
            # Update WireGuard configuration
            try:
                import sys
                sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
                from dashboard import WireguardConfigurations
                
                vpn_server = peer_info['vpn_server_name']
                if vpn_server in WireguardConfigurations:
                    config = WireguardConfigurations[vpn_server]
                    
                    # Check if peer exists
                    peer_exists, peer = config.searchPeer(peer_info['public_key'])
                    if peer_exists:
                        # Update peer's endpoint_allowed_ip
                        peer.updatePeer(
                            name=user['username'],
                            private_key="",  # Don't change private key
                            preshared_key="",  # Don't change preshared key
                            dns_addresses="",  # Don't change DNS
                            allowed_ip=f"{peer_info['peer_ip']}/32",  # Keep user's IP
                            endpoint_allowed_ip=endpoint_allowed_ips,  # Update to organization subnets
                            mtu=0,  # Don't change MTU
                            keepalive=0  # Don't change keepalive
                        )
                        
                        return {
                            'status': True,
                            'message': f'Updated endpoint_allowed_ip to: {endpoint_allowed_ips}',
                            'endpoint_allowed_ips': endpoint_allowed_ips
                        }
                    else:
                        return {'status': False, 'message': 'Peer not found in WireGuard configuration'}
                else:
                    return {'status': False, 'message': f'WireGuard configuration {vpn_server} not found'}
                    
            except Exception as wg_error:
                return {'status': False, 'message': f'Error updating WireGuard peer: {str(wg_error)}'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error updating peer endpoint_allowed_ip: {str(e)}'}

    def delete_group(self, group_id: int) -> Dict:
        """Delete RBAC group and cleanup related data"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if group exists
                cursor.execute("SELECT name FROM rbac_groups WHERE id = ?", (group_id,))
                group = cursor.fetchone()
                
                if not group:
                    return {'status': False, 'message': 'Group not found'}
                
                group_name = group[0]
                
                # Prevent deletion of Admin group
                if group_name.lower() == 'admin':
                    return {'status': False, 'message': 'Cannot delete Admin group'}
                
                # Check if group has assigned peers
                cursor.execute("SELECT COUNT(*) FROM rbac_group_peers WHERE group_id = ?", (group_id,))
                peer_count = cursor.fetchone()[0]
                
                if peer_count > 0:
                    return {'status': False, 'message': f'Cannot delete group with {peer_count} assigned peers. Remove peers first.'}
                
                # Cleanup related data
                cursor.execute("DELETE FROM rbac_group_organizations WHERE group_id = ?", (group_id,))
                cursor.execute("DELETE FROM rbac_group_filter_policies WHERE group_id = ?", (group_id,))
                cursor.execute("DELETE FROM rbac_group_nat_policies WHERE group_id = ?", (group_id,))
                cursor.execute("DELETE FROM rbac_group_peers WHERE group_id = ?", (group_id,))
                cursor.execute("DELETE FROM rbac_effective_access WHERE group_id = ?", (group_id,))
                cursor.execute("DELETE FROM rbac_effective_rules WHERE group_id = ?", (group_id,))
                
                # Delete the group
                cursor.execute("DELETE FROM rbac_groups WHERE id = ?", (group_id,))
                
                conn.commit()
                
                return {'status': True, 'message': f'Group "{group_name}" deleted successfully'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error deleting group: {str(e)}'}

    def get_default_group_for_role(self, role: str) -> Dict:
        """Get default group for user role"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Map roles to default groups
                role_group_mapping = {
                    'admin': 'Admin',
                    'user': 'Engineer',
                    'guest': 'Guest'
                }
                
                default_group_name = role_group_mapping.get(role, 'Engineer')
                
                cursor.execute("""
                    SELECT * FROM rbac_groups 
                    WHERE name = ? AND vpn_enabled = 1
                    ORDER BY id
                    LIMIT 1
                """, (default_group_name,))
                
                group = cursor.fetchone()
                if group:
                    return {'status': True, 'data': dict(group)}
                else:
                    # Fallback to first VPN-enabled group
                    cursor.execute("""
                        SELECT * FROM rbac_groups 
                        WHERE vpn_enabled = 1
                        ORDER BY id
                        LIMIT 1
                    """)
                    fallback_group = cursor.fetchone()
                    if fallback_group:
                        return {'status': True, 'data': dict(fallback_group)}
                    else:
                        return {'status': False, 'message': 'No VPN-enabled groups found'}
                        
        except Exception as e:
            return {'status': False, 'message': f'Error getting default group: {str(e)}'}

    def get_user_groups(self, user_id: int) -> Dict:
        """Get all groups user belongs to with VPN peer status"""
        try:
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            
            # Get user groups from users.db
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT * FROM user_groups 
                    WHERE user_id = ?
                    ORDER BY assigned_at DESC
                """, (user_id,))
                
                user_groups = [dict(row) for row in cursor.fetchall()]
            
            # Get group details from rbac.db
            groups_with_details = []
            for ug in user_groups:
                group_result = self.get_group(ug['group_id'])
                if group_result['status']:
                    group_data = group_result['data']
                    ug['group_name'] = group_data['name']
                    ug['description'] = group_data['description']
                    ug['color'] = group_data['color']
                    ug['vpn_enabled'] = group_data['vpn_enabled']
                    ug['vpn_type'] = group_data['vpn_type']
                    ug['vpn_server_name'] = group_data['vpn_server_name']
                    groups_with_details.append(ug)
            
            return {'status': True, 'data': groups_with_details, 'message': f'Retrieved {len(groups_with_details)} groups for user'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching user groups: {str(e)}', 'data': []}
    
    def get_group_users(self, group_id: int) -> Dict:
        """Get all users in group with their VPN peer status"""
        try:
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            
            # Get user groups from users.db
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT ug.*, u.username, u.email, u.full_name
                    FROM user_groups ug
                    JOIN users u ON ug.user_id = u.id
                    WHERE ug.group_id = ?
                    ORDER BY ug.assigned_at DESC
                """, (group_id,))
                
                users = [dict(row) for row in cursor.fetchall()]
                
                return {'status': True, 'data': users, 'message': f'Retrieved {len(users)} users in group'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group users: {str(e)}', 'data': []}
    
    # ==================== VPN PEER GENERATION ====================
    
    def generate_vpn_peer_for_user(self, user_id: int, group_id: int, manual_ip: str = None) -> Dict:
        """Generate WireGuard peer for user"""
        try:
            # 1. Get user info
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
                user = cursor.fetchone()
                
                if not user:
                    return {'status': False, 'message': 'User not found'}
                
                user = dict(user)
            
            # 2. Get group VPN config
            group = self.get_group(group_id)
            if not group['status']:
                return {'status': False, 'message': 'Group not found'}
            
            group_data = group['data']
            vpn_server = group_data.get('vpn_server_name')
            if not vpn_server:
                return {'status': False, 'message': 'Group VPN server not configured'}
            
            # 3. Generate WireGuard keys (simplified - in real implementation, use wg genkey)
            import secrets
            import base64
            
            # Generate random keys (in production, use proper WireGuard key generation)
            private_key = base64.b64encode(secrets.token_bytes(32)).decode('utf-8')
            public_key = base64.b64encode(secrets.token_bytes(32)).decode('utf-8')
            
            # 4. Assign IP from manual input or WireGuard subnet pool
            if manual_ip:
                # Validate manual IP format
                import re
                ip_pattern = r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'
                if not re.match(ip_pattern, manual_ip):
                    return {'status': False, 'message': 'Invalid IP address format'}
                
                # Validate IP range (basic check)
                ip_parts = manual_ip.split('.')
                if not all(0 <= int(part) <= 255 for part in ip_parts):
                    return {'status': False, 'message': 'Invalid IP address range'}
                
                peer_ip = manual_ip
            else:
                # Auto-generate IP from WireGuard subnet pool
                import sys
                sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
                from dashboard import WireguardConfigurations
                
                if vpn_server in WireguardConfigurations:
                    config = WireguardConfigurations[vpn_server]
                    # Get WireGuard interface address (e.g., "10.110.56.1/24")
                    wg_address = getattr(config, 'Address', '10.110.56.1/24')
                    
                    # Extract subnet from address (e.g., "10.110.56" from "10.110.56.1/24")
                    subnet_base = '.'.join(wg_address.split('/')[0].split('.')[:-1])
                    
                    # Generate IP from the correct subnet pool
                    # Start from .2 (since .1 is usually the gateway)
                    ip_host = (user_id % 253) + 2  # 2-254 range
                    peer_ip = f"{subnet_base}.{ip_host}"
                else:
                    # Fallback to default subnet if config not found
                    peer_ip = f"10.110.56.{user_id % 253 + 2}"
            
            # 5. Get organization subnets for routes
            subnets = self.get_group_vpn_subnets(group_id)
            if subnets['status'] and subnets['data']:
                allowed_ips = [subnet['subnet_cidr'] for subnet in subnets['data']]
            else:
                allowed_ips = ['0.0.0.0/0']  # Default route
            
            # 6. Save to user_vpn_peers table
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO user_vpn_peers 
                    (user_id, group_id, vpn_server_name, peer_ip, public_key, private_key, config_generated)
                    VALUES (?, ?, ?, ?, ?, ?, 1)
                """, (user_id, group_id, vpn_server, peer_ip, public_key, private_key))
                conn.commit()
            
            # 7. Save to rbac_group_peers table
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO rbac_group_peers 
                    (group_id, peer_name, peer_ip, peer_type, user_id)
                    VALUES (?, ?, ?, 'user', ?)
                """, (group_id, user['username'], peer_ip, user_id))
                conn.commit()
            
            # 8. Add peer to WireGuard configuration
            try:
                # Import WireGuard configuration manager
                import sys
                sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
                from dashboard import WireguardConfigurations
                
                # Get WireGuard configuration
                if vpn_server in WireguardConfigurations:
                    config = WireguardConfigurations[vpn_server]
                    
                    # Check if peer already exists
                    if config.searchPeer(public_key)[0]:
                        return {'status': False, 'message': f'Peer with public key {public_key} already exists in {vpn_server}'}
                    
                    # Add peer to WireGuard configuration
                    # allowed_ip = IP yang diberikan ke user (bukan subnet organization)
                    peer_allowed_ip = f"{peer_ip}/32"
                    
                    # endpoint_allowed_ip = subnet dari organisasi yang ter-attach ke group
                    endpoint_allowed_ips = ",".join(allowed_ips) if allowed_ips else "0.0.0.0/0"
                    
                    peer_data = {
                        "name": user['username'],
                        "id": public_key,
                        "private_key": private_key,
                        "allowed_ip": peer_allowed_ip,  # IP user, bukan subnet organization
                        "endpoint_allowed_ip": endpoint_allowed_ips,  # Subnet organisasi
                        "DNS": "",
                        "mtu": "",
                        "keepalive": "",
                        "preshared_key": ""
                    }
                    
                    status, result = config.addPeers([peer_data])
                    if not status:
                        return {'status': False, 'message': f'Failed to add peer to WireGuard: {result.get("message", "Unknown error")}'}
                    
                    # Configure push routes for organization subnets
                    if allowed_ips:  # Subnet dari organization
                        self._configure_push_routes(config, allowed_ips, peer_ip)
                    
                else:
                    return {'status': False, 'message': f'WireGuard configuration {vpn_server} not found'}
                    
            except Exception as wg_error:
                return {'status': False, 'message': f'Error adding peer to WireGuard: {str(wg_error)}'}
            
            return {
                'status': True,
                'peer_ip': peer_ip,
                'public_key': public_key,
                'private_key': private_key,
                'allowed_ips': allowed_ips,  # Subnet organization untuk push routes
                'vpn_server': vpn_server,
                'config_generated': True
            }
            
        except Exception as e:
            return {'status': False, 'message': f'Error generating VPN peer: {str(e)}'}
    
    def remove_vpn_peer_for_user(self, user_id: int, group_id: int) -> Dict:
        """Remove VPN peer configuration for user"""
        try:
            # Get peer info before deletion
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT * FROM user_vpn_peers 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                peer = cursor.fetchone()
                
                if not peer:
                    return {'status': True, 'message': 'No VPN peer found to remove'}
                
                peer = dict(peer)
            
            # Remove peer from WireGuard configuration
            try:
                # Import WireGuard configuration manager
                import sys
                sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
                from dashboard import WireguardConfigurations
                
                vpn_server = peer["vpn_server_name"]
                public_key = peer["public_key"]
                
                # Get WireGuard configuration
                if vpn_server in WireguardConfigurations:
                    config = WireguardConfigurations[vpn_server]
                    
                    # Check if peer exists
                    if config.searchPeer(public_key)[0]:
                        # Get peer IP for route cleanup
                        peer_ip = peer["peer_ip"]
                        
                        # Get organization subnets for this group to clean up routes
                        vpn_subnets_result = self.get_group_vpn_subnets(group_id)
                        if vpn_subnets_result['status']:
                            organization_subnets = [subnet['subnet_cidr'] for subnet in vpn_subnets_result['data']]
                            
                            # Remove push routes for organization subnets
                            if organization_subnets:
                                self._remove_push_routes(config, organization_subnets, peer_ip)
                        
                        # Remove peer from WireGuard configuration
                        result = config.deletePeers([public_key])
                        status = result.status
                        message = result.message
                        if not status:
                            return {'status': False, 'message': f'Failed to remove peer from WireGuard: {message}'}
                    
                else:
                    return {'status': False, 'message': f'WireGuard configuration {vpn_server} not found'}
                    
            except Exception as wg_error:
                return {'status': False, 'message': f'Error removing peer from WireGuard: {str(wg_error)}'}
            
            # Clean up database records
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    DELETE FROM user_vpn_peers 
                    WHERE user_id = ? AND group_id = ?
                """, (user_id, group_id))
                conn.commit()
            
            # Remove from rbac_group_peers
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    DELETE FROM rbac_group_peers 
                    WHERE user_id = ? AND group_id = ? AND peer_type = 'user'
                """, (user_id, group_id))
                conn.commit()
            
            return {'status': True, 'message': f'VPN peer removed from {peer["vpn_server_name"]}'}
            
        except Exception as e:
            return {'status': False, 'message': f'Error removing VPN peer: {str(e)}'}
    
    def get_user_vpn_peers(self, user_id: int) -> Dict:
        """Get all VPN peers for a user"""
        try:
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            
            # Get VPN peers from users.db
            with sqlite3.connect(users_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT * FROM user_vpn_peers 
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                """, (user_id,))
                
                peers = [dict(row) for row in cursor.fetchall()]
            
            # Get group details from rbac.db
            peers_with_details = []
            for peer in peers:
                group_result = self.get_group(peer['group_id'])
                if group_result['status']:
                    group_data = group_result['data']
                    peer['group_name'] = group_data['name']
                    peer['group_color'] = group_data['color']
                    peers_with_details.append(peer)
            
            return {'status': True, 'data': peers_with_details, 'message': f'Retrieved {len(peers_with_details)} VPN peers for user'}
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching user VPN peers: {str(e)}', 'data': []}
    
    def get_group_peers_summary(self, group_id: int) -> Dict:
        """Get VPN peers summary for a group"""
        try:
            users_db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'users.db')
            with sqlite3.connect(users_db_path) as conn:
                cursor = conn.cursor()
                
                # Get total peers count
                cursor.execute("""
                    SELECT COUNT(*) as total FROM user_groups WHERE group_id = ?
                """, (group_id,))
                total = cursor.fetchone()[0]
                
                # Get active peers count
                cursor.execute("""
                    SELECT COUNT(*) as active FROM user_groups 
                    WHERE group_id = ? AND vpn_peer_generated = 1
                """, (group_id,))
                active = cursor.fetchone()[0]
                
                # Get pending peers count
                pending = total - active
                
                return {
                    'status': True,
                    'data': {
                        'total': total,
                        'active': active,
                        'pending': pending
                    },
                    'message': f'Group has {total} total users, {active} with VPN peers'
                }
                
        except Exception as e:
            return {'status': False, 'message': f'Error fetching group peers summary: {str(e)}', 'data': None}
    
    def _configure_push_routes(self, config, organization_subnets: List[str], peer_ip: str) -> bool:
        """
        Configure push routes for organization subnets to be accessible by VPN peer
        
        Args:
            config: WireGuard configuration object
            organization_subnets: List of subnet strings (e.g., ['10.0.0.0/24', '192.168.1.0/24'])
            peer_ip: IP address of the VPN peer
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Get current PostUp configuration
            current_postup = getattr(config, 'PostUp', '')
            
            # Generate push route commands
            push_routes = []
            for subnet in organization_subnets:
                # Format: ip route add <subnet> via <peer_ip>
                route_cmd = f"ip route add {subnet} via {peer_ip}"
                push_routes.append(route_cmd)
            
            # Add push routes to PostUp if not already present
            if push_routes:
                new_postup_commands = []
                for route in push_routes:
                    if route not in current_postup:
                        new_postup_commands.append(route)
                
                if new_postup_commands:
                    # Append new routes to existing PostUp
                    if current_postup:
                        updated_postup = f"{current_postup}; {'; '.join(new_postup_commands)}"
                    else:
                        updated_postup = '; '.join(new_postup_commands)
                    
                    # Update WireGuard configuration
                    setattr(config, 'PostUp', updated_postup)
                    
                    # Save configuration
                    config.SaveConfig
                    
                    print(f"[EnhancedRBAC] Added push routes for peer {peer_ip}: {', '.join(new_postup_commands)}")
            
            return True
            
        except Exception as e:
            print(f"[EnhancedRBAC] Error configuring push routes: {str(e)}")
            return False
    
    def _remove_push_routes(self, config, organization_subnets: List[str], peer_ip: str) -> bool:
        """
        Remove push routes for organization subnets when VPN peer is removed
        
        Args:
            config: WireGuard configuration object
            organization_subnets: List of subnet strings (e.g., ['10.0.0.0/24', '192.168.1.0/24'])
            peer_ip: IP address of the VPN peer
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Get current PostUp configuration
            current_postup = getattr(config, 'PostUp', '')
            
            # Generate route removal commands
            routes_to_remove = []
            for subnet in organization_subnets:
                # Format: ip route add <subnet> via <peer_ip>
                route_cmd = f"ip route add {subnet} via {peer_ip}"
                routes_to_remove.append(route_cmd)
            
            # Remove routes from PostUp
            if routes_to_remove and current_postup:
                # Split existing commands
                existing_commands = [cmd.strip() for cmd in current_postup.split(';')]
                
                # Filter out routes for this peer
                filtered_commands = []
                for cmd in existing_commands:
                    should_remove = False
                    for route in routes_to_remove:
                        if route in cmd:
                            should_remove = True
                            break
                    
                    if not should_remove:
                        filtered_commands.append(cmd)
                
                # Update PostUp configuration
                updated_postup = '; '.join(filtered_commands)
                setattr(config, 'PostUp', updated_postup)
                
                # Save configuration
                config.SaveConfig
                
                print(f"[EnhancedRBAC] Removed push routes for peer {peer_ip}: {', '.join(routes_to_remove)}")
            
            return True
            
        except Exception as e:
            print(f"[EnhancedRBAC] Error removing push routes: {str(e)}")
            return False

# Export the class for import
