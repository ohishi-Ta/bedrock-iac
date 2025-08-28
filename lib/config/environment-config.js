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
        modelRegion: 'us-west-2',
        imageGenerationRegion: 'us-east-1',
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
            tableName: `${environment}-ragchat-app-table`,
        },
        // S3設定
        s3: {
            promptImagesBucketName: `${environment}-ragchat-prompt-images`,
            frontBucketName: `${environment}-ragchat-front`,
        },
        // Cognito設定
        cognito: {
            userPoolName: `${environment}-ragchat-user-pool`,
            userPoolClientName: `${environment}-ragchat-user-pool-client`,
        },
        // CloudFront設定
        cloudfront: {
            distributionName: `${environment}-ragchat distribution`,
            originAccessControlName: `${environment}-ragchat-OAC`,
        },
        // API Gateway設定
        apiGateway: {
            httpApiName: `${environment}-ragchat-http-api`,
        },
        // Lambda Functions設定
        lambda: {
            ragPromptImagesFunctionName: `${environment}-ragchat-prompt-images-function`,
            s3ImagesFunctionName: `${environment}-ragchat-s3-images-function`,
            cognitoPostConfirmationFunctionName: `${environment}-ragchat-cognito-post-confirmation-function`,
            cognitoUserEnableFunctionName: `${environment}-ragchat-cognito-user-enable-function`,
            ragGenerateImageFunctionName: `${environment}-ragchat-generate-image-function`,
            ragGetChatsFunctionName: `${environment}-ragchat-get-chats-function`,
            searchChatsFunctionName: `${environment}-ragchat-search-chats-function`,
            ragSseStreamFunctionName: `${environment}-ragchat-sse-stream-function`,
            ragGetChatDetailFunctionName: `${environment}-ragchat-get-chat-detail-function`,
            cognitoSendmailFunctionEnv: {
                //承認メール管理者アドレス
                ADMIN_EMAILS: 'admin@example.com',
                //システムメール送信アドレス
                SYSTEM_EMAIL: 'system@example.com',
                SERVICE_URL: `${domainConfigs[environment]?.domainName}`
            },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBd0xuQyxvQ0E2RkM7QUFPRCxrREFRQztBQXpLRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLElBQUk7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGlCQUFpQixFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLDhCQUE4QjtRQUM5QyxXQUFXLEVBQUUsV0FBVztRQUN4QixxQkFBcUIsRUFBRSxXQUFXO1FBQ2xDLGdCQUFnQixFQUFFO1lBQ2hCLElBQUksRUFBRSxjQUF1QjtZQUM3QixlQUFlLEVBQUUsSUFBSTtZQUNyQixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsRUFBRTtTQUNsQjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLGFBQWE7UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixDQUFDO0FBRUYsYUFBYTtBQUNiLE1B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QUFXLEVBQUUsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBVSxFQUFFO2FBQ3pEO1NBQ0Y7UUFDRCxJQUFJLEVBQUU7WUFDSixHQUFHLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLFdBQVcsRUFBRSxXQUFXO1NBQ3pCO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsS0FBeUI7SUFDM0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFM0MsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsa0NBQWtDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsT0FBTyxHQUFrQixDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZy50c1xyXG5cclxuZXhwb3J0IHR5cGUgRW52aXJvbm1lbnQgPSAnZGV2JyB8ICdzdGcnIHwgJ3Byb2QnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm9ubWVudENvbmZpZyB7XHJcbiAgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50O1xyXG4gIFxyXG4gIC8vIOODieODoeOCpOODs+ioreWumlxyXG4gIGRvbWFpbj86IHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIGNlcnRpZmljYXRlQXJuOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyDjg43jg4Pjg4jjg6/jg7zjgq/oqK3lrppcclxuICBuZXR3b3JrOiB7XHJcbiAgICB2cGNDaWRyOiBzdHJpbmc7XHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBib29sZWFuO1xyXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdO1xyXG4gICAgY3JlYXRlVnBjRW5kcG9pbnRzOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBuYW1pbmc6IHtcclxuICAgICAgdnBjTmFtZTogc3RyaW5nO1xyXG4gICAgICBwcml2YXRlU3VibmV0TmFtZTogc3RyaW5nO1xyXG4gICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEF1cm9yYeioreWumlxyXG4gIGF1cm9yYToge1xyXG4gICAgZGF0YWJhc2VOYW1lOiBzdHJpbmc7XHJcbiAgICBtYXN0ZXJVc2VybmFtZTogc3RyaW5nO1xyXG4gICAgbWluQ2FwYWNpdHk6IG51bWJlcjtcclxuICAgIG1heENhcGFjaXR5OiBudW1iZXI7XHJcbiAgICBlbmFibGVEYXRhQXBpOiBib29sZWFuO1xyXG4gICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBib29sZWFuO1xyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogbnVtYmVyO1xyXG4gICAgZW5hYmxlQ2xvdWR3YXRjaExvZ3M6IGJvb2xlYW47XHJcbiAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBuYW1pbmc6IHtcclxuICAgICAgY2x1c3Rlck5hbWU6IHN0cmluZztcclxuICAgICAgc3VibmV0R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICAgIG1hc3RlclNlY3JldE5hbWU6IHN0cmluZztcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyDjgrvjgq3jg6Xjg6rjg4bjgqPoqK3lrppcclxuICBzZWN1cml0eToge1xyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGJvb2xlYW47XHJcbiAgICBhbGxvd2VkQ2lkckJsb2Nrczogc3RyaW5nW107XHJcbiAgICBlbmFibGVHdWFyZER1dHk6IGJvb2xlYW47XHJcbiAgfTtcclxuICBcclxuICAvLyBCZWRyb2Nr6Kit5a6aXHJcbiAgYmVkcm9jazoge1xyXG4gICAga25vd2xlZGdlQmFzZU5hbWU6IHN0cmluZztcclxuICAgIGRhdGFTb3VyY2VOYW1lOiBzdHJpbmc7XHJcbiAgICBzM0J1Y2tldE5hbWU6IHN0cmluZztcclxuICAgIGVtYmVkZGluZ01vZGVsOiBzdHJpbmc7XHJcbiAgICBtb2RlbFJlZ2lvbjogc3RyaW5nO1xyXG4gICAgaW1hZ2VHZW5lcmF0aW9uUmVnaW9uOiBzdHJpbmc7XHJcbiAgICBjaHVua2luZ1N0cmF0ZWd5OiB7XHJcbiAgICAgIHR5cGU6ICdISUVSQVJDSElDQUwnO1xyXG4gICAgICBtYXhQYXJlbnRUb2tlbnM6IG51bWJlcjtcclxuICAgICAgbWF4Q2hpbGRUb2tlbnM6IG51bWJlcjtcclxuICAgICAgb3ZlcmxhcFRva2VuczogbnVtYmVyO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIER5bmFtb0RC6Kit5a6aXHJcbiAgZHluYW1vZGI6IHtcclxuICAgIHRhYmxlTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gUzPoqK3lrppcclxuICBzMzoge1xyXG4gICAgcHJvbXB0SW1hZ2VzQnVja2V0TmFtZTogc3RyaW5nO1xyXG4gICAgZnJvbnRCdWNrZXROYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBDb2duaXRv6Kit5a6aXHJcbiAgY29nbml0bzoge1xyXG4gICAgdXNlclBvb2xOYW1lOiBzdHJpbmc7XHJcbiAgICB1c2VyUG9vbENsaWVudE5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIENsb3VkRnJvbnToqK3lrppcclxuICBjbG91ZGZyb250OiB7XHJcbiAgICBkaXN0cmlidXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBvcmlnaW5BY2Nlc3NDb250cm9sTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQVBJIEdhdGV3YXnoqK3lrppcclxuICBhcGlHYXRld2F5OiB7XHJcbiAgICBodHRwQXBpTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gTGFtYmRhIEZ1bmN0aW9uc+ioreWumlxyXG4gIGxhbWJkYToge1xyXG4gICAgcmFnUHJvbXB0SW1hZ2VzRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBzM0ltYWdlc0Z1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgY29nbml0b1Bvc3RDb25maXJtYXRpb25GdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIGNvZ25pdG9Vc2VyRW5hYmxlRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICByYWdHZW5lcmF0ZUltYWdlRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICByYWdHZXRDaGF0c0Z1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgc2VhcmNoQ2hhdHNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHJhZ1NzZVN0cmVhbUZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnR2V0Q2hhdERldGFpbEZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgLy8g6L+95YqgOiBDb2duaXRvIExhbWJkYSDnlKjjga7nkrDlooPlpInmlbBcclxuICAgIGNvZ25pdG9TZW5kbWFpbEZ1bmN0aW9uRW52OiB7XHJcbiAgICAgIEFETUlOX0VNQUlMUzogc3RyaW5nO1xyXG4gICAgICBTRVJWSUNFX1VSTDogc3RyaW5nO1xyXG4gICAgICBTWVNURU1fRU1BSUw6IHN0cmluZztcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyDlhbHpgJrjgr/jgrBcclxuICB0YWdzOiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfTtcclxufVxyXG5cclxuLy8g5YWx6YCa44Gu44OH44OV44Kp44Or44OI6Kit5a6aXHJcbmNvbnN0IGNvbW1vbkRlZmF1bHRzID0ge1xyXG4gIG5ldHdvcms6IHtcclxuICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBmYWxzZSxcclxuICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2FwLW5vcnRoZWFzdC0xYScsICdhcC1ub3J0aGVhc3QtMWMnXSxcclxuICAgIGNyZWF0ZVZwY0VuZHBvaW50czogdHJ1ZSxcclxuICB9LFxyXG4gIGF1cm9yYToge1xyXG4gICAgbWFzdGVyVXNlcm5hbWU6ICdiZWRyb2NrYWRtaW4nLFxyXG4gICAgbWluQ2FwYWNpdHk6IDAuNSxcclxuICAgIG1heENhcGFjaXR5OiAxNixcclxuICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogNyxcclxuICAgIGVuYWJsZUNsb3Vkd2F0Y2hMb2dzOiB0cnVlLFxyXG4gICAgZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0czogZmFsc2UsXHJcbiAgfSxcclxuICBzZWN1cml0eToge1xyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGZhbHNlLFxyXG4gICAgYWxsb3dlZENpZHJCbG9ja3M6IFsnMTAuMC4wLjAvMTYnXSxcclxuICAgIGVuYWJsZUd1YXJkRHV0eTogZmFsc2UsXHJcbiAgfSxcclxuICBiZWRyb2NrOiB7XHJcbiAgICBlbWJlZGRpbmdNb2RlbDogJ2FtYXpvbi50aXRhbi1lbWJlZC10ZXh0LXYyOjAnLFxyXG4gICAgbW9kZWxSZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgaW1hZ2VHZW5lcmF0aW9uUmVnaW9uOiAndXMtZWFzdC0xJyxcclxuICAgIGNodW5raW5nU3RyYXRlZ3k6IHtcclxuICAgICAgdHlwZTogJ0hJRVJBUkNISUNBTCcgYXMgY29uc3QsXHJcbiAgICAgIG1heFBhcmVudFRva2VuczogMzAwMCxcclxuICAgICAgbWF4Q2hpbGRUb2tlbnM6IDEwMDAsXHJcbiAgICAgIG92ZXJsYXBUb2tlbnM6IDYwLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHRhZ3M6IHtcclxuICAgIFByb2plY3Q6ICdyYWdjaGF0LWFwcCcsXHJcbiAgICBNYW5hZ2VkQnk6ICdjZGsnLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vLyDnkrDlooPliKXjga7jg4njg6HjgqTjg7PoqK3lrppcclxuY29uc3QgZG9tYWluQ29uZmlnczogUmVjb3JkPEVudmlyb25tZW50LCB7IGRvbWFpbk5hbWU6IHN0cmluZzsgY2VydGlmaWNhdGVBcm46IHN0cmluZyB9IHwgdW5kZWZpbmVkPiA9IHtcclxuICBkZXY6IHtcclxuICAgIGRvbWFpbk5hbWU6ICdkZXYuYWkuY3BpbmZvLmpwJyxcclxuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjc5NDAzODIxOTcwNDpjZXJ0aWZpY2F0ZS83ZDJkMDJlMy1jODM1LTQ5MWEtYjYxNi01MGI1NWY3Mzg5NDMnXHJcbiAgfSxcclxuICBzdGc6IHtcclxuICAgIGRvbWFpbk5hbWU6ICdzdGcuYWkuY3BpbmZvLmpwJywgXHJcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMTo3OTQwMzgyMTk3MDQ6Y2VydGlmaWNhdGUvN2QyZDAyZTMtYzgzNS00OTFhLWI2MTYtNTBiNTVmNzM4OTQzJ1xyXG4gIH0sXHJcbiAgcHJvZDoge1xyXG4gICAgZG9tYWluTmFtZTogJ2FpLmNwaW5mby5qcCcsXHJcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMTo3OTQwMzgyMTk3MDQ6Y2VydGlmaWNhdGUvN2QyZDAyZTMtYzgzNS00OTFhLWI2MTYtNTBiNTVmNzM4OTQzJ1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiDnkrDlooPliKXjga7oqK3lrprjgpLnlJ/miJDjgZnjgovplqLmlbBcclxuICogQHBhcmFtIGVudmlyb25tZW50IC0g55Kw5aKD5ZCNICgnZGV2JyB8ICdzdGcnIHwgJ3Byb2QnKVxyXG4gKiBAcmV0dXJucyDnkrDlooPliKXjga7oqK3lrprjgqrjg5bjgrjjgqfjgq/jg4hcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoZW52aXJvbm1lbnQ6IEVudmlyb25tZW50KTogRW52aXJvbm1lbnRDb25maWcge1xyXG4gIFxyXG4gIHJldHVybiB7XHJcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXHJcbiAgICBcclxuICAgIC8vIOODieODoeOCpOODs+ioreWumlxyXG4gICAgZG9tYWluOiBkb21haW5Db25maWdzW2Vudmlyb25tZW50XSxcclxuICAgIFxyXG4gICAgbmV0d29yazoge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5uZXR3b3JrLFxyXG4gICAgICBcclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgdnBjTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtdnBjYCxcclxuICAgICAgICBwcml2YXRlU3VibmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtcHJpdmF0ZS1zdWJuZXRgLFxyXG4gICAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1hdXJvcmEtc2dgLFxyXG4gICAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1sYW1iZGEtc2dgLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgYXVyb3JhOiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLmF1cm9yYSxcclxuICAgICAgZGF0YWJhc2VOYW1lOiBgJHtlbnZpcm9ubWVudH1fcmFnY2hhdF9kYmAsXHJcbiAgICAgIFxyXG4gICAgICBuYW1pbmc6IHtcclxuICAgICAgICBjbHVzdGVyTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLWNsdXN0ZXJgLFxyXG4gICAgICAgIHN1Ym5ldEdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtZGItc3VibmV0LWdyb3VwYCxcclxuICAgICAgICBtYXN0ZXJTZWNyZXROYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1hdXJvcmEtc2VjcmV0YCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNlY3VyaXR5OiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLnNlY3VyaXR5LFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgYmVkcm9jazoge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5iZWRyb2NrLFxyXG4gICAgICBrbm93bGVkZ2VCYXNlTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQta25vd2xlZGdlLWJhc2VgLFxyXG4gICAgICBkYXRhU291cmNlTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtZGF0YXNvdXJjZWAsXHJcbiAgICAgIHMzQnVja2V0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQta2Itc291cmNlYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIER5bmFtb0RC6Kit5a6aXHJcbiAgICBkeW5hbW9kYjoge1xyXG4gICAgICB0YWJsZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWFwcC10YWJsZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBTM+ioreWumlxyXG4gICAgczM6IHtcclxuICAgICAgcHJvbXB0SW1hZ2VzQnVja2V0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtcHJvbXB0LWltYWdlc2AsXHJcbiAgICAgIGZyb250QnVja2V0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtZnJvbnRgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQ29nbml0b+ioreWumlxyXG4gICAgY29nbml0bzoge1xyXG4gICAgICB1c2VyUG9vbE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXVzZXItcG9vbGAsXHJcbiAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtdXNlci1wb29sLWNsaWVudGAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBDbG91ZEZyb2506Kit5a6aXHJcbiAgICBjbG91ZGZyb250OiB7XHJcbiAgICAgIGRpc3RyaWJ1dGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0IGRpc3RyaWJ1dGlvbmAsXHJcbiAgICAgIG9yaWdpbkFjY2Vzc0NvbnRyb2xOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1PQUNgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQVBJIEdhdGV3YXnoqK3lrppcclxuICAgIGFwaUdhdGV3YXk6IHtcclxuICAgICAgaHR0cEFwaU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWh0dHAtYXBpYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIExhbWJkYSBGdW5jdGlvbnPoqK3lrppcclxuICAgIGxhbWJkYToge1xyXG4gICAgICByYWdQcm9tcHRJbWFnZXNGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByb21wdC1pbWFnZXMtZnVuY3Rpb25gLFxyXG4gICAgICBzM0ltYWdlc0Z1bmN0aW9uTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtczMtaW1hZ2VzLWZ1bmN0aW9uYCxcclxuICAgICAgY29nbml0b1Bvc3RDb25maXJtYXRpb25GdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWNvZ25pdG8tcG9zdC1jb25maXJtYXRpb24tZnVuY3Rpb25gLFxyXG4gICAgICBjb2duaXRvVXNlckVuYWJsZUZ1bmN0aW9uTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtY29nbml0by11c2VyLWVuYWJsZS1mdW5jdGlvbmAsXHJcbiAgICAgIHJhZ0dlbmVyYXRlSW1hZ2VGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWdlbmVyYXRlLWltYWdlLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnR2V0Q2hhdHNGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWdldC1jaGF0cy1mdW5jdGlvbmAsXHJcbiAgICAgIHNlYXJjaENoYXRzRnVuY3Rpb25OYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1zZWFyY2gtY2hhdHMtZnVuY3Rpb25gLFxyXG4gICAgICByYWdTc2VTdHJlYW1GdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXNzZS1zdHJlYW0tZnVuY3Rpb25gLFxyXG4gICAgICByYWdHZXRDaGF0RGV0YWlsRnVuY3Rpb25OYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1nZXQtY2hhdC1kZXRhaWwtZnVuY3Rpb25gLFxyXG4gICAgICBjb2duaXRvU2VuZG1haWxGdW5jdGlvbkVudjoge1xyXG4gICAgICAgIC8v5om/6KqN44Oh44O844Or566h55CG6ICF44Ki44OJ44Os44K5XHJcbiAgICAgICAgQURNSU5fRU1BSUxTOiAnYWRtaW5AZXhhbXBsZS5jb20nLFxyXG4gICAgICAgIC8v44K344K544OG44Og44Oh44O844Or6YCB5L+h44Ki44OJ44Os44K5XHJcbiAgICAgICAgU1lTVEVNX0VNQUlMOiAnc3lzdGVtQGV4YW1wbGUuY29tJyxcclxuICAgICAgICBTRVJWSUNFX1VSTDogYCR7ZG9tYWluQ29uZmlnc1tlbnZpcm9ubWVudF0/LmRvbWFpbk5hbWV9YFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRhZ3M6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMudGFncyxcclxuICAgICAgRW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICog55Kw5aKD44KS5qSc6Ki844GX44Gm5Y+W5b6X44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIOeSsOWig+WQjeOBruaWh+Wtl+WIl1xyXG4gKiBAcmV0dXJucyDmpJzoqLzmuIjjgb/jga7nkrDlooPlkI1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZEVudmlyb25tZW50KHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbnZpcm9ubWVudCB7XHJcbiAgY29uc3QgZW52ID0gKHZhbHVlIHx8ICdkZXYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gIFxyXG4gIGlmIChlbnYgIT09ICdkZXYnICYmIGVudiAhPT0gJ3N0ZycgJiYgZW52ICE9PSAncHJvZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBlbnZpcm9ubWVudDogJHtlbnZ9LiBNdXN0IGJlIG9uZSBvZjogZGV2LCBzdGcsIHByb2RgKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGVudiBhcyBFbnZpcm9ubWVudDtcclxufSJdfQ==