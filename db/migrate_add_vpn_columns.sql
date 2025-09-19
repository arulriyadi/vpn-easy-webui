-- Migration script to add VPN columns to existing rbac_groups table
-- This script is safe to run multiple times (uses IF NOT EXISTS logic)

-- Add VPN columns to rbac_groups table
ALTER TABLE rbac_groups ADD COLUMN vpn_enabled BOOLEAN DEFAULT 0;
ALTER TABLE rbac_groups ADD COLUMN vpn_type TEXT DEFAULT 'wireguard';
ALTER TABLE rbac_groups ADD COLUMN vpn_server_name TEXT;
ALTER TABLE rbac_groups ADD COLUMN auto_route_subnets BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN custom_routing_enabled BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN firewall_rules_enabled BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN vpn_assignment_updated TIMESTAMP;

-- Add indexes for VPN columns
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_server ON rbac_groups(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_enabled ON rbac_groups(vpn_enabled);
