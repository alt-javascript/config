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

  async asyncResolve(config, parentConfig, path) {
    const self = this;
    const resolvedConfig = await Resolver.prototype.asyncMapValuesDeep(config, async (v) => {
      if (self.selector.matches(v)) {
        try {
          const selectedValue = self.selector.resolveValue(v);
          let urlPath = path.substring(0,path.lastIndexOf('.'));
          let method = parentConfig.has(`${urlPath}.method`) ? parentConfig.get(`${urlPath}.method`) : null;
          let authorization = parentConfig.has(`${urlPath}.authorization`) ? parentConfig.get(`${urlPath}.authorization`) : null;
          let body = parentConfig.has(`${urlPath}.body`) ? parentConfig.get(`${urlPath}.body`) : null;
          let headers = parentConfig.has(`${urlPath}.headers`) ? parentConfig.get(`${urlPath}.headers`) : null;
          const fetchedValue = await this.fetch(selectedValue,authorization,method,body,headers);
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
    if (method && method?.toLowerCase()!='get'  && method?.toLowerCase() != 'head'){
      _.assignIn(opts,JSON.stringify(body||{}))
    }
    return await fetch(url, opts).then(res => res.json());
  }

};
