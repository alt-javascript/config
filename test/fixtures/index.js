process.env.NODE_CONFIG_PASSPHRASE = 'changeit';

const { boot } = require('@alt-javascript/boot');

const { CachingLoggerFactory, LoggerCategoryCache, LoggerFactory } = require('@alt-javascript/logger');
const { config } = require('../../index');

const loggerCategoryCache = new LoggerCategoryCache();
const cachingLoggerFactory = new CachingLoggerFactory(config, loggerCategoryCache);

if (config.get('logging.test.fixtures.quiet', true)) {
  boot({ config, loggerFactory: cachingLoggerFactory, loggerCategoryCache });
} else {
  boot({ config });
}

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
