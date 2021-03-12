const { userQueries } = require('./queries/userQueries');
const { brewingProcessQueries } = require('./queries/brewingProcessQueries');
const { graphQueries } = require('./queries/graphQueries');
const { sensorQueries } = require('./queries/sensorQueries');
const { mediaStreamQueries } = require('./queries/mediaStreamQueries');
const { userMutations } = require('./mutations/userMutations');
const { sensorMutations } = require('./mutations/sensorMutations');
const {
  brewingProcessMutations,
} = require('./mutations/brewingProcessMutations');
const { graphMutations } = require('./mutations/graphMutations');
const { mediaStreamMutations } = require('./mutations/mediaStreamMutations');
const { userType } = require('./types/userType');
const { brewingProcessType } = require('./types/brewingProcessType');
const { brewingStepType } = require('./types/brewingStepType');
const { graphType } = require('./types/graphType');
const { graphDataType } = require('./types/graphDataType');
const { mediaStreamType } = require('./types/mediaStreamType');
const { mediaFileType } = require('./types/mediaFileType');

module.exports = {
  Query: {
    ...userQueries,
    ...brewingProcessQueries,
    ...graphQueries,
    ...sensorQueries,
    ...mediaStreamQueries,
  },
  Mutation: {
    ...userMutations,
    ...sensorMutations,
    ...brewingProcessMutations,
    ...graphMutations,
    ...mediaStreamMutations,
  },
  User: { ...userType },
  BrewingProcess: { ...brewingProcessType },
  BrewingStep: { ...brewingStepType },
  Graph: { ...graphType },
  GraphData: { ...graphDataType },
  MediaStream: { ...mediaStreamType },
  MediaFile: { ...mediaFileType },
};
