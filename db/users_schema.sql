-- Users Database Schema for VPN Easy WebUI
-- This creates a clean users database with only the schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    email TEXT,
    full_name TEXT
);

-- User groups table (for VPN peer assignments)
CREATE TABLE IF NOT EXISTS user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vpn_peer_generated BOOLEAN DEFAULT 0,
    peer_ip VARCHAR(50),
    peer_status VARCHAR(20) DEFAULT 'pending', -- pending, active, inactive
    peer_private_key TEXT,
    peer_public_key TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);

-- User VPN Peers table (for VPN peer management)
CREATE TABLE IF NOT EXISTS user_vpn_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    vpn_server_name VARCHAR(50) NOT NULL,
    peer_ip VARCHAR(50) NOT NULL,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    config_generated BOOLEAN DEFAULT 0,
    config_downloaded BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Sessions table (for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Permissions table (for permission management)
CREATE TABLE IF NOT EXISTS user_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    permission TEXT NOT NULL,
    resource TEXT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, permission, resource)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_vpn_generated ON user_groups(vpn_peer_generated);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_user_id ON user_vpn_peers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_group_id ON user_vpn_peers(group_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_vpn_server ON user_vpn_peers(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_peer_ip ON user_vpn_peers(peer_ip);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);

-- Insert default admin user
INSERT INTO users (username, password_hash, role, full_name, email) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HSm1K6W', 'admin', 'Administrator', 'admin@localhost');
