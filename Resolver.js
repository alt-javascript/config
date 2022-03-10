export default class Resolver {
  static isObject(value) {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
  }

  mapValuesDeep(values, callback) {
    if (Resolver.isObject(values)) {
      return Object.fromEntries(
        Object.entries(values).map(([
          key, value]) => [key, this.mapValuesDeep(value, callback)]),
      );
    }
    return callback(values);
  }

  async asyncMapValuesDeep(values, callback) {
    if (Resolver.isObject(values)) {
      return Object.fromEntries(
        Object.entries(values).map(
          async ([key, value]) => [key, this.mapValuesDeep(value, callback)],
        ),
      );
    }
    return callback(values);
  }
}
