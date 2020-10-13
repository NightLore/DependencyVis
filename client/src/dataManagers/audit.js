
function auditToColor(audit) {
   var severity = 0;
   // audit might not exist if no vulnerabilities
   if (audit) {
      // audit should come in as a list of vulnerabilities
      // audit should be sorted from highest severity to lowest
      severity = Math.max(auditSeverityToValue(audit[0].severity));
   }
   return auditSeverityValueToColor(severity);
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
         console.error("Audit default color used: ", severity);
         return 0;
   }
}

function auditSeverityValueToColor(severity) {
   switch (severity) {
      case 4:
         return "darkred";
      case 3:
         return "red";
      case 2:
         return "orange";
      case 1:
         return "yellow";
      default:
         return "green";
   }
}

export default auditToColor;
