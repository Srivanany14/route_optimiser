#!/usr/bin/env python3
"""Test AWS setup for MTVRP training"""

import boto3
from botocore.exceptions import NoCredentialsError, ClientError

def test_aws_credentials():
    """Test if AWS credentials are working"""
    try:
        # Test credentials
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        
        print("✅ AWS Credentials Working!")
        print(f"   Account ID: {identity['Account']}")
        print(f"   User ARN: {identity['Arn']}")
        
        return True
        
    except NoCredentialsError:
        print("❌ No AWS credentials found!")
        print("   Run: aws configure")
        print("   Or set environment variables:")
        print("   export AWS_ACCESS_KEY_ID=your_key")
        print("   export AWS_SECRET_ACCESS_KEY=your_secret")
        return False
        
    except ClientError as e:
        print(f"❌ AWS credentials error: {e}")
        return False

def test_sagemaker_access():
    """Test SageMaker access"""
    try:
        sagemaker = boto3.client('sagemaker')
        
        # Try to list training jobs (this tests permissions)
        response = sagemaker.list_training_jobs(MaxResults=1)
        
        print("✅ SageMaker Access Working!")
        return True
        
    except ClientError as e:
        print(f"❌ SageMaker access error: {e}")
        print("   You may need SageMaker permissions")
        return False

def main():
    print("🔧 Testing AWS Setup for MTVRP")
    print("=" * 40)
    
    # Test credentials
    creds_ok = test_aws_credentials()
    
    if creds_ok:
        # Test SageMaker
        sagemaker_ok = test_sagemaker_access()
        
        if sagemaker_ok:
            print("\n�� AWS setup is complete!")
            print("   Ready to deploy MTVRP training to SageMaker")
        else:
            print("\n⚠️ AWS credentials work, but SageMaker permissions needed")
    else:
        print("\n💡 Next steps:")
        print("1. Get your AWS access keys from AWS Console")
        print("2. Run: aws configure")
        print("3. Test again with: python test_aws_setup.py")

if __name__ == "__main__":
    main()
