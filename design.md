# Sanchaar: System Design Specification

## Architecture Overview

Sanchaar implements a serverless multi-agent architecture on AWS, orchestrating specialized AI agents to automate content transcreation and distribution across Bharat's regional platforms.

### Core Principles

- **Serverless-First**: Zero infrastructure management, pay-per-use pricing
- **Agent-Driven**: Autonomous agents with specialized capabilities
- **Spec-Driven**: Kiro specifications govern agent behavior and workflows
- **Bharat-Centric**: Optimized for Indic languages and regional platforms

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     INGESTION LAYER                              │
│  Voice Commands → Amazon Transcribe → S3 (Raw Content)          │
│  Media Uploads → S3 Bucket → EventBridge Trigger                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ORCHESTRATION LAYER                            │
│  Amazon Bedrock Agent (Supervisor) - Claude 3.5 Sonnet          │
│  ├─ Workflow Coordination                                       │
│  ├─ Agent Task Assignment                                       │
│  └─ Quality Validation                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFORCE LAYER                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Transcreation    │  │ Media Factory    │  │ Platform      │ │
│  │ Agent            │  │ Agent            │  │ Strategy      │ │
│  │ (Indic RAG)      │  │ (Vision/Video)   │  │ Agent         │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING LAYER                              │
│  AWS Step Functions → Lambda → MediaConvert → S3 Output         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA & DELIVERY LAYER                           │
│  DynamoDB (Metadata) + OpenSearch (Vectors) + CloudFront        │
└─────────────────────────────────────────────────────────────────┘
```

## Layer-by-Layer Design

### 1. Ingestion Layer

#### Voice-First Command Center

**Components:**
- Amazon Transcribe (Real-time & Batch)
- S3 Bucket (sanchaar-ingestion-{region})
- Lambda (Voice Processor)

**Workflow:**
1. User speaks command via mobile app/web interface
2. Audio streamed to Transcribe (supports 10+ Indic languages)
3. Transcribed text + audio stored in S3
4. EventBridge rule triggers orchestration

**S3 Bucket Structure:**
```
sanchaar-ingestion/
├── voice-commands/
│   ├── {user-id}/
│   │   └── {timestamp}-{language}.json
├── media-uploads/
│   ├── video/
│   ├── images/
│   └── audio/
└── metadata/
```


**Transcribe Configuration:**
```json
{
  "LanguageCode": "hi-IN",
  "MediaFormat": "mp3",
  "Settings": {
    "ShowSpeakerLabels": true,
    "MaxSpeakerLabels": 2,
    "VocabularyName": "indic-content-vocab"
  }
}
```

### 2. Orchestration Layer

#### Bedrock Agent Supervisor

**Agent Configuration:**
- Model: Claude 3.5 Sonnet (anthropic.claude-3-5-sonnet-20241022-v2:0)
- Role: Workflow coordinator and quality gatekeeper
- Knowledge Base: Sanchaar operational guidelines

**Supervisor Responsibilities:**
1. Parse voice command intent
2. Assign tasks to specialized agents
3. Validate output quality
4. Handle error recovery
5. Optimize cost and performance

**Action Groups:**
- `assign_transcreation_task`
- `assign_media_processing_task`
- `assign_distribution_task`
- `validate_quality`
- `handle_error`

**Kiro Spec Integration:**
The Supervisor agent is governed by `.kiro/specs/supervisor-workflow.md` which defines:
- Task assignment logic
- Quality thresholds
- Error handling procedures
- Cost optimization rules

### 3. Workforce Layer

#### Agent 1: Transcreation Agent

**Purpose:** Intelligent language adaptation with cultural context

**Components:**
- Bedrock Agent (Claude 3.5 Sonnet)
- Knowledge Base: OpenSearch Serverless (Vector Engine)
- RAG Dataset: Indic language corpus (idioms, cultural references)

**Capabilities:**
- Semantic translation across 15+ Indic languages
- Cultural adaptation (festivals, regional references)
- Tone preservation (formal, casual, humorous)
- Brand voice consistency

**RAG Architecture:**
```
OpenSearch Serverless Collection: sanchaar-indic-kb
├── Index: cultural-references
│   └── Vectors: Titan Embeddings G1
├── Index: idioms-phrases
└── Index: brand-guidelines
```

**Kiro Spec:** `.kiro/specs/transcreation-agent.md`
```markdown
# Transcreation Agent Specification

## Input Schema
- source_text: string
- source_language: string
- target_languages: array[string]
- tone: enum[formal, casual, humorous]
- cultural_context: object

## Output Schema
- transcreated_variants: array[{
    language: string,
    text: string,
    cultural_adaptations: array[string],
    confidence_score: float
  }]

## Quality Thresholds
- BLEU Score: >0.75
- Cultural Accuracy: >0.85 (human-validated sample)
- Semantic Similarity: >0.90

