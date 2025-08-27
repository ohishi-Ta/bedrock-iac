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
        // Aurora用セキュリティグループ（物理名の指定なし）
        this.auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for Aurora Serverless v2',
            allowAllOutbound: true,
        });
        // Auroraセキュリティグループにタグを追加
        cdk.Tags.of(this.auroraSecurityGroup).add('Name', `${config.environment}-aurora-sg`);
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
        // Lambda → Aurora接続許可
        this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow access from Lambda');
        // S3 VPCエンドポイント
        this.vpc.addGatewayEndpoint('S3GatewayEndpoint', {
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        // // Secrets Manager VPCエンドポイント
        const secretsManagerEndpoint = this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            privateDnsEnabled: true,
        });
        // Secrets Manager VPCエンドポイントにタグを追加
        cdk.Tags.of(secretsManagerEndpoint).add('Name', `${config.environment}-SecretsManagerEndpoint`);
        // RdsDataEndpoint VPCエンドポイント
        const rdsDataEndpoint = this.vpc.addInterfaceEndpoint('RdsDataEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.RDS_DATA,
            privateDnsEnabled: true,
        });
        // RdsDataEndpoint VPCエンドポイントにタグを追加
        cdk.Tags.of(rdsDataEndpoint).add('Name', `${config.environment}-RdsDataEndpoint`);
    }
}
exports.NetworkConstruct = NetworkConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsaURBQW1DO0FBQ25DLDJDQUF1QztBQU92QyxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdCLEdBQUcsQ0FBVTtJQUNiLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQ25ELDRCQUE0QixFQUFFLElBQUk7WUFFbEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtpQkFDNUM7YUFDRjtZQUVELFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsTUFBTSxDQUFDLENBQUM7UUFFL0QsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzVFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVcsRUFBRSx5Q0FBeUM7WUFDdEQsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLFlBQVksQ0FBQyxDQUFDO1FBRXJGLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUNyQyxJQUFJLENBQUMsbUJBQW1CLEVBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUNsQix1Q0FBdUMsQ0FDeEMsQ0FBQztRQUVGLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM1RSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixXQUFXLEVBQUUscUNBQXFDO1lBQ2xELGdCQUFnQixFQUFFLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgseUJBQXlCO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxZQUFZLENBQUMsQ0FBQztRQUVyRixzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FDckMsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsMEJBQTBCLENBQzNCLENBQUM7UUFFRixnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRTtZQUMvQyxPQUFPLEVBQUUsR0FBRyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsZ0NBQWdDO1FBQ2hDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsRUFBRTtZQUNyRixPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLGVBQWU7WUFDM0QsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxtQ0FBbUM7UUFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcseUJBQXlCLENBQUMsQ0FBQztRQUVoRyw2QkFBNkI7UUFDN0IsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRTtZQUN2RSxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFFBQVE7WUFDcEQsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxtQ0FBbUM7UUFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLGtCQUFrQixDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUNGO0FBdkZELDRDQXVGQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9jb25zdHJ1Y3RzL25ldHdvcmstY29uc3RydWN0LnRzXHJcblxyXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBFbnZpcm9ubWVudENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9lbnZpcm9ubWVudC1jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrQ29uc3RydWN0UHJvcHMge1xyXG4gIGNvbmZpZzogRW52aXJvbm1lbnRDb25maWc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuVnBjO1xyXG4gIHB1YmxpYyByZWFkb25seSBhdXJvcmFTZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcclxuICBwdWJsaWMgcmVhZG9ubHkgbGFtYmRhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrQ29uc3RydWN0UHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgY29uc3QgeyBjb25maWcgfSA9IHByb3BzO1xyXG5cclxuICAgIC8vIFZQQ+S9nOaIkO+8iOeJqeeQhuWQjeOBruaMh+WumuOBquOBl++8iVxyXG4gICAgdGhpcy52cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywge1xyXG4gICAgICBpcEFkZHJlc3NlczogZWMyLklwQWRkcmVzc2VzLmNpZHIoY29uZmlnLm5ldHdvcmsudnBjQ2lkciksXHJcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBjb25maWcubmV0d29yay5hdmFpbGFiaWxpdHlab25lcyxcclxuICAgICAgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogdHJ1ZSxcclxuICAgICAgXHJcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaWRyTWFzazogMjQsXHJcbiAgICAgICAgICBuYW1lOiAnUHJpdmF0ZUlzb2xhdGVkJyxcclxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgXHJcbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVlBD44Gr44K/44Kw44KS6L+95Yqg77yI6K2Y5Yil55So77yJXHJcbiAgICBjZGsuVGFncy5vZih0aGlzLnZwYykuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS12cGNgKTtcclxuXHJcbiAgICAvLyBBdXJvcmHnlKjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5fvvIjniannkIblkI3jga7mjIflrprjgarjgZfvvIlcclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQXVyb3JhU2VjdXJpdHlHcm91cCcsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgQXVyb3JhIFNlcnZlcmxlc3MgdjInLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXVyb3Jh44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXApLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tYXVyb3JhLXNnYCk7XHJcblxyXG4gICAgLy8g6Ieq5YiG6Ieq6Lqr44GL44KJ44Gu44Ki44Kv44K744K544KS6Kix5Y+vXHJcbiAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoXHJcbiAgICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCxcclxuICAgICAgZWMyLlBvcnQudGNwKDU0MzIpLFxyXG4gICAgICAnQWxsb3cgYWNjZXNzIGZyb20gc2FtZSBzZWN1cml0eSBncm91cCdcclxuICAgICk7XHJcblxyXG4gICAgLy8gTGFtYmRh55So44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX77yI54mp55CG5ZCN44Gu5oyH5a6a44Gq44GX77yJXHJcbiAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ0xhbWJkYVNlY3VyaXR5R3JvdXAnLCB7XHJcbiAgICAgIHZwYzogdGhpcy52cGMsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIExhbWJkYSBmdW5jdGlvbnMnLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTGFtYmRh44K744Kt44Ol44Oq44OG44Kj44Kw44Or44O844OX44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICBjZGsuVGFncy5vZih0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXApLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tbGFtYmRhLXNnYCk7XHJcblxyXG4gICAgLy8gTGFtYmRhIOKGkiBBdXJvcmHmjqXntproqLHlj69cclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgdGhpcy5sYW1iZGFTZWN1cml0eUdyb3VwLFxyXG4gICAgICBlYzIuUG9ydC50Y3AoNTQzMiksXHJcbiAgICAgICdBbGxvdyBhY2Nlc3MgZnJvbSBMYW1iZGEnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIFMzIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgdGhpcy52cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdTM0dhdGV3YXlFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy8gLy8gU2VjcmV0cyBNYW5hZ2VyIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgY29uc3Qgc2VjcmV0c01hbmFnZXJFbmRwb2ludCA9IHRoaXMudnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdTZWNyZXRzTWFuYWdlckVuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcclxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZWNyZXRzIE1hbmFnZXIgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OI44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICBjZGsuVGFncy5vZihzZWNyZXRzTWFuYWdlckVuZHBvaW50KS5hZGQoJ05hbWUnLCBgJHtjb25maWcuZW52aXJvbm1lbnR9LVNlY3JldHNNYW5hZ2VyRW5kcG9pbnRgKTtcclxuXHJcbiAgICAvLyBSZHNEYXRhRW5kcG9pbnQgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OIXHJcbiAgICBjb25zdCByZHNEYXRhRW5kcG9pbnQgPSB0aGlzLnZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnUmRzRGF0YUVuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlJEU19EQVRBLFxyXG4gICAgICBwcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJkc0RhdGFFbmRwb2ludCBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4jjgavjgr/jgrDjgpLov73liqBcclxuICAgIGNkay5UYWdzLm9mKHJkc0RhdGFFbmRwb2ludCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1SZHNEYXRhRW5kcG9pbnRgKTtcclxuICB9XHJcbn0iXX0=