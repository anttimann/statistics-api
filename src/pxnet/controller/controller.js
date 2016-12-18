import Promise from 'bluebird';
import Request from 'request';
import _ from 'lodash';
import iconv from 'iconv-lite';
import Boom from 'boom';
import config from '../config';
import helper from './helper';


const request = Promise.promisify(Request);

async function getSources() {
  try {
    const sources = await queryData('');

    return await Promise.all(sources.map(async (s) => {
      const subjects = await getSubjects(s.dbid);

      return Promise.resolve({
        id: s.dbid,
        text: s.text.replace(/_/g, ' ').replace('StatFin', 'Tilastokeskus'),
        subjects: subjects.length ? subjects : undefined
      });
    }));
  }
  catch (err) {
    console.log(err);
    return Promise.reject([]);
  }
}

async function getSubjects(id) {
  try {
    const subjectData = await querySubjects(id);

    return Promise.all(subjectData.map(async (e) => {
      if (e.type === 't') {
        return Promise.resolve({
          id: e.id,
          text: e.text
        });
      }
      const subjects = await getSubjects(`${id}/${e.id}`);

      return Promise.resolve({
        id: e.id,
        text: e.text,
        subjects: subjects
      })
    }));
  }
  catch (err) {
    console.log('getSubjects', err);
    return Promise.resolve([]);
  }
}

function getOptions(ids) {
  const id = ids.join('/');
  return queryData(id)
    .then((values) => {
      return (
        values.variables.map((e) => {
          return {
            text: e.text,
            id: e.code,
            options: _.zipWith(e.values, e.valueTexts, (id, text) => {
              return {
                id: id,
                text: text
              };
            }),
            time: isYearData(e) || undefined
          };
        })
      );
    });
}

function isYearData(entry) {
  return entry.time || [ 'vuosi', 'tilastovuosi', 'time', 'year' ].indexOf(entry.code.toLowerCase()) >= 0;
}

function getSeries(ids, options) {
  const id = ids.join('/');
  const query = helper.createDataQueryValues(options);

  return querySeries(id, query)
    .then((values) => helper.createSeries(values));
}

function querySubjects(path) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return queryData(path)
        .then(resolve)
        .catch((err) => {
          console.log('querySubjects')
          reject(err);
        });
    }, Math.random() * 20000);
  });
}

function queryData(path) {
  return request({
    uri: config.apiUrl + path
  })
    .then(convertMessage)
    .catch((err) => {
      console.log(path, err);
      Promise.reject(err);
    });
}


function querySeries(path, queryOptions) {
  return request({
    method: 'POST',
    uri: config.apiUrl + path,
    json: true,
    headers: { 'content-type': 'application/json' },
    body: {
      query: queryOptions,
      response: { format: 'json' }
    }
  })
    .then(convertMessage);
}

function convertMessage(message) {
  try {
    return _.flow(
      (e) => new Buffer(e),
      (e) => iconv.decode(e, 'UTF-8', {}),
      JSON.parse,
      Promise.resolve
    )(message.body);
  } catch (e) {
    return Promise.reject(message.body);
  }
}

export {
  getSources,
  getOptions,
  getSeries
};
