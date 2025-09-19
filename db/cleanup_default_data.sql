-- Cleanup script for fresh installation
-- Remove all default/demo data, keep only essential Admin group

-- Clean RBAC Groups (keep only Admin) - only for rbac.db
DELETE FROM rbac_groups WHERE name != 'Admin';

-- Clean Organizations (remove all) - only for organization.db  
DELETE FROM organizations;
DELETE FROM organization_subnets;

-- Clean Group-Organization Relations - only for rbac.db
DELETE FROM rbac_group_organizations;

-- Clean Group Policies (will be recreated as needed) - only for rbac.db
DELETE FROM rbac_group_filter_policies;
DELETE FROM rbac_group_nat_policies;

-- Clean Performance Cache - only for rbac.db
DELETE FROM rbac_effective_access;
DELETE FROM rbac_effective_rules;

-- Reset auto-increment sequences
DELETE FROM sqlite_sequence WHERE name IN ('rbac_groups', 'organizations', 'organization_subnets', 'rbac_group_organizations');
