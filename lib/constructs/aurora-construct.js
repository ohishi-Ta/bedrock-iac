"use strict";
// lib/constructs/aurora-construct.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraConstruct = void 0;
const rds = __importStar(require("aws-cdk-lib/aws-rds"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const secretsmanager = __importStar(require("aws-cdk-lib/aws-secretsmanager"));
const constructs_1 = require("constructs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class AuroraConstruct extends constructs_1.Construct {
    cluster;
    masterSecret;
    appUserSecret;
    subnetGroup;
    constructor(scope, id, props) {
        super(scope, id);
        const { vpc, securityGroup, config } = props;
        // サブネットグループ作成
        this.subnetGroup = new rds.SubnetGroup(this, config.aurora.naming.subnetGroupName, {
            description: 'Aurora Serverless v2 subnet group',
            vpc: vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        });
        // マスターユーザー用シークレット
        const masterSecret = new secretsmanager.Secret(this, config.aurora.naming.masterSecretName, {
            description: 'Aurora master user credentials',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: config.aurora.masterUsername
                }),
                generateStringKey: 'password',
                excludeCharacters: '"@\\\'/',
                passwordLength: 32,
            },
        });
        this.masterSecret = masterSecret;
        // Auroraクラスター作成
        this.cluster = new rds.DatabaseCluster(this, config.aurora.naming.clusterName, {
            // エンジン設定
            engine: rds.DatabaseClusterEngine.auroraPostgres({
                version: rds.AuroraPostgresEngineVersion.VER_16_6,
            }),
            // 認証情報
            credentials: rds.Credentials.fromSecret(masterSecret),
            // デフォルトデータベース
            defaultDatabaseName: config.aurora.databaseName,
            // ネットワーク設定
            vpc: vpc,
            securityGroups: [securityGroup],
            subnetGroup: this.subnetGroup,
            // Serverless v2設定
            serverlessV2MinCapacity: config.aurora.minCapacity,
            serverlessV2MaxCapacity: config.aurora.maxCapacity,
            // インスタンス設定
            writer: rds.ClusterInstance.serverlessV2('writer', {
                publiclyAccessible: false,
                enablePerformanceInsights: config.aurora.enablePerformanceInsights,
            }),
            // データAPI有効化
            enableDataApi: config.aurora.enableDataApi,
            // バックアップ設定
            backup: {
                retention: aws_cdk_lib_1.Duration.days(config.aurora.backupRetentionDays),
                preferredWindow: '03:00-04:00', // JST 12:00-13:00
            },
            // メンテナンス設定
            preferredMaintenanceWindow: 'sun:04:00-sun:05:00', // JST日曜13:00-14:00
            // CloudWatchログ
            cloudwatchLogsExports: config.aurora.enableCloudwatchLogs
                ? ['postgresql']
                : undefined,
            // 削除保護
            deletionProtection: config.aurora.deletionProtection,
            // 削除時の動作（開発環境では自動削除）
            removalPolicy: config.environment === 'dev'
                ? aws_cdk_lib_1.RemovalPolicy.DESTROY
                : aws_cdk_lib_1.RemovalPolicy.SNAPSHOT,
        });
        // アプリケーション用ユーザーのシークレット
        this.appUserSecret = new secretsmanager.Secret(this, config.aurora.naming.appUserSecretName, {
            description: 'Aurora application user credentials',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({
                    username: 'bedrock_user'
                }),
                generateStringKey: 'password',
                excludeCharacters: '"@\\\'/',
                passwordLength: 32,
            },
        });
        // カスタムタグ設定
        this.applyTags(config.tags);
    }
    applyTags(tags) {
        Object.entries(tags).forEach(([key, value]) => {
            this.cluster.node.addMetadata(key, value);
        });
    }
}
exports.AuroraConstruct = AuroraConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVyb3JhLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1cm9yYS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFDQUFxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFckMseURBQTJDO0FBQzNDLHlEQUEyQztBQUMzQywrRUFBaUU7QUFDakUsMkNBQXVDO0FBQ3ZDLDZDQUFzRDtBQVN0RCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUFDNUIsT0FBTyxDQUFzQjtJQUM3QixZQUFZLENBQXlCO0lBQ3JDLGFBQWEsQ0FBd0I7SUFDckMsV0FBVyxDQUFrQjtJQUU3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTJCO1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRTdDLGNBQWM7UUFDZCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO1lBQ2pGLFdBQVcsRUFBRSxtQ0FBbUM7WUFDaEQsR0FBRyxFQUFFLEdBQUc7WUFDUixVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsa0JBQWtCO1FBQ2xCLE1BQU0sWUFBWSxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUYsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxvQkFBb0IsRUFBRTtnQkFDcEIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDbkMsUUFBUSxFQUFFLE1BQU0s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TyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQS9HRCwwQ0ErR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uc3RydWN0cy9hdXJvcmEtY29uc3RydWN0LnRzXHJcblxyXG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IER1cmF0aW9uLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBFbnZpcm9ubWVudENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXJvcmFDb25zdHJ1Y3RQcm9wcyB7XHJcbiAgdnBjOiBlYzIuSVZwYztcclxuICBzZWN1cml0eUdyb3VwOiBlYzIuSVNlY3VyaXR5R3JvdXA7XHJcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEF1cm9yYUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXI6IHJkcy5EYXRhYmFzZUNsdXN0ZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1hc3RlclNlY3JldDogc2VjcmV0c21hbmFnZXIuSVNlY3JldDtcclxuICBwdWJsaWMgcmVhZG9ubHkgYXBwVXNlclNlY3JldDogc2VjcmV0c21hbmFnZXIuU2VjcmV0O1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXRHcm91cDogcmRzLlN1Ym5ldEdyb3VwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXVyb3JhQ29uc3RydWN0UHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgY29uc3QgeyB2cGMsIHNlY3VyaXR5R3JvdXAsIGNvbmZpZyB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8g44K144OW44ON44OD44OI44Kw44Or44O844OX5L2c5oiQXHJcbiAgICB0aGlzLnN1Ym5ldEdyb3VwID0gbmV3IHJkcy5TdWJuZXRHcm91cCh0aGlzLCBjb25maWcuYXVyb3JhLm5hbWluZy5zdWJuZXRHcm91cE5hbWUsIHtcclxuICAgICAgZGVzY3JpcHRpb246ICdBdXJvcmEgU2VydmVybGVzcyB2MiBzdWJuZXQgZ3JvdXAnLFxyXG4gICAgICB2cGM6IHZwYyxcclxuICAgICAgdnBjU3VibmV0czoge1xyXG4gICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjg57jgrnjgr/jg7zjg6bjg7zjgrbjg7znlKjjgrfjg7zjgq/jg6zjg4Pjg4hcclxuICAgIGNvbnN0IG1hc3RlclNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgY29uZmlnLmF1cm9yYS5uYW1pbmcubWFzdGVyU2VjcmV0TmFtZSwge1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBtYXN0ZXIgdXNlciBjcmVkZW50aWFscycsXHJcbiAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XHJcbiAgICAgICAgc2VjcmV0U3RyaW5nVGVtcGxhdGU6IEpTT04uc3RyaW5naWZ5KHsgXHJcbiAgICAgICAgICB1c2VybmFtZTogY29uZmlnLmF1cm9yYS5tYXN0ZXJVc2VybmFtZSBcclxuICAgICAgICB9KSxcclxuICAgICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ3Bhc3N3b3JkJyxcclxuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJ1wiQFxcXFxcXCcvJyxcclxuICAgICAgICBwYXNzd29yZExlbmd0aDogMzIsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hc3RlclNlY3JldCA9IG1hc3RlclNlY3JldDtcclxuXHJcbiAgICAvLyBBdXJvcmHjgq/jg6njgrnjgr/jg7zkvZzmiJBcclxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyByZHMuRGF0YWJhc2VDbHVzdGVyKHRoaXMsIGNvbmZpZy5hdXJvcmEubmFtaW5nLmNsdXN0ZXJOYW1lLCB7XHJcbiAgICAgIC8vIOOCqOODs+OCuOODs+ioreWumlxyXG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuYXVyb3JhUG9zdGdyZXMoe1xyXG4gICAgICAgIHZlcnNpb246IHJkcy5BdXJvcmFQb3N0Z3Jlc0VuZ2luZVZlcnNpb24uVkVSXzE2XzYsXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8g6KqN6Ki85oOF5aCxXHJcbiAgICAgIGNyZWRlbnRpYWxzOiByZHMuQ3JlZGVudGlhbHMuZnJvbVNlY3JldChtYXN0ZXJTZWNyZXQpLFxyXG4gICAgICBcclxuICAgICAgLy8g44OH44OV44Kp44Or44OI44OH44O844K/44OZ44O844K5XHJcbiAgICAgIGRlZmF1bHREYXRhYmFzZU5hbWU6IGNvbmZpZy5hdXJvcmEuZGF0YWJhc2VOYW1lLFxyXG5cclxuICAgICAgLy8g44ON44OD44OI44Ov44O844Kv6Kit5a6aXHJcbiAgICAgIHZwYzogdnBjLFxyXG4gICAgICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXBdLFxyXG4gICAgICBzdWJuZXRHcm91cDogdGhpcy5zdWJuZXRHcm91cCxcclxuXHJcbiAgICAgIC8vIFNlcnZlcmxlc3MgdjLoqK3lrppcclxuICAgICAgc2VydmVybGVzc1YyTWluQ2FwYWNpdHk6IGNvbmZpZy5hdXJvcmEubWluQ2FwYWNpdHksXHJcbiAgICAgIHNlcnZlcmxlc3NWMk1heENhcGFjaXR5OiBjb25maWcuYXVyb3JhLm1heENhcGFjaXR5LFxyXG5cclxuICAgICAgLy8g44Kk44Oz44K544K/44Oz44K56Kit5a6aXHJcbiAgICAgIHdyaXRlcjogcmRzLkNsdXN0ZXJJbnN0YW5jZS5zZXJ2ZXJsZXNzVjIoJ3dyaXRlcicsIHtcclxuICAgICAgICBwdWJsaWNseUFjY2Vzc2libGU6IGZhbHNlLFxyXG4gICAgICAgIGVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHM6IGNvbmZpZy5hdXJvcmEuZW5hYmxlUGVyZm9ybWFuY2VJbnNpZ2h0cyxcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyDjg4fjg7zjgr9BUEnmnInlirnljJZcclxuICAgICAgZW5hYmxlRGF0YUFwaTogY29uZmlnLmF1cm9yYS5lbmFibGVEYXRhQXBpLFxyXG5cclxuICAgICAgLy8g44OQ44OD44Kv44Ki44OD44OX6Kit5a6aXHJcbiAgICAgIGJhY2t1cDoge1xyXG4gICAgICAgIHJldGVudGlvbjogRHVyYXRpb24uZGF5cyhjb25maWcuYXVyb3JhLmJhY2t1cFJldGVudGlvbkRheXMpLFxyXG4gICAgICAgIHByZWZlcnJlZFdpbmRvdzogJzAzOjAwLTA0OjAwJywgLy8gSlNUIDEyOjAwLTEzOjAwXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyDjg6Hjg7Pjg4bjg4rjg7PjgrnoqK3lrppcclxuICAgICAgcHJlZmVycmVkTWFpbnRlbmFuY2VXaW5kb3c6ICdzdW46MDQ6MDAtc3VuOjA1OjAwJywgLy8gSlNU5pel5pucMTM6MDAtMTQ6MDBcclxuXHJcbiAgICAgIC8vIENsb3VkV2F0Y2jjg63jgrBcclxuICAgICAgY2xvdWR3YXRjaExvZ3NFeHBvcnRzOiBjb25maWcuYXVyb3JhLmVuYWJsZUNsb3Vkd2F0Y2hMb2dzIFxyXG4gICAgICAgID8gWydwb3N0Z3Jlc3FsJ10gXHJcbiAgICAgICAgOiB1bmRlZmluZWQsXHJcblxyXG4gICAgICAvLyDliYrpmaTkv53orbdcclxuICAgICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBjb25maWcuYXVyb3JhLmRlbGV0aW9uUHJvdGVjdGlvbixcclxuXHJcbiAgICAgIC8vIOWJiumZpOaZguOBruWLleS9nO+8iOmWi+eZuueSsOWig+OBp+OBr+iHquWLleWJiumZpO+8iVxyXG4gICAgICByZW1vdmFsUG9saWN5OiBjb25maWcuZW52aXJvbm1lbnQgPT09ICdkZXYnIFxyXG4gICAgICAgID8gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZIFxyXG4gICAgICAgIDogUmVtb3ZhbFBvbGljeS5TTkFQU0hPVCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOOCouODl+ODquOCseODvOOCt+ODp+ODs+eUqOODpuODvOOCtuODvOOBruOCt+ODvOOCr+ODrOODg+ODiFxyXG4gICAgdGhpcy5hcHBVc2VyU2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCBjb25maWcuYXVyb3JhLm5hbWluZy5hcHBVc2VyU2VjcmV0TmFtZSwge1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBhcHBsaWNhdGlvbiB1c2VyIGNyZWRlbnRpYWxzJyxcclxuICAgICAgZ2VuZXJhdGVTZWNyZXRTdHJpbmc6IHtcclxuICAgICAgICBzZWNyZXRTdHJpbmdUZW1wbGF0ZTogSlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgIHVzZXJuYW1lOiAnYmVkcm9ja191c2VyJyBcclxuICAgICAgICB9KSxcclxuICAgICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ3Bhc3N3b3JkJyxcclxuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJ1wiQFxcXFxcXCcvJyxcclxuICAgICAgICBwYXNzd29yZExlbmd0aDogMzIsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjgqvjgrnjgr/jg6Djgr/jgrDoqK3lrppcclxuICAgIHRoaXMuYXBwbHlUYWdzKGNvbmZpZy50YWdzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlUYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICB0aGlzLmNsdXN0ZXIubm9kZS5hZGRNZXRhZGF0YShrZXksIHZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==