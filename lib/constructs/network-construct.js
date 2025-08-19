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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUV0Qyx5REFBMkM7QUFDM0MsMkNBQXVDO0FBT3ZDLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFDN0IsR0FBRyxDQUFVO0lBQ2IsY0FBYyxDQUFnQjtJQUM5QixhQUFhLENBQWdCO0lBQzdCLG1CQUFtQixDQUFvQjtJQUN2QyxtQkFBbUIsQ0FBb0I7SUFFdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFekIsUUFBUTtRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDMUQsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pELGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCO1lBRW5ELG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCO29CQUM1QyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2lCQUNsQztnQkFDRDtvQkFDRSxRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCO29CQUM3QyxVQUFVLEVBQUUsTUFBTSxD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LFlBQVksRUFBRTtZQUN4QyxPQUFPLEVBQUUsR0FBRyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCO1FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsd0JBQXdCLEVBQUU7WUFDdEQsT0FBTyxFQUFFLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlO1lBQzNELGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNsQyxZQUFZLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ3ZELFdBQVcsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUU7U0FDdkQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFNBQVMsQ0FBQyxJQUErQjtRQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFIRCw0Q0EwSEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uc3RydWN0cy9uZXR3b3JrLWNvbnN0cnVjdC50c1xyXG5cclxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgRW52aXJvbm1lbnRDb25maWcgfSBmcm9tICcuLi9jb25maWcvZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0NvbnN0cnVjdFByb3BzIHtcclxuICBjb25maWc6IEVudmlyb25tZW50Q29uZmlnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29ya0NvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcclxuICBwdWJsaWMgcmVhZG9ubHkgcHJpdmF0ZVN1Ym5ldHM6IGVjMi5JU3VibmV0W107XHJcbiAgcHVibGljIHJlYWRvbmx5IHB1YmxpY1N1Ym5ldHM6IGVjMi5JU3VibmV0W107XHJcbiAgcHVibGljIHJlYWRvbmx5IGF1cm9yYVNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xyXG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGFTZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cDtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5ldHdvcmtDb25zdHJ1Y3RQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICBjb25zdCB7IGNvbmZpZyB9ID0gcHJvcHM7XHJcblxyXG4gICAgLy8gVlBD5L2c5oiQXHJcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIGNvbmZpZy5uZXR3b3JrLm5hbWluZy52cGNOYW1lLCB7XHJcbiAgICAgIGlwQWRkcmVzc2VzOiBlYzIuSXBBZGRyZXNzZXMuY2lkcihjb25maWcubmV0d29yay52cGNDaWRyKSxcclxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IGNvbmZpZy5uZXR3b3JrLmF2YWlsYWJpbGl0eVpvbmVzLFxyXG4gICAgICBcclxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcclxuICAgICAgICAgIG5hbWU6IGNvbmZpZy5uZXR3b3JrLm5hbWluZy5wdWJsaWNTdWJuZXROYW1lLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxyXG4gICAgICAgICAgbmFtZTogY29uZmlnLm5ldHdvcmsubmFtaW5nLnByaXZhdGVTdWJuZXROYW1lLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogY29uZmlnLm5ldHdvcmsuZW5hYmxlTmF0R2F0ZXdheSBcclxuICAgICAgICAgICAgPyBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIFxyXG4gICAgICAgICAgICA6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgXHJcbiAgICAgIC8vIE5BVOOCsuODvOODiOOCpuOCp+OCpOOBruioreWumlxyXG4gICAgICBuYXRHYXRld2F5czogY29uZmlnLm5ldHdvcmsuZW5hYmxlTmF0R2F0ZXdheSA/IGNvbmZpZy5uZXR3b3JrLmF2YWlsYWJpbGl0eVpvbmVzLmxlbmd0aCA6IDAsXHJcbiAgICAgIFxyXG4gICAgICAvLyBWUEPjg5Xjg63jg7zjg63jgrBcclxuICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxyXG4gICAgICBlbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g44K144OW44ON44OD44OI5Y+C54WnXHJcbiAgICB0aGlzLnByaXZhdGVTdWJuZXRzID0gdGhpcy52cGMucHJpdmF0ZVN1Ym5ldHM7XHJcbiAgICB0aGlzLnB1YmxpY1N1Ym5ldHMgPSB0aGlzLnZwYy5wdWJsaWNTdWJuZXRzO1xyXG5cclxuICAgIC8vIEF1cm9yYeeUqOOCu+OCreODpeODquODhuOCo+OCsOODq+ODvOODl1xyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsIGNvbmZpZy5uZXR3b3JrLm5hbWluZy5hdXJvcmFTZWN1cml0eUdyb3VwTmFtZSwge1xyXG4gICAgICB2cGM6IHRoaXMudnBjLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NlY3VyaXR5IGdyb3VwIGZvciBBdXJvcmEgU2VydmVybGVzcyB2MicsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDoh6rliIboh6rouqvjgYvjgonjga7jgqLjgq/jgrvjgrnjgpLoqLHlj6/vvIjlkIzjgZjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5flhoXvvIlcclxuICAgIHRoaXMuYXVyb3JhU2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcclxuICAgICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLFxyXG4gICAgICBlYzIuUG9ydC50Y3AoNTQzMiksXHJcbiAgICAgICdBbGxvdyBhY2Nlc3MgZnJvbSBzYW1lIHNlY3VyaXR5IGdyb3VwJ1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyBMYW1iZGHnlKjjgrvjgq3jg6Xjg6rjg4bjgqPjgrDjg6vjg7zjg5dcclxuICAgIHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCBjb25maWcubmV0d29yay5uYW1pbmcubGFtYmRhU2VjdXJpdHlHcm91cE5hbWUsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgTGFtYmRhIGZ1bmN0aW9ucycsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMYW1iZGEg4oaSIEF1cm9yYeaOpee2muioseWPr1xyXG4gICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgJ0FsbG93IGFjY2VzcyBmcm9tIExhbWJkYSdcclxuICAgICk7XHJcblxyXG4gICAgLy8g6ZaL55m655Kw5aKD44Gu5aC05ZCI44CB54m55a6aQ0lEUuOBi+OCieOBruebtOaOpeOCouOCr+OCu+OCueOCkuioseWPr1xyXG4gICAgaWYgKGNvbmZpZy5lbnZpcm9ubWVudCA9PT0gJ2RldicpIHtcclxuICAgICAgY29uZmlnLnNlY3VyaXR5LmFsbG93ZWRDaWRyQmxvY2tzLmZvckVhY2goKGNpZHIsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgdGhpcy5hdXJvcmFTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICAgICAgZWMyLlBlZXIuaXB2NChjaWRyKSxcclxuICAgICAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcclxuICAgICAgICAgIGBBbGxvdyBkZXYgYWNjZXNzIGZyb20gJHtjaWRyfWBcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4jvvIjjgqrjg5fjgrfjg6fjg7PvvIlcclxuICAgIGlmIChjb25maWcubmV0d29yay5jcmVhdGVWcGNFbmRwb2ludHMpIHtcclxuICAgICAgdGhpcy5jcmVhdGVWcGNFbmRwb2ludHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWUEPjg5Xjg63jg7zjg63jgrDvvIjjgqrjg5fjgrfjg6fjg7PvvIlcclxuICAgIGlmIChjb25maWcuc2VjdXJpdHkuZW5hYmxlVnBjRmxvd0xvZ3MpIHtcclxuICAgICAgdGhpcy5jcmVhdGVWcGNGbG93TG9ncygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOOCv+OCsOioreWumlxyXG4gICAgdGhpcy5hcHBseVRhZ3MoY29uZmlnLnRhZ3MpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVWcGNFbmRwb2ludHMoKTogdm9pZCB7XHJcbiAgICAvLyBTMyBWUEPjgqjjg7Pjg4njg53jgqTjg7Pjg4hcclxuICAgIHRoaXMudnBjLmFkZEdhdGV3YXlFbmRwb2ludCgnUzNFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZWNyZXRzIE1hbmFnZXIgVlBD44Ko44Oz44OJ44Od44Kk44Oz44OIXHJcbiAgICB0aGlzLnZwYy5hZGRJbnRlcmZhY2VFbmRwb2ludCgnU2VjcmV0c01hbmFnZXJFbmRwb2ludCcsIHtcclxuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5TRUNSRVRTX01BTkFHRVIsXHJcbiAgICAgIHByaXZhdGVEbnNFbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVZwY0Zsb3dMb2dzKCk6IHZvaWQge1xyXG4gICAgbmV3IGVjMi5GbG93TG9nKHRoaXMsICdWcGNGbG93TG9nJywge1xyXG4gICAgICByZXNvdXJjZVR5cGU6IGVjMi5GbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModGhpcy52cGMpLFxyXG4gICAgICBkZXN0aW5hdGlvbjogZWMyLkZsb3dMb2dEZXN0aW5hdGlvbi50b0Nsb3VkV2F0Y2hMb2dzKCksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlUYWdzKHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcclxuICAgIE9iamVjdC5lbnRyaWVzKHRhZ3MpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICB0aGlzLnZwYy5ub2RlLmFkZE1ldGFkYXRhKGtleSwgdmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59Il19