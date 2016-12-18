import swagger from 'hapi-swagger';
import inert from 'inert';
import vision from 'vision';
import pxnet from './src/pxnet';
import data from './src/data';
import config from './src/config';
import packageJson from './package.json';

function register(server, options, next) {
  const plugins = [
    { register: vision },
    { register: inert },
    { register: swagger },
    { register: data },
    { register: pxnet }
  ];
    
  server.register(plugins, (err) => {
    next();
  });
}

register.attributes = {
  pkg: packageJson
};

export default register;
