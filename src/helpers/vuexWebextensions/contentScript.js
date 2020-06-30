/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

import Logger from './logger';

class ContentScript {
  constructor(store, browser, settings) {
    this.store = store;
    this.browser = browser;
    this.settings = settings;
    this.scriptId = Math.random().toString(36).substr(2, 9);
    this.connection = null;
    this.receivedMutations = [];
    this.receivedActions = [];
    this.initialized = false;
    this.pendingMutations = [];
    this.pendingActions = [];

    // Connect to background script
    this.connection = browser.connectToBackground(
      `${this.settings.connectionName}_${this.scriptId}`
    );

    // Listen for messages
    this.connection.onMessage.addListener(message => {
      this.onMessage(message);
    });

    // Hook mutations
    Logger.verbose(`Listening for mutations`);
    this.store.subscribe(mutation => {
      this.hookMutation(mutation);
    });

    // Hook actions (Vuex version >= 2.5.0)
    if (this.settings.syncActions == true) {
      try {
        Logger.verbose(`Listening for actions`);
        this.store.subscribeAction(action => {
          // Clean event object on payload, this produce error on webextensions messaging serialization ("The object could not be cloned.")
          if (action.payload instanceof Event) {
            action.payload = null;
          }

          this.hookAction(action);
        });
      } catch (err) {
        Logger.info(
          `Can't sync actions because isn't available in your Vuex version, use Vuex v2.5.0 or later for this feature`
        );
      }
    }
  }

