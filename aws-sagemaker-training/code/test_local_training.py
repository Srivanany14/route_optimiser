#!/usr/bin/env python3
"""
Local test script for MTVRP training
This runs on your local machine, not in SageMaker
"""

import os
import sys
import json
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from mtvrp_rl4co_trainer import MTVRPTrainer

def main():
    print("🎯 Local MTVRP Training Test")
    print("=" * 40)
    
    # Create local directories
    os.makedirs('./local_models', exist_ok=True)
    os.makedirs('./local_outputs', exist_ok=True)
    
    # Test configuration (small for quick testing)
    config = {
        'num_locations': 10,
        'batch_size': 16,
        'max_epochs': 2,
        'variant_preset': 'single_feat',
        'use_gpu': False,
        'log_wandb': False,
        'early_stopping_patience': 5,
        'num_training_samples': 100,
        'num_test_samples': 20,
        'experiment_name': 'local_test'
    }
    
    print(f"Configuration: {json.dumps(config, indent=2)}")
    
    # Test trainer initialization
    print("\n🔧 Initializing MTVRP Trainer...")
    trainer = MTVRPTrainer(config)
    trainer.setup_optimizer()
    
    # Test training
    print(f"\n🚀 Starting local training test...")
    start_time = datetime.now()
    
    try:
        training_result = trainer.train(max_epochs=config['max_epochs'])
        
        end_time = datetime.now()
        training_time = (end_time - start_time).total_seconds()
        
        print(f"\n✅ Training completed in {training_time:.2f} seconds")
        
        # Test evaluation
        print(f"\n🔍 Testing evaluation...")
        evaluation_results = trainer.evaluate(num_test_samples=config['num_test_samples'])
        
        # Save model locally
        model_path = './local_models/test_model.pth'
        trainer.save_model(model_path)
        
        print(f"\n📊 Test Results:")
        print(f"   - Mean Cost: {evaluation_results['rl_results']['mean_cost']:.4f}")
        print(f"   - Best Cost: {evaluation_results['rl_results']['min_cost']:.4f}")
        print(f"   - Model saved to: {model_path}")
        
        print(f"\n🎉 Local test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Local test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Ready for SageMaker deployment!")
    else:
        print("\n❌ Fix local issues before deploying to SageMaker")
