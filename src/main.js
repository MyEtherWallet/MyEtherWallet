// eslint-disable-next-line
if (BUILD === 'offline') {
  import('@/main/offlineMain.js');
} else {
  import('@/main/liveMain.js');
}
