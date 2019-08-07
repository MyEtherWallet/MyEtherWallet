const env_vars = require('./ENV_VARS');
const MEWCX = require('./vueConfig/mewcx');
const MEW = require('./vueConfig/mew');
let exportObj = {};
const BUILD_TYPE = JSON.parse(env_vars.BUILD_TYPE);
if (BUILD_TYPE === 'mewcx') exportObj = MEWCX;
else if (BUILD_TYPE === 'web') exportObj = MEW;

module.exports = exportObj;
