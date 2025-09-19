-- Organization Management Database Schema
-- This schema supports multi-organization management with subnet definitions

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization subnets table
CREATE TABLE IF NOT EXISTS organization_subnets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    subnet_cidr VARCHAR(18) NOT NULL, -- e.g., 192.168.1.0/24
    description TEXT,
    is_primary BOOLEAN DEFAULT 0, -- Primary subnet for the organization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(organization_id, subnet_cidr)
);

-- User organizations relationship (many-to-many)
CREATE TABLE IF NOT EXISTS user_organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(user_id, organization_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organization_subnets_org_id ON organization_subnets(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org_id ON user_organizations(organization_id);

-- No default organizations - start with clean database
-- No default subnets - start with clean database








