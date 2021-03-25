const { checkUserPermissions } = require('../../utils/checkUserPermissions');

const brewingProcessType = {
  async brewingSteps(parent, { active }, ctx) {
    checkUserPermissions(ctx, ['USER'], parent.id);
    let where = { brewingProcessId: parent.id };
    if (active) {
      where = {
        brewingProcessId: parent.id,
        end: null,
        NOT: [{ start: null }],
      };
    }
    return await ctx.prisma.brewingStep.findMany({ where: where });
  },

  async participatingUsers(parent, args, ctx) {
    // this information should be only available to admins,
    // not to all users who participate in a brewing process
    checkUserPermissions(ctx, ['ADMIN']);
    let returnValue = await ctx.prisma.brewingProcess.findMany({
      where: { id: parent.id },
      select: { participatingUsers: { select: { user: {} } } },
    });
    // get it into the right format...
    let participatingUsers = returnValue[0].participatingUsers;
    let users = [];
    for (let i = 0; i < participatingUsers.length; i++) {
      let user = participatingUsers[i].user;
      users.push(user);
    }
    return users;
  },
};

module.exports = { brewingProcessType };
