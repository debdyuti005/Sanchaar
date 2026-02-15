# Sanchaar Environment Setup Script
Write-Host "Sanchaar Environment Setup" -ForegroundColor Cyan

# Add Python Scripts to PATH
$pythonScriptsPath = "$env:APPDATA\Python\Python313\Scripts"
if (Test-Path $pythonScriptsPath) {
    $env:PATH = "$pythonScriptsPath;$env:PATH"
    Write-Host "Added Python Scripts to PATH" -ForegroundColor Green
}

# Verify SAM CLI
Write-Host "`nVerifying AWS SAM CLI..."
$samPath = "$pythonScriptsPath\sam.exe"
if (Test-Path $samPath) {
    & $samPath --version
    Write-Host "SAM CLI is ready!" -ForegroundColor Green
} else {
    Write-Host "SAM CLI not found at: $samPath" -ForegroundColor Red
}

# Check AWS CLI
Write-Host "`nChecking AWS CLI..."
$awsInstalled = Get-Command aws -ErrorAction SilentlyContinue
if ($awsInstalled) {
    aws --version
} else {
    Write-Host "AWS CLI not installed. Download from: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Configure AWS: aws configure"
Write-Host "2. Navigate to SAM: cd infrastructure\sam"
Write-Host "3. Build: sam build"
Write-Host "4. Deploy: sam deploy --guided"
