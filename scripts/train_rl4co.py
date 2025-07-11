# scripts/train_rl4co.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.mtvrp_rl4co_trainer import MTVRPTrainer
from configs.rl4co_config import RL4CO_CONFIG

def main():
    print("🎯 MTVRP RL4CO Training Pipeline")
    print("=" * 50)
    
    # Initialize trainer
    trainer = MTVRPTrainer(RL4CO_CONFIG)
    
    # Setup optimizer
    trainer.setup_optimizer()
    
    # Start training
    trainer.train(max_epochs=RL4CO_CONFIG['max_epochs'])
    
    # Evaluate model
    evaluation_results = trainer.evaluate(
        num_test_samples=RL4CO_CONFIG['num_test_samples']
    )
    
    # Visualize results
    trainer.visualize_results(evaluation_results)
    
    # Save model
    if RL4CO_CONFIG['save_model']:
        trainer.save_model()
    
    print("\n✅ Training pipeline completed!")
    print("Next steps:")
    print("1. Check models/ directory for saved models")
    print("2. Review training results")
    print("3. Test inference")
    print("4. Deploy to AWS")

if __name__ == "__main__":
    main()