"use strict";
// lib/config/dev-config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.devConfig = void 0;
const environment_config_1 = require("./environment-config");
exports.devConfig = {
    environment: 'dev',
    network: {
        ...environment_config_1.commonDefaults.network,
        vpcCidr: '10.0.0.0/16',
        enableNatGateway: false, // コスト削減のためNATゲートウェイなし
        naming: {
            vpcName: 'cpi-bedrock-dev-vpc',
            publicSubnetName: 'cpi-bedrock-dev-public',
            privateSubnetName: 'cpi-bedrock-dev-private',
            auroraSecurityGroupName: 'cpi-bedrock-dev-aurora-sg',
            lambdaSecurityGroupName: 'cpi-bedrock-dev-lambda-sg',
        },
    },
    aurora: {
        ...environment_config_1.commonDefaults.aurora,
        databaseName: 'bedrock_knowledge_base_dev',
        minCapacity: 0.5,
        maxCapacity: 16, // 開発環境は最大16ACU
        deletionProtection: false, // 開発環境では削除保護無効
        backupRetentionDays: 7,
        naming: {
            clusterName: 'cpi-bedrock-dev-cluster',
            subnetGroupName: 'cpi-bedrock-dev-subnet-group',
            masterSecretName: 'cpi-bedrock-dev-master-secret',
            appUserSecretName: 'cpi-bedrock-dev-app-secret',
        },
    },
    security: {
        ...environment_config_1.commonDefaults.security,
        enableVpcFlowLogs: false, // コスト削減
    },
    tags: {
        ...environment_config_1.commonDefaults.tags,
        Environment: 'dev',
        Owner: 'oishi',
        CostCenter: 'development',
    },
    cost: {
        budgetLimitUsd: 100, // 月100ドル上限
        enableBudgetAlerts: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldi1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUEyQjs7O0FBRTNCLDZEQUF5RTtBQUU1RCxRQUFBLFNBQVMsR0FBc0I7SUFDMUMsV0FBVyxFQUFFLEtBQUs7SUFFbEIsT0FBTyxFQUFFO1FBQ1AsR0FBRyxtQ0FBYyxDQUFDLE9BQU87UUFDekIsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLHNCQUFzQjtRQUUvQyxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUscUJBQXFCO1lBQzlCLGdCQUFnQixFQUFFLHdCQUF3QjtZQUMxQyxpQkFBaUIsRUFBRSx5QkFBeUI7WUFDNUMsdUJBQXVCLEVBQUUsMkJBQTJCO1lBQ3BELHVCQUF1QixFQUFFLDJCQUEyQjtTQUNyRDtLQUNGO0lBRUQsTUFBTSxFQUFFO1FBQ04sR0FBRyxtQ0FBYyxDQUFDLE1BQU07UUFDeEIsWUFBWSxFQUFFLDRCQUE0QjtRQUMxQyxXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRSxFQUFFLGVBQWU7UUFDaEMsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGVBQWU7UUFDMUMsbUJBQW1CLEVBQUUsQ0FBQztRQUV0QixNQUFNLEVBQUU7WUFDTixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLGVBQWUsRUFBRSw4QkFBOEI7WUFDL0MsZ0JBQWdCLEVBQUUsK0JBQStCO1lBQ2pELGlCQUFpQixFQUFFLDRCQUE0QjtTQUNoRDtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsR0FBRyxtQ0FBYyxDQUFDLFFBQVE7UUFDMUIsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFFBQVE7S0FDbkM7SUFFRCxJQUFJLEVBQUU7UUFDSixHQUFHLG1DQUFjLENBQUMsSUFBSTtRQUN0QixXQUFXLEVBQUUsS0FBSztRQUNsQixLQUFLLEVBQUUsT0FBTztRQUNkLFVBQVUsRUFBRSxhQUFhO0tBQzFCO0lBRUQsSUFBSSxFQUFFO1FBQ0osY0FBYyxFQUFFLEdBQUcsRUFBRSxXQUFXO1FBQ2hDLGtCQUFrQixFQUFFLElBQUk7S0FDekI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2NvbmZpZy9kZXYtY29uZmlnLnRzXHJcblxyXG5pbXBvcnQgeyBFbnZpcm9ubWVudENvbmZpZywgY29tbW9uRGVmYXVsdHMgfSBmcm9tICcuL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgY29uc3QgZGV2Q29uZmlnOiBFbnZpcm9ubWVudENvbmZpZyA9IHtcclxuICBlbnZpcm9ubWVudDogJ2RldicsXHJcbiAgXHJcbiAgbmV0d29yazoge1xyXG4gICAgLi4uY29tbW9uRGVmYXVsdHMubmV0d29yayxcclxuICAgIHZwY0NpZHI6ICcxMC4wLjAuMC8xNicsXHJcbiAgICBlbmFibGVOYXRHYXRld2F5OiBmYWxzZSwgLy8g44Kz44K544OI5YmK5rib44Gu44Gf44KBTkFU44Ky44O844OI44Km44Kn44Kk44Gq44GXXHJcbiAgICBcclxuICAgIG5hbWluZzoge1xyXG4gICAgICB2cGNOYW1lOiAnY3BpLWJlZHJvY2stZGV2LXZwYycsXHJcbiAgICAgIHB1YmxpY1N1Ym5ldE5hbWU6ICdjcGktYmVkcm9jay1kZXYtcHVibGljJyxcclxuICAgICAgcHJpdmF0ZVN1Ym5ldE5hbWU6ICdjcGktYmVkcm9jay1kZXYtcHJpdmF0ZScsXHJcbiAgICAgIGF1cm9yYVNlY3VyaXR5R3JvdXBOYW1lOiAnY3BpLWJlZHJvY2stZGV2LWF1cm9yYS1zZycsXHJcbiAgICAgIGxhbWJkYVNlY3VyaXR5R3JvdXBOYW1lOiAnY3BpLWJlZHJvY2stZGV2LWxhbWJkYS1zZycsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgYXVyb3JhOiB7XHJcbiAgICAuLi5jb21tb25EZWZhdWx0cy5hdXJvcmEsXHJcbiAgICBkYXRhYmFzZU5hbWU6ICdiZWRyb2NrX2tub3dsZWRnZV9iYXNlX2RldicsXHJcbiAgICBtaW5DYXBhY2l0eTogMC41LFxyXG4gICAgbWF4Q2FwYWNpdHk6IDE2LCAvLyDplovnmbrnkrDlooPjga/mnIDlpKcxNkFDVVxyXG4gICAgZGVsZXRpb25Qcm90ZWN0aW9uOiBmYWxzZSwgLy8g6ZaL55m655Kw5aKD44Gn44Gv5YmK6Zmk5L+d6K2354Sh5Yq5XHJcbiAgICBiYWNrdXBSZXRlbnRpb25EYXlzOiA3LFxyXG4gICAgXHJcbiAgICBuYW1pbmc6IHtcclxuICAgICAgY2x1c3Rlck5hbWU6ICdjcGktYmVkcm9jay1kZXYtY2x1c3RlcicsXHJcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogJ2NwaS1iZWRyb2NrLWRldi1zdWJuZXQtZ3JvdXAnLFxyXG4gICAgICBtYXN0ZXJTZWNyZXROYW1lOiAnY3BpLWJlZHJvY2stZGV2LW1hc3Rlci1zZWNyZXQnLFxyXG4gICAgICBhcHBVc2VyU2VjcmV0TmFtZTogJ2NwaS1iZWRyb2NrLWRldi1hcHAtc2VjcmV0JyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICBzZWN1cml0eToge1xyXG4gICAgLi4uY29tbW9uRGVmYXVsdHMuc2VjdXJpdHksXHJcbiAgICBlbmFibGVWcGNGbG93TG9nczogZmFsc2UsIC8vIOOCs+OCueODiOWJiua4m1xyXG4gIH0sXHJcbiAgXHJcbiAgdGFnczoge1xyXG4gICAgLi4uY29tbW9uRGVmYXVsdHMudGFncyxcclxuICAgIEVudmlyb25tZW50OiAnZGV2JyxcclxuICAgIE93bmVyOiAnb2lzaGknLFxyXG4gICAgQ29zdENlbnRlcjogJ2RldmVsb3BtZW50JyxcclxuICB9LFxyXG4gIFxyXG4gIGNvc3Q6IHtcclxuICAgIGJ1ZGdldExpbWl0VXNkOiAxMDAsIC8vIOaciDEwMOODieODq+S4iumZkFxyXG4gICAgZW5hYmxlQnVkZ2V0QWxlcnRzOiB0cnVlLFxyXG4gIH0sXHJcbn07Il19