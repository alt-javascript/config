import _ from 'lodash';

export default class Resolver {
  mapValuesDeep(values, callback) {
    if (_.isObject(values)) {
      return _.mapValues(values, (v) => this.mapValuesDeep(v, callback));
    }
    return callback(values);
  }

  async asyncMapValuesDeep(values, callback) {
    if (_.isObject(values)) {
      return _.mapValues(values, async (v) => this.asyncMapValuesDeep(v, callback));
    }
    return callback(values);
  }
}
