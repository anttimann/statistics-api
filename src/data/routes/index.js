import Joi from 'joi';
import * as controller from '../controller';

module.exports = [
  {
    method: 'GET',
    path: '/data',
    handler: controller.getSubjects,
    config: {
      tags: [ 'api' ],
      description: 'Get sources types'
    }
  }, {
    method: 'POST',
    path: '/data/options',
    handler: controller.getOptions,
    config: {
      tags: [ 'api' ],
      description: 'Get source options for series creation',
      validate: {
        payload: {
          ids: Joi.array().required()
        }
      }
    }
  }, {
    method: 'POST',
    path: '/data/series',
    handler: controller.getSeries,
    config: {
      tags: [ 'api' ],
      description: 'Get series.',
      validate: {
        payload: {
          ids: Joi.array().required(),
          options: Joi.array().items(Joi.object().keys({
            id: Joi.string().required(),
            values: Joi.array().required()
          })).required()
        }
      }
    }
  }
];