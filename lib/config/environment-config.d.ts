export interface EnvironmentConfig {
    environment: 'dev' | 'staging' | 'prod';
    network: {
        vpcCidr: string;
        enableNatGateway: boolean;
        availabilityZones: string[];
        createVpcEndpoints: boolean;
        naming: {
            vpcName: string;
            publicSubnetName: string;
            privateSubnetName: string;
            auroraSecurityGroupName: string;
            lambdaSecurityGroupName: string;
        };
    };
    aurora: {
        databaseName: string;
        masterUsername: string;
        minCapacity: number;
        maxCapacity: number;
        enableDataApi: boolean;
        deletionProtection: boolean;
        backupRetentionDays: number;
        enableCloudwatchLogs: boolean;
        enablePerformanceInsights: boolean;
        naming: {
            clusterName: string;
            subnetGroupName: string;
            masterSecretName: string;
        };
    };
    security: {
        enableVpcFlowLogs: boolean;
        allowedCidrBlocks: string[];
        enableGuardDuty: boolean;
    };
    tags: {
        [key: string]: string;
    };
    cost: {
        budgetLimitUsd: number;
        enableBudgetAlerts: boolean;
    };
}
export declare const commonDefaults: {
    network: {
        availabilityZones: string[];
        createVpcEndpoints: boolean;
        naming: {
            vpcName: string;
            publicSubnetName: string;
            privateSubnetName: string;
            auroraSecurityGroupName: string;
            lambdaSecurityGroupName: string;
        };
    };
    aurora: {
        masterUsername: string;
        enableDataApi: boolean;
        enableCloudwatchLogs: boolean;
        enablePerformanceInsights: boolean;
        naming: {
            clusterName: string;
            subnetGroupName: string;
            masterSecretName: string;
            appUserSecretName: string;
        };
    };
    security: {
        allowedCidrBlocks: string[];
        enableGuardDuty: boolean;
    };
    tags: {
        Project: string;
        ManagedBy: string;
    };
};
