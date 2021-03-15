const { checkUserPermissions } = require('../../utils/checkUserPermissions');
const { sensorCache } = require('../../utils/caches');

const sensorQueries = {
  async sensors(parent, args, ctx) {
    checkUserPermissions(ctx, ['ADMIN']);
    let returnArray = [];
    let cache = await sensorCache(ctx);
    cache.forEach((value, key) => {
      if (value != null)
        returnArray.push({
          topic: key,
          name: value.name,
          binary: value.binary,
          latestTimeStamp: value.timeStamp,
          latestValue: value.value,
        });
    });
    return returnArray;
  },
};

module.exports = { sensorQueries };
