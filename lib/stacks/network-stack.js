"use strict";
// lib/stacks/network-stack.ts
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
exports.NetworkStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const network_construct_1 = require("../constructs/network-construct");
class NetworkStack extends cdk.Stack {
    networkConstruct;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { config } = props;
        // ネットワーク構築
        this.networkConstruct = new network_construct_1.NetworkConstruct(this, 'Network', {
            config,
        });
        // スタックレベルでの出力値
        new cdk.CfnOutput(this, 'VpcId', {
            value: this.networkConstruct.vpc.vpcId,
            description: 'VPC ID',
            exportName: `${config.environment}-vpc-id`,
        });
        new cdk.CfnOutput(this, 'AuroraSecurityGroupId', {
            value: this.networkConstruct.auroraSecurityGroup.securityGroupId,
            description: 'Aurora Security Group ID',
            exportName: `${config.environment}-aurora-sg-id`,
        });
        new cdk.CfnOutput(this, 'LambdaSecurityGroupId', {
            value: this.networkConstruct.lambdaSecurityGroup.securityGroupId,
            description: 'Lambda Security Group ID',
            exportName: `${config.environment}-lambda-sg-id`,
        });
        // プライベートサブネットID一覧
        const allPrivateSubnets = [
            ...this.networkConstruct.vpc.privateSubnets,
            ...this.networkConstruct.vpc.isolatedSubnets,
        ];
        if (allPrivateSubnets.length > 0) {
            new cdk.CfnOutput(this, 'PrivateSubnetIds', {
                value: allPrivateSubnets.map(subnet => subnet.subnetId).join(','),
                description: 'Private Subnet IDs',
                exportName: `${config.environment}-private-subnet-ids`,
            });
        }
        // パブリックサブネットID一覧
        if (this.networkConstruct.vpc.publicSubnets.length > 0) {
            new cdk.CfnOutput(this, 'PublicSubnetIds', {
                value: this.networkConstruct.vpc.publicSubnets.map(subnet => subnet.subnetId).join(','),
                description: 'Public Subnet IDs',
                exportName: `${config.environment}-public-subnet-ids`,
            });
        }
        // 共通タグ設定
        this.applyCommonTags(config.tags);
    }
    applyCommonTags(tags) {
        Object.entries(tags).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });
    }
}
exports.NetworkStack = NetworkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFOUIsaURBQW1DO0FBRW5DLHVFQUFtRTtBQU9uRSxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QixnQkFBZ0IsQ0FBbUI7SUFFbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRXpCLFdBQVc7UUFDWCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVELE1BQU07U0FDUCxDQUFDLENBQUM7UUFFSCxlQUFlO1FBQ2YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsS0FBSztZQUN0QyxXQUFXLEVBQUUsUUFBUTtZQUNyQixVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxTQUFTO1NBQzNDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDL0MsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlO1lBQ2hFLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsZUFBZTtTQUNqRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQy9DLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsZUFBZTtZQUNoRSxXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLGVBQWU7U0FDakQsQ0FBQyxDQUFDO1FBRUgsa0JBQWtCO1FBQ2xCLE1BQU0saUJBQWlCLEdBQUc7WUFDeEIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGNBQWM7WUFDM0MsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGVBQWU7U0FDN0MsQ0FBQztRQUVGLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2pDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQzFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDakUsV0FBVyxFQUFFLG9CQUFvQjtnQkFDakMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcscUJBQXFCO2FBQ3ZELENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxpQkFBaUI7UUFDakIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtnQkFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUN2RixXQUFXLEVBQUUsbUJBQW1CO2dCQUNoQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxvQkFBb0I7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELFNBQVM7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sZUFBZSxDQUFDLElBQStCO1FBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaEVELG9DQWdFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9zdGFja3MvbmV0d29yay1zdGFjay50c1xyXG5cclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IE5ldHdvcmtDb25zdHJ1Y3QgfSBmcm9tICcuLi9jb25zdHJ1Y3RzL25ldHdvcmstY29uc3RydWN0JztcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtDb25zdHJ1Y3Q6IE5ldHdvcmtDb25zdHJ1Y3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgY29uc3QgeyBjb25maWcgfSA9IHByb3BzO1xyXG5cclxuICAgIC8vIOODjeODg+ODiOODr+ODvOOCr+ani+eviVxyXG4gICAgdGhpcy5uZXR3b3JrQ29uc3RydWN0ID0gbmV3IE5ldHdvcmtDb25zdHJ1Y3QodGhpcywgJ05ldHdvcmsnLCB7XHJcbiAgICAgIGNvbmZpZyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOOCueOCv+ODg+OCr+ODrOODmeODq+OBp+OBruWHuuWKm+WApFxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1ZwY0lkJywge1xyXG4gICAgICB2YWx1ZTogdGhpcy5uZXR3b3JrQ29uc3RydWN0LnZwYy52cGNJZCxcclxuICAgICAgZGVzY3JpcHRpb246ICdWUEMgSUQnLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LXZwYy1pZGAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQXVyb3JhU2VjdXJpdHlHcm91cElkJywge1xyXG4gICAgICB2YWx1ZTogdGhpcy5uZXR3b3JrQ29uc3RydWN0LmF1cm9yYVNlY3VyaXR5R3JvdXAuc2VjdXJpdHlHcm91cElkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1cm9yYSBTZWN1cml0eSBHcm91cCBJRCcsXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tYXVyb3JhLXNnLWlkYCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdMYW1iZGFTZWN1cml0eUdyb3VwSWQnLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLm5ldHdvcmtDb25zdHJ1Y3QubGFtYmRhU2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGFtYmRhIFNlY3VyaXR5IEdyb3VwIElEJywgXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tbGFtYmRhLXNnLWlkYCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOODl+ODqeOCpOODmeODvOODiOOCteODluODjeODg+ODiElE5LiA6KanXHJcbiAgICBjb25zdCBhbGxQcml2YXRlU3VibmV0cyA9IFtcclxuICAgICAgLi4udGhpcy5uZXR3b3JrQ29uc3RydWN0LnZwYy5wcml2YXRlU3VibmV0cyxcclxuICAgICAgLi4udGhpcy5uZXR3b3JrQ29uc3RydWN0LnZwYy5pc29sYXRlZFN1Ym5ldHMsXHJcbiAgICBdO1xyXG4gICAgXHJcbiAgICBpZiAoYWxsUHJpdmF0ZVN1Ym5ldHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnUHJpdmF0ZVN1Ym5ldElkcycsIHtcclxuICAgICAgICB2YWx1ZTogYWxsUHJpdmF0ZVN1Ym5ldHMubWFwKHN1Ym5ldCA9PiBzdWJuZXQuc3VibmV0SWQpLmpvaW4oJywnKSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ1ByaXZhdGUgU3VibmV0IElEcycsXHJcbiAgICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1wcml2YXRlLXN1Ym5ldC1pZHNgLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDjg5Hjg5bjg6rjg4Pjgq/jgrXjg5bjg43jg4Pjg4hJROS4gOimp1xyXG4gICAgaWYgKHRoaXMubmV0d29ya0NvbnN0cnVjdC52cGMucHVibGljU3VibmV0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdQdWJsaWNTdWJuZXRJZHMnLCB7XHJcbiAgICAgICAgdmFsdWU6IHRoaXMubmV0d29ya0NvbnN0cnVjdC52cGMucHVibGljU3VibmV0cy5tYXAoc3VibmV0ID0+IHN1Ym5ldC5zdWJuZXRJZCkuam9pbignLCcpLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUHVibGljIFN1Ym5ldCBJRHMnLFxyXG4gICAgICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tcHVibGljLXN1Ym5ldC1pZHNgLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlhbHpgJrjgr/jgrDoqK3lrppcclxuICAgIHRoaXMuYXBwbHlDb21tb25UYWdzKGNvbmZpZy50YWdzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlDb21tb25UYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICBjZGsuVGFncy5vZih0aGlzKS5hZGQoa2V5LCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0iXX0=