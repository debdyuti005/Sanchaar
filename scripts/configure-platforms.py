#!/usr/bin/env python3
"""
Configure platform API credentials in AWS Secrets Manager
"""
import boto3
import json
import getpass

secrets_manager = boto3.client('secretsmanager')

def store_secret(secret_name, secret_value):
    """Store or update secret in Secrets Manager"""
    try:
        secrets_manager.create_secret(
            Name=secret_name,
            SecretString=json.dumps(secret_value)
        )
        print(f"✓ Created secret: {secret_name}")
    except secrets_manager.exceptions.ResourceExistsException:
        secrets_manager.update_secret(
            SecretId=secret_name,
            SecretString=json.dumps(secret_value)
        )
        print(f"✓ Updated secret: {secret_name}")

def configure_whatsapp():
    """Configure WhatsApp Business API credentials"""
    print("\n📱 WhatsApp Business API Configuration")
    print("Get your credentials from: https://business.facebook.com/")
    
    phone_number_id = input("Phone Number ID: ").strip()
    api_key = getpass.getpass("API Key (Bearer Token): ").strip()
    
    store_secret('sanchaar/whatsapp', {
        'phone_number_id': phone_number_id,
        'api_key': api_key
    })

def configure_sharechat():
    """Configure ShareChat API credentials"""
    print("\n🗣️ ShareChat API Configuration")
    print("Get your credentials from ShareChat Developer Portal")
    
    api_key = getpass.getpass("API Key: ").strip()
    api_secret = getpass.getpass("API Secret: ").strip()
    
    store_secret('sanchaar/sharechat', {
        'api_key': api_key,
        'api_secret': api_secret
    })

def configure_instagram():
    """Configure Instagram Graph API credentials"""
    print("\n📸 Instagram Graph API Configuration")
    print("Get your credentials from: https://developers.facebook.com/")
    
    ig_user_id = input("Instagram User ID: ").strip()
    access_token = getpass.getpass("Access Token: ").strip()
    
    store_secret('sanchaar/instagram', {
        'ig_user_id': ig_user_id,
        'access_token': access_token
    })

def main():
    print("🔐 Sanchaar Platform Configuration")
    print("=" * 50)
    
    platforms = input("\nConfigure which platforms? (whatsapp,sharechat,instagram) [all]: ").strip()
    if not platforms or platforms.lower() == 'all':
        platforms = ['whatsapp', 'sharechat', 'instagram']
    else:
        platforms = [p.strip() for p in platforms.split(',')]
    
    if 'whatsapp' in platforms:
        configure_whatsapp()
    
    if 'sharechat' in platforms:
        configure_sharechat()
    
    if 'instagram' in platforms:
        configure_instagram()
    
    print("\n✅ Platform configuration complete!")
    print("\nSecrets stored in AWS Secrets Manager:")
    print("- sanchaar/whatsapp")
    print("- sanchaar/sharechat")
    print("- sanchaar/instagram")

if __name__ == '__main__':
    main()
