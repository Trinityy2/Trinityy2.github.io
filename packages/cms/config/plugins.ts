export default ({ env }: { env: any }) => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh', // Enable refresh token mode
      sessions: {
        accessTokenLifespan: env.int('JWT_ACCESS_TOKEN_LIFESPAN', 900), // 15 minutes
        maxRefreshTokenLifespan: env.int('JWT_MAX_REFRESH_TOKEN_LIFESPAN', 604800), // 7 days
        idleRefreshTokenLifespan: env.int('JWT_IDLE_REFRESH_TOKEN_LIFESPAN', 86400), // 1 day
        httpOnly: env.bool('JWT_HTTP_ONLY', false), // Set to true in production
        cookie: {
          name: 'strapi_refresh',
          sameSite: env('JWT_COOKIE_SAME_SITE', 'lax'),
          path: '/',
          secure: env.bool('JWT_COOKIE_SECURE', false), // true in production
        },
      },
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Personal Website API',
        description: 'API documentation for personal website CMS',
      },
      servers: [
        {
          url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'),
          description: 'Development server',
        },
      ],
    },
  },
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: env.int('MAX_FILE_SIZE', 10000000), // 10MB
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@personalwebsite.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'noreply@personalwebsite.com'),
      },
    },
  },
});