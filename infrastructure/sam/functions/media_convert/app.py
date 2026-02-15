import json
import boto3
import os

mediaconvert = boto3.client('mediaconvert')
rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')

OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']

# Get MediaConvert endpoint
endpoints = mediaconvert.describe_endpoints()
mediaconvert_endpoint = endpoints['Endpoints'][0]['Url']
mediaconvert = boto3.client('mediaconvert', endpoint_url=mediaconvert_endpoint)

ASPECT_RATIO_CONFIGS = {
    '9:16': {
        'width': 720,
        'height': 1280,
        'bitrate': 2500000
    },
    '1:1': {
        'width': 1080,
        'height': 1080,
        'bitrate': 4000000
    },
    '16:9': {
        'width': 1920,
        'height': 1080,
        'bitrate': 8000000
    }
}

def lambda_handler(event, context):
    """
    Process media files using AWS Elemental MediaConvert
    Generate multiple aspect ratios with subtitles
    """
    try:
        media_uri = event['media_uri']
        aspect_ratio = event['aspect_ratio']
        subtitle_languages = event.get('subtitle_languages', [])
        
        # Analyze content with Rekognition
        content_analysis = analyze_content(media_uri)
        
        if not content_analysis['safe_for_distribution']:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Content flagged by moderation'})
            }
        
        # Create MediaConvert job
        job_id = create_mediaconvert_job(
            media_uri,
            aspect_ratio,
            subtitle_languages,
            content_analysis
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'job_id': job_id,
                'aspect_ratio': aspect_ratio,
                'content_analysis': content_analysis
            })
        }
        
    except Exception as e:
        print(f"Error in media processing: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def analyze_content(s3_uri):
    """Analyze video content using Rekognition"""
    bucket, key = parse_s3_uri(s3_uri)
    
    # Detect faces
    faces_response = rekognition.detect_faces(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}},
        Attributes=['ALL']
    )
    
    # Detect text
    text_response = rekognition.detect_text(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    
    # Content moderation
    moderation_response = rekognition.detect_moderation_labels(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}},
        MinConfidence=75
    )
    
    return {
        'faces_detected': len(faces_response['FaceDetails']),
        'text_detected': len(text_response['TextDetections']) > 0,
        'moderation_labels': [l['Name'] for l in moderation_response['ModerationLabels']],
        'safe_for_distribution': len(moderation_response['ModerationLabels']) == 0
    }

def create_mediaconvert_job(media_uri, aspect_ratio, subtitle_languages, analysis):
    """Create MediaConvert job with specified configuration"""
    config = ASPECT_RATIO_CONFIGS[aspect_ratio]
    bucket, key = parse_s3_uri(media_uri)
    
    job_settings = {
        'Inputs': [{
            'FileInput': media_uri,
            'AudioSelectors': {
                'Audio Selector 1': {'DefaultSelection': 'DEFAULT'}
            },
            'VideoSelector': {},
            'TimecodeSource': 'ZEROBASED'
        }],
        'OutputGroups': [{
            'Name': f'Output_{aspect_ratio}',
            'OutputGroupSettings': {
                'Type': 'FILE_GROUP_SETTINGS',
                'FileGroupSettings': {
                    'Destination': f's3://{OUTPUT_BUCKET}/{aspect_ratio}/'
                }
            },
            'Outputs': [{
                'VideoDescription': {
                    'Width': config['width'],
                    'Height': config['height'],
                    'CodecSettings': {
                        'Codec': 'H_264',
                        'H264Settings': {
                            'RateControlMode': 'CBR',
                            'Bitrate': config['bitrate'],
                            'FramerateControl': 'SPECIFIED',
                            'FramerateNumerator': 30,
                            'FramerateDenominator': 1
                        }
                    }
                },
                'AudioDescriptions': [{
                    'CodecSettings': {
                        'Codec': 'AAC',
                        'AacSettings': {
                            'Bitrate': 128000,
                            'SampleRate': 48000
                        }
                    }
                }]
            }]
        }]
    }
    
    response = mediaconvert.create_job(
        Role=os.environ['MEDIACONVERT_ROLE'],
        Settings=job_settings
    )
    
    return response['Job']['Id']

def parse_s3_uri(s3_uri):
    """Parse S3 URI into bucket and key"""
    parts = s3_uri.replace('s3://', '').split('/', 1)
    return parts[0], parts[1]
