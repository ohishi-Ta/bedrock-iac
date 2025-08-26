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
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
class NetworkStack extends cdk.Stack {
    networkConstruct;
    constructor(scope, id, props) {
        super(scope, id, props);
        // VPC作成
        const vpc = new ec2.Vpc(this, 'Vpc', {
            maxAzs: 2,
            natGateways: 0, // NAT Gatewayは不要
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Database',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
        // セキュリティグループ作成
        const auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSecurityGroup', {
            vpc,
            description: 'Security group for Aurora PostgreSQL',
            allowAllOutbound: false,
        });
        const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
            vpc,
            description: 'Security group for Lambda functions',
            allowAllOutbound: true, // AWSサービスへのアクセスを許可
        });
        // Aurora用のインバウンドルール
        auroraSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow Lambda to connect to Aurora PostgreSQL');
        // VPCエンドポイント用のセキュリティグループ
        const vpcEndpointSecurityGroup = new ec2.SecurityGroup(this, 'VpcEndpointSecurityGroup', {
            vpc,
            description: 'Security group for VPC endpoints',
            allowAllOutbound: false,
        });
        // VPCエンドポイントへのHTTPSアクセスを許可
        vpcEndpointSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(443), 'Allow Lambda to access VPC endpoints');
        // Secrets Manager VPCエンドポイント
        new ec2.InterfaceVpcEndpoint(this, 'SecretsManagerEndpoint', {
            vpc,
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            subnets: {
                subnets: vpc.isolatedSubnets,
            },
            securityGroups: [vpcEndpointSecurityGroup],
            privateDnsEnabled: true,
        });
        // S3 VPCエンドポイント（ゲートウェイタイプ）
        new ec2.GatewayVpcEndpoint(this, 'S3Endpoint', {
            vpc,
            service: ec2.GatewayVpcEndpointAwsService.S3,
            subnets: [
                {
                    subnets: vpc.isolatedSubnets,
                },
            ],
        });
        // 出力
        this.networkConstruct = {
            vpc,
            auroraSecurityGroup,
            lambdaSecurityGroup,
        };
    }
}
exports.NetworkStack = NetworkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFOUIsaURBQW1DO0FBQ25DLHlEQUEyQztBQUczQyxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QixnQkFBZ0IsQ0FJOUI7SUFFRixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVDO1FBQy9FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUNuQyxNQUFNLEVBQUUsQ0FBQztZQUNULFdBQVcsRUFBRSxDQUFDLEVBQUUsaUJBQWlCO1lBQ2pDLG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO2lCQUM1QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsZUFBZTtRQUNmLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM3RSxHQUFHO1lBQ0gsV0FBVyxFQUFFLHNDQUFzQztZQUNuRCxnQkFBZ0IsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztRQUVILE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM3RSxHQUFHO1lBQ0gsV0FBVyxFQUFFLHFDQUFxQztZQUNsRCxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsbUJBQW1CO1NBQzVDLENBQUMsQ0FBQztRQUVILG9CQUFvQjtRQUNwQixtQkFBbUIsQ0FBQyxjQUFjLENBQ2hDLG1CQUFtQixFQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsOENBQThDLENBQy9DLENBQUM7UUFFRix5QkFBeUI7UUFDekIsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQ3ZGLEdBQUc7WUFDSCxXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsMkJBQTJCO1FBQzNCLHdCQUF3QixDQUFDLGNBQWMsQ0FDckMsbUJBQW1CLEVBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNqQixzQ0FBc0MsQ0FDdkMsQ0FBQztRQUVGLDZCQUE2QjtRQUM3QixJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDM0QsR0FBRztZQUNILE9BQU8sRUFBRSxHQUFHLENBQUMsOEJBQThCLENBQUMsZUFBZTtZQUMzRCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLEdBQUcsQ0FBQyxlQUFlO2FBQzdCO1lBQ0QsY0FBYyxFQUFFLENBQUMsd0JBQXdCLENBQUM7WUFDMUMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCwyQkFBMkI7UUFDM0IsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM3QyxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFO1lBQzVDLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxPQUFPLEVBQUUsR0FBRyxDQUFDLGVBQWU7aUJBQzdCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxLQUFLO1FBQ0wsSUFBSSxDQUFDLGdCQUFnQixHQUFHO1lBQ3RCLEdBQUc7WUFDSCxtQkFBbUI7WUFDbkIsbUJBQW1CO1NBQ3BCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF0RkQsb0NBc0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3N0YWNrcy9uZXR3b3JrLXN0YWNrLnRzXHJcblxyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtDb25zdHJ1Y3Q6IHtcclxuICAgIHZwYzogZWMyLlZwYztcclxuICAgIGF1cm9yYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG4gICAgbGFtYmRhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzICYgeyBjb25maWc6IGFueSB9KSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAvLyBWUEPkvZzmiJBcclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7XHJcbiAgICAgIG1heEF6czogMixcclxuICAgICAgbmF0R2F0ZXdheXM6IDAsIC8vIE5BVCBHYXRld2F544Gv5LiN6KaBXHJcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaWRyTWFzazogMjQsXHJcbiAgICAgICAgICBuYW1lOiAnRGF0YWJhc2UnLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX5L2c5oiQXHJcbiAgICBjb25zdCBhdXJvcmFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdBdXJvcmFTZWN1cml0eUdyb3VwJywge1xyXG4gICAgICB2cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIEF1cm9yYSBQb3N0Z3JlU1FMJyxcclxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsYW1iZGFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdMYW1iZGFTZWN1cml0eUdyb3VwJywge1xyXG4gICAgICB2cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIExhbWJkYSBmdW5jdGlvbnMnLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLCAvLyBBV1PjgrXjg7zjg5Pjgrnjgbjjga7jgqLjgq/jgrvjgrnjgpLoqLHlj69cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEF1cm9yYeeUqOOBruOCpOODs+ODkOOCpuODs+ODieODq+ODvOODq1xyXG4gICAgYXVyb3JhU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cCxcclxuICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxyXG4gICAgICAnQWxsb3cgTGFtYmRhIHRvIGNvbm5lY3QgdG8gQXVyb3JhIFBvc3RncmVTUUwnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIFZQQ+OCqOODs+ODieODneOCpOODs+ODiOeUqOOBruOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl1xyXG4gICAgY29uc3QgdnBjRW5kcG9pbnRTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdWcGNFbmRwb2ludFNlY3VyaXR5R3JvdXAnLCB7XHJcbiAgICAgIHZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgVlBDIGVuZHBvaW50cycsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVlBD44Ko44Oz44OJ44Od44Kk44Oz44OI44G444GuSFRUUFPjgqLjgq/jgrvjgrnjgpLoqLHlj69cclxuICAgIHZwY0VuZHBvaW50U2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cCxcclxuICAgICAgZWMyLlBvcnQudGNwKDQ0MyksXHJcbiAgICAgICdBbGxvdyBMYW1iZGEgdG8gYWNjZXNzIFZQQyBlbmRwb2ludHMnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIFNlY3JldHMgTWFuYWdlciBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4hcclxuICAgIG5ldyBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnQodGhpcywgJ1NlY3JldHNNYW5hZ2VyRW5kcG9pbnQnLCB7XHJcbiAgICAgIHZwYyxcclxuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5TRUNSRVRTX01BTkFHRVIsXHJcbiAgICAgIHN1Ym5ldHM6IHtcclxuICAgICAgICBzdWJuZXRzOiB2cGMuaXNvbGF0ZWRTdWJuZXRzLFxyXG4gICAgICB9LFxyXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ZwY0VuZHBvaW50U2VjdXJpdHlHcm91cF0sXHJcbiAgICAgIHByaXZhdGVEbnNFbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUzMgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OI77yI44Ky44O844OI44Km44Kn44Kk44K/44Kk44OX77yJXHJcbiAgICBuZXcgZWMyLkdhdGV3YXlWcGNFbmRwb2ludCh0aGlzLCAnUzNFbmRwb2ludCcsIHtcclxuICAgICAgdnBjLFxyXG4gICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcclxuICAgICAgc3VibmV0czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHN1Ym5ldHM6IHZwYy5pc29sYXRlZFN1Ym5ldHMsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOWHuuWKm1xyXG4gICAgdGhpcy5uZXR3b3JrQ29uc3RydWN0ID0ge1xyXG4gICAgICB2cGMsXHJcbiAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXAsXHJcbiAgICB9O1xyXG4gIH1cclxufSJdfQ==