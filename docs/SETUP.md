# Sanchaar Setup Guide

## Prerequisites Installation

### Option 1: Install AWS SAM CLI (Recommended)

**Windows Installation:**

```powershell
# Using pip (requires Python 3.11+)
pip install aws-sam-cli

# Verify installation
sam --version
```

**Alternative - Using MSI Installer:**
1. Download from: https://github.com/aws/aws-sam-cli/releases/latest
2. Run the `.msi` installer
3. Restart your terminal

**Alternative - Using Chocolatey:**
```powershell
choco install aws-sam-cli
```

### Option 2: Use AWS CDK Instead

If you prefer CDK over SAM:

```powershell
# Install Node.js from https://nodejs.org/ (if not installed)
node --version

# Install AWS CDK
npm install -g aws-cdk

# Verify installation
cdk --version
```

### Option 3: Manual CloudFormation Deployment

You can deploy using AWS CLI directly with CloudFormation.

## AWS CLI Configuration

```powershell
# Install AWS CLI (if not installed)
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi

# Configure credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: ap-south-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

## Quick Start (Without SAM/CDK)

If you want to get started quickly without installing SAM/CDK, you can:

### 1. Deploy Core Infrastructure Manually

```powershell
# Create S3 buckets
aws s3 mb s3://sanchaar-ingestion-dev-YOUR_ACCOUNT_ID --region ap-south-1
aws s3 mb s3://sanchaar-output-dev-YOUR_ACCOUNT_ID --region ap-south-1

# Enable encryption
aws s3api put-bucket-encryption `
  --bucket sanchaar-ingestion-dev-YOUR_ACCOUNT_ID `
  --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'

# Create DynamoDB table
aws dynamodb create-table `
  --table-name SanchaarContent-dev `
  --attribute-definitions AttributeName=content_id,AttributeType=S AttributeName=version,AttributeType=N `
  --key-schema AttributeName=content_id,KeyType=HASH AttributeName=version,KeyType=RANGE `
  --billing-mode PAY_PER_REQUEST `
  --region ap-south-1
```

### 2. Deploy Lambda Functions Manually

```powershell
# Package Lambda function
cd infrastructure\sam\functions\voice_processor
pip install -r requirements.txt -t .
Compress-Archive -Path * -DestinationPath voice_processor.zip

# Create Lambda function
aws lambda create-function `
  --function-name Sanchaar-VoiceProcessor-dev `
  --runtime python3.11 `
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role `
  --handler app.lambda_handler `
  --zip-file fileb://voice_processor.zip `
  --region ap-south-1
```

## Recommended: Install SAM CLI

For the best experience, install SAM CLI:

```powershell
# Using pip
pip install aws-sam-cli

# Verify
sam --version

# Expected output: SAM CLI, version 1.x.x
```

## Post-Installation Steps

Once SAM CLI is installed:

```powershell
# Navigate to SAM directory
cd infrastructure\sam

# Build the application
sam build

# Deploy with guided setup
sam deploy --guided

# Follow the prompts:
# Stack Name: sanchaar-dev
# AWS Region: ap-south-1
# Confirm changes before deploy: Y
# Allow SAM CLI IAM role creation: Y
# Save arguments to configuration file: Y
```

## Troubleshooting

### Issue: Python not found
```powershell
# Install Python 3.11+ from https://www.python.org/downloads/
# Make sure to check "Add Python to PATH" during installation
```

### Issue: pip not found
```powershell
# Python should include pip, but if not:
python -m ensurepip --upgrade
```

### Issue: AWS credentials not configured
```powershell
# Configure AWS CLI
aws configure

# Or set environment variables
$env:AWS_ACCESS_KEY_ID="your-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret"
$env:AWS_DEFAULT_REGION="ap-south-1"
```

### Issue: Insufficient IAM permissions
You need the following permissions:
- CloudFormation: Full access
- S3: Create and manage buckets
- Lambda: Create and manage functions
- DynamoDB: Create and manage tables
- IAM: Create roles and policies
- Step Functions: Create state machines
- Bedrock: Invoke models and agents

## Alternative: Use AWS Console

If you prefer a GUI approach:

1. **S3 Buckets**: AWS Console > S3 > Create bucket
2. **DynamoDB**: AWS Console > DynamoDB > Create table
3. **Lambda**: AWS Console > Lambda > Create function (upload zip)
4. **Step Functions**: AWS Console > Step Functions > Create state machine
5. **Bedrock Agents**: AWS Console > Bedrock > Agents > Create agent

## Next Steps

After installation, proceed to:
- `docs/DEPLOYMENT.md` - Full deployment guide
- `README.md` - Project overview
- `.kiro/specs/` - Agent specifications

## Support Resources

- AWS SAM Documentation: https://docs.aws.amazon.com/serverless-application-model/
- AWS CLI Documentation: https://docs.aws.amazon.com/cli/
- Sanchaar Architecture: See `design.md`
