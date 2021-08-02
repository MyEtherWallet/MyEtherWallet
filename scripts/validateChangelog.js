const fs = require('fs');
const version = require('./package.json').version;
const devmoji = require('./devmoji.config');
const ACCEPTABLE_ENTRIES = devmoji.devmoji.map(i => i.code);
const CHANGELOG_DIR = './changelog';

const parsePullRequestId = githubRef => {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef);
  if (!result) throw new Error('Reference not found.');
  const [, pullRequestId] = result;
  return pullRequestId;
};

function main() {
  let files = fs.readdirSync(CHANGELOG_DIR);
  files = files.filter(f => f.charAt(0) !== '.');
  if (!files.length) throw new Error('No changelog found');
  const pullId = parsePullRequestId(process.env.GITHUB_REF);
  let idFound = false;
  files.forEach(item => {
    const type = item.split('-')[0];
    if (!ACCEPTABLE_ENTRIES.includes(type))
      throw new Error(
        'Invalid changelog type, valid types:' + ACCEPTABLE_ENTRIES.join(',')
      );
    const prNumber = item.split('-')[1].replace('.md', '');
    if (prNumber === pullId) idFound = true;
  });
  if (!idFound) throw new Error('Pull request ID doesnt match changelog ids');
}

main();
