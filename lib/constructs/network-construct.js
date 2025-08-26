"use strict";
// lib/constructs/network-construct.ts
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
exports.NetworkConstruct = void 0;
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const constructs_1 = require("constructs");
class NetworkConstruct extends constructs_1.Construct {
    vpc;
    privateSubnets;
    publicSubnets;
    auroraSecurityGroup;
    lambdaSecurityGroup;
    constructor(scope, id, props) {
        super(scope, id);
        const { config } = props;
        // VPC作成
        this.vpc = new ec2.Vpc(this, config.network.naming.vpcName, {
            ipAddresses: ec2.IpAddresses.cidr(config.network.vpcCidr),
            availabilityZones: config.network.availabilityZones,
            restrictDefaultSecurityGroup: true,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: config.network.naming.publicSubnetName,
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: config.network.naming.privateSubnetName,
                    subnetType: config.network.enableNatGateway
                        ? ec2.SubnetType.PRIVATE_WITH_EGRESS
                        : ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
            // NATゲートウェイの設定
            natGateways: config.network.enableNatGateway ? config.network.availabilityZones.length : 0,
            // VPCフローログ
            enableDnsHostnames: true,
            enableDnsSupport: true,
        });
        // サブネット参照
        this.privateSubnets = this.vpc.privateSubnets;
        this.publicSubnets = this.vpc.publicSubnets;
        // Aurora用セキュリティグループ
        this.auroraSecurityGroup = new ec2.SecurityGroup(this, config.network.naming.auroraSecurityGroupName, {
            vpc: this.vpc,
            description: 'Security group for Aurora Serverless v2',
            allowAllOutbound: true,
        });
        // 自分自身からのアクセスを許可（同じセキュリティグループ内）
        this.auroraSecurityGroup.addIngressRule(this.auroraSecurityGroup, ec2.Port.tcp(5432), 'Allow access from same security group');
        // Lambda用セキュリティグループ
        this.lambdaSecurityGroup = new ec2.SecurityGroup(this, config.network.naming.lambdaSecurityGroupName, {
            vpc: this.vpc,
            description: 'Security group for Lambda functions',
            allowAllOutbound: true,
        });
        // Lambda → Aurora接続許可
        this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow access from Lambda');
        // 開発環境の場合、特定CIDRからの直接アクセスを許可
        if (config.environment === 'dev') {
            config.security.allowedCidrBlocks.forEach((cidr, index) => {
                this.auroraSecurityGroup.addIngressRule(ec2.Peer.ipv4(cidr), ec2.Port.tcp(5432), `Allow dev access from ${cidr}`);
            });
        }
        // VPCエンドポイント（オプション）
        if (config.network.createVpcEndpoints) {
            this.createVpcEndpoints();
        }
        // VPCフローログ（オプション）
        if (config.security.enableVpcFlowLogs) {
            this.createVpcFlowLogs();
        }
        // タグ設定
        this.applyTags(config.tags);
    }
    createVpcEndpoints() {
        // S3 VPCエンドポイント
        this.vpc.addGatewayEndpoint('S3Endpoint', {
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        // Secrets Manager VPCエンドポイント
        this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            privateDnsEnabled: true,
        });
    }
    createVpcFlowLogs() {
        new ec2.FlowLog(this, 'VpcFlowLog', {
            resourceType: ec2.FlowLogResourceType.fromVpc(this.vpc),
            destination: ec2.FlowLogDestination.toCloudWatchLogs(),
        });
    }
    applyTags(tags) {
        Object.entries(tags).forEach(([key, value]) => {
            this.vpc.node.addMetadata(key, value);
        });
    }
}
exports.NetworkConstruct = NetworkConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsMkNBQXVDO0FBT3ZDLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFDN0IsR0FBRyxDQUFVO0lBQ2IsY0FBYyxDQUFnQjtJQUM5QixhQUFhLENBQWdCO0lBQzdCLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsUUFBUTtRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDMUQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQ25ELDRCQUE0QixFQUFFLElBQUk7WUFFbEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0I7b0JBQzVDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07aUJBQ2xDO2dCQUNEO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7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QyxHQUFHLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxHQUFHLENBQUMsNEJBQTRCLENBQUMsRUFBRTtTQUM3QyxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsRUFBRTtZQUN0RCxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLGVBQWU7WUFDM0QsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2xDLFlBQVksRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDdkQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRTtTQUN2RCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sU0FBUyxDQUFDLElBQStCO1FBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0hELDRDQTJIQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9jb25zdHJ1Y3RzL25ldHdvcmstY29uc3RydWN0LnRzXHJcblxyXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBFbnZpcm9ubWVudENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrQ29uc3RydWN0UHJvcHMge1xyXG4gIGNvbmZpZzogRW52aXJvbm1lbnRDb25maWc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuVnBjO1xyXG4gIHB1YmxpYyByZWFkb25seSBwcml2YXRlU3VibmV0czogZWMyLklTdWJuZXRbXTtcclxuICBwdWJsaWMgcmVhZG9ubHkgcHVibGljU3VibmV0czogZWMyLklTdWJuZXRbXTtcclxuICBwdWJsaWMgcmVhZG9ubHkgYXVyb3JhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgcHVibGljIHJlYWRvbmx5IGxhbWJkYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya0NvbnN0cnVjdFByb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnIH0gPSBwcm9wcztcclxuXHJcbiAgICAvLyBWUEPkvZzmiJBcclxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgY29uZmlnLm5ldHdvcmsubmFtaW5nLnZwY05hbWUsIHtcclxuICAgICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKGNvbmZpZy5uZXR3b3JrLnZwY0NpZHIpLFxyXG4gICAgICBhdmFpbGFiaWxpdHlab25lczogY29uZmlnLm5ldHdvcmsuYXZhaWxhYmlsaXR5Wm9uZXMsXHJcbiAgICAgIHJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXA6IHRydWUsXHJcbiAgICAgIFxyXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxyXG4gICAgICAgICAgbmFtZTogY29uZmlnLm5ldHdvcmsubmFtaW5nLnB1YmxpY1N1Ym5ldE5hbWUsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaWRyTWFzazogMjQsXHJcbiAgICAgICAgICBuYW1lOiBjb25maWcubmV0d29yay5uYW1pbmcucHJpdmF0ZVN1Ym5ldE5hbWUsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBjb25maWcubmV0d29yay5lbmFibGVOYXRHYXRld2F5IFxyXG4gICAgICAgICAgICA/IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgXHJcbiAgICAgICAgICAgIDogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBcclxuICAgICAgLy8gTkFU44Ky44O844OI44Km44Kn44Kk44Gu6Kit5a6aXHJcbiAgICAgIG5hdEdhdGV3YXlzOiBjb25maWcubmV0d29yay5lbmFibGVOYXRHYXRld2F5ID8gY29uZmlnLm5ldHdvcmsuYXZhaWxhYmlsaXR5Wm9uZXMubGVuZ3RoIDogMCxcclxuICAgICAgXHJcbiAgICAgIC8vIFZQQ+ODleODreODvOODreOCsFxyXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXHJcbiAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjgrXjg5bjg43jg4Pjg4jlj4LnhadcclxuICAgIHRoaXMucHJpdmF0ZVN1Ym5ldHMgPSB0aGlzLnZwYy5wcml2YXRlU3VibmV0cztcclxuICAgIHRoaXMucHVibGljU3VibmV0cyA9IHRoaXMudnBjLnB1YmxpY1N1Ym5ldHM7XHJcblxyXG4gICAgLy8gQXVyb3Jh55So44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OXXHJcbiAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgY29uZmlnLm5ldHdvcmsubmFtaW5nLmF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lLCB7XHJcbiAgICAgIHZwYzogdGhpcy52cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIEF1cm9yYSBTZXJ2ZXJsZXNzIHYyJyxcclxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOiHquWIhuiHqui6q+OBi+OCieOBruOCouOCr+OCu+OCueOCkuioseWPr++8iOWQjOOBmOOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl+WGhe+8iVxyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgJ0FsbG93IGFjY2VzcyBmcm9tIHNhbWUgc2VjdXJpdHkgZ3JvdXAnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIExhbWJkYeeUqOOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl1xyXG4gICAgdGhpcy5sYW1iZGFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsIGNvbmZpZy5uZXR3b3JrLm5hbWluZy5sYW1iZGFTZWN1cml0eUdyb3VwTmFtZSwge1xyXG4gICAgICB2cGM6IHRoaXMudnBjLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NlY3VyaXR5IGdyb3VwIGZvciBMYW1iZGEgZnVuY3Rpb25zJyxcclxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIExhbWJkYSDihpIgQXVyb3Jh5o6l57aa6Kix5Y+vXHJcbiAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoXHJcbiAgICAgIHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCxcclxuICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxyXG4gICAgICAnQWxsb3cgYWNjZXNzIGZyb20gTGFtYmRhJ1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyDplovnmbrnkrDlooPjga7loLTlkIjjgIHnibnlrppDSURS44GL44KJ44Gu55u05o6l44Ki44Kv44K744K544KS6Kix5Y+vXHJcbiAgICBpZiAoY29uZmlnLmVudmlyb25tZW50ID09PSAnZGV2Jykge1xyXG4gICAgICBjb25maWcuc2VjdXJpdHkuYWxsb3dlZENpZHJCbG9ja3MuZm9yRWFjaCgoY2lkciwgaW5kZXgpID0+IHtcclxuICAgICAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoXHJcbiAgICAgICAgICBlYzIuUGVlci5pcHY0KGNpZHIpLFxyXG4gICAgICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxyXG4gICAgICAgICAgYEFsbG93IGRldiBhY2Nlc3MgZnJvbSAke2NpZHJ9YFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZQQ+OCqOODs+ODieODneOCpOODs+ODiO+8iOOCquODl+OCt+ODp+ODs++8iVxyXG4gICAgaWYgKGNvbmZpZy5uZXR3b3JrLmNyZWF0ZVZwY0VuZHBvaW50cykge1xyXG4gICAgICB0aGlzLmNyZWF0ZVZwY0VuZHBvaW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZQQ+ODleODreODvOODreOCsO+8iOOCquODl+OCt+ODp+ODs++8iVxyXG4gICAgaWYgKGNvbmZpZy5zZWN1cml0eS5lbmFibGVWcGNGbG93TG9ncykge1xyXG4gICAgICB0aGlzLmNyZWF0ZVZwY0Zsb3dMb2dzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g44K/44Kw6Kit5a6aXHJcbiAgICB0aGlzLmFwcGx5VGFncyhjb25maWcudGFncyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVZwY0VuZHBvaW50cygpOiB2b2lkIHtcclxuICAgIC8vIFMzIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgdGhpcy52cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdTM0VuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNlY3JldHMgTWFuYWdlciBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4hcclxuICAgIHRoaXMudnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdTZWNyZXRzTWFuYWdlckVuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcclxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlVnBjRmxvd0xvZ3MoKTogdm9pZCB7XHJcbiAgICBuZXcgZWMyLkZsb3dMb2codGhpcywgJ1ZwY0Zsb3dMb2cnLCB7XHJcbiAgICAgIHJlc291cmNlVHlwZTogZWMyLkZsb3dMb2dSZXNvdXJjZVR5cGUuZnJvbVZwYyh0aGlzLnZwYyksXHJcbiAgICAgIGRlc3RpbmF0aW9uOiBlYzIuRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvQ2xvdWRXYXRjaExvZ3MoKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVRhZ3ModGFnczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xyXG4gICAgT2JqZWN0LmVudHJpZXModGFncykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgIHRoaXMudnBjLm5vZGUuYWRkTWV0YWRhdGEoa2V5LCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0iXX0=