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
class DatabaseStack extends cdk.Stack {
    auroraConstruct;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { config, vpc, auroraSecurityGroup } = props;
        // Aurora構築
        this.auroraConstruct = new aurora_construct_1.AuroraConstruct(this, 'Aurora', {
            vpc,
            securityGroup: auroraSecurityGroup,
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
        new cdk.CfnOutput(this, 'AppUserSecretArn', {
            value: this.auroraConstruct.appUserSecret.secretArn,
            description: 'Application User Secret ARN',
            exportName: `${config.environment}-app-secret-arn`,
        });
        new cdk.CfnOutput(this, 'DatabaseName', {
            value: config.aurora.databaseName,
            description: 'Database Name',
            exportName: `${config.environment}-database-name`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXRhYmFzZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUvQixpREFBbUM7QUFHbkMscUVBQWlFO0FBU2pFLE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFCLGVBQWUsQ0FBa0I7SUFFakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxtQkFBbUIsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUVuRCxXQUFXO1FBQ1gsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGtDQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN6RCxHQUFHO1lBQ0gsYUFBYSxFQUFFLG1CQUFtQjtZQUNsQyxNQUFNO1NBQ1AsQ0FBQyxDQUFDO1FBRUgsZUFBZTtRQUNmLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQzVELFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsa0JBQWtCO1NBQ3BELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQzlDLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsYUFBYTtTQUMvQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxTQUFTO1lBQ2xELFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsb0JBQW9CO1NBQ3RELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFNBQVM7WUFDbkQsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxpQkFBaUI7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWTtZQUNqQyxXQUFXLEVBQUUsZUFBZTtZQUM1QixVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxnQkFBZ0I7U0FDbEQsQ0FBQyxDQUFDO1FBRUgsU0FBUztRQUNULElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTyxlQUFlLENBQUMsSUFBK0I7UUFDckQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2REQsc0NBdURDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3N0YWNrcy9kYXRhYmFzZS1zdGFjay50c1xyXG5cclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQXVyb3JhQ29uc3RydWN0IH0gZnJvbSAnLi4vY29uc3RydWN0cy9hdXJvcmEtY29uc3RydWN0JztcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGF0YWJhc2VTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xyXG4gIGNvbmZpZzogRW52aXJvbm1lbnRDb25maWc7XHJcbiAgdnBjOiBlYzIuSVZwYztcclxuICBhdXJvcmFTZWN1cml0eUdyb3VwOiBlYzIuSVNlY3VyaXR5R3JvdXA7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRhYmFzZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgYXVyb3JhQ29uc3RydWN0OiBBdXJvcmFDb25zdHJ1Y3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEYXRhYmFzZVN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnLCB2cGMsIGF1cm9yYVNlY3VyaXR5R3JvdXAgfSA9IHByb3BzO1xyXG5cclxuICAgIC8vIEF1cm9yYeani+eviVxyXG4gICAgdGhpcy5hdXJvcmFDb25zdHJ1Y3QgPSBuZXcgQXVyb3JhQ29uc3RydWN0KHRoaXMsICdBdXJvcmEnLCB7XHJcbiAgICAgIHZwYyxcclxuICAgICAgc2VjdXJpdHlHcm91cDogYXVyb3JhU2VjdXJpdHlHcm91cCxcclxuICAgICAgY29uZmlnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g44K544K/44OD44Kv44Os44OZ44Or44Gn44Gu5Ye65Yqb5YCkXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckVuZHBvaW50Jywge1xyXG4gICAgICB2YWx1ZTogdGhpcy5hdXJvcmFDb25zdHJ1Y3QuY2x1c3Rlci5jbHVzdGVyRW5kcG9pbnQuaG9zdG5hbWUsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXVyb3JhIENsdXN0ZXIgRW5kcG9pbnQnLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LWF1cm9yYS1lbmRwb2ludGAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckFybicsIHtcclxuICAgICAgdmFsdWU6IHRoaXMuYXVyb3JhQ29uc3RydWN0LmNsdXN0ZXIuY2x1c3RlckFybixcclxuICAgICAgZGVzY3JpcHRpb246ICdBdXJvcmEgQ2x1c3RlciBBUk4nLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LWF1cm9yYS1hcm5gLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ01hc3RlclNlY3JldEFybicsIHtcclxuICAgICAgdmFsdWU6IHRoaXMuYXVyb3JhQ29uc3RydWN0Lm1hc3RlclNlY3JldC5zZWNyZXRBcm4sXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFzdGVyIFVzZXIgU2VjcmV0IEFSTicsXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tbWFzdGVyLXNlY3JldC1hcm5gLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0FwcFVzZXJTZWNyZXRBcm4nLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLmF1cm9yYUNvbnN0cnVjdC5hcHBVc2VyU2VjcmV0LnNlY3JldEFybixcclxuICAgICAgZGVzY3JpcHRpb246ICdBcHBsaWNhdGlvbiBVc2VyIFNlY3JldCBBUk4nLCBcclxuICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1hcHAtc2VjcmV0LWFybmAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRGF0YWJhc2VOYW1lJywge1xyXG4gICAgICB2YWx1ZTogY29uZmlnLmF1cm9yYS5kYXRhYmFzZU5hbWUsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGF0YWJhc2UgTmFtZScsXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tZGF0YWJhc2UtbmFtZWAsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDlhbHpgJrjgr/jgrDoqK3lrppcclxuICAgIHRoaXMuYXBwbHlDb21tb25UYWdzKGNvbmZpZy50YWdzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlDb21tb25UYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICBjZGsuVGFncy5vZih0aGlzKS5hZGQoa2V5LCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0iXX0=