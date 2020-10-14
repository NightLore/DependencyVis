import axios from 'axios';

async function post(querry, data) {
   let resp = null;
   let error = null;
   try {
      resp = (await axios.post('http://localhost:3001/' + querry, data)).data;
   }
   catch (e) {
      error = e;
      console.error("Failed querry!");
   }
   return {resp, error};
}

const lookup = async userInfo => await post("lookup", userInfo);
const search = async querry => await post("search", {querry: querry});

export {
   lookup,
   search
}
