-- First, let's check what status values are allowed
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE table_name = 'maintenance_requests' AND constraint_name LIKE '%status%';