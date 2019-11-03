const tt = require("thingtalk");
const thingpedia = require("thingpedia");
const path = require("path");

module.exports.schemaRetriever = new tt.SchemaRetriever(
  new thingpedia.FileClient({
    locale: "en_US",
    thingpedia: path.resolve(__dirname, "../thingpedia.tt")
  }),
  null,
  true
);
