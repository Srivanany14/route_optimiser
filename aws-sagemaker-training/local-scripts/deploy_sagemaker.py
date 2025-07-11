#!/usr/bin/env python3
"""
Deploy MTVRP training job to AWS SageMaker
Run this script from your local machine
"""

import boto3
import sagemaker
from sagemaker.pytorch import PyTorch
import os
from datetime import datetime

def get_sagemaker_role():
    """Get or create SageMaker execution role"""
    iam = boto3.client('iam')
    role_name = 'SageMakerExecutionRole-MTVRP'
    
    try:
        # Try to get the existing role
        role = iam.get_role(RoleName=role_name)
        return role['Role']['Arn']
    except iam.exceptions.NoSuchEntityException:
        print(f"❌ Role {role_name} not found!")
        print("💡 Run: python setup_aws.py")
        return None

def deploy_training_job():
    """Deploy MTVRP training job to SageMaker"""
    
    print("🚀 Deploying MTVRP Training to AWS SageMaker")
    print("=" * 50)
    
    # Initialize SageMaker session
    sagemaker_session = sagemaker.Session()
    region = sagemaker_session.boto_region_name
    
    # Get the correct role ARN
    role_arn = get_sagemaker_role()
    if not role_arn:
        return None
    
    print(f"📍 Region: {region}")
    print(f"🔑 Role: {role_arn}")
    print(f"🪣 S3 Bucket: {sagemaker_session.default_bucket()}")
    
    # Training hyperparameters
    hyperparameters = {
        'num-locations': 20,  # Reduced for faster testing
        'batch-size': 32,     # Reduced for faster testing
        'max-epochs': 5,      # Reduced for faster testing
        'variant-preset': 'single_feat',
        'use-gpu': 'true',
        'log-wandb': 'false',
        'num-training-samples': 500,  # Reduced for faster testing
        'num-test-samples': 50        # Reduced for faster testing
    }
    
    print(f"⚙️ Hyperparameters: {hyperparameters}")
    
    # Create PyTorch estimator
    estimator = PyTorch(
        entry_point='train_sagemaker.py',
        source_dir='../code',  # Point to the code directory
        role=role_arn,
        instance_count=1,
        instance_type='ml.g4dn.xlarge',  # GPU instance for training
        framework_version='1.13.1',
        py_version='py39',
        hyperparameters=hyperparameters,
        max_run=3600,  # 1 hour timeout
        base_job_name='mtvrp-training',
        output_path=f's3://{sagemaker_session.default_bucket()}/mtvrp-outputs',
        code_location=f's3://{sagemaker_session.default_bucket()}/mtvrp-code',
        enable_sagemaker_metrics=True,
        metric_definitions=[
            {'Name': 'train:mean_cost', 'Regex': 'Mean cost: ([0-9\\.]+)'},
            {'Name': 'train:best_cost', 'Regex': 'Best cost: ([0-9\\.]+)'}
        ]
    )
    
    # Generate unique job name
    job_name = f"mtvrp-training-{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}"
    
    print(f"\n�� Starting training job: {job_name}")
    print("   This will take several minutes to:")
    print("   1. Upload code to S3")
    print("   2. Launch training instance")
    print("   3. Install dependencies")
    print("   4. Run training")
    
    # Start training job
    try:
        estimator.fit(job_name=job_name, wait=False)
        
        print(f"\n✅ Training job submitted!")
        print(f"📊 Job name: {estimator.latest_training_job.name}")
        print(f"🔗 Monitor at: https://console.aws.amazon.com/sagemaker/home?region={region}#/jobs")
        print(f"📈 Model artifacts will be saved to: {estimator.model_data}")
        
        return estimator
        
    except Exception as e:
        print(f"❌ Training job submission failed: {e}")
        return None

if __name__ == "__main__":
    try:
        estimator = deploy_training_job()
        
        if estimator:
            print(f"\n🎯 Next steps:")
            print(f"1. Monitor training in AWS Console")
            print(f"2. Wait for training to complete (~15-30 minutes)")
            print(f"3. Check model artifacts in S3")
            print(f"4. Deploy inference endpoint if needed")
        else:
            print(f"\n❌ Deployment failed")
        
    except Exception as e:
        print(f"\n❌ Deployment failed: {e}")
        print(f"\nTroubleshooting:")
        print(f"1. Make sure AWS credentials are configured: aws configure")
        print(f"2. Ensure SageMaker execution role exists: python setup_aws.py")
        print(f"3. Check AWS permissions for SageMaker")
