-- Complete database schema for e-Clearance system

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
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    enrollment_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    full_name VARCHAR(300) NOT NULL,
    description TEXT,
    officer_name VARCHAR(200) NOT NULL,
    officer_email VARCHAR(255) NOT NULL,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clearances table (main clearance records)
CREATE TABLE IF NOT EXISTS clearances (
    id SERIAL PRIMARY KEY,
    clearance_id VARCHAR(50) UNIQUE NOT NULL,
    student_id VARCHAR(20) REFERENCES students(student_id),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    unique_token VARCHAR(100) UNIQUE NOT NULL,
    qr_code_data TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, expired
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP,
    access_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clearance items table (department-specific clearances)
CREATE TABLE IF NOT EXISTS clearance_items (
    id SERIAL PRIMARY KEY,
    clearance_id VARCHAR(50) REFERENCES clearances(clearance_id),
    department_code VARCHAR(20) REFERENCES departments(department_code),
    student_id VARCHAR(20) REFERENCES students(student_id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, overdue
    priority VARCHAR(10) DEFAULT 'medium', -- high, medium, low
    approved_by VARCHAR(200),
    approved_at TIMESTAMP,
    remarks TEXT,
    signature_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-signatures table
CREATE TABLE IF NOT EXISTS e_signatures (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(20) REFERENCES departments(department_code),
    officer_name VARCHAR(200) NOT NULL,
    image_data TEXT NOT NULL, -- Base64 or file path
    image_url VARCHAR(500), -- URL to stored image file
    file_size INTEGER,
    file_type VARCHAR(50),
    coordinates JSONB NOT NULL, -- {x, y, width, height}
    styling JSONB, -- {opacity, rotation, borderWidth, etc.}
    notes TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Department users table (for authentication)
CREATE TABLE IF NOT EXISTS department_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    department_code VARCHAR(20) REFERENCES departments(department_code),
    role VARCHAR(50) DEFAULT 'officer', -- officer, admin, viewer
    permissions JSONB, -- {approve: true, bulk_approve: true, manage_signatures: true}
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approval history table (audit trail)
CREATE TABLE IF NOT EXISTS approval_history (
    id SERIAL PRIMARY KEY,
    clearance_item_id INTEGER REFERENCES clearance_items(id),
    student_id VARCHAR(20) REFERENCES students(student_id),
    department_code VARCHAR(20) REFERENCES departments(department_code),
    action VARCHAR(50) NOT NULL, -- approve, reject, bulk_approve
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    approved_by VARCHAR(200) NOT NULL,
    remarks TEXT,
    signature_id INTEGER REFERENCES e_signatures(id),
    batch_id VARCHAR(100), -- For bulk operations
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(student_id),
    clearance_id VARCHAR(50) REFERENCES clearances(clearance_id),
    type VARCHAR(50) NOT NULL, -- approval, rejection, expiry_warning, completion
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    department_code VARCHAR(20),
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    is_public BOOLEAN DEFAULT false,
    updated_by VARCHAR(200),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_clearances_student_id ON clearances(student_id);
CREATE INDEX IF NOT EXISTS idx_clearances_token ON clearances(unique_token);
CREATE INDEX IF NOT EXISTS idx_clearances_status ON clearances(status);
CREATE INDEX IF NOT EXISTS idx_clearances_expires_at ON clearances(expires_at);
CREATE INDEX IF NOT EXISTS idx_clearance_items_clearance_id ON clearance_items(clearance_id);
CREATE INDEX IF NOT EXISTS idx_clearance_items_department ON clearance_items(department_code);
CREATE INDEX IF NOT EXISTS idx_clearance_items_status ON clearance_items(status);
CREATE INDEX IF NOT EXISTS idx_clearance_items_priority ON clearance_items(priority);
CREATE INDEX IF NOT EXISTS idx_e_signatures_department ON e_signatures(department_code);
CREATE INDEX IF NOT EXISTS idx_e_signatures_active ON e_signatures(is_active);
CREATE INDEX IF NOT EXISTS idx_approval_history_student ON approval_history(student_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_department ON approval_history(department_code);
CREATE INDEX IF NOT EXISTS idx_approval_history_timestamp ON approval_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(is_read);
