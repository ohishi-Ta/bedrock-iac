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
const cdk = __importStar(require("aws-cdk-lib"));
const constructs_1 = require("constructs");
class NetworkConstruct extends constructs_1.Construct {
    vpc;
    auroraSecurityGroup;
    lambdaSecurityGroup;
    constructor(scope, id, props) {
        super(scope, id);
        const { config } = props;
        // VPC作成（物理名の指定なし）
        this.vpc = new ec2.Vpc(this, 'Vpc', {
            ipAddresses: ec2.IpAddresses.cidr(config.network.vpcCidr),
            availabilityZones: config.network.availabilityZones,
            restrictDefaultSecurityGroup: true,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'PrivateIsolated',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
            natGateways: 0,
        });
        // VPCにタグを追加（識別用）
        cdk.Tags.of(this.vpc).add('Name', `${config.environment}-vpc`);
        cdk.Tags.of(this.vpc).add('Type', 'VPC');
        // Aurora用セキュリティグループ（物理名の指定なし）
        this.auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for Aurora Serverless v2',
            allowAllOutbound: true,
        });
        // Auroraセキュリティグループにタグを追加
        cdk.Tags.of(this.auroraSecurityGroup).add('Name', `${config.environment}-aurora-sg`);
        cdk.Tags.of(this.auroraSecurityGroup).add('Type', 'AuroraSecurityGroup');
        // 自分自身からのアクセスを許可
        this.auroraSecurityGroup.addIngressRule(this.auroraSecurityGroup, ec2.Port.tcp(5432), 'Allow access from same security group');
        // Lambda用セキュリティグループ（物理名の指定なし）
        this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for Lambda functions',
            allowAllOutbound: true,
        });
        // Lambdaセキュリティグループにタグを追加
        cdk.Tags.of(this.lambdaSecurityGroup).add('Name', `${config.environment}-lambda-sg`);
        cdk.Tags.of(this.lambdaSecurityGroup).add('Type', 'LambdaSecurityGroup');
        // Lambda → Aurora接続許可
        this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow access from Lambda');
        // S3 VPCエンドポイント
        this.vpc.addGatewayEndpoint('S3GatewayEndpoint', {
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        // Secrets Manager VPCエンドポイント
        this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            privateDnsEnabled: true,
        });
        // RDS Data API VPCエンドポイント（Auroraのデータアクセス用）
        this.vpc.addInterfaceEndpoint('RdsDataEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.RDS_DATA,
            privateDnsEnabled: true,
        });
    }
}
exports.NetworkConstruct = NetworkConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsaURBQW1DO0FBQ25DLDJDQUF1QztBQU92QyxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdCLEdBQUcsQ0FBVTtJQUNiLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQ25ELDRCQUE0QixFQUFFLElBQUk7WUFFbEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtpQkFDNUM7YUFDRjtZQUVELFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsTUFBTSxDQUFDLENBQUM7UUFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekMsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzVFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVcsRUFBRSx5Q0FBeUM7WUFDdEQsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLFlBQVksQ0FBQyxDQUFDO1FBQ3JGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUV6RSxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FDckMsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsdUNBQXVDLENBQ3hDLENBQUM7UUFFRiw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDNUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsV0FBVyxFQUFFLHFDQUFxQztZQUNsRCxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsWUFBWSxDQUFDLENBQUM7UUFDckYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBRXpFLHNCQUFzQjtRQUN0QixJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUNyQyxJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUNsQiwwQkFBMEIsQ0FDM0IsQ0FBQztRQUVGLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFO1lBQy9DLE9BQU8sRUFBRSxHQUFHLENBQUMsNEJBQTRCLENBQUMsRUFBRTtTQUM3QyxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsRUFBRTtZQUN0RCxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLGVBQWU7WUFDM0QsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCwyQ0FBMkM7UUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRTtZQUNoRCxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFFBQVE7WUFDcEQsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFwRkQsNENBb0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2NvbnN0cnVjdHMvbmV0d29yay1jb25zdHJ1Y3QudHNcclxuXHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtDb25zdHJ1Y3RQcm9wcyB7XHJcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5WcGM7XHJcbiAgcHVibGljIHJlYWRvbmx5IGF1cm9yYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGFTZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5ldHdvcmtDb25zdHJ1Y3RQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICBjb25zdCB7IGNvbmZpZyB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8gVlBD5L2c5oiQ77yI54mp55CG5ZCN44Gu5oyH5a6a44Gq44GX77yJXHJcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7XHJcbiAgICAgIGlwQWRkcmVzc2VzOiBlYzIuSXBBZGRyZXNzZXMuY2lkcihjb25maWcubmV0d29yay52cGNDaWRyKSxcclxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IGNvbmZpZy5uZXR3b3JrLmF2YWlsYWJpbGl0eVpvbmVzLFxyXG4gICAgICByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiB0cnVlLFxyXG4gICAgICBcclxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcclxuICAgICAgICAgIG5hbWU6ICdQcml2YXRlSXNvbGF0ZWQnLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBcclxuICAgICAgbmF0R2F0ZXdheXM6IDAsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBWUEPjgavjgr/jgrDjgpLov73liqDvvIjorZjliKXnlKjvvIlcclxuICAgIGNkay5UYWdzLm9mKHRoaXMudnBjKS5hZGQoJ05hbWUnLCBgJHtjb25maWcuZW52aXJvbm1lbnR9LXZwY2ApO1xyXG4gICAgY2RrLlRhZ3Mub2YodGhpcy52cGMpLmFkZCgnVHlwZScsICdWUEMnKTtcclxuXHJcbiAgICAvLyBBdXJvcmHnlKjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5fvvIjniannkIblkI3jga7mjIflrprjgarjgZfvvIlcclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQXVyb3JhU2VjdXJpdHlHcm91cCcsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgQXVyb3JhIFNlcnZlcmxlc3MgdjInLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXVyb3Jh44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXApLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tYXVyb3JhLXNnYCk7XHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXApLmFkZCgnVHlwZScsICdBdXJvcmFTZWN1cml0eUdyb3VwJyk7XHJcblxyXG4gICAgLy8g6Ieq5YiG6Ieq6Lqr44GL44KJ44Gu44Ki44Kv44K744K544KS6Kix5Y+vXHJcbiAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoXHJcbiAgICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCxcclxuICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxyXG4gICAgICAnQWxsb3cgYWNjZXNzIGZyb20gc2FtZSBzZWN1cml0eSBncm91cCdcclxuICAgICk7XHJcblxyXG4gICAgLy8gTGFtYmRh55So44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX77yI54mp55CG5ZCN44Gu5oyH5a6a44Gq44GX77yJXHJcbiAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ0xhbWJkYVNlY3VyaXR5R3JvdXAnLCB7XHJcbiAgICAgIHZwYzogdGhpcy52cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIExhbWJkYSBmdW5jdGlvbnMnLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTGFtYmRh44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXApLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tbGFtYmRhLXNnYCk7XHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXApLmFkZCgnVHlwZScsICdMYW1iZGFTZWN1cml0eUdyb3VwJyk7XHJcblxyXG4gICAgLy8gTGFtYmRhIOKGkiBBdXJvcmHmjqXntproqLHlj69cclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgdGhpcy5sYW1iZGFTZWN1cml0eUdyb3VwLFxyXG4gICAgICBlYzIuUG9ydC50Y3AoNTQzMiksXHJcbiAgICAgICdBbGxvdyBhY2Nlc3MgZnJvbSBMYW1iZGEnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIFMzIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgdGhpcy52cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdTM0dhdGV3YXlFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy8gU2VjcmV0cyBNYW5hZ2VyIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1NlY3JldHNNYW5hZ2VyRW5kcG9pbnQnLCB7XHJcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxyXG4gICAgICBwcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJEUyBEYXRhIEFQSSBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4jvvIhBdXJvcmHjga7jg4fjg7zjgr/jgqLjgq/jgrvjgrnnlKjvvIlcclxuICAgICB0aGlzLnZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnUmRzRGF0YUVuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlJEU19EQVRBLFxyXG4gICAgICBwcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==