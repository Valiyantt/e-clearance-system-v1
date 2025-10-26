-- Insert departments
INSERT INTO departments (department_code, department_name, full_name, description, officer_name, officer_email, display_order) VALUES
('CASHIER', 'Cashier', 'Cashier''s Office', 'Financial Services & Payment Processing', 'Ms. Ana Reyes', 'cashier@smcl.edu.ph', 1),
('LIBRARY', 'Library', 'Library Services', 'Library Resources & Book Management', 'Mr. Jose Dela Cruz', 'library@smcl.edu.ph', 2),
('GUIDANCE', 'Guidance', 'Guidance Office', 'Student Counseling & Support Services', 'Dr. Carmen Lopez', 'guidance@smcl.edu.ph', 3),
('CLINIC', 'Clinic', 'Health Services', 'Health Services & Medical Records', 'Nurse Maria Garcia', 'clinic@smcl.edu.ph', 4),
('REGISTRAR', 'Registrar', 'Registrar''s Office', 'Academic Records & Registration', 'Ms. Rosa Martinez', 'registrar@smcl.edu.ph', 5);

-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, full_name, email, contact_number, address, program, section, year_level, semester, academic_year) VALUES
('2024-001', 'Maria', 'Santos', 'Maria Santos', 'maria.santos@student.smcl.edu.ph', '+63 912 345 6789', '123 Main St, Biñan, Laguna', 'Bachelor of Science in Information Technology', 'BSIT-4A', '4th Year', '2nd Semester', '2024-2025'),
('2024-002', 'John', 'Doe', 'John Doe', 'john.doe@student.smcl.edu.ph', '+63 912 345 6790', '456 Oak Ave, Biñan, Laguna', 'Bachelor of Science in Business Administration', 'BSBA-3B', '3rd Year', '2nd Semester', '2024-2025'),
('2024-003', 'Jane', 'Smith', 'Jane Smith', 'jane.smith@student.smcl.edu.ph', '+63 912 345 6791', '789 Pine St, Biñan, Laguna', 'Bachelor of Science in Education', 'BSED-2C', '2nd Year', '2nd Semester', '2024-2025'),
('2024-004', 'Carlos', 'Rodriguez', 'Carlos Rodriguez', 'carlos.rodriguez@student.smcl.edu.ph', '+63 912 345 6792', '321 Elm St, Biñan, Laguna', 'Bachelor of Science in Criminology', 'BSCRIM-1A', '1st Year', '2nd Semester', '2024-2025');

-- Insert sample clearances
INSERT INTO clearances (clearance_id, student_id, semester, academic_year, unique_token, status, expires_at) VALUES
('CLR-2025-001', '2024-001', '2nd Semester', '2024-2025', 'abc123def456ghi789jkl012', 'in_progress', '2025-02-15 23:59:59'),
('CLR-2025-002', '2024-002', '2nd Semester', '2024-2025', 'xyz789abc123def456ghi789', 'pending', '2025-02-14 23:59:59'),
('CLR-2025-003', '2024-003', '2nd Semester', '2024-2025', 'def456ghi789jkl012mno345', 'pending', '2025-02-16 23:59:59'),
('CLR-2025-004', '2024-004', '2nd Semester', '2024-2025', 'ghi789jkl012mno345pqr678', 'pending', '2025-02-17 23:59:59');

-- Insert clearance items for each student and department
INSERT INTO clearance_items (clearance_id, department_code, student_id, status, priority) VALUES
-- Maria Santos (2024-001)
('CLR-2025-001', 'CASHIER', '2024-001', 'approved', 'high'),
('CLR-2025-001', 'LIBRARY', '2024-001', 'approved', 'high'),
('CLR-2025-001', 'GUIDANCE', '2024-001', 'pending', 'high'),
('CLR-2025-001', 'CLINIC', '2024-001', 'pending', 'high'),
('CLR-2025-001', 'REGISTRAR', '2024-001', 'pending', 'high'),

-- John Doe (2024-002)
('CLR-2025-002', 'CASHIER', '2024-002', 'pending', 'medium'),
('CLR-2025-002', 'LIBRARY', '2024-002', 'pending', 'medium'),
('CLR-2025-002', 'GUIDANCE', '2024-002', 'pending', 'medium'),
('CLR-2025-002', 'CLINIC', '2024-002', 'pending', 'medium'),
('CLR-2025-002', 'REGISTRAR', '2024-002', 'pending', 'medium'),

