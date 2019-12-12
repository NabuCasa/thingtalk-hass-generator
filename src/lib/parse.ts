import axios, { AxiosResponse } from "axios";
import tt from "thingtalk";
import { schemaRetriever } from "./schema_retriever";
import { Context } from "vm";
import { addError } from "./context";

export const parseUtterance = async (utterance: string, context: Context = {}) => {
  let response: AxiosResponse<any>;
  try {
    response = await axios.get(`https://almond-nl.stanford.edu/en-US/query`, {
      params: {
        q: utterance,
        thingtalk_version: tt.version
      }
    });
  } catch (err) {
    addError(context, err);
    throw new Error("Error while processing NLP");
  }

  if (response.data.candidates.length === 0) {
    console.log(response.data);
    throw new Error("Unable to parse utterance");
  }

  context.utterance = utterance;
  context.thingtalk = {
    code: response.data.candidates[0].code,
    entities: response.data.entities
  };

  let program;
  try {
    program = tt.NNSyntax.fromNN(response.data.candidates[0].code, response.data.entities);
  } catch (err) {
    console.log("error creating program", err);
  }

  try {
    await program.typecheck(schemaRetriever);
  } catch (err) {
    console.log("error typecheck program", err);
  }

  return program;
};
