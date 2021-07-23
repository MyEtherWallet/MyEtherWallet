const fs = require('fs');
const version = require('./package.json').version;
const ACCEPTABLE_ENTRIES = [
  'feat',
  'fix',
  'chore',
  'devop',
  'ui',
  'translation'
];
function main() {
  const files = fs.readdirSync('./changelog');
  const container = ACCEPTABLE_ENTRIES.reduce((acc, curr) => {
    acc[curr] = [];
    return acc;
  }, {});
  let newLog = `### Release v${version}`;
  files.forEach(item => {
    const type = item.split('-')[0];
    const isValidType = ACCEPTABLE_ENTRIES.find(item => {
      if (item === type) {
        return item;
      }
    });

    if (isValidType) {
      container[type].push(item);
    }
  });

  Object.keys(container).forEach(item => {
    if (container[item].length > 0) {
      let sectionHeader = `
### ${item}
      `;
      let body = ``;
      container[item].forEach((file, idx) => {
        const fileContent = fs.readFileSync(`./changelog/${file}`, 'utf8');
        const prNumber = file.split('-')[1].replace('.md', '');
        const parsedFile = `${fileContent.replace(
          '\n',
          ''
        )} [${prNumber}](https://github.com/MyEtherWallet/MyEtherWallet/pull/${prNumber})`;
        body = `${body}
${parsedFile}`;
        if (idx === container[item].length - 1) {
          sectionHeader = sectionHeader.concat(body);
          body = ``;
        }
      });
      newLog = `${newLog}
      ${sectionHeader}`;
    }
  });

  if (files.includes(`release-v${version}.md`)) {
    console.log(
      `Release v${version} already exists! Please make sure that versions are updated properly!`
    );
    return;
  }
  fs.writeFileSync(`./changelog/release-v${version}.md`, newLog);
  // deletes all non release entries for release
  files
    .filter(item => {
      if (!item.includes('release')) {
        return item;
      }
    })
    .forEach(item => {
      fs.unlinkSync(`./changelog/${item}`);
    });
}

main();
