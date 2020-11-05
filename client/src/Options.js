



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

export { createHandlers }
export default OPTIONS;
