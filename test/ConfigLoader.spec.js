/* eslint-disable import/extensions */
import { assert } from 'chai';
import { LoggerFactory } from '@alt-javascript/logger';
import ConfigLoader from '../ConfigLoader.js';

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/ConfigLoader_spec');

before(async () => {
  logger.debug('spec setup started');
  // ..
  logger.debug('spec setup completed');
});

beforeEach(async () => {
  logger.debug('spec setup started');
  // ..
  logger.debug('spec setup completed');
});

after(async () => {
  logger.debug('each teardown started');
  // ...
  logger.debug('each teardown completed');
});

beforeEach(async () => {
  logger.debug('each setup started');
  // ..
  logger.debug('each setup completed');
});

describe('ConfigLoader Specification', () => {
  it('json config is overloaded', () => {
    const configLoader = new ConfigLoader();
    process.env.NODE_ENV = 'environment';
    process.env.NODE_APP_INSTANCE = 'instance';
    process.env.NODE_PROFILES_ACTIVE = '1,2';

    let config = configLoader.loadConfig('test/config/json');
    assert.equal(config.default, 'default', 'default is default');
    assert.equal(config.application, 'application', 'application is application');
    assert.equal(config.environment, 'environment', 'environment is environment');
    assert.equal(config['env-instance'], 'env-instance', 'env-instance is env-instance');
    assert.equal(config.local, 'default', 'local is default');
    assert.equal(config['local-development'], 'default', 'local-development is default');

    process.env.NODE_ENV = '';
    process.env.NODE_APP_INSTANCE = '';

    config = configLoader.loadConfig('test/config/json');
    assert.equal(config.local, 'local', 'local is local');
    assert.equal(config['local-development'], 'local-development', 'local-development is local-development');
  });

  it('yaml config is overloaded', () => {
    const configLoader = new ConfigLoader();
    process.env.NODE_ENV = 'environment';
    process.env.NODE_APP_INSTANCE = 'instance';
    process.env.NODE_PROFILES_ACTIVE = '1,2';

    let config = configLoader.loadConfig('test/config/yaml');
    assert.equal(config.default, 'default', 'default is default');
    assert.equal(config.application, 'application', 'application is application');
    assert.equal(config.environment, 'environment', 'environment is environment');
    assert.equal(config['env-instance'], 'env-instance', 'env-instance is env-instance');
    assert.equal(config.local, 'default', 'local is default');
    assert.equal(config['local-development'], 'default', 'local-development is default');

    process.env.NODE_ENV = '';
    process.env.NODE_APP_INSTANCE = '';

    config = configLoader.loadConfig('test/config/yaml');
    assert.equal(config.local, 'local', 'local is local');
    assert.equal(config['local-development'], 'local-development', 'local-development is local-development');
  });

  it('properties config is overloaded', () => {
    const configLoader = new ConfigLoader();
    process.env.NODE_ENV = 'environment';
    process.env.NODE_APP_INSTANCE = 'instance';
    process.env.NODE_PROFILES_ACTIVE = '1,2';

    let config = configLoader.loadConfig('test/config/properties');
    assert.equal(config.default, 'default', 'default is default');
    assert.equal(config.application, 'application', 'application is application');
    assert.equal(config.environment, 'environment', 'environment is environment');
    assert.equal(config['env-instance'], 'env-instance', 'env-instance is env-instance');
    assert.equal(config.local, 'default', 'local is default');
    assert.equal(config['local-development'], 'default', 'local-development is default');

    process.env.NODE_ENV = '';
    process.env.NODE_APP_INSTANCE = '';

    config = configLoader.loadConfig('test/config/properties');
    assert.equal(config.local, 'local', 'local is local');
    assert.equal(config['local-development'], 'local-development', 'local-development is local-development');
  });

  it('nested properties config are overloaded correctly', () => {
    const configLoader = new ConfigLoader();

    const config = configLoader.loadConfig('test/config/nesting');
    assert.equal(config.level1.level2.key1, 'default', 'key1 is default');
    assert.equal(config.level1.level2.key2, 'application', 'key2 is application');
  });
});
