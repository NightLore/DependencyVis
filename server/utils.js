
module.exports = {

   extractPackageJson: function(tree, folder) {
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
   },

   extractDependencies: function(dependencies) {
      let list = [];
      for (let [key, value] of Object.entries(dependencies)) {
         list.push({name: key, version: value});
      }
      return list;
   }

};
