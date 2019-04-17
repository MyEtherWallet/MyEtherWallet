const exec = require('child_process').exec;

//tar package is not applicable to web and waiting for other packages to update
const AUDIT_EXCEPTIONS = ['tar']

const execute = (command, callback) => {
    exec(command, (error, stdout, stderr) => { callback(stdout); });
};
execute('npm audit --json', (json) => {
    const advisories = JSON.parse(json).advisories
    let auditPass = true;
    for (const id in advisories) {
        if (advisories[id].severity === 'high' && !AUDIT_EXCEPTIONS.includes(advisories[id].module_name)) {
            console.error("AUDIT Failed", advisories[id])
            auditPass = false;
        }
    }
    if (!auditPass) process.exit(1)
})