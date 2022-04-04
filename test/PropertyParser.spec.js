/* eslint-disable import/extensions */
import { assert } from 'chai';
import { LoggerFactory } from '@alt-javascript/logger';
import ConfigLoader from '../ConfigLoader.js';

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/PropertiesParser_spec');

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

describe('PropertiesParser Specification', () => {
  it('properties are parsed correctly', () => {
    const configLoader = new ConfigLoader();

    const config = configLoader.loadConfig('test/config/properties');
    assert.equal(config.newline, 'application', 'newline is application');
    assert.equal(config.step1.step2.step3, 'application', 'step1.step2.step3 is application');
    assert.equal(config.multiline1, '1-2-3', 'multiline1 is 1-2-3');
    assert.equal(config.multiline2, 'r+g+b', 'multiline2 is r+g+b');
    assert.equal(config.l2.multiline3, '1-2-3', 'l2.multiline1 is 1-2-3');
    assert.equal(config.multiline4, 'application', 'multiline4 is application');
  });
});
