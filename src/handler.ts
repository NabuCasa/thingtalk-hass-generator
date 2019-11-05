import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import "source-map-support/register";

import { parseUtterance } from "./lib/parse";
import { convertRule, AutomationConfig } from "./lib/convert";
import { Context } from "vm";

export const convert: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context
) => {
  if (!event.queryStringParameters || !event.queryStringParameters["query"]) {
    return { statusCode: 400, body: "Wrong input" };
  }
  const query = event.queryStringParameters["query"];
  let config: AutomationConfig;
  try {
    const program = await parseUtterance(query);
    config = await convertRule(program.rules[0]);
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(config)
  };
};
