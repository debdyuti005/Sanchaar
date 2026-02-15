# Transcreation Agent Specification

## Agent Identity

**Name:** Sanchaar Transcreation Agent  
**Model:** Claude 3.5 Sonnet with Indic RAG  
**Role:** Intelligent language adaptation with cultural context

## Purpose

Transform content across linguistic boundaries while preserving semantic meaning, cultural relevance, and brand voice. Goes beyond literal translation to adapt idioms, references, and tone for regional audiences.

## Input Schema

```json
{
  "task_id": "uuid",
  "source_text": "string",
  "source_language": "en|hi|ta|te|...",
  "target_languages": ["hi", "ta", "te", "bn", "mr"],
  "tone": "formal|casual|humorous|inspirational",
  "cultural_context": {
    "occasion": "festival|product_launch|announcement",
    "target_audience": "youth|family|professional",
    "brand_voice": "friendly|authoritative|playful"
  },
  "constraints": {
    "max_length": 500,
    "preserve_hashtags": true,
    "preserve_mentions": true
  }
}
```

## RAG Knowledge Base

### OpenSearch Serverless Collection

**Collection Name:** `sanchaar-indic-kb`

**Indexes:**

1. **cultural-references**
   - Festivals, traditions, regional customs
   - Example: "Diwali" → Regional variants (Deepavali in Tamil, Dipavali in Kannada)

2. **idioms-phrases**
   - Common expressions and their regional equivalents
   - Example: "break the ice" → Hindi: "बर्फ तोड़ना", Tamil: "பனியை உடைக்க"

3. **brand-guidelines**
   - Approved terminology, tone examples
   - Product names, taglines in multiple languages

### RAG Query Strategy

```python
def retrieve_context(source_text, target_language):
    # Extract key phrases
    key_phrases = extract_phrases(source_text)
    
    # Query each index
    cultural_hits = query_index("cultural-references", key_phrases, target_language)
    idiom_hits = query_index("idioms-phrases", key_phrases, target_language)
    brand_hits = query_index("brand-guidelines", key_phrases, target_language)
    
    # Combine and rank
    context = combine_results([cultural_hits, idiom_hits, brand_hits])
    return context[:5]  # Top 5 most relevant
```

## Transcreation Process

### Step 1: Semantic Analysis

**Action:** Understand source text intent and structure

**Extract:**
- Core message and key points
- Emotional tone and sentiment
- Cultural references and idioms
- Named entities (people, places, brands)
- Hashtags and mentions

### Step 2: Cultural Adaptation

**Action:** Retrieve regional context from RAG

**Adaptation Rules:**

| Element | Strategy |
|---------|----------|
| Festivals | Use regional name (Diwali → Deepavali for Tamil) |
| Food items | Substitute with regional equivalent (Roti → Chapati/Phulka) |
| Idioms | Replace with culturally equivalent expression |
| Humor | Adapt jokes to regional sensibilities |
| Formality | Adjust based on target audience and language norms |

**Example:**
```
Source (English): "Let's break the ice with our new summer collection!"

Hindi (Formal): "आइए हमारे नए ग्रीष्मकालीन संग्रह के साथ बातचीत की शुरुआत करें!"
Tamil (Casual): "நம்ம புதிய கோடை கலெக்‌ஷனோட பேச்சை ஆரம்பிக்கலாம்!"
Telugu (Youth): "మన కొత్త వేసవి కలెక్షన్‌తో మాట్లాడటం మొదలుపెడదాం!"
```

### Step 3: Linguistic Transformation

**Action:** Generate target language text

**Guidelines:**
- Maintain sentence structure appropriate for target language
- Use proper Unicode rendering for Indic scripts
- Preserve brand names unless localized version exists
- Keep hashtags in English or transliterate appropriately
- Maintain @mentions exactly as source

### Step 4: Quality Validation

**Metrics:**

1. **BLEU Score** (Bilingual Evaluation Understudy)
   - Threshold: >0.75
   - Measures n-gram overlap with reference translations

2. **Semantic Similarity**
   - Threshold: >0.90
   - Cosine similarity of embeddings (source vs back-translated)

3. **Cultural Accuracy**
   - Threshold: >0.85
   - Validated against regional corpus

4. **Length Compliance**
   - Must fit within platform constraints
   - WhatsApp: 1024 chars, Instagram: 2200 chars

## Output Schema

```json
{
  "task_id": "uuid",
  "transcreations": [
    {
      "language": "hi",
      "text": "आइए हमारे नए ग्रीष्मकालीन संग्रह के साथ बातचीत की शुरुआत करें!",
      "quality_metrics": {
        "bleu_score": 0.82,
        "semantic_similarity": 0.94,
        "cultural_accuracy": 0.89
      },
      "adaptations": [
        {
          "original": "break the ice",
          "adapted": "बातचीत की शुरुआत करें",
          "reason": "idiomatic_expression"
        }
      ],
      "confidence_score": 0.91,
      "processing_time_ms": 2340
    }
  ],
  "status": "completed|partial|failed",
  "fallback_used": false
}
```

## Error Handling

### Low Quality Output

**If BLEU < 0.75:**
- Retry with temperature=0.3 (more conservative)
- Add more RAG context (top 10 instead of 5)
- Use few-shot examples from brand guidelines

**If Semantic Similarity < 0.90:**
- Back-translate to source language
- Compare with original
- Adjust prompt to emphasize meaning preservation

**If Cultural Accuracy < 0.85:**
- Flag for human review
- Provide alternative transcreation
- Log cultural mismatch for corpus improvement

### Fallback Strategy

If agent fails after 3 retries:
1. Use AWS Translate for direct translation
2. Mark as "requires_human_review"
3. Notify content team
4. Proceed with other languages

## Supported Languages

| Language | Code | Script | RAG Coverage |
|----------|------|--------|--------------|
| Hindi | hi | Devanagari | High |
| Tamil | ta | Tamil | High |
| Telugu | te | Telugu | High |
| Bengali | bn | Bengali | High |
| Marathi | mr | Devanagari | High |
| Gujarati | gu | Gujarati | Medium |
| Kannada | kn | Kannada | Medium |
| Malayalam | ml | Malayalam | Medium |
| Punjabi | pa | Gurmukhi | Medium |
| Odia | or | Odia | Medium |
| Assamese | as | Bengali | Low |
| Urdu | ur | Perso-Arabic | Low |

## Performance Targets

- Processing time: <30 seconds per language
- Throughput: 10 concurrent languages
- Quality score: >0.85 average across all metrics
- Cache hit rate: >40% for similar content

## Monitoring

**CloudWatch Metrics:**
- `TranscreationLatency` (per language)
- `QualityScoreAverage`
- `RAGQueryLatency`
- `FallbackRate`

**Logs:**
- All transcreations with quality scores
- Cultural adaptations made
- RAG context retrieved
- Retry attempts and reasons
