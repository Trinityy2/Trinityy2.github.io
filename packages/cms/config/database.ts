export default ({ env }: { env: any }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'postgres'),
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'personal_website'),
      user: env('DATABASE_USERNAME', 'personal_website_user'),
      password: env('DATABASE_PASSWORD', 'personal_website_pass'),
      ssl: env.bool('DATABASE_SSL', false),
      schema: env('DATABASE_SCHEMA', 'strapi'),
    },
  },
});