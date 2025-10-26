-- Insert sample faculty users
INSERT INTO faculty_users (username, email, password_hash, full_name, department, position, is_active, can_sign) VALUES
('maria.santos', 'maria.santos@smcl.edu.ph', '$2b$10$example_hash_here', 'Ms. Maria Santos', 'Business Services Officer', 'Business Services Officer', true, true),
('jose.delacruz', 'jose.delacruz@smcl.edu.ph', '$2b$10$example_hash_here', 'Mr. Jose Dela Cruz', 'Chief Librarian', 'Chief Librarian', true, true),
('ana.reyes', 'ana.reyes@smcl.edu.ph', '$2b$10$example_hash_here', 'Ms. Ana Reyes', 'CCSC Personnel', 'CCSC Coordinator', true, true),
('roberto.martinez', 'roberto.martinez@smcl.edu.ph', '$2b$10$example_hash_here', 'Dr. Roberto Martinez', 'Chair/Administrator', 'Department Chair', true, true),
('carmen.lopez', 'carmen.lopez@smcl.edu.ph', '$2b$10$example_hash_here', 'Ms. Carmen Lopez', 'College Registrar', 'College Registrar', true, true);

-- Insert sample faculty signatures
INSERT INTO faculty_signatures (clearance_item_id, student_id, department, faculty_name, faculty_signature, action, remarks, signature_image, timestamp) VALUES
(1, '2021-001', 'Business Services Officer', 'Ms. Maria Santos', 'Maria Santos', 'approve', 'All payments cleared', 'data:image/png;base64,example_signature_data', '2025-01-15 09:00:00'),
(6, '2021-002', 'Business Services Officer', 'Ms. Maria Santos', 'Maria Santos', 'require_payment', 'Outstanding tuition balance', 'data:image/png;base64,example_signature_data', '2025-01-14 10:30:00');

-- Insert sample notifications
INSERT INTO clearance_notifications (student_id, clearance_id, type, title, message, department, is_read) VALUES
('2021-001', 'CLR-2025-001', 'approved', 'Business Services Clearance Approved', 'Your clearance for Business Services has been approved by Ms. Maria Santos.', 'Business Services Officer', false),
('2021-002', 'CLR-2025-002', 'payment_required', 'Payment Required for Clearance', 'Please settle your outstanding balance of ₱2,500 before your clearance can be approved.', 'Business Services Officer', false);
