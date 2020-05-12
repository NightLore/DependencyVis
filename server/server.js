const express = require('express');
const cors = require('cors');
const Github = require('github-api');

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

function extractPackageJson(tree, folder) {
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
}

function extractDependencies(dependencies) {
   let list = [];
   for (let [key, value] of Object.entries(dependencies)) {
      list.push({name: key, version: value});
   }
   return list;
}

async function getRepoDetails(repo) {
   let data = {};
   await repo.getDetails((err, details) => {
      data.private = details.private;
      data.description = details.description;
      data.size = details.size;
      data.language = details.language;
      data.stargazers_count = details.stargazers_count;
      data.watchers_count = details.watchers_count;
      data.has_issues = details.has_issues;
      data.has_projects = details.has_projects;
      data.has_downloads = details.has_downloads;
      data.has_wiki = details.has_wiki;
      data.has_pages = details.has_pages;
      data.forks_count = details.forks_count;
      data.mirror_url = details.mirror_url;
      data.archived = details.archived;
      data.disabled = details.disabled;
      data.open_issues_count = details.open_issues_count;
      data.license = details.license;
      data.forks = details.forks;
      data.open_issues = details.open_issues;
      data.watchers = details.watchers;
      data.default_branch = details.default_branch;
      data.network_count = details.network_count;
      data.subscribers_count = details.subscribers_count;
   });
   return data;
}

async function getRepoTree(repo, treeParams, data) {
   let source = {};
   await repo.getTree(treeParams, (err, srctree) => {
      source = srctree;
   });
   return source;
}

async function getFileContents(repo, branch, file) {
   let contents = {};
   await repo.getContents(branch, file, true, (err, c) => {
      contents = c;
   });
   return contents;
}

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

   let repo = git.getRepo(data.username, data.repo);
   Object.assign(data, await getRepoDetails(repo));

   let srctree = await getRepoTree(repo, data.default_branch + "?recursive=1", data);
   data.manifest = extractPackageJson(srctree.tree, data.folder);
   console.log("package", data.manifest);

   let contents = await getFileContents(repo, data.default_branch, data.manifest);
   console.log("contents", contents);
   data.dependencies = extractDependencies(contents.dependencies);
   console.log("dependencies", data.dependencies);

   res.status(201).json(data);
   await pushToDatabase(data);
});

app.post('/search', async (req, res) => {
   res.send("test");
});

/*
app.use((req, res, next) => {
   res.status(404).send({
      status: 404,
      error: 'Not found'
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
   res.status(err.status || 500).send({
      error: {
         status: err.status || 500,
         message: err.message || 'Internal Server Error',
      },
   });
});
*/


app.listen(port, () => console.log(`App listening on port ${port}`));

