#!/usr/bin/env python3
"""
Organization Management Module
Handles organization, subnet, and user-organization relationship management
"""

import sqlite3
import os
from datetime import datetime

class OrganizationManager:
    def __init__(self, db_path=None):
        if db_path is None:
            # Default to the same directory as this module
            db_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'organization.db')
        
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the organization database with schema"""
        schema_path = os.path.join(os.path.dirname(__file__), '..', 'db', 'organization_schema.sql')
        
        with sqlite3.connect(self.db_path) as conn:
            # Read and execute schema
            with open(schema_path, 'r') as f:
                schema_sql = f.read()
                conn.executescript(schema_sql)
            
            conn.commit()
    
    # Organization CRUD operations
    def create_organization(self, name, description=None, color='#007bff'):
        """Create a new organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO organizations (name, description, color)
                    VALUES (?, ?, ?)
                """, (name, description, color))
                conn.commit()
                return {'status': True, 'message': f'Organization "{name}" created successfully', 'id': cursor.lastrowid}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Organization "{name}" already exists'}
        except Exception as e:
            return {'status': False, 'message': f'Error creating organization: {str(e)}'}
    
    def get_all_organizations(self):
        """Get all organizations with subnet count"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT o.*, 
                           COUNT(DISTINCT os.id) as subnet_count,
                           COUNT(DISTINCT uo.user_id) as user_count
                    FROM organizations o
                    LEFT JOIN organization_subnets os ON o.id = os.organization_id
                    LEFT JOIN user_organizations uo ON o.id = uo.organization_id
                    GROUP BY o.id
                    ORDER BY o.name
                """)
                organizations = [dict(row) for row in cursor.fetchall()]
                return {'status': True, 'data': organizations, 'message': 'Organizations retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organizations: {str(e)}', 'data': None}
    
    def get_organization(self, org_id):
        """Get organization details with subnets"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Get organization info
                cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
                org = cursor.fetchone()
                
                if not org:
                    return {'status': False, 'message': 'Organization not found', 'data': None}
                
                # Get subnets
                cursor.execute("""
                    SELECT * FROM organization_subnets 
                    WHERE organization_id = ? 
                    ORDER BY is_primary DESC, subnet_cidr
                """, (org_id,))
                subnets = cursor.fetchall()
                
                org_data = dict(org)
                org_data['subnets'] = [dict(subnet) for subnet in subnets]
                
                return {'status': True, 'data': org_data, 'message': 'Organization retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organization: {str(e)}', 'data': None}
    
    def update_organization(self, org_id, name=None, description=None, color=None):
        """Update organization details"""
        try:
            updates = []
            params = []
            
            if name is not None:
                updates.append("name = ?")
                params.append(name)
            if description is not None:
                updates.append("description = ?")
                params.append(description)
            if color is not None:
                updates.append("color = ?")
                params.append(color)
            
            if not updates:
                return {'status': False, 'message': 'No updates provided'}
            
            updates.append("updated_at = ?")
            params.append(datetime.now().isoformat())
            params.append(org_id)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(f"""
                    UPDATE organizations 
                    SET {', '.join(updates)}
                    WHERE id = ?
                """, params)
                
                if cursor.rowcount == 0:
                    return {'status': False, 'message': 'Organization not found'}
                
                conn.commit()
                return {'status': True, 'message': 'Organization updated successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Organization name already exists'}
        except Exception as e:
            return {'status': False, 'message': f'Error updating organization: {str(e)}'}
    
    def delete_organization(self, org_id):
        """Delete organization and all related data"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get organization name for message
                cursor.execute("SELECT name FROM organizations WHERE id = ?", (org_id,))
                org = cursor.fetchone()
                
                if not org:
                    return {'status': False, 'message': 'Organization not found'}
                
                # Delete organization (cascades to subnets and user relationships)
                cursor.execute("DELETE FROM organizations WHERE id = ?", (org_id,))
                conn.commit()
                
                return {'status': True, 'message': f'Organization "{org[0]}" deleted successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error deleting organization: {str(e)}'}
    
    # Subnet management
    def add_subnet_to_organization(self, org_id, subnet_cidr, description=None, is_primary=False):
        """Add a subnet to an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # If this is primary, unset other primary subnets for this org
                if is_primary:
                    cursor.execute("""
                        UPDATE organization_subnets 
                        SET is_primary = 0 
                        WHERE organization_id = ?
                    """, (org_id,))
                
                cursor.execute("""
                    INSERT INTO organization_subnets (organization_id, subnet_cidr, description, is_primary)
                    VALUES (?, ?, ?, ?)
                """, (org_id, subnet_cidr, description, is_primary))
                
                conn.commit()
                return {'status': True, 'message': f'Subnet {subnet_cidr} added successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Subnet {subnet_cidr} already exists for this organization'}
        except Exception as e:
            return {'status': False, 'message': f'Error adding subnet: {str(e)}'}
    
    def update_subnet(self, subnet_id, subnet_cidr=None, description=None, is_primary=None):
        """Update subnet details"""
        try:
            updates = []
            params = []
            
            if subnet_cidr is not None:
                updates.append("subnet_cidr = ?")
                params.append(subnet_cidr)
            if description is not None:
                updates.append("description = ?")
                params.append(description)
            if is_primary is not None:
                updates.append("is_primary = ?")
                params.append(is_primary)
                
                # If setting as primary, unset other primary subnets for the same org
                if is_primary:
                    cursor = conn.cursor()
                    cursor.execute("""
                        SELECT organization_id FROM organization_subnets WHERE id = ?
                    """, (subnet_id,))
                    org_id = cursor.fetchone()[0]
                    
                    cursor.execute("""
                        UPDATE organization_subnets 
                        SET is_primary = 0 
                        WHERE organization_id = ? AND id != ?
                    """, (org_id, subnet_id))
            
            if not updates:
                return {'status': False, 'message': 'No updates provided'}
            
            params.append(subnet_id)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(f"""
                    UPDATE organization_subnets 
                    SET {', '.join(updates)}
                    WHERE id = ?
                """, params)
                
                if cursor.rowcount == 0:
                    return {'status': False, 'message': 'Subnet not found'}
                
                conn.commit()
                return {'status': True, 'message': 'Subnet updated successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': f'Subnet already exists'}
        except Exception as e:
            return {'status': False, 'message': f'Error updating subnet: {str(e)}'}
    
    def delete_subnet(self, subnet_id):
        """Delete a subnet from an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM organization_subnets WHERE id = ?", (subnet_id,))
                
                if cursor.rowcount == 0:
                    return {'status': False, 'message': 'Subnet not found'}
                
                conn.commit()
                return {'status': True, 'message': 'Subnet deleted successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error deleting subnet: {str(e)}'}
    
    # User-Organization relationships
    def assign_user_to_organization(self, user_id, org_id):
        """Assign a user to an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO user_organizations (user_id, organization_id)
                    VALUES (?, ?)
                """, (user_id, org_id))
                
                conn.commit()
                return {'status': True, 'message': 'User assigned to organization successfully'}
        except sqlite3.IntegrityError:
            return {'status': False, 'message': 'User is already assigned to this organization'}
        except Exception as e:
            return {'status': False, 'message': f'Error assigning user: {str(e)}'}
    
    def remove_user_from_organization(self, user_id, org_id):
        """Remove a user from an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    DELETE FROM user_organizations 
                    WHERE user_id = ? AND organization_id = ?
                """, (user_id, org_id))
                
                if cursor.rowcount == 0:
                    return {'status': False, 'message': 'User assignment not found'}
                
                conn.commit()
                return {'status': True, 'message': 'User removed from organization successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error removing user: {str(e)}'}
    
    def get_user_organizations(self, user_id):
        """Get all organizations for a user"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT o.*, uo.assigned_at
                    FROM organizations o
                    JOIN user_organizations uo ON o.id = uo.organization_id
                    WHERE uo.user_id = ?
                    ORDER BY o.name
                """, (user_id,))
                return {'status': True, 'data': [dict(row) for row in cursor.fetchall()]}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching user organizations: {str(e)}'}
    
    def get_organization_users(self, org_id):
        """Get all users in an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT u.*, uo.assigned_at
                    FROM users u
                    JOIN user_organizations uo ON u.id = uo.user_id
                    WHERE uo.organization_id = ?
                    ORDER BY u.username
                """, (org_id,))
                return {'status': True, 'data': [dict(row) for row in cursor.fetchall()]}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organization users: {str(e)}'}
    
    # Routing integration
    def get_user_subnets(self, user_id):
        """Get all subnets for organizations that a user belongs to"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT DISTINCT os.subnet_cidr, os.description, o.name as org_name
                    FROM organization_subnets os
                    JOIN organizations o ON os.organization_id = o.id
                    JOIN user_organizations uo ON o.id = uo.organization_id
                    WHERE uo.user_id = ?
                    ORDER BY o.name, os.is_primary DESC
                """, (user_id,))
                return {'status': True, 'data': [dict(row) for row in cursor.fetchall()]}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching user subnets: {str(e)}'}
    
    def get_all_organization_subnets(self):
        """Get all subnets from all organizations for routing purposes"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT os.id, os.subnet_cidr, os.description, o.name as org_name, o.color as org_color,
                           os.is_primary, os.organization_id
                    FROM organization_subnets os
                    JOIN organizations o ON os.organization_id = o.id
                    ORDER BY o.name, os.is_primary DESC
                """)
                subnets = [dict(row) for row in cursor.fetchall()]
                return {'status': True, 'data': subnets, 'message': 'Organization subnets retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching all subnets: {str(e)}', 'data': None}
    
    # VPN Integration Methods
    def update_organization_vpn_assignment(self, org_id, vpn_enabled=None, vpn_type=None, 
                                         vpn_server_name=None, auto_route_subnets=None,
                                         custom_routing_enabled=None, firewall_rules_enabled=None):
        """Update VPN assignment for an organization"""
        try:
            updates = []
            params = []
            
            if vpn_enabled is not None:
                updates.append("vpn_enabled = ?")
                params.append(vpn_enabled)
            if vpn_type is not None:
                updates.append("vpn_type = ?")
                params.append(vpn_type)
            if vpn_server_name is not None:
                updates.append("vpn_server_name = ?")
                params.append(vpn_server_name)
            if auto_route_subnets is not None:
                updates.append("auto_route_subnets = ?")
                params.append(auto_route_subnets)
            if custom_routing_enabled is not None:
                updates.append("custom_routing_enabled = ?")
                params.append(custom_routing_enabled)
            if firewall_rules_enabled is not None:
                updates.append("firewall_rules_enabled = ?")
                params.append(firewall_rules_enabled)
            
            if not updates:
                return {'status': False, 'message': 'No VPN updates provided'}
            
            updates.append("vpn_assignment_updated = ?")
            params.append(datetime.now().isoformat())
            params.append(org_id)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(f"""
                    UPDATE organizations 
                    SET {', '.join(updates)}
                    WHERE id = ?
                """, params)
                
                if cursor.rowcount == 0:
                    return {'status': False, 'message': 'Organization not found'}
                
                conn.commit()
                return {'status': True, 'message': 'VPN assignment updated successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error updating VPN assignment: {str(e)}'}
    
    def get_organization_vpn_assignment(self, org_id):
        """Get VPN assignment details for an organization"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT vpn_enabled, vpn_type, vpn_server_name, auto_route_subnets,
                           custom_routing_enabled, firewall_rules_enabled, vpn_assignment_updated
                    FROM organizations 
                    WHERE id = ?
                """, (org_id,))
                
                vpn_data = cursor.fetchone()
                if not vpn_data:
                    return {'status': False, 'message': 'Organization not found', 'data': None}
                
                return {'status': True, 'data': dict(vpn_data), 'message': 'VPN assignment retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching VPN assignment: {str(e)}', 'data': None}
    
    def get_organizations_by_vpn_server(self, vpn_server_name):
        """Get all organizations assigned to a specific VPN server"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, name, description, color, vpn_enabled, vpn_type,
                           auto_route_subnets, custom_routing_enabled, firewall_rules_enabled
                    FROM organizations 
                    WHERE vpn_enabled = 1 AND vpn_server_name = ?
                    ORDER BY name
                """, (vpn_server_name,))
                
                organizations = [dict(row) for row in cursor.fetchall()]
                return {'status': True, 'data': organizations, 'message': f'Organizations for VPN server {vpn_server_name} retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organizations by VPN server: {str(e)}', 'data': None}
    
    def get_organization_subnets_for_vpn(self, org_id):
        """Get organization subnets that should be routed via VPN"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT subnet_cidr, description, is_primary
                    FROM organization_subnets 
                    WHERE organization_id = ? AND routing_enabled = 1
                    ORDER BY is_primary DESC, subnet_cidr
                """, (org_id,))
                
                subnets = [dict(row) for row in cursor.fetchall()]
                return {'status': True, 'data': subnets, 'message': 'Organization subnets for VPN retrieved successfully'}
        except Exception as e:
            return {'status': False, 'message': f'Error fetching organization subnets for VPN: {str(e)}', 'data': None}
