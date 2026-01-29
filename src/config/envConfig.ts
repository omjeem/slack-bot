import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envVarsSchema = z.object({
  PORT: z.string().transform((str) => parseInt(str, 10)),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  SLACK_CLIENT_ID: z.string().nonempty(),
  SLACK_CLIENT_SECRET: z.string().nonempty(),
  SLACK_SIGNING_SECRET: z.string().nonempty(),
  SLACK_REDIRECT_URL: z.string().nonempty(),
  JWT_EXPIRES_IN: z
    .string()
    .nonempty()
    .transform((str) => parseInt(str, 10)),
  DEFAULT_TOKEN: z.string(),
});

const envVars = envVarsSchema.parse(process.env);

export const envConfigs = {
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  database_url: envVars.DATABASE_URL,
  slack: {
    clientId: envVars.SLACK_CLIENT_ID,
    clientSecret: envVars.SLACK_CLIENT_SECRET,
    clientSigningSecret: envVars.SLACK_SIGNING_SECRET,
    redirectUrl: envVars.SLACK_REDIRECT_URL,
  },
  defaultToken: envVars.DEFAULT_TOKEN,
};
