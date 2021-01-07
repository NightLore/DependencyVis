import axios from 'axios';

// retrieve server relevant options
function retrieveOptions(options) {
   let serverOptions = {};
   // Note: can use for loop with array
   serverOptions.mongodb = options.mongodb
   return serverOptions;
}

async function post(querry, data, options) {
   let resp = null;
   let error = null;
   data.options = options;
   try {
      resp = (await axios.post('http://localhost:3001/' + querry, data)).data;
   }
   catch (e) {
      error = e;
      console.error("Failed querry!");
   }
   return {resp, error};
}

const lookup = async (userInfo, options) => await post("lookup", userInfo, options);
const search = async (querry, options) => await post("search", {querry: querry}, options);

export {
   lookup,
   search
}
