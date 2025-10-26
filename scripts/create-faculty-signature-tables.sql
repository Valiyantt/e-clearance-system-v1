-- Additional tables for faculty signature management

-- Faculty signatures table
CREATE TABLE IF NOT EXISTS faculty_signatures (
    id SERIAL PRIMARY KEY,
    clearance_item_id INTEGER REFERENCES clearance_items(id),
    student_id VARCHAR(20) REFERENCES students(student_id),
    department VARCHAR(200) NOT NULL,
    faculty_name VARCHAR(200) NOT NULL,
    faculty_signature VARCHAR(200) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'approve', 'reject', 'require_payment'
    remarks TEXT,
    payment_amount DECIMAL(10,2),
    signature_image TEXT, -- Base64 encoded signature
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty users table (for authentication)
CREATE TABLE IF NOT EXISTS faculty_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    department VARCHAR(200) NOT NULL,
    position VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    can_sign BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clearance notifications table
CREATE TABLE IF NOT EXISTS clearance_notifications (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(student_id),
    clearance_id VARCHAR(50) REFERENCES clearances(clearance_id),
    type VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'payment_required', 'completed'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    department VARCHAR(200),
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_signatures_clearance_item ON faculty_signatures(clearance_item_id);
CREATE INDEX IF NOT EXISTS idx_faculty_signatures_student ON faculty_signatures(student_id);
CREATE INDEX IF NOT EXISTS idx_faculty_signatures_department ON faculty_signatures(department);
CREATE INDEX IF NOT EXISTS idx_faculty_users_department ON faculty_users(department);
CREATE INDEX IF NOT EXISTS idx_clearance_notifications_student ON clearance_notifications(student_id);
