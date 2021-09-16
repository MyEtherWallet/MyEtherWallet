const github = require("@actions/github");

async function main() {

  const token = process.env.TOKEN;
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const octo = github.getOctokit(token);
  const currentPR = github.context.issue.number;

  //Fetch PRs
  octo.rest.pulls.list({
    owner: owner,
    repo: repo,
  }).then(prs => {
    //Filter PRs
    let filteredPrs = prs.data.filter(pr => {
      let regex = new RegExp('^Lokalise:[ _a-zA-Z0-9]+');
      return regex.test(pr.title) && pr.number != currentPR;
    });
    if (filteredPrs && filteredPrs.length) {
      filteredPrs.forEach(pr => {
        //Close Branch
        octo.rest.pulls.update({
            owner: owner,
            repo: repo,
            pull_number: pr.number,
            state: 'closed'
        });
       //Delete Branch
        octo.rest.pulls.get({
          owner: owner,
          repo: repo,
          pull_number: pr.number
        }).then(({ data }) => {
          const ref = 'heads/' + data['head']['ref'];
          try {
            octo.rest.git.deleteRef({
                owner: owner,
                repo: repo,
                ref
            });
          } catch ({ message }) { console.log(message) }
        });
      });
    }
  }).catch(e => {
    console.error(e);
  });
};

main();