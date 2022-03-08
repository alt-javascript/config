/* eslint-disable import/extensions */
import _ from 'lodash';
import Resolver from './Resolver.js';
import SelectiveResolver from './SelectiveResolver.js';
import PrefixSelector from './PrefixSelector.js';

export default class URLResolver extends SelectiveResolver {
  constructor(selector, fetchArg) {
    super(selector || (new PrefixSelector('url.')));
    this.$fetch = fetchArg;
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
          const urlPath = path.substring(0, path.lastIndexOf('.'));
          const method = parentConfig.has(`${urlPath}.method`) ? parentConfig.get(`${urlPath}.method`) : null;
          const authorization = parentConfig.has(`${urlPath}.authorization`) ? parentConfig.get(`${urlPath}.authorization`) : null;
          const body = parentConfig.has(`${urlPath}.body`) ? parentConfig.get(`${urlPath}.body`) : null;
          const headers = parentConfig.has(`${urlPath}.headers`) ? parentConfig.get(`${urlPath}.headers`) : null;
          const fetchedValue = await this.fetch(
            selectedValue, authorization, method, body, headers,
          );
          return fetchedValue;
        } catch (e) {
          return v;
        }
      }
      return v;
    });
    return resolvedConfig;
  }

  async fetch(url, authorization, method, body, headers) {
    if (!this.$fetch) {
      throw new Error('fetch is required');
    }
    const $headers = authorization ? { authorization } : {};
    _.assignIn($headers, headers);
    const opts = { method: method || 'get', headers: $headers };
    if (method && method?.toLowerCase() !== 'get' && method?.toLowerCase() !== 'head') {
      _.assignIn(opts, JSON.stringify(body || {}));
    }
    return this.$fetch(url, opts).then((res) => res.json());
  }
}
