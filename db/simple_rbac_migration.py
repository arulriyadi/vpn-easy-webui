#!/usr/bin/env python3
"""
Simple RBAC Schema Migration
Safely adds new tables and columns to existing RBAC database
"""

import sqlite3
import os
import sys
from datetime import datetime

def safe_migration():
    """Safely migrate RBAC schema by adding new tables and columns"""
    
    rbac_db_path = '/home/ubuntu/vpn-easy-webui/db/rbac.db'
    
    print("🚀 Starting Safe RBAC Schema Migration...")
    
    try:
        with sqlite3.connect(rbac_db_path) as conn:
            cursor = conn.cursor()
            
            # 1. Add new columns to existing tables
            print("🔧 Adding new columns to existing tables...")
            
            # Add columns to rbac_groups
            try:
                cursor.execute("ALTER TABLE rbac_groups ADD COLUMN inherit_org_policies BOOLEAN DEFAULT 1")
                print("✅ Added inherit_org_policies to rbac_groups")
            except sqlite3.OperationalError:
                print("ℹ️ inherit_org_policies already exists in rbac_groups")
            
            # Add columns to organizations (if exists)
            try:
                cursor.execute("ALTER TABLE organizations ADD COLUMN default_filter_policy TEXT DEFAULT 'allow'")
                cursor.execute("ALTER TABLE organizations ADD COLUMN default_nat_policy TEXT DEFAULT 'none'")
                print("✅ Added policy columns to organizations")
            except sqlite3.OperationalError:
                print("ℹ️ Policy columns already exist in organizations")
            
            # Add columns to organization_subnets
            try:
                cursor.execute("ALTER TABLE organization_subnets ADD COLUMN routing_enabled BOOLEAN DEFAULT 1")
                print("✅ Added routing_enabled to organization_subnets")
            except sqlite3.OperationalError:
                print("ℹ️ routing_enabled already exists in organization_subnets")
            
            # 2. Create new tables for enhanced RBAC
            print("🏗️ Creating new RBAC tables...")
            
            # Group ↔ Organization Relations
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rbac_group_organizations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    group_id INTEGER NOT NULL,
                    organization_id INTEGER NOT NULL,
                    attached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
                    UNIQUE (group_id, organization_id)
                )
            """)
            print("✅ Created rbac_group_organizations table")
            
            # Enhanced Filter Policies
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rbac_group_filter_policies_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    group_id INTEGER NOT NULL,
                    organization_id INTEGER,
                    destination TEXT NOT NULL,
                    action TEXT NOT NULL,
                    protocol TEXT DEFAULT 'any',
                    port TEXT,
                    priority INTEGER DEFAULT 100,
                    is_override BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
                )
            """)
            print("✅ Created rbac_group_filter_policies_new table")
            
            # Enhanced NAT Policies
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rbac_group_nat_policies_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    group_id INTEGER NOT NULL,
                    organization_id INTEGER,
                    destination TEXT NOT NULL,
                    action TEXT NOT NULL,
                    translated_ip TEXT,
                    translated_port TEXT,
                    priority INTEGER DEFAULT 100,
                    is_override BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
                )
            """)
            print("✅ Created rbac_group_nat_policies_new table")
            
            # Effective Access Tracking
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rbac_effective_access (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    peer_name TEXT NOT NULL,
                    group_id INTEGER NOT NULL,
                    organization_id INTEGER NOT NULL,
                    subnet_cidr TEXT NOT NULL,
                    filter_action TEXT NOT NULL,
                    nat_action TEXT DEFAULT 'none',
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
                    UNIQUE (peer_name, group_id, organization_id, subnet_cidr)
                )
            """)
            print("✅ Created rbac_effective_access table")
            
            # Effective Rules Tracking
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rbac_effective_rules (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    peer_name TEXT NOT NULL,
                    group_id INTEGER NOT NULL,
                    organization_id INTEGER NOT NULL,
                    rule_type TEXT NOT NULL,
                    rule_content TEXT NOT NULL,
                    source TEXT NOT NULL,
                    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
                )
            """)
            print("✅ Created rbac_effective_rules table")
            
            # 3. Migrate existing policy data
            print("🔄 Migrating existing policy data...")
            
            # Migrate filter policies
            cursor.execute("SELECT * FROM rbac_filter_policies")
            existing_filter_policies = cursor.fetchall()
            
            for policy in existing_filter_policies:
                cursor.execute("""
                    INSERT INTO rbac_group_filter_policies_new
                    (group_id, organization_id, destination, action, protocol, port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
                """, (
                    policy[1],  # group_id
                    None,       # organization_id (will be set later)
                    policy[2],  # destination
                    policy[3],  # action
                    policy[4],  # protocol
                    policy[5],  # port
                    policy[6],  # priority
                    datetime.now().isoformat()
                ))
            
            print(f"✅ Migrated {len(existing_filter_policies)} filter policies")
            
            # Migrate NAT policies
            cursor.execute("SELECT * FROM rbac_nat_policies")
            existing_nat_policies = cursor.fetchall()
            
            for policy in existing_nat_policies:
                cursor.execute("""
                    INSERT INTO rbac_group_nat_policies_new
                    (group_id, organization_id, destination, action, translated_ip, translated_port, priority, is_override, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
                """, (
                    policy[1],  # group_id
                    None,       # organization_id (will be set later)
                    policy[2],  # destination
                    policy[3],  # action
                    policy[4] if len(policy) > 4 else None,  # translated_ip
                    policy[5] if len(policy) > 5 else None,  # translated_port
                    policy[6] if len(policy) > 6 else 100,   # priority
                    datetime.now().isoformat()
                ))
            
            print(f"✅ Migrated {len(existing_nat_policies)} NAT policies")
            
            # 4. Create indexes for performance
            print("📊 Creating performance indexes...")
            
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_group_org_relations ON rbac_group_organizations(group_id, organization_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_group_filter_policies ON rbac_group_filter_policies_new(group_id, organization_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_group_nat_policies ON rbac_group_nat_policies_new(group_id, organization_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_effective_access ON rbac_effective_access(peer_name, group_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_effective_rules ON rbac_effective_rules(peer_name, group_id)")
            
            conn.commit()
            
            print("🎉 Safe RBAC Schema Migration completed successfully!")
            print("\n📊 New Features Added:")
            print("   ✅ Group ↔ Organization Relations (rbac_group_organizations)")
            print("   ✅ Enhanced Policy Tables with Organization Support")
            print("   ✅ Effective Access Tracking")
            print("   ✅ Performance Indexes")
            print("\n📋 Next Steps:")
            print("   1. Update backend managers to use new tables")
            print("   2. Update frontend to support Group ↔ Organization relations")
            print("   3. Implement policy inheritance logic")
            
            return True
            
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = safe_migration()
    sys.exit(0 if success else 1)







