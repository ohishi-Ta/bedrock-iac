// lib/config/environment-config.ts

export type Environment = 'dev' | 'stg' | 'prod';

export interface EnvironmentConfig {
  environment: Environment;
  
  // ネットワーク設定
  network: {
    vpcCidr: string;
    enableNatGateway: boolean;
    availabilityZones: string[];
    
    // 名前設定
    naming: {
      vpcName: string;
      publicSubnetName: string;
      privateSubnetName: string;
      auroraSecurityGroupName: string;
      lambdaSecurityGroupName: string;
    };
  };
  
  // Aurora設定
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
    
    // 名前設定
    naming: {
      clusterName: string;
      subnetGroupName: string;
      masterSecretName: string;
    };
  };
  
  // Bedrock設定
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
  
  // 共通タグ
  tags: {
    [key: string]: string;
  };
}

// 共通のデフォルト設定（環境によらない固定値）
const commonDefaults = {
  network: {
    vpcCidr: '10.0.0.0/16',
    enableNatGateway: false,
    availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
  },
  aurora: {
    masterUsername: 'bedrockadmin',
    minCapacity: 0.5,
    maxCapacity: 16,
    enableDataApi: true,
    deletionProtection: false,
    backupRetentionDays: 7,
    enableCloudwatchLogs: true,
    enablePerformanceInsights: false,
  },
  bedrock: {
    embeddingModel: 'amazon.titan-embed-text-v2:0',
    chunkingStrategy: {
      type: 'HIERARCHICAL' as const,
      maxParentTokens: 3000,
      maxChildTokens: 1000,
      overlapTokens: 60,
    },
  },
  tags: {
    Project: 'ragchat-app',
    ManagedBy: 'cdk',
  },
};

/**
 * 環境別の設定を生成する関数
 * @param environment - 環境名 ('dev' | 'stg' | 'prod')
 * @returns 環境別の設定オブジェクト
 */
export function createConfig(environment: Environment): EnvironmentConfig {
  return {
    environment: environment,
    
    network: {
      ...commonDefaults.network,
      
      // 命名は環境変数を直接埋め込み
      naming: {
        vpcName: `${environment}-ragchat-vpc`,
        publicSubnetName: `${environment}-ragchat-public-subnet`,
        privateSubnetName: `${environment}-ragchat-private-subnet`,
        auroraSecurityGroupName: `${environment}-ragchat-aurora-sg`,
        lambdaSecurityGroupName: `${environment}-ragchat-lambda-sg`,
      },
    },
    
    aurora: {
      ...commonDefaults.aurora,
      databaseName: `${environment}_ragchat_db`,
      
      // 命名は環境変数を直接埋め込み
      naming: {
        clusterName: `${environment}-ragchat-database`,
        subnetGroupName: `${environment}-ragchat-db-subnet-group`,
        masterSecretName: `${environment}-ragchat-aurora-secret`,
      },
    },
    
    bedrock: {
      ...commonDefaults.bedrock,
      knowledgeBaseName: `${environment}-ragchat-knowledge-base`,
      dataSourceName: `${environment}-ragchat-datasource`,
      s3BucketName: `${environment}-ragchat-kb-source`,
    },
    
    tags: {
      ...commonDefaults.tags,
      Environment: environment,
    },
  };
}

/**
 * 環境を検証して取得する関数
 * @param value - 環境名の文字列
 * @returns 検証済みの環境名
 */
export function getValidEnvironment(value: string | undefined): Environment {
  const env = (value || 'dev').toLowerCase();
  
  if (env !== 'dev' && env !== 'stg' && env !== 'prod') {
    throw new Error(`Invalid environment: ${env}. Must be one of: dev, stg, prod`);
  }
  
  return env as Environment;
}