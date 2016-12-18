function startDataLoader(db, providers) {
  loadData(db, providers);
  setInterval(() => loadData(db, providers), 24 * 60 * 1000);
}

async function loadData(db, providers) {
  const dataAgeLimit = new Date().getTime() - (24 * 60 * 1000);
  try {
    const dbData = await db.collection('data').find(
      { createdAt: { $gt: dataAgeLimit } },
      { '_id': false }).toArrayAsync();
    const missingProviders = providers
      .filter((provider) => !dbData.find((e) => e.provider === provider.name));
    
    console.log(`Missing or outdated providers: ${JSON.stringify(missingProviders)}`);
    
    await Promise.all(missingProviders.map(async (provider) => {
      console.log(`${provider.name} loading started`);
      const sources = await provider.getSources();

      await db.collection('data').removeAsync({
        provider: provider.name
      });
      
      await db.collection('data').insertAsync(sources.map((s) => ({
        provider: provider.name,
        createdAt: new Date().getTime(),
        ...s
      })));
      console.log(`${provider.name} added to database`)
    }));
  }
  catch(err) {
    console.log(err);
  }
}

export {
  startDataLoader
};