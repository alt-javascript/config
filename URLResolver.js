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
          return v;
        } catch (e) {
          return v;
        }
      }
      return v;
    });
    return resolvedConfig;
  }

  async asyncResolve(config) {
    const self = this;
    const resolvedConfig = await Resolver.prototype.asyncMapValuesDeep(config, async (v) => {
      if (self.selector.matches(v)) {
        try {
          const selectedValue = self.selector.resolveValue(v);
          const fetchedValue = await this.fetch(selectedValue);
          return fetchedValue;
        } catch (e) {
          return v;
        }
      }
      return v;
    });
    return resolvedConfig;
  }

  async fetch (url,authorization,method,body,headers){
    let _headers = authorization ? {'authorization':authorization} : {};
    _.assignIn(_headers,headers)
    let opts = {method: method || 'get',headers: _headers}
    if (method && method?.lowerCase()!='get'  && method?.lowerCase() != 'head'){
      _.assignIn(opts,JSON.stringify(body||{}))
    }
    return await fetch(url, opts).then(res => res.json());
  }

};
