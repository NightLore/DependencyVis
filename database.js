const MongoClient = require('mongodb').MongoClient;

var client;
var info;

function initialize(databaseInfo) {
   info = databaseInfo;
   let uri = "mongodb+srv://" 
      + info.username + ":" 
      + info.password + "@" 
      + info.url;
   client = new MongoClient(uri, { useNewUrlParser: true });
}

async function pushToDatabase(data) {
   client.connect(err => {
      const collection = client.db(info.dbName).collection(info.dbCollection);
      console.log("Connected to Database");

      collection.insertOne(data)
         .then(res => console.log("inserted"))
         .catch(err => console.error("Failed to insert", err));

      /*
      const collected = collection.find({username: data.username});
      collected.each(function(err, doc) {
         //console.log(doc);
      });
      */

   });
}

function close() {
   client.close();
}

module.exports = {
   initialize: initialize,
   pushToDatabase: pushToDatabase,
   close: close
}
