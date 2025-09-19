-- Organization VPN Integration Migration
-- Add VPN integration columns to organizations table

-- Add VPN integration columns
ALTER TABLE organizations ADD COLUMN vpn_enabled BOOLEAN DEFAULT 0;
ALTER TABLE organizations ADD COLUMN vpn_type TEXT DEFAULT 'wireguard';
ALTER TABLE organizations ADD COLUMN vpn_server_name TEXT;
ALTER TABLE organizations ADD COLUMN auto_route_subnets BOOLEAN DEFAULT 1;
ALTER TABLE organizations ADD COLUMN custom_routing_enabled BOOLEAN DEFAULT 1;
ALTER TABLE organizations ADD COLUMN firewall_rules_enabled BOOLEAN DEFAULT 1;
ALTER TABLE organizations ADD COLUMN vpn_assignment_updated TIMESTAMP;

-- Add routing_enabled column to organization_subnets if not exists
ALTER TABLE organization_subnets ADD COLUMN routing_enabled BOOLEAN DEFAULT 1;

-- Create index for VPN server lookups
CREATE INDEX IF NOT EXISTS idx_organizations_vpn_server ON organizations(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_organizations_vpn_enabled ON organizations(vpn_enabled);

-- Update existing organizations with default VPN settings
UPDATE organizations SET 
    vpn_enabled = 0,
    vpn_type = 'wireguard',
    auto_route_subnets = 1,
    custom_routing_enabled = 1,
    firewall_rules_enabled = 1
WHERE vpn_enabled IS NULL;




