module.exports = {
  // uncomment for windows support
  // webdriver: {
  //   start_process: true,
  //   server_path: require('chromedriver').path
  // },
  test_settings: {
    default: {
      launch_url: 'https://localhost:8080',
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        acceptInsecureCerts: true,
        chromeOptions: {
          w3c: false,
          args: [
            // take these out on local
            '--headless',
            '--no-sandbox',
            '--disable-gpu'
          ],
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
