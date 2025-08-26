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
    subnetGroup;
    constructor(scope, id, props) {
        super(scope, id);
        const { vpc, securityGroup, config } = props;
        // サブネットグループ作成
        this.subnetGroup = new rds.SubnetGroup(this, 'SubnetGroup', {
            subnetGroupName: config.aurora.naming.subnetGroupName,
            description: 'Aurora Serverless v2 subnet group',
            vpc: vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        });
        // マスターユーザー用シークレット
        const masterSecret = new secretsmanager.Secret(this, 'MasterSecret', {
            secretName: config.aurora.naming.masterSecretName,
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
        this.cluster = new rds.DatabaseCluster(this, 'Cluster', {
            clusterIdentifier: config.aurora.naming.clusterName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVyb3JhLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1cm9yYS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFDQUFxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFckMseURBQTJDO0FBQzNDLHlEQUEyQztBQUMzQywrRUFBaUU7QUFDakUsMkNBQXVDO0FBQ3ZDLDZDQUFzRDtBQVN0RCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUFDNUIsT0FBTyxDQUFzQjtJQUM3QixZQUFZLENBQXlCO0lBQ3JDLFdBQVcsQ0FBa0I7SUFFN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUU3QyxjQUFjO1FBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMxRCxlQUFlLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZTtZQUNyRCxXQUFXLEVBQUUsbUNBQW1DO1lBQ2hELEdBQUcsRUFBRSxHQUFHO1lBQ1IsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILGtCQUFrQjtRQUNsQixNQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNuRSxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCO1lBQ2pELFdBQVcsRUFBRSxnQ0FBZ0M7WUFDN0Msb0JBQW9CLEVBQUU7Z0JBQ3BCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWM7aUJBQ3ZDLENBQUM7Z0JBQ0YsaUJBQWlCLEVBQUUsVUFBVTtnQkFDN0IsaUJBQWlCLEVBQUUsU0FBUztnQkFDNUIsY0FBYyxFQUFFLEVBQUU7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUVqQyxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN0RCxpQkFBaUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1lBRW5ELFNBQVM7WUFDVCxNQUFNLEVBQUUsR0FBRyxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQztnQkFDL0MsT0FBTyxFQUFFLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxRQUFRO2FBQ2xELENBQUM7WUFFRixPQUFPO1lBQ1AsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUVyRCxjQUFjO1lBQ2QsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZO1lBRS9DLFdBQVc7WUFDWCxHQUFHLEVBQUUsR0FBRztZQUNSLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUMvQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFFN0Isa0JBQWtCO1lBQ2xCLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNsRCx1QkFBdUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFFbEQsV0FBVztZQUNYLE1BQU0sRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pELGtCQUFrQixFQUFFLEtBQUs7Z0JBQ3pCLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMseUJBQXlCO2FBQ25FLENBQUM7WUFFRixZQUFZO1lBQ1osYUFBYSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYTtZQUUxQyxXQUFXO1lBQ1gsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxzQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO2dCQUMzRCxlQUFlLEVBQUUsYUFBYSxFQUFFLGtCQUFrQjthQUNuRDtZQUVELFdBQVc7WUFDWCwwQkFBMEIsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUI7WUFFdEUsZUFBZTtZQUNmLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQW9CO2dCQUN2RCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxTQUFTO1lBRWIsT0FBTztZQUNQLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCO1lBRXBELHFCQUFxQjtZQUNyQixhQUFhLEVBQUUsTUFBTSxDQUFDLFdBQVcsS0FBSyxLQUFLO2dCQUN6QyxDQUFDLENBQUMsMkJBQWEsQ0FBQyxPQUFPO2dCQUN2QixDQUFDLENBQUMsMkJBQWEsQ0FBQyxRQUFRO1NBQzNCLENBQUMsQ0FBQztRQUVILFdBQVc7UUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU8sU0FBUyxDQUFDLElBQStCO1FBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBckdELDBDQXFHQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9jb25zdHJ1Y3RzL2F1cm9yYS1jb25zdHJ1Y3QudHNcclxuXHJcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcclxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xyXG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VjcmV0c21hbmFnZXInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgRHVyYXRpb24sIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF1cm9yYUNvbnN0cnVjdFByb3BzIHtcclxuICB2cGM6IGVjMi5JVnBjO1xyXG4gIHNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcclxuICBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXVyb3JhQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlcjogcmRzLkRhdGFiYXNlQ2x1c3RlcjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbWFzdGVyU2VjcmV0OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xyXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXRHcm91cDogcmRzLlN1Ym5ldEdyb3VwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXVyb3JhQ29uc3RydWN0UHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgY29uc3QgeyB2cGMsIHNlY3VyaXR5R3JvdXAsIGNvbmZpZyB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8g44K144OW44ON44OD44OI44Kw44Or44O844OX5L2c5oiQXHJcbiAgICB0aGlzLnN1Ym5ldEdyb3VwID0gbmV3IHJkcy5TdWJuZXRHcm91cCh0aGlzLCAnU3VibmV0R3JvdXAnLCB7XHJcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogY29uZmlnLmF1cm9yYS5uYW1pbmcuc3VibmV0R3JvdXBOYW1lLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBTZXJ2ZXJsZXNzIHYyIHN1Ym5ldCBncm91cCcsXHJcbiAgICAgIHZwYzogdnBjLFxyXG4gICAgICB2cGNTdWJuZXRzOiB7XHJcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOODnuOCueOCv+ODvOODpuODvOOCtuODvOeUqOOCt+ODvOOCr+ODrOODg+ODiFxyXG4gICAgY29uc3QgbWFzdGVyU2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCAnTWFzdGVyU2VjcmV0Jywge1xyXG4gICAgICBzZWNyZXROYW1lOiBjb25maWcuYXVyb3JhLm5hbWluZy5tYXN0ZXJTZWNyZXROYW1lLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBtYXN0ZXIgdXNlciBjcmVkZW50aWFscycsXHJcbiAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XHJcbiAgICAgICAgc2VjcmV0U3RyaW5nVGVtcGxhdGU6IEpTT04uc3RyaW5naWZ5KHsgXHJcbiAgICAgICAgICB1c2VybmFtZTogY29uZmlnLmF1cm9yYS5tYXN0ZXJVc2VybmFtZSBcclxuICAgICAgICB9KSxcclxuICAgICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ3Bhc3N3b3JkJyxcclxuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJ1wiQFxcXFxcXCcvJyxcclxuICAgICAgICBwYXNzd29yZExlbmd0aDogMzIsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hc3RlclNlY3JldCA9IG1hc3RlclNlY3JldDtcclxuXHJcbiAgICAvLyBBdXJvcmHjgq/jg6njgrnjgr/jg7zkvZzmiJBcclxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyByZHMuRGF0YWJhc2VDbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xyXG4gICAgICBjbHVzdGVySWRlbnRpZmllcjogY29uZmlnLmF1cm9yYS5uYW1pbmcuY2x1c3Rlck5hbWUsXHJcbiAgICAgIFxyXG4gICAgICAvLyDjgqjjg7Pjgrjjg7PoqK3lrppcclxuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLmF1cm9yYVBvc3RncmVzKHtcclxuICAgICAgICB2ZXJzaW9uOiByZHMuQXVyb3JhUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xNl82LFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIOiqjeiovOaDheWgsVxyXG4gICAgICBjcmVkZW50aWFsczogcmRzLkNyZWRlbnRpYWxzLmZyb21TZWNyZXQobWFzdGVyU2VjcmV0KSxcclxuICAgICAgXHJcbiAgICAgIC8vIOODh+ODleOCqeODq+ODiOODh+ODvOOCv+ODmeODvOOCuVxyXG4gICAgICBkZWZhdWx0RGF0YWJhc2VOYW1lOiBjb25maWcuYXVyb3JhLmRhdGFiYXNlTmFtZSxcclxuXHJcbiAgICAgIC8vIOODjeODg+ODiOODr+ODvOOCr+ioreWumlxyXG4gICAgICB2cGM6IHZwYyxcclxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcclxuICAgICAgc3VibmV0R3JvdXA6IHRoaXMuc3VibmV0R3JvdXAsXHJcblxyXG4gICAgICAvLyBTZXJ2ZXJsZXNzIHYy6Kit5a6aXHJcbiAgICAgIHNlcnZlcmxlc3NWMk1pbkNhcGFjaXR5OiBjb25maWcuYXVyb3JhLm1pbkNhcGFjaXR5LFxyXG4gICAgICBzZXJ2ZXJsZXNzVjJNYXhDYXBhY2l0eTogY29uZmlnLmF1cm9yYS5tYXhDYXBhY2l0eSxcclxuXHJcbiAgICAgIC8vIOOCpOODs+OCueOCv+ODs+OCueioreWumlxyXG4gICAgICB3cml0ZXI6IHJkcy5DbHVzdGVySW5zdGFuY2Uuc2VydmVybGVzc1YyKCd3cml0ZXInLCB7XHJcbiAgICAgICAgcHVibGljbHlBY2Nlc3NpYmxlOiBmYWxzZSxcclxuICAgICAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBjb25maWcuYXVyb3JhLmVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHMsXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8g44OH44O844K/QVBJ5pyJ5Yq55YyWXHJcbiAgICAgIGVuYWJsZURhdGFBcGk6IGNvbmZpZy5hdXJvcmEuZW5hYmxlRGF0YUFwaSxcclxuXHJcbiAgICAgIC8vIOODkOODg+OCr+OCouODg+ODl+ioreWumlxyXG4gICAgICBiYWNrdXA6IHtcclxuICAgICAgICByZXRlbnRpb246IER1cmF0aW9uLmRheXMoY29uZmlnLmF1cm9yYS5iYWNrdXBSZXRlbnRpb25EYXlzKSxcclxuICAgICAgICBwcmVmZXJyZWRXaW5kb3c6ICcwMzowMC0wNDowMCcsIC8vIEpTVCAxMjowMC0xMzowMFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8g44Oh44Oz44OG44OK44Oz44K56Kit5a6aXHJcbiAgICAgIHByZWZlcnJlZE1haW50ZW5hbmNlV2luZG93OiAnc3VuOjA0OjAwLXN1bjowNTowMCcsIC8vIEpTVOaXpeabnDEzOjAwLTE0OjAwXHJcblxyXG4gICAgICAvLyBDbG91ZFdhdGNo44Ot44KwXHJcbiAgICAgIGNsb3Vkd2F0Y2hMb2dzRXhwb3J0czogY29uZmlnLmF1cm9yYS5lbmFibGVDbG91ZHdhdGNoTG9ncyBcclxuICAgICAgICA/IFsncG9zdGdyZXNxbCddIFxyXG4gICAgICAgIDogdW5kZWZpbmVkLFxyXG5cclxuICAgICAgLy8g5YmK6Zmk5L+d6K23XHJcbiAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogY29uZmlnLmF1cm9yYS5kZWxldGlvblByb3RlY3Rpb24sXHJcblxyXG4gICAgICAvLyDliYrpmaTmmYLjga7li5XkvZzvvIjplovnmbrnkrDlooPjgafjga/oh6rli5XliYrpmaTvvIlcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY29uZmlnLmVudmlyb25tZW50ID09PSAnZGV2JyBcclxuICAgICAgICA/IFJlbW92YWxQb2xpY3kuREVTVFJPWSBcclxuICAgICAgICA6IFJlbW92YWxQb2xpY3kuU05BUFNIT1QsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjgqvjgrnjgr/jg6Djgr/jgrDoqK3lrppcclxuICAgIHRoaXMuYXBwbHlUYWdzKGNvbmZpZy50YWdzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlUYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICB0aGlzLmNsdXN0ZXIubm9kZS5hZGRNZXRhZGF0YShrZXksIHZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==