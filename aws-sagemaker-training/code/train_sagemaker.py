#!/usr/bin/env python3
"""
AWS SageMaker Training Script for MTVRP
This script will run on SageMaker training instances
"""

import os
import sys
import json
import torch
import argparse
from datetime import datetime

# Add code directory to path
sys.path.append('/opt/ml/code')

from mtvrp_rl4co_trainer import MTVRPTrainer

def parse_args():
    """Parse SageMaker and custom arguments"""
    parser = argparse.ArgumentParser()
    
    # SageMaker specific paths
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR', '/opt/ml/model'))
    parser.add_argument('--output-data-dir', type=str, default=os.environ.get('SM_OUTPUT_DATA_DIR', '/opt/ml/output/data'))
    parser.add_argument('--data-dir', type=str, default=os.environ.get('SM_CHANNEL_TRAINING', '/opt/ml/input/data/training'))
    
    # MTVRP Training hyperparameters
    parser.add_argument('--num-locations', type=int, default=50)
    parser.add_argument('--batch-size', type=int, default=64)
    parser.add_argument('--max-epochs', type=int, default=50)
    parser.add_argument('--variant-preset', type=str, default='single_feat')
    parser.add_argument('--use-gpu', type=str, default='true')
    parser.add_argument('--log-wandb', type=str, default='false')
    parser.add_argument('--num-training-samples', type=int, default=1000)
    parser.add_argument('--num-test-samples', type=int, default=100)
    
    return parser.parse_args()

def str_to_bool(v):
    """Convert string to boolean"""
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        return bool(v)

def main():
    """Main training function"""
    args = parse_args()
    
    print("🎯 Starting AWS SageMaker MTVRP Training")
    print("=" * 50)
    print(f"Model directory: {args.model_dir}")
    print(f"Output directory: {args.output_data_dir}")
    print(f"Data directory: {args.data_dir}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    
    # Create output directories
    os.makedirs(args.model_dir, exist_ok=True)
    os.makedirs(args.output_data_dir, exist_ok=True)
    
    # Create training configuration
    config = {
        'num_locations': args.num_locations,
        'batch_size': args.batch_size,
        'max_epochs': args.max_epochs,
        'variant_preset': args.variant_preset,
        'use_gpu': str_to_bool(args.use_gpu) and torch.cuda.is_available(),
        'log_wandb': str_to_bool(args.log_wandb),
        'early_stopping_patience': 10,
        'num_training_samples': args.num_training_samples,
        'num_test_samples': args.num_test_samples,
        'experiment_name': 'sagemaker_mtvrp_training'
    }
    
    print(f"Training configuration: {json.dumps(config, indent=2)}")
    
    # Initialize trainer
    print("\n🔧 Initializing MTVRP Trainer...")
    trainer = MTVRPTrainer(config)
    trainer.setup_optimizer()
    
    # Start training
    print(f"\n�� Starting training for {config['max_epochs']} epochs...")
    start_time = datetime.now()
    
    training_result = trainer.train(max_epochs=config['max_epochs'])
    
    end_time = datetime.now()
    training_time = (end_time - start_time).total_seconds()
    
    print(f"\n✅ Training completed in {training_time:.2f} seconds")
    
    # Evaluate model
    print(f"\n🔍 Evaluating model...")
    evaluation_results = trainer.evaluate(num_test_samples=config['num_test_samples'])
    
    # Save model to SageMaker model directory
    model_path = os.path.join(args.model_dir, 'mtvrp_model.pth')
    trainer.save_model(model_path)
    
    # Save evaluation results and training info
    results_data = {
        'training_config': config,
        'training_time_seconds': training_time,
        'start_time': start_time.isoformat(),
        'end_time': end_time.isoformat(),
        'evaluation_results': {
            'mean_cost': evaluation_results['rl_results']['mean_cost'],
            'std_cost': evaluation_results['rl_results']['std_cost'],
            'min_cost': evaluation_results['rl_results']['min_cost'],
            'max_cost': evaluation_results['rl_results']['max_cost']
        }
    }
    
    # Add classical solver comparison if available
    if evaluation_results['classical_results'] is not None:
        results_data['classical_comparison'] = {
            'classical_mean_cost': evaluation_results['classical_results']['mean_cost'],
            'rl_vs_classical_gap': ((evaluation_results['rl_results']['mean_cost'] - 
                                   evaluation_results['classical_results']['mean_cost']) / 
                                  evaluation_results['classical_results']['mean_cost']) * 100
        }
    
    # Save results
    results_path = os.path.join(args.output_data_dir, 'training_results.json')
    with open(results_path, 'w') as f:
        json.dump(results_data, f, indent=2)
    
    print(f"\n💾 Results saved to: {results_path}")
    print(f"📊 Model saved to: {model_path}")
    
    # Print final results
    print("\n📈 Final Training Results:")
    print(f"   - Mean Cost: {evaluation_results['rl_results']['mean_cost']:.4f}")
    print(f"   - Best Cost: {evaluation_results['rl_results']['min_cost']:.4f}")
    print(f"   - Training Time: {training_time:.2f} seconds")
    
    if evaluation_results['classical_results'] is not None:
        gap = results_data['classical_comparison']['rl_vs_classical_gap']
        print(f"   - RL vs Classical Gap: {gap:.2f}%")
    
    print("\n🎉 SageMaker training completed successfully!")

if __name__ == "__main__":
    main()
