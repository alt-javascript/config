module.exports = class DelegatingConfig {
  constructor(config, path) {
    this.config = config;
    this.path = path;
  }

  has(path) {
    return this.config.has(path);
  }
};
