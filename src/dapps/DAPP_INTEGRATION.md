### WARNING: V6 and MEWComponents Library are in active development

---

### Project Overview

Decentralized applications (dapps) are integrated through inclusion in the dapps section of MEW and modification of the ModuleDappCenter. Each dapp has a folder in the dapps directory where their code is located.

The best way to start an integration is by creating a fork of MyEtherWallet and using it for your development.

---

### Prerequisites

- Best `Node.js` version to use is `10 >= Node.js <= 12`
- `npm` version 6 or greater

---

### How to Start

    # Clone this repository
    $ git clone git@github.com:MyEtherWallet/MyEtherWallet.git

    # Switch to development branch
    $ git checkout develop

    # Install dependencies
    $ npm install

    # Create the build
    $ npm run build.

    # start
    $ npm run start

    App should be running in https://localhost:8080

Note: You can also use the offline version by opening `index.html` from the `dist` folder with your browser.

---

### Most Common Issues

- Can't start due to an update found

  `ERROR: Update print-js from 1.0.60 to 1.0.63. Released: 2019-11-15T05:05:52.202Z`

  How to fix: Update packages (as told by the terminal error you will see) in `package.json`

      $ npm install
      $ npm start

- `EACCESS` issue can be resolved by running:

  `$ sudo chown -R $(whoami) ~/.npm`

