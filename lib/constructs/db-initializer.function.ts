// lib/constructs/db-initializer.function.ts

import { Client } from 'pg';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { Context } from 'aws-lambda';
import * as https from 'https';

const secretsManager = new SecretsManagerClient({});

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Custom Resource Event/Response の型定義
interface CustomResourceEventBase {
  RequestType: 'Create' | 'Update' | 'Delete';
  ResponseURL: string;
  StackId: string;
  RequestId: string;
  ResourceType: string;
  LogicalResourceId: string;
  ResourceProperties: Record<string, any>;
  OldResourceProperties?: Record<string, any>;
}

interface CustomResourceCreateEvent extends CustomResourceEventBase {
  RequestType: 'Create';
}

interface CustomResourceUpdateEvent extends CustomResourceEventBase {
  RequestType: 'Update';
  PhysicalResourceId: string;
}

interface CustomResourceDeleteEvent extends CustomResourceEventBase {
  RequestType: 'Delete';
  PhysicalResourceId: string;
}

type CustomResourceEvent = CustomResourceCreateEvent | CustomResourceUpdateEvent | CustomResourceDeleteEvent;

/**
 * Secrets Managerからシークレットを取得
 */
async function getSecret(secretArn: string): Promise<any> {
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const response = await secretsManager.send(command);
  
  if (response.SecretString) {
    return JSON.parse(response.SecretString);
  }
  throw new Error('Secret not found');
}

/**
 * データベースに接続してSQLを実行
 */
async function executeSql(config: DatabaseConfig, sql: string): Promise<void> {
  const client = new Client({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // SQLを実行
    await client.query(sql);
    console.log('SQL executed successfully');
  } finally {
    await client.end();
  }
}

/**
 * データベース初期化処理
 */
async function initializeDatabase(
  clusterEndpoint: string,
  databaseName: string,
  masterSecretArn: string
): Promise<void> {
  // マスターシークレットを取得
  const masterSecret = await getSecret(masterSecretArn);
  
  const masterConfig: DatabaseConfig = {
    host: clusterEndpoint,
    port: 5432,
    database: databaseName,
    username: masterSecret.username,
    password: masterSecret.password
  };

  // マスターユーザーで全ての設定を実行
  const initSql = `
    -- pgvectorを有効化
    CREATE EXTENSION IF NOT EXISTS vector;
    
    -- スキーマ作成（存在しない場合のみ）
    CREATE SCHEMA IF NOT EXISTS bedrock_integration;
    
    -- テーブル作成（存在しない場合のみ）
    CREATE TABLE IF NOT EXISTS bedrock_integration.bedrock_knowledge_base (
      id uuid PRIMARY KEY,
      embedding vector(1024),
      chunks text,
      metadata jsonb,
      custommetadata jsonb
    );
    
    -- ベクター検索用インデックス（存在しない場合のみ）
    CREATE INDEX IF NOT EXISTS idx_bedrock_knowledge_base_embedding
    ON bedrock_integration.bedrock_knowledge_base
    USING hnsw (embedding vector_cosine_ops);
    
    -- テキスト検索用インデックス（存在しない場合のみ）
    CREATE INDEX IF NOT EXISTS idx_bedrock_knowledge_base_chunks
    ON bedrock_integration.bedrock_knowledge_base
    USING gin (to_tsvector('simple'::regconfig, chunks));
    
    -- カスタムメタデータ検索用インデックス（存在しない場合のみ）
    CREATE INDEX IF NOT EXISTS idx_bedrock_knowledge_base_custommetadata
    ON bedrock_integration.bedrock_knowledge_base
    USING gin (custommetadata);
  `;

  await executeSql(masterConfig, initSql);
  console.log('Database initialization completed');
}

/**
 * PhysicalResourceIdを取得または生成
 */
function getPhysicalResourceId(event: CustomResourceEvent): string {
  switch (event.RequestType) {
    case 'Create':
      return `db-init-${Date.now()}`;
    case 'Update':
    case 'Delete':
      return event.PhysicalResourceId;
    default:
      // TypeScriptの exhaustiveness check
      const _exhaustiveCheck: never = event;
      throw new Error(`Unknown request type`);
  }
}

/**
 * CloudFormation Custom Resource Response送信
 */
async function sendResponse(
  event: CustomResourceEvent,
  context: Context,
  responseStatus: 'SUCCESS' | 'FAILED',
  responseData?: any,
  physicalResourceId?: string,
  reason?: string
): Promise<void> {
  const responseUrl = event.ResponseURL;
  
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: reason || `See CloudWatch Log Stream: ${context.logStreamName}`,
    PhysicalResourceId: physicalResourceId || context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: responseData,
  });

  const parsedUrl = new URL(responseUrl);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length.toString(),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      console.log(`Status code: ${response.statusCode}`);
      console.log(`Status message: ${response.statusMessage}`);
      resolve();
    });

    request.on('error', (error) => {
      console.log('Send response error:', error);
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });
}

/**
 * CloudFormation Custom Resource ハンドラー
 */
export async function handler(
  event: CustomResourceEvent,
  context: Context
): Promise<void> {
  console.log('Event:', JSON.stringify(event, null, 2));

  const physicalResourceId = getPhysicalResourceId(event);

  try {
    const { ClusterEndpoint, DatabaseName, MasterSecretArn } = event.ResourceProperties;

    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        await initializeDatabase(
          ClusterEndpoint as string,
          DatabaseName as string,
          MasterSecretArn as string
        );
        
        await sendResponse(
          event,
          context,
          'SUCCESS',
          {
            Message: 'Database initialized successfully with pgvector and Bedrock Knowledge Base schema',
            Timestamp: new Date().toISOString()
          },
          physicalResourceId
        );
        break;

      case 'Delete':
        // 削除時は特に何もしない（データは保持）
        console.log('Delete request received. Keeping data intact.');
        
        await sendResponse(
          event,
          context,
          'SUCCESS',
          {
            Message: 'Delete request processed (data retained)',
            Timestamp: new Date().toISOString()
          },
          physicalResourceId
        );
        break;

      default:
        // TypeScriptの exhaustiveness check
        const _exhaustiveCheck: never = event;
        throw new Error(`Unknown request type`);
    }
    
  } catch (error) {
    console.error('Error:', error);
    
    await sendResponse(
      event,
      context,
      'FAILED',
      undefined,
      physicalResourceId,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}