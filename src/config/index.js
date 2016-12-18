module.exports = {
  host: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  port: parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000,
  hapi: {
    options: {}
  }
};
