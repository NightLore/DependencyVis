const utils = require('./utils');

async function getRepoDetails(repo) {
   let data = {};
   await repo.getDetails((err, details) => {
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
      data.open_issues = details.open_issues;
      data.watchers = details.watchers;
      data.default_branch = details.default_branch;
      data.network_count = details.network_count;
      data.subscribers_count = details.subscribers_count;
   });
   return data;
}

async function retrieveRepoData(git, data) {
   let repo = await git.getRepo(data.username, data.repo);
   Object.assign(data, await getRepoDetails(repo));

   let srctree = (await repo.getTree(data.default_branch + "?recursive=1")).data;
   data.manifest = utils.extractPackageJson(srctree.tree, data.folder);
   console.log("package", data.manifest);

   let contents = (await repo.getContents(data.default_branch, data.manifest, true)).data;
   console.log("contents", contents);

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
