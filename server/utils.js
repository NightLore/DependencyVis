
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

function toAuditFormat(dependencies) {
   let auditData = {"requires": {}, "dependencies": {}}
   dependencies.forEach(element => {
      let name = element.name;
      let version = "0.0.2"; //element.version;
      auditData.requires[name] = version;
      auditData.dependencies[name] = {version: version};
   });
   return auditData;
}

function mapAuditToDependency(dependencies, audit) {
   for (const val of Object.values(audit.advisories)) {
      const dependency = dependencies.find(d => d.name === val.module_name);
      if (!dependency) { 
         console.error("Could not find audit value: ", val);
         continue;
      }

      if (!dependency.audit) dependency.audit = [];
      dependency.audit.push(val);
   }
}

function sortAudit(dependencies) {
   dependencies.forEach(dependency => {
      if (!dependency.audit) return;

      dependency.audit.sort((a, b) => {
         return auditSeverityToValue(a.severity) - auditSeverityToValue(b.severity);
      });
   });
}

function auditSeverityToValue(severity) {
   switch (severity) {
      case "critical":
         return 4;
      case "high":
         return 3;
      case "moderate":
         return 2;
      case "low":
         return 1;
      default:
         return 0;
   }
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
   toAuditFormat: toAuditFormat,
   mapAuditToDependency: mapAuditToDependency,
   sortAudit: sortAudit,
   extractDependencies: extractDependencies,
   findGithubUrl: findGithubUrl,
   extractGithubPath: extractGithubPath
};
