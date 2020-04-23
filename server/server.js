const express = require('express');
const cors = require('cors');
const Github = require('github-api');

// load APIs
const git = new Github();
const app = express();

// load dotenv variables
require('dotenv').config();
const port = process.env.PORT || 3001;
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_DATABASE;
const dbCollection = process.env.MONGO_DB_COLLECTION;

// load MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + username + ":" + password + "@" + url;
const client = new MongoClient(uri, { useNewUrlParser: true });

function extractPackageJson(tree) {
   var path = "";
   for (var i = 0; i < tree.length; i++) {
      var element = tree[i];
      if (element.path.includes("package.json")) {
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

app.use(
   cors({
      origin:'http://localhost:3000',
      credentials: true
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send("Hello World!"));

app.post('/lookup', (req, res) => {
   console.log(req.body);
   var data = {
      username: req.body.username,
      repo: req.body.repo
   };
   var repo = git.getRepo(data.username, data.repo);

   repo.getDetails((err, details) => {
      console.log("details");
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

      repo.getTree(data.default_branch, (err, srctree) => {
         data.manifest = extractPackageJson(srctree.tree);
         console.log("package", srctree.tree);

         repo.getContents(data.default_branch, data.manifest, true, (err, contents) => {
            console.log("contents", contents);
            data.dependencies = extractDependencies(contents.dependencies);

            client.connect(err => {
               const collection = client.db(dbName).collection(dbCollection);
               console.log("Connected to Database");

               collection.insertOne(data)
                  .then(res => console.log("inserted"))
                  .catch(err => console.error("Failed to insert", err));

               const collected = collection.find({username: data.username});
               collected.each(function(err, doc) {
                  //console.log(doc);
               });
               client.close();
            });
            res.status(201).json(data);
         });

         console.log("End");
      });

   });
});

app.put('/', (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`App listening on port ${port}`));

