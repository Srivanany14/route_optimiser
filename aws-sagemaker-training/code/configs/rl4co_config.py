# configs/rl4co_config.py
RL4CO_CONFIG = {
    'num_locations': 50,
    'batch_size': 64,
    'variant_preset': 'single_feat',
    'max_epochs': 50,
    'early_stopping_patience': 10,
    'log_wandb': False,
    'num_training_samples': 1000,
    'num_test_samples': 100,
    'use_gpu': True,
    'experiment_name': 'mtvrp_rl4co_v1',
    'save_model': True
}