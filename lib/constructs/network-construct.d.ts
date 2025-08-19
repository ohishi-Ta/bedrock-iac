import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';
export interface NetworkConstructProps {
    config: EnvironmentConfig;
}
export declare class NetworkConstruct extends Construct {
    readonly vpc: ec2.Vpc;
    readonly privateSubnets: ec2.ISubnet[];
    readonly publicSubnets: ec2.ISubnet[];
    readonly auroraSecurityGroup: ec2.SecurityGroup;
    readonly lambdaSecurityGroup: ec2.SecurityGroup;
    constructor(scope: Construct, id: string, props: NetworkConstructProps);
    private createVpcEndpoints;
    private createVpcFlowLogs;
    private applyTags;
}
