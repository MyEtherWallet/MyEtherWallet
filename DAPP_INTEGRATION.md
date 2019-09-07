Dapp are integrated through inclusion in the dapps section of MEW.

Each dapp has a folder in the dapps directory where their code is located.

The best way to start an integration is by creating a fork of MyEtherWallet, and using it for your development.

- Dapps have access to an integrated web3 instance which handles all the interactions with a users wallet, and the network. (in essence you get a ready to go web3 instance to interact with as you wish)

- Dapps live in the dapps folder.  All the code related to the dapp will be located in a sub-folder to the dapps folder.

- This sub-folder should contain at least one .vue file, routes.js file, and .scss style file for the dapp.  It may also contain any additional files/helpers for the dapp or the dapps ui.

- The UI of the dapp must follow MEW design guidlines located [here](https://github.com/MyEtherWallet/MyEtherWallet-V5-Design-Resources/tree/master/style%20guideline)

- Inclusion of the dapp on the dapp page is through an entry in the `src/dapps/index.js` file.
  - The entry is added to the dapps object in the file and includes the icon as well as title and description displayed to users.
  - The entry must contain the following four items:
    - route: route to the dapp's main page
    - icon: icon to display in the dapp page entry
    - title: title of the dapp to display in the dapp page entry.
    - desc: brief description of the dapp to display in the dapp page entry. (limited to two lines, about 60 characters)

- To properly route to the dapp the dapps routes must be added to the router.  This is done by importing the routing.js file from the dapp sub-directory and adding it to the routes object in `src/dapps/routes.js`

- Beyond the above stated criteria a dapp is free to implement its functionality as it desires.  Yet all dapps will be reviewed and must be approved by MEW prior to inclusion.  This may include requiring changes to how a dapp is implemented.

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
Example  `SomeDapp/routes.js`:

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
