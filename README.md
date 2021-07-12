A Simple Log Facade for JavaScript
===================================

[![NPM](https://nodei.co/npm/@alt-javascript/logger.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/@alt-javascript/logger/)
<br/>
![Language Badge](https://img.shields.io/github/languages/top/craigparra/alt-logger)
![Package Badge](https://img.shields.io/npm/v/@alt-javascript/logger) <br/>
[release notes](https://github.com/craigparra/alt-logger/blob/main/History.md)

<a name="intro">Introduction</a>
--------------------------------
A simple configurable logging facade for javascript, using the popular [config](https://www.npmjs.com/package/config)
package interface.

<a name="usage">Usage</a>
-------------------------

To use the module, import the LoggerFactory and call the `getLogger` function with a logging category (your module 
requires path is a sensible choice).

```javascript
const {LoggerFactory} = require('@alt-javascript/logger');
const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule');

logger.info('Hello world!');
```
The LoggerFactory will create a ConsoleLogger (uses `console.log('...')`) object instance, with the root logging level 
set to `info` by default.  To change the logging level for your module (category), add something similar to the
following in your [config](https://www.npmjs.com/package/config) files.

`local-development.json`
```json
{
  "logger" : {
     "level" : {
       "/" : "info",
       "@myorg/mypackage/MyModule" : "debug"
     }
  }
}
```

The logger supports the following levels by default, but is fully configurable.

```javascript
{
  ENUMS: {
    fatal: 0, error: 1, warn: 2, info: 3, verbose: 4, debug: 5,
  },
  DEBUG: 'debug',
  VERBOSE: 'verbose',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
}
```

You can test if a level is enabled for your module (category), for example.

```javascript
if (logger.isDebugEnabled()){
    logger.debug(`This a performance impacting logline => ${costlyFunction()}`)
}
```
<a name="conf">Configuring</a>
------------------------------

While the LoggerFactory uses sensible defaults, it is flexible and pluggable.  To use the popular 
[winston](https://www.npmjs.com/package/winston) package you can pass a `WinstonLogger` provider to the `getLogger`
function, passing it your winston options (nullish options will fall back to defaults).

>Be aware [winston](https://www.npmjs.com/package/winston) is not included as a package dependency for 
> [@alt-javascript/logger](https://www.npmjs.com/package/@alt-javascript/logger) to keep it light-weight.
    

```javascript
const {LoggerFactory,WinstonLogger} = require('@alt-javascript/logger');
const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule', new WinstonLogger({/*mywinstonoptions*/}));

logger.info('Hello world!');
```

The `ConsoleLogger` uses a JSONFormatter, but a PlainTextFormatter (or similar implementation) can easily be
substituted.

```javascript
const {LoggerFactory,WinstonLogger} = require('@alt-javascript/logger');
const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule', new ConsoleLogger('@myorg/mypackage/MyModule',new PlainTextFromatter()));

logger.info('Hello world!');
```

<a name="testing">Testability</a>
-------------------------

Testing loggers is hard, and testability is a first class concern at @alt-javascript so the logging facade, 
and the module exports an EphemeralLogger and EphemeralLogSink that will capture log lines that can be asserted.

```javascript
const {LoggerFactory,WinstonLogger} = require('@alt-javascript/logger');
const ephemeralLogger = new EphemeralLogger('@myorg/mypackage/MyModule');
const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule', ephemeralLogger);

logger.info('Hello world!');

//...

assert.isTrue(ephemeralLogger.sink.lines[0].contains('Hello world!'))
```

<a name="license">License</a>
-----------------------------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/craigparra/alt-logger/master/LICENSE).

Copyright (c) 2021 Craig Parravicini    
