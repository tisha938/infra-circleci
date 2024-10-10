#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { AlbStack } from "../lib/albstack";
import { TargetGroupStack } from "../lib/targetgroup";
import { Construct } from "constructs";
import { environment } from '../utilities/environment'; 

const app = new cdk.App();

// Create an instance of AlbStack
const albStack = new AlbStack(app, "AlbStack");
// albStack.addDependency(targetGroupStack);


const targetGroupStack = new TargetGroupStack(app, "TargetGroupStack", {
  environment: environment, 
  loadBalancer: albStack.loadBalancer,
  httpListener: albStack.httpListener,
  httpsListener: albStack.httpsListener,
  vpc: albStack.Vpc,  // Pass the VPC from AlbStack
});




