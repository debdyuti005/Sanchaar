# Media Factory Agent Specification

## Agent Identity

**Name:** Sanchaar Media Factory Agent  
**Model:** Claude 3.5 Sonnet with Vision  
**Role:** Multi-format video/image processing and optimization

## Purpose

Transform media content into platform-specific formats with regional language subtitles, optimized for India's diverse network conditions and device capabilities.

## Input Schema

```json
{
  "task_id": "uuid",
  "media_input": {
    "type": "video|image",
    "s3_uri": "s3://bucket/path/input.mp4",
    "duration_seconds": 45,
    "resolution": "1920x1080",
    "format": "mp4|mov|jpg|png"
  },
  "output_requirements": {
    "aspect_ratios": ["9:16", "1:1", "16:9"],
    "subtitle_languages": ["hi", "ta", "te"],
    "quality_presets": ["mobile", "hd", "fhd"],
    "thumbnail_count": 3
  },
  "content_analysis": {
    "detect_text": true,
    "detect_faces": true,
    "detect_unsafe_content": true
  }
}
```

## Aspect Ratio Specifications

### 9:16 (Vertical - Stories/Reels/Status)

**Resolution Options:**
- Mobile: 720x1280 (HD)
- High Quality: 1080x1920 (FHD)

**Encoding Settings:**
```json
{
  "codec": "H.264",
  "profile": "High",
  "level": "4.0",
  "bitrate": {
    "mobile": "2.5 Mbps",
    "hd": "5 Mbps"
  },
  "frame_rate": 30,
  "keyframe_interval": 2,
  "audio": {
    "codec": "AAC",
    "bitrate": "128 kbps",
    "sample_rate": "48 kHz",
    "channels": 2
  }
}
```

**Use Cases:**
- Instagram Stories (max 60s)
- WhatsApp Status (max 30s)
- ShareChat Stories (max 60s)
- Instagram Reels (max 90s)

**Cropping Strategy:**
- Center crop with face detection priority
- If faces detected: Keep faces in frame
- If text detected: Preserve text readability
- Safe zones: 10% margin from edges

### 1:1 (Square - Feed Posts)

**Resolution:**
- Standard: 1080x1080

**Encoding Settings:**
```json
{
  "codec": "H.264",
  "profile": "High",
  "level": "4.0",
  "bitrate": "4 Mbps",
  "frame_rate": 30,
  "keyframe_interval": 2,
  "audio": {
    "codec": "AAC",
    "bitrate": "128 kbps",
    "sample_rate": "48 kHz"
  }
}
```

**Use Cases:**
- Instagram Feed (max 60s)
- ShareChat Feed (max 120s)
- Facebook Feed (max 240s)

**Cropping Strategy:**
- Center crop with content-aware scaling
- Preserve main subject in center 80%
- Letterbox if aspect ratio mismatch >20%

### 16:9 (Landscape - Standard Video)

**Resolution Options:**
- HD: 1280x720
- FHD: 1920x1080

**Encoding Settings:**
```json
{
  "codec": "H.264",
  "profile": "High",
  "level": "4.2",
  "bitrate": {
    "hd": "5 Mbps",
    "fhd": "8 Mbps"
  },
  "frame_rate": 30,
  "keyframe_interval": 2,
  "audio": {
    "codec": "AAC",
    "bitrate": "192 kbps",
    "sample_rate": "48 kHz"
  }
}
```

**Use Cases:**
- YouTube (max 600s)
- Facebook Video (max 240s)
- Website embeds

### 4:5 (Portrait - Feed Optimization)

**Resolution:**
- Standard: 1080x1350

**Use Cases:**
- Instagram Feed (optimized for mobile)
- Facebook Feed (portrait)

## Subtitle Specifications

### Format: WebVTT

**Structure:**
```vtt
WEBVTT

00:00:00.000 --> 00:00:03.500
नमस्ते! हमारे नए उत्पाद में आपका स्वागत है

00:00:03.500 --> 00:00:07.000
இது உங்கள் வாழ்க்கையை மாற்றும்
```

### Styling

**Font:**
- Primary: Noto Sans (supports all Indic scripts)
- Fallback: Arial Unicode MS

**Positioning:**
```css
::cue {
  font-family: 'Noto Sans', sans-serif;
  font-size: 5vh; /* 5% of video height */
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
  line-height: 1.4;
  padding: 0.5em;
}

::cue(.position-bottom) {
  bottom: 20%; /* 20% from bottom */
}
```

**Unicode Support:**
- Devanagari: U+0900 to U+097F
- Tamil: U+0B80 to U+0BFF
- Telugu: U+0C00 to U+0C7F
- Bengali: U+0980 to U+09FF
- All other Indic scripts supported

### Timing Rules

- Maximum characters per line: 42
- Maximum lines per subtitle: 2
- Minimum display duration: 1.5 seconds
- Maximum display duration: 7 seconds
- Gap between subtitles: 0.1 seconds

### Generation Process

1. **Audio Extraction:** Extract audio track from video
2. **Transcription:** Use Amazon Transcribe for source language
3. **Translation:** Use Transcreation Agent output
4. **Timing Sync:** Align with original audio timestamps
5. **Validation:** Check Unicode rendering and timing

## MediaConvert Job Configuration

### Job Template

