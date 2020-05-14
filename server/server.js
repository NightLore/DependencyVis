const express = require('express');
const cors = require('cors');
const Github = require('github-api');
const gitutils = require('./gitutils');
const utils = require('./utils');

// load dotenv variables
require('dotenv').config();
const port = process.env.PORT || 3001;
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_DATABASE;
const dbCollection = process.env.MONGO_DB_COLLECTION;

// load APIs
const git = new Github({
   username: process.env.GITHUB_USERNAME,
   token: process.env.GITHUB_ACCESS_TOKEN
});
const app = express();

// load MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + username + ":" + password + "@" + url;
const client = new MongoClient(uri, { useNewUrlParser: true });

async function pushToDatabase(data) {
   client.connect(err => {
      const collection = client.db(dbName).collection(dbCollection);
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

      client.close();
   });
}

app.use(
   cors({
      origin:'http://localhost:3000',
      credentials: true
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send("Hello World!"));
app.put('/', (req, res) => res.send("Hello World!"));

app.post('/lookup', async (req, res, next) => {
   let data = {
      username: req.body.username,
      repo: req.body.repo,
      folder: req.body.folder
   };

   let repo = await git.getRepo(data.username, data.repo);
   Object.assign(data, await gitutils.getRepoDetails(repo));

   let srctree = await gitutils.getRepoTree(repo, data.default_branch + "?recursive=1", data);
   data.manifest = utils.extractPackageJson(srctree.tree, data.folder);
   console.log("package", data.manifest);

   let contents = await gitutils.getFileContents(repo, data.default_branch, data.manifest);
   console.log("contents", contents);
   data.dependencies = utils.extractDependencies(contents.dependencies);
   console.log("dependencies", data.dependencies);

   res.status(201).json(data);
   await pushToDatabase(data);
});

app.post('/search', async (req, res) => {
   console.log("search", req.body);
   let result = await git.search().forRepositories({q: req.body.querry, sort: "best-match"});
   console.log("searched querry:", result.request.path);
   console.log("searched data:", result.data[0]);
   res.send(result.data[0]);
});


// Error handling code, does not work with async
app.use((req, res, next) => {
   res.status(404).send({
      status: 404,
      error: 'Not found'
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);
   //res.status(500).send('Something broke!');
   res.status(err.status || 500).send({
      error: {
         status: err.status || 500,
         message: err.message || 'Internal Server Error',
      },
   });
});


app.listen(port, () => console.log(`App listening on port ${port}`));

