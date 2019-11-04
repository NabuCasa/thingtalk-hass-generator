import tt from "thingtalk";
import thingpedia from "thingpedia";
import path from "path";

const root = path.dirname(path.dirname(__dirname));

export const schemaRetriever = new tt.SchemaRetriever(
  new thingpedia.FileClient({
    locale: "en_US",
    thingpedia: path.join(root, "/thingpedia.tt")
  }),
  null,
  true
);
