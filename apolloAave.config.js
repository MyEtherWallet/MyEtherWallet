module.exports = {
  client: {
      service: {
          name: 'aave',
          url: 'https://api.thegraph.com/subgraphs/name/aave/protocol-multy-raw',
        },
      includes: ['src/dapps/aave-dapp/**/*.graphql']
  }
}
