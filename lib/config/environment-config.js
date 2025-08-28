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
        // EventBridge設定
        eventbridge: {
            eventRuleName: `${environment}-ragchat-user-enable-rule`,
        },
        // CloudTrail証跡設定
        cloudtrail: {
            trailName: `${environment}-ragchat-cognito-user-enable-events`,
            trailBucketName: `${environment}-ragchat-cloudtrail-cognito-logs`,
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
                ADMIN_EMAILS: 'oishi.t@cpinfo.jp',
                //システムメール送信アドレス
                SYSTEM_EMAIL: 'system.ai.cpinfo.jp',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBb01uQyxvQ0F3R0M7QUFPRCxrREFRQztBQXBMRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLElBQUk7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGlCQUFpQixFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLDhCQUE4QjtRQUM5QyxXQUFXLEVBQUUsV0FBVztRQUN4QixxQkFBcUIsRUFBRSxXQUFXO1FBQ2xDLGdCQUFnQixFQUFFO1lBQ2hCLElBQUksRUFBRSxjQUF1QjtZQUM3QixlQUFlLEVBQUUsSUFBSTtZQUNyQixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsRUFBRTtTQUNsQjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLGFBQWE7UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixDQUFDO0FBRUYsYUFBYTtBQUNiLE1B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QUN2RSx3QkFBd0IsRUFBRSxHQUFHLFdBQVcsOEJBQThCO1lBQ3RFLDRCQUE0QixFQUFFLEdBQUcsV0FBVyxtQ0FBbUM7WUFDL0UsMEJBQTBCLEVBQUU7Z0JBQzFCLGNBQWM7Z0JBQ2QsWUFBWSxFQUFFLG1CQUFtQjtnQkFDakMsZUFBZTtnQkFDZixZQUFZLEVBQUUscUJBQXFCO2dCQUNuQyxXQUFXLEVBQUUsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBVSxFQUFFO2FBQ3pEO1NBQ0Y7UUFDRCxJQUFJLEVBQUU7WUFDSixHQUFHLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLFdBQVcsRUFBRSxXQUFXO1NBQ3pCO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsS0FBeUI7SUFDM0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFM0MsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsa0NBQWtDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsT0FBTyxHQUFrQixDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZy50c1xyXG5cclxuZXhwb3J0IHR5cGUgRW52aXJvbm1lbnQgPSAnZGV2JyB8ICdzdGcnIHwgJ3Byb2QnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm9ubWVudENvbmZpZyB7XHJcbiAgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50O1xyXG4gIFxyXG4gIC8vIOODieODoeOCpOODs+ioreWumlxyXG4gIGRvbWFpbj86IHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIGNlcnRpZmljYXRlQXJuOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyDjg43jg4Pjg4jjg6/jg7zjgq/oqK3lrppcclxuICBuZXR3b3JrOiB7XHJcbiAgICB2cGNDaWRyOiBzdHJpbmc7XHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBib29sZWFuO1xyXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdO1xyXG4gICAgY3JlYXRlVnBjRW5kcG9pbnRzOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBuYW1pbmc6IHtcclxuICAgICAgdnBjTmFtZTogc3RyaW5nO1xyXG4gICAgICBwcml2YXRlU3VibmV0TmFtZTogc3RyaW5nO1xyXG4gICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEF1cm9yYeioreWumlxyXG4gIGF1cm9yYToge1xyXG4gICAgZGF0YWJhc2VOYW1lOiBzdHJpbmc7XHJcbiAgICBtYXN0ZXJVc2VybmFtZTogc3RyaW5nO1xyXG4gICAgbWluQ2FwYWNpdHk6IG51bWJlcjtcclxuICAgIG1heENhcGFjaXR5OiBudW1iZXI7XHJcbiAgICBlbmFibGVEYXRhQXBpOiBib29sZWFuO1xyXG4gICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBib29sZWFuO1xyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogbnVtYmVyO1xyXG4gICAgZW5hYmxlQ2xvdWR3YXRjaExvZ3M6IGJvb2xlYW47XHJcbiAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBuYW1pbmc6IHtcclxuICAgICAgY2x1c3Rlck5hbWU6IHN0cmluZztcclxuICAgICAgc3VibmV0R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICAgIG1hc3RlclNlY3JldE5hbWU6IHN0cmluZztcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyDjgrvjgq3jg6Xjg6rjg4bjgqPoqK3lrppcclxuICBzZWN1cml0eToge1xyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGJvb2xlYW47XHJcbiAgICBhbGxvd2VkQ2lkckJsb2Nrczogc3RyaW5nW107XHJcbiAgICBlbmFibGVHdWFyZER1dHk6IGJvb2xlYW47XHJcbiAgfTtcclxuICBcclxuICAvLyBCZWRyb2Nr6Kit5a6aXHJcbiAgYmVkcm9jazoge1xyXG4gICAga25vd2xlZGdlQmFzZU5hbWU6IHN0cmluZztcclxuICAgIGRhdGFTb3VyY2VOYW1lOiBzdHJpbmc7XHJcbiAgICBzM0J1Y2tldE5hbWU6IHN0cmluZztcclxuICAgIGVtYmVkZGluZ01vZGVsOiBzdHJpbmc7XHJcbiAgICBtb2RlbFJlZ2lvbjogc3RyaW5nO1xyXG4gICAgaW1hZ2VHZW5lcmF0aW9uUmVnaW9uOiBzdHJpbmc7XHJcbiAgICBjaHVua2luZ1N0cmF0ZWd5OiB7XHJcbiAgICAgIHR5cGU6ICdISUVSQVJDSElDQUwnO1xyXG4gICAgICBtYXhQYXJlbnRUb2tlbnM6IG51bWJlcjtcclxuICAgICAgbWF4Q2hpbGRUb2tlbnM6IG51bWJlcjtcclxuICAgICAgb3ZlcmxhcFRva2VuczogbnVtYmVyO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIER5bmFtb0RC6Kit5a6aXHJcbiAgZHluYW1vZGI6IHtcclxuICAgIHRhYmxlTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gUzPoqK3lrppcclxuICBzMzoge1xyXG4gICAgcHJvbXB0SW1hZ2VzQnVja2V0TmFtZTogc3RyaW5nO1xyXG4gICAgZnJvbnRCdWNrZXROYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBDb2duaXRv6Kit5a6aXHJcbiAgY29nbml0bzoge1xyXG4gICAgdXNlclBvb2xOYW1lOiBzdHJpbmc7XHJcbiAgICB1c2VyUG9vbENsaWVudE5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIENsb3VkRnJvbnToqK3lrppcclxuICBjbG91ZGZyb250OiB7XHJcbiAgICBkaXN0cmlidXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBvcmlnaW5BY2Nlc3NDb250cm9sTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQVBJIEdhdGV3YXnoqK3lrppcclxuICBhcGlHYXRld2F5OiB7XHJcbiAgICBodHRwQXBpTmFtZTogc3RyaW5nO1xyXG4gIH07XHJcblxyXG4gIC8vIEV2ZW50QnJpZGdl6Kit5a6aXHJcbiAgZXZlbnRicmlkZ2U6IHtcclxuICAgIGV2ZW50UnVsZU5hbWU6IHN0cmluZztcclxuICB9O1xyXG5cclxuICAvLyBDbG91ZFRyYWls6Ki86Leh6Kit5a6aXHJcbiAgY2xvdWR0cmFpbDoge1xyXG4gICAgdHJhaWxOYW1lOiBzdHJpbmcsXHJcbiAgICB0cmFpbEJ1Y2tldE5hbWU6IHN0cmluZyxcclxuICB9LFxyXG4gIFxyXG4gIFxyXG4gIC8vIExhbWJkYSBGdW5jdGlvbnPoqK3lrppcclxuICBsYW1iZGE6IHtcclxuICAgIHJhZ1Byb21wdEltYWdlc0Z1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgczNJbWFnZXNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIGNvZ25pdG9Qb3N0Q29uZmlybWF0aW9uRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBjb2duaXRvVXNlckVuYWJsZUZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnR2VuZXJhdGVJbWFnZUZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnR2V0Q2hhdHNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaENoYXRzRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICByYWdTc2VTdHJlYW1GdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHJhZ0dldENoYXREZXRhaWxGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIC8vIOi/veWKoDogQ29nbml0byBMYW1iZGEg55So44Gu55Kw5aKD5aSJ5pWwXHJcbiAgICBjb2duaXRvU2VuZG1haWxGdW5jdGlvbkVudjoge1xyXG4gICAgICBBRE1JTl9FTUFJTFM6IHN0cmluZztcclxuICAgICAgU0VSVklDRV9VUkw6IHN0cmluZztcclxuICAgICAgU1lTVEVNX0VNQUlMOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8g5YWx6YCa44K/44KwXHJcbiAgdGFnczoge1xyXG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xyXG4gIH07XHJcbn1cclxuXHJcbi8vIOWFsemAmuOBruODh+ODleOCqeODq+ODiOioreWumlxyXG5jb25zdCBjb21tb25EZWZhdWx0cyA9IHtcclxuICBuZXR3b3JrOiB7XHJcbiAgICB2cGNDaWRyOiAnMTAuMC4wLjAvMTYnLFxyXG4gICAgZW5hYmxlTmF0R2F0ZXdheTogZmFsc2UsXHJcbiAgICBhdmFpbGFiaWxpdHlab25lczogWydhcC1ub3J0aGVhc3QtMWEnLCAnYXAtbm9ydGhlYXN0LTFjJ10sXHJcbiAgICBjcmVhdGVWcGNFbmRwb2ludHM6IHRydWUsXHJcbiAgfSxcclxuICBhdXJvcmE6IHtcclxuICAgIG1hc3RlclVzZXJuYW1lOiAnYmVkcm9ja2FkbWluJyxcclxuICAgIG1pbkNhcGFjaXR5OiAwLjUsXHJcbiAgICBtYXhDYXBhY2l0eTogMTYsXHJcbiAgICBlbmFibGVEYXRhQXBpOiB0cnVlLFxyXG4gICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcclxuICAgIGJhY2t1cFJldGVudGlvbkRheXM6IDcsXHJcbiAgICBlbmFibGVDbG91ZHdhdGNoTG9nczogdHJ1ZSxcclxuICAgIGVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHM6IGZhbHNlLFxyXG4gIH0sXHJcbiAgc2VjdXJpdHk6IHtcclxuICAgIGVuYWJsZVZwY0Zsb3dMb2dzOiBmYWxzZSxcclxuICAgIGFsbG93ZWRDaWRyQmxvY2tzOiBbJzEwLjAuMC4wLzE2J10sXHJcbiAgICBlbmFibGVHdWFyZER1dHk6IGZhbHNlLFxyXG4gIH0sXHJcbiAgYmVkcm9jazoge1xyXG4gICAgZW1iZWRkaW5nTW9kZWw6ICdhbWF6b24udGl0YW4tZW1iZWQtdGV4dC12MjowJyxcclxuICAgIG1vZGVsUmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgIGltYWdlR2VuZXJhdGlvblJlZ2lvbjogJ3VzLWVhc3QtMScsXHJcbiAgICBjaHVua2luZ1N0cmF0ZWd5OiB7XHJcbiAgICAgIHR5cGU6ICdISUVSQVJDSElDQUwnIGFzIGNvbnN0LFxyXG4gICAgICBtYXhQYXJlbnRUb2tlbnM6IDMwMDAsXHJcbiAgICAgIG1heENoaWxkVG9rZW5zOiAxMDAwLFxyXG4gICAgICBvdmVybGFwVG9rZW5zOiA2MCxcclxuICAgIH0sXHJcbiAgfSxcclxuICB0YWdzOiB7XHJcbiAgICBQcm9qZWN0OiAncmFnY2hhdC1hcHAnLFxyXG4gICAgTWFuYWdlZEJ5OiAnY2RrJyxcclxuICB9LFxyXG59O1xyXG5cclxuLy8g55Kw5aKD5Yil44Gu44OJ44Oh44Kk44Oz6Kit5a6aXHJcbmNvbnN0IGRvbWFpbkNvbmZpZ3M6IFJlY29yZDxFbnZpcm9ubWVudCwgeyBkb21haW5OYW1lOiBzdHJpbmc7IGNlcnRpZmljYXRlQXJuOiBzdHJpbmcgfSB8IHVuZGVmaW5lZD4gPSB7XHJcbiAgZGV2OiB7XHJcbiAgICBkb21haW5OYW1lOiAnZGV2LmFpLmNwaW5mby5qcCcsXHJcbiAgICBjZXJ0aWZpY2F0ZUFybjogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMTo3OTQwMzgyMTk3MDQ6Y2VydGlmaWNhdGUvN2QyZDAyZTMtYzgzNS00OTFhLWI2MTYtNTBiNTVmNzM4OTQzJ1xyXG4gIH0sXHJcbiAgc3RnOiB7XHJcbiAgICBkb21haW5OYW1lOiAnc3RnLmFpLmNwaW5mby5qcCcsIFxyXG4gICAgY2VydGlmaWNhdGVBcm46ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6Nzk0MDM4MjE5NzA0OmNlcnRpZmljYXRlLzdkMmQwMmUzLWM4MzUtNDkxYS1iNjE2LTUwYjU1ZjczODk0MydcclxuICB9LFxyXG4gIHByb2Q6IHtcclxuICAgIGRvbWFpbk5hbWU6ICdhaS5jcGluZm8uanAnLFxyXG4gICAgY2VydGlmaWNhdGVBcm46ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6Nzk0MDM4MjE5NzA0OmNlcnRpZmljYXRlLzdkMmQwMmUzLWM4MzUtNDkxYS1iNjE2LTUwYjU1ZjczODk0MydcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICog55Kw5aKD5Yil44Gu6Kit5a6a44KS55Sf5oiQ44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSBlbnZpcm9ubWVudCAtIOeSsOWig+WQjSAoJ2RldicgfCAnc3RnJyB8ICdwcm9kJylcclxuICogQHJldHVybnMg55Kw5aKD5Yil44Gu6Kit5a6a44Kq44OW44K444Kn44Kv44OIXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZmlnKGVudmlyb25tZW50OiBFbnZpcm9ubWVudCk6IEVudmlyb25tZW50Q29uZmlnIHtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgXHJcbiAgICAvLyDjg4njg6HjgqTjg7PoqK3lrppcclxuICAgIGRvbWFpbjogZG9tYWluQ29uZmlnc1tlbnZpcm9ubWVudF0sXHJcbiAgICBcclxuICAgIG5ldHdvcms6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMubmV0d29yayxcclxuICAgICAgXHJcbiAgICAgIG5hbWluZzoge1xyXG4gICAgICAgIHZwY05hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXZwY2AsXHJcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByaXZhdGUtc3VibmV0YCxcclxuICAgICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNnYCxcclxuICAgICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtbGFtYmRhLXNnYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGF1cm9yYToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5hdXJvcmEsXHJcbiAgICAgIGRhdGFiYXNlTmFtZTogYCR7ZW52aXJvbm1lbnR9X3JhZ2NoYXRfZGJgLFxyXG4gICAgICBcclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgY2x1c3Rlck5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWF1cm9yYS1jbHVzdGVyYCxcclxuICAgICAgICBzdWJuZXRHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRiLXN1Ym5ldC1ncm91cGAsXHJcbiAgICAgICAgbWFzdGVyU2VjcmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNlY3JldGAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZWN1cml0eToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5zZWN1cml0eSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGJlZHJvY2s6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMuYmVkcm9jayxcclxuICAgICAga25vd2xlZGdlQmFzZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtub3dsZWRnZS1iYXNlYCxcclxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRhdGFzb3VyY2VgLFxyXG4gICAgICBzM0J1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtiLXNvdXJjZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBEeW5hbW9EQuioreWumlxyXG4gICAgZHluYW1vZGI6IHtcclxuICAgICAgdGFibGVOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1hcHAtdGFibGVgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gUzPoqK3lrppcclxuICAgIHMzOiB7XHJcbiAgICAgIHByb21wdEltYWdlc0J1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByb21wdC1pbWFnZXNgLFxyXG4gICAgICBmcm9udEJ1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWZyb250YCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIENvZ25pdG/oqK3lrppcclxuICAgIGNvZ25pdG86IHtcclxuICAgICAgdXNlclBvb2xOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC11c2VyLXBvb2xgLFxyXG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXVzZXItcG9vbC1jbGllbnRgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQ2xvdWRGcm9udOioreWumlxyXG4gICAgY2xvdWRmcm9udDoge1xyXG4gICAgICBkaXN0cmlidXRpb25OYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdCBkaXN0cmlidXRpb25gLFxyXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtT0FDYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIEFQSSBHYXRld2F56Kit5a6aXHJcbiAgICBhcGlHYXRld2F5OiB7XHJcbiAgICAgIGh0dHBBcGlOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1odHRwLWFwaWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBFdmVudEJyaWRnZeioreWumlxyXG4gICAgZXZlbnRicmlkZ2U6IHtcclxuICAgICAgZXZlbnRSdWxlTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtdXNlci1lbmFibGUtcnVsZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBDbG91ZFRyYWls6Ki86Leh6Kit5a6aXHJcbiAgICBjbG91ZHRyYWlsOiB7XHJcbiAgICAgIHRyYWlsTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtY29nbml0by11c2VyLWVuYWJsZS1ldmVudHNgLFxyXG4gICAgICB0cmFpbEJ1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWNsb3VkdHJhaWwtY29nbml0by1sb2dzYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIExhbWJkYSBGdW5jdGlvbnPoqK3lrppcclxuICAgIGxhbWJkYToge1xyXG4gICAgICByYWdQcm9tcHRJbWFnZXNGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByb21wdC1pbWFnZXMtZnVuY3Rpb25gLFxyXG4gICAgICBzM0ltYWdlc0Z1bmN0aW9uTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtczMtaW1hZ2VzLWZ1bmN0aW9uYCxcclxuICAgICAgY29nbml0b1Bvc3RDb25maXJtYXRpb25GdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWNvZ25pdG8tcG9zdC1jb25maXJtYXRpb24tZnVuY3Rpb25gLFxyXG4gICAgICBjb2duaXRvVXNlckVuYWJsZUZ1bmN0aW9uTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtY29nbml0by11c2VyLWVuYWJsZS1mdW5jdGlvbmAsXHJcbiAgICAgIHJhZ0dlbmVyYXRlSW1hZ2VGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWdlbmVyYXRlLWltYWdlLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnR2V0Q2hhdHNGdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWdldC1jaGF0cy1mdW5jdGlvbmAsXHJcbiAgICAgIHNlYXJjaENoYXRzRnVuY3Rpb25OYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1zZWFyY2gtY2hhdHMtZnVuY3Rpb25gLFxyXG4gICAgICByYWdTc2VTdHJlYW1GdW5jdGlvbk5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXNzZS1zdHJlYW0tZnVuY3Rpb25gLFxyXG4gICAgICByYWdHZXRDaGF0RGV0YWlsRnVuY3Rpb25OYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1nZXQtY2hhdC1kZXRhaWwtZnVuY3Rpb25gLFxyXG4gICAgICBjb2duaXRvU2VuZG1haWxGdW5jdGlvbkVudjoge1xyXG4gICAgICAgIC8v5om/6KqN44Oh44O844Or566h55CG6ICF44Ki44OJ44Os44K5XHJcbiAgICAgICAgQURNSU5fRU1BSUxTOiAnb2lzaGkudEBjcGluZm8uanAnLFxyXG4gICAgICAgIC8v44K344K544OG44Og44Oh44O844Or6YCB5L+h44Ki44OJ44Os44K5XHJcbiAgICAgICAgU1lTVEVNX0VNQUlMOiAnc3lzdGVtLmFpLmNwaW5mby5qcCcsXHJcbiAgICAgICAgU0VSVklDRV9VUkw6IGAke2RvbWFpbkNvbmZpZ3NbZW52aXJvbm1lbnRdPy5kb21haW5OYW1lfWBcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0YWdzOiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLnRhZ3MsXHJcbiAgICAgIEVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOeSsOWig+OCkuaknOiovOOBl+OBpuWPluW+l+OBmeOCi+mWouaVsFxyXG4gKiBAcGFyYW0gdmFsdWUgLSDnkrDlooPlkI3jga7mloflrZfliJdcclxuICogQHJldHVybnMg5qSc6Ki85riI44G/44Gu55Kw5aKD5ZCNXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRFbnZpcm9ubWVudCh2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogRW52aXJvbm1lbnQge1xyXG4gIGNvbnN0IGVudiA9ICh2YWx1ZSB8fCAnZGV2JykudG9Mb3dlckNhc2UoKTtcclxuICBcclxuICBpZiAoZW52ICE9PSAnZGV2JyAmJiBlbnYgIT09ICdzdGcnICYmIGVudiAhPT0gJ3Byb2QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZW52aXJvbm1lbnQ6ICR7ZW52fS4gTXVzdCBiZSBvbmUgb2Y6IGRldiwgc3RnLCBwcm9kYCk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBlbnYgYXMgRW52aXJvbm1lbnQ7XHJcbn0iXX0=