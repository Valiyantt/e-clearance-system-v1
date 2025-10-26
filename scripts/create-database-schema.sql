-- Create database schema for the digital clearance system

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_number VARCHAR(20),
    address TEXT,
    program VARCHAR(200) NOT NULL,
    section VARCHAR(50),
    year_level VARCHAR(20) NOT NULL,
    enrollment_date DATE,
    expected_graduation DATE,
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clearances table
CREATE TABLE IF NOT EXISTS clearances (
    id SERIAL PRIMARY KEY,
    clearance_id VARCHAR(50) UNIQUE NOT NULL,
    student_id VARCHAR(20) REFERENCES students(student_id),
    unique_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    last_accessed TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clearance items table (departments/requirements)
CREATE TABLE IF NOT EXISTS clearance_items (
    id SERIAL PRIMARY KEY,
    clearance_id VARCHAR(50) REFERENCES clearances(clearance_id),
    department VARCHAR(200) NOT NULL,
    officer_name VARCHAR(200),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    payment_amount DECIMAL(10,2) DEFAULT 0,
    signed_date TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-signatures table
CREATE TABLE IF NOT EXISTS e_signatures (
    id SERIAL PRIMARY KEY,
    clearance_id VARCHAR(50) REFERENCES clearances(clearance_id),
    student_name VARCHAR(200) NOT NULL,
    student_signature VARCHAR(200) NOT NULL,
    witness_name VARCHAR(200),
    signature_date DATE NOT NULL,
    remarks TEXT,
    signature_image TEXT, -- Base64 encoded signature
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    department VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_type VARCHAR(20), -- 'student' or 'admin'
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_clearances_student_id ON clearances(student_id);
CREATE INDEX IF NOT EXISTS idx_clearances_unique_token ON clearances(unique_token);
CREATE INDEX IF NOT EXISTS idx_clearance_items_clearance_id ON clearance_items(clearance_id);
CREATE INDEX IF NOT EXISTS idx_e_signatures_clearance_id ON e_signatures(clearance_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
