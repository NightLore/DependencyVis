# DependencyVis
Building an external dependency visualization solution from GH public repositories.

# Development environment setup:

Install Node.js: https://nodejs.org/en/download/
Clone repository: `git clone https://github.com/NightLore/DependencyVis.git`

## Client
1. Go to the client folder
2. run `npm install`
3. run client with `npm start`

Then go to http://localhost:3000 to connect to client

## Server
1. Go to server folder
2. run `npm install`
3. Add ".env" file with key/value pairs\
`MONGO_DB_URL=`\
`MONGO_DB_DATABASE=`\
`MONGO_DB_COLLECTION=`\
`MONGO_DB_USERNAME=`\
`MONGO_DB_PASSWORD=`
4. run server with `node server.js`

### Usage Note
_We have deployed and hosted the most recent version of this project on Heroku (database on MongoDB Atlas/AWS). Here's the link to the tool: http://dependencyvis.herokuapp.com/ This is a proof of concept and as of now does not use a robust infrainstracture to be used in large scale._
