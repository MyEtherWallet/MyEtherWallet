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
  // look into updating after release
  'dns-packet',
  'decode-uri-component',
  '@openzeppelin/contracts',
  'engine.io',
  'socket.io-parser',
  'fast-xml-parser',
  '@grpc/grpc-js',
  'is_js',
  'get-func-name',
  'browserify-sign'
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
  console.log('AUDIT complete');
});
