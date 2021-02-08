

const _colors = [
   'blueviolet',
   'cornflowerblue',
   'brown',
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
   getColor,
   push,
}

export default licenseManager;

