import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { AuroraConstruct } from '../constructs/aurora-construct';
import { EnvironmentConfig } from '../config/environment-config';
export interface DatabaseStackProps extends cdk.StackProps {
    config: EnvironmentConfig;
    vpc: ec2.IVpc;
    auroraSecurityGroup: ec2.ISecurityGroup;
}
export declare class DatabaseStack extends cdk.Stack {
    readonly auroraConstruct: AuroraConstruct;
    constructor(scope: Construct, id: string, props: DatabaseStackProps);
    private applyCommonTags;
}
