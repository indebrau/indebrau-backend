const { checkUserPermissions } = require('../../utils/checkUserPermissions');
const { activeGraphCache } = require('../../utils/caches');

const graphQueries = {
  async graphs(parent, { active }, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    if (active) {
      return activeGraphCache(ctx);
    }
    return await ctx.prisma.graph.findMany();
  },

  async graph(parent, { id }, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    return await ctx.prisma.graph.findUnique({ where: { id: parseInt(id) } });
  },
};

module.exports = { graphQueries };
