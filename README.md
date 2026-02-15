# Sanchaar 🇮🇳

> **Production-Grade Agentic Content Supply Chain for Bharat**

Sanchaar automates the transcreation and distribution of media content across India's regional platforms, breaking linguistic barriers through autonomous AI agents.

## 🎯 The Bharat Impact

India's 1.4 billion people speak 22+ official languages, yet most digital content reaches only 15-20% of its potential audience. Sanchaar solves this through:

- **Autonomous Transcreation**: Goes beyond translation to adapt cultural context, idioms, and regional sentiment
- **Zero-UI Voice Commands**: Speak your content idea, get it distributed across 10+ languages in minutes
- **Platform Intelligence**: Automatically formats for WhatsApp, ShareChat, Instagram with optimal aspect ratios
- **Edge Delivery**: Sub-second content delivery across India's diverse network conditions

## 🏗️ Architecture

Serverless multi-agent system built on AWS:

```
Voice Input → Bedrock Supervisor → [Transcreation | Media Factory | Platform Strategy] → Regional Distribution
```

### Tech Stack

**AI & Orchestration:**
- Amazon Bedrock (Claude 3.5 Sonnet) - Multi-agent coordination
- AWS Step Functions - Workflow orchestration
- Amazon Transcribe - Voice-first ingestion

**Processing:**
- AWS Elemental MediaConvert - Multi-format video processing
- AWS Lambda - Serverless compute
- Amazon Rekognition - Content analysis

**Data & Search:**
- Amazon DynamoDB - Metadata storage
- OpenSearch Serverless - Vector search for Indic RAG
- Amazon S3 - Content lake

**Delivery:**
- Amazon CloudFront - Edge delivery across India
- WhatsApp Business API - Direct messaging
- ShareChat API - Regional social platform
- Instagram Graph API - Visual content distribution

## 🚀 Quick Start

### Prerequisites

- AWS Account with Bedrock access enabled
- AWS CLI configured with appropriate credentials
- Node.js 18+ or Python 3.11+
- SAM CLI or CDK installed

### Setup

1. **Clone and Configure**
```bash
git clone <repository-url>
cd sanchaar
cp .env.example .env
# Edit .env with your AWS credentials and API keys
```

2. **Deploy Infrastructure**

Using AWS SAM:
```bash
cd infrastructure/sam
sam build
sam deploy --guided
```

Using AWS CDK:
```bash
cd infrastructure/cdk
npm install
cdk bootstrap
cdk deploy --all
```

3. **Initialize Knowledge Base**
```bash
# Upload Indic language corpus to OpenSearch
python scripts/init-knowledge-base.py --corpus-path ./data/indic-corpus
```

4. **Configure Platform APIs**
```bash
# Set up WhatsApp, ShareChat, Instagram credentials
python scripts/configure-platforms.py
```

### First Content Pipeline

```bash
# Upload a voice command
aws s3 cp sample-voice.mp3 s3://sanchaar-ingestion-{region}/voice-commands/

# Monitor pipeline execution
aws stepfunctions describe-execution --execution-arn <arn>

# Check distributed content
aws dynamodb get-item --table-name SanchaarContent --key '{"content_id": {"S": "uuid"}}'
```

## 📋 Project Structure

```
sanchaar/
├── infrastructure/
│   ├── sam/                    # AWS SAM templates
│   │   ├── template.yaml
│   │   └── functions/
│   └── cdk/                    # AWS CDK stacks
│       ├── lib/
│       └── bin/
├── agents/
│   ├── supervisor/             # Bedrock Supervisor agent
│   ├── transcreation/          # Transcreation agent
│   ├── media-factory/          # Media processing agent
│   └── platform-strategy/      # Distribution agent
├── .kiro/
│   ├── specs/                  # Kiro agent specifications
│   │   ├── supervisor-workflow.md
│   │   ├── transcreation-agent.md
│   │   ├── media-factory-agent.md
│   │   └── platform-strategy-agent.md
│   └── steering/               # Project guidelines
├── scripts/
│   ├── init-knowledge-base.py
│   └── configure-platforms.py
├── data/
│   └── indic-corpus/           # Regional language datasets
├── tests/
├── docs/
├── requirements.md             # Detailed requirements
├── design.md                   # System design specification
└── README.md
```

## 🎨 Kiro Spec-Driven Architecture

Sanchaar uses Kiro specifications to govern agent behavior:

- **`.kiro/specs/supervisor-workflow.md`**: Orchestration logic and quality gates
- **`.kiro/specs/transcreation-agent.md`**: Language adaptation rules and thresholds
- **`.kiro/specs/media-factory-agent.md`**: Aspect ratio specs (9:16/1:1/16:9) and encoding
- **`.kiro/specs/platform-strategy-agent.md`**: Distribution strategies per platform

These specs ensure consistent, auditable agent behavior across the pipeline.

## 🔒 Security & Compliance

- **Encryption**: KMS-encrypted at rest (S3, DynamoDB, OpenSearch), TLS 1.3 in transit
- **IAM**: Least-privilege roles with MFA for production
- **Audit**: CloudTrail logging for all operations
- **Data Residency**: All data stored in ap-south-1 (Mumbai)
- **Compliance**: IT Act 2000, GDPR-ready

## 📊 Performance Targets

- Voice processing: <3 seconds
- Transcreation per language: <30 seconds
- Video processing (1-min): <2 minutes
- End-to-end pipeline: <10 minutes for 10 languages
- Cost: <$2 per content piece across 10 languages

## 🌐 Supported Languages

Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, English, and more.

## 📈 Monitoring

Access CloudWatch dashboards:
- Pipeline health and latency metrics
- Agent performance and quality scores
- Cost attribution per content piece
- Distribution success rates

## 🤝 Contributing

This is a production-grade reference architecture. For customization:

1. Modify Kiro specs in `.kiro/specs/` for agent behavior changes
2. Update SAM/CDK templates for infrastructure changes
3. Extend platform connectors in `agents/platform-strategy/`

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built for Bharat's linguistic diversity. Powered by AWS serverless and Amazon Bedrock.

---

**Cost Estimate**: ~$3,762/month for 1000 content pieces across 10 languages  
**Maintained by**: [Your Team]  
**AWS Well-Architected**: ✅ Operational Excellence | ✅ Security | ✅ Reliability | ✅ Performance | ✅ Cost Optimization
