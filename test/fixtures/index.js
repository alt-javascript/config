process.env.NODE_CONFIG_PASSPHRASE = 'changeit';

const { test } = require('@alt-javascript/boot');
const { LoggerFactory } = require('@alt-javascript/logger');
const { config } = require('../../index');
const fetch = require('node-fetch');

test ({ config, fetch });

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/fixtures/index');

exports.mochaGlobalSetup = async function setup() {
  logger.verbose('mocha global setup: started');

  logger.verbose('mocha global setup: completed');
};

exports.mochaGlobalTeardown = async function teardown() {
  logger.verbose('mocha global teardown: started');
  //  ...
  logger.verbose('mocha global teardown: completed');
};