```json
{
  "Settings": {
    "Inputs": [
      {
        "FileInput": "s3://input-bucket/video.mp4",
        "AudioSelectors": {
          "Audio Selector 1": {
            "DefaultSelection": "DEFAULT"
          }
        },
        "VideoSelector": {},
        "TimecodeSource": "ZEROBASED"
      }
    ],
    "OutputGroups": [
      {
        "Name": "Stories_9x16",
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "s3://output-bucket/9x16/"
          }
        },
        "Outputs": [
          {
            "VideoDescription": {
              "Width": 720,
              "Height": 1280,
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "RateControlMode": "CBR",
                  "Bitrate": 2500000,
                  "FramerateControl": "SPECIFIED",
                  "FramerateNumerator": 30,
                  "FramerateDenominator": 1
                }
              }
            },
            "AudioDescriptions": [
              {
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "Bitrate": 128000,
                    "SampleRate": 48000
                  }
                }
              }
            ],
            "CaptionDescriptions": [
              {
                "DestinationSettings": {
                  "DestinationType": "WEBVTT"
                },
                "LanguageCode": "HIN"
              }
            ]
          }
        ]
      }
    ]
  },
  "AccelerationSettings": {
    "Mode": "PREFERRED"
  },
  "Priority": 0,
  "StatusUpdateInterval": "SECONDS_60"
}
```

## Content Analysis (Rekognition)

### Text Detection

**Purpose:** Identify on-screen text for preservation during cropping

**API Call:**
```python
response = rekognition.detect_text(
    Image={'S3Object': {'Bucket': bucket, 'Name': key}}
)

for text in response['TextDetections']:
    if text['Type'] == 'LINE' and text['Confidence'] > 90:
        preserve_region(text['Geometry']['BoundingBox'])
```

### Face Detection

**Purpose:** Keep faces in frame during aspect ratio conversion

**API Call:**
```python
response = rekognition.detect_faces(
    Image={'S3Object': {'Bucket': bucket, 'Name': key}},
    Attributes=['ALL']
)

faces = [f['BoundingBox'] for f in response['FaceDetails']]
crop_center = calculate_center(faces)
```

### Content Moderation

**Purpose:** Flag unsafe content before distribution

**API Call:**
```python
response = rekognition.detect_moderation_labels(
    Image={'S3Object': {'Bucket': bucket, 'Name': key}},
    MinConfidence=75
)

if any(label['Name'] in BLOCKED_LABELS for label in response['ModerationLabels']):
    flag_for_review()
```

## Thumbnail Generation

### Specifications

- Count: 3 thumbnails per video
- Timing: 25%, 50%, 75% of video duration
- Resolution: 1280x720 (16:9), 720x1280 (9:16), 1080x1080 (1:1)
- Format: JPEG, Quality: 85%
- Text Overlay: Title in regional language

### Text Overlay

**Font:** Noto Sans Bold  
**Size:** 48px  
**Color:** White with black stroke (2px)  
**Position:** Bottom third, centered  
**Background:** Gradient overlay (transparent to black)

## Output Schema

```json
{
  "task_id": "uuid",
  "media_outputs": [
    {
      "aspect_ratio": "9:16",
      "resolution": "720x1280",
      "s3_uri": "s3://output/9x16/video.mp4",
      "cloudfront_url": "https://cdn.sanchaar.in/9x16/video.mp4",
      "file_size_mb": 12.5,
      "duration_seconds": 45,
      "bitrate_kbps": 2500,
      "subtitles": [
        {
          "language": "hi",
          "s3_uri": "s3://output/9x16/video_hi.vtt"
        }
      ],
      "thumbnails": [
        {
          "timestamp": "00:00:11",
          "s3_uri": "s3://output/9x16/thumb_1.jpg"
        }
      ]
    }
  ],
  "content_analysis": {
    "faces_detected": 2,
    "text_detected": true,
    "moderation_labels": [],
    "safe_for_distribution": true
  },
  "processing_time_seconds": 87,
  "status": "completed"
}
```

## Security Protocols

### Watermark Embedding

**Position:** Bottom-right corner  
**Opacity:** 30%  
**Size:** 10% of frame width  
**Content:** Brand logo + timestamp

### DRM Support

For premium content:
- AWS Elemental MediaPackage integration
- SPEKE key provider
- Widevine + FairPlay support

### PII Detection

Scan for:
- Phone numbers (regex: `\d{10}`)
- Email addresses
- Aadhaar numbers (regex: `\d{4}\s\d{4}\s\d{4}`)
- Credit card numbers

If detected: Blur region or flag for review

## Performance Targets

- Processing time: <2 minutes per minute of video
- Concurrent jobs: 50 per account
- Subtitle generation: <30 seconds per language
- Thumbnail extraction: <10 seconds

## Error Handling

**MediaConvert Job Failures:**
- Retry with lower quality preset
- If still fails: Use original video, skip processing
- Alert: Notify ops team after 2 failures

**Subtitle Sync Issues:**
- Validate timing gaps <0.5s
- If validation fails: Regenerate with adjusted parameters

## Monitoring

**CloudWatch Metrics:**
- `MediaConvertJobDuration`
- `SubtitleGenerationLatency`
- `ContentModerationFlags`
- `ProcessingCostPerMinute`
