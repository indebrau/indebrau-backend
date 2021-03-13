const {
  activeGraphCache,
  sensorCache,
  addSensorDataToCache,
} = require('../../utils/caches');
const { checkUserPermissions } = require('../../utils/checkUserPermissions');

const graphMutations = {
  async createGraph(parent, args, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    let sensors = await sensorCache(ctx);
    // Mind, that it is possible to connect a graph to an already
    // ended brewing process (step). Then, this graph will not be "active".
    let steps = await ctx.prisma.brewingStep.findMany({
      where: {
        AND: [
          { brewingProcessId: parseInt(args.brewingProcessId) },
          { name: args.brewingStepName },
        ],
      },
    });
    if (steps[0] != null && sensors.has(args.sensorTopic)) {
      let createdGraph = await ctx.prisma.graph.create({
        data: {
          updateFrequency: args.updateFrequency,
          brewingStep: { connect: { id: steps[0].id } },
          sensor: { connect: { topic: args.sensorTopic } },
        },
      });
      await activeGraphCache(ctx, true);
      return createdGraph;
    }

    throw new Error(`Could not create graph..`);
  },

  async deleteGraph(parent, { id }, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    await ctx.prisma.graph.delete({ where: { id: parseInt(id) } });
    await activeGraphCache(ctx, true);
    return { message: 'Deleted!' };
  },

  async addSensorData(
    parent,
    { sensorTopic, sensorValue, sensorTimeStamp },
    ctx
  ) {
    checkUserPermissions(ctx, ['ADMIN']);
    // add value to sensor data cache first and fetch graphs from cache
    addSensorDataToCache(ctx, sensorTopic, sensorValue, sensorTimeStamp);
    const activeGraphs = await activeGraphCache(ctx);
    let insertedGraphData = [];
    // get active graphs with matching sensor name
    for (let i = 0; i < activeGraphs.length; i++) {
      const activeGraph = activeGraphs[i];
      if (activeGraph.sensorTopic == sensorTopic) {
        // if found, get latest graph data and compare timestamp to
        // determine if it has to be inserted
        const earliestDate =
          new Date(sensorTimeStamp).getTime() -
          activeGraph.updateFrequency * 1000; // last entry must be at least this old
        // see if graph data new than this date can be found
        const oldEnoughLatestGraphData = await ctx.prisma.graphData.findMany({
          where: {
            AND: [
              { graph: { id: activeGraph.id } },
              { time: { gt: new Date(earliestDate) } },
            ],
          },
        });
        // if not, insert
        if (oldEnoughLatestGraphData.length == 0) {
          insertedGraphData.push(
            await ctx.prisma.graphData.create({
              data: {
                time: sensorTimeStamp,
                value: sensorValue,
                graph: {
                  connect: { id: activeGraph.id },
                },
              },
            })
          );
        }
      }
    }
    // check if some graph was found
    if (insertedGraphData.length == 0) {
      throw new Error(
        `Did not add to any graphs with sensor name ${sensorTopic}`
      );
    }
    return insertedGraphData;
  },
};

module.exports = { graphMutations };
