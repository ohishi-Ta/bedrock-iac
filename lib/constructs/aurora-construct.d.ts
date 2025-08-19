import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';
export interface AuroraConstructProps {
    vpc: ec2.IVpc;
    securityGroup: ec2.ISecurityGroup;
    config: EnvironmentConfig;
}
export declare class AuroraConstruct extends Construct {
    readonly cluster: rds.DatabaseCluster;
    readonly masterSecret: secretsmanager.ISecret;
    readonly appUserSecret: secretsmanager.Secret;
    readonly subnetGroup: rds.SubnetGroup;
    constructor(scope: Construct, id: string, props: AuroraConstructProps);
    private applyTags;
}
