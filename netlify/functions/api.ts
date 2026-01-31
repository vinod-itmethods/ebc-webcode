import { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createServer } from "../../server/index";

const app = createServer();
const handler = serverless(app);

export const api: Handler = async (event, context) => {
  const response = await handler(event, context);
  return response;
};
