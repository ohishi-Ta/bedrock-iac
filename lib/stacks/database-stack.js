"use strict";
// lib/stacks/database-stack.ts
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
exports.DatabaseStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const aurora_construct_1 = require("../constructs/aurora-construct");
const db_initializer_construct_1 = require("../constructs/db-initializer-construct");
class DatabaseStack extends cdk.Stack {
    auroraConstruct;
    dbInitializerConstruct;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { config, vpc, auroraSecurityGroup, lambdaSecurityGroup } = props;
        // Aurora構築
        this.auroraConstruct = new aurora_construct_1.AuroraConstruct(this, 'Aurora', {
            vpc,
            securityGroup: auroraSecurityGroup,
            config,
        });
        // データベース初期化（pgvector有効化、スキーマ・テーブル作成）
        this.dbInitializerConstruct = new db_initializer_construct_1.DbInitializerConstruct(this, 'DbInitializer', {
            vpc,
            lambdaSecurityGroup,
            cluster: this.auroraConstruct.cluster,
            masterSecret: this.auroraConstruct.masterSecret,
            config,
        });
        // スタックレベルでの出力値
        new cdk.CfnOutput(this, 'ClusterEndpoint', {
            value: this.auroraConstruct.cluster.clusterEndpoint.hostname,
            description: 'Aurora Cluster Endpoint',
            exportName: `${config.environment}-aurora-endpoint`,
        });
        new cdk.CfnOutput(this, 'ClusterArn', {
            value: this.auroraConstruct.cluster.clusterArn,
            description: 'Aurora Cluster ARN',
            exportName: `${config.environment}-aurora-arn`,
        });
        new cdk.CfnOutput(this, 'MasterSecretArn', {
            value: this.auroraConstruct.masterSecret.secretArn,
            description: 'Master User Secret ARN',
            exportName: `${config.environment}-master-secret-arn`,
        });
        new cdk.CfnOutput(this, 'DatabaseName', {
            value: config.aurora.databaseName,
            description: 'Database Name',
            exportName: `${config.environment}-database-name`,
        });
        new cdk.CfnOutput(this, 'DbInitializationStatus', {
            value: 'Initialized with pgvector and Bedrock Knowledge Base schema',
            description: 'Database Initialization Status',
        });
        // 共通タグ設定
        this.applyCommonTags(config.tags);
    }
    applyCommonTags(tags) {
        Object.entries(tags).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });
    }
}
exports.DatabaseStack = DatabaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXRhYmFzZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUvQixpREFBbUM7QUFHbkMscUVBQWlFO0FBQ2pFLHFGQUFnRjtBQVVoRixNQUFhLGFBQWMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMxQixlQUFlLENBQWtCO0lBQ2pDLHNCQUFzQixDQUF5QjtJQUUvRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRXhFLFdBQVc7UUFDWCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0NBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3pELEdBQUc7WUFDSCxhQUFhLEVBQUUsbUJBQW1CO1lBQ2xDLE1BQU07U0FDUCxDQUFDLENBQUM7UUFFSCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksaURBQXNCLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUM5RSxHQUFHO1lBQ0gsbUJBQW1CO1lBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87WUFDckMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWTtZQUMvQyxNQUFNO1NBQ1AsQ0FBQyxDQUFDO1FBRUgsZUFBZTtRQUNmLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQzVELFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsa0JBQWtCO1NBQ3BELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQzlDLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsYUFBYTtTQUMvQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxTQUFTO1lBQ2xELFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsb0JBQW9CO1NBQ3RELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVk7WUFDakMsV0FBVyxFQUFFLGVBQWU7WUFDNUIsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsZ0JBQWdCO1NBQ2xELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDaEQsS0FBSyxFQUFFLDZEQUE2RDtZQUNwRSxXQUFXLEVBQUUsZ0NBQWdDO1NBQzlDLENBQUMsQ0FBQztRQUVILFNBQVM7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sZUFBZSxDQUFDLElBQStCO1FBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaEVELHNDQWdFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9zdGFja3MvZGF0YWJhc2Utc3RhY2sudHNcclxuXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEF1cm9yYUNvbnN0cnVjdCB9IGZyb20gJy4uL2NvbnN0cnVjdHMvYXVyb3JhLWNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IERiSW5pdGlhbGl6ZXJDb25zdHJ1Y3QgfSBmcm9tICcuLi9jb25zdHJ1Y3RzL2RiLWluaXRpYWxpemVyLWNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERhdGFiYXNlU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcclxuICBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xyXG4gIHZwYzogZWMyLklWcGM7XHJcbiAgYXVyb3JhU2VjdXJpdHlHcm91cDogZWMyLklTZWN1cml0eUdyb3VwO1xyXG4gIGxhbWJkYVNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFiYXNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIHB1YmxpYyByZWFkb25seSBhdXJvcmFDb25zdHJ1Y3Q6IEF1cm9yYUNvbnN0cnVjdDtcclxuICBwdWJsaWMgcmVhZG9ubHkgZGJJbml0aWFsaXplckNvbnN0cnVjdDogRGJJbml0aWFsaXplckNvbnN0cnVjdDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERhdGFiYXNlU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgY29uc3QgeyBjb25maWcsIHZwYywgYXVyb3JhU2VjdXJpdHlHcm91cCwgbGFtYmRhU2VjdXJpdHlHcm91cCB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8gQXVyb3Jh5qeL56+JXHJcbiAgICB0aGlzLmF1cm9yYUNvbnN0cnVjdCA9IG5ldyBBdXJvcmFDb25zdHJ1Y3QodGhpcywgJ0F1cm9yYScsIHtcclxuICAgICAgdnBjLFxyXG4gICAgICBzZWN1cml0eUdyb3VwOiBhdXJvcmFTZWN1cml0eUdyb3VwLFxyXG4gICAgICBjb25maWcsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjg4fjg7zjgr/jg5njg7zjgrnliJ3mnJ/ljJbvvIhwZ3ZlY3RvcuacieWKueWMluOAgeOCueOCreODvOODnuODu+ODhuODvOODluODq+S9nOaIkO+8iVxyXG4gICAgdGhpcy5kYkluaXRpYWxpemVyQ29uc3RydWN0ID0gbmV3IERiSW5pdGlhbGl6ZXJDb25zdHJ1Y3QodGhpcywgJ0RiSW5pdGlhbGl6ZXInLCB7XHJcbiAgICAgIHZwYyxcclxuICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cCxcclxuICAgICAgY2x1c3RlcjogdGhpcy5hdXJvcmFDb25zdHJ1Y3QuY2x1c3RlcixcclxuICAgICAgbWFzdGVyU2VjcmV0OiB0aGlzLmF1cm9yYUNvbnN0cnVjdC5tYXN0ZXJTZWNyZXQsXHJcbiAgICAgIGNvbmZpZyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOOCueOCv+ODg+OCr+ODrOODmeODq+OBp+OBruWHuuWKm+WApFxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJFbmRwb2ludCcsIHtcclxuICAgICAgdmFsdWU6IHRoaXMuYXVyb3JhQ29uc3RydWN0LmNsdXN0ZXIuY2x1c3RlckVuZHBvaW50Lmhvc3RuYW1lLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBDbHVzdGVyIEVuZHBvaW50JyxcclxuICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1hdXJvcmEtZW5kcG9pbnRgLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJBcm4nLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLmF1cm9yYUNvbnN0cnVjdC5jbHVzdGVyLmNsdXN0ZXJBcm4sXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXVyb3JhIENsdXN0ZXIgQVJOJyxcclxuICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1hdXJvcmEtYXJuYCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdNYXN0ZXJTZWNyZXRBcm4nLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLmF1cm9yYUNvbnN0cnVjdC5tYXN0ZXJTZWNyZXQuc2VjcmV0QXJuLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ01hc3RlciBVc2VyIFNlY3JldCBBUk4nLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LW1hc3Rlci1zZWNyZXQtYXJuYCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEYXRhYmFzZU5hbWUnLCB7XHJcbiAgICAgIHZhbHVlOiBjb25maWcuYXVyb3JhLmRhdGFiYXNlTmFtZSxcclxuICAgICAgZGVzY3JpcHRpb246ICdEYXRhYmFzZSBOYW1lJyxcclxuICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1kYXRhYmFzZS1uYW1lYCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEYkluaXRpYWxpemF0aW9uU3RhdHVzJywge1xyXG4gICAgICB2YWx1ZTogJ0luaXRpYWxpemVkIHdpdGggcGd2ZWN0b3IgYW5kIEJlZHJvY2sgS25vd2xlZGdlIEJhc2Ugc2NoZW1hJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdEYXRhYmFzZSBJbml0aWFsaXphdGlvbiBTdGF0dXMnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g5YWx6YCa44K/44Kw6Kit5a6aXHJcbiAgICB0aGlzLmFwcGx5Q29tbW9uVGFncyhjb25maWcudGFncyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5Q29tbW9uVGFncyh0YWdzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICBPYmplY3QuZW50cmllcyh0YWdzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgY2RrLlRhZ3Mub2YodGhpcykuYWRkKGtleSwgdmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59Il19