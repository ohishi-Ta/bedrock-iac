// lib/constructs/db-initializer-construct.ts

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { Duration, RemovalPolicy, CustomResource } from 'aws-cdk-lib';
import { EnvironmentConfig } from '../config/environment-config';

export interface DbInitializerConstructProps {
  vpc: ec2.IVpc;
  lambdaSecurityGroup: ec2.ISecurityGroup;
  cluster: rds.DatabaseCluster;
  masterSecret: secretsmanager.ISecret;
  config: EnvironmentConfig;
}

export class DbInitializerConstruct extends Construct {
  public readonly initializerFunction: lambda.Function;
  public readonly customResource: CustomResource;

  constructor(scope: Construct, id: string, props: DbInitializerConstructProps) {
    super(scope, id);

    const { vpc, lambdaSecurityGroup, cluster, masterSecret, config } = props;

    // Lambda関数を作成
    // NodejsFunctionはデフォルトで同じディレクトリの
    // {construct-id}.function.ts ファイルを探す
    this.initializerFunction = new lambdaNodejs.NodejsFunction(this, 'DbInitializer', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      timeout: Duration.minutes(5),
      memorySize: 256,
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [lambdaSecurityGroup],
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        nodeModules: ['pg'],
        minify: false,
        sourceMap: true,
        externalModules: [
          '@aws-sdk/client-secrets-manager', // AWS SDKはLambda環境に含まれている
        ],
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // Secrets Managerへのアクセス権限を付与（マスターシークレットのみ）
    masterSecret.grantRead(this.initializerFunction);

    // VPC内でのネットワークアクセス権限
    this.initializerFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface',
        'ec2:AssignPrivateIpAddresses',
        'ec2:UnassignPrivateIpAddresses'
      ],
      resources: ['*'],
    }));

    // Custom Resource Provider
    const provider = new cr.Provider(this, 'DbInitializerProvider', {
      onEventHandler: this.initializerFunction,
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // Custom Resource
    this.customResource = new CustomResource(this, 'DbInitializerResource', {
      serviceToken: provider.serviceToken,
      properties: {
        ClusterEndpoint: cluster.clusterEndpoint.hostname,
        DatabaseName: config.aurora.databaseName,
        MasterSecretArn: masterSecret.secretArn,
        // タイムスタンプを追加して、更新時に再実行されるようにする
        Timestamp: new Date().toISOString(),
      },
      // 削除時の動作を設定
      removalPolicy: config.environment === 'dev' 
        ? RemovalPolicy.DESTROY 
        : RemovalPolicy.RETAIN,
    });

    // Auroraクラスターの後に実行されるように依存関係を設定
    this.customResource.node.addDependency(cluster);
  }
}