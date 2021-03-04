



// -------------- Option helpers ------------- //

function createOption(title, choices) {
   return {
      ID: title.toLowerCase(),
      TITLE: title,
      CHOICES: choices,
      SETTER: "set" + title + "Option"
   };
}

function createChoice(name, displayName, tooltip, key) {
   return {
      NAME: name,
      DISPLAY: displayName,
      TOOLTIP: tooltip,
      KEY: key
   };
}

function createHandlers(props) {
   let handlers = {}
   OPTIONS.forEach(opt => {
      handlers[opt.ID] = e => {
         console.log("selected", e.target.value);
         props[opt.SETTER](e.target.value);
      };
   });
   return handlers;
}

// -------------- Option Constants -------------- //

const OPTIONS = [
   createOption("Color", [
      createChoice("loaded", "Load Status", 
         "Color nodes based on their status in the program."),
      createChoice("audit", "Audit", 
         "Color nodes based on the highest npm audit severity. Go to https://www.npmjs.com/advisories/<id> for more info."),
      createChoice("license", "License", 
         "Nodes with the same color have the same license.")
   ]),
   createOption("Size", [
      createChoice("nothing", "Nothing", "Keep all nodes the same size"),
      createChoice("stars", "Stars", 
         "Size of nodes are based on the amount of stars found in the github repo.", 
         "stargazers_count"),
      createChoice("watchers", "Watchers", 
         "Size of nodes are based on the amount of github watchers/subscribers.",
         "subscribers_count"),
      createChoice("forks", "Forks", 
         "Size of nodes are based on the number of forks the repo has.",
         "forks_count"),
      createChoice("open_issues", "Open Issues", 
         "number of open issues",
         "open_issues_count"),
      createChoice("open_pull_requests", "Open PRs",
         "number of open pull requests (max 100)",
         "open_pull_request_count"),
      createChoice("closed_pull_requests", "Closed PRs", 
         "number of closed PRs within the last 30 days",
         "closed_pull_request_count"),
      createChoice("mean_pull_requests", "Mean Time PR Review",
         "Mean Time it takes for pull requests within the last 30 days to close since it is created (max 100 PRs)",
         "pull_request_mean_time"),
   ]),
];

const COLOR_OPTIONS = OPTIONS[0];
const COLOR_OPTION_LOADED  = COLOR_OPTIONS.CHOICES[0];
const COLOR_OPTION_AUDIT   = COLOR_OPTIONS.CHOICES[1];
const COLOR_OPTION_LICENSE = COLOR_OPTIONS.CHOICES[2];

const SIZE_OPTIONS = OPTIONS[1];
const SIZE_OPTION_NOTHING           = SIZE_OPTIONS.CHOICES[0];
const SIZE_OPTION_STARS             = SIZE_OPTIONS.CHOICES[1];
const SIZE_OPTION_WATCHERS          = SIZE_OPTIONS.CHOICES[2];
const SIZE_OPTION_FORKS             = SIZE_OPTIONS.CHOICES[3];
const SIZE_OPTION_OPEN_ISSUES       = SIZE_OPTIONS.CHOICES[4];
const SIZE_OPTION_CLOSED_ISSUES     = SIZE_OPTIONS.CHOICES[5];
const SIZE_OPTION_OPEN_TOTAL_ISSUES = SIZE_OPTIONS.CHOICES[6];

export { 
   COLOR_OPTIONS, 
   COLOR_OPTION_LOADED, 
   COLOR_OPTION_AUDIT, 
   COLOR_OPTION_LICENSE, 
   SIZE_OPTIONS, 
   SIZE_OPTION_NOTHING, 
   SIZE_OPTION_STARS, 
   SIZE_OPTION_WATCHERS, 
   SIZE_OPTION_FORKS, 
   SIZE_OPTION_OPEN_ISSUES, 
   SIZE_OPTION_CLOSED_ISSUES, 
   SIZE_OPTION_OPEN_TOTAL_ISSUES, 
   createHandlers
}
export default OPTIONS;
