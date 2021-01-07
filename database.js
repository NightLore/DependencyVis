const MongoClient = require('mongodb').MongoClient;

/* // Example code
const collected = collection.find({username: data.username});
collected.each(function(err, doc) {
   console.log(doc);
});
*/

var client;
var info;
var collection;

async function initialize(databaseInfo) {
   info = databaseInfo;
   let uri = "mongodb+srv://" 
      + info.username + ":" 
      + info.password + "@" 
      + info.url;
   client = await MongoClient.connect(uri, { 
      //useUnifiedTopology: true, // does not work but was recommended
      useNewUrlParser: true 
   });
   collection = client.db(info.dbName).collection(info.dbCollection);
   console.log("Connected to Database");
}

async function search(data) {
   const searchCursor = await collection.find(data);

   let result = false;
   if (await searchCursor.hasNext()) {
      result = await searchCursor.next();
   }
   else {
      console.log("Not found in database: ", data);
   }
   return result;
}

async function push(data) {
   collection.insertOne(data)
      .then(res => console.log("Updated Database"))
      .catch(err => console.error("Failed to insert", err));

}

function close() {
   client.close();
}

module.exports = {
   initialize: initialize,
   search: search,
   push: push,
   close: close
}
