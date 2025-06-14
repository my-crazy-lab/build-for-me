-- ============================================================================
-- INSTATUS CLONE DATABASE SCHEMA
-- PostgreSQL Database Schema for Status Page System
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{
        "language": "en",
        "theme": "light",
        "timezone": "UTC",
        "email_notifications": true,
        "sms_notifications": false
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    custom_domain VARCHAR(255),
    branding JSONB DEFAULT '{
        "primary_color": "#3b82f6",
        "secondary_color": "#1e40af",
        "background_color": "#ffffff",
        "text_color": "#1f2937",
        "font_family": "Inter, sans-serif"
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMPONENTS TABLE
-- ============================================================================

CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'operational' CHECK (status IN (
        'operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'
    )),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INCIDENTS TABLE
-- ============================================================================

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'investigating' CHECK (status IN (
        'investigating', 'identified', 'monitoring', 'resolved'
    )),
    impact VARCHAR(50) DEFAULT 'minor' CHECK (impact IN (
        'none', 'minor', 'major', 'critical'
    )),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    affected_components UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INCIDENT UPDATES TABLE
-- ============================================================================

CREATE TABLE incident_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN (
        'investigating', 'identified', 'monitoring', 'resolved'
    )),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUBSCRIBERS TABLE
-- ============================================================================

CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(50),
    notify_by TEXT[] DEFAULT ARRAY['email'],
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure at least one contact method is provided
    CONSTRAINT check_contact_method CHECK (
        email IS NOT NULL OR phone IS NOT NULL
    )
);

-- ============================================================================
-- UPTIME CHECKS TABLE
-- ============================================================================

CREATE TABLE uptime_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    component_id UUID REFERENCES components(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    method VARCHAR(10) DEFAULT 'GET' CHECK (method IN (
        'GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'
    )),
    headers JSONB DEFAULT '{}',
    body TEXT,
    timeout INTEGER DEFAULT 30, -- seconds
    interval_seconds INTEGER DEFAULT 300, -- 5 minutes
    expected_status_codes INTEGER[] DEFAULT ARRAY[200],
    keyword_check TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_status VARCHAR(20) DEFAULT 'unknown' CHECK (last_status IN (
        'up', 'down', 'unknown'
    )),
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- UPTIME LOGS TABLE
-- ============================================================================

CREATE TABLE uptime_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uptime_check_id UUID NOT NULL REFERENCES uptime_checks(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('up', 'down', 'unknown')),
    response_time_ms INTEGER,
    status_code INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL CHECK (channel IN (
        'email', 'sms', 'slack', 'webhook', 'discord'
    )),
    recipient TEXT NOT NULL,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'sent', 'failed', 'retrying'
    )),
    sent_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_custom_domain ON projects(custom_domain);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Components
CREATE INDEX idx_components_project_id ON components(project_id);
CREATE INDEX idx_components_status ON components(status);
CREATE INDEX idx_components_position ON components(position);

-- Incidents
CREATE INDEX idx_incidents_project_id ON incidents(project_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_start_time ON incidents(start_time);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);

-- Incident Updates
CREATE INDEX idx_incident_updates_incident_id ON incident_updates(incident_id);
CREATE INDEX idx_incident_updates_created_at ON incident_updates(created_at);

-- Subscribers
CREATE INDEX idx_subscribers_project_id ON subscribers(project_id);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_phone ON subscribers(phone);
CREATE INDEX idx_subscribers_is_verified ON subscribers(is_verified);

-- Uptime Checks
CREATE INDEX idx_uptime_checks_project_id ON uptime_checks(project_id);
CREATE INDEX idx_uptime_checks_component_id ON uptime_checks(component_id);
CREATE INDEX idx_uptime_checks_is_active ON uptime_checks(is_active);
CREATE INDEX idx_uptime_checks_last_checked_at ON uptime_checks(last_checked_at);

-- Uptime Logs
CREATE INDEX idx_uptime_logs_uptime_check_id ON uptime_logs(uptime_check_id);
CREATE INDEX idx_uptime_logs_status ON uptime_logs(status);
CREATE INDEX idx_uptime_logs_checked_at ON uptime_logs(checked_at);

-- Notifications
CREATE INDEX idx_notifications_incident_id ON notifications(incident_id);
CREATE INDEX idx_notifications_project_id ON notifications(project_id);
CREATE INDEX idx_notifications_channel ON notifications(channel);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uptime_checks_updated_at BEFORE UPDATE ON uptime_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Project overview with stats
CREATE VIEW project_overview AS
SELECT 
    p.*,
    u.name as owner_name,
    u.email as owner_email,
    COUNT(DISTINCT c.id) as components_count,
    COUNT(DISTINCT i.id) as incidents_count,
    COUNT(DISTINCT s.id) as subscribers_count,
    COUNT(DISTINCT uc.id) as uptime_checks_count