## Error Handling
- Fallback to direct translation if RAG fails
- Flag low-confidence outputs for human review
```

#### Agent 2: Media Factory Agent

**Purpose:** Multi-format video/image processing

**Components:**
- Bedrock Agent (Claude 3.5 Sonnet with vision)
- AWS Elemental MediaConvert
- Lambda (Media Processor)
- Rekognition (Content analysis)

**Capabilities:**
- Aspect ratio conversion (9:16, 1:1, 16:9, 4:5)
- Regional subtitle generation with Unicode support
- Thumbnail extraction with text overlays
- Adaptive bitrate encoding (2G/3G/4G/5G)

**Media Processing Pipeline:**
```
Input Video → Rekognition Analysis → MediaConvert Job
├── Output 1: 9:16 (Stories) - 720x1280, H.264, AAC
├── Output 2: 1:1 (Feed) - 1080x1080, H.264, AAC
├── Output 3: 16:9 (YouTube) - 1920x1080, H.264, AAC
└── Subtitles: WebVTT format per language
```

**Kiro Spec:** `.kiro/specs/media-factory-agent.md`
```markdown
# Media Factory Agent Specification

## Aspect Ratio Specifications

### 9:16 (Vertical - Stories/Reels)
- Resolution: 720x1280 (HD), 1080x1920 (FHD)
- Codec: H.264, Profile: High, Level: 4.0
- Bitrate: 2.5 Mbps (HD), 5 Mbps (FHD)
- Audio: AAC, 128 kbps, 48 kHz
- Max Duration: 60 seconds
- Use Case: Instagram Stories, WhatsApp Status, ShareChat Stories

### 1:1 (Square - Feed)
- Resolution: 1080x1080
- Codec: H.264, Profile: High, Level: 4.0
- Bitrate: 4 Mbps
- Audio: AAC, 128 kbps, 48 kHz
- Max Duration: 90 seconds
- Use Case: Instagram Feed, ShareChat Feed

### 16:9 (Landscape - Standard)
- Resolution: 1920x1080
- Codec: H.264, Profile: High, Level: 4.2
- Bitrate: 8 Mbps
- Audio: AAC, 192 kbps, 48 kHz
- Max Duration: 600 seconds
- Use Case: YouTube, Facebook

## Subtitle Specifications
- Format: WebVTT with Unicode support
- Font: Noto Sans (supports all Indic scripts)
- Position: Bottom 20% of frame
- Background: Semi-transparent black (80% opacity)
- Text Color: White (#FFFFFF)
- Font Size: Responsive (5% of frame height)

## Security Protocols
- Content moderation via Rekognition
- PII detection and redaction
- Watermark embedding for brand protection
- DRM support for premium content
```

#### Agent 3: Platform Strategy Agent

**Purpose:** Distribution optimization and platform-specific formatting

**Components:**
- Bedrock Agent (Claude 3.5 Sonnet)
- Lambda (Platform Connectors)
- DynamoDB (Distribution Logs)

**Capabilities:**
- Platform-specific metadata generation
- Optimal posting time calculation
- Hashtag and caption optimization
- A/B testing variant creation

**Platform Integrations:**
- WhatsApp Business API (Cloud API)
- ShareChat API v2
- Instagram Graph API v18.0
- Meta Business Suite

**Kiro Spec:** `.kiro/specs/platform-strategy-agent.md`
```markdown
# Platform Strategy Agent Specification

## Platform Requirements

### WhatsApp Business API
- Message Type: template, text, media
- Media Size Limit: 16 MB (video), 5 MB (image)
- Caption Length: 1024 characters
- Broadcast List: Max 256 recipients per message

### ShareChat API
- Post Types: image, video, text
- Video Limit: 100 MB, 10 minutes
- Caption Length: 500 characters
- Language Tag: Required (ISO 639-1)

### Instagram Graph API
- Media Types: IMAGE, VIDEO, CAROUSEL
- Video Specs: Max 60s (Stories), 90s (Feed), 90s (Reels)
- Caption Length: 2200 characters
- Hashtags: Max 30 per post

## Distribution Strategy
- Prime Time: 7-9 PM IST (regional variations)
- Frequency: Max 3 posts per platform per day
- A/B Testing: 2 variants per content piece
- Performance Tracking: Engagement rate, reach, shares
```

### 4. Processing Layer

#### AWS Step Functions Orchestration

**State Machine:** `SanchaarContentPipeline`

**Workflow States:**
1. **ParseInput**: Extract metadata from voice command
2. **TranscreationParallel**: Invoke Transcreation Agent for all languages
3. **MediaProcessingParallel**: Generate platform-specific formats
4. **QualityValidation**: Supervisor validates outputs
5. **DistributionFanout**: Platform Strategy Agent distributes
6. **LogResults**: Store metadata in DynamoDB

**Step Functions Definition (ASL):**
```json
{
  "Comment": "Sanchaar Content Pipeline",
  "StartAt": "ParseInput",
  "States": {
    "ParseInput": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:ParseInputFunction",
      "Next": "TranscreationParallel"
    },
    "TranscreationParallel": {
      "Type": "Map",
      "ItemsPath": "$.target_languages",
      "MaxConcurrency": 10,
      "Iterator": {
        "StartAt": "InvokeTranscreationAgent",
        "States": {
          "InvokeTranscreationAgent": {
            "Type": "Task",
            "Resource": "arn:aws:states:::bedrock:invokeAgent",
            "End": true
          }
        }
      },
      "Next": "MediaProcessingParallel"
    },
    "MediaProcessingParallel": {
      "Type": "Map",
      "ItemsPath": "$.aspect_ratios",
      "MaxConcurrency": 3,
      "Iterator": {
        "StartAt": "InvokeMediaConvert",
        "States": {
          "InvokeMediaConvert": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:REGION:ACCOUNT:function:MediaConvertFunction",
            "End": true
          }
        }
      },
      "Next": "QualityValidation"
    }
  }
}
```

### 5. Data & Delivery Layer

#### DynamoDB Schema

**Table:** `SanchaarContent`
- Partition Key: `content_id` (UUID)
- Sort Key: `version` (timestamp)
- GSI1: `user_id-created_at-index`
- GSI2: `status-created_at-index`

**Attributes:**
```json
{
  "content_id": "uuid",
  "version": "timestamp",
  "user_id": "string",
  "source_language": "string",
  "target_languages": ["array"],
  "transcreations": {
    "hi": {"text": "...", "confidence": 0.95},
    "ta": {"text": "...", "confidence": 0.92}
  },
  "media_variants": {
    "9:16": "s3://path",
    "1:1": "s3://path"
  },
  "distribution_status": {
    "whatsapp": "delivered",
    "sharechat": "pending"
  },
  "created_at": "iso8601",
  "status": "completed"
}
```

#### OpenSearch Serverless

**Collection:** `sanchaar-indic-kb`
- Engine: Vector (k-NN)
- Embedding Model: Titan Embeddings G1 (1536 dimensions)
- Index Strategy: One index per language family

**Vector Search Configuration:**
```json
{
  "settings": {
    "index.knn": true,
    "index.knn.algo_param.ef_search": 512
  },
  "mappings": {
    "properties": {
      "embedding": {
        "type": "knn_vector",
        "dimension": 1536,
        "method": {
          "name": "hnsw",
          "engine": "faiss"
        }
      },
      "text": {"type": "text"},
      "language": {"type": "keyword"},
      "category": {"type": "keyword"}
    }
  }
}
```

#### CloudFront Distribution

**Configuration:**
- Origin: S3 bucket (sanchaar-output-{region})
- Edge Locations: India (Mumbai, Delhi, Chennai, Hyderabad)
- Cache Behavior: Cache based on Accept-Language header
- TTL: 86400 seconds (24 hours)
- Compression: Gzip, Brotli enabled

## Security Architecture

### IAM Roles & Policies

**Bedrock Agent Execution Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeAgent"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::sanchaar-*/*"
    }
  ]
}
```

