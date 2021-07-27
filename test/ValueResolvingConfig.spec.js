process.env.PROVIDED_ENV_VAR = 'provided-index-value';
const npmconfig = require('config');
const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const {
  ValueResolvingConfig, config, JasyptDecryptor, PrefixSelector,
} = require('..');

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/ValueResolvingConfig_spec');

const secretconfig = new ValueResolvingConfig(npmconfig, new JasyptDecryptor(new PrefixSelector('enc.'), 'secret'));

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

describe('ValueResolvingConfig Specification', () => {
  it('config has ', () => {
    assert.isTrue(config.has('key'), "config kas 'key'");
    assert.isFalse(config.has('unknown'), "config does not have ''unknown'");
  });
  it('config key == value', () => {
    assert.equal(config.key, 'value', 'config key == value');
  });
  it('config nested.key == value', () => {
    assert.equal(config.get('nested.key'), 'value', 'config nested.key == value');
    assert.equal(config.nested.key, 'value', 'config nested.key == value');
  });

  it('config nested.encrypted == hello world', () => {
    assert.equal(config.get('nested.encrypted'), 'hello world', 'config nested.key == hello world');
    assert.equal(config.nested.encrypted, 'hello world', 'config nested.key == hello world');
  });
  it('config nested.encrypted == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U', () => {
    assert.equal(config.get('nested.encryptedWithSecret'), 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ', 'config nested.key == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U');
    assert.equal(config.nested.encryptedWithSecret, 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ', 'config nested.key == enc.MrfGVtwBex9JZoTRIC6/KtpET4gJkJ/U');
  });
  it('config nested.encryptedWithSecret == hello world', () => {
    assert.equal(secretconfig.get('nested.encryptedWithSecret'), 'hello world', 'config nested.encryptedWithSecret == hello world');
    assert.equal(secretconfig.nested.encryptedWithSecret, 'hello world', 'config nested.encryptedWithSecret == hello world');
  });
  it('config place holders are resolved ', () => {
    assert.equal(config.get('placeholder'), 'start.one.two.end', 'config placeholder == start.one.two.end');
    assert.equal(config.get('placeholderEncrypted'), 'start.hello world.end', 'config placeholderEncrypted == start.hello world.end');
  });

  it('local-development env vars are resolved ', () => {
    // assert.equal(npmconfig.get('providedEnvVar'), 'system',
    // 'config.get(\'providedEnvVar\') == system');
    assert.equal(process.env.PROVIDED_ENV_VAR, 'provided-index-value', 'process.env.PROVIDED_ENV_VAR == provided-index-value');
    assert.equal(npmconfig.get('missingEnvVar'), 'missing-local-value', 'config.get(\'missingEnvVar\') == missing-local-dev-value');
  });
});
