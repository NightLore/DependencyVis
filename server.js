const express = require('express');
const path = require('path');
const cors = require('cors');
const Github = require('github-api');
const NpmApi = require('npm-api');
const gitutils = require('./gitutils');
const utils = require('./utils');
const auditutils = require('./audit');
const database = require('./database');

// load dotenv variables
require('dotenv').config();
const port = process.env.PORT || 3001;
const databaseInfo = {
   username: process.env.MONGO_DB_USERNAME,
   password: process.env.MONGO_DB_PASSWORD,
   url: process.env.MONGO_DB_URL,
   dbName: process.env.MONGO_DB_DATABASE,
   dbCollection: process.env.MONGO_DB_COLLECTION
};

// load APIs
const git = new Github({
   username: process.env.GITHUB_USERNAME,
   token: process.env.GITHUB_ACCESS_TOKEN
});
const app = express();
const npm = new NpmApi();

// initialize database
database.initialize(databaseInfo);

// setup server
function error404(res) {
   console.error("404 error, not found");
   res.status(404).send({
      status: 404,
      error: 'Not found'
   });
}

async function collectInfo(urlData, options) {
   let data = false;
   let shouldPush = false;

   // get data from database if requested
   if (options.mongodb) {
      console.log("USING DATABASE DATA");
      data = await database.search(urlData);
   }

   // get data from Github if not found from database or if preferred
   if (!data) {
      console.log("GENERATING DATA");
      data = await gitutils.retrieveRepoData(git, urlData);
      shouldPush = true;
   }

   // populate audit data
   if (data) {
      await auditutils.setAuditData(data.dependencies);
      data.source = "api.github.com/repos/" + urlData.username + "/" + urlData.repo

      if (shouldPush) {
         database.push(data);
      }
   }

   return data;
}

// --------------- express routes ----------------- //

// enable cors
app.use(cors());
/*
app.use(
   cors({
      origin:'http://localhost:3000',
      credentials: true
   })
);
*/

// serve static files from React app
app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
   console.log("Dirname:", __dirname);
   res.sendFile(path.join(__dirname+"/client/build/index.html"));
});

app.post('/lookup', async (req, res, next) => {
   console.log("lookup request data: ", req.body);
   let urlData = {
      username: req.body.username,
      repo:     req.body.repo,
      folder:   req.body.folder
   };

   const result = await collectInfo(urlData, req.body.options);

   console.log("lookup response data: ", result);
   res.status(201).json(result);
   //await database.push(data);
});

app.post('/search', async (req, res) => {
   console.log("search request data: ", req.body);
   let repo = npm.repo(req.body.querry);
   let pack = await repo.package();
   let urlData = utils.extractGithubPath(utils.findGithubUrl(pack));
   if (!urlData) {error404(res); return; }

   const result = await collectInfo(urlData, req.body.options);

   console.log("search response data: ", result);
   //let result = await gitutils.searchRepo(git, req.body.querry);
   res.status(201).json(result);
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

