const exec = require('child_process').exec;

// tar package is not applicable to web and waiting for other packages to update
// remove handlebars once keepkey updates their dev dependencies
const AUDIT_EXCEPTIONS = ['tar', 'js-yaml', 'handlebars'];

const execute = (command, callback) => {
  exec(
    command,
    {
      maxBuffer: 2000 * 1024
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
