/* eslint-disable import/extensions */
import DelegatingConfig from './DelegatingConfig.js';
// import ValueResolvingConfig from './ValueResolvingConfig.js';

export default class WindowLocationConfig extends DelegatingConfig {

  constructor(config, path) {
    super(config, path);
  }

  // eslint-disable-next-line class-methods-use-this
  has(path) {
    return this.config.has(`${window.location.origin}${window.location.pathname}.${path}`)
        || this.config.has(path);
  }

  get(path, defaultValue) {
    if ((typeof defaultValue !== 'undefined') && this.has(path) === false) {
      return defaultValue;
    }
    if (this.config.has(`${window.location.origin}${window.location.pathname}.${path}`)) {
      return this.config.get(`${window.location.origin}${window.location.pathname}.${path}`);
    }
    return this.config.get(path);
  }
}
