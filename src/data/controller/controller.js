import Boom from 'boom';
import mongo from 'mongodb';

async function getSubjects(req, reply) {
  const db = req.server.app.database;
  const providers = req.server.app.providers || [];

  try {
    const dbData = await db.collection('data').find({}, { '_id': false }).toArrayAsync();
    reply(dbData);
  }
  catch (err) {
    console.log(err);
    reply(Boom.badRequest(err));
  }
}

async function getOptions(req, reply) {
  const db = req.server.app.database;
  const providers = req.server.app.providers || [];

  try {
    const dbData = await db.collection('data').findOneAsync({ id: req.payload.ids[ 0 ] }, { '_id': false });

    if (!dbData) {
      return reply(Boom.badRequest('No such provider available'));
    }

    const provider = providers.find((p) => p.name == dbData.provider);

    if (!provider) {
      return reply(Boom.badRequest('No such data available'));
    }

    const options = await provider.getOptions(req.payload.ids);
    reply(options);
  }
  catch (err) {
    console.log(err);
    reply(err);
  }
}

async function getSeries(req, reply) {
  const db = req.server.app.database;
  const providers = req.server.app.providers || [];

  try {
    const dbData = await db.collection('data').findOneAsync({ id: req.payload.ids[ 0 ] }, { '_id': false });
    const provider = providers.find((p) => p.name == dbData.provider);

    if (!dbData || !provider) {
      return reply(Boom.badRequest('No such data available'));
    }

    const series = await provider.getSeries(req.payload.ids, req.payload.options);
    reply(series);
  }
  catch (err) {
    console.log(err);
    reply(err);
  }
}

export {
  getOptions,
  getSeries,
  getSubjects
};
