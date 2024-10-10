import exp = require("constants");
import * as dotenv from "dotenv";
dotenv.config();

export const project = process.env.PROJECT;
export const account = process.env.ACCOUNT;

export const environment = process.env.ENVIRONMENT || "dev";
export const region = process.env.REGION || "us-east-1";

export const certificateArn: { [key: string]: string } = {
  "tisha.in.net":
    "arn:aws:acm:ap-south-1:008971679473:certificate/56c98b91-d6d1-430f-b704-6ba8d40dcbff",
};

export function getEnvironment(environment: String): { [key: string]: any } {
  const env: { [key: string]: any } = {
    vpcName: "",
    vpcCidr: "",
    serverCount: 1,
  };
  switch (environment) {
    case "production":
      env.vpcName = `${project}-ProductionVPC`;
      env.vpcCidr = "10.1.0.0/16";
      env.serverCount = 1;
      break;
    case "preprod":
      env.vpcName = `${project}-PreProdVPC`;
      env.vpcCidr = "10.2.0.0/16";
      env.serverCount = 1;
      break;
    case "staging":
      env.vpcName = `${project}-StagingVPC`;
      env.vpcCidr = "10.3.0.0/16";
      env.serverCount = 1;
      break;
    default: // Assume development or any other stage
      env.vpcName = `${project}-DevelopmentVPC`;
      env.vpcCidr = "10.4.0.0/16";
      env.serverCount = 1;
      break;
  }
  return env;
}




