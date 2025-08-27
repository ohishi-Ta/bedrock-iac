"use strict";
// lib/config/environment-config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = createConfig;
exports.getValidEnvironment = getValidEnvironment;
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
        chunkingStrategy: {
            type: 'HIERARCHICAL',
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
const domainConfigs = {
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
function createConfig(environment) {
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
function getValidEnvironment(value) {
    const env = (value || 'dev').toLowerCase();
    if (env !== 'dev' && env !== 'stg' && env !== 'prod') {
        throw new Error(`Invalid environment: ${env}. Must be one of: dev, stg, prod`);
    }
    return env;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBOEtuQyxvQ0F3RkM7QUFPRCxrREFRQztBQWxLRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLElBQUk7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGlCQUFpQixFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLDhCQUE4QjtRQUM5QyxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsY0FBdUI7WUFDN0IsZUFBZSxFQUFFLElBQUk7WUFDckIsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFLEVBQUU7U0FDbEI7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxhQUFhO1FBQ3RCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0NBQ0YsQ0FBQztBQUVGLGFBQWE7QUFDYixNQUFNLGFBQWEsR0FBb0Y7SUFDckcsR0FBRyxFQUFFO1FBQ0gsVUFBVSxFQUFF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SCxTQUFnQixtQkFBbUIsQ0FBQyxLQUF5QjtJQUMzRCxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUUzQyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFLENBQUM7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxPQUFPLEdBQWtCLENBQUM7QUFDNUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnLnRzXHJcblxyXG5leHBvcnQgdHlwZSBFbnZpcm9ubWVudCA9ICdkZXYnIHwgJ3N0ZycgfCAncHJvZCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVudmlyb25tZW50Q29uZmlnIHtcclxuICBlbnZpcm9ubWVudDogRW52aXJvbm1lbnQ7XHJcbiAgXHJcbiAgLy8g44OJ44Oh44Kk44Oz6Kit5a6aXHJcbiAgZG9tYWluPzoge1xyXG4gICAgZG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgY2VydGlmaWNhdGVBcm46IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIOODjeODg+ODiOODr+ODvOOCr+ioreWumlxyXG4gIG5ldHdvcms6IHtcclxuICAgIHZwY0NpZHI6IHN0cmluZztcclxuICAgIGVuYWJsZU5hdEdhdGV3YXk6IGJvb2xlYW47XHJcbiAgICBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XHJcbiAgICBjcmVhdGVWcGNFbmRwb2ludHM6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIG5hbWluZzoge1xyXG4gICAgICB2cGNOYW1lOiBzdHJpbmc7XHJcbiAgICAgIHByaXZhdGVTdWJuZXROYW1lOiBzdHJpbmc7XHJcbiAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQXVyb3Jh6Kit5a6aXHJcbiAgYXVyb3JhOiB7XHJcbiAgICBkYXRhYmFzZU5hbWU6IHN0cmluZztcclxuICAgIG1hc3RlclVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBtaW5DYXBhY2l0eTogbnVtYmVyO1xyXG4gICAgbWF4Q2FwYWNpdHk6IG51bWJlcjtcclxuICAgIGVuYWJsZURhdGFBcGk6IGJvb2xlYW47XHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGJvb2xlYW47XHJcbiAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiBudW1iZXI7XHJcbiAgICBlbmFibGVDbG91ZHdhdGNoTG9nczogYm9vbGVhbjtcclxuICAgIGVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHM6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIG5hbWluZzoge1xyXG4gICAgICBjbHVzdGVyTmFtZTogc3RyaW5nO1xyXG4gICAgICBzdWJuZXRHcm91cE5hbWU6IHN0cmluZztcclxuICAgICAgbWFzdGVyU2VjcmV0TmFtZTogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIOOCu+OCreODpeODquODhuOCo+ioreWumlxyXG4gIHNlY3VyaXR5OiB7XHJcbiAgICBlbmFibGVWcGNGbG93TG9nczogYm9vbGVhbjtcclxuICAgIGFsbG93ZWRDaWRyQmxvY2tzOiBzdHJpbmdbXTtcclxuICAgIGVuYWJsZUd1YXJkRHV0eTogYm9vbGVhbjtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEJlZHJvY2voqK3lrppcclxuICBiZWRyb2NrOiB7XHJcbiAgICBrbm93bGVkZ2VCYXNlTmFtZTogc3RyaW5nO1xyXG4gICAgZGF0YVNvdXJjZU5hbWU6IHN0cmluZztcclxuICAgIHMzQnVja2V0TmFtZTogc3RyaW5nO1xyXG4gICAgZW1iZWRkaW5nTW9kZWw6IHN0cmluZztcclxuICAgIGNodW5raW5nU3RyYXRlZ3k6IHtcclxuICAgICAgdHlwZTogJ0hJRVJBUkNISUNBTCc7XHJcbiAgICAgIG1heFBhcmVudFRva2VuczogbnVtYmVyO1xyXG4gICAgICBtYXhDaGlsZFRva2VuczogbnVtYmVyO1xyXG4gICAgICBvdmVybGFwVG9rZW5zOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gRHluYW1vRELoqK3lrppcclxuICBkeW5hbW9kYjoge1xyXG4gICAgdGFibGVOYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBTM+ioreWumlxyXG4gIHMzOiB7XHJcbiAgICBwcm9tcHRJbWFnZXNCdWNrZXROYW1lOiBzdHJpbmc7XHJcbiAgICBmcm9udEJ1Y2tldE5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIENvZ25pdG/oqK3lrppcclxuICBjb2duaXRvOiB7XHJcbiAgICB1c2VyUG9vbE5hbWU6IHN0cmluZztcclxuICAgIHVzZXJQb29sQ2xpZW50TmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQ2xvdWRGcm9udOioreWumlxyXG4gIGNsb3VkZnJvbnQ6IHtcclxuICAgIGRpc3RyaWJ1dGlvbk5hbWU6IHN0cmluZztcclxuICAgIG9yaWdpbkFjY2Vzc0NvbnRyb2xOYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBBUEkgR2F0ZXdheeioreWumlxyXG4gIGFwaUdhdGV3YXk6IHtcclxuICAgIGh0dHBBcGlOYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBMYW1iZGEgRnVuY3Rpb25z6Kit5a6aXHJcbiAgbGFtYmRhOiB7XHJcbiAgICByYWdQcm9tcHRJbWFnZXNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHMzSW1hZ2VzRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBjb2duaXRvUG9zdENvbmZpcm1hdGlvbkZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgY29nbml0b1VzZXJFbmFibGVGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHJhZ0dlbmVyYXRlSW1hZ2VGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHJhZ0dldENoYXRzRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBzZWFyY2hDaGF0c0Z1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnU3NlU3RyZWFtRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICByYWdHZXRDaGF0RGV0YWlsRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyDlhbHpgJrjgr/jgrBcclxuICB0YWdzOiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfTtcclxufVxyXG5cclxuLy8g5YWx6YCa44Gu44OH44OV44Kp44Or44OI6Kit5a6aXHJcbmNvbnN0IGNvbW1vbkRlZmF1bHRzID0ge1xyXG4gIG5ldHdvcms6IHtcclxuICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBmYWxzZSxcclxuICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2FwLW5vcnRoZWFzdC0xYScsICdhcC1ub3J0aGVhc3QtMWMnXSxcclxuICAgIGNyZWF0ZVZwY0VuZHBvaW50czogdHJ1ZSxcclxuICB9LFxyXG4gIGF1cm9yYToge1xyXG4gICAgbWFzdGVyVXNlcm5hbWU6ICdiZWRyb2NrYWRtaW4nLFxyXG4gICAgbWluQ2FwYWNpdHk6IDAuNSxcclxuICAgIG1heENhcGFjaXR5OiAxNixcclxuICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogNyxcclxuICAgIGVuYWJsZUNsb3Vkd2F0Y2hMb2dzOiB0cnVlLFxyXG4gICAgZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0czogZmFsc2UsXHJcbiAgfSxcclxuICBzZWN1cml0eToge1xyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGZhbHNlLFxyXG4gICAgYWxsb3dlZENpZHJCbG9ja3M6IFsnMTAuMC4wLjAvMTYnXSxcclxuICAgIGVuYWJsZUd1YXJkRHV0eTogZmFsc2UsXHJcbiAgfSxcclxuICBiZWRyb2NrOiB7XHJcbiAgICBlbWJlZGRpbmdNb2RlbDogJ2FtYXpvbi50aXRhbi1lbWJlZC10ZXh0LXYyOjAnLFxyXG4gICAgY2h1bmtpbmdTdHJhdGVneToge1xyXG4gICAgICB0eXBlOiAnSElFUkFSQ0hJQ0FMJyBhcyBjb25zdCxcclxuICAgICAgbWF4UGFyZW50VG9rZW5zOiAzMDAwLFxyXG4gICAgICBtYXhDaGlsZFRva2VuczogMTAwMCxcclxuICAgICAgb3ZlcmxhcFRva2VuczogNjAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGFnczoge1xyXG4gICAgUHJvamVjdDogJ3JhZ2NoYXQtYXBwJyxcclxuICAgIE1hbmFnZWRCeTogJ2NkaycsXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIOeSsOWig+WIpeOBruODieODoeOCpOODs+ioreWumlxyXG5jb25zdCBkb21haW5Db25maWdzOiBSZWNvcmQ8RW52aXJvbm1lbnQsIHsgZG9tYWluTmFtZTogc3RyaW5nOyBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nIH0gfCB1bmRlZmluZWQ+ID0ge1xyXG4gIGRldjoge1xyXG4gICAgZG9tYWluTmFtZTogJ2Rldi5haS5jcGluZm8uanAnLFxyXG4gICAgY2VydGlmaWNhdGVBcm46ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6Nzk0MDM4MjE5NzA0OmNlcnRpZmljYXRlLzdkMmQwMmUzLWM4MzUtNDkxYS1iNjE2LTUwYjU1ZjczODk0MydcclxuICB9LFxyXG4gIHN0Zzoge1xyXG4gICAgZG9tYWluTmFtZTogJ3N0Zy5haS5jcGluZm8uanAnLCBcclxuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjc5NDAzODIxOTcwNDpjZXJ0aWZpY2F0ZS83ZDJkMDJlMy1jODM1LTQ5MWEtYjYxNi01MGI1NWY3Mzg5NDMnXHJcbiAgfSxcclxuICBwcm9kOiB7XHJcbiAgICBkb21haW5OYW1lOiAnYWkuY3BpbmZvLmpwJyxcclxuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjc5NDAzODIxOTcwNDpjZXJ0aWZpY2F0ZS83ZDJkMDJlMy1jODM1LTQ5MWEtYjYxNi01MGI1NWY3Mzg5NDMnXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOeSsOWig+WIpeOBruioreWumuOCkueUn+aIkOOBmeOCi+mWouaVsFxyXG4gKiBAcGFyYW0gZW52aXJvbm1lbnQgLSDnkrDlooPlkI0gKCdkZXYnIHwgJ3N0ZycgfCAncHJvZCcpXHJcbiAqIEByZXR1cm5zIOeSsOWig+WIpeOBruioreWumuOCquODluOCuOOCp+OCr+ODiFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbmZpZyhlbnZpcm9ubWVudDogRW52aXJvbm1lbnQpOiBFbnZpcm9ubWVudENvbmZpZyB7XHJcbiAgY29uc3QgYmFzZVByZWZpeCA9IGAke2Vudmlyb25tZW50fS1yYWdjaGF0YDtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgXHJcbiAgICAvLyDjg4njg6HjgqTjg7PoqK3lrppcclxuICAgIGRvbWFpbjogZG9tYWluQ29uZmlnc1tlbnZpcm9ubWVudF0sXHJcbiAgICBcclxuICAgIG5ldHdvcms6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMubmV0d29yayxcclxuICAgICAgXHJcbiAgICAgIG5hbWluZzoge1xyXG4gICAgICAgIHZwY05hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXZwY2AsXHJcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByaXZhdGUtc3VibmV0YCxcclxuICAgICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNnYCxcclxuICAgICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtbGFtYmRhLXNnYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGF1cm9yYToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5hdXJvcmEsXHJcbiAgICAgIGRhdGFiYXNlTmFtZTogYCR7ZW52aXJvbm1lbnR9X3JhZ2NoYXRfZGJgLFxyXG4gICAgICBcclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgY2x1c3Rlck5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWF1cm9yYS1jbHVzdGVyYCxcclxuICAgICAgICBzdWJuZXRHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRiLXN1Ym5ldC1ncm91cGAsXHJcbiAgICAgICAgbWFzdGVyU2VjcmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNlY3JldGAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZWN1cml0eToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5zZWN1cml0eSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGJlZHJvY2s6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMuYmVkcm9jayxcclxuICAgICAga25vd2xlZGdlQmFzZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtub3dsZWRnZS1iYXNlYCxcclxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRhdGFzb3VyY2VgLFxyXG4gICAgICBzM0J1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtiLXNvdXJjZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBEeW5hbW9EQuioreWumlxyXG4gICAgZHluYW1vZGI6IHtcclxuICAgICAgdGFibGVOYW1lOiBgJHtiYXNlUHJlZml4fS1hcHAtdGFibGVgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gUzPoqK3lrppcclxuICAgIHMzOiB7XHJcbiAgICAgIHByb21wdEltYWdlc0J1Y2tldE5hbWU6IGAke2Jhc2VQcmVmaXh9LXByb21wdC1pbWFnZXNgLFxyXG4gICAgICBmcm9udEJ1Y2tldE5hbWU6IGAke2Jhc2VQcmVmaXh9LWZyb250YCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIENvZ25pdG/oqK3lrppcclxuICAgIGNvZ25pdG86IHtcclxuICAgICAgdXNlclBvb2xOYW1lOiBgJHtiYXNlUHJlZml4fS11c2VyLXBvb2xgLFxyXG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6IGAke2Jhc2VQcmVmaXh9LXVzZXItcG9vbC1jbGllbnRgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQ2xvdWRGcm9udOioreWumlxyXG4gICAgY2xvdWRmcm9udDoge1xyXG4gICAgICBkaXN0cmlidXRpb25OYW1lOiBgJHtiYXNlUHJlZml4fSBkaXN0cmlidXRpb25gLFxyXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sTmFtZTogYCR7YmFzZVByZWZpeH0tT0FDYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIEFQSSBHYXRld2F56Kit5a6aXHJcbiAgICBhcGlHYXRld2F5OiB7XHJcbiAgICAgIGh0dHBBcGlOYW1lOiBgJHtiYXNlUHJlZml4fS1odHRwLWFwaWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBMYW1iZGEgRnVuY3Rpb25z6Kit5a6aXHJcbiAgICBsYW1iZGE6IHtcclxuICAgICAgcmFnUHJvbXB0SW1hZ2VzRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1wcm9tcHQtaW1hZ2VzLWZ1bmN0aW9uYCxcclxuICAgICAgczNJbWFnZXNGdW5jdGlvbk5hbWU6IGAke2Jhc2VQcmVmaXh9LXMzLWltYWdlcy1mdW5jdGlvbmAsXHJcbiAgICAgIGNvZ25pdG9Qb3N0Q29uZmlybWF0aW9uRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1jb2duaXRvLXBvc3QtY29uZmlybWF0aW9uLWZ1bmN0aW9uYCxcclxuICAgICAgY29nbml0b1VzZXJFbmFibGVGdW5jdGlvbk5hbWU6IGAke2Jhc2VQcmVmaXh9LWNvZ25pdG8tdXNlci1lbmFibGUtZnVuY3Rpb25gLFxyXG4gICAgICByYWdHZW5lcmF0ZUltYWdlRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1nZW5lcmF0ZS1pbWFnZS1mdW5jdGlvbmAsXHJcbiAgICAgIHJhZ0dldENoYXRzRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1nZXQtY2hhdHMtZnVuY3Rpb25gLFxyXG4gICAgICBzZWFyY2hDaGF0c0Z1bmN0aW9uTmFtZTogYCR7YmFzZVByZWZpeH0tc2VhcmNoLWNoYXRzLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnU3NlU3RyZWFtRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1zc2Utc3RyZWFtLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnR2V0Q2hhdERldGFpbEZ1bmN0aW9uTmFtZTogYCR7YmFzZVByZWZpeH0tZ2V0LWNoYXQtZGV0YWlsLWZ1bmN0aW9uYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHRhZ3M6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMudGFncyxcclxuICAgICAgRW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICog55Kw5aKD44KS5qSc6Ki844GX44Gm5Y+W5b6X44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIOeSsOWig+WQjeOBruaWh+Wtl+WIl1xyXG4gKiBAcmV0dXJucyDmpJzoqLzmuIjjgb/jga7nkrDlooPlkI1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZEVudmlyb25tZW50KHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbnZpcm9ubWVudCB7XHJcbiAgY29uc3QgZW52ID0gKHZhbHVlIHx8ICdkZXYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gIFxyXG4gIGlmIChlbnYgIT09ICdkZXYnICYmIGVudiAhPT0gJ3N0ZycgJiYgZW52ICE9PSAncHJvZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBlbnZpcm9ubWVudDogJHtlbnZ9LiBNdXN0IGJlIG9uZSBvZjogZGV2LCBzdGcsIHByb2RgKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGVudiBhcyBFbnZpcm9ubWVudDtcclxufSJdfQ==