function addDataProvider(server, name, getSources, getOptions, getSeries) {
  const newProvider = {
    name: name,
    getSources: getSources,
    getOptions: getOptions,
    getSeries: getSeries
  };

  server.app.providers = [ ...server.app.providers || [], newProvider ];
}

export {
  addDataProvider
};