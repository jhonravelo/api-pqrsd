module.exports = {
  email: {
    sender: '"Portal secretaria cucuta" <noreply@secretariacucuta.com>',
  },
  links: {
    host: process.env.APP_HOST
  },
  general: {
    environment: process.env.APP_ENVIRONMENT || "development",
    port: process.env.PORT || '3001',
  },
  database: {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD || "",
    db: process.env.DEVELOPMENT_DB || "pqrsd_dev",
  },
  
  S3_REGION: process.env.S3_REGION || 'us-east-1'
};
