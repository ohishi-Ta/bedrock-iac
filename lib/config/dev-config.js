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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldi1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUEyQjs7O0FBRTNCLDZEQUF5RTtBQUU1RCxRQUFBLFNBQVMsR0FBc0I7SUFDMUMsV0FBVyxFQUFFLEtBQUs7SUFFbEIsT0FBTyxFQUFFO1FBQ1AsR0FBRyxtQ0FBYyxDQUFDLE9BQU87UUFDekIsT0FBTyxFQUFFLGFBQWE7UUFDdEIsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLHNCQUFzQjtRQUUvQyxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUscUJBQXFCO1lBQzlCLGdCQUFnQixFQUFFLHdCQUF3QjtZQUMxQyxpQkFBaUIsRUFBRSx5QkFBeUI7WUFDNUMsdUJBQXVCLEVBQUUsMkJBQTJCO1lBQ3BELHVCQUF1QixFQUFFLDJCQUEyQjtTQUNyRDtLQUNGO0lBRUQsTUFBTSxFQUFFO1FBQ04sR0FBRyxtQ0FBYyxDQUFDLE1BQU07UUFDeEIsWUFBWSxFQUFFLDRCQUE0QjtRQUMxQyxXQUFXLEVBQUUsR0FBRztRQUNoQixXQUFXLEVBQUUsRUFBRSxFQUFFLGVBQWU7UUFDaEMsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGVBQWU7UUFDMUMsbUJBQW1CLEVBQUUsQ0FBQztRQUV0QixNQUFNLEVBQUU7WUFDTixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLGVBQWUsRUFBRSw4QkFBOEI7WUFDL0MsZ0JBQWdCLEVBQUUsK0JBQStCO1NBQ2xEO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixHQUFHLG1DQUFjLENBQUMsUUFBUTtRQUMxQixpQkFBaUIsRUFBRSxLQUFLLEVBQUUsUUFBUTtLQUNuQztJQUVELElBQUksRUFBRTtRQUNKLEdBQUcsbUNBQWMsQ0FBQyxJQUFJO1FBQ3RCLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsVUFBVSxFQUFFLGFBQWE7S0FDMUI7SUFFRCxJQUFJLEVBQUU7UUFDSixjQUFjLEVBQUUsR0FBRyxFQUFFLFdBQVc7UUFDaEMsa0JBQWtCLEVBQUUsSUFBSTtLQUN6QjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvY29uZmlnL2Rldi1jb25maWcudHNcclxuXHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnLCBjb21tb25EZWZhdWx0cyB9IGZyb20gJy4vZW52aXJvbm1lbnQtY29uZmlnJztcclxuXHJcbmV4cG9ydCBjb25zdCBkZXZDb25maWc6IEVudmlyb25tZW50Q29uZmlnID0ge1xyXG4gIGVudmlyb25tZW50OiAnZGV2JyxcclxuICBcclxuICBuZXR3b3JrOiB7XHJcbiAgICAuLi5jb21tb25EZWZhdWx0cy5uZXR3b3JrLFxyXG4gICAgdnBjQ2lkcjogJzEwLjAuMC4wLzE2JyxcclxuICAgIGVuYWJsZU5hdEdhdGV3YXk6IGZhbHNlLCAvLyDjgrPjgrnjg4jliYrmuJvjga7jgZ/jgoFOQVTjgrLjg7zjg4jjgqbjgqfjgqTjgarjgZdcclxuICAgIFxyXG4gICAgbmFtaW5nOiB7XHJcbiAgICAgIHZwY05hbWU6ICdjcGktYmVkcm9jay1kZXYtdnBjJyxcclxuICAgICAgcHVibGljU3VibmV0TmFtZTogJ2NwaS1iZWRyb2NrLWRldi1wdWJsaWMnLFxyXG4gICAgICBwcml2YXRlU3VibmV0TmFtZTogJ2NwaS1iZWRyb2NrLWRldi1wcml2YXRlJyxcclxuICAgICAgYXVyb3JhU2VjdXJpdHlHcm91cE5hbWU6ICdjcGktYmVkcm9jay1kZXYtYXVyb3JhLXNnJyxcclxuICAgICAgbGFtYmRhU2VjdXJpdHlHcm91cE5hbWU6ICdjcGktYmVkcm9jay1kZXYtbGFtYmRhLXNnJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICBhdXJvcmE6IHtcclxuICAgIC4uLmNvbW1vbkRlZmF1bHRzLmF1cm9yYSxcclxuICAgIGRhdGFiYXNlTmFtZTogJ2JlZHJvY2tfa25vd2xlZGdlX2Jhc2VfZGV2JyxcclxuICAgIG1pbkNhcGFjaXR5OiAwLjUsXHJcbiAgICBtYXhDYXBhY2l0eTogMTYsIC8vIOmWi+eZuueSsOWig+OBr+acgOWkpzE2QUNVXHJcbiAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLCAvLyDplovnmbrnkrDlooPjgafjga/liYrpmaTkv53orbfnhKHlirlcclxuICAgIGJhY2t1cFJldGVudGlvbkRheXM6IDcsXHJcbiAgICBcclxuICAgIG5hbWluZzoge1xyXG4gICAgICBjbHVzdGVyTmFtZTogJ2NwaS1iZWRyb2NrLWRldi1jbHVzdGVyJyxcclxuICAgICAgc3VibmV0R3JvdXBOYW1lOiAnY3BpLWJlZHJvY2stZGV2LXN1Ym5ldC1ncm91cCcsXHJcbiAgICAgIG1hc3RlclNlY3JldE5hbWU6ICdjcGktYmVkcm9jay1kZXYtbWFzdGVyLXNlY3JldCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgc2VjdXJpdHk6IHtcclxuICAgIC4uLmNvbW1vbkRlZmF1bHRzLnNlY3VyaXR5LFxyXG4gICAgZW5hYmxlVnBjRmxvd0xvZ3M6IGZhbHNlLCAvLyDjgrPjgrnjg4jliYrmuJtcclxuICB9LFxyXG4gIFxyXG4gIHRhZ3M6IHtcclxuICAgIC4uLmNvbW1vbkRlZmF1bHRzLnRhZ3MsXHJcbiAgICBFbnZpcm9ubWVudDogJ2RldicsXHJcbiAgICBPd25lcjogJ29pc2hpJyxcclxuICAgIENvc3RDZW50ZXI6ICdkZXZlbG9wbWVudCcsXHJcbiAgfSxcclxuICBcclxuICBjb3N0OiB7XHJcbiAgICBidWRnZXRMaW1pdFVzZDogMTAwLCAvLyDmnIgxMDDjg4njg6vkuIrpmZBcclxuICAgIGVuYWJsZUJ1ZGdldEFsZXJ0czogdHJ1ZSxcclxuICB9LFxyXG59OyJdfQ==