-- Jane Smith (2024-003) - Some overdue
('CLR-2025-003', 'CASHIER', '2024-003', 'overdue', 'high'),
('CLR-2025-003', 'LIBRARY', '2024-003', 'pending', 'high'),
('CLR-2025-003', 'GUIDANCE', '2024-003', 'pending', 'high'),
('CLR-2025-003', 'CLINIC', '2024-003', 'pending', 'high'),
('CLR-2025-003', 'REGISTRAR', '2024-003', 'pending', 'high'),

-- Carlos Rodriguez (2024-004)
('CLR-2025-004', 'CASHIER', '2024-004', 'pending', 'low'),
('CLR-2025-004', 'LIBRARY', '2024-004', 'pending', 'low'),
('CLR-2025-004', 'GUIDANCE', '2024-004', 'pending', 'low'),
('CLR-2025-004', 'CLINIC', '2024-004', 'pending', 'low'),
('CLR-2025-004', 'REGISTRAR', '2024-004', 'pending', 'low');

-- Insert sample department users
INSERT INTO department_users (username, email, password_hash, full_name, department_code, permissions) VALUES
('ana.reyes', 'ana.reyes@smcl.edu.ph', '$2b$10$example_hash_here', 'Ms. Ana Reyes', 'CASHIER', '{"approve": true, "bulk_approve": true, "manage_signatures": true}'),
('jose.delacruz', 'jose.delacruz@smcl.edu.ph', '$2b$10$example_hash_here', 'Mr. Jose Dela Cruz', 'LIBRARY', '{"approve": true, "bulk_approve": true, "manage_signatures": true}'),
('carmen.lopez', 'carmen.lopez@smcl.edu.ph', '$2b$10$example_hash_here', 'Dr. Carmen Lopez', 'GUIDANCE', '{"approve": true, "bulk_approve": true, "manage_signatures": true}'),
('maria.garcia', 'maria.garcia@smcl.edu.ph', '$2b$10$example_hash_here', 'Nurse Maria Garcia', 'CLINIC', '{"approve": true, "bulk_approve": true, "manage_signatures": true}'),
('rosa.martinez', 'rosa.martinez@smcl.edu.ph', '$2b$10$example_hash_here', 'Ms. Rosa Martinez', 'REGISTRAR', '{"approve": true, "bulk_approve": true, "manage_signatures": true}');

-- Insert sample e-signatures
INSERT INTO e_signatures (department_code, officer_name, image_data, coordinates, styling, notes, uploaded_by) VALUES
('CASHIER', 'Ms. Ana Reyes', 'data:image/png;base64,sample_signature_data_1', '{"x": 50, "y": 100, "width": 200, "height": 60}', '{"opacity": 1.0, "rotation": 0, "borderWidth": 0}', 'Official signature for cashier approvals', 'ana.reyes'),
('LIBRARY', 'Mr. Jose Dela Cruz', 'data:image/png;base64,sample_signature_data_2', '{"x": 50, "y": 100, "width": 200, "height": 60}', '{"opacity": 1.0, "rotation": 0, "borderWidth": 0}', 'Official signature for library approvals', 'jose.delacruz');

-- Insert sample approval history
INSERT INTO approval_history (clearance_item_id, student_id, department_code, action, previous_status, new_status, approved_by, signature_id) VALUES
(1, '2024-001', 'CASHIER', 'approve', 'pending', 'approved', 'Ms. Ana Reyes', 1),
(2, '2024-001', 'LIBRARY', 'approve', 'pending', 'approved', 'Mr. Jose Dela Cruz', 2);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description, data_type) VALUES
('clearance_expiry_days', '30', 'Number of days before clearance expires', 'number'),
('enable_email_notifications', 'true', 'Enable email notifications for students', 'boolean'),
('max_signature_file_size', '5242880', 'Maximum signature file size in bytes (5MB)', 'number'),
('pdf_template_version', '2025.1', 'Current PDF template version', 'string'),
('bulk_approval_limit', '50', 'Maximum number of students that can be bulk approved at once', 'number');
