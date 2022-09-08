const exec = require('child_process').exec;

const AUDIT_EXCEPTIONS = [
  'decompress',
  'http-proxy',
  'findings',
  'elliptic',
  'dot-prop',
  'serialize-javascript',
  'handlebars',
  'cryptiles',
  'bl',
  'axios',
  'xmlhttprequest-ssl',
  'url-parse', // added 5-10-21
  'underscore', // added 5-10-21
  'lodash', // added 5-10-21,
  'dns-packet', // added 5-25-21 (could be related to an @ensdomains internal dependency)
  'normalize-url', // added 6/23/21
  'css-what', // added 6/23/21
  'trim-newlines', // added 6/23/21
  'socket.io-parser', // added 7/2/21
  'tar', // added 8/5/21
  'node-fetch',
  'marked',
  'is-svg',
  'ini',
  'ssri',
  'glob-parent',
  'ansi-html',
  'follow-redirects',
  'simple-get',
  'moment',
  'terser',
  'scss-tokenizer',
  'ansi-regex',
  'parse-path',
  'parse-url',
  'mout',
  'engine.io',
  'protobufjs',
  'async',
  'semver-regex',
  'nth-check',
  'node-forge',
  'tmpl',
  'nconf',
  'pathval'
];

const execute = (command, callback) => {
  exec(
    command,
    {
      maxBuffer: 100000 * 1024
    },
    (error, stdout, stderr) => {
      callback(stdout);
    }
  );
};
execute('npm audit --json', json => {
  const advisories = JSON.parse(json).advisories;
  if (!advisories) {
    console.info('Most likely npm audit is unavailable', json);
    process.exit(0);
  }
  let auditPass = true;
  for (const id in advisories) {
    if (
      advisories[id].severity === 'high' &&
      !AUDIT_EXCEPTIONS.includes(advisories[id].module_name)
    ) {
      console.error('AUDIT Failed', advisories[id]);
      auditPass = false;
    }
  }
  if (!auditPass) process.exit(1);
});
