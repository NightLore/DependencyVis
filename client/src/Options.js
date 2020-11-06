



// -------------- Option helpers ------------- //

function createOption(title, choices) {
   return {
      ID: title.toLowerCase(),
      TITLE: title,
      CHOICES: choices,
      SETTER: "set" + title + "Option"
   };
}

function createChoice(name, displayName) {
   return {
      NAME: name,
      DISPLAY: displayName
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
      createChoice("stars", "Stars"),
      createChoice("watchers", "Watchers"),
      createChoice("forks", "Forks"),
      createChoice("open_issues", "Open Issues"),
   ]),
];

const COLOR_OPTIONS = OPTIONS[0];
const COLOR_OPTION_LOADED = COLOR_OPTIONS.CHOICES[0];
const COLOR_OPTION_AUDIT  = COLOR_OPTIONS.CHOICES[1];

const SIZE_OPTIONS = OPTIONS[1];
const SIZE_OPTION_NOTHING     = SIZE_OPTIONS.CHOICES[0];
const SIZE_OPTION_STARS       = SIZE_OPTIONS.CHOICES[1];
const SIZE_OPTION_WATCHERS    = SIZE_OPTIONS.CHOICES[2];
const SIZE_OPTION_FORKS       = SIZE_OPTIONS.CHOICES[3];
const SIZE_OPTION_OPEN_ISSUES = SIZE_OPTIONS.CHOICES[4];

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
   createHandlers
}
export default OPTIONS;
