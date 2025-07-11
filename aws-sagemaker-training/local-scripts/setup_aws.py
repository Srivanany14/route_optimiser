#!/usr/bin/env python3
"""
AWS Setup Helper for MTVRP SageMaker Training
"""

import boto3
import json
from botocore.exceptions import ClientError

def check_aws_credentials():
    """Check if AWS credentials are properly configured"""
    try:
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        print(f"✅ AWS Identity: {identity['Arn']}")
        return True
    except Exception as e:
        print(f"❌ AWS credentials not configured: {e}")
        return False

def check_sagemaker_permissions():
    """Check if user has SageMaker permissions"""
    try:
        sagemaker = boto3.client('sagemaker')
        sagemaker.list_training_jobs(MaxResults=1)
        print("✅ SageMaker permissions: OK")
        return True
    except Exception as e:
        print(f"❌ SageMaker permissions issue: {e}")
        return False

def create_sagemaker_role():
    """Create SageMaker execution role if it doesn't exist"""
    print("🔧 Creating SageMaker execution role...")
    
    # This is a simplified role creation
    # In production, you'd want more specific permissions
    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "sagemaker.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }
    
    try:
        iam = boto3.client('iam')
        
        # Create role
        role_name = 'SageMakerExecutionRole-MTVRP'
        role_response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=json.dumps(trust_policy),
            Description='SageMaker execution role for MTVRP training'
        )
        
        # Attach required policies
        policies = [
            'arn:aws:iam::aws:policy/AmazonSageMakerFullAccess',
            'arn:aws:iam::aws:policy/AmazonS3FullAccess'
        ]
        
        for policy in policies:
            iam.attach_role_policy(
                RoleName=role_name,
                PolicyArn=policy
            )
        
        print(f"✅ Created role: {role_response['Role']['Arn']}")
        return role_response['Role']['Arn']
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'EntityAlreadyExists':
            print(f"✅ Role already exists: {role_name}")
            role = iam.get_role(RoleName=role_name)
            return role['Role']['Arn']
        else:
            print(f"❌ Failed to create role: {e}")
            return None

def main():
    print("🔧 AWS Setup for MTVRP SageMaker Training")
    print("=" * 40)
    
    # Check credentials
    if not check_aws_credentials():
        print("\n💡 Setup AWS credentials:")
        print("   aws configure")
        print("   or set environment variables:")
        print("   export AWS_ACCESS_KEY_ID=your_key")
        print("   export AWS_SECRET_ACCESS_KEY=your_secret")
        return False
    
    # Check SageMaker permissions
    if not check_sagemaker_permissions():
        print("\n💡 You may need SageMaker permissions")
        return False
    
    # Try to create SageMaker role
    role_arn = create_sagemaker_role()
    
    if role_arn:
        print(f"\n✅ AWS setup complete!")
        print(f"🔑 Role ARN: {role_arn}")
        print(f"\n🚀 Ready to deploy MTVRP training!")
        print(f"   Run: python deploy_sagemaker.py")
        return True
    else:
        print(f"\n❌ Setup incomplete")
        return False

if __name__ == "__main__":
    main()
