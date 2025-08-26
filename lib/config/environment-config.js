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
        createVpcEndpoints: false,
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
        availabilityZones: ['ap-northeast-1a'],
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
/**
 * 環境別の設定を生成する関数
 * @param environment - 環境名 ('dev' | 'stg' | 'prod')
 * @returns 環境別の設定オブジェクト
 */
function createConfig(environment) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBb0huQyxvQ0E2Q0M7QUFPRCxrREFRQztBQXhHRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLEtBQUs7S0FDMUI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7UUFDaEMsaUJBQWlCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztLQUN2QztJQUNELFFBQVEsRUFBRTtRQUNSLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsaUJBQWlCLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFDbEMsZUFBZSxFQUFFLEtBQUs7S0FDdkI7SUFDRCxPQUFPLEVBQUU7UUFDUCxjQUFjLEVBQUUsOEJBQThCO1FBQzlDLGdCQUFnQixFQUFFO1lBQ2hCLElBQUksRUFBRSxjQUF1QjtZQUM3QixlQUFlLEVBQUUsSUFBSTtZQUNyQixjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsRUFBRTtTQUNsQjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLGFBQWE7UUFDdEIsU0FBUyxFQUFFLEtBQUs7S0FDakI7Q0FDRixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILFNBQWdCLFlBQVksQ0FBQyxXQUF3QjtJQUNuRCxPQUFPO1FBQ0wsV0FBVyxFQUFFLFdBQVc7UUFFeEIsT0FBTyxFQUFFO1lBQ1AsR0FBRyxjQUFjLENBQUMsT0FBTztZQUV6QixpQkFBaUI7WUFDakIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxHQUFHLFdBQVcsY0FBYztnQkFDckMsZ0JBQWdCLEVBQUUsR0FBRyxXQUFXLHdCQUF3QjtnQkFDeEQsaUJBQWlCLEVBQUUsR0FBRyxXQUFXLHlCQUF5QjtnQkFDMUQsdUJBQXVCLEVBQUUsR0FBRyxXQUFXLG9CQUFvQjtnQkFDM0QsdUJBQXVCLEVBQUUsR0FBRyxXQUFXLG9CQUFvQjthQUM1RDtTQUNGO1FBRUQsTUFBTSxFQUFFO1lBQ04sR0FBRyxjQUFjLENBQUMsTUFBTTtZQUN4QixZQUFZLEVBQUUsR0FBRyxXQUFXLGFBQWE7WUFFekMsaUJBQWlCO1lBQ2pCLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsR0FBRyxXQUFXLHlCQUF5QjtnQkFDcEQsZUFBZSxFQUFFLEdBQUcsV0FBVywwQkFBMEI7Z0JBQ3pELGdCQUFnQixFQUFFLEdBQUcsV0FBVyx3QkFBd0I7YUFDekQ7U0FDRjtRQUVELFFBQVEsRUFBRTtZQUNSLEdBQUcsY0FBYyxDQUFDLFFBQVE7U0FDM0I7UUFFRCxPQUFPLEVBQUU7WUFDUCxHQUFHLGNBQWMsQ0FBQyxPQUFPO1lBQ3pCLGlCQUFpQixFQUFFLEdBQUcsV0FBVyx5QkFBeUI7WUFDMUQsY0FBYyxFQUFFLEdBQUcsV0FBVyxxQkFBcUI7WUFDbkQsWUFBWSxFQUFFLEdBQUcsV0FBVyxvQkFBb0I7U0FDakQ7UUFFRCxJQUFJLEVBQUU7WUFDSixHQUFHLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLFdBQVcsRUFBRSxXQUFXO1NBQ3pCO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsS0FBeUI7SUFDM0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFM0MsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsa0NBQWtDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsT0FBTyxHQUFrQixDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZy50c1xyXG5cclxuZXhwb3J0IHR5cGUgRW52aXJvbm1lbnQgPSAnZGV2JyB8ICdzdGcnIHwgJ3Byb2QnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm9ubWVudENvbmZpZyB7XHJcbiAgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50O1xyXG4gIFxyXG4gIC8vIOODjeODg+ODiOODr+ODvOOCr+ioreWumlxyXG4gIG5ldHdvcms6IHtcclxuICAgIHZwY0NpZHI6IHN0cmluZztcclxuICAgIGVuYWJsZU5hdEdhdGV3YXk6IGJvb2xlYW47XHJcbiAgICBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XHJcbiAgICBjcmVhdGVWcGNFbmRwb2ludHM6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIC8vIOWQjeWJjeioreWumlxyXG4gICAgbmFtaW5nOiB7XHJcbiAgICAgIHZwY05hbWU6IHN0cmluZztcclxuICAgICAgcHVibGljU3VibmV0TmFtZTogc3RyaW5nO1xyXG4gICAgICBwcml2YXRlU3VibmV0TmFtZTogc3RyaW5nO1xyXG4gICAgICBhdXJvcmFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgICBsYW1iZGFTZWN1cml0eUdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEF1cm9yYeioreWumlxyXG4gIGF1cm9yYToge1xyXG4gICAgZGF0YWJhc2VOYW1lOiBzdHJpbmc7XHJcbiAgICBtYXN0ZXJVc2VybmFtZTogc3RyaW5nO1xyXG4gICAgbWluQ2FwYWNpdHk6IG51bWJlcjtcclxuICAgIG1heENhcGFjaXR5OiBudW1iZXI7XHJcbiAgICBlbmFibGVEYXRhQXBpOiBib29sZWFuO1xyXG4gICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBib29sZWFuO1xyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogbnVtYmVyO1xyXG4gICAgZW5hYmxlQ2xvdWR3YXRjaExvZ3M6IGJvb2xlYW47XHJcbiAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBib29sZWFuO1xyXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdO1xyXG4gICAgXHJcbiAgICAvLyDlkI3liY3oqK3lrppcclxuICAgIG5hbWluZzoge1xyXG4gICAgICBjbHVzdGVyTmFtZTogc3RyaW5nO1xyXG4gICAgICBzdWJuZXRHcm91cE5hbWU6IHN0cmluZztcclxuICAgICAgbWFzdGVyU2VjcmV0TmFtZTogc3RyaW5nO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIOOCu+OCreODpeODquODhuOCo+ioreWumlxyXG4gIHNlY3VyaXR5OiB7XHJcbiAgICBlbmFibGVWcGNGbG93TG9nczogYm9vbGVhbjtcclxuICAgIGFsbG93ZWRDaWRyQmxvY2tzOiBzdHJpbmdbXTtcclxuICAgIGVuYWJsZUd1YXJkRHV0eTogYm9vbGVhbjtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEJlZHJvY2voqK3lrppcclxuICBiZWRyb2NrOiB7XHJcbiAgICBrbm93bGVkZ2VCYXNlTmFtZTogc3RyaW5nO1xyXG4gICAgZGF0YVNvdXJjZU5hbWU6IHN0cmluZztcclxuICAgIHMzQnVja2V0TmFtZTogc3RyaW5nO1xyXG4gICAgZW1iZWRkaW5nTW9kZWw6IHN0cmluZztcclxuICAgIGNodW5raW5nU3RyYXRlZ3k6IHtcclxuICAgICAgdHlwZTogJ0hJRVJBUkNISUNBTCc7XHJcbiAgICAgIG1heFBhcmVudFRva2VuczogbnVtYmVyO1xyXG4gICAgICBtYXhDaGlsZFRva2VuczogbnVtYmVyO1xyXG4gICAgICBvdmVybGFwVG9rZW5zOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8g5YWx6YCa44K/44KwXHJcbiAgdGFnczoge1xyXG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xyXG4gIH07XHJcbn1cclxuXHJcbi8vIOWFsemAmuOBruODh+ODleOCqeODq+ODiOioreWumlxyXG5jb25zdCBjb21tb25EZWZhdWx0cyA9IHtcclxuICBuZXR3b3JrOiB7XHJcbiAgICB2cGNDaWRyOiAnMTAuMC4wLjAvMTYnLFxyXG4gICAgZW5hYmxlTmF0R2F0ZXdheTogZmFsc2UsXHJcbiAgICBhdmFpbGFiaWxpdHlab25lczogWydhcC1ub3J0aGVhc3QtMWEnLCAnYXAtbm9ydGhlYXN0LTFjJ10sXHJcbiAgICBjcmVhdGVWcGNFbmRwb2ludHM6IGZhbHNlLFxyXG4gIH0sXHJcbiAgYXVyb3JhOiB7XHJcbiAgICBtYXN0ZXJVc2VybmFtZTogJ2JlZHJvY2thZG1pbicsXHJcbiAgICBtaW5DYXBhY2l0eTogMC41LFxyXG4gICAgbWF4Q2FwYWNpdHk6IDE2LFxyXG4gICAgZW5hYmxlRGF0YUFwaTogdHJ1ZSxcclxuICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogZmFsc2UsXHJcbiAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiA3LFxyXG4gICAgZW5hYmxlQ2xvdWR3YXRjaExvZ3M6IHRydWUsXHJcbiAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBmYWxzZSxcclxuICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2FwLW5vcnRoZWFzdC0xYSddLFxyXG4gIH0sXHJcbiAgc2VjdXJpdHk6IHtcclxuICAgIGVuYWJsZVZwY0Zsb3dMb2dzOiBmYWxzZSxcclxuICAgIGFsbG93ZWRDaWRyQmxvY2tzOiBbJzEwLjAuMC4wLzE2J10sXHJcbiAgICBlbmFibGVHdWFyZER1dHk6IGZhbHNlLFxyXG4gIH0sXHJcbiAgYmVkcm9jazoge1xyXG4gICAgZW1iZWRkaW5nTW9kZWw6ICdhbWF6b24udGl0YW4tZW1iZWQtdGV4dC12MjowJyxcclxuICAgIGNodW5raW5nU3RyYXRlZ3k6IHtcclxuICAgICAgdHlwZTogJ0hJRVJBUkNISUNBTCcgYXMgY29uc3QsXHJcbiAgICAgIG1heFBhcmVudFRva2VuczogMzAwMCxcclxuICAgICAgbWF4Q2hpbGRUb2tlbnM6IDEwMDAsXHJcbiAgICAgIG92ZXJsYXBUb2tlbnM6IDYwLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHRhZ3M6IHtcclxuICAgIFByb2plY3Q6ICdyYWdjaGF0LWFwcCcsXHJcbiAgICBNYW5hZ2VkQnk6ICdjZGsnLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vKipcclxuICog55Kw5aKD5Yil44Gu6Kit5a6a44KS55Sf5oiQ44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSBlbnZpcm9ubWVudCAtIOeSsOWig+WQjSAoJ2RldicgfCAnc3RnJyB8ICdwcm9kJylcclxuICogQHJldHVybnMg55Kw5aKD5Yil44Gu6Kit5a6a44Kq44OW44K444Kn44Kv44OIXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZmlnKGVudmlyb25tZW50OiBFbnZpcm9ubWVudCk6IEVudmlyb25tZW50Q29uZmlnIHtcclxuICByZXR1cm4ge1xyXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgXHJcbiAgICBuZXR3b3JrOiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLm5ldHdvcmssXHJcbiAgICAgIFxyXG4gICAgICAvLyDlkb3lkI3jga/nkrDlooPlpInmlbDjgpLnm7TmjqXln4vjgoHovrzjgb9cclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgdnBjTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtdnBjYCxcclxuICAgICAgICBwdWJsaWNTdWJuZXROYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1wdWJsaWMtc3VibmV0YCxcclxuICAgICAgICBwcml2YXRlU3VibmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtcHJpdmF0ZS1zdWJuZXRgLFxyXG4gICAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1hdXJvcmEtc2dgLFxyXG4gICAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXBOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1sYW1iZGEtc2dgLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgYXVyb3JhOiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLmF1cm9yYSxcclxuICAgICAgZGF0YWJhc2VOYW1lOiBgJHtlbnZpcm9ubWVudH1fcmFnY2hhdF9kYmAsXHJcbiAgICAgIFxyXG4gICAgICAvLyDlkb3lkI3jga/nkrDlooPlpInmlbDjgpLnm7TmjqXln4vjgoHovrzjgb9cclxuICAgICAgbmFtaW5nOiB7XHJcbiAgICAgICAgY2x1c3Rlck5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWF1cm9yYS1jbHVzdGVyYCxcclxuICAgICAgICBzdWJuZXRHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRiLXN1Ym5ldC1ncm91cGAsXHJcbiAgICAgICAgbWFzdGVyU2VjcmV0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLXNlY3JldGAsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZWN1cml0eToge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5zZWN1cml0eSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGJlZHJvY2s6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMuYmVkcm9jayxcclxuICAgICAga25vd2xlZGdlQmFzZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtub3dsZWRnZS1iYXNlYCxcclxuICAgICAgZGF0YVNvdXJjZU5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWRhdGFzb3VyY2VgLFxyXG4gICAgICBzM0J1Y2tldE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWtiLXNvdXJjZWAsXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB0YWdzOiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLnRhZ3MsXHJcbiAgICAgIEVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOeSsOWig+OCkuaknOiovOOBl+OBpuWPluW+l+OBmeOCi+mWouaVsFxyXG4gKiBAcGFyYW0gdmFsdWUgLSDnkrDlooPlkI3jga7mloflrZfliJdcclxuICogQHJldHVybnMg5qSc6Ki85riI44G/44Gu55Kw5aKD5ZCNXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRFbnZpcm9ubWVudCh2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogRW52aXJvbm1lbnQge1xyXG4gIGNvbnN0IGVudiA9ICh2YWx1ZSB8fCAnZGV2JykudG9Mb3dlckNhc2UoKTtcclxuICBcclxuICBpZiAoZW52ICE9PSAnZGV2JyAmJiBlbnYgIT09ICdzdGcnICYmIGVudiAhPT0gJ3Byb2QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZW52aXJvbm1lbnQ6ICR7ZW52fS4gTXVzdCBiZSBvbmUgb2Y6IGRldiwgc3RnLCBwcm9kYCk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBlbnYgYXMgRW52aXJvbm1lbnQ7XHJcbn0iXX0=