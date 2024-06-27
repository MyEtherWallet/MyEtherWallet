/**
 * amplitude wrapper from Gage
 */

import * as sessionReplay from '@amplitude/session-replay-browser';
import * as amplitude from '@amplitude/analytics-browser';

/**
 * Wrapper class for amplitude analytics-browser module.
 *
 * The constructor takes the exact same arguments as the original module and the methods remain exactly the same.
 * Instantiate just as you would use amplitude. E.g.
 *
 * const amplitudeInstance = new Amplitude('randomstring', {
 *   instanceName: 'mew-web-dev',
 *   serverUrl: 'https://analytics-web-development.mewwallet.dev/record',
 *   appVersion: 1,
 *   trackingOptions: {
 *     ipAddress: false
 *   },
 *   identityStorage: 'none',
 *   logLevel: amplitude.Types.LogLevel.None,
 *   defaultTracking: {
 *     formInteractions: false,
 *     pageViews: false
 *   }
 * })
 *
 * Use the same methods. E.g.
 *
 * amplitudeInstance.track(args)
 *
 */
class Amplitude {
  constructor(...args) {
    // Member variables pertaining to amplitude //
    this.amplitude = amplitude;
    this.amplitude.init.apply(this.amplitude, args);

    // Create a proxy to handle method calls //
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        // If the method exists on the class itself, return it //
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        // If the method exists on the amplitude module, return it //
        if (typeof target.amplitude[prop] === 'function') {
          return target.amplitude[prop].bind(target.amplitude);
        }
        // Otherwise, return the property from the class itself //
        return Reflect.get(target, prop, receiver);
      }
    });
  }
}

/**
 * Wrapper class for amplitude analytics-browser module and session-replay-browser combined into one convenient class.
 *
 * The constructor takes the exact same arguments as the original module and the methods remain exactly the same,
 * except for one caveat.
 * Instantiate just as you would use amplitude, except now there is an additional object to house the session-replay-browser
 * options named "sessionReplayOptions"
 *
 * const amplitudeSessionReplay = new AmplitudeSessionReplay('randomstring', {
 *   instanceName: 'mew-web-dev',
 *   serverUrl: 'https://analytics-web-development.mewwallet.dev/record',
 *   appVersion: 1,
 *   trackingOptions: {
 *     ipAddress: false
 *   },
 *   identityStorage: 'none',
 *   logLevel: amplitude.Types.LogLevel.None,
 *   defaultTracking: {
 *     formInteractions: false,
 *     pageViews: false
 *   },
 *   sessionReplayOptions: {
 *     sampleRate: 2
 *   }
 * })
 *
 * Now you can track and include the session replay data. E.g.
 *
 * amplitudeSessionReplay.track(args)
 *
 */

class AmplitudeSessionReplay extends Amplitude {
  constructor(...args) {
    // Extract sessionReplayOptions from args. Delete the sessionReplayOptions before calling super() //
    let sessionReplayOptions = {
      sampleRate: 1 // default to 1 sec polling interval
    };
    if (args.length > 1 && args[1].sessionReplayOptions) {
      sessionReplayOptions = {
        ...sessionReplayOptions,
        ...args[1].sessionReplayOptions
      };
      delete args[1].sessionReplayOptions; // Remove sessionReplayOptions from args before passing to super
    }

    // Pass to Amplitude class //
    super(...args);

    // Member variables pertaining to sessionReplay //
    this.apiKey = args[0];
    this.sessionReplayOptions = sessionReplayOptions;
    this.sessionReplay = sessionReplay;
    if (!args[1].optOut) {
      this.initSessionReplay();
    }

    // Extend the proxy to include sessionReplay methods //
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        // If the method exists on the class itself, return it //
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        // If the method exists on the amplitude module, return it //
        if (typeof target.amplitude[prop] === 'function') {
          return target.amplitude[prop].bind(target.amplitude);
        }
        // If the method exists on sessionReplay, return it //
        if (typeof target.sessionReplay[prop] === 'function') {
          return target.sessionReplay[prop].bind(target.sessionReplay);
        }
        // Otherwise, return the property from the class itself //
        return Reflect.get(target, prop, receiver);
      }
    });
  }

  /**
   * Initialize sessionReplay. It requires that the amplitude module is initialized, so a simple setTimeout() check
   * is implemented to check for the readiness of amplitude.
   */
  initSessionReplay() {
    // Get deviceId from amplitude. If it is undefined, it is not properly initialized yet. //
    const deviceId = this.amplitude.getDeviceId();
    if (deviceId !== undefined) {
      // amplitude is ready -- initialize sessionReplay by merging the required params from the amplitude module... //
      // ... with sessionReplayOptions //
      this.sessionReplay.init(this.apiKey, {
        ...{
          deviceId: this.amplitude.getDeviceId(),
          sessionId: this.amplitude.getSessionId()
        },
        ...this.sessionReplayOptions
      });
    } else {
      // Not ready -- check again in (50ms) //
      setTimeout(() => {
        /* eslint-disable no-console */
        console.log('Waiting for amplitude to initialize...');
        this.initSessionReplay();
      }, 50);
    }
  }

  /**
   * Overloaded/extended track() function. To work properly with sessionReplay, the original track function event properties need
   * to be combined with properties from the sessionReplay. This convenience method merges the two objects correctly to properly
   * track a given event.
   *
   * Usage:
   *
   * AmplitudeSessionReplayInstace.track('SampleEvent', {
   *   foo: 1,
   *   bar: 2
   * })
   *
   * @param  {String} eventName       Name of event
   * @param  {Object} eventProperties Event properties pertaining to event
   */
  track(eventName, eventProperties = {}) {
    const sessionReplayProperties =
      this.sessionReplay.getSessionReplayProperties();
    this.amplitude.track(eventName, {
      ...eventProperties,
      ...sessionReplayProperties
    });
  }

  /**
   * Custom method to enable and disable session replay. This method is not part of the original amplitude module.
   * @param {Boolean} val
   * **/

  toggleSessionReplay(val) {
    if (val) {
      this.sessionReplay.shutdown();
    } else {
      this.initSessionReplay();
    }
  }
}

export { Amplitude, AmplitudeSessionReplay };
// Sample usage //
// const amplitudeSessionReplay = new AmplitudeSessionReplay('randomstring', {
//   instanceName: 'mew-web-dev',
//   serverUrl: 'https://analytics-web-development.mewwallet.dev/record',
//   appVersion: 1,
//   trackingOptions: {
//     ipAddress: false
//   },
//   identityStorage: 'none',
//   logLevel: amplitude.Types.LogLevel.None,
//   defaultTracking: {
//     formInteractions: false,
//     pageViews: false
//   },
//   sessionReplayOptions: {
//     sampleRate: 2
//   }
// });

// amplitudeSessionReplay.track('SampleEvent', {
//   event_properties: {
//     foo: 1,
//     bar: 2
//   }
// });
