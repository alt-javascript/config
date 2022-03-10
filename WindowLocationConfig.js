/* eslint-disable import/extensions */
import DelegatingConfig from './DelegatingConfig.js';
// import ValueResolvingConfig from './ValueResolvingConfig.js';

export default class WindowLocationConfig extends DelegatingConfig {

  constructor(config, path) {
    super(config, path);
  }

  // eslint-disable-next-line class-methods-use-this
  has(path) {
    const location = `${window.location.origin}${window.location.pathname}`.replaceAll('.','+');

    return this.config.has(`${location}.${path}`)
        || this.config.has(path);
  }

  get(path, defaultValue) {
    const location = `${window.location.origin}${window.location.pathname}`.replaceAll('.','+');
    if ((typeof defaultValue !== 'undefined') && this.has(path) === false) {
      return defaultValue;
    }
    if (this.config.has(`${location}.${path}`)) {
      return this.config.get(`${location}.${path}`);
    }
    return this.config.get(path);
  }
}
