const { assert } = require('chai');
const {
  EphemeralConfig, ValueResolvingConfig, JasyptDecryptor, PrefixSelector,
} = require('..');

const ephemeralConfig = new EphemeralConfig({
  key: 'value',
  nested: {
    key: 'value',
    encrypted: 'enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2',
    encryptedWithSecret: 'enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ',
  },
});

const config = new ValueResolvingConfig(ephemeralConfig, new JasyptDecryptor(new PrefixSelector()));
const secretconfig = new ValueResolvingConfig(ephemeralConfig, new JasyptDecryptor(new PrefixSelector(), 'secret'));

// const spec = '@demo/config/test/EphemeralConfigSpec.js';

before(async () => {
  // // console.log(`${spec} spec setup started`);
  // ..
  // // console.log(`${spec} spec setup completed`);
});

beforeEach(async () => {
  // console.log(`${spec} each setup started`);
  // ..
  // console.log(`${spec} each setup completed`);
});

after(async () => {
  // console.log(`${spec} each teardown started`);
  // ...
  // console.log(`${spec} each teardown completed`);
});

beforeEach(async () => {
  // console.log(`${spec} each setup started`);
  // ..
  // console.log(`${spec} each setup completed`);
});

describe('Simple encrypted properties', () => {
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
  });
  it('config unknown without default throws', () => {
    assert.throws(() => { config.get('unknown'); }, Error, 'Config path unknown returned no value.');
  });
});
