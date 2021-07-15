const _ = require('lodash');
const fetch = require('node-fetch');
const Resolver = require('./Resolver');
const SelectiveResolver = require('./SelectiveResolver');
const PrefixSelector = require('./PrefixSelector');

module.exports = class URLResolver extends SelectiveResolver {
  constructor(selector) {
    super(selector || (new PrefixSelector('url.')));
  }

  resolve(config) {
    const self = this;
    const resolvedConfig = Resolver.prototype.mapValuesDeep(config, (v) => {
      if (self.selector.matches(v)) {
        try {
          const selectedValue = self.selector.resolveValue(v);
          const fetchedValue = this.fetch(selectedValue);
          return decryptedValue;
        } catch (e) {
          return v;
        }
      }
      return v;
    });
    return resolvedConfig;
  }

  fetch (url,authorization,method,body,headers){
    let _headers = authorization ? {'authorization':authorization} : {};
    let fetchedValue = '';
    _.assignIn(_headers,headers)
    fetch('url', {
      method: method || 'get',
      body:    JSON.stringify(body||{}),
      headers: _headers,
    })
        .then(res => res.json())
        .then(json => fetchedValue = JSON.parse(json));
    return fetchedValue;
  }

};
