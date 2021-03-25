const { checkUserPermissions } = require('../../utils/checkUserPermissions');

const brewingProcessQueries = {
  async brewingProcesses(parent, { active, ended }, ctx) {
    checkUserPermissions(ctx, ['USER']);
    if (active && !ended) {
      return await ctx.prisma.brewingProcess.findMany({
        where: { AND: [{ NOT: [{ start: null }], end: null }] },
      });
    } else if (!active && ended) {
      return await ctx.prisma.brewingProcess.findMany({
        where: { NOT: [{ end: null }] },
      });
    } else if (!active && !ended)
      return await ctx.prisma.brewingProcess.findMany({
        where: {},
      });
    return []; // well, active end ended..
  },

  async brewingProcess(parent, args, ctx) {
    checkUserPermissions(ctx, ['USER']);
    return await ctx.prisma.brewingProcess.findUnique({
      where: { id: parseInt(args.id) },
    });
  },
};

module.exports = { brewingProcessQueries };
