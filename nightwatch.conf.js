module.exports = {
  test_settings: {
    default: {
      launch_url: 'https://localhost:8080',
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        acceptInsecureCerts: true
      }
    }
  }
};
