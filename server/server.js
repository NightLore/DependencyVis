'use strict'
const express = require('express');
const cors = require('cors');
const Github = require('github-api');
const NpmApi = require('npm-api');
const gitutils = require('./gitutils');
const utils = require('./utils');

// npm audit test
const Report = require('npm-audit-report');
const Arborist = require('@npmcli/arborist');
const options = {
   reporter: 'json',
   indent: 1
};
const arb = new Arborist({ path: '../client' });
arb.audit().then(report => {
   console.log("Report", Report);
   console.log("Received", report);
   const result = Report(report, options);
   console.log(result);
   process.exitCode = result.exitCode;
});

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
const npm = new NpmApi();

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
   let data = await gitutils.retrieveRepoData(git, {
      username: req.body.username,
      repo: req.body.repo,
      folder:req.body.folder
   });

   res.status(201).json(data);
   await pushToDatabase(data);
});

app.post('/search', async (req, res) => {
   console.log("search", req.body);
   let repo = npm.repo(req.body.querry);
   let pack = await repo.package();
   console.log("Package.json", pack);
   let urlData = utils.extractGithubPath(utils.findGithubUrl(pack));
   console.log("urlData", urlData);

   let result = await gitutils.retrieveRepoData(git, urlData);
   result.source = "api.github.com/repos/" + urlData.username + "/" + urlData.repo
   console.log("result", result);
   //let result = await gitutils.searchRepo(git, req.body.querry);
   res.send(result);
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

