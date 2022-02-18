module.exports = {
  PRODUCTION_DB: process.env.PRODUCTION_DB || "pqrsd",
  DEVELOPMENT_DB: process.env.DEVELOPMENT_DB || "pqrsd_dev",
  DB_HOST: "localhost",
  DB_USER: "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  ENVIRONMENT: process.env.NODE_ENV || "development",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || "",
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || "",
  APP_PORT: process.env.PORT || '3001',
  S3_PUBLIC_BUCKET: process.env.S3_PUBLIC_BUCKET || "",
  S3_PRIVATE_BUCKET: process.env.S3_PRIVATE_BUCKET || "",
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL || "",
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID || '',
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || '',
  S3_REGION: process.env.S3_REGION || 'us-east-1'
};