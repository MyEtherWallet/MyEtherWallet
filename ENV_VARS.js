const version = require('./package.json').version;

module.exports = {
  VERSION: JSON.stringify(version),
  ROUTER_MODE: JSON.stringify(process.env.ROUTER_MODE || 'hash'),
  BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web'),
  FULL_SOURCEMAPS: JSON.stringify(process.env.FULL_SOURCEMAPS || 'false'),
  NODE_ENV: JSON.stringify(process.env.NODE_ENV)
};
