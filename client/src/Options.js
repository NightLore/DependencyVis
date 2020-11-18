



// -------------- Option helpers ------------- //

function createOption(title, choices) {
   return {
      ID: title.toLowerCase(),
      TITLE: title,
      CHOICES: choices,
      SETTER: "set" + title + "Option"
   };
}

function createChoice(name, displayName, key) {
   return {
      NAME: name,
      DISPLAY: displayName,
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
      createChoice("loaded", "Load Status"),
      createChoice("audit", "Audit")
   ]),
   createOption("Size", [
      createChoice("nothing", "Nothing"),
      createChoice("stars", "Stars", "stargazers_count"),
      createChoice("watchers", "Watchers", "subscribers_count"),
      createChoice("forks", "Forks", "forks_count"),
      createChoice("open_issues", "Open Issues", "open_issues_count"),
      createChoice("closed_issues", "Closed Issues", "closed_issues_count"),
      createChoice("open_total_issues", "Open/Total Issues"),
   ]),
];

const COLOR_OPTIONS = OPTIONS[0];
const COLOR_OPTION_LOADED = COLOR_OPTIONS.CHOICES[0];
const COLOR_OPTION_AUDIT  = COLOR_OPTIONS.CHOICES[1];

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
