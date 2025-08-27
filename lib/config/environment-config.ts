// lib/config/environment-config.ts

export type Environment = 'dev' | 'stg' | 'prod';

export interface EnvironmentConfig {
  environment: Environment;
  
  // ドメイン設定
  domain?: {
    domainName: string;
    certificateArn: string;
  };
  
  // ネットワーク設定
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
    
    naming: {
      clusterName: string;
      subnetGroupName: string;
      masterSecretName: string;
    };
  };
  
  // セキュリティ設定
  security: {
    enableVpcFlowLogs: boolean;
    allowedCidrBlocks: string[];
    enableGuardDuty: boolean;
  };
  
  // Bedrock設定
  bedrock: {
    knowledgeBaseName: string;
    dataSourceName: string;
    s3BucketName: string;
    embeddingModel: string;
    modelRegion: string;
    imageGenerationRegion: string;
    chunkingStrategy: {
      type: 'HIERARCHICAL';
      maxParentTokens: number;
      maxChildTokens: number;
      overlapTokens: number;
    };
  };
  
  // DynamoDB設定
  dynamodb: {
    tableName: string;
  };
  
  // S3設定
  s3: {
    promptImagesBucketName: string;
    frontBucketName: string;
  };
  
  // Cognito設定
  cognito: {
    userPoolName: string;
    userPoolClientName: string;
  };
  
  // CloudFront設定
  cloudfront: {
    distributionName: string;
    originAccessControlName: string;
  };
  
  // API Gateway設定
  apiGateway: {
    httpApiName: string;
  };
  
  // Lambda Functions設定
  lambda: {
    ragPromptImagesFunctionName: string;
    s3ImagesFunctionName: string;
    cognitoPostConfirmationFunctionName: string;
    cognitoUserEnableFunctionName: string;
    ragGenerateImageFunctionName: string;
    ragGetChatsFunctionName: string;
    searchChatsFunctionName: string;
    ragSseStreamFunctionName: string;
    ragGetChatDetailFunctionName: string;
  };
  
  // 共通タグ
  tags: {
    [key: string]: string;
  };
}

// 共通のデフォルト設定
const commonDefaults = {
  network: {
    vpcCidr: '10.0.0.0/16',
    enableNatGateway: false,
    availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
    createVpcEndpoints: true,
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
  security: {
    enableVpcFlowLogs: false,
    allowedCidrBlocks: ['10.0.0.0/16'],
    enableGuardDuty: false,
  },
  bedrock: {
    embeddingModel: 'amazon.titan-embed-text-v2:0',
    modelRegion: 'us-west-2',
    imageGenerationRegion: 'us-east-1',
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

// 環境別のドメイン設定
const domainConfigs: Record<Environment, { domainName: string; certificateArn: string } | undefined> = {
  dev: {
    domainName: 'dev.ai.cpinfo.jp',
    certificateArn: 'arn:aws:acm:us-east-1:794038219704:certificate/7d2d02e3-c835-491a-b616-50b55f738943'
  },
  stg: {
    domainName: 'stg.ai.cpinfo.jp', 
    certificateArn: 'arn:aws:acm:us-east-1:794038219704:certificate/7d2d02e3-c835-491a-b616-50b55f738943'
  },
  prod: {
    domainName: 'ai.cpinfo.jp',
    certificateArn: 'arn:aws:acm:us-east-1:794038219704:certificate/7d2d02e3-c835-491a-b616-50b55f738943'
  }
};

/**
 * 環境別の設定を生成する関数
 * @param environment - 環境名 ('dev' | 'stg' | 'prod')
 * @returns 環境別の設定オブジェクト
 */
export function createConfig(environment: Environment): EnvironmentConfig {
  const basePrefix = `${environment}-ragchat`;
  
  return {
    environment: environment,
    
    // ドメイン設定
    domain: domainConfigs[environment],
    
    network: {
      ...commonDefaults.network,
      
      naming: {
        vpcName: `${environment}-ragchat-vpc`,
        privateSubnetName: `${environment}-ragchat-private-subnet`,
        auroraSecurityGroupName: `${environment}-ragchat-aurora-sg`,
        lambdaSecurityGroupName: `${environment}-ragchat-lambda-sg`,
      },
    },
    
    aurora: {
      ...commonDefaults.aurora,
      databaseName: `${environment}_ragchat_db`,
      
      naming: {
        clusterName: `${environment}-ragchat-aurora-cluster`,
        subnetGroupName: `${environment}-ragchat-db-subnet-group`,
        masterSecretName: `${environment}-ragchat-aurora-secret`,
      },
    },
    
    security: {
      ...commonDefaults.security,
    },
    
    bedrock: {
      ...commonDefaults.bedrock,
      knowledgeBaseName: `${environment}-ragchat-knowledge-base`,
      dataSourceName: `${environment}-ragchat-datasource`,
      s3BucketName: `${environment}-ragchat-kb-source`,
    },
    
    // DynamoDB設定
    dynamodb: {
      tableName: `${basePrefix}-app-table`,
    },
    
    // S3設定
    s3: {
      promptImagesBucketName: `${basePrefix}-prompt-images`,
      frontBucketName: `${basePrefix}-front`,
    },
    
    // Cognito設定
    cognito: {
      userPoolName: `${basePrefix}-user-pool`,
      userPoolClientName: `${basePrefix}-user-pool-client`,
    },
    
    // CloudFront設定
    cloudfront: {
      distributionName: `${basePrefix} distribution`,
      originAccessControlName: `${basePrefix}-OAC`,
    },
    
    // API Gateway設定
    apiGateway: {
      httpApiName: `${basePrefix}-http-api`,
    },
    
    // Lambda Functions設定
    lambda: {
      ragPromptImagesFunctionName: `${basePrefix}-prompt-images-function`,
      s3ImagesFunctionName: `${basePrefix}-s3-images-function`,
      cognitoPostConfirmationFunctionName: `${basePrefix}-cognito-post-confirmation-function`,
      cognitoUserEnableFunctionName: `${basePrefix}-cognito-user-enable-function`,
      ragGenerateImageFunctionName: `${basePrefix}-generate-image-function`,
      ragGetChatsFunctionName: `${basePrefix}-get-chats-function`,
      searchChatsFunctionName: `${basePrefix}-search-chats-function`,
      ragSseStreamFunctionName: `${basePrefix}-sse-stream-function`,
      ragGetChatDetailFunctionName: `${basePrefix}-get-chat-detail-function`,
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