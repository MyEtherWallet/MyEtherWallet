const { LokaliseApi } = require('@lokalise/node-api');
const fs = require('fs');

async function uploadToLokalise() {
  try {
    const lokaliseToken = process.env.TOKEN;
    const branchName = process.env.GITHUB_REF.replace('refs/heads/', '');
    const projectId = process.env.PROJECT_ID;
    const files = process.env.FILES.split(' ');
    const lokalise = new LokaliseApi({ apiKey: lokaliseToken });

    if (!files.length > 0) {
      const promises = [];
      files.forEach(path => {
        const splitPath = path.split('/');
        const readFile = fs.readFileSync(path);
        if (splitPath.includes('en_US')) {
          promises.push(
            lokalise.files.upload(`${projectId}:${branchName}`, {
              data: readFile.toString('base64'),
              filename: path,
              lang_iso: 'en_US'
            })
          );
        }
      });

      Promise.all(promises).then(() => {
        console.log('New translations have been uploaded');
        process.exit(0);
      });
    } else {
      console.log('No new translations');
      process.exit(0);
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

uploadToLokalise();
