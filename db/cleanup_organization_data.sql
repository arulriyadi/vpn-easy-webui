-- Cleanup script for Organization database
-- Remove all default/demo data

-- Clean Organizations (remove all)
DELETE FROM organizations;
DELETE FROM organization_subnets;

-- Reset auto-increment sequences
DELETE FROM sqlite_sequence WHERE name IN ('organizations', 'organization_subnets');
