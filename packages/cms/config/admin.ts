export default {
  auth: {
    secret: process.env.ADMIN_JWT_SECRET || 'your-admin-jwt-secret',
  },
  apiToken: {
    salt: process.env.API_TOKEN_SALT || 'your-api-token-salt',
  },
  transfer: {
    token: {
      salt: process.env.TRANSFER_TOKEN_SALT || 'your-transfer-token-salt',
    },
  },
  flags: {
    nps: false,
    promoteEE: false,
  },
};