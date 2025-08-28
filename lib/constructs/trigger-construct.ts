// lib/constructs/trigger-construct.ts

import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';

export interface TriggerConstructProps {
  config: EnvironmentConfig;
  userPool: cognito.UserPool;
  cognitoPostConfirmationFunction: lambda.Function;
  cognitoUserEnableFunction: lambda.Function;
}

export class TriggerConstruct extends Construct {
  constructor(scope: Construct, id: string, props: TriggerConstructProps) {
    super(scope, id);

    const { config, userPool, cognitoPostConfirmationFunction } = props;

    // Post Confirmation トリガーを設定
    userPool.addTrigger(
      cognito.UserPoolOperation.POST_CONFIRMATION,
      cognitoPostConfirmationFunction
    );

    // タグ設定
    this.applyTags(config.tags);
  }

  private applyTags(tags: { [key: string]: string }): void {
    Object.entries(tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });
  }
}