import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkConstruct } from '../constructs/network-construct';
import { EnvironmentConfig } from '../config/environment-config';
export interface NetworkStackProps extends cdk.StackProps {
    config: EnvironmentConfig;
}
export declare class NetworkStack extends cdk.Stack {
    readonly networkConstruct: NetworkConstruct;
    constructor(scope: Construct, id: string, props: NetworkStackProps);
    private applyCommonTags;
}
