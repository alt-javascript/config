const { assert } = require('chai');
const fetch = require('node-fetch');
const { LoggerFactory } = require('@alt-javascript/logger');
const {
  EphemeralConfig, ValueResolvingConfig, URLResolver, PrefixSelector,
} = require('..');

const logger = LoggerFactory.getLogger('@alt-javascript/config/test/URLResolver_spec');

const ephemeralConfig = new EphemeralConfig({

  jsonplaceholder: {
    todos: 'url.https://jsonplaceholder.typicode.com/todos/1',
  },
  fetchit: {
    url: 'url.https://jsonplaceholder.typicode.com/todos/1',
    authorization: 'Basic dXNlcjpwYXNz',
    method: 'get',
    body: {},
    headers: { 'Content-Type': 'application/json' },
  },

});

const config = new ValueResolvingConfig(ephemeralConfig, new URLResolver(new PrefixSelector('url.'), fetch));

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

describe('URLResolver Specification', () => {

  it('URLResolver creates default PrefixSelector', async () => {
    const urlResolver  = new URLResolver();
    assert.equal(urlResolver.selector.prefix, 'url.', 'urlResolver.selector.prefix == \'url.\'');
  });

  it('config fetches from jsonplaceholder ', async () => {
    assert.isTrue(config.has('jsonplaceholder.todos'), "config has 'jsonplaceholder.todos'");
    const todos = await config.fetch('jsonplaceholder.todos');
    assert.equal(todos.userId, 1, 'to userid = 1');
    const fetchit = await config.fetch('fetchit.url');
    assert.equal(fetchit.userId, 1, 'to userid = 1');
  });

  it('config fetches from jsonplaceholder with options', async () => {
    const fetchit = await config.fetch('fetchit.url');
    assert.equal(fetchit.userId, 1, 'to userid = 1');
  });

  it('config fetch with default', async () => {
    const defaultValue = 'default'
    const fetchit = await config.fetch('no.fetch',defaultValue);
    assert.equal(fetchit, defaultValue, 'fetchit = defaultValue');
  });


});
