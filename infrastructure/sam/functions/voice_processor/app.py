import json
import boto3
import os
from datetime import datetime
from uuid import uuid4

s3 = boto3.client('s3')
transcribe = boto3.client('transcribe')
dynamodb = boto3.resource('dynamodb')

CONTENT_TABLE = os.environ['CONTENT_TABLE']
table = dynamodb.Table(CONTENT_TABLE)

def lambda_handler(event, context):
    """
    Process voice commands from S3 uploads
    Extract metadata and trigger transcription
    """
    try:
        # Extract S3 event details
        bucket = event['detail']['bucket']['name']
        key = event['detail']['object']['key']
        
        # Generate content ID
        content_id = str(uuid4())
        
        # Start transcription job
        job_name = f"sanchaar-{content_id}"
        
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': f's3://{bucket}/{key}'},
            MediaFormat='mp3',
            LanguageCode='hi-IN',  # Default to Hindi, can be auto-detected
            Settings={
                'ShowSpeakerLabels': True,
                'MaxSpeakerLabels': 2
            }
        )
        
        # Store initial metadata
        table.put_item(
            Item={
                'content_id': content_id,
                'version': int(datetime.now().timestamp()),
                'user_id': extract_user_id(key),
                'source_audio_uri': f's3://{bucket}/{key}',
                'transcription_job': job_name,
                'status': 'processing',
                'created_at': datetime.now().isoformat()
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'content_id': content_id,
                'transcription_job': job_name,
                'status': 'initiated'
            })
        }
        
    except Exception as e:
        print(f"Error processing voice command: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def extract_user_id(s3_key):
    """Extract user ID from S3 key path"""
    parts = s3_key.split('/')
    if len(parts) > 1:
        return parts[1]
    return 'unknown'
