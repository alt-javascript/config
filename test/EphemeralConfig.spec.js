const { assert } = require('chai');
const { LoggerFactory } = require('@alt-javascript/logger');
const {
  EphemeralConfig, ValueResolvingConfig, JasyptDecryptor, PrefixSelector,
} = require('..');

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/EphemeralConfig_spec');

const ephemeralConfig = new EphemeralConfig({
  key: 'value',
  nested: {
    key: 'value',
    encrypted: 'enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2',
    encryptedWithSecret: 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ',
  },
});

const config = new ValueResolvingConfig(ephemeralConfig, new JasyptDecryptor(new PrefixSelector('enc.')));
const secretconfig = new ValueResolvingConfig(ephemeralConfig, new JasyptDecryptor(new PrefixSelector('enc.'), 'secret'));

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
describe('EphemeralConfig Specification', () => {
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
  it('config unknown with default == hello world', () => {
    assert.equal(config.get('unknown', 'hello world'), 'hello world', 'config unknown with default == hello world');
    assert.equal(ephemeralConfig.get('unknown', 'hello world'), 'hello world', 'ephemeralConfig unknown with default == hello world');
  });
  it('config unknown with default == null', () => {
    assert.equal(config.get('unknown', null), null, 'config unknown with default == null');
    assert.equal(ephemeralConfig.get('unknown', null), null, 'ephemeralConfig unknown with default == null');
  });
  it('config unknown with default == false', () => {
    assert.equal(config.get('unknown', false), false, 'config unknown with default == false');
    assert.equal(ephemeralConfig.get('unknown', false), false, 'ephemeralConfig unknown with default == false');
  });
  it('config unknown with default == 0', () => {
    assert.equal(config.get('unknown', 0), 0, 'config unknown with default == false');
    assert.equal(ephemeralConfig.get('unknown', 0), 0, 'ephemeralConfig unknown with default == false');
  });
  it('config unknown without default throws', () => {
    assert.throws(() => { config.get('unknown'); }, Error, 'Config path unknown returned no value.');
  });
});
