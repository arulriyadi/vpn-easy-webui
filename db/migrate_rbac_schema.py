#!/usr/bin/env python3
"""
RBAC Schema Migration Script
Migrates existing RBAC data to new scalable model
"""

import sqlite3
import os
import sys
from datetime import datetime

def migrate_rbac_schema():
    """Migrate existing RBAC schema to new scalable model"""
    
    # Database paths
    rbac_db_path = '/home/ubuntu/vpn-easy-webui/db/rbac.db'
    org_db_path = '/home/ubuntu/vpn-easy-webui/db/organization.db'
    
    print("🚀 Starting RBAC Schema Migration...")
    
    try:
        # Connect to RBAC database
        with sqlite3.connect(rbac_db_path) as rbac_conn:
            rbac_conn.row_factory = sqlite3.Row
            rbac_cursor = rbac_conn.cursor()
            
            # Backup existing data
            print("📋 Backing up existing RBAC data...")
            
            # Get existing groups
            rbac_cursor.execute("SELECT * FROM rbac_groups")
            existing_groups = rbac_cursor.fetchall()
            
            # Get existing group peers
            rbac_cursor.execute("SELECT * FROM rbac_group_peers")
            existing_group_peers = rbac_cursor.fetchall()
            
            # Get existing filter policies
            rbac_cursor.execute("SELECT * FROM rbac_filter_policies")
            existing_filter_policies = rbac_cursor.fetchall()
            
            # Get existing NAT policies
            rbac_cursor.execute("SELECT * FROM rbac_nat_policies")
            existing_nat_policies = rbac_cursor.fetchall()
            
            print(f"✅ Found {len(existing_groups)} groups, {len(existing_group_peers)} peer assignments")
            print(f"✅ Found {len(existing_filter_policies)} filter policies, {len(existing_nat_policies)} NAT policies")
            
            # Create new tables
            print("🏗️ Creating new RBAC schema...")
            
            # Read and execute new schema
            with open('/home/ubuntu/vpn-easy-webui/db/rbac_new_schema.sql', 'r') as f:
                schema_sql = f.read()
            
            # Execute schema creation
            rbac_cursor.executescript(schema_sql)
            
            # Migrate existing data
            print("🔄 Migrating existing data...")
            
            # Add new columns to existing groups table
            try:
                rbac_cursor.execute("ALTER TABLE rbac_groups ADD COLUMN inherit_org_policies BOOLEAN DEFAULT 1")
                print("✅ Added inherit_org_policies column to rbac_groups")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e):
                    print("ℹ️ inherit_org_policies column already exists")
                else:
                    raise e
            
            # Migrate group peers
            for peer in existing_group_peers:
                rbac_cursor.execute("""
                    INSERT OR IGNORE INTO rbac_group_peers 
                    (group_id, peer_name, peer_ip, assigned_at)
                    VALUES (?, ?, ?, ?)
                """, (peer['group_id'], peer['peer_name'], peer['peer_ip'], peer['assigned_at']))
            
            # Migrate filter policies
            for policy in existing_filter_policies:
                rbac_cursor.execute("""
                    INSERT INTO rbac_group_filter_policies
                    (group_id, organization_id, destination, action, protocol, port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
                """, (
                    policy['group_id'], 
                    None,  # organization_id - will be set later
                    policy['destination'], 
                    policy['action'], 
                    policy['protocol'], 
                    policy['port'], 
                    policy['priority'],
                    policy.get('created_at', datetime.now().isoformat())
                ))
            
            # Migrate NAT policies
            for policy in existing_nat_policies:
                rbac_cursor.execute("""
                    INSERT INTO rbac_group_nat_policies
                    (group_id, organization_id, destination, action, translated_ip, translated_port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
                """, (
                    policy['group_id'], 
                    None,  # organization_id - will be set later
                    policy['destination'], 
                    policy['action'], 
                    policy.get('translated_ip'), 
                    policy.get('translated_port'), 
                    policy['priority'],
                    policy.get('created_at', datetime.now().isoformat())
                ))
            
            # Clean up old tables (optional - comment out if you want to keep them)
            print("🧹 Cleaning up old tables...")
            rbac_cursor.execute("DROP TABLE IF EXISTS rbac_generated_rules")
            rbac_cursor.execute("DROP TABLE IF EXISTS rbac_filter_policies")
            rbac_cursor.execute("DROP TABLE IF EXISTS rbac_nat_policies")
            
            rbac_conn.commit()
            print("✅ RBAC database migration completed!")
            
        # Migrate organization database if it exists
        if os.path.exists(org_db_path):
            print("🔄 Migrating organization database...")
            
            with sqlite3.connect(org_db_path) as org_conn:
                org_conn.row_factory = sqlite3.Row
                org_cursor = org_conn.cursor()
                
                # Get organizations
                org_cursor.execute("SELECT * FROM organizations")
                existing_orgs = org_cursor.fetchall()
                
                # Get organization subnets
                org_cursor.execute("SELECT * FROM organization_subnets")
                existing_subnets = org_cursor.fetchall()
                
                # Get user organizations
                org_cursor.execute("SELECT * FROM user_organizations")
                existing_user_orgs = org_cursor.fetchall()
                
                print(f"✅ Found {len(existing_orgs)} organizations, {len(existing_subnets)} subnets, {len(existing_user_orgs)} user assignments")
                
                # Migrate to RBAC database
                with sqlite3.connect(rbac_db_path) as rbac_conn:
                    rbac_cursor = rbac_conn.cursor()
                    
                    # Migrate organizations
                    for org in existing_orgs:
                        rbac_cursor.execute("""
                            INSERT OR IGNORE INTO organizations
                            (id, name, description, color, default_filter_policy, default_nat_policy, created_at, updated_at)
                            VALUES (?, ?, ?, ?, 'allow', 'none', ?, ?)
                        """, (
                            org['id'], org['name'], org['description'], org['color'],
                            org['created_at'], org['updated_at']
                        ))
                    
                    # Migrate organization subnets
                    for subnet in existing_subnets:
                        rbac_cursor.execute("""
                            INSERT OR IGNORE INTO organization_subnets
                            (id, organization_id, subnet_cidr, description, is_primary, routing_enabled, created_at)
                            VALUES (?, ?, ?, ?, ?, 1, ?)
                        """, (
                            subnet['id'], subnet['organization_id'], subnet['subnet_cidr'],
                            subnet['description'], subnet['is_primary'], subnet['created_at']
                        ))
                    
                    # Migrate user organizations
                    for user_org in existing_user_orgs:
                        rbac_cursor.execute("""
                            INSERT OR IGNORE INTO user_organizations
                            (id, user_id, organization_id, assigned_at)
                            VALUES (?, ?, ?, ?)
                        """, (user_org['id'], user_org['user_id'], user_org['organization_id'], user_org['assigned_at']))
                    
                    rbac_conn.commit()
                    print("✅ Organization database migration completed!")
        
        print("🎉 RBAC Schema Migration completed successfully!")
        print("\n📊 New Schema Features:")
        print("   ✅ Group ↔ Organization Relations (Many-to-Many)")
        print("   ✅ Policy Inheritance & Override")
        print("   ✅ Enhanced Organization Default Policies")
        print("   ✅ Effective Access Tracking")
        print("   ✅ Performance Indexes")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = migrate_rbac_schema()
    sys.exit(0 if success else 1)
