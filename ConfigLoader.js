/* eslint-disable import/extensions */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import PropertiesParser from './PropertiesParser.js';

export default class ConfigLoader {
  constructor(options) {
    this.configDir = process.env?.NODE_CONFIG_DIR || options || options?.configDir || 'config';
    this.config = {};
  }

  loadConfig(configDir) {
    const dirpath = configDir || this.configDir;
    if (this.pathExistsWithAccess(dirpath)) {
      const config = this.loadConfigFilesByPrecedence(dirpath);
      if (typeof (process) !== 'undefined') {
        config.env = Object.assign( config.env || {}, process.env);
        config.argv = Object.assign( config.argv || {}, process.argv);
        config.execArgv = Object.assign( config.execArgv || {}, process.execArgv);
        config.execPath = Object.assign( config.execPath || {}, process.execPath);
      }
      return config;
    }
    return {};
  }

  pathExistsWithAccess(configDir) {
    try {
      const dirpath = configDir || this.configDir;
      fs.accessSync(dirpath, fs.constants.R_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  loadConfigFilesByPrecedence(configDir) {
    const config = {};
    const dirpath = `${configDir}${path.sep}`;
    const env = process.env.NODE_CONFIG_ENV || process.env.NODE_ENV || 'local';
    const instance = process.env.NODE_APP_INSTANCE || 'development';
    const profiles = (process.env.NODE_PROFILES_ACTIVE || '').split(',');
    const precedence = [
      `${dirpath}default.json`,
      `${dirpath}default.yml`,
      `${dirpath}default.yaml`,
      `${dirpath}default.props`,
      `${dirpath}default.properties`,
      `${dirpath}application.json`,
      `${dirpath}application.yml`,
      `${dirpath}application.yaml`,
      `${dirpath}application.props`,
      `${dirpath}application.properties`,
      `${dirpath}${env}.json`,
      `${dirpath}${env}.yml`,
      `${dirpath}${env}.yaml`,
      `${dirpath}${env}.props`,
      `${dirpath}${env}.properties`,
      `${dirpath}${env}-${instance}.json`,
      `${dirpath}${env}-${instance}.yml`,
      `${dirpath}${env}-${instance}.yaml`,
      `${dirpath}${env}-${instance}.props`,
      `${dirpath}${env}-${instance}.properties`,
    ];

    for (let i = 0; i < profiles.length; i++) {
      precedence.push(`${dirpath}applictaion-${profiles[i]}.json`);
      precedence.push(`${dirpath}applictaion-${profiles[i]}.yml`);
      precedence.push(`${dirpath}applictaion-${profiles[i]}.yaml`);
      precedence.push(`${dirpath}applictaion-${profiles[i]}.props`);
      precedence.push(`${dirpath}applictaion-${profiles[i]}.properties`);
    }

    try {
      for (let i = 0; i < precedence.length; i++) {
        const filepath = precedence[i];
        let content = null;
        let object = null;
        if (this.pathExistsWithAccess(filepath)) {
          content = this.readFile(filepath);
          if (filepath.endsWith('.json')) {
            object = JSON.parse(content);
          }
          if (filepath.endsWith('.yml') || filepath.endsWith('.yaml')) {
            object = yaml.load(content);
          }
          if (filepath.endsWith('.props') || filepath.endsWith('.properties')) {
            object = PropertiesParser.parse(content);
          }
          // Object.assign(config, object);
          this.assignIn(config, object);
        }
      }
    } catch (err) {
      throw new Error(`Unable to load config, possible parse error: ${err}`);
    }
    return config;
  }

  assignIn(config, object) {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof (config[key]) === 'undefined') {
        // eslint-disable-next-line   no-param-reassign
        config[key] = object[key];
      } else if (typeof (config[key]) === 'object') {
        if (typeof (object[key]) === 'object') {
          this.assignIn(config[key], object[key]);
        } else {
          // eslint-disable-next-line   no-param-reassign
          config[key] = object[key];
        }
      } else {
        // eslint-disable-next-line   no-param-reassign
        config[key] = object[key];
      }
    }
  }
  // eslint-disable-next-line  class-methods-use-this

  // eslint-disable-next-line  class-methods-use-this
  readFile(filepath) {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const content = fs.readFileSync(filepath,
        { encoding: 'utf8', flag: 'r' });

      return content;
    } catch (err) {
      throw new Error(`Unable to read config file at ${filepath}: ${err}`);
    }
  }
}
