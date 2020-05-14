
module.exports = {
   getRepoDetails: async function(repo) {
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
   },

   getRepoTree: async function(repo, treeParams, data) {
      let source = {};
      await repo.getTree(treeParams, (err, srctree) => {
         source = srctree;
      });
      return source;
   },

   getFileContents: async function(repo, branch, file) {
      let contents = {};
      await repo.getContents(branch, file, true, (err, c) => {
         contents = c;
      });
      return contents;
   }
};