For other issues, try the steps shown [here](https://www.google.com) by **@tomwalton78**.

---

### Directory Structure

Dapps live in the `src/dapps` folder. All code related to dapps will be located in a sub-folder to the `/dapps` folder, except for the core route.

`/dapps` folder should contain:

- `/handlers` folder with all `.js` files like: handlers files, helpers, and etc. Handler file includes a subsystem logic that does not need a UI interface to invoke the unit test.

- `/modules` folder with `module.vue` files. Module folder is used to group multiple subsystems that have similar functionality and/or reuse the same handlers. `module.vue` file encapsulates a single subsystem’s components (interface) and handlers (logic), mixins, filters, etc defined within a single functionality of a subsystem.

- `/components` folder with pure UI components or simple logic (separate them by module if multiple components are used only a specific module). If you are making a simple component like a button, please refer to our [Mew Components](https://www.npmjs.com/package/@myetherwallet/mew-components) library. It has the majority of the base simple UI components.

- `TheDappLayout.vue` file encapsulates a single dapp (interface) with multiple modules.

Note: Great example file structure can be found in `/eth-blocks` dapp.

---

### Integration Walkthrough

##### A. Dapp layout

1. Create a folder with your dapp name under `src/dapps` → `src/dapps/dapp-name`.
2. In the `/dapp-name` folder, create `TheDappNameLayout.vue`. This Vue file will encapsulate a single dapp interface with single or multiple modules.
3. In `TheDappNameLayout.vue`, add the following:

   ```html
   <template>
     <the-wrapper-dapp> </the-wrapper-dapp>
   </template>
   ```

   ```html
   <script>
     import TheWrapperDapp from '@/core/components/TheWrapperDapp';
     export default {
       components: { TheWrapperDapp }
     };
   </script>
   ```

   `TheWrapperDapp` provides a dapp layout with banner image on top and has an option to provide a dapp tab-menu. It will be placed after the banner, and it has tab slots to include your content.

   ##### TheWrapperDapp `Props`

   | Name            | Type                                                                                                                 | Description                                                                                                                                                                                                                                                                  |
   | --------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `bannerImage`   | `string`                                                                                                             | Provides Banner Image to the dapp wrapper. default = `@/assets/images/backgrounds/bg-dapps-center.png`                                                                                                                                                                       |
   | `bannerText`    | <pre>Object = { <br> title: i18n // string, <br> subtext: i18n // string <br>} </pre>                                | Provides Banner title and subtext. <br> Example: <br> <pre> <br> bannerText = { <br> title: this.\$t('ens.title'), <br> subtext: this.\$t('ens.dapp-desc') <br>} </pre>                                                                                                      |
   | `tabItems`      | <pre>Object Array = [{ <br> name: i18n // string, <br> route: { name: tabName //string }, <br> id: 1 //number <br>}] | Provides dapp menu text. Use this prop to display the menu for the dapp or leave it undefined, in that way a menu will not be present. <br> Example: <br> <pre> <br> tabItems = [ <br> { name: this.\$t('ens.title') }, <br> { name: this.\$t('ens.dapp-desc') }<br>] </pre> |
   | `activeTab`     | `number`                                                                                                             | Controls active dapp menu tab. Leave it `undefined` if `tabItems` is `undefined`. <br> default = `0`                                                                                                                                                                         |
   | `validNetworks` | `Object Array`                                                                                                       | Networks that the dapp is accessible on. <br> All network objects can be found here: `src/utils/networks/types`                                                                                                                                                              |

<br>

#### TheWrapperDapp

**Tab Menu**

To start, you can include the following Vue template:

```html
<template>
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>
```

`tabItems` prop is an `Array` object that specifies a name to be displayed within a tab, route path or route name to be used when user clicks on the menu and id. `activeTab` takes care of identifying which dapp is being viewed by the user. In order to facilitate proper menu selection when user navigates to the dapp routes from other links, you need to asigns proper `activeTab` value on mounted and add watch methods.

```javascript
 data() {
   return {
     activeTab: 0
     tabs: [
       {
         name: 'Menu 1',
         route: { name: 'route1'},
         id: 0
       },
       {
         name: 'Menu 2',
         route: { name: 'route2'},
         id: 0
       }
     ],
   }
 },
 mounted() {
   if (this.$route.name === 'route2') {
     this.activeTab = this.tabs[1].id;
 },
 watch: {
   $route(to) {
     if (to.name === 'route2') {
       this.activeTab = this.tabs[1].id;
         } else {
       this.activeTab = this.tabs[0].id;
     }
   }
 },
```

**Other props include:**

- `dappImg` is a small dApp icon that is displayed on top of the menu.
- `validNetworks` props identifies on which network the dapp is available. If your dapp is only available on Mainnet, you can specify:

```javascript
import { ETH } from '@/utils/networks/types';

data() {
  return {
    validNetworks: [ETH]
  }
}
```

- `bannerText` is an object that specifies name and subtext to be displayed above the menu next to the `dappImg`

```javascript
data() {
  return {
    bannerText: {
      title: 'Awesome DApp',
      subtext: 'This DApp does awesome things.'
    }
  }
}
```

**metaInfo.js**

This fill routes to the dapp page and adds the button on the Dapps center page. First create a file `metainfo.js` with the following contents:

```javascript
import layout from './TheDappNameLayout.vue';
import Module1 from './modules/Module1';
import Module2 from './modules/Module2';
import { ETH } from '@/utils/networks/types';

export default {
  title: 'Awesome DApp',
  subtitle: 'This DApp does awesome things.',
  tag: '#awesomeness',
  rightIconType: 'mew',
  rightIcon: 'ethBlocks',
  path: 'route1',
  networks: [ETH],
  isNew: true,
  layout,
  defaultName: 'route1',
  meta: {
    noAuth: false
  },
  children: [
    {
      name: 'route1',
      path: 'route1', // selected tab by default
      component: Module1
    },
    {
      path: 'route2',
      name: 'route2',
      component: Module2
    }
  ]
};
```

`title`, `subtitle` and `tag` will be displayed within the dapp center button.

`networks` is an array that identifies which network the dapp is accessible on. In the example we specified just mainnet. All network objects can be found here: `src/utils/networks/types`

If you want to add children routes such add props to the object and route guards, create `src/dapps/your-dapp/dappRoutes.js` with your routes definition and import it in the `src/dapps/routes-dapps.js`. You can read more on [Vue Router](https://router.vuejs.org/guide/#html).

**`src/dapps/your-dapp/dappRoutes.js`**

```javascript
import TheSomeDappLayout from './TheSomeDappLayout';

const dappProps = route => {
 return {
    prop1: route.params.some-prop
  }
};

const routerGuards = (to, from, next) => {
  if (route.params) {
    const validProps = ['some-prop',...]
    if(validProps.includes = [route.params.some-prop]) {
      next();
    } else {
      next('some-dapp');
    }
  } else {
    next();
  }
};

export default {
  path: 'some-dapp/:props? ',
  name: 'Amazing Unicorn Dancing',
  component: TheSomeDappLayout,
  props: dappProps,
  beforeEnter: routeGuards
};
```

**`src/dapps/routes-dapps.js`**

```javascript
import someDappRoutes from './some-dapp/someDappRoutes';

export default [someDappRoutes];
```

##### B. Dapp Center

To include your dapp in the dapp center, you need to update the dapps object in `ModuleDappsCenter.vue`. The dapps object provides content for the `MewSuperButton` component.

To read more about `MewSuperButton` props, go [here](https://myetherwallet.github.io/mew-components/?path=/story/mewbutton--mew-button).

**`src/modules/dapps-center/ModuleDappsCenter.vue`**

```javascript
data() {
  return {
    dapps: {
      YourDapp: {
        title: 'My Super Awesome Dapp',
        subtitle: 'Amazing Unicorn Dancing',
        tag: '#Defi',
        isNew: true, //this will add a new tag
        rightIconType: 'mew',
        rightIcon: 'advancedTools'
      }
    }
  };
}
```

---

### Store Management

When necessary, you can create your own `store` to separate it from the rest of the current `store`. An example can be found at `@/dapps/eth-blocks/store`. This will allow everyone to easily maintain or make changes that will not affect the rest of the application.

```
    MyEtherWallet
    │  README.md
    └── src
        └─── dapps
              └─── your-dapp-folder
                    └─── store
```

Import your `store` to `@/dapps/dappsStore.js`.

With [Vuex](https://vuex.vuejs.org/), you can specify your namespace for your dapp and use that when fetching information:

In your state `index.js`,

```javascript
namespace: ‘yourDappName’
```

Using `getters`, `actions`, `mutations`, and `states`:

```javascript
...mapGetters('yourDappName', ['yourGetter'])
...mapState('yourDappName', ['yourState'])
...mapAction('yourDappName', ['yourAction'])
...mapMutation('yourDappName', ['yourMutation']) // would advise to use an action to commit a mutation instead
```

Important note about `store` management, if you look through the current stores we already have, you will see a key called `localStorage: boolean`. This key will define whether your state will be saved and synced with the browser's `localStorage`.
If you set `localStorage` to `true`, you will need to setup a couple of things:

1. `configs.js` file in your dapp's `store` folder

```
// configs.js
export default {
  LOCAL_STORAGE_KEYS: {
    yourDappName: 'your-dapp-name-store'
  },
  VERSION: {
    yourDappName: '0.0.1'
  }
};

```

In this example, `yourDappName` will appear in the browser's `localStorage`.
The `VERSION` is an easy way of resetting/resyncing your dapp's store.

2. You will need to setup the store init on your dapp's `mutation.js`:

```
const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.yourDappName)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.yourDappName);
    if (savedStore.stateVersion === Configs.VERSION.yourDappName) {
      Object.assign(state, savedStore);
    }
  }
};
```

this ensures that the store can be initialized with the saved values that is in the `localStorage`

3. Call your init mutation, and import your configs in the `@/dapps/dappsStore.js`:

```
const dappStoreBeforeCreate = _store => {
  // Add your changes here
};


const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...YourDappConfig.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...YourDappConfig.VERSION
  }
};
```

If you have any issue, you can always contact us or you can create an issue in our Github [repository](https://github.com/MyEtherWallet/MyEtherWallet).

---

### Web3

- DApps have access to an integrated `web3` instance which handles all the interactions with a users wallet, and the network. (In essence, you get a ready to go `web3` instance to interact with as you wish).

[Web3 Documentation](https://web3js.readthedocs.io/en/v1.3.4/#)

---

### UI Guidelines

- The UI of the dapp must follow MEW style guide. We provide typography styles and colors defined in the style guide. You can find them in the `mew-components` documentation. You can explore our style guide [here](https://myetherwallet.github.io/mew-components/).
- Majority of the needed base components are already premade in the `mew-components`. You do not have to do any imports. You can directly use the components in the html template.
- Other components should be done with the help of [Vuetify](https://vuetifyjs.com/en/) framework.

---

### Code Style Guide

Pattern Name conventions:

- `.js` files should start with lowercase letter and use camelCase
- Folder names should start with lowercase letter and use kebab-case
- `.vue` files should start with capital letter and use PascalCase

_Please refers to the Vue guidelines in the style guide for additional questions_

---

### Translations

Make sure all hard-coded strings are translated.

1. Create a new folder under translations with the correct dapp name.
2. Add an `en_US.json` file under it.
3. Then add the correct route under `translations/en_US.js`. Add the right translations to the `dapp_name/en_US.json` file and make sure all translated attributes are using the _kebab-case_.
   Note: We currently have active support for Russian language, and we advise you to provide translations if possible. In that way, they will be consistent with your dapp branding and prevent broken UI due to different string length. Otherwise, our team will compile them some time after the release.

---

### Final Note

Beyond the above stated criteria you are free to implement dapp’s functionality as you desire. Yet all dapps will be reviewed and must be approved by MEW prior to inclusion. This may include requiring changes to how a dapp is implemented.
