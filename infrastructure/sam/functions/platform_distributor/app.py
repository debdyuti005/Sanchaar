import json
import boto3
import os
import requests
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
CONTENT_TABLE = os.environ['CONTENT_TABLE']
table = dynamodb.Table(CONTENT_TABLE)

# Platform API credentials
WHATSAPP_API_KEY = os.environ.get('WHATSAPP_API_KEY')
SHARECHAT_API_KEY = os.environ.get('SHARECHAT_API_KEY')
INSTAGRAM_ACCESS_TOKEN = os.environ.get('INSTAGRAM_ACCESS_TOKEN')

def lambda_handler(event, context):
    """
    Distribute content to regional platforms
    """
    try:
        platform = event['platform']
        content_variants = event['content_variants']
        media_urls = event['media_urls']
        
        if platform == 'whatsapp':
            result = distribute_to_whatsapp(content_variants, media_urls)
        elif platform == 'sharechat':
            result = distribute_to_sharechat(content_variants, media_urls)
        elif platform == 'instagram':
            result = distribute_to_instagram(content_variants, media_urls)
        else:
            raise ValueError(f"Unsupported platform: {platform}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'platform': platform,
                'status': 'delivered',
                'result': result
            })
        }
        
    except Exception as e:
        print(f"Error distributing to {platform}: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def distribute_to_whatsapp(content_variants, media_urls):
    """Distribute via WhatsApp Business API"""
    url = "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages"
    headers = {
        'Authorization': f'Bearer {WHATSAPP_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    results = []
    for variant in content_variants:
        payload = {
            'messaging_product': 'whatsapp',
            'to': variant['recipient'],
            'type': 'video',
            'video': {
                'link': media_urls.get('9:16'),
                'caption': variant['text'][:1024]
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        results.append({
            'language': variant['language'],
            'status': response.status_code,
            'message_id': response.json().get('messages', [{}])[0].get('id')
        })
    
    return results

def distribute_to_sharechat(content_variants, media_urls):
    """Distribute via ShareChat API"""
    url = "https://api.sharechat.com/v2/posts"
    headers = {
        'Authorization': f'Bearer {SHARECHAT_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    results = []
    for variant in content_variants:
        payload = {
            'content_type': 'video',
            'video_url': media_urls.get('9:16'),
            'caption': variant['text'][:500],
            'language': variant['language'],
            'tags': variant.get('hashtags', []),
            'visibility': 'public'
        }
        
        response = requests.post(url, headers=headers, json=payload)
        results.append({
            'language': variant['language'],
            'status': response.status_code,
            'post_id': response.json().get('post_id')
        })
    
    return results

def distribute_to_instagram(content_variants, media_urls):
    """Distribute via Instagram Graph API"""
    base_url = "https://graph.facebook.com/v18.0"
    ig_user_id = "IG_USER_ID"  # Should be from config
    
    results = []
    for variant in content_variants:
        # Step 1: Create media container
        container_url = f"{base_url}/{ig_user_id}/media"
        container_payload = {
            'media_type': 'STORIES',
            'video_url': media_urls.get('9:16'),
            'caption': variant['text'][:2200],
            'access_token': INSTAGRAM_ACCESS_TOKEN
        }
        
        container_response = requests.post(container_url, data=container_payload)
        container_id = container_response.json().get('id')
        
        # Step 2: Publish media
        publish_url = f"{base_url}/{ig_user_id}/media_publish"
        publish_payload = {
            'creation_id': container_id,
            'access_token': INSTAGRAM_ACCESS_TOKEN
        }
        
        publish_response = requests.post(publish_url, data=publish_payload)
        results.append({
            'language': variant['language'],
            'status': publish_response.status_code,
            'media_id': publish_response.json().get('id')
        })
    
    return results
