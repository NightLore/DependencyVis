const gitDomain = "github.com/"

function extractPackageJson(tree, folder) {
   var path = "";
   for (var i = 0; i < tree.length; i++) {
      var element = tree[i];
      if (element.path.includes("package.json")
       && element.path.includes(folder)) {
         path = element.path;
         break;
      }
   }
   return path;
}

function extractDependencies(dependencies) {
   let list = [];
   if (dependencies)
      for (const [key, value] of Object.entries(dependencies)) {
         list.push({name: key, version: value});
      }
   return list;
}

function findGithubUrl(packageJson) {
   for (const value of Object.values(packageJson)) {
      let check = value.url || value || "";
      if (check.includes && check.includes(gitDomain)) {
         return check;
      }
   }
   return "";
}

function extractGithubPath(path) {
   let index = path.indexOf(gitDomain);
   if (index < 0) {
      console.log("Not a github path:", path);
      return {};
   }

   let tokens = path.substring(index + gitDomain.length).split("/");
   index = tokens[1].indexOf('.git');
   if (index >= 0) {
      tokens[1] = tokens[1].substring(0, index);
   }
   return {username: tokens[0], repo: tokens[1], folder: ""};
}

module.exports = {
   extractPackageJson: extractPackageJson,
   extractDependencies: extractDependencies,
   findGithubUrl: findGithubUrl,
   extractGithubPath: extractGithubPath
};
