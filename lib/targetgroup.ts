import * as cdk from "aws-cdk-lib";
import {
  ApplicationLoadBalancer,
  ApplicationListener,
  ApplicationListenerRule,
  ApplicationTargetGroup,
  ListenerCondition,
  Protocol,
  TargetType,
  ApplicationProtocol
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from "constructs";
import { getEnvironment, project } from "../utilities/environment";
import path = require("path");
import * as fs from "fs";

export interface TargetGroupProps extends cdk.StackProps {
  environment: string;
  loadBalancer: ApplicationLoadBalancer;
  httpListener: ApplicationListener;
  httpsListener: ApplicationListener;
  vpc: ec2.IVpc;  // Add VPC to props
}

export class TargetGroupStack extends cdk.Stack {
  

  constructor(scope: Construct, id: string, props: TargetGroupProps) {
    super(scope, id, props);
    const config = getEnvironment(props.environment);

    const jsonFilePath = path.join(__dirname, "..", "service.json");
    const configFile = fs.readFileSync(jsonFilePath, "utf8");
    const configData = JSON.parse(configFile);
    

    configData.services.forEach((service: any) => {
      const targetGroup = new ApplicationTargetGroup(
        this,
        `${service.name}TG-${props.environment}`,
        {
          port: service.target_port,
          vpc: props.vpc,  // Use the passed VPC here
          protocol: ApplicationProtocol.HTTP,
          targetType: TargetType.INSTANCE,
          targetGroupName: `${service.name}TG-${props.environment}`,
        }
      );

     

      // Configure health check
      targetGroup.configureHealthCheck({
        path: service.healthCheck.path,
        protocol: Protocol.HTTP,
        healthyHttpCodes: service.healthCheck.statusCode,
      });

      // Create listener rule
      new ApplicationListenerRule(
        this,
        `${service.name}Rule-${props.environment}`,
        {
          listener: props.httpsListener,
          priority: service.priority,
          conditions: [ListenerCondition.hostHeaders([service.hostHeader])],
          targetGroups: [targetGroup],
        }
      );
    });
  }
}
