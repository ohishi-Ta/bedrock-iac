// lib/stacks/network-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkConstruct } from '../constructs/network-construct';
import { EnvironmentConfig } from '../config/environment-config';

export interface NetworkStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class NetworkStack extends cdk.Stack {
  public readonly networkConstruct: NetworkConstruct;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const { config } = props;

    // NetworkConstructを使用してネットワークリソースを作成
    this.networkConstruct = new NetworkConstruct(this, 'Network', {
      config,
    });

    // 共通タグ設定
    this.applyCommonTags(config.tags);
  }

  private applyCommonTags(tags: { [key: string]: string }): void {
    Object.entries(tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });
  }
}