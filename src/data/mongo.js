import Promise from 'bluebird';
import MongoDB from 'mongodb';
import config from './config';


const mongoDB = Promise.promisifyAll(MongoDB);
const MongoClient = mongoDB.MongoClient;

function init(server) {
  MongoClient.connectAsync(config.mongodbUrl + config.mongodbDb, { uri_decode_auth: true })
    .then(function (db) {
      server.app.database = db;
    });
}

module.exports = {
  init: init
};