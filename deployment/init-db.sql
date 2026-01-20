-- Create separate schemas for strapi and application data
CREATE SCHEMA
IF NOT EXISTS strapi;
CREATE SCHEMA
IF NOT EXISTS app;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA strapi TO personal_website_user;
GRANT ALL PRIVILEGES ON SCHEMA app TO personal_website_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA strapi TO personal_website_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO personal_website_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA strapi TO personal_website_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO personal_website_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA strapi
GRANT ALL PRIVILEGES ON TABLES TO personal_website_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT ALL PRIVILEGES ON TABLES TO personal_website_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA strapi
GRANT ALL PRIVILEGES ON SEQUENCES TO personal_website_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT ALL PRIVILEGES ON SEQUENCES TO personal_website_user;