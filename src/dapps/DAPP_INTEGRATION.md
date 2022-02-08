### WARNING: V6 is in active development, as well as MEWComponents Library

***

### Project Overview

Decentralized applications (dapps) are integrated through inclusion in the dapps section of MEW and modification of the ModuleDappCenter. Each dapp has a folder in the dapps directory where their code is located.

The best way to start an integration is by creating a fork of MyEtherWallet and using it for your development.

***

### Prerequisites

* Best `Node.js` version to use is `10 <= Node.js < 11`
* `npm` version 6 or greater

***

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

Note: You can also use the offline version by opening `index.html` from the `dist` folder with your browser

***

### Most Common Issues

* Can't start due to an update found

  `ERROR: Update print-js from 1.0.60 to 1.0.63. Released: 2019-11-15T05:05:52.202Z`

  How to fix: Update packages (as told by the terminal error you will see) in `package.json`

      $ npm install
      $ npm start

* `EACCESS` issue can be resolved by running:

  `$ sudo chown -R $(whoami) ~/.npm`

For other issues, try the steps shown [here](https://www.google.com) by **@tomwalton78**

***

### Directory Structure

Dapps live in the `/src/dapps` folder. All code related to dapps will be located in a sub-folder to the `/dapps` folder, except for the core route.

`/dapps` folder should contain:

* `/handlers` folder with all js files like: handlers files, helpers, and etc. Handler file includes a subsystem logic that does not need a UI interface to invoke the unit test.

* `/modules` folder with `module.vue` files. Module folder is used to group multiple subsystems that have similar functionality and/or reuse the same handlers. `module.vue` file encapsulates a single subsystem’s components (interface) and handlers (logic), mixins, filters, etc defined within a single functionality of a subsystem.

* `/components` folder with pure UI components or simple logic (separate them by module if multiple components are used only a specific module). If you are making a simple component like a button, please refer to our [Mew Components](https://www.npmjs.com/package/@myetherwallet/mew-components) library. It has the majority of the base simple UI components.

* `TheDappLayout.vue` file encapsulates a single dapp (interface) with multiple modules.

Note: Great example file structure can be found in `/eth-blocks` dapp

***

### Integration Walkthrough

***

* DApps have access to an integrated web3 instance which handles all the interactions with a users wallet, and the network. (in essence you get a ready to go web3 instance to interact with as you wish)

* DApps live in the dapps folder. All the code related to the dapp will be located in a sub-folder to the dapps folder.

* This sub-folder should contain at least one .vue file, routes.js file, and .scss style file for the dapp. It may also contain any additional files/helpers for the dapp or the dapps ui.

* The UI of the dapp must follow MEW design guidlines located [here](https://github.com/MyEtherWallet/MyEtherWallet-V5-Design-Resources/tree/master/style%20guideline)

* Inclusion of the dapp on the dapp page is through an entry in the `src/dapps/index.js` file.

  * The entry is added to the dapps object in the file and includes the icon as well as title and description displayed to users.
  * The entry must contain the following four items:
    * route: route to the dapp's main page
    * icon: icon to display in the dapp page entry
    * title: title of the dapp to display in the dapp page entry.
    * desc: brief description of the dapp to display in the dapp page entry. (limited to two lines, about 60 characters)

* To properly route to the dapp the dapps routes must be added to the router. This is done by importing the routing.js file from the dapp sub-directory and adding it to the routes object in `src/dapps/routes.js`

* Beyond the above stated criteria a dapp is free to implement its functionality as it desires. Yet all dapps will be reviewed and must be approved by MEW prior to inclusion. This may include requiring changes to how a dapp is implemented.

Example directory structure:

MyEtherWallet\\
│\\
├ src\\
    └ dapps\\
        ┆\\
        ├ SomeDapp\\
        │     ├ SomeDapp.vue\\
        │     ├ SomeDapp.scss\\
        │     └ routes.js\\
        ┆\\
        ├ routes.js\\
        └ index.js

\\
Example `SomeDapp/routes.js`:

```javascript
import SomeDapp from './SomeDapp';

export default {
  path: 'dapps/some-dapp',
  name: 'Amazing Unicorn Dancing',
  component: ,
  props: true
};
```

\\
Example entry for the dapps object in `src/dapps/index.js`:

```javascript
  const dapps = {
        ....
    SomeDapp: {
      route: '/interface/dapps/some-dapp',
      icon: someDappIcon,
      title: 'Amazing Unicorn Dancing',
      desc: 'Some dapp with amazing unicorn dancing'
    },
        ....
  };
```

\\
Example entry in `src/dapps/routes.js`:

```javascript
import SomeDapp from './SomeDapp/routes';

        ....
  const routes = {
        ....
      someDapp: SomeDapp,
        ....
  };
```
