-- ============================================
-- RBAC NEW SCHEMA - Scalable Model
-- User ↔ Group ↔ Organization ↔ Subnet/Policy
-- ============================================

-- Organizations (existing, enhanced)
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#007bff',
    default_filter_policy TEXT DEFAULT 'allow', -- 'allow', 'deny', 'restricted'
    default_nat_policy TEXT DEFAULT 'none', -- 'none', 'masquerade', 'snat'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Organization Subnets (existing, enhanced)
CREATE TABLE IF NOT EXISTS organization_subnets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    subnet_cidr TEXT NOT NULL,
    description TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    routing_enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE (organization_id, subnet_cidr)
);

-- RBAC Groups (enhanced with organization relations and VPN support)
CREATE TABLE IF NOT EXISTS rbac_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#007bff',
    inherit_org_policies BOOLEAN DEFAULT TRUE,
    vpn_enabled BOOLEAN DEFAULT 0,
    vpn_type TEXT DEFAULT 'wireguard',
    vpn_server_name TEXT,
    auto_route_subnets BOOLEAN DEFAULT 1,
    custom_routing_enabled BOOLEAN DEFAULT 1,
    firewall_rules_enabled BOOLEAN DEFAULT 1,
    vpn_assignment_updated TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Group ↔ Organization Relations (NEW - Many-to-Many)
CREATE TABLE IF NOT EXISTS rbac_group_organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    attached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE (group_id, organization_id)
);

-- Group Filter Policies (enhanced with inheritance)
CREATE TABLE IF NOT EXISTS rbac_group_filter_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    organization_id INTEGER, -- NULL = applies to all attached orgs
    destination TEXT NOT NULL,
    action TEXT NOT NULL, -- 'allow', 'deny'
    protocol TEXT DEFAULT 'any',
    port TEXT,
    priority INTEGER DEFAULT 100,
    is_override BOOLEAN DEFAULT FALSE, -- Override org default policy
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Group NAT Policies (enhanced with inheritance)
CREATE TABLE IF NOT EXISTS rbac_group_nat_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    organization_id INTEGER, -- NULL = applies to all attached orgs
    destination TEXT NOT NULL,
    action TEXT NOT NULL, -- 'snat', 'dnat', 'masquerade'
    translated_ip TEXT,
    translated_port TEXT,
    priority INTEGER DEFAULT 100,
    is_override BOOLEAN DEFAULT FALSE, -- Override org default policy
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Group Peers (existing, enhanced)
CREATE TABLE IF NOT EXISTS rbac_group_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    peer_name TEXT NOT NULL,
    peer_ip TEXT,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    UNIQUE (group_id, peer_name)
);

-- User Organizations (existing, enhanced)
CREATE TABLE IF NOT EXISTS user_organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE (user_id, organization_id)
);

-- Generated Rules (enhanced for effective access tracking)
CREATE TABLE IF NOT EXISTS rbac_effective_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    peer_name TEXT NOT NULL,
    group_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    rule_type TEXT NOT NULL, -- 'routing', 'filter', 'nat'
    rule_content TEXT NOT NULL,
    source TEXT NOT NULL, -- 'org_default', 'group_override', 'group_policy'
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Effective Access Cache (for performance)
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
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_org_relations ON rbac_group_organizations(group_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_group_policies ON rbac_group_filter_policies(group_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_nat_policies ON rbac_group_nat_policies(group_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_effective_access ON rbac_effective_access(peer_name, group_id);
CREATE INDEX IF NOT EXISTS idx_effective_rules ON rbac_effective_rules(peer_name, group_id);
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_server ON rbac_groups(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_enabled ON rbac_groups(vpn_enabled);







