An Extensible Config Package, supporting the usage elements of Spring Boot and Node "config"
=====================================

[![NPM](https://nodei.co/npm/@alt-javascript/config.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/@alt-javascript/config/)
<br/>
![Language Badge](https://img.shields.io/github/languages/top/@alt-javascript/config)
![Package Badge](https://img.shields.io/npm/v/@alt-javascript/config) <br/>
[release notes](https://github.com/@alt-javascript/config/blob/main/History.md)

<a name="intro">Introduction</a>
--------------------------------
An extensible config package, supporting the usage elements of Spring Boot and Node "config", including:
- json, yaml and Java property files,
- cascading value over-rides using, NODE_ENV, NODE_APP_INSTANCE and NODE_PROFILES_ACTIVE
- placeholder resolution (or variable expansion),
- encrypted values (via jasypt),
- environment variables (via config.get("env.MY_VAR"),
- command line parameters (via config.get("argv.MY_ARG"), config.get("execArgv") & config.get("execPath"))
- default (or fallback) values, 
- optional asynchronous url fetching,
- and isomorphic import for in the browser (with window.location/url detection)

<a name="usage">Usage</a>
-------------------------

To use the module, substitute the named {config} module export, in place of the similar and popular 
[config](https://www.npmjs.com/package/config) default &ndash; note, we use named exports, because the module
exports other useful classes as well.

```javascript
import  { config } from '@alt-javascript/config' ;

config.get('key');
config.get('nested.key');
config.get('unknown','use this instead'); // this does not throw an error
```

### File Loading and Precedence

The module follows the file loading and precedence rules of the popular
[config](https://www.npmjs.com/package/config) defaults, with additional rules in the style of Spring Boot.

Files are loaded and over-ridden from the `config` folder in the following order:
- default.( json | yml | yaml | props | properties )
- application.( json | yml | yaml | props | properties )
- {NODE_ENV}.( json | yml | yaml | props | properties )
- {NODE_ENV}-{NODE_APP_INSTANCE}.( json | yml | yaml | props | properties )
- {NODE_ENV}-{NODE_APP_INSTANCE}.( json | yml | yaml | props | properties )
- {NODE_ENV}-{NODE_APP_INSTANCE}.( json | yml | yaml | props | properties )
- application-{NODE_PROFILES_ACTIVE[0]}.( json | yml | yaml | props | properties )
- application-{NODE_PROFILES_ACTIVE[1]}.( json | yml | yaml | props | properties )
- environment variables (over-ridden into env)
- commandline arguments (over-ridden into argv, execArgv and execPath)


Environment variables and command line arguments, will over-ride values found in files, for example
`env.MY_VAR=someValue` in a `application.properties` file, or 

`local-development.yaml`
```yaml
env:
  MY_VAR: someValue
```

will be over-ridden only if it exists on the host system, negating the need for .gitignore  
dotenv (.env) files or setting local development environment variables or arguments.

### Placeholders, encrypted values and remote fetching

Config values that include the common `${placeholder}` syntax, will resolve the inline 
placeholders, so the `config.get('placeholder')'` path below will return `start.one.two.end`.

Config values that start with the prefix `enc.` will be decrypted with the 
[jasypt](https://www.npmjs.com/package/jasypt) package port, with the passphrase being
sourced from the `process.env.NODE_CONFIG_PASSPHRASE` environment variable.

### Browser

The module is also able to be used directly in the browser, in combination with the config module.

Optionally, config values that start with the prefix `url.` can be fetched and resolved asynchronously with the `fetch` 
function, and HTTP options can be specified as in the example config file.  To avoid bundling `node-fetch`, you need to
provide it by using `@alt-javascript/boot` to boot it into the global root context, where the package will detect it.

```javascript
import { boot } from '@alt-javascript/boot';
import { config } from '@alt-javascript/config';
import fetch from 'node-fetch';

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
### Browser

The module is also able to be used directly in the browser, in combination with the config module.
You can either import the LoggerFactory globally as an IIFE (Immediately Invoked Function Expression),
as follows:

```html
   <script src="https://cdn.jsdelivr.net/npm/@alt-javascript/config/dist/alt-javascript-configfactory-iife.js"></script>
   <script>
       var config = ConfigFactory.getConfig({
           logging : {
               format : 'json',
               level : {
                   '/' : 'info',
                   '/MyPage': 'info'
               }
           }
           "http://127+0+0+1:8080" : {
               logging : {
                   format : 'json',
                   level : {
                       '/' : 'info',
                       '/MyPage' : 'debug'
                   }
               }             
           }

       })
       var logger = LoggerFactory.getLogger('/MyPage',config);
       logger.debug('Hello World');
   </script>
```

Or import the ES6 module bundle from a module, as follows:

```javascript
import { ConfigFactory } from 'https://cdn.jsdelivr.net/npm/@alt-javascript/logger/dist/alt-javascript-config-esm.js'

//...as above
```

Encrypted config is not supported in the browser (by default), as it is 
inherently unsecure (there is no safe way to hide the salt).

Additionally, config sections can be prefixed with the window location to allow
site or environment specific configuration in the browser (periods must be replaced with
a plus sign - so mysite.com => mysite+com).


<a name="testing">Testability</a>
-------------------------

Testing config is hard, and testability is a first class concern at @alt-javascript so the config wrapper, 
and the module exports an EphemeralConfig that can source config paths from a plain old javascript
object as follows, allowing you to assert varying configurations easily

```javascript
import {
    EphemeralConfig, ValueResolvingConfig, PlaceHolderResolver, PlaceHolderSelector
    
} from '@alt-javascript/config';

const ephemeralConfig = new EphemeralConfig({
    key: 'value',
    nested: {
        key: 'value',
    },
});

const placeHolderResolver = new PlaceHolderResolver(new PlaceHolderSelector());
const config = new ValueResolvingConfig(ephemeralConfig,placeHolderResolver );
```

<a name="license">License</a>
-----------------------------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/alt-javascript/config/main/LICENSE).

Copyright (c) 2021 Craig Parravicini    
