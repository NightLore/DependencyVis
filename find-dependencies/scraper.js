const cheerio = require("cheerio");
const axios = require("axios");
const debugAxios = require("axios-debug-log");

const siteUrl = "https://github.com/expressjs/express/network/dependencies";
let siteName = "";

const categories = new Set();
const tags = new Set();
const locations = new Set();
const positions = new Set();
const dependencies = new Set();

const fetchData = async () => {
  console.log("fetching");
  const result = await axios.get(siteUrl)
                            .then((response) => {
  console.log("axios got");
                                const html = response.data;
                                return cheerio.load(html); 
                              })
                             .catch((error) => console.log(error));
  console.log("axios got");
  return cheerio.load(result.data);
};

const getResults = async () => {
  console.log("Start");
/*
  axios.get(siteUrl)
    .then(function ({data}) {
      console.log('Success ' + JSON.stringify(data))
    })
    .catch(function (error) {
      console.log('Error ' + error.message)
    });
   */
axios.get(siteUrl)
    .then((response) => {
	console.log("Got Response");
        let $ = cheerio.load(response.data);
	console.log("Load response");
        $('a').each(function (i, e) {
          let links = $(e).attr('href');      
          console.log(links);
        })
	console.log("end response");
    })
    .catch(function (e) {
	console.log("error response");
        console.log(e);
    });

/*
  const $ = await fetchData();
  console.log("fetched");
  siteName = siteUrl;
  console.log("setURL");
  $("a").each((index, element) => {
    console.log($(element).text());
    dependencies.add($(element).text());
  });
  console.log("End");
/*
  $(".tags .tag").each((index, element) => {
    tags.add($(element).text());
  });
  $(".location").each((index, element) => {
   locations.add($(element).text());
  });
  $("div.nav p").each((index, element) => {
   categories.add($(element).text());
  });

 $('.company_and_position [itemprop="title"]')
  .each((index, element) => {
  positions.add($(element).text());
 });
 */

//Convert to an array so that we can sort the results.
return {
  dependencies: [...dependencies],
  //positions: [...positions].sort(),
  //tags: [...tags].sort(),
  //locations: [...locations].sort(),
  //categories: [...categories].sort(),
  siteName,
 };
};
module.exports = getResults;
