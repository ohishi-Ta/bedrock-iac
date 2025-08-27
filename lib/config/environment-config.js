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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBa0xuQyxvQ0F3RkM7QUFPRCxrREFRQztBQXBLRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLElBQUk7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGlCQUFpQixFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLDhCQUE4QjtRQUM5QyxXQUFXLEVBQUUsV0FBVztRQUN4QixxQkFBcUIsRUFBRSxXQUFXO1FBQ2xDLGdCQUFnQixFQUFFO1lBQ2hCLElBQUksRUFBRSxjQUF1QjtZQUM3QixlQUFlLEVBQUUsSUFBSTtZQUNyQixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsRUFBRTtTQUNsQjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLGFBQWE7UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixDQUFDO0FBRUYsYUFBYTtBQUNiLE1B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VztTQUN6QjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLEtBQXlCO0lBQzNELE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTNDLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEVBQUUsQ0FBQztRQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLGtDQUFrQyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELE9BQU8sR0FBa0IsQ0FBQztBQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcudHNcclxuXHJcbmV4cG9ydCB0eXBlIEVudmlyb25tZW50ID0gJ2RldicgfCAnc3RnJyB8ICdwcm9kJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnRDb25maWcge1xyXG4gIGVudmlyb25tZW50OiBFbnZpcm9ubWVudDtcclxuICBcclxuICAvLyDjg4njg6HjgqTjg7PoqK3lrppcclxuICBkb21haW4/OiB7XHJcbiAgICBkb21haW5OYW1lOiBzdHJpbmc7XHJcbiAgICBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8g44ON44OD44OI44Ov44O844Kv6Kit5a6aXHJcbiAgbmV0d29yazoge1xyXG4gICAgdnBjQ2lkcjogc3RyaW5nO1xyXG4gICAgZW5hYmxlTmF0R2F0ZXdheTogYm9vbGVhbjtcclxuICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXTtcclxuICAgIGNyZWF0ZVZwY0VuZHBvaW50czogYm9vbGVhbjtcclxuICAgIFxyXG4gICAgbmFtaW5nOiB7XHJcbiAgICAgIHZwY05hbWU6IHN0cmluZztcclxuICAgICAgcHJpdmF0ZVN1Ym5ldE5hbWU6IHN0cmluZztcclxuICAgICAgYXVyb3JhU2VjdXJpdHlHcm91cE5hbWU6IHN0cmluZztcclxuICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cE5hbWU6IHN0cmluZztcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyBBdXJvcmHoqK3lrppcclxuICBhdXJvcmE6IHtcclxuICAgIGRhdGFiYXNlTmFtZTogc3RyaW5nO1xyXG4gICAgbWFzdGVyVXNlcm5hbWU6IHN0cmluZztcclxuICAgIG1pbkNhcGFjaXR5OiBudW1iZXI7XHJcbiAgICBtYXhDYXBhY2l0eTogbnVtYmVyO1xyXG4gICAgZW5hYmxlRGF0YUFwaTogYm9vbGVhbjtcclxuICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogYm9vbGVhbjtcclxuICAgIGJhY2t1cFJldGVudGlvbkRheXM6IG51bWJlcjtcclxuICAgIGVuYWJsZUNsb3Vkd2F0Y2hMb2dzOiBib29sZWFuO1xyXG4gICAgZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0czogYm9vbGVhbjtcclxuICAgIFxyXG4gICAgbmFtaW5nOiB7XHJcbiAgICAgIGNsdXN0ZXJOYW1lOiBzdHJpbmc7XHJcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgICBtYXN0ZXJTZWNyZXROYW1lOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8g44K744Kt44Ol44Oq44OG44Kj6Kit5a6aXHJcbiAgc2VjdXJpdHk6IHtcclxuICAgIGVuYWJsZVZwY0Zsb3dMb2dzOiBib29sZWFuO1xyXG4gICAgYWxsb3dlZENpZHJCbG9ja3M6IHN0cmluZ1tdO1xyXG4gICAgZW5hYmxlR3VhcmREdXR5OiBib29sZWFuO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQmVkcm9ja+ioreWumlxyXG4gIGJlZHJvY2s6IHtcclxuICAgIGtub3dsZWRnZUJhc2VOYW1lOiBzdHJpbmc7XHJcbiAgICBkYXRhU291cmNlTmFtZTogc3RyaW5nO1xyXG4gICAgczNCdWNrZXROYW1lOiBzdHJpbmc7XHJcbiAgICBlbWJlZGRpbmdNb2RlbDogc3RyaW5nO1xyXG4gICAgbW9kZWxSZWdpb246IHN0cmluZztcclxuICAgIGltYWdlR2VuZXJhdGlvblJlZ2lvbjogc3RyaW5nO1xyXG4gICAgY2h1bmtpbmdTdHJhdGVneToge1xyXG4gICAgICB0eXBlOiAnSElFUkFSQ0hJQ0FMJztcclxuICAgICAgbWF4UGFyZW50VG9rZW5zOiBudW1iZXI7XHJcbiAgICAgIG1heENoaWxkVG9rZW5zOiBudW1iZXI7XHJcbiAgICAgIG92ZXJsYXBUb2tlbnM6IG51bWJlcjtcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyBEeW5hbW9EQuioreWumlxyXG4gIGR5bmFtb2RiOiB7XHJcbiAgICB0YWJsZU5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIFMz6Kit5a6aXHJcbiAgczM6IHtcclxuICAgIHByb21wdEltYWdlc0J1Y2tldE5hbWU6IHN0cmluZztcclxuICAgIGZyb250QnVja2V0TmFtZTogc3RyaW5nO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQ29nbml0b+ioreWumlxyXG4gIGNvZ25pdG86IHtcclxuICAgIHVzZXJQb29sTmFtZTogc3RyaW5nO1xyXG4gICAgdXNlclBvb2xDbGllbnROYW1lOiBzdHJpbmc7XHJcbiAgfTtcclxuICBcclxuICAvLyBDbG91ZEZyb2506Kit5a6aXHJcbiAgY2xvdWRmcm9udDoge1xyXG4gICAgZGlzdHJpYnV0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgb3JpZ2luQWNjZXNzQ29udHJvbE5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIEFQSSBHYXRld2F56Kit5a6aXHJcbiAgYXBpR2F0ZXdheToge1xyXG4gICAgaHR0cEFwaU5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIExhbWJkYSBGdW5jdGlvbnPoqK3lrppcclxuICBsYW1iZGE6IHtcclxuICAgIHJhZ1Byb21wdEltYWdlc0Z1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgczNJbWFnZXNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIGNvZ25pdG9Qb3N0Q29uZmlybWF0aW9uRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBjb2duaXRvVXNlckVuYWJsZUZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnR2VuZXJhdGVJbWFnZUZ1bmN0aW9uTmFtZTogc3RyaW5nO1xyXG4gICAgcmFnR2V0Q2hhdHNGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHNlYXJjaENoYXRzRnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICByYWdTc2VTdHJlYW1GdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICAgIHJhZ0dldENoYXREZXRhaWxGdW5jdGlvbk5hbWU6IHN0cmluZztcclxuICB9O1xyXG4gIFxyXG4gIC8vIOWFsemAmuOCv+OCsFxyXG4gIHRhZ3M6IHtcclxuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcclxuICB9O1xyXG59XHJcblxyXG4vLyDlhbHpgJrjga7jg4fjg5Xjgqnjg6vjg4joqK3lrppcclxuY29uc3QgY29tbW9uRGVmYXVsdHMgPSB7XHJcbiAgbmV0d29yazoge1xyXG4gICAgdnBjQ2lkcjogJzEwLjAuMC4wLzE2JyxcclxuICAgIGVuYWJsZU5hdEdhdGV3YXk6IGZhbHNlLFxyXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnYXAtbm9ydGhlYXN0LTFhJywgJ2FwLW5vcnRoZWFzdC0xYyddLFxyXG4gICAgY3JlYXRlVnBjRW5kcG9pbnRzOiB0cnVlLFxyXG4gIH0sXHJcbiAgYXVyb3JhOiB7XHJcbiAgICBtYXN0ZXJVc2VybmFtZTogJ2JlZHJvY2thZG1pbicsXHJcbiAgICBtaW5DYXBhY2l0eTogMC41LFxyXG4gICAgbWF4Q2FwYWNpdHk6IDE2LFxyXG4gICAgZW5hYmxlRGF0YUFwaTogdHJ1ZSxcclxuICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZmFsc2UsXHJcbiAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiA3LFxyXG4gICAgZW5hYmxlQ2xvdWR3YXRjaExvZ3M6IHRydWUsXHJcbiAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBmYWxzZSxcclxuICB9LFxyXG4gIHNlY3VyaXR5OiB7XHJcbiAgICBlbmFibGVWcGNGbG93TG9nczogZmFsc2UsXHJcbiAgICBhbGxvd2VkQ2lkckJsb2NrczogWycxMC4wLjAuMC8xNiddLFxyXG4gICAgZW5hYmxlR3VhcmREdXR5OiBmYWxzZSxcclxuICB9LFxyXG4gIGJlZHJvY2s6IHtcclxuICAgIGVtYmVkZGluZ01vZGVsOiAnYW1hem9uLnRpdGFuLWVtYmVkLXRleHQtdjI6MCcsXHJcbiAgICBtb2RlbFJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICBpbWFnZUdlbmVyYXRpb25SZWdpb246ICd1cy1lYXN0LTEnLFxyXG4gICAgY2h1bmtpbmdTdHJhdGVneToge1xyXG4gICAgICB0eXBlOiAnSElFUkFSQ0hJQ0FMJyBhcyBjb25zdCxcclxuICAgICAgbWF4UGFyZW50VG9rZW5zOiAzMDAwLFxyXG4gICAgICBtYXhDaGlsZFRva2VuczogMTAwMCxcclxuICAgICAgb3ZlcmxhcFRva2VuczogNjAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGFnczoge1xyXG4gICAgUHJvamVjdDogJ3JhZ2NoYXQtYXBwJyxcclxuICAgIE1hbmFnZWRCeTogJ2NkaycsXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIOeSsOWig+WIpeOBruODieODoeOCpOODs+ioreWumlxyXG5jb25zdCBkb21haW5Db25maWdzOiBSZWNvcmQ8RW52aXJvbm1lbnQsIHsgZG9tYWluTmFtZTogc3RyaW5nOyBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nIH0gfCB1bmRlZmluZWQ+ID0ge1xyXG4gIGRldjoge1xyXG4gICAgZG9tYWluTmFtZTogJ2Rldi5haS5jcGluZm8uanAnLFxyXG4gICAgY2VydGlmaWNhdGVBcm46ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6Nzk0MDM4MjE5NzA0OmNlcnRpZmljYXRlLzdkMmQwMmUzLWM4MzUtNDkxYS1iNjE2LTUwYjU1ZjczODk0MydcclxuICB9LFxyXG4gIHN0Zzoge1xyXG4gICAgZG9tYWluTmFtZTogJ3N0Zy5haS5jcGluZm8uanAnLCBcclxuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjc5NDAzODIxOTcwNDpjZXJ0aWZpY2F0ZS83ZDJkMDJlMy1jODM1LTQ5MWEtYjYxNi01MGI1NWY3Mzg5NDMnXHJcbiAgfSxcclxuICBwcm9kOiB7XHJcbiAgICBkb21haW5OYW1lOiAnYWkuY3BpbmZvLmpwJyxcclxuICAgIGNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjc5NDAzODIxOTcwNDpjZXJ0aWZpY2F0ZS83ZDJkMDJlMy1jODM1LTQ5MWEtYjYxNi01MGI1NWY3Mzg5NDMnXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOeSsOWig+WIpeOBruioreWumuOCkueUn+aIkOOBmeOCi+mWouaVsFxyXG4gKiBAcGFyYW0gZW52aXJvbm1lbnQgLSDnkrDlooPlkI0gKCdkZXYnIHwgJ3N0ZycgfCAncHJvZCcpXHJcbiAqIEByZXR1cm5zIOeSsOWig+WIpeOBruioreWumuOCquODluOCuOOCp+OCr+ODiFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbmZpZyhlbnZpcm9ubWVudDogRW52aXJvbm1lbnQpOiBFbnZpcm9ubWVudENvbmZpZyB7XHJcbiAgY29uc3QgYmFzZVByZWZpeCA9IGAke2Vudmlyb25tZW50fS1yYWdjaGF0YDtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgXHJcbiAgICAvLyDjg4njg6HjgqTjg7PoqK3lrppcclxuICAgIGRvbWFpbjogZG9tYWluQ29uZmlnc1tlbnZpcm9ubWVudF0sXHJcbiAgICBcclxuICAgIG5ldHdvcms6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMubmV0d29yayxcclxuICAgICAgXHJcbiAgICAgIG5hbWluZzoge1xyXG4gICAgICAgIHZwY05hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXZwY2AsXHJcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LXByaXZhdGUtc3VibmV0YCxcclxuICAgICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNnYCxcclxuICAgICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtbGFtYmRhLXNnYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGF1cm9yYToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5hdXJvcmEsXHJcbiAgICAgIGRhdGFiYXNlTmFtZTogYCR7ZW52aXJvbm1lbnR9X3JhZ2NoYXRfZGJgLFxyXG4gICAgICBcclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgY2x1c3Rlck5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWF1cm9yYS1jbHVzdGVyYCxcclxuICAgICAgICBzdWJuZXRHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRiLXN1Ym5ldC1ncm91cGAsXHJcbiAgICAgICAgbWFzdGVyU2VjcmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNlY3JldGAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZWN1cml0eToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5zZWN1cml0eSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGJlZHJvY2s6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMuYmVkcm9jayxcclxuICAgICAga25vd2xlZGdlQmFzZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtub3dsZWRnZS1iYXNlYCxcclxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRhdGFzb3VyY2VgLFxyXG4gICAgICBzM0J1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtiLXNvdXJjZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBEeW5hbW9EQuioreWumlxyXG4gICAgZHluYW1vZGI6IHtcclxuICAgICAgdGFibGVOYW1lOiBgJHtiYXNlUHJlZml4fS1hcHAtdGFibGVgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gUzPoqK3lrppcclxuICAgIHMzOiB7XHJcbiAgICAgIHByb21wdEltYWdlc0J1Y2tldE5hbWU6IGAke2Jhc2VQcmVmaXh9LXByb21wdC1pbWFnZXNgLFxyXG4gICAgICBmcm9udEJ1Y2tldE5hbWU6IGAke2Jhc2VQcmVmaXh9LWZyb250YCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIENvZ25pdG/oqK3lrppcclxuICAgIGNvZ25pdG86IHtcclxuICAgICAgdXNlclBvb2xOYW1lOiBgJHtiYXNlUHJlZml4fS11c2VyLXBvb2xgLFxyXG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6IGAke2Jhc2VQcmVmaXh9LXVzZXItcG9vbC1jbGllbnRgLFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQ2xvdWRGcm9udOioreWumlxyXG4gICAgY2xvdWRmcm9udDoge1xyXG4gICAgICBkaXN0cmlidXRpb25OYW1lOiBgJHtiYXNlUHJlZml4fSBkaXN0cmlidXRpb25gLFxyXG4gICAgICBvcmlnaW5BY2Nlc3NDb250cm9sTmFtZTogYCR7YmFzZVByZWZpeH0tT0FDYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIEFQSSBHYXRld2F56Kit5a6aXHJcbiAgICBhcGlHYXRld2F5OiB7XHJcbiAgICAgIGh0dHBBcGlOYW1lOiBgJHtiYXNlUHJlZml4fS1odHRwLWFwaWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBMYW1iZGEgRnVuY3Rpb25z6Kit5a6aXHJcbiAgICBsYW1iZGE6IHtcclxuICAgICAgcmFnUHJvbXB0SW1hZ2VzRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1wcm9tcHQtaW1hZ2VzLWZ1bmN0aW9uYCxcclxuICAgICAgczNJbWFnZXNGdW5jdGlvbk5hbWU6IGAke2Jhc2VQcmVmaXh9LXMzLWltYWdlcy1mdW5jdGlvbmAsXHJcbiAgICAgIGNvZ25pdG9Qb3N0Q29uZmlybWF0aW9uRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1jb2duaXRvLXBvc3QtY29uZmlybWF0aW9uLWZ1bmN0aW9uYCxcclxuICAgICAgY29nbml0b1VzZXJFbmFibGVGdW5jdGlvbk5hbWU6IGAke2Jhc2VQcmVmaXh9LWNvZ25pdG8tdXNlci1lbmFibGUtZnVuY3Rpb25gLFxyXG4gICAgICByYWdHZW5lcmF0ZUltYWdlRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1nZW5lcmF0ZS1pbWFnZS1mdW5jdGlvbmAsXHJcbiAgICAgIHJhZ0dldENoYXRzRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1nZXQtY2hhdHMtZnVuY3Rpb25gLFxyXG4gICAgICBzZWFyY2hDaGF0c0Z1bmN0aW9uTmFtZTogYCR7YmFzZVByZWZpeH0tc2VhcmNoLWNoYXRzLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnU3NlU3RyZWFtRnVuY3Rpb25OYW1lOiBgJHtiYXNlUHJlZml4fS1zc2Utc3RyZWFtLWZ1bmN0aW9uYCxcclxuICAgICAgcmFnR2V0Q2hhdERldGFpbEZ1bmN0aW9uTmFtZTogYCR7YmFzZVByZWZpeH0tZ2V0LWNoYXQtZGV0YWlsLWZ1bmN0aW9uYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHRhZ3M6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMudGFncyxcclxuICAgICAgRW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICog55Kw5aKD44KS5qSc6Ki844GX44Gm5Y+W5b6X44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIOeSsOWig+WQjeOBruaWh+Wtl+WIl1xyXG4gKiBAcmV0dXJucyDmpJzoqLzmuIjjgb/jga7nkrDlooPlkI1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZEVudmlyb25tZW50KHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbnZpcm9ubWVudCB7XHJcbiAgY29uc3QgZW52ID0gKHZhbHVlIHx8ICdkZXYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gIFxyXG4gIGlmIChlbnYgIT09ICdkZXYnICYmIGVudiAhPT0gJ3N0ZycgJiYgZW52ICE9PSAncHJvZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBlbnZpcm9ubWVudDogJHtlbnZ9LiBNdXN0IGJlIG9uZSBvZjogZGV2LCBzdGcsIHByb2RgKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGVudiBhcyBFbnZpcm9ubWVudDtcclxufSJdfQ==