An Extensible Wrapper for Node Config
=====================================

[![NPM](https://nodei.co/npm/@alt-javascript/config.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/@alt-javascript/config/)
<br/>
![Language Badge](https://img.shields.io/github/languages/top/craigparra/alt-config)
![Package Badge](https://img.shields.io/npm/v/@alt-javascript/config) <br/>
[release notes](https://github.com/craigparra/alt-config/blob/main/History.md)

<a name="intro">Introduction</a>
--------------------------------
An extensible wrapper of the popular config package, supporting:
- placeholder resolution (or variable expansion),
- encrypted values (via jasypt) 
- default (or fallback) values, 
- and optional asynchronous url fetching.

<a name="usage">Usage</a>
-------------------------

To use the module, substitute the named {config} module export, in place of the popular 
[config](https://www.npmjs.com/package/config) default &ndash; note, we use named exports, because the module
exports other useful classes as well.

```javascript
const {config} = require('@alt-javascript/config');

config.get('key');
config.get('nested.key');
config.get('unknown','use this instead'); // this does not throw an error
```

Config values that include the common `${placeholder}` syntax, will resolve the inline 
placeholders, so the `config.get('placeholder')'` path below will return `start.one.two.end`.

Config values that start with the prefix `enc.` will be decrypted with the 
[jasypt](https://www.npmjs.com/package/jasypt) package port, with the passphrase being
sourced from the `process.env.NODE_CONFIG_PASSPHRASE` environment variable.

Optionally, config values that start with the prefix `url.` can be fetched and resolved asynchronously with the `fetch` 
function, and HTTP options can be specified as in the example config file.  To avoid bundling `node-fetch`, you need to
provide it by using `@alt-javascript/boot` to boot it into the global root context, where the package will detect it.

```javascript
const {boot} = require('@alt-javascript/boot');
const {config} = require('@alt-javascript/config');
const fetch = require('node-fetch');

boot({config,fetch})
const webdata = await config.fetch('pathToUrlPrefixedValue'); 
```
> :warning: While we have implemented asynchronous fetch from "the network", we discourage it.  
> 
> It's mostly a design flex.
> 
> Configuration should be static and immutable contextual information your system needs on application bootstrap, and 
> configuration as a service increases the complexity of your deployment architecture, making it difficult to configure
> different, and ephemeral deployment options, including local development and testing.
> 
> Don't say we didn't warn you.


`local-development.json`
```json
{
  "key": "value",
  "one" : "one",
  "placeholder": "start.${one}.${nested.two}.end",
  "placeholderEncrypted": "start.${nested.encrypted}.end",
  "nested" : {
    "key" : "value",
    "two" : "two",
    "placeholder": "start.${one}.${nested.two}.end",
    "encrypted" : "enc.pxQ6z9s/LRpGB+4ddJ8bsq8RqELmhVU2",
    "encryptedWithSecret" : "enc./emLGkD3cbfqoSPijGZ0jh1p1SYIHQeJ"
  },
  "jsonplaceholder": {
    "todos": "url.https://jsonplaceholder.typicode.com/todos/1"
  },
  "fetchWithOpts" : {
    "url": "url.https://jsonplaceholder.typicode.com/todos/1",
    "authorization": "Basic dXNlcjpwYXNz",
    "method": "get",
    "body": {},
    "headers": {"Content-Type": "application/json"}
  }
}
```

<a name="testing">Testability</a>
-------------------------

Testing config is hard, and testability is a first class concern at @alt-javascript so the config wrapper, 
and the module exports an EphemeralConfig that can source config paths from a plain old javascript
object as follows, allowing you to assert varying configurations easily

```javascript
const {
    EphemeralConfig, ValueResolvingConfig, PlaceHolderResolver, PlaceHolderSelector
    
} = require('@alt-javascript/config');

const ephemeralConfig = new EphemeralConfig({
    key: 'value',
    nested: {
        key: 'value',
    },
});

const placeHolderResolver = new PlaceHolderResolver(new PlaceHolderSelector());
const config = new ValueResolvingConfig(ephemeralConfig,placeHolderResolver );
```
<a name="resources">Resources</a>
---------------------------------

<https://github.com/craigparra/alt-javascript>  has a
useful [Design Trail](https://github.com/craigparra/alt-javascript/blob/master/CONFIGURATION.md) available for this
module.


<a name="license">License</a>
-----------------------------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/craigparra/alt-logger/master/LICENSE).

Copyright (c) 2021 Craig Parravicini    
