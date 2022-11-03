module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        }
      }
    ]
  ]
};
