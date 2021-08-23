const version = require('./package.json').version;

module.exports = {
  VERSION: JSON.stringify(version),
  ROUTER_MODE: JSON.stringify(process.env.ROUTER_MODE || 'hash'),
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  BTC_DONATION_ADDRESS: JSON.stringify('1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9'),
  ETH_DONATION_ADDRESS: JSON.stringify(
    '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
  ),
  FULL_SOURCEMAPS: JSON.stringify(process.env.FULL_SOURCEMAPS || 'false'),
  INTERCOM: JSON.stringify(process.env.INTERCOM_ID)
};
