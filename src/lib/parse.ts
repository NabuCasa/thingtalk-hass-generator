import axios from "axios";
import tt from "thingtalk";
import { schemaRetriever } from "./schema_retriever";

export const parseUtterance = async utterance => {
  const response = await axios.get(`https://almond-nl.stanford.edu/en-US/query`, {
    params: {
      q: utterance,
      thingtalk_version: "1.8.0"
    }
  });

  if (response.data.candidates.length === 0) {
    console.error("Unable to parse utterance!");
    return null;
  }

  console.log(response.data.candidates[0].code.join(" "));
  console.log(response.data.entities);
  console.log();

  const ast = tt.NNSyntax.fromNN(response.data.candidates[0].code, response.data.entities);

  await ast.typecheck(schemaRetriever);

  return ast;
};
