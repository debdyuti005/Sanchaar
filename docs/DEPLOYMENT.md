# Sanchaar Deployment Guide

## Prerequisites

1. **AWS Account Setup**
   - AWS Account with admin access
   - AWS CLI configured (`aws configure`)
   - Bedrock model access enabled (Claude 3.5 Sonnet)
   - Service quotas verified:
     - Lambda concurrent executions: 1000+
     - Step Functions executions: 10000+
     - MediaConvert jobs: 100+

2. **Development Tools**
   - AWS SAM CLI: `pip install aws-sam-cli`
   - Python 3.11+
   - Node.js 18+ (for CDK option)

3. **Platform API Access**
   - WhatsApp Business API account
   - ShareChat Developer account
   - Instagram Business account with Graph API

## Deployment Steps

### Option 1: AWS SAM Deployment

```bash
# 1. Navigate to SAM directory
cd infrastructure/sam

# 2. Build the application
sam build

# 3. Deploy with guided prompts
sam deploy --guided

# Follow prompts:
# - Stack Name: sanchaar-dev
# - AWS Region: ap-south-1
# - Parameter Environment: dev
# - Parameter BedrockRegion: us-east-1
# - Confirm changes: Y
# - Allow SAM CLI IAM role creation: Y
# - Save arguments to config: Y

# 4. Note the outputs (bucket names, table name, etc.)
```

### Option 2: AWS CDK Deployment

```bash
# 1. Navigate to CDK directory
cd infrastructure/cdk

# 2. Install dependencies
npm install

# 3. Bootstrap CDK (first time only)
cdk bootstrap

# 4. Deploy all stacks
cdk deploy --all

# 5. Confirm deployment
```

## Post-Deployment Configuration

### 1. Configure Platform APIs

```bash
# Run configuration script
python scripts/configure-platforms.py

# Enter credentials when prompted:
# - WhatsApp: Phone Number ID, API Key
# - ShareChat: API Key, API Secret
# - Instagram: User ID, Access Token
```

### 2. Initialize Knowledge Base

```bash
# Create OpenSearch collection and indexes
python scripts/init-knowledge-base.py --corpus-path ./data/indic-corpus

# Upload your Indic language corpus
# (Place files in data/indic-corpus/ before running)
```

### 3. Configure Bedrock Agents

```bash
# Navigate to AWS Bedrock Console
# 1. Create Supervisor Agent
#    - Name: sanchaar-supervisor-dev
#    - Model: Claude 3.5 Sonnet
#    - Instructions: Copy from .kiro/specs/supervisor-workflow.md

# 2. Create Transcreation Agent
#    - Name: sanchaar-transcreation-dev
#    - Model: Claude 3.5 Sonnet
#    - Knowledge Base: sanchaar-indic-kb
#    - Instructions: Copy from .kiro/specs/transcreation-agent.md

# 3. Create Media Factory Agent
#    - Name: sanchaar-media-factory-dev
#    - Model: Claude 3.5 Sonnet with Vision
#    - Instructions: Copy from .kiro/specs/media-factory-agent.md

# 4. Create Platform Strategy Agent
#    - Name: sanchaar-platform-strategy-dev
#    - Model: Claude 3.5 Sonnet
#    - Instructions: Copy from .kiro/specs/platform-strategy-agent.md
```

### 4. Update Step Functions

```bash
# Update state machine with Bedrock Agent IDs
# Edit infrastructure/sam/statemachine/content_pipeline.asl.json
# Replace placeholder agent IDs with actual IDs from Bedrock Console

# Redeploy
sam deploy
```

## Testing the Pipeline

### 1. Upload Test Voice Command

```bash
# Upload sample audio file
aws s3 cp test-audio.mp3 s3://sanchaar-ingestion-dev-ACCOUNT_ID/voice-commands/test-user/

# Monitor Step Functions execution
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:REGION:ACCOUNT:stateMachine:SanchaarContentPipeline-dev

# Get execution details
aws stepfunctions describe-execution \
  --execution-arn EXECUTION_ARN
```

### 2. Check DynamoDB for Results

```bash
# Query content table
aws dynamodb scan \
  --table-name SanchaarContent-dev \
  --limit 10
```

### 3. Verify CloudFront Distribution

```bash
# Get CloudFront URL from stack outputs
aws cloudformation describe-stacks \
  --stack-name sanchaar-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text

# Access processed content
curl https://CLOUDFRONT_URL/9x16/video.mp4
```

## Monitoring & Troubleshooting

### CloudWatch Dashboards

```bash
# Create custom dashboard
aws cloudwatch put-dashboard \
  --dashboard-name Sanchaar-Pipeline \
  --dashboard-body file://docs/cloudwatch-dashboard.json
```

### Common Issues

**Issue: Bedrock Access Denied**
```bash
# Enable Bedrock model access
# Go to AWS Console > Bedrock > Model access
# Request access to Claude 3.5 Sonnet
```

**Issue: MediaConvert Job Fails**
```bash
# Check IAM role permissions
# Ensure MediaConvert has access to S3 buckets
aws iam get-role --role-name MediaConvertRole
```

**Issue: Platform API Rate Limits**
```bash
# Check CloudWatch logs
aws logs tail /aws/lambda/Sanchaar-PlatformDistributor-dev --follow

# Implement exponential backoff in code
```

## Production Deployment

### 1. Update Environment

```bash
# Deploy to production
sam deploy --config-env prod

# Or with CDK
cdk deploy --all --context environment=prod
```

### 2. Enable Production Features

- Multi-region failover
- Enhanced monitoring and alerting
- Increased Lambda reserved concurrency
- DynamoDB auto-scaling
- WAF rules for CloudFront

### 3. Security Hardening

```bash
# Enable AWS Config rules
# Enable GuardDuty
# Set up AWS Security Hub
# Configure CloudTrail for audit logging
```

## Rollback Procedure

```bash
# SAM rollback
sam deploy --no-execute-changeset

# CDK rollback
cdk deploy --rollback

# Manual rollback via CloudFormation
aws cloudformation cancel-update-stack --stack-name sanchaar-prod
```

## Cost Estimation

**Development Environment:**
- ~$500/month (low usage)

**Production Environment:**
- ~$3,762/month (1000 content pieces)
- Scales linearly with usage

## Support

For issues or questions:
- Check CloudWatch Logs
- Review Step Functions execution history
- Consult AWS Well-Architected best practices
- Contact: [Your Support Email]
