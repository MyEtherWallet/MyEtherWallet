const { LokaliseApi } = require('@lokalise/node-api');

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
        promises.push(
          lokalise.files.upload(`${projectId}:${branchName}`, {
            filename: path,
            lang_iso: 'en'
          })
        );
      });

      Promise.all(promises).then(() => {
        console.log('New translations have been uploaded');
        process.exit(0);
      });
    }
    console.log('No new translations');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

uploadToLokalise();
