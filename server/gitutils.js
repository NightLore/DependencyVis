const utils = require('./utils');
const npmFetch = require('npm-registry-fetch');

async function getRepoDetails(repo) {
   console.log("getRepoDetails", repo);
   let data = null;
   await repo.getDetails((err, details) => {
      if (err) return;

      // TODO: turn into loop
      // manually done to pick and choose properties we want
      data = {};
      data.private = details.private;
      data.description = details.description;
      data.size = details.size;
      data.language = details.language;
      data.stargazers_count = details.stargazers_count;
      data.watchers_count = details.watchers_count;
      data.has_issues = details.has_issues;
      data.has_projects = details.has_projects;
      data.has_downloads = details.has_downloads;
      data.has_wiki = details.has_wiki;
      data.has_pages = details.has_pages;
      data.forks_count = details.forks_count;
      data.mirror_url = details.mirror_url;
      data.archived = details.archived;
      data.disabled = details.disabled;
      data.open_issues_count = details.open_issues_count;
      data.license = details.license;
      data.forks = details.forks;
      data.default_branch = details.default_branch;
      data.network_count = details.network_count;
      data.subscribers_count = details.subscribers_count;
   });

   printPRState = prs => {
      let numOpen = 0;
      let numClosed = 0;
      for (pr of prs) {
         switch (pr.state) {
            case "open":
               numOpen++;
               break;
            case "closed":
               numClosed++;
               break;
            default:
               console.log("Invalid state:", pr.state);
         }
      }
      console.log("open:", numOpen, "; closed:", numClosed, "; all:", prs.length);
   };

   // request list of open pull requests
   await repo.listPullRequests({per_page: 100}, (err, prs) => {
      if (err) return;

      console.log("List PR");
      printPRState(prs);
      data.open_pull_request_count = prs.length;
   });
   return data;
}

async function retrieveRepoData(git, data) {
   // get the repo object
   let repo = await git.getRepo(data.username, data.repo);
   // attempt to get information
   let repoDetails = await getRepoDetails(repo);
   if (!repoDetails) {console.log("Failed getRepo", repo.__fullname); return false;}
   Object.assign(data, repoDetails);

   // get the file system/source tree of the branch
   let srctree = (await repo.getTree(data.default_branch + "?recursive=1")).data;

   // find package.json path
   data.manifest = utils.extractPackageJson(srctree.tree, data.folder);
   console.log("package", data.manifest);

   // get package.json contents
   let contents = (await repo.getContents(data.default_branch, data.manifest, true)).data;
   console.log("contents", contents);

   // extract dependencies from the package.json per our specifications
   data.dependencies = utils.extractDependencies(contents.dependencies);
   return data;
}

async function searchRepo(git, repoName) {
   let result = await git.search().forRepositories({q: repoName, sort: "best-match"});
   console.log("searched querry:", result.request.path);
   console.log("searched data:", result.data[0]);
   return result.data[0];
}

module.exports = {
   retrieveRepoData: retrieveRepoData,
   getRepoDetails: getRepoDetails,
   searchRepo: searchRepo
};
