const offlineConfig = require('./builds/offlineConfig');
const liveConfig = require('./builds/liveConfig');

let exportObj = {};
if (process.env.BUILD === 'offline') {
  exportObj = offlineConfig;
} else {
  exportObj = liveConfig;
}

module.exports = exportObj;
