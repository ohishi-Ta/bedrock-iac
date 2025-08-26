export type Environment = 'dev' | 'stg' | 'prod';
export interface EnvironmentConfig {
    environment: Environment;
    network: {
        vpcCidr: string;
        enableNatGateway: boolean;
        availabilityZones: string[];
        createVpcEndpoints: boolean;
        naming: {
            vpcName: string;
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
    bedrock: {
        knowledgeBaseName: string;
        dataSourceName: string;
        s3BucketName: string;
        embeddingModel: string;
        chunkingStrategy: {
            type: 'HIERARCHICAL';
            maxParentTokens: number;
            maxChildTokens: number;
            overlapTokens: number;
        };
    };
    tags: {
        [key: string]: string;
    };
}
/**
 * 環境別の設定を生成する関数
 * @param environment - 環境名 ('dev' | 'stg' | 'prod')
 * @returns 環境別の設定オブジェクト
 */
export declare function createConfig(environment: Environment): EnvironmentConfig;
/**
 * 環境を検証して取得する関数
 * @param value - 環境名の文字列
 * @returns 検証済みの環境名
 */
export declare function getValidEnvironment(value: string | undefined): Environment;
