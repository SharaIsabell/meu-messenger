import 'dotenv/config';

export const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  inviteCode: process.env.INVITE_CODE,
};

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET não definido no arquivo .env');
}