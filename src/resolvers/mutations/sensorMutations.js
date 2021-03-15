const { activeGraphCache, sensorCache } = require('../../utils/caches');
const { checkUserPermissions } = require('../../utils/checkUserPermissions');

const sensorMutations = {
  async createSensor(parent, args, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    await ctx.prisma.sensor.create({
      data: {
        topic: args.topic,
        name: args.name,
        binary: args.binary,
      },
    });
    await sensorCache(ctx, true);
    return { message: 'Created!' };
  },

  async deleteSensor(parent, { topic }, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    await ctx.prisma.sensor.delete({ where: { topic: topic } });
    await sensorCache(ctx, true);
    await activeGraphCache(ctx, true);
    return { message: 'Deleted!' };
  },
};

module.exports = { sensorMutations };
