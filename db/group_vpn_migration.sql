-- Migration: Add VPN integration to rbac_groups table
-- This moves VPN assignment from organization level to group level

-- Add VPN integration columns to rbac_groups table
ALTER TABLE rbac_groups ADD COLUMN vpn_enabled BOOLEAN DEFAULT 0;
ALTER TABLE rbac_groups ADD COLUMN vpn_type TEXT DEFAULT 'wireguard';
ALTER TABLE rbac_groups ADD COLUMN vpn_server_name TEXT;
ALTER TABLE rbac_groups ADD COLUMN auto_route_subnets BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN custom_routing_enabled BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN firewall_rules_enabled BOOLEAN DEFAULT 1;
ALTER TABLE rbac_groups ADD COLUMN vpn_assignment_updated TIMESTAMP;

-- Update existing groups with default VPN settings
UPDATE rbac_groups SET 
    vpn_enabled = 0,
    vpn_type = 'wireguard',
    auto_route_subnets = 1,
    custom_routing_enabled = 1,
    firewall_rules_enabled = 1,
    vpn_assignment_updated = CURRENT_TIMESTAMP
WHERE vpn_enabled IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_server ON rbac_groups(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_rbac_groups_vpn_enabled ON rbac_groups(vpn_enabled);



