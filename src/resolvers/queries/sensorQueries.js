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
          name: value.sensorName,
          latestTimeStamp: value.sensorTimeStamp,
          latestValue: value.sensorValue,
        });
    });
    return returnArray;
  },
};

module.exports = { sensorQueries };
