export default class EphemeralConfig {
  constructor(object, path) {
    const self = this;
    this.object = object;
    this.path = path;
    if (this.object) {
      Object.assign(self, this.object);
    }
  }

  get(path, defaultValue) {
    if (!(typeof this.object?.[path] === 'undefined')) {
      return this.object?.[path];
    }
    const pathSteps = path?.split('.') || [];
    let root = this.object;
    for (let i = 0; i < pathSteps.length && root !== null && root !== undefined; i++) {
      root = root?.[pathSteps[i]];
    }
    if (root) {
      return root;
    }
    if ((typeof defaultValue !== 'undefined')) {
      return defaultValue;
    }
    throw new Error(`Config path ${path} returned no value.`);
  }

  has(path) {
    if (!(typeof this.object?.[path] === 'undefined')) {
      return true;
    }
    const pathSteps = path?.split('.') || [];
    let root = this.object;
    for (let i = 0; i < pathSteps.length && root !== null && root !== undefined; i++) {
      root = root?.[pathSteps[i]];
    }
    return root !== null && root !== undefined;
  }
}
