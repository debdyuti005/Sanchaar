# Supervisor Agent Workflow Specification

## Agent Identity

**Name:** Sanchaar Supervisor  
**Model:** Claude 3.5 Sonnet (anthropic.claude-3-5-sonnet-20241022-v2:0)  
**Role:** Orchestration coordinator and quality gatekeeper

## Purpose

The Supervisor Agent coordinates the entire content transcreation pipeline, assigning tasks to specialized agents, validating quality, and ensuring cost-effective execution.

## Input Schema

```json
{
  "content_id": "uuid",
  "voice_command": {
    "transcript": "string",
    "language": "string",
    "audio_s3_uri": "string"
  },
  "media_uploads": [
    {
      "type": "video|image|audio",
      "s3_uri": "string",
      "metadata": {}
    }
  ],
  "user_preferences": {
    "target_languages": ["hi", "ta", "te", "bn"],
    "target_platforms": ["whatsapp", "sharechat", "instagram"],
    "tone": "formal|casual|humorous",
    "urgency": "low|medium|high"
  }
}
```

## Workflow States

### 1. Intent Parsing

**Action:** Extract creator intent from voice command

**Logic:**
- Identify content type (announcement, promotion, story, educational)
- Extract target audience demographics
- Determine cultural sensitivity requirements
- Parse platform preferences

**Output:**
```json
{
  "intent": "product_launch",
  "audience": "youth_18_35",
  "cultural_sensitivity": "high",
  "platforms": ["instagram", "sharechat"]
}
```

### 2. Task Assignment

**Action:** Assign work to specialized agents based on intent

**Decision Tree:**
```
IF media_uploads.length > 0:
  → Assign to Media Factory Agent (parallel)
  
IF target_languages.length > 1:
  → Assign to Transcreation Agent (parallel per language)
  
ALWAYS:
  → Assign to Platform Strategy Agent (after transcreation)
```

**Parallelization Rules:**
- Transcreation: Max 10 concurrent language jobs
- Media Processing: Max 3 concurrent aspect ratios
- Distribution: Sequential per platform (rate limit compliance)

### 3. Quality Validation

**Action:** Validate outputs before distribution

**Quality Thresholds:**

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| BLEU Score | >0.75 | Re-transcreate with higher temperature |
| Cultural Accuracy | >0.85 | Flag for human review |
| Semantic Similarity | >0.90 | Retry with additional context |
| Video Encoding Success | 100% | Retry with fallback settings |
| Subtitle Sync Accuracy | >0.95 | Regenerate subtitles |

**Validation Logic:**
```python
def validate_transcreation(output):
    if output.bleu_score < 0.75:
        return {"status": "retry", "reason": "low_bleu"}
    if output.cultural_accuracy < 0.85:
        return {"status": "human_review", "reason": "cultural_check"}
    if output.semantic_similarity < 0.90:
        return {"status": "retry", "reason": "semantic_drift"}
    return {"status": "approved"}
```

### 4. Error Handling

**Retry Strategy:**
- Transcreation failures: 3 retries with exponential backoff
- Media processing failures: 2 retries with fallback encoding
- Distribution failures: 5 retries with platform-specific backoff

**Fallback Actions:**
- If Transcreation Agent fails: Use direct translation service
- If Media Factory fails: Use original media without processing
- If Platform Strategy fails: Queue for manual distribution

**Circuit Breaker:**
- If >30% of jobs fail in 5-minute window: Pause pipeline, alert ops team
- If specific language consistently fails: Disable that language, notify

### 5. Cost Optimization

**Budget Rules:**
- Target: <$2 per content piece across 10 languages
- If projected cost >$3: Reduce quality settings or language count
- Prefer cached transcreations for similar content (>0.95 similarity)

**Optimization Logic:**
```python
def optimize_cost(content):
    # Check cache for similar content
    similar = search_cache(content.text, threshold=0.95)
    if similar:
        return {"action": "use_cache", "savings": 0.80}
    
    # Estimate cost
    estimated_cost = calculate_cost(content)
    if estimated_cost > 3.0:
        return {"action": "reduce_quality", "target_cost": 2.5}
    
    return {"action": "proceed"}
```

## Action Groups

### assign_transcreation_task

**Parameters:**
- source_text: string
- source_language: string
- target_languages: array[string]
- tone: string
- cultural_context: object

**Returns:**
- task_id: string
- estimated_completion: timestamp

### assign_media_processing_task

**Parameters:**
- media_s3_uri: string
- aspect_ratios: array[string]
- subtitle_languages: array[string]
- quality_preset: string

**Returns:**
- task_id: string
- estimated_completion: timestamp

### assign_distribution_task

**Parameters:**
- content_variants: array[object]
- platforms: array[string]
- scheduling: object

**Returns:**
- task_id: string
- distribution_plan: object

### validate_quality

**Parameters:**
- output_type: string
- output_data: object
- quality_metrics: object

**Returns:**
- validation_status: "approved|retry|human_review"
- feedback: string

### handle_error

**Parameters:**
- error_type: string
- error_details: object
- retry_count: number

**Returns:**
- action: "retry|fallback|escalate"
- next_steps: array[string]

## Output Schema

```json
{
  "content_id": "uuid",
  "status": "completed|failed|partial",
  "transcreations": [
    {
      "language": "hi",
      "text": "string",
      "quality_score": 0.92,
      "agent_id": "transcreation-agent-1"
    }
  ],
  "media_variants": [
    {
      "aspect_ratio": "9:16",
      "s3_uri": "string",
      "cloudfront_url": "string"
    }
  ],
  "distribution_results": [
    {
      "platform": "whatsapp",
      "status": "delivered",
      "reach": 1250,
      "timestamp": "iso8601"
    }
  ],
  "total_cost": 1.85,
  "execution_time_seconds": 420
}
```

## Performance SLAs

- Intent parsing: <2 seconds
- Task assignment: <1 second
- Quality validation: <5 seconds per output
- Error handling: <3 seconds
- Total orchestration overhead: <15 seconds

## Monitoring & Alerts

**CloudWatch Metrics:**
- `SupervisorInvocations`
- `TaskAssignmentLatency`
- `QualityValidationFailures`
- `CostPerContent`

**Alarms:**
- Quality validation failure rate >10%
- Average cost per content >$2.50
- Orchestration latency >20 seconds
