/* eslint-disable import/extensions */
import EphemeralConfig from './EphemeralConfig.js';

export default class DelegatingConfig {
  static getTag(value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return toString.call(value);
  }

  static isObjectLike(value) {
    return typeof value === 'object' && value !== null;
  }

  static isPlainObject(value) {
    if (!DelegatingConfig.isObjectLike(value) || DelegatingConfig.getTag(value) !== '[object Object]') {
      return false;
    }
    if (Object.getPrototypeOf(value) === null) {
      return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
  }

  constructor(config, path) {
    if (DelegatingConfig.isPlainObject(config)) {
      this.config = new EphemeralConfig(config);
    } else {
      this.config = config;
    }
    const originalConfig = this.config;
    Object.assign(this, config);
    this.config = originalConfig;
    this.path = path;
  }

  has(path) {
    return this.config.has(path);
  }
}
