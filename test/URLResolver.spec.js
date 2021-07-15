const { assert } = require('chai');
const {
  EphemeralConfig, ValueResolvingConfig, URLResolver, PrefixSelector,
} = require('..');

const ephemeralConfig = new EphemeralConfig({

    github: {
      users: 'url.https://api.github.com/users/github'
    },
    fetch : {url:'',authorization: '',method:'post',body:{},headers:{}}

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

describe('Simple URL resolution against github', () => {
  it('config fetches from github ', async () => {
    assert.isTrue(config.has('github.users'), "config has 'github.users'");
    const users = await config.get('github.users');
//    assert.exists(config.get('github.users'), "'github.users' resolves and exists");
//    console.log(config.get('github.users'));
  });
});
