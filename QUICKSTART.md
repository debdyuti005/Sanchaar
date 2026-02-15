# Sanchaar Quick Start

## Step 1: Install AWS SAM CLI

Choose one method:

**Method A - Using pip (Recommended):**
```powershell
pip install aws-sam-cli
sam --version
```

**Method B - Download MSI Installer:**
- Visit: https://github.com/aws/aws-sam-cli/releases/latest
- Download and run the Windows `.msi` installer
- Restart your terminal

**Method C - Using Chocolatey:**
```powershell
choco install aws-sam-cli
```

## Step 2: Configure AWS Credentials

```powershell
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: ap-south-1
# Default output format: json
```

## Step 3: Deploy Infrastructure

```powershell
# Navigate to SAM directory
cd infrastructure\sam

# Build
sam build

# Deploy
sam deploy --guided
```

During deployment, use these values:
- Stack Name: `sanchaar-dev`
- AWS Region: `ap-south-1`
- Parameter Environment: `dev`
- Parameter BedrockRegion: `us-east-1`
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Save arguments to config: `Y`

## Step 4: Configure Platform APIs

```powershell
python scripts\configure-platforms.py
```

## Step 5: Initialize Knowledge Base

```powershell
python scripts\init-knowledge-base.py
```

## Step 6: Test the Pipeline

```powershell
# Upload a test voice command
aws s3 cp test-audio.mp3 s3://sanchaar-ingestion-dev-YOUR_ACCOUNT_ID/voice-commands/test-user/

# Monitor execution
aws stepfunctions list-executions --state-machine-arn YOUR_STATE_MACHINE_ARN
```

## Need Help?

- **Installation Issues**: See `docs/SETUP.md`
- **Deployment Details**: See `docs/DEPLOYMENT.md`
- **Architecture Overview**: See `design.md`
- **Requirements**: See `requirements.md`

## Don't Have SAM CLI?

See `docs/SETUP.md` for alternative deployment methods including:
- AWS CDK
- Manual CloudFormation
- AWS Console (GUI)
