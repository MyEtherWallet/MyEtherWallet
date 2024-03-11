// eslint-disable-next-line
if (import.meta.env.BUILD === 'offline') {
  import('@/main/offlineMain.js');
} else {
  import('@/main/liveMain.js');
}
