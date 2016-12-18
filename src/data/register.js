import routes from './routes';
import mongo from './mongo';
import { startDataLoader } from '../providers';


function register(server, options, next) {
  mongo.init(server);
  server.route(routes);
  setTimeout(() => startDataLoader(server.app.database, server.app.providers), 2000);
  
  next();
}

register.attributes = {
  name: 'data',
  version: '1.0.0'
};

export default register;