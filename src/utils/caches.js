/* Helper function that caches active graphs (to speed up inserts). */
var cachedActiveGraphs = null;
async function activeGraphCache(ctx, update) {
  if (cachedActiveGraphs == null || update) {
    ctx.logger.app('Refreshing active graph list...');
    cachedActiveGraphs = [];
    try {
      const queryResult = await ctx.prisma.brewingProcess.findMany({
        select: {
          brewingSteps: {
            where: { end: null, NOT: [{ start: null }] },
            select: { graphs: {} },
          },
        },
      });
      if (queryResult) {
        queryResult.map((process) => {
          process.brewingSteps.map((graphs) => {
            cachedActiveGraphs = cachedActiveGraphs.concat(graphs.graphs);
          });
        });
      }
    } catch (e) {
      throw new Error(`Problems updating active graph cache: ${e}`);
    }
  }
  return cachedActiveGraphs;
}

/* Helper function that caches active media streams (to speed up inserts). */
var cachedMediaStreams = null;
async function activeMediaStreamsCache(ctx, update) {
  if (cachedMediaStreams == null || update) {
    ctx.logger.app('Refreshing active media stream list...');
    cachedMediaStreams = [];
    try {
      const queryResult = await ctx.prisma.brewingProcess.findMany({
        select: {
          brewingSteps: {
            where: { end: null, NOT: [{ start: null }] },
            select: { mediaStreams: {} },
          },
        },
      });
      if (queryResult) {
        queryResult.map((process) => {
          process.brewingSteps.map((streams) => {
            cachedMediaStreams = cachedMediaStreams.concat(
              streams.mediaStreams
            );
          });
        });
      }
    } catch (e) {
      throw new Error(`Problems updating media stream cache: ${e}`);
    }
  }
  return cachedMediaStreams;
}

/* Returns sensor cache. */
var cachedSensors = null;
async function sensorCache(ctx, update) {
  if (cachedSensors == null || update) {
    ctx.logger.app('Refreshing sensors...');
    cachedSensors = new Map();
    try {
      const queryResult = await ctx.prisma.sensor.findMany();
      if (queryResult) {
        queryResult.map((sensor) => {
          cachedSensors.set(sensor.topic, {
            name: sensor.name,
            binary: sensor.binary,
          });
        });
      }
    } catch (e) {
      throw new Error(`Problems updating sensor cache: ${e}`);
    }
  }
  return cachedSensors;
}

/* Cache all incoming sensor data (regardless of graph) */
async function addSensorDataToCache(ctx, topic, value, timeStamp) {
  // check for initialization
  if (cachedSensors == null) {
    await sensorCache(ctx);
  }
  if (topic != null && value != null && timeStamp != null) {
    if (cachedSensors.has(topic)) {
      let entry = cachedSensors.get(topic); // get the currently stored data
      entry.value = value;
      entry.timeStamp = timeStamp;
      cachedSensors.set(topic, entry);
    } else {
      throw new Error('Sensor data cache: sensor does not exist!');
    }
  } else {
    throw new Error('Sensor data cache: missing values to add!');
  }
}

module.exports = {
  activeGraphCache,
  activeMediaStreamsCache,
  addSensorDataToCache,
  sensorCache,
};
