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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVyb3JhLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1cm9yYS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFDQUFxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFckMseURBQTJDO0FBQzNDLHlEQUEyQztBQUMzQywrRUFBaUU7QUFDakUsMkNBQXVDO0FBQ3ZDLDZDQUFzRDtBQVN0RCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUFDNUIsT0FBTyxDQUFzQjtJQUM3QixZQUFZLENBQXlCO0lBQ3JDLFdBQVcsQ0FBa0I7SUFFN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUU3QyxjQUFjO1FBQ2QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUNqRixXQUFXLEVBQUUsbUNBQW1DO1lBQ2hELEdBQUcsRUFBRSxHQUFHO1lBQ1IsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILGtCQUFrQjtRQUNsQixNQUFNLFlBQVksR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFO1lBQzFGLFdBQVcsRUFBRSxnQ0FBZ0M7WUFDN0Msb0JBQW9CLEVBQUU7Z0JBQ3BCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWM7aUJBQ3ZDLENBQUM7Z0JBQ0YsaUJBQWlCLEVBQUUsVUFBVTtnQkFDN0IsaUJBQWlCLEVBQUUsU0FBUztnQkFDNUIsY0FBYyxFQUFFLEVBQUU7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUVqQyxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUM3RSxTQUFTO1lBQ1QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUM7Z0JBQy9DLE9BQU8sRUFBRSxHQUFHLENBQUMsMkJBQTJCLENBQUMsUUFBUTthQUNsRCxDQUFDO1lBRUYsT0FBTztZQUNQLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFFckQsY0FBYztZQUNkLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWTtZQUUvQyxXQUFXO1lBQ1gsR0FBRyxFQUFFLEdBQUc7WUFDUixjQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDL0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBRTdCLGtCQUFrQjtZQUNsQix1QkFBdUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVc7WUFDbEQsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1lBRWxELFdBQVc7WUFDWCxNQUFNLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO2dCQUNqRCxrQkFBa0IsRUFBRSxLQUFLO2dCQUN6Qix5QkFBeUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLHlCQUF5QjthQUNuRSxDQUFDO1lBRUYsWUFBWTtZQUNaLGFBQWEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFFMUMsV0FBVztZQUNYLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztnQkFDM0QsZUFBZSxFQUFFLGFBQWEsRUFBRSxrQkFBa0I7YUFDbkQ7WUFFRCxXQUFXO1lBQ1gsMEJBQTBCLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CO1lBRXRFLGVBQWU7WUFDZixxQkFBcUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQjtnQkFDdkQsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO2dCQUNoQixDQUFDLENBQUMsU0FBUztZQUViLE9BQU87WUFDUCxrQkFBa0IsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQjtZQUVwRCxxQkFBcUI7WUFDckIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEtBQUssS0FBSztnQkFDekMsQ0FBQyxDQUFDLDJCQUFhLENBQUMsT0FBTztnQkFDdkIsQ0FBQyxDQUFDLDJCQUFhLENBQUMsUUFBUTtTQUMzQixDQUFDLENBQUM7UUFFSCxXQUFXO1FBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVPLFNBQVMsQ0FBQyxJQUErQjtRQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpHRCwwQ0FpR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uc3RydWN0cy9hdXJvcmEtY29uc3RydWN0LnRzXHJcblxyXG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IER1cmF0aW9uLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBFbnZpcm9ubWVudENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXJvcmFDb25zdHJ1Y3RQcm9wcyB7XHJcbiAgdnBjOiBlYzIuSVZwYztcclxuICBzZWN1cml0eUdyb3VwOiBlYzIuSVNlY3VyaXR5R3JvdXA7XHJcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEF1cm9yYUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXI6IHJkcy5EYXRhYmFzZUNsdXN0ZXI7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1hc3RlclNlY3JldDogc2VjcmV0c21hbmFnZXIuSVNlY3JldDtcclxuICBwdWJsaWMgcmVhZG9ubHkgc3VibmV0R3JvdXA6IHJkcy5TdWJuZXRHcm91cDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEF1cm9yYUNvbnN0cnVjdFByb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgIGNvbnN0IHsgdnBjLCBzZWN1cml0eUdyb3VwLCBjb25maWcgfSA9IHByb3BzO1xyXG5cclxuICAgIC8vIOOCteODluODjeODg+ODiOOCsOODq+ODvOODl+S9nOaIkFxyXG4gICAgdGhpcy5zdWJuZXRHcm91cCA9IG5ldyByZHMuU3VibmV0R3JvdXAodGhpcywgY29uZmlnLmF1cm9yYS5uYW1pbmcuc3VibmV0R3JvdXBOYW1lLCB7XHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXVyb3JhIFNlcnZlcmxlc3MgdjIgc3VibmV0IGdyb3VwJyxcclxuICAgICAgdnBjOiB2cGMsXHJcbiAgICAgIHZwY1N1Ym5ldHM6IHtcclxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g44Oe44K544K/44O844Om44O844K244O855So44K344O844Kv44Os44OD44OIXHJcbiAgICBjb25zdCBtYXN0ZXJTZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHRoaXMsIGNvbmZpZy5hdXJvcmEubmFtaW5nLm1hc3RlclNlY3JldE5hbWUsIHtcclxuICAgICAgZGVzY3JpcHRpb246ICdBdXJvcmEgbWFzdGVyIHVzZXIgY3JlZGVudGlhbHMnLFxyXG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xyXG4gICAgICAgIHNlY3JldFN0cmluZ1RlbXBsYXRlOiBKU09OLnN0cmluZ2lmeSh7IFxyXG4gICAgICAgICAgdXNlcm5hbWU6IGNvbmZpZy5hdXJvcmEubWFzdGVyVXNlcm5hbWUgXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZ2VuZXJhdGVTdHJpbmdLZXk6ICdwYXNzd29yZCcsXHJcbiAgICAgICAgZXhjbHVkZUNoYXJhY3RlcnM6ICdcIkBcXFxcXFwnLycsXHJcbiAgICAgICAgcGFzc3dvcmRMZW5ndGg6IDMyLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5tYXN0ZXJTZWNyZXQgPSBtYXN0ZXJTZWNyZXQ7XHJcblxyXG4gICAgLy8gQXVyb3Jh44Kv44Op44K544K/44O85L2c5oiQXHJcbiAgICB0aGlzLmNsdXN0ZXIgPSBuZXcgcmRzLkRhdGFiYXNlQ2x1c3Rlcih0aGlzLCBjb25maWcuYXVyb3JhLm5hbWluZy5jbHVzdGVyTmFtZSwge1xyXG4gICAgICAvLyDjgqjjg7Pjgrjjg7PoqK3lrppcclxuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLmF1cm9yYVBvc3RncmVzKHtcclxuICAgICAgICB2ZXJzaW9uOiByZHMuQXVyb3JhUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xNl82LFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIOiqjeiovOaDheWgsVxyXG4gICAgICBjcmVkZW50aWFsczogcmRzLkNyZWRlbnRpYWxzLmZyb21TZWNyZXQobWFzdGVyU2VjcmV0KSxcclxuICAgICAgXHJcbiAgICAgIC8vIOODh+ODleOCqeODq+ODiOODh+ODvOOCv+ODmeODvOOCuVxyXG4gICAgICBkZWZhdWx0RGF0YWJhc2VOYW1lOiBjb25maWcuYXVyb3JhLmRhdGFiYXNlTmFtZSxcclxuXHJcbiAgICAgIC8vIOODjeODg+ODiOODr+ODvOOCr+ioreWumlxyXG4gICAgICB2cGM6IHZwYyxcclxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcclxuICAgICAgc3VibmV0R3JvdXA6IHRoaXMuc3VibmV0R3JvdXAsXHJcblxyXG4gICAgICAvLyBTZXJ2ZXJsZXNzIHYy6Kit5a6aXHJcbiAgICAgIHNlcnZlcmxlc3NWMk1pbkNhcGFjaXR5OiBjb25maWcuYXVyb3JhLm1pbkNhcGFjaXR5LFxyXG4gICAgICBzZXJ2ZXJsZXNzVjJNYXhDYXBhY2l0eTogY29uZmlnLmF1cm9yYS5tYXhDYXBhY2l0eSxcclxuXHJcbiAgICAgIC8vIOOCpOODs+OCueOCv+ODs+OCueioreWumlxyXG4gICAgICB3cml0ZXI6IHJkcy5DbHVzdGVySW5zdGFuY2Uuc2VydmVybGVzc1YyKCd3cml0ZXInLCB7XHJcbiAgICAgICAgcHVibGljbHlBY2Nlc3NpYmxlOiBmYWxzZSxcclxuICAgICAgICBlbmFibGVQZXJmb3JtYW5jZUluc2lnaHRzOiBjb25maWcuYXVyb3JhLmVuYWJsZVBlcmZvcm1hbmNlSW5zaWdodHMsXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8g44OH44O844K/QVBJ5pyJ5Yq55YyWXHJcbiAgICAgIGVuYWJsZURhdGFBcGk6IGNvbmZpZy5hdXJvcmEuZW5hYmxlRGF0YUFwaSxcclxuXHJcbiAgICAgIC8vIOODkOODg+OCr+OCouODg+ODl+ioreWumlxyXG4gICAgICBiYWNrdXA6IHtcclxuICAgICAgICByZXRlbnRpb246IER1cmF0aW9uLmRheXMoY29uZmlnLmF1cm9yYS5iYWNrdXBSZXRlbnRpb25EYXlzKSxcclxuICAgICAgICBwcmVmZXJyZWRXaW5kb3c6ICcwMzowMC0wNDowMCcsIC8vIEpTVCAxMjowMC0xMzowMFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8g44Oh44Oz44OG44OK44Oz44K56Kit5a6aXHJcbiAgICAgIHByZWZlcnJlZE1haW50ZW5hbmNlV2luZG93OiAnc3VuOjA0OjAwLXN1bjowNTowMCcsIC8vIEpTVOaXpeabnDEzOjAwLTE0OjAwXHJcblxyXG4gICAgICAvLyBDbG91ZFdhdGNo44Ot44KwXHJcbiAgICAgIGNsb3Vkd2F0Y2hMb2dzRXhwb3J0czogY29uZmlnLmF1cm9yYS5lbmFibGVDbG91ZHdhdGNoTG9ncyBcclxuICAgICAgICA/IFsncG9zdGdyZXNxbCddIFxyXG4gICAgICAgIDogdW5kZWZpbmVkLFxyXG5cclxuICAgICAgLy8g5YmK6Zmk5L+d6K23XHJcbiAgICAgIGRlbGV0aW9uUHJvdGVjdGlvbjogY29uZmlnLmF1cm9yYS5kZWxldGlvblByb3RlY3Rpb24sXHJcblxyXG4gICAgICAvLyDliYrpmaTmmYLjga7li5XkvZzvvIjplovnmbrnkrDlooPjgafjga/oh6rli5XliYrpmaTvvIlcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY29uZmlnLmVudmlyb25tZW50ID09PSAnZGV2JyBcclxuICAgICAgICA/IFJlbW92YWxQb2xpY3kuREVTVFJPWSBcclxuICAgICAgICA6IFJlbW92YWxQb2xpY3kuU05BUFNIT1QsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjgqvjgrnjgr/jg6Djgr/jgrDoqK3lrppcclxuICAgIHRoaXMuYXBwbHlUYWdzKGNvbmZpZy50YWdzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlUYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICB0aGlzLmNsdXN0ZXIubm9kZS5hZGRNZXRhZGF0YShrZXksIHZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==