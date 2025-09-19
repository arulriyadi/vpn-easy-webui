-- Migration script to add missing tables to existing users database
-- This script is safe to run multiple times (uses IF NOT EXISTS logic)

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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_user_id ON user_vpn_peers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_group_id ON user_vpn_peers(group_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_vpn_server ON user_vpn_peers(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_peer_ip ON user_vpn_peers(peer_ip);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
