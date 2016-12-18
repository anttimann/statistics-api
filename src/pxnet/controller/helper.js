function createDataQueryValues(variables) {
  return variables.map((option) => {
    return {
      code: option.id,
      selection: {
        filter: 'item',
        values: option.values
      }
    };
  });
}

function createSeries(values) {
  const years = createLabels(values);

  const reverse = years.length > 1 && parseInt(years[ 0 ]) > parseInt(years[ 1 ]);
  const labelsInOrder = reverse ? years.reverse() : years;

  const data = createData(values);
  const dataInOrder = reverse ? data.reverse() : data;

  return labelsInOrder.map((value, index) => ({
    time: value,
    value: dataInOrder[ index ]
  }));
}


function createLabels(values) {
  const yearIndex = values.columns.findIndex((e) => isYearData(e));

  if (yearIndex === -1 || (values.data.length === 1 && isNaN(values.data[ 0 ].key[ yearIndex ]))) {
    return [ null ];
  }

  return values.data.map((e) => {
    return e.key[ yearIndex ]
  });
}

function createData(values) {
  return values.data.map((e) => {
    return Number(e.values[ 0 ]);
  });
}

function isYearData(entry) {
  return [ 'vuosi', 'tilastovuosi', 'time', 'year' ].indexOf(entry.code.toLowerCase()) >= 0;
}


module.exports = {
  createDataQueryValues: createDataQueryValues,
  createSeries: createSeries
};