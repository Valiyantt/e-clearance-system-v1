-- Insert sample data for testing

-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, full_name, email, contact_number, address, program, section, year_level, enrollment_date, expected_graduation, payment_status) VALUES
('2021-001', 'Alanna Froam', 'Torie Co', 'Alanna Froam Torie Co', 'alanna.torie@student.smcl.edu.ph', '+63 912 345 6789', '123 Main St, Biñan, Laguna', 'Bachelor of Science in Information Technology', 'BSIT-3A', '3rd Year', '2021-08-15', '2025-04-30', 'cleared'),
('2021-002', 'John', 'Doe', 'John Doe', 'john.doe@student.smcl.edu.ph', '+63 912 345 6790', '456 Oak Ave, Biñan, Laguna', 'Bachelor of Science in Business Administration', 'BSBA-4B', '4th Year', '2021-08-15', '2025-04-30', 'cleared'),
('2021-003', 'Jane', 'Smith', 'Jane Smith', 'jane.smith@student.smcl.edu.ph', '+63 912 345 6791', '789 Pine St, Biñan, Laguna', 'Bachelor of Science in Education', 'BSED-2C', '2nd Year', '2022-08-15', '2026-04-30', 'pending'),
('2021-004', 'Maria', 'Garcia', 'Maria Garcia', 'maria.garcia@student.smcl.edu.ph', '+63 912 345 6792', '321 Elm St, Biñan, Laguna', 'Bachelor of Science in Nursing', 'BSN-1A', '1st Year', '2024-08-15', '2028-04-30', 'pending'),
('2021-005', 'Carlos', 'Rodriguez', 'Carlos Rodriguez', 'carlos.rodriguez@student.smcl.edu.ph', '+63 912 345 6793', '654 Maple Ave, Biñan, Laguna', 'Bachelor of Science in Criminology', 'BSCRIM-3B', '3rd Year', '2022-08-15', '2026-04-30', 'cleared');

-- Insert sample clearances
INSERT INTO clearances (clearance_id, student_id, unique_token, status, submitted_date, expires_at) VALUES
('CLR-2025-001', '2021-001', 'abc123def456ghi789jkl012', 'in-progress', '2025-01-15 10:30:00', '2025-02-14 23:59:59'),
('CLR-2025-002', '2021-002', 'xyz789abc123def456ghi789', 'completed', '2025-01-14 09:15:00', '2025-02-13 23:59:59'),
('CLR-2025-003', '2021-003', 'def456ghi789jkl012mno345', 'pending', '2025-01-16 14:20:00', '2025-02-15 23:59:59'),
('CLR-2025-004', '2021-004', 'ghi789jkl012mno345pqr678', 'pending', '2025-01-17 11:45:00', '2025-02-16 23:59:59'),
('CLR-2025-005', '2021-005', 'jkl012mno345pqr678stu901', 'completed', '2025-01-13 16:30:00', '2025-02-12 23:59:59');

-- Insert sample clearance items
INSERT INTO clearance_items (clearance_id, department, officer_name, description, status, payment_amount, signed_date, remarks) VALUES
-- For CLR-2025-001 (Alanna - in progress)
('CLR-2025-001', 'Business Services Officer', 'Ms. Maria Santos', 'Financial obligations and fees', 'approved', 0, '2025-01-15 09:00:00', 'All payments cleared'),
('CLR-2025-001', 'Chief Librarian', 'Mr. Jose Dela Cruz', 'Library books and materials', 'approved', 0, '2025-01-14 14:30:00', 'No outstanding books'),
('CLR-2025-001', 'CCSC Personnel', 'Ms. Ana Reyes', 'Student activities and organizations', 'pending', 0, NULL, NULL),
('CLR-2025-001', 'Chair/Administrator', 'Dr. Roberto Martinez', 'Academic requirements and thesis', 'pending', 0, NULL, NULL),
('CLR-2025-001', 'College Registrar', 'Ms. Carmen Lopez', 'Academic records and transcripts', 'pending', 0, NULL, NULL),

-- For CLR-2025-002 (John - completed)
('CLR-2025-002', 'Business Services Officer', 'Ms. Maria Santos', 'Financial obligations and fees', 'approved', 0, '2025-01-14 08:30:00', 'All payments cleared'),
('CLR-2025-002', 'Chief Librarian', 'Mr. Jose Dela Cruz', 'Library books and materials', 'approved', 0, '2025-01-13 15:45:00', 'No outstanding books'),
('CLR-2025-002', 'CCSC Personnel', 'Ms. Ana Reyes', 'Student activities and organizations', 'approved', 0, '2025-01-14 10:15:00', 'All activities completed'),
('CLR-2025-002', 'Chair/Administrator', 'Dr. Roberto Martinez', 'Academic requirements and thesis', 'approved', 0, '2025-01-14 13:20:00', 'Thesis approved'),
('CLR-2025-002', 'College Registrar', 'Ms. Carmen Lopez', 'Academic records and transcripts', 'approved', 0, '2025-01-14 16:00:00', 'Records complete'),

-- For CLR-2025-003 (Jane - pending with payment required)
('CLR-2025-003', 'Business Services Officer', 'Ms. Maria Santos', 'Financial obligations and fees', 'requires_payment', 2500.00, NULL, 'Outstanding tuition balance'),
('CLR-2025-003', 'Chief Librarian', 'Mr. Jose Dela Cruz', 'Library books and materials', 'pending', 0, NULL, NULL),
('CLR-2025-003', 'CCSC Personnel', 'Ms. Ana Reyes', 'Student activities and organizations', 'pending', 0, NULL, NULL),
('CLR-2025-003', 'Chair/Administrator', 'Dr. Roberto Martinez', 'Academic requirements and thesis', 'pending', 0, NULL, NULL),
('CLR-2025-003', 'College Registrar', 'Ms. Carmen Lopez', 'Academic records and transcripts', 'pending', 0, NULL, NULL);

-- Insert sample admin users
INSERT INTO admin_users (username, email, password_hash, full_name, role, department, is_active) VALUES
('admin', 'admin@smcl.edu.ph', '$2b$10$example_hash_here', 'System Administrator', 'super_admin', 'IT Department', true),
('maria.santos', 'maria.santos@smcl.edu.ph', '$2b$10$example_hash_here', 'Maria Santos', 'department_admin', 'Business Services', true),
('jose.delacruz', 'jose.delacruz@smcl.edu.ph', '$2b$10$example_hash_here', 'Jose Dela Cruz', 'department_admin', 'Library', true),
('ana.reyes', 'ana.reyes@smcl.edu.ph', '$2b$10$example_hash_here', 'Ana Reyes', 'department_admin', 'CCSC', true),
('roberto.martinez', 'roberto.martinez@smcl.edu.ph', '$2b$10$example_hash_here', 'Dr. Roberto Martinez', 'department_admin', 'Academic Affairs', true),
('carmen.lopez', 'carmen.lopez@smcl.edu.ph', '$2b$10$example_hash_here', 'Carmen Lopez', 'department_admin', 'Registrar', true);
