import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export declare class NetworkStack extends cdk.Stack {
    readonly networkConstruct: {
        vpc: ec2.Vpc;
        auroraSecurityGroup: ec2.SecurityGroup;
        lambdaSecurityGroup: ec2.SecurityGroup;
    };
    constructor(scope: Construct, id: string, props: cdk.StackProps & {
        config: any;
    });
}
