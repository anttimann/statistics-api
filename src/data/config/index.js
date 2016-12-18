const config = {
  mongodbUrl: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/',
  mongodbDb: process.env.OPENSHIFT_APP_NAME || 'stats'
};

export default config;
