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
        // サブネットにタグを追加
        this.vpc.privateSubnets.forEach((subnet, index) => {
            cdk.Tags.of(subnet).add('Name', `${config.environment}-private-subnet-${index + 1}`);
            cdk.Tags.of(subnet).add('Type', 'PrivateIsolatedSubnet');
        });
        // ルートテーブルにタグを追加
        this.vpc.privateSubnets.forEach((subnet, index) => {
            const cfnSubnet = subnet.node.defaultChild;
            const routeTable = cfnSubnet.node.findChild('RouteTable');
            cdk.Tags.of(routeTable).add('Name', `${config.environment}-private-rt-${index + 1}`);
        });
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
        const s3Endpoint = this.vpc.addGatewayEndpoint('S3GatewayEndpoint', {
            service: ec2.GatewayVpcEndpointAwsService.S3,
        });
        cdk.Tags.of(s3Endpoint).add('Name', `${config.environment}-s3-endpoint`);
        cdk.Tags.of(s3Endpoint).add('Type', 'S3GatewayEndpoint');
        // Secrets Manager VPCエンドポイント
        const secretsEndpoint = this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            privateDnsEnabled: true,
        });
        cdk.Tags.of(secretsEndpoint).add('Name', `${config.environment}-secrets-endpoint`);
        cdk.Tags.of(secretsEndpoint).add('Type', 'SecretsManagerEndpoint');
        // RDS Data API VPCエンドポイント（Auroraのデータアクセス用）
        const rdsDataEndpoint = this.vpc.addInterfaceEndpoint('RdsDataEndpoint', {
            service: ec2.InterfaceVpcEndpointAwsService.RDS_DATA,
            privateDnsEnabled: true,
        });
        cdk.Tags.of(rdsDataEndpoint).add('Name', `${config.environment}-rds-data-endpoint`);
        cdk.Tags.of(rdsDataEndpoint).add('Type', 'RdsDataEndpoint');
    }
}
exports.NetworkConstruct = NetworkConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsaURBQW1DO0FBQ25DLDJDQUF1QztBQU92QyxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdCLEdBQUcsQ0FBVTtJQUNiLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBQ25ELDRCQUE0QixFQUFFLElBQUk7WUFFbEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtpQkFDNUM7YUFDRjtZQUVELFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsTUFB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QUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLG9CQUFvQixDQUFDLENBQUM7UUFDcEYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDRjtBQXZHRCw0Q0F1R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uc3RydWN0cy9uZXR3b3JrLWNvbnN0cnVjdC50c1xyXG5cclxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0NvbnN0cnVjdFByb3BzIHtcclxuICBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29ya0NvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcclxuICBwdWJsaWMgcmVhZG9ubHkgYXVyb3JhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgcHVibGljIHJlYWRvbmx5IGxhbWJkYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya0NvbnN0cnVjdFByb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnIH0gPSBwcm9wcztcclxuXHJcbiAgICAvLyBWUEPkvZzmiJDvvIjniannkIblkI3jga7mjIflrprjgarjgZfvvIlcclxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHtcclxuICAgICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKGNvbmZpZy5uZXR3b3JrLnZwY0NpZHIpLFxyXG4gICAgICBhdmFpbGFiaWxpdHlab25lczogY29uZmlnLm5ldHdvcmsuYXZhaWxhYmlsaXR5Wm9uZXMsXHJcbiAgICAgIHJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXA6IHRydWUsXHJcbiAgICAgIFxyXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxyXG4gICAgICAgICAgbmFtZTogJ1ByaXZhdGVJc29sYXRlZCcsXHJcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIFxyXG4gICAgICBuYXRHYXRld2F5czogMCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFZQQ+OBq+OCv+OCsOOCkui/veWKoO+8iOitmOWIpeeUqO+8iVxyXG4gICAgY2RrLlRhZ3Mub2YodGhpcy52cGMpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tdnBjYCk7XHJcbiAgICBjZGsuVGFncy5vZih0aGlzLnZwYykuYWRkKCdUeXBlJywgJ1ZQQycpO1xyXG5cclxuICAgIC8vIOOCteODluODjeODg+ODiOOBq+OCv+OCsOOCkui/veWKoFxyXG4gICAgdGhpcy52cGMucHJpdmF0ZVN1Ym5ldHMuZm9yRWFjaCgoc3VibmV0LCBpbmRleCkgPT4ge1xyXG4gICAgICBjZGsuVGFncy5vZihzdWJuZXQpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tcHJpdmF0ZS1zdWJuZXQtJHtpbmRleCArIDF9YCk7XHJcbiAgICAgIGNkay5UYWdzLm9mKHN1Ym5ldCkuYWRkKCdUeXBlJywgJ1ByaXZhdGVJc29sYXRlZFN1Ym5ldCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g44Or44O844OI44OG44O844OW44Or44Gr44K/44Kw44KS6L+95YqgXHJcbiAgICB0aGlzLnZwYy5wcml2YXRlU3VibmV0cy5mb3JFYWNoKChzdWJuZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGNmblN1Ym5ldCA9IHN1Ym5ldC5ub2RlLmRlZmF1bHRDaGlsZCBhcyBlYzIuQ2ZuU3VibmV0O1xyXG4gICAgICBjb25zdCByb3V0ZVRhYmxlID0gY2ZuU3VibmV0Lm5vZGUuZmluZENoaWxkKCdSb3V0ZVRhYmxlJykgYXMgZWMyLkNmblJvdXRlVGFibGU7XHJcbiAgICAgIGNkay5UYWdzLm9mKHJvdXRlVGFibGUpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tcHJpdmF0ZS1ydC0ke2luZGV4ICsgMX1gKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEF1cm9yYeeUqOOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl++8iOeJqeeQhuWQjeOBruaMh+WumuOBquOBl++8iVxyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdBdXJvcmFTZWN1cml0eUdyb3VwJywge1xyXG4gICAgICB2cGM6IHRoaXMudnBjLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NlY3VyaXR5IGdyb3VwIGZvciBBdXJvcmEgU2VydmVybGVzcyB2MicsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBdXJvcmHjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5fjgavjgr/jgrDjgpLov73liqBcclxuICAgIGNkay5UYWdzLm9mKHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1hdXJvcmEtc2dgKTtcclxuICAgIGNkay5UYWdzLm9mKHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cCkuYWRkKCdUeXBlJywgJ0F1cm9yYVNlY3VyaXR5R3JvdXAnKTtcclxuXHJcbiAgICAvLyDoh6rliIboh6rouqvjgYvjgonjga7jgqLjgq/jgrvjgrnjgpLoqLHlj69cclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLFxyXG4gICAgICBlYzIuUG9ydC50Y3AoNTQzMiksXHJcbiAgICAgICdBbGxvdyBhY2Nlc3MgZnJvbSBzYW1lIHNlY3VyaXR5IGdyb3VwJ1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyBMYW1iZGHnlKjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5fvvIjniannkIblkI3jga7mjIflrprjgarjgZfvvIlcclxuICAgIHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnTGFtYmRhU2VjdXJpdHlHcm91cCcsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgTGFtYmRhIGZ1bmN0aW9ucycsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMYW1iZGHjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5fjgavjgr/jgrDjgpLov73liqBcclxuICAgIGNkay5UYWdzLm9mKHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1sYW1iZGEtc2dgKTtcclxuICAgIGNkay5UYWdzLm9mKHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCkuYWRkKCdUeXBlJywgJ0xhbWJkYVNlY3VyaXR5R3JvdXAnKTtcclxuXHJcbiAgICAvLyBMYW1iZGEg4oaSIEF1cm9yYeaOpee2muioseWPr1xyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgJ0FsbG93IGFjY2VzcyBmcm9tIExhbWJkYSdcclxuICAgICk7XHJcblxyXG4gICAgLy8gUzMgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OIXHJcbiAgICBjb25zdCBzM0VuZHBvaW50ID0gdGhpcy52cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdTM0dhdGV3YXlFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXHJcbiAgICB9KTtcclxuICAgIGNkay5UYWdzLm9mKHMzRW5kcG9pbnQpLmFkZCgnTmFtZScsIGAke2NvbmZpZy5lbnZpcm9ubWVudH0tczMtZW5kcG9pbnRgKTtcclxuICAgIGNkay5UYWdzLm9mKHMzRW5kcG9pbnQpLmFkZCgnVHlwZScsICdTM0dhdGV3YXlFbmRwb2ludCcpO1xyXG5cclxuICAgIC8vIFNlY3JldHMgTWFuYWdlciBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4hcclxuICAgIGNvbnN0IHNlY3JldHNFbmRwb2ludCA9IHRoaXMudnBjLmFkZEludGVyZmFjZUVuZHBvaW50KCdTZWNyZXRzTWFuYWdlckVuZHBvaW50Jywge1xyXG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcclxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIGNkay5UYWdzLm9mKHNlY3JldHNFbmRwb2ludCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1zZWNyZXRzLWVuZHBvaW50YCk7XHJcbiAgICBjZGsuVGFncy5vZihzZWNyZXRzRW5kcG9pbnQpLmFkZCgnVHlwZScsICdTZWNyZXRzTWFuYWdlckVuZHBvaW50Jyk7XHJcblxyXG4gICAgLy8gUkRTIERhdGEgQVBJIFZQQ+OCqOODs+ODieODneOCpOODs+ODiO+8iEF1cm9yYeOBruODh+ODvOOCv+OCouOCr+OCu+OCueeUqO+8iVxyXG4gICAgY29uc3QgcmRzRGF0YUVuZHBvaW50ID0gdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ1Jkc0RhdGFFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5SRFNfREFUQSxcclxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIGNkay5UYWdzLm9mKHJkc0RhdGFFbmRwb2ludCkuYWRkKCdOYW1lJywgYCR7Y29uZmlnLmVudmlyb25tZW50fS1yZHMtZGF0YS1lbmRwb2ludGApO1xyXG4gICAgY2RrLlRhZ3Mub2YocmRzRGF0YUVuZHBvaW50KS5hZGQoJ1R5cGUnLCAnUmRzRGF0YUVuZHBvaW50Jyk7XHJcbiAgfVxyXG59Il19