const fs = require('fs');
const version = require('../package.json').version;
const devmoji = require('../devmoji.config');
const ACCEPTABLE_ENTRIES = devmoji.devmoji.map(i => i.code);
const CHANGELOG_DIR = './changelog';
function main() {
  let files = fs.readdirSync(CHANGELOG_DIR);
  files = files.filter(f => f.charAt(0) !== '.');
  if (files.length === 0) {
    console.log('No changelog entry found!');
    return;
  }
  const currentChangeLog = fs.readFileSync('CHANGELOG.md', 'utf8');
  const container = ACCEPTABLE_ENTRIES.reduce((acc, curr) => {
    acc[curr] = [];
    return acc;
  }, {});
  const newLog = `### Release v${version}`;
  const isNewVersionAdded = !currentChangeLog.includes(newLog);
  files.forEach(item => {
    const type = item.split('-')[0];
    if (ACCEPTABLE_ENTRIES.includes(type)) {
      container[type].push(item);
    } else {
      throw new Error(
        'Invalid changelog type, valid types:' + ACCEPTABLE_ENTRIES.join(',')
      );
    }
  });
  let updatedStr = '';
  Object.keys(container).forEach(item => {
    if (container[item].length > 0) {
      const sectionHeader = `### ${item}`;
      let body = ``;
      container[item].forEach((file, idx) => {
        const fileContent = fs.readFileSync(`./changelog/${file}`, 'utf8');
        const prNumber = file.split('-')[1].replace('.md', '');
        const parsedFile = `* ${fileContent.replace(
          '\n',
          ''
        )} [#${prNumber}](https://github.com/MyEtherWallet/MyEtherWallet/pull/${prNumber})`;
        body = `${body} \n ${parsedFile}`;
        if (idx === container[item].length - 1) {
          updatedStr = `${updatedStr}\n ${sectionHeader} \n ${body}`;
        }
      });
    }
  });
  let remadeChangelog = `${updatedStr} \n ${currentChangeLog}`;
  if (isNewVersionAdded) {
    remadeChangelog = `${newLog} \n ${remadeChangelog}`;
  }
  fs.writeFileSync(`./CHANGELOG.md`, remadeChangelog);
  // // deletes all non release entries for release
  files.forEach(item => {
    fs.unlinkSync(`${CHANGELOG_DIR}/${item}`);
  });
}

main();
