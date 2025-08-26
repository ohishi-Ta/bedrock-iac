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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBbUM7O0FBaUhuQyxvQ0E0Q0M7QUFPRCxrREFRQztBQXRHRCxhQUFhO0FBQ2IsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO1FBQ3pELGtCQUFrQixFQUFFLElBQUk7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLGtCQUFrQixFQUFFLEtBQUs7UUFDekIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHlCQUF5QixFQUFFLEtBQUs7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGlCQUFpQixFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ2xDLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLDhCQUE4QjtRQUM5QyxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsY0FBdUI7WUFDN0IsZUFBZSxFQUFFLElBQUk7WUFDckIsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFLEVBQUU7U0FDbEI7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxhQUFhO1FBQ3RCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0NBQ0YsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxTQUFnQixZQUFZLENBQUMsV0FBd0I7SUFDbkQsT0FBTztRQUNMLFdBQVcsRUFBRSxXQUFXO1FBRXhCLE9BQU8sRUFBRTtZQUNQLEdBQUcsY0FBYyxDQUFDLE9BQU87WUFFekIsaUJBQWlCO1lBQ2pCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsR0FBRyxXQUFXLGNBQWM7Z0JBQ3JDLGlCQUFpQixFQUFFLEdBQUcsV0FBVyx5QkFBeUI7Z0JBQzFELHVCQUF1QixFQUFFLEdBQUcsV0FBVyxvQkFBb0I7Z0JBQzNELHVCQUF1QixFQUFFLEdBQUcsV0FBVyxvQkFBb0I7YUFDNUQ7U0FDRjtRQUVELE1BQU0sRUFBRTtZQUNOLEdBQUcsY0FBYyxDQUFDLE1BQU07WUFDeEIsWUFBWSxFQUFFLEdBQUcsV0FBVyxhQUFhO1lBRXpDLGlCQUFpQjtZQUNqQixNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEdBQUcsV0FBVyx5QkFBeUI7Z0JBQ3BELGVBQWUsRUFBRSxHQUFHLFdBQVcsMEJBQTBCO2dCQUN6RCxnQkFBZ0IsRUFBRSxHQUFHLFdBQVcsd0JBQXdCO2FBQ3pEO1NBQ0Y7UUFFRCxRQUFRLEVBQUU7WUFDUixHQUFHLGNBQWMsQ0FBQyxRQUFRO1NBQzNCO1FBRUQsT0FBTyxFQUFFO1lBQ1AsR0FBRyxjQUFjLENBQUMsT0FBTztZQUN6QixpQkFBaUIsRUFBRSxHQUFHLFdBQVcseUJBQXlCO1lBQzFELGNBQWMsRUFBRSxHQUFHLFdBQVcscUJBQXFCO1lBQ25ELFlBQVksRUFBRSxHQUFHLFdBQVcsb0JBQW9CO1NBQ2pEO1FBRUQsSUFBSSxFQUFFO1lBQ0osR0FBRyxjQUFjLENBQUMsSUFBSTtZQUN0QixXQUFXLEVBQUUsV0FBVztTQUN6QjtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLEtBQXlCO0lBQzNELE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTNDLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEVBQUUsQ0FBQztRQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLGtDQUFrQyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELE9BQU8sR0FBa0IsQ0FBQztBQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcudHNcclxuXHJcbmV4cG9ydCB0eXBlIEVudmlyb25tZW50ID0gJ2RldicgfCAnc3RnJyB8ICdwcm9kJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnRDb25maWcge1xyXG4gIGVudmlyb25tZW50OiBFbnZpcm9ubWVudDtcclxuICBcclxuICAvLyDjg43jg4Pjg4jjg6/jg7zjgq/oqK3lrppcclxuICBuZXR3b3JrOiB7XHJcbiAgICB2cGNDaWRyOiBzdHJpbmc7XHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBib29sZWFuO1xyXG4gICAgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdO1xyXG4gICAgY3JlYXRlVnBjRW5kcG9pbnRzOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICAvLyDlkI3liY3oqK3lrppcclxuICAgIG5hbWluZzoge1xyXG4gICAgICB2cGNOYW1lOiBzdHJpbmc7XHJcbiAgICAgIHByaXZhdGVTdWJuZXROYW1lOiBzdHJpbmc7XHJcbiAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXBOYW1lOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQXVyb3Jh6Kit5a6aXHJcbiAgYXVyb3JhOiB7XHJcbiAgICBkYXRhYmFzZU5hbWU6IHN0cmluZztcclxuICAgIG1hc3RlclVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBtaW5DYXBhY2l0eTogbnVtYmVyO1xyXG4gICAgbWF4Q2FwYWNpdHk6IG51bWJlcjtcclxuICAgIGVuYWJsZURhdGFBcGk6IGJvb2xlYW47XHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGJvb2xlYW47XHJcbiAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiBudW1iZXI7XHJcbiAgICBlbmFibGVDbG91ZHdhdGNoTG9nczogYm9vbGVhbjtcclxuICAgIGVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHM6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIC8vIOWQjeWJjeioreWumlxyXG4gICAgbmFtaW5nOiB7XHJcbiAgICAgIGNsdXN0ZXJOYW1lOiBzdHJpbmc7XHJcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogc3RyaW5nO1xyXG4gICAgICBtYXN0ZXJTZWNyZXROYW1lOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLy8g44K744Kt44Ol44Oq44OG44Kj6Kit5a6aXHJcbiAgc2VjdXJpdHk6IHtcclxuICAgIGVuYWJsZVZwY0Zsb3dMb2dzOiBib29sZWFuO1xyXG4gICAgYWxsb3dlZENpZHJCbG9ja3M6IHN0cmluZ1tdO1xyXG4gICAgZW5hYmxlR3VhcmREdXR5OiBib29sZWFuO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQmVkcm9ja+ioreWumlxyXG4gIGJlZHJvY2s6IHtcclxuICAgIGtub3dsZWRnZUJhc2VOYW1lOiBzdHJpbmc7XHJcbiAgICBkYXRhU291cmNlTmFtZTogc3RyaW5nO1xyXG4gICAgczNCdWNrZXROYW1lOiBzdHJpbmc7XHJcbiAgICBlbWJlZGRpbmdNb2RlbDogc3RyaW5nO1xyXG4gICAgY2h1bmtpbmdTdHJhdGVneToge1xyXG4gICAgICB0eXBlOiAnSElFUkFSQ0hJQ0FMJztcclxuICAgICAgbWF4UGFyZW50VG9rZW5zOiBudW1iZXI7XHJcbiAgICAgIG1heENoaWxkVG9rZW5zOiBudW1iZXI7XHJcbiAgICAgIG92ZXJsYXBUb2tlbnM6IG51bWJlcjtcclxuICAgIH07XHJcbiAgfTtcclxuICBcclxuICAvLyDlhbHpgJrjgr/jgrBcclxuICB0YWdzOiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfTtcclxufVxyXG5cclxuLy8g5YWx6YCa44Gu44OH44OV44Kp44Or44OI6Kit5a6aXHJcbmNvbnN0IGNvbW1vbkRlZmF1bHRzID0ge1xyXG4gIG5ldHdvcms6IHtcclxuICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBmYWxzZSxcclxuICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2FwLW5vcnRoZWFzdC0xYScsICdhcC1ub3J0aGVhc3QtMWMnXSxcclxuICAgIGNyZWF0ZVZwY0VuZHBvaW50czogdHJ1ZSxcclxuICB9LFxyXG4gIGF1cm9yYToge1xyXG4gICAgbWFzdGVyVXNlcm5hbWU6ICdiZWRyb2NrYWRtaW4nLFxyXG4gICAgbWluQ2FwYWNpdHk6IDAuNSxcclxuICAgIG1heENhcGFjaXR5OiAxNixcclxuICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxyXG4gICAgYmFja3VwUmV0ZW50aW9uRGF5czogNyxcclxuICAgIGVuYWJsZUNsb3Vkd2F0Y2hMb2dzOiB0cnVlLFxyXG4gICAgZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0czogZmFsc2UsXHJcbiAgfSxcclxuICBzZWN1cml0eToge1xyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGZhbHNlLFxyXG4gICAgYWxsb3dlZENpZHJCbG9ja3M6IFsnMTAuMC4wLjAvMTYnXSxcclxuICAgIGVuYWJsZUd1YXJkRHV0eTogZmFsc2UsXHJcbiAgfSxcclxuICBiZWRyb2NrOiB7XHJcbiAgICBlbWJlZGRpbmdNb2RlbDogJ2FtYXpvbi50aXRhbi1lbWJlZC10ZXh0LXYyOjAnLFxyXG4gICAgY2h1bmtpbmdTdHJhdGVneToge1xyXG4gICAgICB0eXBlOiAnSElFUkFSQ0hJQ0FMJyBhcyBjb25zdCxcclxuICAgICAgbWF4UGFyZW50VG9rZW5zOiAzMDAwLFxyXG4gICAgICBtYXhDaGlsZFRva2VuczogMTAwMCxcclxuICAgICAgb3ZlcmxhcFRva2VuczogNjAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGFnczoge1xyXG4gICAgUHJvamVjdDogJ3JhZ2NoYXQtYXBwJyxcclxuICAgIE1hbmFnZWRCeTogJ2NkaycsXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDnkrDlooPliKXjga7oqK3lrprjgpLnlJ/miJDjgZnjgovplqLmlbBcclxuICogQHBhcmFtIGVudmlyb25tZW50IC0g55Kw5aKD5ZCNICgnZGV2JyB8ICdzdGcnIHwgJ3Byb2QnKVxyXG4gKiBAcmV0dXJucyDnkrDlooPliKXjga7oqK3lrprjgqrjg5bjgrjjgqfjgq/jg4hcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoZW52aXJvbm1lbnQ6IEVudmlyb25tZW50KTogRW52aXJvbm1lbnRDb25maWcge1xyXG4gIHJldHVybiB7XHJcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXHJcbiAgICBcclxuICAgIG5ldHdvcms6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMubmV0d29yayxcclxuICAgICAgXHJcbiAgICAgIC8vIOWRveWQjeOBr+eSsOWig+WkieaVsOOCkuebtOaOpeWfi+OCgei+vOOBv1xyXG4gICAgICBuYW1pbmc6IHtcclxuICAgICAgICB2cGNOYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC12cGNgLFxyXG4gICAgICAgIHByaXZhdGVTdWJuZXROYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1wcml2YXRlLXN1Ym5ldGAsXHJcbiAgICAgICAgYXVyb3JhU2VjdXJpdHlHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWF1cm9yYS1zZ2AsXHJcbiAgICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cE5hbWU6IGAke2Vudmlyb25tZW50fS1yYWdjaGF0LWxhbWJkYS1zZ2AsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBhdXJvcmE6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMuYXVyb3JhLFxyXG4gICAgICBkYXRhYmFzZU5hbWU6IGAke2Vudmlyb25tZW50fV9yYWdjaGF0X2RiYCxcclxuICAgICAgXHJcbiAgICAgIC8vIOWRveWQjeOBr+eSsOWig+WkieaVsOOCkuebtOaOpeWfi+OCgei+vOOBv1xyXG4gICAgICBuYW1pbmc6IHtcclxuICAgICAgICBjbHVzdGVyTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtYXVyb3JhLWNsdXN0ZXJgLFxyXG4gICAgICAgIHN1Ym5ldEdyb3VwTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtZGItc3VibmV0LWdyb3VwYCxcclxuICAgICAgICBtYXN0ZXJTZWNyZXROYW1lOiBgJHtlbnZpcm9ubWVudH0tcmFnY2hhdC1hdXJvcmEtc2VjcmV0YCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNlY3VyaXR5OiB7XHJcbiAgICAgIC4uLmNvbW1vbkRlZmF1bHRzLnNlY3VyaXR5LFxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgYmVkcm9jazoge1xyXG4gICAgICAuLi5jb21tb25EZWZhdWx0cy5iZWRyb2NrLFxyXG4gICAgICBrbm93bGVkZ2VCYXNlTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQta25vd2xlZGdlLWJhc2VgLFxyXG4gICAgICBkYXRhU291cmNlTmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQtZGF0YXNvdXJjZWAsXHJcbiAgICAgIHMzQnVja2V0TmFtZTogYCR7ZW52aXJvbm1lbnR9LXJhZ2NoYXQta2Itc291cmNlYCxcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHRhZ3M6IHtcclxuICAgICAgLi4uY29tbW9uRGVmYXVsdHMudGFncyxcclxuICAgICAgRW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICog55Kw5aKD44KS5qSc6Ki844GX44Gm5Y+W5b6X44GZ44KL6Zai5pWwXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIOeSsOWig+WQjeOBruaWh+Wtl+WIl1xyXG4gKiBAcmV0dXJucyDmpJzoqLzmuIjjgb/jga7nkrDlooPlkI1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZEVudmlyb25tZW50KHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBFbnZpcm9ubWVudCB7XHJcbiAgY29uc3QgZW52ID0gKHZhbHVlIHx8ICdkZXYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gIFxyXG4gIGlmIChlbnYgIT09ICdkZXYnICYmIGVudiAhPT0gJ3N0ZycgJiYgZW52ICE9PSAncHJvZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBlbnZpcm9ubWVudDogJHtlbnZ9LiBNdXN0IGJlIG9uZSBvZjogZGV2LCBzdGcsIHByb2RgKTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIGVudiBhcyBFbnZpcm9ubWVudDtcclxufSJdfQ==