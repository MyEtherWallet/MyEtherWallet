module.exports = {
  client: {
      service: {
          name: 'api',
          url: 'https://hbfzqg7jia.execute-api.us-west-2.amazonaws.com/dev',
          includes: ['**/*.graphql'],
          excludes: ['node_modules/**/*']
      }
  }
}