  /**
   * Listener for incomming messages from background script.
   * @param {object} message - Message received from background script.
   * @returns {null} This function didn't return any value
   */
  onMessage(message) {
    Logger.verbose(`Received message from background`);

    // Don't process messages without type property, aren't from the plugin
    if (!message.type) {
      return;
    }

    switch (message.type) {
      // Process initial state from the background
      case '@@STORE_SYNC_STATE': {
        Logger.info(`Received store initial state`);
        this.store.commit('vweReplaceState', message.data);
        this.initialized = true;
        this.processPendingMutations();
        break;
      }

      // Process mutation messages from background script
      case '@@STORE_SYNC_MUTATION': {
        Logger.debug(`Received mutation ${message.data.type}`);

        // Don't commit any mutation from other contexts before the initial state sync
        if (!this.initialized) {
          Logger.info(
            `Received mutation (${message.data.type}) but the store isn't initilized yet`
          );
          break;
        }

        this.receivedMutations.push(message.data);
        this.store.commit(message.data.type, message.data.payload);
        break;
      }

      // Process action messages from background script
      case '@@STORE_SYNC_ACTION': {
        Logger.debug(`Received action ${message.data.type}`);

        // Don't commit any action from other contexts before the initial state sync
        if (!this.initialized) {
          Logger.info(
            `Received action (${message.data.type}) but the store isn't initilized yet`
          );
          break;
        }

        this.receivedActions.push(message.data);
        this.store.dispatch(message.data);
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Hook for retrieve the comited mutations from content script.
   * @param {object} mutation - Mutation comited on content script store.
   * @returns {null} This function didn't return any value
   */
  hookMutation(mutation) {
    Logger.debug(`Hooked mutation (${mutation.type})`);

    // If it's store initialization mutation don't send again to other contexts
    if (mutation.type === 'vweReplaceState') {
      Logger.debug(
        `vweReplaceState mutation don't need send to other contexts`
      );

      return;
    }

    // If it's ignored mutation don't sync with the other contexts
    if (
      this.settings.ignoredMutations.length > 0 &&
      this.settings.ignoredMutations.includes(mutation.type)
    ) {
      Logger.info(
        `Mutation (${mutation.type}) are on ignored mutations list, skiping...`
      );

      return;
    }

    // If store isn't initialized yet, just enque the mutation to reaply it after sync
    if (!this.initialized) {
      Logger.info(
        `Hooked mutation (${mutation.type}) before initialization, enqued on pending mutations`
      );

      return this.pendingMutations.push(mutation);
    }

    // If received mutations list are empty it's own mutation, send to background
    if (!this.receivedMutations.length) {
      return this.sendMutation(mutation);
    }

    // Check if it's received mutation, if it's just ignore it, if not send to background
    for (let i = this.receivedMutations.length - 1; i >= 0; i--) {
      if (
        this.receivedMutations[i].type == mutation.type &&
        this.receivedMutations[i].payload == mutation.payload
      ) {
        Logger.verbose(
          `Mutation ${this.receivedMutations[i].type} it's received mutation, don't send to background again`
        );
        this.receivedMutations.splice(i, 1);
      } else if (i == 0) {
        this.sendMutation(mutation);
      }
    }
  }

  /**
   * Hook for retrieve the comited actions from content script.
   * @param {object} action - Action comited on content script store.
   * @returns {null} This function didn't return any value
   */
  hookAction(action) {
    Logger.debug(`Hooked action (${action.type})`);

    // If it's ignored action don't sync with the other contexts
    if (
      this.settings.ignoredActions.length > 0 &&
      this.settings.ignoredActions.includes(action.type)
    ) {
      Logger.info(
        `Action (${action.type}) are on ignored action list, skiping...`
      );

      return;
    }

    // If store isn't initialized yet, just enque the action to reaply it after sync
    if (!this.initialized) {
      Logger.info(
        `Hooked action (${action.type}) before initialization, enqued on pending actions`
      );

      return this.pendingActions.push(action);
    }

    // If received actions list are empty it's own action, send to background
    if (!this.receivedActions.length) {
      return this.sendAction(action);
    }

    // Check if it's received action, if it's just ignore it, if not send to background
    for (let i = this.receivedActions.length - 1; i >= 0; i--) {
      if (
        this.receivedActions[i].type == action.type &&
        this.receivedActions[i].payload == action.payload
      ) {
        Logger.verbose(
          `Action ${this.receivedActions[i].type} it's received action, don't send to background again`
        );
        this.receivedActions.splice(i, 1);
      } else if (i == 0) {
        this.sendAction(action);
      }
    }
  }

  /**
   * Helper function to send mutations to background script.
   * @param {object} mutation - The mutation to send.
   * @returns {null} This function didn't return any value
   */
  sendMutation(mutation) {
    Logger.debug(`Sending mutation (${mutation.type}) to background script`);

    this.connection.postMessage({
      type: '@@STORE_SYNC_MUTATION',
      data: mutation
    });
  }

  /**
   * Helper function to send actions to background script.
   * @param {object} action - The action to send.
   * @returns {null} This function didn't return any value
   */
  sendAction(action) {
    Logger.debug(`Sending action (${action.type}) to background script`);

    this.connection.postMessage({
      type: '@@STORE_SYNC_ACTION',
      data: action
    });
  }

  /**
   * Process pending mutations queue.
   * @returns {null} This function didn't return any value
   */
  processPendingMutations() {
    Logger.debug(`Processing pending mutations list...`);

    if (!this.pendingMutations.length) {
      Logger.info(`The pending mutations list are empty`);

      return;
    }

    for (let i = 0; i < this.pendingMutations.length; i++) {
      Logger.verbose(
        `Processing pending mutation (${this.pendingMutations[i].type}) with payload: ${this.pendingMutations[i].payload}`
      );
      this.store.commit(
        this.pendingMutations[i].type,
        this.pendingMutations[i].payload
      );

      // Clean the pending mutation when are applied
      this.pendingMutations.splice(i, 1);
    }
  }

  /**
   * Process pending actions queue.
   * @returns {null} This function didn't return any value
   */
  processPendingActions() {
    Logger.debug(`Processing pending actions list...`);

    if (!this.pendingActions.length) {
      Logger.info(`The pending actions list are empty`);

      return;
    }

    for (let i = 0; i < this.pendingActions.length; i++) {
      Logger.verbose(
        `Processing pending action (${this.pendingActions[i].type}) with payload: ${this.pendingActions[i].payload}`
      );
      this.store.dispatch(
        this.pendingActions[i].type,
        this.pendingActions[i].payload
      );

      // Clean the pending action when are applied
      this.pendingActions.splice(i, 1);
    }
  }
}

export default ContentScript;
