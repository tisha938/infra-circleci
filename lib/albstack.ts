import * as cdk from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationLoadBalancer,
  ApplicationListener,
  ApplicationProtocol,
  ApplicationTargetGroup,
  ListenerAction,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

import { Construct } from "constructs";
import { getEnvironment, project, environment } from "../utilities/environment";



export class AlbStack extends cdk.Stack {
  public readonly loadBalancer: ApplicationLoadBalancer;
  public readonly httpListener: ApplicationListener;
  public readonly httpsListener: ApplicationListener;
  public readonly Vpc: ec2.IVpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.Vpc = new ec2.Vpc(this, 'my-vpc', {
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/24'),
        vpcName: 'test-vpc',
        maxAzs: 2,
        natGateways: 1,
        subnetConfiguration: [
            {
                cidrMask: 26,
                name: 'test-pub1',
                subnetType: ec2.SubnetType.PUBLIC,
            },
            {
                cidrMask: 26,
                name: 'test-pri1',
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
        ],
    });
    this.loadBalancer = new ApplicationLoadBalancer(this, `${project}LoadBalancer`, {
      vpc:this.Vpc,
      internetFacing: true,
      loadBalancerName: `${project}ALB-${environment}`,
    });

    
    this.httpListener = this.loadBalancer.addListener("HttpListener", {
      port: 80,
      open: true,
      protocol: ApplicationProtocol.HTTP,
    });

   
    this.httpListener.addAction('RedirectToHttps', {
        action: elbv2.ListenerAction.redirect({
            protocol: 'HTTPS',
            port: '443',
            permanent: true,
        }),
    });
   
    this.httpsListener = this.loadBalancer.addListener("HttpsListener", {
      port: 443,
      open: true,
      protocol: ApplicationProtocol.HTTPS,
      certificates: [{ certificateArn: 'arn:aws:acm:us-east-1:008971679473:certificate/d035d47f-37dd-46ff-9ded-09cf05475134' }],
      defaultAction: elbv2.ListenerAction.fixedResponse(200, {
        contentType: "text/plain", 
        messageBody: "Hello, this is a plain text response.", 
      }),
    });

    
   
  }
}
