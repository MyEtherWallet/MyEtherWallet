module.exports = {
  test_settings: {
    default: {
      launch_url: 'https://localhost:8080',
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        acceptInsecureCerts: true,
        chromeOptions: {
          args: ['window-size=1980,1080'],
          prefs: {
            download: {
              default_directory: './download_folder',
              prompt_for_download: false
            },
            profile: {
              default_content_setting_values: { automatic_downloads: 1 }
            }
          }
        }
      }
    }
  }
};
