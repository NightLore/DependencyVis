

const _colors = [
   'blueviolet',
   'cornflowerblue',
   'crimson',
   'olivedrab',
   'teal',
   'goldenrod',
   'burlywood',
   'indianred',
   'maroon',
   'mediumpurple',
   'chocolate',
   'midnightblue',
   'tomato',
];

const indices = {}
let count = 0; // note: can use size of indices instead

function getAllColors() {
   const mappings = [];
   for (const license of Object.keys(indices)) {
      mappings.push({
         name: license,
         color: getColor(license)
      });
   }
   return mappings;
}

function getColor(license) {
   if (license in indices)
      return _colors[indices[license]];
   console.log("License not found", license);
   return "white";
}

function push(license) {
   if (license in indices) return;

   indices[license] = count;
   count++;
}

const licenseManager = {
   getAllColors,
   getColor,
   push,
}

export default licenseManager;

