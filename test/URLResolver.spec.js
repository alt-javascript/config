const { assert } = require('chai');
const {
  EphemeralConfig, ValueResolvingConfig, URLResolver, PrefixSelector,
} = require('..');

const ephemeralConfig = new EphemeralConfig({

    jsonplaceholder: {
      todos: 'url.https://jsonplaceholder.typicode.com/todos/1'
    },
    fetchit : {
        url: 'url.https://jsonplaceholder.typicode.com/todos/1',
        authorization: 'Basic dXNlcjpwYXNz',
        method: 'get',
        body: {},
        headers: {'Content-Type': 'application/json'}
    }

});

const config = new ValueResolvingConfig(ephemeralConfig, new URLResolver(new PrefixSelector('url.')));

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

describe('Simple URL resolution', () => {
  it('config fetches from jsonplaceholder ', async () => {
    assert.isTrue(config.has('jsonplaceholder.todos'), "config has 'jsonplaceholder.todos'");
    const todos = await config.fetch('jsonplaceholder.todos');
    assert.equal(todos.userId, 1, "to userid = 1");
    const fetchit = await config.fetch('fetchit.url');
  });

    it('config fetches from jsonplaceholder with options', async () => {
        const fetchit = await config.fetch('fetchit.url');
        assert.equal(fetchit.userId, 1, "to userid = 1");
    });
});
