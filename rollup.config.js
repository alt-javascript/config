export default [
  // Monolithic ESM bundle for browser module implementation.
  {
    input: 'browser/index.js',
    treeshake: true,
    output: {
      file: 'dist/alt-javascript-config-esm.js',
      format: 'esm',
      strict: false,
      externalLiveBindings: false,
      freeze: false,
      sourcemap: false,
      sourcemapExcludeSources: true,
    },
  },
  // IIFE bundle for browsers global import.
  {
    input: 'browser/ConfigFactory.js',
    treeshake: true,
    output: {
      file: 'dist/alt-javascript-configfactory-iife.js',
      format: 'iife',
      name: 'ConfigFactory',
      strict: false,
      externalLiveBindings: false,
      freeze: false,
      sourcemap: false,
      sourcemapExcludeSources: true,
    },
  },
];
