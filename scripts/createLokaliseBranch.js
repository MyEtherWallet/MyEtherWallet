const { LokaliseApi } = require('@lokalise/node-api');

async function createBranch() {
  try {
    const lokaliseToken = process.env.TOKEN;
    const branchName = process.env.BRANCH_NAME.replace('refs/heads/', '');
    const projectId = process.env.PROJECT_ID;
    const lokalise = new LokaliseApi({ apiKey: lokaliseToken });

    const branches = await lokalise.branches.list({ project_id: projectId });
    const found = branches.items.find(item => {
      if (item.name === branchName) {
        return item;
      }
    });
    if (!found) {
      await lokalise.branches
        .create({ name: branchName }, { project_id: projectId })
        .then(() => {
          console.log('Branch created successfully!');
          process.exit(0);
        });
    }
    console.log('Branch already created!');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

createBranch();
