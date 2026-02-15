---
inclusion: always
---

# AWS Well-Architected Best Practices for Sanchaar

This steering file ensures all code and infrastructure changes adhere to AWS Well-Architected Framework principles.

## Operational Excellence

### Monitoring & Observability
- All Lambda functions must log to CloudWatch with structured JSON
- Use X-Ray tracing for distributed workflows
- Set up CloudWatch alarms for critical metrics:
  - Lambda error rates >5%
  - Step Functions execution failures
  - DynamoDB throttling events
  - MediaConvert job failures

### Infrastructure as Code
- All resources defined in SAM/CDK templates
- No manual resource creation in AWS Console
- Version control all infrastructure changes
- Use parameter stores for environment-specific values

## Security

### IAM Least Privilege
- Each Lambda function has dedicated execution role
- Bedrock agents use separate service roles
- No wildcard (*) permissions in production
- Enable MFA for all human access

### Data Protection
- All S3 buckets encrypted with KMS
- DynamoDB encryption at rest enabled
- TLS 1.3 for all data in transit
- Secrets stored in AWS Secrets Manager (never in code)

### Network Security
- Use VPC endpoints for AWS service access
- No public S3 bucket access
- CloudFront with HTTPS only
- Security groups with minimal port exposure

## Reliability

### Fault Tolerance
- Multi-AZ deployment for DynamoDB
- S3 versioning enabled for content recovery
- Step Functions automatic retries with exponential backoff
- Circuit breaker pattern for external API calls

### Backup & Recovery
- DynamoDB Point-in-Time Recovery enabled
- S3 Cross-Region Replication for critical content
- Regular backup testing (quarterly)
- RTO: 4 hours, RPO: 1 hour

## Performance Efficiency

### Compute Optimization
- Lambda memory sized based on profiling (1024MB default)
- Use Lambda Provisioned Concurrency for predictable workloads
- MediaConvert job acceleration enabled
- Step Functions Express workflows for high-throughput

### Storage Optimization
- S3 Intelligent-Tiering for cost optimization
- CloudFront caching with regional edge locations
- DynamoDB on-demand billing for variable workloads
- OpenSearch Serverless auto-scaling

## Cost Optimization

### Resource Right-Sizing
- Lambda timeout: 300s (avoid over-provisioning)
- DynamoDB: Pay-per-request (no reserved capacity)
- S3 Lifecycle policies: Glacier after 90 days
- CloudFront: PriceClass_200 (India + Asia)

### Cost Monitoring
- AWS Cost Explorer tags: Project=Sanchaar, Environment=dev/prod
- Budget alerts at 80% and 100% thresholds
- Monthly cost review and optimization
- Target: <$2 per content piece across 10 languages

## Sustainability

### Carbon Footprint Reduction
- Use ap-south-1 (Mumbai) for data residency
- Minimize cross-region data transfer
- S3 Intelligent-Tiering reduces storage footprint
- Serverless architecture eliminates idle resources

## Code Quality Standards

### Python Lambda Functions
```python
# Always include error handling
try:
    result = process_content()
except Exception as e:
    logger.error(f"Error: {str(e)}", exc_info=True)
    # Implement graceful degradation
    return fallback_response()

# Use structured logging
import json
logger.info(json.dumps({
    'event': 'transcreation_complete',
    'content_id': content_id,
    'language': language,
    'duration_ms': duration
}))
```

### SAM/CDK Templates
- Use parameters for environment-specific values
- Add descriptions to all resources
- Tag all resources with Project, Environment, CostCenter
- Export important ARNs for cross-stack references

## Compliance Requirements

### Data Residency
- All content stored in ap-south-1 (Mumbai)
- No data transfer outside India without explicit consent
- Audit logs retained for 7 years

### Privacy
- PII detection in media content
- User consent tracking in DynamoDB
- GDPR-compliant data deletion workflows
- IT Act 2000 compliance for Indian users
