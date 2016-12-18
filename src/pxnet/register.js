import * as controller from './controller';
import { addDataProvider } from '../providers';

function register(server, options, next) {
  addDataProvider(server, 'pxnet', controller.getSources, controller.getOptions, controller.getSeries);
  next();
}

register.attributes = {
  name: 'pxnet',
  version: '1.0.0'
};

export default register;