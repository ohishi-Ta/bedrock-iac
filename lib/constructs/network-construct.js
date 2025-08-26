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
        // VPC作成
        this.vpc = new ec2.Vpc(this, config.network.naming.vpcName, {
            vpcName: config.network.naming.vpcName,
            ipAddresses: ec2.IpAddresses.cidr(config.network.vpcCidr),
            availabilityZones: config.network.availabilityZones,
            restrictDefaultSecurityGroup: true,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: config.network.naming.privateSubnetName,
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
            natGateways: 0,
        });
        // サブネットに名前タグを追加
        this.vpc.privateSubnets.forEach((subnet, index) => {
            cdk.Tags.of(subnet).add('Name', `${config.network.naming.privateSubnetName}-${index + 1}`);
        });
        // ルートテーブルに名前タグを追加
        this.vpc.node.children.forEach(child => {
            if (child.node.defaultChild?.constructor.name === 'CfnRouteTable') {
                cdk.Tags.of(child).add('Name', `${config.environment}-ragchat-route-table`);
            }
        });
        // Aurora用セキュリティグループ
        this.auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSG', {
            vpc: this.vpc,
            securityGroupName: config.network.naming.auroraSecurityGroupName,
            description: 'Security group for Aurora Serverless v2',
            allowAllOutbound: true,
        });
        // 自分自身からのアクセスを許可
        this.auroraSecurityGroup.addIngressRule(this.auroraSecurityGroup, ec2.Port.tcp(5432), 'Allow access from same security group');
        // Lambda用セキュリティグループ
        this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', {
            vpc: this.vpc,
            securityGroupName: config.network.naming.lambdaSecurityGroupName,
            description: 'Security group for Lambda functions',
            allowAllOutbound: true,
        });
        // Lambda → Aurora接続許可
        this.auroraSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow access from Lambda');
        // S3 VPCエンドポイント
        const s3Endpoint = this.vpc.addGatewayEndpoint('S3Endpoint', {
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        cdk.Tags.of(s3Endpoint).add('Name', `${config.environment}-ragchat-s3-endpoint`);
        // Secrets Manager VPCエンドポイント
        const secretsEndpoint = this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            privateDnsEnabled: true,
        });
        cdk.Tags.of(secretsEndpoint).add('Name', `${config.environment}-ragchat-secrets-endpoint`);
    }
}
exports.NetworkConstruct = NetworkConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsaURBQW1DO0FBQ25DLDJDQUF1QztBQU92QyxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdCLEdBQUcsQ0FBVTtJQUNiLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsUUFBUTtRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDMUQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU87WUFDdEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQ25ELDRCQUE0QixFQUFFLElBQUk7WUFFbEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7b0JBQzdDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtpQkFDNUM7YUFDRjtZQUVELFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsZ0JB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RixDQUFDO0NBQ0Y7QUFuRkQsNENBbUZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2NvbnN0cnVjdHMvbmV0d29yay1jb25zdHJ1Y3QudHNcclxuXHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtDb25zdHJ1Y3RQcm9wcyB7XHJcbiAgY29uZmlnOiBFbnZpcm9ubWVudENvbmZpZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5WcGM7XHJcbiAgcHVibGljIHJlYWRvbmx5IGF1cm9yYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGFTZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5ldHdvcmtDb25zdHJ1Y3RQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICBjb25zdCB7IGNvbmZpZyB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8gVlBD5L2c5oiQXHJcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIGNvbmZpZy5uZXR3b3JrLm5hbWluZy52cGNOYW1lLCB7XHJcbiAgICAgIHZwY05hbWU6IGNvbmZpZy5uZXR3b3JrLm5hbWluZy52cGNOYW1lLFxyXG4gICAgICBpcEFkZHJlc3NlczogZWMyLklwQWRkcmVzc2VzLmNpZHIoY29uZmlnLm5ldHdvcmsudnBjQ2lkciksXHJcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBjb25maWcubmV0d29yay5hdmFpbGFiaWxpdHlab25lcyxcclxuICAgICAgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogdHJ1ZSxcclxuICAgICAgXHJcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaWRyTWFzazogMjQsXHJcbiAgICAgICAgICBuYW1lOiBjb25maWcubmV0d29yay5uYW1pbmcucHJpdmF0ZVN1Ym5ldE5hbWUsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIFxyXG4gICAgICBuYXRHYXRld2F5czogMCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOOCteODluODjeODg+ODiOOBq+WQjeWJjeOCv+OCsOOCkui/veWKoFxyXG4gICAgdGhpcy52cGMucHJpdmF0ZVN1Ym5ldHMuZm9yRWFjaCgoc3VibmV0LCBpbmRleCkgPT4ge1xyXG4gICAgICBjZGsuVGFncy5vZihzdWJuZXQpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5uZXR3b3JrLm5hbWluZy5wcml2YXRlU3VibmV0TmFtZX0tJHtpbmRleCArIDF9YCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDjg6vjg7zjg4jjg4bjg7zjg5bjg6vjgavlkI3liY3jgr/jgrDjgpLov73liqBcclxuICAgIHRoaXMudnBjLm5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XHJcbiAgICAgIGlmIChjaGlsZC5ub2RlLmRlZmF1bHRDaGlsZD8uY29uc3RydWN0b3IubmFtZSA9PT0gJ0NmblJvdXRlVGFibGUnKSB7XHJcbiAgICAgICAgY2RrLlRhZ3Mub2YoY2hpbGQpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tcmFnY2hhdC1yb3V0ZS10YWJsZWApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBdXJvcmHnlKjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5dcclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQXVyb3JhU0cnLCB7XHJcbiAgICAgIHZwYzogdGhpcy52cGMsXHJcbiAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiBjb25maWcubmV0d29yay5uYW1pbmcuYXVyb3JhU2VjdXJpdHlHcm91cE5hbWUsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgZ3JvdXAgZm9yIEF1cm9yYSBTZXJ2ZXJsZXNzIHYyJyxcclxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOiHquWIhuiHqui6q+OBi+OCieOBruOCouOCr+OCu+OCueOCkuioseWPr1xyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmF1cm9yYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgJ0FsbG93IGFjY2VzcyBmcm9tIHNhbWUgc2VjdXJpdHkgZ3JvdXAnXHJcbiAgICApO1xyXG5cclxuICAgIC8vIExhbWJkYeeUqOOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl1xyXG4gICAgdGhpcy5sYW1iZGFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdMYW1iZGFTRycsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6IGNvbmZpZy5uZXR3b3JrLm5hbWluZy5sYW1iZGFTZWN1cml0eUdyb3VwTmFtZSxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgTGFtYmRhIGZ1bmN0aW9ucycsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMYW1iZGEg4oaSIEF1cm9yYeaOpee2muioseWPr1xyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgJ0FsbG93IGFjY2VzcyBmcm9tIExhbWJkYSdcclxuICAgICk7XHJcblxyXG4gICAgLy8gUzMgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OIXHJcbiAgICBjb25zdCBzM0VuZHBvaW50ID0gdGhpcy52cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdTM0VuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcclxuICAgIH0pO1xyXG4gICAgY2RrLlRhZ3Mub2YoczNFbmRwb2ludCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1yYWdjaGF0LXMzLWVuZHBvaW50YCk7XHJcblxyXG4gICAgLy8gU2VjcmV0cyBNYW5hZ2VyIFZQQ+OCqOODs+ODieODneOCpOODs+ODiFxyXG4gICAgY29uc3Qgc2VjcmV0c0VuZHBvaW50ID0gdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1NlY3JldHNNYW5hZ2VyRW5kcG9pbnQnLCB7XHJcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxyXG4gICAgICBwcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgY2RrLlRhZ3Mub2Yoc2VjcmV0c0VuZHBvaW50KS5hZGQoJ05hbWUnLCBgJHtjb25maWcuZW52aXJvbm1lbnR9LXJhZ2NoYXQtc2VjcmV0cy1lbmRwb2ludGApO1xyXG4gIH1cclxufSJdfQ==