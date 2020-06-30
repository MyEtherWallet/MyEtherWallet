/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 *
 *  Helper class for logging messages of the plugin
 */

class Logger {
  constructor() {
    if (!Logger.instance) {
      this.loggerLevel = 'warning';
      this.levels = ['verbose', 'debug', 'info', 'warning', 'error', 'none'];
      Logger.instance = this;
    }

    return Logger.instance;
  }

  /**
   * Set the minimun log level for show messages
   * @param {string} loggerLevel - The minimun log level to log.
   * @returns {null} This function didn't return any value
   */
  setLoggerLevel(loggerLevel) {
    this.loggerLevel = loggerLevel;
  }

  /**
   * Check if message should be logged through his level and logger level
   * @param {string} logLevel - The message to log.
   * @returns {boolean} Return if message should be logged or not
   */
  shouldLog(logLevel) {
    return (
      this.levels.indexOf(logLevel) >= this.levels.indexOf(this.loggerLevel)
    );
  }

  /**
   * Show verbose message on console
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  verbose(message) {
    this.printMessage('verbose', message);
  }

  /**
   * Show debug message on console
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  debug(message) {
    this.printMessage('debug', message);
  }

  /**
   * Show info message on console
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  info(message) {
    this.printMessage('info', message);
  }

  /**
   * Show warning message on console
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  warning(message) {
    this.printMessage('warning', message);
  }

  /**
   * Show error message on console
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  error(message) {
    this.printMessage('error', message);
  }

  /**
   * Format and print message on console
   * @param {string} level - The logging level of message.
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  printMessage(level, message) {
    // Filter messages by level
    if (!this.shouldLog(level)) {
      return;
    }

    // Format the message
    const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1);
    const formattedMessage = `[${capitalizedLevel}] Vuex WebExtensions: ${message}`;

    if (level == 'error') {
      // eslint-disable-next-line no-console
      console.error(formattedMessage);
    } else if (level == 'warning') {
      // eslint-disable-next-line no-console
      console.warn(formattedMessage);
    } else if (level == 'info') {
      // eslint-disable-next-line no-console
      console.info(formattedMessage);
    } else {
      // eslint-disable-next-line no-console
      console.log(formattedMessage);
    }
  }
}

const instance = new Logger();

export default instance;