### Encryption

- **At Rest**: S3 (SSE-KMS), DynamoDB (KMS), OpenSearch (KMS)
- **In Transit**: TLS 1.3 for all API calls
- **Key Management**: AWS KMS with automatic rotation

### Network Security

- VPC Endpoints for Bedrock, S3, DynamoDB
- Security Groups: Least privilege access
- NACLs: Deny all except required ports

## Cost Optimization

### Estimated Monthly Cost (1000 content pieces)

| Service | Usage | Cost |
|---------|-------|------|
| Bedrock (Claude 3.5) | 50M tokens | $750 |
| Transcribe | 500 hours | $750 |
| MediaConvert | 1000 hours | $1,200 |
| S3 Storage | 10 TB | $230 |
| DynamoDB | 10M writes | $12.50 |
| OpenSearch Serverless | 2 OCUs | $350 |
| CloudFront | 5 TB transfer | $425 |
| Step Functions | 100K transitions | $25 |
| Lambda | 10M invocations | $20 |
| **Total** | | **~$3,762** |

**Cost per Content Piece:** $3.76 (across 10 languages = $0.38/language)

### Optimization Strategies

1. **Intelligent Caching**: Cache transcreations for similar content
2. **Spot Instances**: Use for non-critical batch processing
3. **S3 Lifecycle**: Move to Glacier after 90 days
4. **Reserved Capacity**: OpenSearch Serverless committed usage
5. **Batch Processing**: Group similar jobs to reduce cold starts

## Monitoring & Observability

### CloudWatch Metrics

- Agent invocation latency (p50, p99)
- Transcreation quality scores
- MediaConvert job success rate
- Distribution delivery rate
- Cost per content piece

### X-Ray Tracing

- End-to-end pipeline tracing
- Agent interaction visualization
- Bottleneck identification

### Alarms

- Pipeline failure rate >5%
- Agent latency >30s
- Cost anomaly detection
- Quality score <0.80

## Disaster Recovery

- **RTO**: 4 hours
- **RPO**: 1 hour
- **Backup Strategy**: S3 Cross-Region Replication
- **Failover**: Multi-region Step Functions deployment

## Compliance

- **Data Residency**: All data stored in ap-south-1 (Mumbai)
- **Audit Logging**: CloudTrail enabled for all API calls
- **Access Control**: MFA required for production access
- **Retention**: 7-year log retention for compliance
