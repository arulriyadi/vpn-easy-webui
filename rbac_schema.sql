-- RBAC Database Schema for VPN Management System
-- File: rbac_schema.sql

-- Groups Table
CREATE TABLE IF NOT EXISTS rbac_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff', -- Hex color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group-Peer Assignment
CREATE TABLE IF NOT EXISTS rbac_group_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    peer_name VARCHAR(100) NOT NULL, -- WireGuard peer name
    peer_ip VARCHAR(50), -- Peer IP address
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE,
    UNIQUE(group_id, peer_name)
);

-- Filter Policies
CREATE TABLE IF NOT EXISTS rbac_filter_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    destination VARCHAR(50) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK(action IN ('ACCEPT', 'DROP')),
    protocol VARCHAR(10) DEFAULT 'any' CHECK(protocol IN ('tcp', 'udp', 'any')),
    port VARCHAR(20) DEFAULT '',
    priority INTEGER DEFAULT 100,
    enabled BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE
);

-- NAT Policies
CREATE TABLE IF NOT EXISTS rbac_nat_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    destination VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK(action IN ('MASQUERADE', 'SNAT', 'DNAT', 'REDIRECT')),
    translated_ip VARCHAR(50) DEFAULT '',
    translated_port VARCHAR(20) DEFAULT '',
    priority INTEGER DEFAULT 100,
    enabled BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE
);

-- RBAC Generated Rules Tracking
CREATE TABLE IF NOT EXISTS rbac_generated_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    rule_type VARCHAR(10) NOT NULL CHECK(rule_type IN ('filter', 'nat')),
    policy_id INTEGER NOT NULL,
    iptables_rule TEXT NOT NULL,
    rule_comment VARCHAR(200) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES rbac_groups(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_group_id ON rbac_group_peers(group_id);
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_peer_name ON rbac_group_peers(peer_name);
CREATE INDEX IF NOT EXISTS idx_rbac_filter_policies_group_id ON rbac_filter_policies(group_id);
CREATE INDEX IF NOT EXISTS idx_rbac_nat_policies_group_id ON rbac_nat_policies(group_id);
CREATE INDEX IF NOT EXISTS idx_rbac_generated_rules_group_id ON rbac_generated_rules(group_id);

-- Insert default groups
INSERT OR IGNORE INTO rbac_groups (name, description, color) VALUES 
('Engineer', 'Engineering team access', '#28a745'),
('Finance', 'Finance department access', '#ffc107'),
('Guest', 'Guest user access', '#6c757d'),
('Admin', 'Administrative access', '#dc3545');
