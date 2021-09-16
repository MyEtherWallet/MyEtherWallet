const github = require("@actions/github");
const token = process.argv.slice(2).join('').substring(6);
const owner = github.context.repo.owner;
const repo = github.context.repo.repo;
const octo = github.getOctokit(token);

const pullRequests = () => {
  var response = octo.rest.pulls.list({
        owner: owner,
        repo: repo,
    })["catch"]((e) => { 
        console.log(e.message) 
    });
    return response;
}

const parsePullRequestId = githubRef => {
  const result = /refs\/pull\/(\d+)\/merge/g.exec(githubRef);
  if (!result) throw new Error("Reference not found.");
  const [, pullRequestId] = result;
  return pullRequestId;
};

async function main() {

  // current pull request id
  const pullRequestId = parsePullRequestId(process.env.GITHUB_REF);
  
  await pullRequests().then(prs => {
    let filteredPrs = prs.data.filter(pr => {
      let regex = new RegExp('^Lokalise:[ _a-zA-Z0-9]+');
      return regex.test(pr.title) && pr.number != pullRequestId;
    });
    
    //if no extra PRs under Lokalise, exit
    if (!filteredPrs.length > 0) return true;

    //otherwise, go ahead and set to close and delete the branch.
    filteredPrs.forEach(pr => {
      //Close Branch
      octo.rest.pulls.update({
          owner: owner,
          repo: repo,
          pull_number: pr.number,
          state: 'closed'
      });
      octo.rest.pulls.get({
        owner: owner,
        repo: repo,
        pull_number: pr.number
      }).then(({ data }) => {
        const ref = 'heads/' + data['head']['ref'];
        try {
          //Delete Branch
          octo.rest.git.deleteRef({
              owner: owner,
              repo: repo,
              ref
          });
        }
        catch (e) {
          console.log(e.message) 
        }
      });
    });
  });
};

main().catch(err => {
  console.error(err);
});;
