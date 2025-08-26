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
        // NetworkConstructを使用してネットワークリソースを作成
        this.networkConstruct = new network_construct_1.NetworkConstruct(this, 'Network', {
            config,
        });
        // スタックレベルでの出力値
        new cdk.CfnOutput(this, 'VpcId', {
            value: this.networkConstruct.vpc.vpcId,
            description: 'VPC ID',
            exportName: `${config.environment}-vpc-id`,
        });
        new cdk.CfnOutput(this, 'VpcCidr', {
            value: this.networkConstruct.vpc.vpcCidrBlock,
            description: 'VPC CIDR Block',
            exportName: `${config.environment}-vpc-cidr`,
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
        // プライベートサブネットのIDを出力
        this.networkConstruct.vpc.privateSubnets.forEach((subnet, index) => {
            new cdk.CfnOutput(this, `PrivateSubnet${index}Id`, {
                value: subnet.subnetId,
                description: `Private Subnet ${index} ID`,
                exportName: `${config.environment}-private-subnet-${index}-id`,
            });
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
exports.NetworkStack = NetworkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFOUIsaURBQW1DO0FBRW5DLHVFQUFtRTtBQU9uRSxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMxQixnQkFBZ0IsQ0FBbUI7SUFFbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRXpCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVELE1BQU07U0FDUCxDQUFDLENBQUM7UUFFSCxlQUFlO1FBQ2YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsS0FBSztZQUN0QyxXQUFXLEVBQUUsUUFBUTtZQUNyQixVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxTQUFTO1NBQzNDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ2pDLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFlBQVk7WUFDN0MsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxXQUFXO1NBQzdDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDL0MsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlO1lBQ2hFLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsZUFBZTtTQUNqRCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQy9DLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsZUFBZTtZQUNoRSxXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLGVBQWU7U0FDakQsQ0FBQyxDQUFDO1FBRUgsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNqRSxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixLQUFLLElBQUksRUFBRTtnQkFDakQsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRO2dCQUN0QixXQUFXLEVBQUUsa0JBQWtCLEtBQUssS0FBSztnQkFDekMsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsbUJBQW1CLEtBQUssS0FBSzthQUMvRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVM7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU8sZUFBZSxDQUFDLElBQStCO1FBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNEO0FBeERELG9DQXdEQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9zdGFja3MvbmV0d29yay1zdGFjay50c1xyXG5cclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IE5ldHdvcmtDb25zdHJ1Y3QgfSBmcm9tICcuLi9jb25zdHJ1Y3RzL25ldHdvcmstY29uc3RydWN0JztcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29ya1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQ29uc3RydWN0OiBOZXR3b3JrQ29uc3RydWN0O1xyXG5cclxuIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrU3RhY2tQcm9wcykge1xyXG4gICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgIGNvbnN0IHsgY29uZmlnIH0gPSBwcm9wcztcclxuXHJcbiAgIC8vIE5ldHdvcmtDb25zdHJ1Y3TjgpLkvb/nlKjjgZfjgabjg43jg4Pjg4jjg6/jg7zjgq/jg6rjgr3jg7zjgrnjgpLkvZzmiJBcclxuICAgdGhpcy5uZXR3b3JrQ29uc3RydWN0ID0gbmV3IE5ldHdvcmtDb25zdHJ1Y3QodGhpcywgJ05ldHdvcmsnLCB7XHJcbiAgICAgY29uZmlnLFxyXG4gICB9KTtcclxuXHJcbiAgIC8vIOOCueOCv+ODg+OCr+ODrOODmeODq+OBp+OBruWHuuWKm+WApFxyXG4gICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVnBjSWQnLCB7XHJcbiAgICAgdmFsdWU6IHRoaXMubmV0d29ya0NvbnN0cnVjdC52cGMudnBjSWQsXHJcbiAgICAgZGVzY3JpcHRpb246ICdWUEMgSUQnLFxyXG4gICAgIGV4cG9ydE5hbWU6IGAke2NvbmZpZy5lbnZpcm9ubWVudH0tdnBjLWlkYCxcclxuICAgfSk7XHJcblxyXG4gICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVnBjQ2lkcicsIHtcclxuICAgICB2YWx1ZTogdGhpcy5uZXR3b3JrQ29uc3RydWN0LnZwYy52cGNDaWRyQmxvY2ssXHJcbiAgICAgZGVzY3JpcHRpb246ICdWUEMgQ0lEUiBCbG9jaycsXHJcbiAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS12cGMtY2lkcmAsXHJcbiAgIH0pO1xyXG5cclxuICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0F1cm9yYVNlY3VyaXR5R3JvdXBJZCcsIHtcclxuICAgICB2YWx1ZTogdGhpcy5uZXR3b3JrQ29uc3RydWN0LmF1cm9yYVNlY3VyaXR5R3JvdXAuc2VjdXJpdHlHcm91cElkLFxyXG4gICAgIGRlc2NyaXB0aW9uOiAnQXVyb3JhIFNlY3VyaXR5IEdyb3VwIElEJyxcclxuICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LWF1cm9yYS1zZy1pZGAsXHJcbiAgIH0pO1xyXG5cclxuICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0xhbWJkYVNlY3VyaXR5R3JvdXBJZCcsIHtcclxuICAgICB2YWx1ZTogdGhpcy5uZXR3b3JrQ29uc3RydWN0LmxhbWJkYVNlY3VyaXR5R3JvdXAuc2VjdXJpdHlHcm91cElkLFxyXG4gICAgIGRlc2NyaXB0aW9uOiAnTGFtYmRhIFNlY3VyaXR5IEdyb3VwIElEJyxcclxuICAgICBleHBvcnROYW1lOiBgJHtjb25maWcuZW52aXJvbm1lbnR9LWxhbWJkYS1zZy1pZGAsXHJcbiAgIH0pO1xyXG5cclxuICAgLy8g44OX44Op44Kk44OZ44O844OI44K144OW44ON44OD44OI44GuSUTjgpLlh7rliptcclxuICAgdGhpcy5uZXR3b3JrQ29uc3RydWN0LnZwYy5wcml2YXRlU3VibmV0cy5mb3JFYWNoKChzdWJuZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgYFByaXZhdGVTdWJuZXQke2luZGV4fUlkYCwge1xyXG4gICAgICAgdmFsdWU6IHN1Ym5ldC5zdWJuZXRJZCxcclxuICAgICAgIGRlc2NyaXB0aW9uOiBgUHJpdmF0ZSBTdWJuZXQgJHtpbmRleH0gSURgLFxyXG4gICAgICAgZXhwb3J0TmFtZTogYCR7Y29uZmlnLmVudmlyb25tZW50fS1wcml2YXRlLXN1Ym5ldC0ke2luZGV4fS1pZGAsXHJcbiAgICAgfSk7XHJcbiAgIH0pO1xyXG5cclxuICAgLy8g5YWx6YCa44K/44Kw6Kit5a6aXHJcbiAgIHRoaXMuYXBwbHlDb21tb25UYWdzKGNvbmZpZy50YWdzKTtcclxuIH1cclxuXHJcbiBwcml2YXRlIGFwcGx5Q29tbW9uVGFncyh0YWdzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgIGNkay5UYWdzLm9mKHRoaXMpLmFkZChrZXksIHZhbHVlKTtcclxuICAgfSk7XHJcbiB9XHJcbn0iXX0=