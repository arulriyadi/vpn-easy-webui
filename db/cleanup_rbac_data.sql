-- Cleanup script for RBAC database
-- Remove all default/demo data, keep only essential Admin group

-- Clean RBAC Groups (keep only Admin)
DELETE FROM rbac_groups WHERE name != 'Admin';

-- Clean Group-Organization Relations
DELETE FROM rbac_group_organizations;

-- Clean Group Policies (will be recreated as needed)
DELETE FROM rbac_group_filter_policies;
DELETE FROM rbac_group_nat_policies;

-- Clean Performance Cache
DELETE FROM rbac_effective_access;
DELETE FROM rbac_effective_rules;

-- Reset auto-increment sequences
DELETE FROM sqlite_sequence WHERE name IN ('rbac_groups', 'rbac_group_organizations');
