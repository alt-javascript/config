/* eslint-disable import/extensions */
import Resolver from './Resolver.js';

export default class SelectiveResolver extends Resolver {
  constructor(selector) {
    super();
    this.selector = selector;
  }
}
