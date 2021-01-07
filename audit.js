const regFetch = require('npm-registry-fetch');

async function setAuditData(dependencies) {
   let response = await requestAudit(dependencies);
   if (!response.error) {
      mapAuditToDependency(dependencies, response.body);
      sortAudit(dependencies);
   }
}

async function requestAudit(dependencies) {
   const auditData = toAuditFormat(dependencies);

   let opts = {
       "color":true,
       "json":true,
       "unicode":true,
       method: 'POST',
       gzip: true,
       body: auditData
   };

   var res = {}
   try {
      res.body = await (await regFetch('/-/npm/v1/security/audits', opts)).json();
   }
   catch (err) {
      res.error = err;
      console.error(err);
   }
   return res;
}

function toAuditFormat(dependencies) {
   let auditData = {"requires": {}, "dependencies": {}}
   dependencies.forEach(element => {
      let name = element.name;
      let version = "0.0.2";
      //let version = element.version;
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

module.exports = {
   setAuditData: setAuditData
};
