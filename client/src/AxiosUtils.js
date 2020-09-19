import axios from 'axios';

async function post(querry, data) {
   let resp = null;
   let err = null;
   try {
      resp = (await axios.post('http://localhost:3001/' + querry, data)).data;
   }
   catch (e) {
      err = e;
      console.error("Failed querry!");
   }
   return {resp: resp, error: err};
}

const lookup = async userInfo => await post("lookup", userInfo);
const search = async querry => await post("search", {querry: querry});

export {
   lookup,
   search
}
