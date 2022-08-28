export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      url: process.env.URL_MONGO_DB
    },
    jwt: {
      secret: process.env.SECRET_TOKEN,
      expiresIn: process.env.EXPIRESIN_TOKEN
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_EMAIL_CLIENT
    },
    email: {
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    }
  });