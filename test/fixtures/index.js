/* eslint-disable import/extensions */
import { test } from '@alt-javascript/boot';
import { LoggerFactory } from '@alt-javascript/logger';
import fetch from 'node-fetch';
import { config } from '../../index.js';

process.env.NODE_CONFIG_PASSPHRASE = 'changeit';

test({ config, fetch });

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/fixtures/index');

export async function mochaGlobalSetup() {
  logger.verbose('mocha global setup: started');

  logger.verbose('mocha global setup: completed');
}

export async function mochaGlobalTeardown() {
  logger.verbose('mocha global teardown: started');
  //  ...
  logger.verbose('mocha global teardown: completed');
}
