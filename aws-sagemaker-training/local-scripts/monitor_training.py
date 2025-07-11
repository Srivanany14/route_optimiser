#!/usr/bin/env python3
"""Monitor SageMaker training job"""

import boto3
import time
from datetime import datetime

def monitor_job(job_name):
    sm = boto3.client('sagemaker')
    
    print(f"🔍 Monitoring training job: {job_name}")
    print("=" * 50)
    
    while True:
        try:
            response = sm.describe_training_job(TrainingJobName=job_name)
            status = response['TrainingJobStatus']
            
            if 'TrainingStartTime' in response:
                start_time = response['TrainingStartTime']
                elapsed = datetime.now(start_time.tzinfo) - start_time
                elapsed_str = str(elapsed).split('.')[0]  # Remove microseconds
            else:
                elapsed_str = "Not started"
            
            print(f"⏱️ {datetime.now().strftime('%H:%M:%S')} - Status: {status} - Elapsed: {elapsed_str}")
            
            if status in ['Completed', 'Failed', 'Stopped']:
                print(f"\n🏁 Training {status.lower()}!")
                
                if status == 'Completed':
                    print(f"📦 Model artifacts: {response['ModelArtifacts']['S3ModelArtifacts']}")
                elif status == 'Failed':
                    print(f"❌ Failure reason: {response.get('FailureReason', 'Unknown')}")
                
                break
            
            time.sleep(30)  # Check every 30 seconds
            
        except KeyboardInterrupt:
            print(f"\n⏹️ Monitoring stopped by user")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(30)

if __name__ == "__main__":
    monitor_job('mtvrp-training-2025-07-09-19-44-22')
