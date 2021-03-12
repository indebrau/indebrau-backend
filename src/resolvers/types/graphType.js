const { reduceDataEvenly } = require('../../utils/reduceDataEvenly');

const graphType = {
  async graphData(parent, { dataPoints }, ctx) {
    let graphData = await ctx.prisma.graphData.findMany({
      where: { graphId: parent.id },
      orderBy: { time: 'asc' },
    });
    // reduce returned graph data evenly
    return reduceDataEvenly(graphData, dataPoints);
  },

  async brewingStep(parent, args, ctx) {
    return await ctx.prisma.brewingStep.findUnique({
      where: { id: parent.brewingStepId },
    });
  },

  async sensor(parent, args, ctx) {
    return await ctx.prisma.sensor.findUnique({
      where: { topic: parent.sensorTopic },
    });
  },
};

module.exports = { graphType };
