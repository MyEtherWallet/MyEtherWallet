const version = require('./package.json').version;

module.exports = {
  VERSION: JSON.stringify(version),
  ROUTER_MODE: JSON.stringify(process.env.ROUTER_MODE || 'hash'),
  NODE_ENV: JSON.stringify(process.env.NODE_ENV)
};
