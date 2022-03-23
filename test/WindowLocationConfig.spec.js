/* eslint-disable import/extensions */
import { assert } from 'chai';
import { LoggerFactory } from '@alt-javascript/logger';
import ConfigFactory from '../browser/ConfigFactory.js';

process.env.PROVIDED_ENV_VAR = 'provided-index-value';

const configObject = {
  providedEnvVar: 'provided-default-value',
  missingEnvVar: 'missing-default-value',
  key: 'value',
  one: 'one',
  // eslint-disable-next-line no-template-curly-in-string
  placeholder: 'start.${one}.${nested.two}.end',
  // eslint-disable-next-line no-template-curly-in-string
  placeholderEncrypted: 'start.${nested.encrypted}.end',
  nested: {
    key: 'value',
    two: 'two',
    // eslint-disable-next-line no-template-curly-in-string
    placeholder: 'start.${one}.${nested.two}.end',
    encrypted: 'enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2',
    encryptedWithSecret: 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ',
  },
  'http://127+0+0+1/page1/': {
    key: 'value1',
    keyL: 'valueL',
    one: 'one1',
  },
};
const config = ConfigFactory.getConfig(configObject);
const logger = LoggerFactory.getLogger('@alt-javascript/config/test/ValueResolvingConfig_spec');

global.window = {
  location: {
    origin: 'http://127.0.0.1',
    pathname: '/page1/',
  },
};

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

describe('WindowLocationConfig Specification', () => {
  it('config has ', () => {
    assert.isTrue(config.has('key'), "config kas 'key'");
    assert.isTrue(config.has('keyL'), "config kas 'keyL'");
    assert.isFalse(config.has('unknown'), "config does not have ''unknown'");
  });
  it('config key == value', () => {
    assert.equal(config.key, 'value', 'config key == value');
    assert.equal(config.get('key'), 'value1', 'config key == value1');
  });
  it('config nested.key == value', () => {
    assert.equal(config.get('nested.key'), 'value', 'config nested.key == value');
    assert.equal(config.nested.key, 'value', 'config nested.key == value');
  });

  it('config nested.encrypted == enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2', () => {
    assert.equal(config.get('nested.encrypted'), 'enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2', 'config nested.key == hello world');
    assert.equal(config.nested.encrypted, 'enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2', 'config nested.key == enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2');
  });
  it('config nested.encrypted == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U', () => {
    assert.equal(config.get('nested.encryptedWithSecret'), 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ', 'config nested.key == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U');
    assert.equal(config.nested.encryptedWithSecret, 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ', 'config nested.key == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U');
  });
  it('config place holders are resolved ', () => {
    assert.equal(config.get('placeholder'), 'start.one.two.end', 'config placeholder == start.one.two.end');
    assert.equal(config.get('placeholderEncrypted'), 'start.enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2.end',
      'config placeholderEncrypted == start.enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2.end');
  });
});
