const _ = require('lodash');

module.exports = class Resolver {
  mapValuesDeep(values, callback) {
    if (_.isObject(values)) {
      return _.mapValues(values, (v) => this.mapValuesDeep(v, callback));
    }
    return callback(values);
  }
};
