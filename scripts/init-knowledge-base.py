#!/usr/bin/env python3
"""
Initialize OpenSearch Serverless Knowledge Base for Indic RAG
"""
import boto3
import json
import argparse
from pathlib import Path

opensearch = boto3.client('opensearchserverless')
bedrock_agent = boto3.client('bedrock-agent')

COLLECTION_NAME = 'sanchaar-indic-kb'
EMBEDDING_MODEL = 'amazon.titan-embed-text-v1'

def create_collection():
    """Create OpenSearch Serverless collection"""
    try:
        response = opensearch.create_collection(
            name=COLLECTION_NAME,
            type='VECTORSEARCH',
            description='Sanchaar Indic language knowledge base'
        )
        print(f"✓ Created collection: {COLLECTION_NAME}")
        return response['createCollectionDetail']['id']
    except opensearch.exceptions.ConflictException:
        print(f"Collection {COLLECTION_NAME} already exists")
        collections = opensearch.list_collections(
            collectionFilters={'name': COLLECTION_NAME}
        )
        return collections['collectionSummaries'][0]['id']

def create_indexes(collection_endpoint):
    """Create vector indexes for different content types"""
    from opensearchpy import OpenSearch, RequestsHttpConnection
    from requests_aws4auth import AWS4Auth
    
    session = boto3.Session()
    credentials = session.get_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        session.region_name,
        'aoss',
        session_token=credentials.token
    )
    
    client = OpenSearch(
        hosts=[{'host': collection_endpoint, 'port': 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )
    
    indexes = {
        'cultural-references': {
            'settings': {'index.knn': True},
            'mappings': {
                'properties': {
                    'embedding': {
                        'type': 'knn_vector',
                        'dimension': 1536,
                        'method': {'name': 'hnsw', 'engine': 'faiss'}
                    },
                    'text': {'type': 'text'},
                    'language': {'type': 'keyword'},
                    'category': {'type': 'keyword'},
                    'region': {'type': 'keyword'}
                }
            }
        },
        'idioms-phrases': {
            'settings': {'index.knn': True},
            'mappings': {
                'properties': {
                    'embedding': {'type': 'knn_vector', 'dimension': 1536},
                    'source_phrase': {'type': 'text'},
                    'target_phrase': {'type': 'text'},
                    'source_language': {'type': 'keyword'},
                    'target_language': {'type': 'keyword'}
                }
            }
        },
        'brand-guidelines': {
            'settings': {'index.knn': True},
            'mappings': {
                'properties': {
                    'embedding': {'type': 'knn_vector', 'dimension': 1536},
                    'guideline': {'type': 'text'},
                    'category': {'type': 'keyword'}
                }
            }
        }
    }
    
    for index_name, config in indexes.items():
        try:
            client.indices.create(index=index_name, body=config)
            print(f"✓ Created index: {index_name}")
        except Exception as e:
            print(f"Index {index_name} may already exist: {e}")

def upload_corpus(corpus_path, collection_id):
    """Upload Indic language corpus to knowledge base"""
    corpus_dir = Path(corpus_path)
    
    if not corpus_dir.exists():
        print(f"⚠ Corpus directory not found: {corpus_path}")
        print("Please add your Indic language datasets to data/indic-corpus/")
        return
    
    # Create Bedrock Knowledge Base
    try:
        kb_response = bedrock_agent.create_knowledge_base(
            name='sanchaar-indic-kb',
            description='Indic language cultural references and idioms',
            roleArn=f'arn:aws:iam::{boto3.client("sts").get_caller_identity()["Account"]}:role/SanchaarBedrockAgentRole',
            knowledgeBaseConfiguration={
                'type': 'VECTOR',
                'vectorKnowledgeBaseConfiguration': {
                    'embeddingModelArn': f'arn:aws:bedrock:us-east-1::foundation-model/{EMBEDDING_MODEL}'
                }
            },
            storageConfiguration={
                'type': 'OPENSEARCH_SERVERLESS',
                'opensearchServerlessConfiguration': {
                    'collectionArn': f'arn:aws:aoss:us-east-1:{boto3.client("sts").get_caller_identity()["Account"]}:collection/{collection_id}',
                    'vectorIndexName': 'cultural-references',
                    'fieldMapping': {
                        'vectorField': 'embedding',
                        'textField': 'text',
                        'metadataField': 'metadata'
                    }
                }
            }
        )
        print(f"✓ Created Bedrock Knowledge Base: {kb_response['knowledgeBase']['knowledgeBaseId']}")
    except Exception as e:
        print(f"Knowledge Base creation: {e}")

def main():
    parser = argparse.ArgumentParser(description='Initialize Sanchaar Knowledge Base')
    parser.add_argument('--corpus-path', default='./data/indic-corpus',
                       help='Path to Indic language corpus')
    args = parser.parse_args()
    
    print("🚀 Initializing Sanchaar Knowledge Base...")
    
    # Step 1: Create collection
    collection_id = create_collection()
    
    # Step 2: Create indexes
    print("\n📊 Creating vector indexes...")
    # Note: You'll need the collection endpoint from AWS Console
    print("⚠ Please create indexes manually via AWS Console or provide endpoint")
    
    # Step 3: Upload corpus
    print("\n📚 Setting up knowledge base...")
    upload_corpus(args.corpus_path, collection_id)
    
    print("\n✅ Knowledge Base initialization complete!")
    print("\nNext steps:")
    print("1. Add your Indic language datasets to data/indic-corpus/")
    print("2. Configure data source in Bedrock Knowledge Base console")
    print("3. Start ingestion job to index the corpus")

if __name__ == '__main__':
    main()
