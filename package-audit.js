const exec = require('child_process').exec;

const AUDIT_EXCEPTIONS = [
  'tar',
  'trim-newlines',
  'css-what',
  'normalize-url',
  'diff',
  'shelljs',
  // no patches available
  'ansi-html',
  'minimist',
  'moment',
  'axios',
  'async',
  'nth-check',
  'semver-regex',
  'scss-tokenizer',
  'codecov', // no package found
  'loader-utils', // breaks building
  'json5',
  'http-cache-semantics',
  'cacheable-request',
  'dns-packet',
  'decode-uri-component',
  '@openzeppelin/contracts',
  'engine.io',
  'socket.io-parser',
  'fast-xml-parser',
  '@grpc/grpc-js',
  'is_js',
  'get-func-name',
  'chart.js',
  'browserify-sign',
  'lodash.pick',
  'ip',
  'webpack-dev-middleware',
  'web3-utils',
  // added from transition to yarn
  'crypto-js',
  'flat',
  'bls12377js',
  'parse-url',
  '@solana/web3.js',
  'lodash.template',
  'html-minifier'
];
const execute = (command, callback) => {
  exec(
    command,
    {
      maxBuffer: 2000 * 4096
    },
    (error, stdout, stderr) => {
      callback(stdout);
    }
  );
};
execute('yarn audit --json --level=high', json => {
  const x = json
    .split(new RegExp(/\n/))
    .filter(item => {
      if (item !== '') return item;
    })
    .map(item => {
      return JSON.parse(item);
    })
    .filter(item => {
      if (item.type !== 'auditSummary') {
        const module_name = item.data.advisory.module_name;
        const found = AUDIT_EXCEPTIONS.includes(module_name);
        if (!found) return item;
      }
    });
  if (x.length > 0) {
    x.forEach(item => {
      console.log(item);
    });
    process.exit(1);
  }
  console.log('AUDIT complete');
  process.exit(0);
});