FROM projects p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN components c ON p.id = c.project_id
LEFT JOIN incidents i ON p.id = i.project_id
LEFT JOIN subscribers s ON p.id = s.project_id
LEFT JOIN uptime_checks uc ON p.id = uc.project_id
GROUP BY p.id, u.name, u.email;

-- Active incidents view
CREATE VIEW active_incidents AS
SELECT 
    i.*,
    p.name as project_name,
    p.slug as project_slug,
    array_agg(c.name) FILTER (WHERE c.id = ANY(i.affected_components)) as affected_component_names
FROM incidents i
JOIN projects p ON i.project_id = p.id
LEFT JOIN components c ON c.id = ANY(i.affected_components)
WHERE i.status != 'resolved'
GROUP BY i.id, p.name, p.slug;

-- Uptime statistics view
CREATE VIEW uptime_statistics AS
SELECT 
    uc.id,
    uc.name,
    uc.url,
    uc.project_id,
    COUNT(ul.id) as total_checks,
    COUNT(ul.id) FILTER (WHERE ul.status = 'up') as successful_checks,
    COUNT(ul.id) FILTER (WHERE ul.status = 'down') as failed_checks,
    CASE 
        WHEN COUNT(ul.id) > 0 THEN 
            ROUND((COUNT(ul.id) FILTER (WHERE ul.status = 'up')::DECIMAL / COUNT(ul.id)) * 100, 2)
        ELSE 0 
    END as uptime_percentage,
    AVG(ul.response_time_ms) FILTER (WHERE ul.response_time_ms IS NOT NULL) as avg_response_time
FROM uptime_checks uc
LEFT JOIN uptime_logs ul ON uc.id = ul.uptime_check_id
WHERE ul.checked_at >= NOW() - INTERVAL '30 days'
GROUP BY uc.id, uc.name, uc.url, uc.project_id;

-- ============================================================================
-- SAMPLE DATA FUNCTIONS
-- ============================================================================

-- Function to create sample data for development
CREATE OR REPLACE FUNCTION create_sample_data()
RETURNS VOID AS $$
DECLARE
    demo_user_id UUID;
    demo_project_id UUID;
    api_component_id UUID;
    web_component_id UUID;
    db_component_id UUID;
BEGIN
    -- Create demo user
    INSERT INTO users (email, name, password_hash, email_verified)
    VALUES ('demo@instatus.com', 'Demo User', '$2b$10$example_hash', TRUE)
    RETURNING id INTO demo_user_id;
    
    -- Create demo project
    INSERT INTO projects (user_id, name, slug, description)
    VALUES (
        demo_user_id, 
        'Demo Status Page', 
        'demo-status', 
        'A demonstration status page for testing purposes'
    )
    RETURNING id INTO demo_project_id;
    
    -- Create demo components
    INSERT INTO components (project_id, name, description, status, position)
    VALUES 
        (demo_project_id, 'API Server', 'Main API backend service', 'operational', 1),
        (demo_project_id, 'Website', 'Main website and dashboard', 'operational', 2),
        (demo_project_id, 'Database', 'Primary PostgreSQL database', 'operational', 3)
    RETURNING id INTO api_component_id;
    
    -- Get component IDs for uptime checks
    SELECT id INTO web_component_id FROM components 
    WHERE project_id = demo_project_id AND name = 'Website';
    
    SELECT id INTO db_component_id FROM components 
    WHERE project_id = demo_project_id AND name = 'Database';
    
    -- Create sample uptime checks
    INSERT INTO uptime_checks (project_id, component_id, name, url, interval_seconds)
    VALUES 
        (demo_project_id, api_component_id, 'API Health Check', 'https://api.example.com/health', 300),
        (demo_project_id, web_component_id, 'Website Check', 'https://example.com', 300);
    
    -- Create sample subscribers
    INSERT INTO subscribers (project_id, email, notify_by, is_verified)
    VALUES 
        (demo_project_id, 'subscriber1@example.com', ARRAY['email'], TRUE),
        (demo_project_id, 'subscriber2@example.com', ARRAY['email'], TRUE);
    
    RAISE NOTICE 'Sample data created successfully!';
    RAISE NOTICE 'Demo user: demo@instatus.com';
    RAISE NOTICE 'Demo project slug: demo-status';
END;
$$ LANGUAGE plpgsql;
