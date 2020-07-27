// https://github.com/jkzing/vue-cli-plugin-multi-compiler/blob/master/index.js
module.exports = (api, options) => {
  if (process.env.NODE_ENV !== 'production') return;
  const merge = require('webpack-merge');
  const oldResolveWebpackConfig = api.service.resolveWebpackConfig;
  api.service.resolveWebpackConfig = function resolveWebpackConfig() {
    let config = oldResolveWebpackConfig.call(this);
    const { configureMultiCompilerWebpack } = options.pluginOptions || {};

    if (typeof configureMultiCompilerWebpack === 'function') {
      config = configureMultiCompilerWebpack(config);
    } else if (Array.isArray(configureMultiCompilerWebpack)) {
      config = configureMultiCompilerWebpack.map(curr => merge(config, curr));
    }
    return config;
  };
};
