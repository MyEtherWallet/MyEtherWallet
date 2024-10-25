module.exports = {
  client: {
      service: {
          name: 'aave',
          url: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
        },
      includes: ['src/dapps/aave-dapp/**/*.graphql']
  }
}
