const npmconfig = require('config');
const { assert } = require('chai');
const {
  ValueResolvingConfig, config, JasyptDecryptor, PrefixSelector,
} = require('..');

const secretconfig = new ValueResolvingConfig(npmconfig, new JasyptDecryptor(new PrefixSelector(), 'secret'));

// const spec = '@cloud-pad-min/config/test/console_spec.js';

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

describe('Simple encrypted properties and placeholders', () => {
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
});
