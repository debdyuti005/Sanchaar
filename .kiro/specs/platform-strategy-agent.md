# Platform Strategy Agent Specification

## Agent Identity

**Name:** Sanchaar Platform Strategy Agent  
**Model:** Claude 3.5 Sonnet  
**Role:** Distribution optimization and platform-specific formatting

## Purpose

Optimize content distribution across regional platforms (WhatsApp, ShareChat, Instagram) with platform-specific metadata, optimal timing, and engagement strategies.

## Input Schema

```json
{
  "task_id": "uuid",
  "content_variants": [
    {
      "language": "hi",
      "text": "string",
      "media_urls": {
        "9:16": "https://cdn/video_9x16.mp4",
        "1:1": "https://cdn/video_1x1.mp4"
      }
    }
  ],
  "target_platforms": ["whatsapp", "sharechat", "instagram"],
  "scheduling": {
    "immediate": false,
    "optimal_time": true,
    "timezone": "Asia/Kolkata"
  },
  "strategy": {
    "ab_testing": true,
    "hashtag_optimization": true,
    "audience_targeting": "youth_18_35"
  }
}
```

## Platform Specifications

### WhatsApp Business API

**API Version:** Cloud API v18.0  
**Endpoint:** `https://graph.facebook.com/v18.0/{phone-number-id}/messages`

**Message Types:**
- Template messages (pre-approved)
- Text messages
- Media messages (image, video, document)

**Constraints:**
- Video: Max 16 MB
- Image: Max 5 MB
- Caption: Max 1024 characters
- Broadcast list: Max 256 recipients

**Optimal Format:**
- Aspect ratio: 9:16 or 1:1
- Duration: 15-30 seconds
- File size: <10 MB for better delivery

**API Call:**
```python
payload = {
    "messaging_product": "whatsapp",
    "to": "91XXXXXXXXXX",
    "type": "video",
    "video": {
        "link": media_url,
        "caption": transcreated_text[:1024]
    }
}
```

### ShareChat API

**API Version:** v2  
**Base URL:** `https://api.sharechat.com/v2`

**Post Types:**
- Image post
- Video post
- Text post

**Constraints:**
- Video: Max 100 MB, 10 minutes
- Image: Max 10 MB
- Caption: Max 500 characters
- Language tag: Required (ISO 639-1)

**Optimal Format:**
- Aspect ratio: 9:16 (preferred), 1:1
- Duration: 30-60 seconds
- Hashtags: 3-5 regional hashtags

**API Call:**
```python
payload = {
    "content_type": "video",
    "video_url": media_url,
    "caption": transcreated_text[:500],
    "language": "hi",
    "tags": ["#ProductLaunch", "#नयाउत्पाद"],
    "visibility": "public"
}
```

### Instagram Graph API

**API Version:** v18.0  
**Endpoint:** `https://graph.facebook.com/v18.0/{ig-user-id}/media`

**Media Types:**
- IMAGE
- VIDEO
- CAROUSEL_ALBUM
- STORIES

**Constraints:**
- Stories: Max 60s, 9:16 aspect ratio
- Feed: Max 60s, 1:1 or 4:5 aspect ratio
- Reels: Max 90s, 9:16 aspect ratio
- Caption: Max 2200 characters
- Hashtags: Max 30

**Optimal Format:**
- Stories: 1080x1920, <15s
- Feed: 1080x1080, 30-60s
- Reels: 1080x1920, 15-30s

**API Call (Stories):**
```python
# Step 1: Create media container
container = {
    "media_type": "STORIES",
    "video_url": media_url,
    "caption": transcreated_text[:2200]
}

# Step 2: Publish
publish = {
    "creation_id": container_id
}
```

## Distribution Strategy

### Optimal Posting Times

**Regional Analysis (IST):**

| Platform | Weekday | Weekend | Peak Engagement |
|----------|---------|---------|-----------------|
| WhatsApp | 7-9 PM | 10 AM-12 PM | 8:30 PM |
| ShareChat | 8-10 PM | 11 AM-2 PM | 9:00 PM |
| Instagram | 7-9 PM | 9-11 AM | 8:00 PM |

**Regional Variations:**
- North India: +0 hours
- South India: +30 minutes
- East India: +1 hour
- West India: -30 minutes

### Hashtag Optimization

**Strategy:**
- Mix of English and regional language hashtags
- 3-5 hashtags per platform
- Trending + evergreen combination

**Example (Hindi):**
```
English: #NewLaunch #Innovation #TechForBharat
Hindi: #नयाउत्पाद #भारतकेलिए #तकनीक
```

### Caption Formatting

**WhatsApp:**
- Short and direct (2-3 sentences)
- Call-to-action at the end
- Emoji usage: Moderate (2-3 per message)

**ShareChat:**
- Conversational tone
- Regional idioms encouraged
- Emoji usage: Liberal (5-7 per post)

**Instagram:**
- Longer storytelling (3-5 sentences)
- Hashtags at the end
- Emoji usage: Strategic (3-5 per post)

## A/B Testing

### Variant Creation

**Test Variables:**
- Caption variations (2 versions)
- Hashtag sets (2 versions)
- Posting times (2 time slots)

**Example:**
```json
{
  "variant_a": {
    "caption": "हमारे नए उत्पाद के साथ अपने जीवन को बदलें!",
    "hashtags": ["#नयाउत्पाद", "#जीवनबदलो"],
    "post_time": "20:00"
  },
  "variant_b": {
    "caption": "क्या आप तैयार हैं कुछ नया अनुभव करने के लिए?",
    "hashtags": ["#नयाअनुभव", "#तैयाररहो"],
    "post_time": "20:30"
  }
}
```

### Performance Tracking

**Metrics:**
- Reach
- Engagement rate (likes, comments, shares)
- Click-through rate (if link included)
- View completion rate (video)

## Output Schema

```json
{
  "task_id": "uuid",
  "distribution_plan": [
    {
      "platform": "whatsapp",
      "language": "hi",
      "media_url": "https://cdn/video_9x16.mp4",
      "caption": "string",
      "scheduled_time": "2026-02-15T20:00:00+05:30",
      "recipient_count": 1250,
      "status": "scheduled"
    }
  ],
  "ab_test_variants": [
    {
      "variant_id": "a",
      "platform": "instagram",
      "caption": "string",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "estimated_reach": 15000,
  "status": "completed"
}
```

## Error Handling

**API Rate Limits:**
- WhatsApp: 1000 messages/day (tier 1)
- ShareChat: 100 posts/day
- Instagram: 25 posts/day

**Retry Strategy:**
- Exponential backoff: 1s, 2s, 4s, 8s
- Max retries: 5
- If failed: Queue for manual review

## Monitoring

**CloudWatch Metrics:**
- `DistributionSuccessRate`
- `APILatency` (per platform)
- `EngagementRate` (from webhooks)
- `ABTestPerformance`
