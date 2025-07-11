# src/mtvrp_rl4co_trainer.py
import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Optional, Tuple, Union
import warnings
import json
import os
from datetime import datetime
warnings.filterwarnings('ignore')

# RL4CO specific imports
from rl4co.envs.routing.mtvrp.env import MTVRPEnv, MTVRPGenerator
from rl4co.models import AttentionModelPolicy, POMO, AttentionModel
from rl4co.utils import RL4COTrainer
from rl4co.utils.ops import get_tour_length
from tensordict import TensorDict

class MTVRPTrainer:
    """
    Wrapper around your existing MTVRPDeliveryOptimizer for structured training
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.device = torch.device("cuda" if torch.cuda.is_available() and config.get('use_gpu', True) else "cpu")
        self.training_history = []
        self.optimizer = None
        
        print(f"🎯 Initializing MTVRP RL4CO Trainer")
        print(f"   Device: {self.device}")
        print(f"   Config: {config}")
        
    def setup_optimizer(self):
        """Initialize your MTVRPDeliveryOptimizer"""
        self.optimizer = MTVRPDeliveryOptimizer(
            num_locations=self.config.get('num_locations', 50),
            batch_size=self.config.get('batch_size', 64),
            variant_preset=self.config.get('variant_preset', 'single_feat'),
            device=str(self.device)
        )
        
        print(f"✅ MTVRP Optimizer setup complete")
        
    def generate_training_data(self, num_samples: int = 1000):
        """Generate training data using your existing function"""
        print(f"📊 Generating {num_samples} training samples...")
        
        # Use your existing function
        train_data = generate_sample_data(self.optimizer.env, num_samples=num_samples)
        
        return train_data
        
    def train(self, max_epochs: int = 50):
        """Train using your existing training function"""
        print(f"🚀 Starting RL4CO training for {max_epochs} epochs...")
        
        start_time = datetime.now()
        
        # Use your existing training function
        trainer = train_model(
            self.optimizer,
            max_epochs=max_epochs,
            early_stopping_patience=self.config.get('early_stopping_patience', 10),
            log_wandb=self.config.get('log_wandb', False)
        )
        
        end_time = datetime.now()
        training_time = (end_time - start_time).total_seconds()
        
        # Log training info
        training_info = {
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'training_time_seconds': training_time,
            'max_epochs': max_epochs,
            'config': self.config
        }
        
        self.training_history.append(training_info)
        
        print(f"✅ Training completed in {training_time:.2f} seconds")
        
        return trainer
        
    def evaluate(self, test_data: TensorDict = None, num_test_samples: int = 100):
        """Evaluate model using your existing functions"""
        print(f"🔍 Evaluating model...")
        
        if test_data is None:
            test_data = self.generate_training_data(num_test_samples)
            
        # Use your existing evaluation functions
        rl_results = solve_instances(self.optimizer, test_data, method="greedy")
        
        # Try classical solver comparison
        classical_results = solve_with_classical_solver(
            self.optimizer.env, 
            test_data, 
            solver="pyvrp"
        )
        
        # Compare methods
        compare_methods(rl_results, classical_results)
        
        return {
            'rl_results': rl_results,
            'classical_results': classical_results,
            'test_data': test_data
        }
        
    def visualize_results(self, evaluation_results: Dict):
        """Visualize results using your existing functions"""
        print(f"📈 Visualizing results...")
        
        rl_results = evaluation_results['rl_results']
        classical_results = evaluation_results['classical_results']
        test_data = evaluation_results['test_data']
        
        # Plot cost comparison
        plot_cost_comparison(rl_results, classical_results)
        
        # Visualize best solution
        best_idx = rl_results['costs'].argmin()
        print(f"🎯 Best solution visualization (instance {best_idx}):")
        visualize_solution(test_data, rl_results['actions'], instance_idx=best_idx, 
                          title="Best RL Solution")
        
    def save_model(self, save_path: str = "models/mtvrp_rl4co_model.pth"):
        """Save trained model"""
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        save_dict = {
            'model_state_dict': self.optimizer.model.state_dict(),
            'policy_state_dict': self.optimizer.policy.state_dict(),
            'config': self.config,
            'training_history': self.training_history,
            'environment_config': {
                'num_locations': self.optimizer.num_locations,
                'batch_size': self.optimizer.batch_size,
                'variant_preset': self.optimizer.variant_preset
            }
        }
        
        torch.save(save_dict, save_path)
        
        # Save training history as JSON
        history_path = save_path.replace('.pth', '_history.json')
        with open(history_path, 'w') as f:
            json.dump(self.training_history, f, indent=2)
            
        print(f"💾 Model saved: {save_path}")
        print(f"📊 Training history saved: {history_path}")
        
    def load_model(self, load_path: str):
        """Load trained model"""
        checkpoint = torch.load(load_path, map_location=self.device)
        
        # Setup optimizer first
        self.setup_optimizer()
        
        # Load model states
        self.optimizer.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.policy.load_state_dict(checkpoint['policy_state_dict'])
        
        # Load training history
        self.training_history = checkpoint.get('training_history', [])
        
        print(f"✅ Model loaded from: {load_path}")
        
    def solve_custom_problem(self, locations: List[Dict], vehicles: List[Dict]) -> Dict:
        """Solve custom problem from web interface"""
        print(f"🔍 Solving custom problem with {len(locations)} locations and {len(vehicles)} vehicles...")
        
        # Convert frontend format to RL4CO format
        # This is where we'll need to adapt your data format
        
        # For now, use the existing solve_instances function
        # You'll need to convert the frontend data to TensorDict format
        
        # Placeholder - implement conversion logic
        tensor_data = self.convert_frontend_to_tensordict(locations, vehicles)
        
        # Solve using existing function
        results = solve_instances(self.optimizer, tensor_data, method="greedy")
        
        return results
        
    def convert_frontend_to_tensordict(self, locations: List[Dict], vehicles: List[Dict]) -> TensorDict:
        """Convert frontend format to RL4CO TensorDict format"""
        # This is a placeholder - you'll need to implement the conversion
        # based on how your frontend data differs from RL4CO format
        
        # For now, generate sample data
        return generate_sample_data(self.optimizer.env, num_samples=1)

# Your existing MTVRPDeliveryOptimizer class (unchanged)
class MTVRPDeliveryOptimizer:
    """
    Complete MTVRP delivery optimizer for real-world applications
    """
    
    def __init__(
        self,
        num_locations: int = 50,
        batch_size: int = 64,
        variant_preset: str = "all",
        device: str = "auto"
    ):
        self.num_locations = num_locations
        self.batch_size = batch_size
        self.variant_preset = variant_preset
        
        if device == "auto":
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        self._setup_environment()
        self._setup_model()
        
    def _setup_environment(self):
        """Initialize MTVRP environment with generator"""
        self.generator = MTVRPGenerator(
            num_loc=self.num_locations,
            variant_preset=self.variant_preset,
            use_combinations=True,
            subsample=True,
            prob_time_window=0.6,
            prob_open=0.3,
            prob_backhaul=0.4,
            prob_limit=0.5,
        )
        
        self.env = MTVRPEnv(
            generator=self.generator,
            check_solution=True
        )
        
        print(f"✅ MTVRP Environment created")
        print(f"   - Problem size: {self.num_locations} locations")
        print(f"   - Variant preset: {self.variant_preset}")
        print(f"   - Device: {self.device}")
        
    def _setup_model(self):
        """Initialize attention model and training components"""
        self.policy = AttentionModelPolicy(
            env_name=self.env.name,
            num_encoder_layers=6,
            num_heads=8,
            hidden_dim=512,
            normalization="batch"
        )
        
        self.model = POMO(
            env=self.env,
            policy=self.policy,
            batch_size=self.batch_size,
            optimizer_kwargs={"lr": 1e-4, "weight_decay": 1e-6},
            val_batch_size=self.batch_size * 2,
            test_batch_size=self.batch_size * 2
        )
        
        self.model = self.model.to(self.device)
        
        print(f"✅ Model initialized")
        print(f"   - Policy: Attention Model with {6} encoder layers")
        print(f"   - Algorithm: POMO")
        print(f"   - Batch size: {self.batch_size}")
        print(f"   - Device: {self.device}")

# Keep all your existing functions unchanged
def generate_sample_data(env: MTVRPEnv, num_samples: int = 100) -> TensorDict:
    """Generate sample MTVRP instances"""
    print(f"🔄 Generating {num_samples} sample instances...")
    
    data = env.generator(batch_size=[num_samples])
    variants = env.check_variants(data)
    
    print(f"✅ Generated {num_samples} instances with variants:")
    
    if isinstance(variants, tuple):
        variant_names = ['has_capacity', 'has_open', 'has_backhaul', 'has_limit', 'has_time_windows']
        for i, (name, has_variant) in enumerate(zip(variant_names, variants)):
            if i < len(variants):
                count = has_variant.sum().item() if hasattr(has_variant, 'sum') else sum(has_variant)
                percentage = (count / num_samples) * 100
                print(f"   - {name}: {count}/{num_samples} ({percentage:.1f}%)")
    else:
        for variant, has_variant in variants.items():
            count = has_variant.sum().item()
            percentage = (count / num_samples) * 100
            print(f"   - {variant}: {count}/{num_samples} ({percentage:.1f}%)")
    
    return data
def visualize_instance(data: TensorDict, env: MTVRPEnv, instance_idx: int = 0):
    """Visualize a single MTVRP instance"""
    
    # Extract data for visualization
    locs = data['locs'][instance_idx].cpu().numpy()
    depot = locs[0]
    customer_locs = locs[1:]
    
    # Create figure
    plt.figure(figsize=(12, 8))
    
    # Plot depot
    plt.scatter(depot[0], depot[1], c='red', s=200, marker='s', 
                label='Depot', zorder=5, edgecolors='black', linewidth=2)
    
    # Plot customers
    plt.scatter(customer_locs[:, 0], customer_locs[:, 1], c='blue', s=100, 
                alpha=0.7, label='Customers', zorder=3)
    
    # Add customer numbers
    for i, (x, y) in enumerate(customer_locs):
        plt.annotate(f'{i+1}', (x, y), xytext=(5, 5), textcoords='offset points',
                    fontsize=8, ha='left')
    
    # Check and display constraints
    variants = env.check_variants(data[instance_idx:instance_idx+1])
    
    constraint_text = []
    
    # Handle variants output format
    if isinstance(variants, tuple):
        variant_names = ['Capacity', 'Open Routes', 'Backhauls', 'Duration Limit', 'Time Windows']
        for i, (name, has_variant) in enumerate(zip(variant_names, variants)):
            if i < len(variants) and (hasattr(has_variant, '__getitem__') and has_variant[0] if len(has_variant) > 0 else False):
                constraint_text.append(f"{name}: Yes")
    else:
        # If it's a dictionary
        if variants.get('has_capacity', [False])[0]:
            constraint_text.append("Capacity: Yes")
        if variants.get('has_time_windows', [False])[0]:
            constraint_text.append("Time Windows: Yes")
        if variants.get('has_open', [False])[0]:
            constraint_text.append("Open Routes: Yes")
        if variants.get('has_backhaul', [False])[0]:
            constraint_text.append("Backhauls: Yes")
        if variants.get('has_limit', [False])[0]:
            constraint_text.append("Duration Limit: Yes")
    
    # Add constraint information to plot
    constraint_str = "\\n".join(constraint_text) if constraint_text else "Basic VRP"
    plt.text(0.02, 0.98, f"Constraints:\\n{constraint_str}", 
             transform=plt.gca().transAxes, fontsize=10,
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.title(f'MTVRP Instance {instance_idx} ({len(customer_locs)} customers)')
    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    plt.tight_layout()
    plt.show()

# =============================================================================
# TRAINING FUNCTIONS
# =============================================================================

def train_model(
    optimizer: MTVRPDeliveryOptimizer,
    max_epochs: int = 50,
    early_stopping_patience: int = 10,
    log_wandb: bool = False
):
    """Train the MTVRP model"""
    
    print(f"🚀 Starting training for {max_epochs} epochs...")
    
    # Setup trainer without problematic loggers
    trainer_kwargs = {
        "max_epochs": max_epochs,
        "accelerator": "gpu" if torch.cuda.is_available() else "cpu",
        "precision": "16-mixed" if torch.cuda.is_available() else "32",
        "gradient_clip_val": 1.0,
        "enable_checkpointing": False,  # Disable for demo
        "logger": False,  # Disable logging to avoid TensorBoard issues
        "enable_progress_bar": True,  # Keep progress bar
        "num_sanity_val_steps": 0  # Skip validation sanity checks
    }
    
    # Add wandb logging only if explicitly requested and available
    if log_wandb:
        try:
            import wandb
            from lightning.pytorch.loggers import WandbLogger
            logger = WandbLogger(project="mtvrp-optimization", name="mtvrp-training")
            trainer_kwargs["logger"] = logger
            print("✅ Using Wandb logging")
        except ImportError:
            print("⚠️ Wandb not available, training without logging")
    
    try:
        # Create trainer
        trainer = RL4COTrainer(**trainer_kwargs)
        
        # Train model
        print("🔄 Starting training loop...")
        trainer.fit(optimizer.model)
        
        print("✅ Training completed successfully!")
        return trainer
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        
        if "tensorboard" in str(e).lower() or "protobuf" in str(e).lower():
            print("🔧 TensorBoard/Protobuf issue detected, trying minimal trainer...")
            
            # Fallback: Minimal trainer configuration
            minimal_trainer_kwargs = {
                "max_epochs": min(max_epochs, 5),  # Reduce epochs for safety
                "accelerator": "cpu",  # Force CPU to avoid GPU logging issues
                "logger": False,
                "enable_checkpointing": False,
                "enable_progress_bar": False,  # Disable progress bar too
                "num_sanity_val_steps": 0
            }
            
            try:
                # Move model to CPU for minimal training
                optimizer.model = optimizer.model.cpu()
                optimizer.device = torch.device("cpu")
                
                trainer = RL4COTrainer(**minimal_trainer_kwargs)
                trainer.fit(optimizer.model)
                
                print("✅ Minimal training completed!")
                return trainer
                
            except Exception as e2:
                print(f"❌ Minimal training also failed: {e2}")
                print("💡 You can skip training and use the pre-initialized model")
                return None
        else:
            raise e

# =============================================================================
# EVALUATION AND SOLVING
# =============================================================================

def solve_instances(
    optimizer: MTVRPDeliveryOptimizer,
    test_data: TensorDict,
    method: str = "greedy"  # Options: "greedy", "sampling"
) -> Dict:
    """Solve MTVRP instances and return results"""
    
    print(f"🔍 Solving {len(test_data['locs'])} instances using {method} method...")
    
    # Set model to evaluation mode
    optimizer.model.eval()
    
    # Ensure model and data are on the same device
    optimizer.model = optimizer.model.to(optimizer.device)
    test_data_device = test_data.to(optimizer.device)
    
    # Debug device info
    print(f"   - Model device: {next(optimizer.model.parameters()).device}")
    print(f"   - Data device: {test_data_device['locs'].device}")
    
    with torch.no_grad():
        try:
            # IMPORTANT: Reset environment to initialize state properly
            env_state = optimizer.env.reset(test_data_device)
            
            if method == "greedy":
                # Greedy decoding
                out = optimizer.model(env_state, phase="test", decode_type="greedy")
            else:
                # Sampling
                out = optimizer.model(env_state, phase="test", decode_type="sampling")
                
        except RuntimeError as e:
            print(f"❌ Error during solving: {e}")
            print("🔧 Trying to fix device mismatch...")
            
            # Force everything to CPU as fallback
            optimizer.model = optimizer.model.cpu()
            test_data_cpu = test_data.cpu()
            env_state_cpu = optimizer.env.reset(test_data_cpu)
            
            if method == "greedy":
                out = optimizer.model(env_state_cpu, phase="test", decode_type="greedy")
            else:
                out = optimizer.model(env_state_cpu, phase="test", decode_type="sampling")
                
        except KeyError as e:
            print(f"❌ KeyError during solving: {e}")
            print("🔧 Initializing environment state...")
            
            # Reset environment to get proper state
            env_state = optimizer.env.reset(test_data_device)
            print(f"   - Environment state keys: {list(env_state.keys())}")
            
            if method == "greedy":
                out = optimizer.model(env_state, phase="test", decode_type="greedy")
            else:
                out = optimizer.model(env_state, phase="test", decode_type="sampling")
    
    # Extract results
    actions = out['actions'].cpu()
    costs = out['reward'].cpu().neg()  # Reward is negative cost
    
    # Calculate statistics
    results = {
        'actions': actions,
        'costs': costs,
        'mean_cost': costs.mean().item(),
        'std_cost': costs.std().item(),
        'min_cost': costs.min().item(),
        'max_cost': costs.max().item()
    }
    
    print(f"✅ Solved instances:")
    print(f"   - Mean cost: {results['mean_cost']:.4f}")
    print(f"   - Std cost: {results['std_cost']:.4f}")
    print(f"   - Best cost: {results['min_cost']:.4f}")
    print(f"   - Worst cost: {results['max_cost']:.4f}")
    
    return results

def solve_with_classical_solver(
    env: MTVRPEnv,
    data: TensorDict,
    solver: str = "pyvrp",
    max_runtime: float = 60.0
) -> Dict:
    """Solve using classical optimization methods"""
    
    print(f"🔧 Solving with classical solver: {solver}")
    print(f"   - Max runtime: {max_runtime}s per instance")
    
    try:
        # Make sure data is on CPU for classical solver
        data_cpu = data.cpu()
        
        # Solve using classical method
        classical_actions, classical_costs = env.solve(
            data_cpu,
            max_runtime=max_runtime,
            solver=solver,
            num_procs=1
        )
        
        results = {
            'actions': classical_actions,
            'costs': classical_costs,
            'mean_cost': classical_costs.mean().item(),
            'std_cost': classical_costs.std().item(),
            'min_cost': classical_costs.min().item(),
            'max_cost': classical_costs.max().item()
        }
        
        print(f"✅ Classical solver results:")
        print(f"   - Mean cost: {results['mean_cost']:.4f}")
        print(f"   - Std cost: {results['std_cost']:.4f}")
        print(f"   - Best cost: {results['min_cost']:.4f}")
        print(f"   - Worst cost: {results['max_cost']:.4f}")
        
        return results
        
    except Exception as e:
        error_msg = str(e).lower()
        print(f"❌ Classical solver ({solver}) failed: {e}")
        
        # Try alternative solver
        if solver == "pyvrp" and "incompatible constructor" in error_msg:
            print("🔧 PyVRP version incompatibility detected, trying OR-Tools...")
            try:
                classical_actions, classical_costs = env.solve(
                    data_cpu,
                    max_runtime=max_runtime,
                    solver="ortools",
                    num_procs=1
                )
                
                results = {
                    'actions': classical_actions,
                    'costs': classical_costs,
                    'mean_cost': classical_costs.mean().item(),
                    'std_cost': classical_costs.std().item(),
                    'min_cost': classical_costs.min().item(),
                    'max_cost': classical_costs.max().item()
                }
                
                print(f"✅ OR-Tools solver results:")
                print(f"   - Mean cost: {results['mean_cost']:.4f}")
                print(f"   - Best cost: {results['min_cost']:.4f}")
                
                return results
                
            except Exception as e2:
                print(f"❌ OR-Tools also failed: {e2}")
        
        print("💡 Classical solver troubleshooting:")
        print("   - For PyVRP: pip install --upgrade pyvrp")
        print("   - For OR-Tools: pip install ortools")
        print("   - Alternative: Skip classical comparison for now")
        return None

def compare_methods(rl_results: Dict, classical_results: Dict):
    """Compare RL and classical solver results"""
    
    if classical_results is None:
        print("⚠️ Cannot compare - classical solver failed")
        return
    
    rl_cost = rl_results['mean_cost']
    classical_cost = classical_results['mean_cost']
    
    gap = ((rl_cost - classical_cost) / classical_cost) * 100
    
    print(f"\\n📊 Performance Comparison:")
    print(f"   - RL Method Cost: {rl_cost:.4f}")
    print(f"   - Classical Cost: {classical_cost:.4f}")
    print(f"   - Gap: {gap:.2f}%")
    
    if gap < 5:
        print(f"   - ✅ Excellent! RL is within 5% of optimal")
    elif gap < 10:
        print(f"   - 👍 Good! RL is within 10% of optimal")
    else:
        print(f"   - 📈 Room for improvement")

# =============================================================================
# VISUALIZATION FUNCTIONS
# =============================================================================

def visualize_solution(
    data: TensorDict,
    actions: torch.Tensor,
    instance_idx: int = 0,
    title: str = "MTVRP Solution"
):
    """Visualize the solution route for a specific instance"""
    
    # Extract data
    locs = data['locs'][instance_idx].cpu().numpy()
    action_seq = actions[instance_idx].cpu().numpy()
    
    depot = locs[0]
    customer_locs = locs[1:]
    
    plt.figure(figsize=(12, 8))
    
    # Plot depot
    plt.scatter(depot[0], depot[1], c='red', s=200, marker='s', 
                label='Depot', zorder=5, edgecolors='black', linewidth=2)
    
    # Plot customers
    plt.scatter(customer_locs[:, 0], customer_locs[:, 1], c='blue', s=100, 
                alpha=0.7, label='Customers', zorder=3)
    
    # Draw route
    route_locs = locs[action_seq]
    plt.plot(route_locs[:, 0], route_locs[:, 1], 'g-', linewidth=2, alpha=0.7, label='Route')
    
    # Add arrows to show direction
    for i in range(len(route_locs) - 1):
        dx = route_locs[i+1, 0] - route_locs[i, 0]
        dy = route_locs[i+1, 1] - route_locs[i, 1]
        plt.arrow(route_locs[i, 0], route_locs[i, 1], dx*0.8, dy*0.8,
                 head_width=0.02, head_length=0.02, fc='green', ec='green', alpha=0.6)
    
    # Add customer numbers
    for i, (x, y) in enumerate(customer_locs):
        plt.annotate(f'{i+1}', (x, y), xytext=(5, 5), textcoords='offset points',
                    fontsize=8, ha='left')
    
    # Calculate tour length manually (fixed version)
    try:
        # Method 1: Try with TensorDict format
        td_single = TensorDict({
            'locs': torch.tensor(locs).unsqueeze(0),
            'actions': torch.tensor(action_seq).unsqueeze(0)
        }, batch_size=[1])
        tour_length = get_tour_length(td_single).item()
    except:
        try:
            # Method 2: Manual calculation
            route_tensor = torch.tensor(route_locs, dtype=torch.float32)
            distances = torch.norm(route_tensor[1:] - route_tensor[:-1], dim=1)
            tour_length = distances.sum().item()
        except:
            # Method 3: Simple fallback
            tour_length = 0.0
            for i in range(len(route_locs) - 1):
                dist = np.sqrt((route_locs[i+1, 0] - route_locs[i, 0])**2 + 
                              (route_locs[i+1, 1] - route_locs[i, 1])**2)
                tour_length += dist
    
    plt.title(f'{title} - Instance {instance_idx}\\nTour Length: {tour_length:.4f}')
    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    plt.tight_layout()
    plt.show()

def plot_cost_comparison(rl_results: Dict, classical_results: Dict = None):
    """Plot cost comparison between methods"""
    
    plt.figure(figsize=(12, 6))
    
    # Plot RL results
    plt.subplot(1, 2, 1)
    plt.hist(rl_results['costs'], bins=20, alpha=0.7, color='blue', label='RL Method')
    plt.axvline(rl_results['mean_cost'], color='blue', linestyle='--', 
                label=f'Mean: {rl_results["mean_cost"]:.4f}')
    plt.xlabel('Cost')
    plt.ylabel('Frequency')
    plt.title('RL Method Cost Distribution')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Comparison if classical results available
    if classical_results is not None:
        plt.subplot(1, 2, 2)
        plt.hist(rl_results['costs'], bins=20, alpha=0.7, color='blue', label='RL Method')
        plt.hist(classical_results['costs'], bins=20, alpha=0.7, color='red', label='Classical')
        plt.axvline(rl_results['mean_cost'], color='blue', linestyle='--')
        plt.axvline(classical_results['mean_cost'], color='red', linestyle='--')
        plt.xlabel('Cost')
        plt.ylabel('Frequency')
        plt.title('Method Comparison')
        plt.legend()
        plt.grid(True, alpha=0.3)
    else:
        plt.subplot(1, 2, 2)
        costs = rl_results['costs'].numpy()
        indices = np.arange(len(costs))
        plt.scatter(indices, costs, alpha=0.6, color='blue')
        plt.axhline(rl_results['mean_cost'], color='red', linestyle='--', 
                   label=f'Mean: {rl_results["mean_cost"]:.4f}')
        plt.xlabel('Instance')
        plt.ylabel('Cost')
        plt.title('Cost per Instance')
        plt.legend()
        plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
# Add these functions to the end of your src/mtvrp_rl4co_trainer.py file

def train_model(
    optimizer: MTVRPDeliveryOptimizer,
    max_epochs: int = 50,
    early_stopping_patience: int = 10,
    log_wandb: bool = False
):
    """Train the MTVRP model"""
    
    print(f"🚀 Starting training for {max_epochs} epochs...")
    
    # Setup trainer without problematic loggers
    trainer_kwargs = {
        "max_epochs": max_epochs,
        "accelerator": "gpu" if torch.cuda.is_available() else "cpu",
        "precision": "16-mixed" if torch.cuda.is_available() else "32",
        "gradient_clip_val": 1.0,
        "enable_checkpointing": False,
        "logger": False,
        "enable_progress_bar": True,
        "num_sanity_val_steps": 0
    }
    
    if log_wandb:
        try:
            import wandb
            from lightning.pytorch.loggers import WandbLogger
            logger = WandbLogger(project="mtvrp-optimization", name="mtvrp-training")
            trainer_kwargs["logger"] = logger
            print("✅ Using Wandb logging")
        except ImportError:
            print("⚠️ Wandb not available, training without logging")
    
    try:
        trainer = RL4COTrainer(**trainer_kwargs)
        print("🔄 Starting training loop...")
        trainer.fit(optimizer.model)
        print("✅ Training completed successfully!")
        return trainer
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        return None

def solve_instances(
    optimizer: MTVRPDeliveryOptimizer,
    test_data: TensorDict,
    method: str = "greedy"
) -> Dict:
    """Solve MTVRP instances and return results"""
    
    print(f"🔍 Solving {len(test_data['locs'])} instances using {method} method...")
    
    optimizer.model.eval()
    optimizer.model = optimizer.model.to(optimizer.device)
    test_data_device = test_data.to(optimizer.device)
    
    with torch.no_grad():
        try:
            env_state = optimizer.env.reset(test_data_device)
            
            if method == "greedy":
                out = optimizer.model(env_state, phase="test", decode_type="greedy")
            else:
                out = optimizer.model(env_state, phase="test", decode_type="sampling")
                
        except Exception as e:
            print(f"❌ Error during solving: {e}")
            print("🔧 Trying CPU fallback...")
            
            optimizer.model = optimizer.model.cpu()
            test_data_cpu = test_data.cpu()
            env_state_cpu = optimizer.env.reset(test_data_cpu)
            
            if method == "greedy":
                out = optimizer.model(env_state_cpu, phase="test", decode_type="greedy")
            else:
                out = optimizer.model(env_state_cpu, phase="test", decode_type="sampling")
    
    actions = out['actions'].cpu()
    costs = out['reward'].cpu().neg()
    
    results = {
        'actions': actions,
        'costs': costs,
        'mean_cost': costs.mean().item(),
        'std_cost': costs.std().item(),
        'min_cost': costs.min().item(),
        'max_cost': costs.max().item()
    }
    
    print(f"✅ Solved instances:")
    print(f"   - Mean cost: {results['mean_cost']:.4f}")
    print(f"   - Best cost: {results['min_cost']:.4f}")
    
    return results

def solve_with_classical_solver(
    env: MTVRPEnv,
    data: TensorDict,
    solver: str = "ortools",
    max_runtime: float = 60.0
) -> Dict:
    """Solve using classical optimization methods"""
    
    print(f"🔧 Solving with classical solver: {solver}")
    
    try:
        data_cpu = data.cpu()
        classical_actions, classical_costs = env.solve(
            data_cpu,
            max_runtime=max_runtime,
            solver=solver,
            num_procs=1
        )
        
        results = {
            'actions': classical_actions,
            'costs': classical_costs,
            'mean_cost': classical_costs.mean().item(),
            'std_cost': classical_costs.std().item(),
            'min_cost': classical_costs.min().item(),
            'max_cost': classical_costs.max().item()
        }
        
        print(f"✅ Classical solver results:")
        print(f"   - Mean cost: {results['mean_cost']:.4f}")
        return results
        
    except Exception as e:
        print(f"❌ Classical solver failed: {e}")
        return None

def compare_methods(rl_results: Dict, classical_results: Dict):
    """Compare RL and classical solver results"""
    
    if classical_results is None:
        print("⚠️ Cannot compare - classical solver failed")
        return
    
    rl_cost = rl_results['mean_cost']
    classical_cost = classical_results['mean_cost']
    gap = ((rl_cost - classical_cost) / classical_cost) * 100
    
    print(f"\n📊 Performance Comparison:")
    print(f"   - RL Method Cost: {rl_cost:.4f}")
    print(f"   - Classical Cost: {classical_cost:.4f}")
    print(f"   - Gap: {gap:.2f}%")

def plot_cost_comparison(rl_results: Dict, classical_results: Dict = None):
    """Plot cost comparison between methods"""
    
    plt.figure(figsize=(12, 6))
    
    plt.subplot(1, 2, 1)
    plt.hist(rl_results['costs'], bins=20, alpha=0.7, color='blue', label='RL Method')
    plt.axvline(rl_results['mean_cost'], color='blue', linestyle='--', 
                label=f'Mean: {rl_results["mean_cost"]:.4f}')
    plt.xlabel('Cost')
    plt.ylabel('Frequency')
    plt.title('RL Method Cost Distribution')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    if classical_results is not None:
        plt.subplot(1, 2, 2)
        plt.hist(rl_results['costs'], bins=20, alpha=0.7, color='blue', label='RL Method')
        plt.hist(classical_results['costs'], bins=20, alpha=0.7, color='red', label='Classical')
        plt.axvline(rl_results['mean_cost'], color='blue', linestyle='--')
        plt.axvline(classical_results['mean_cost'], color='red', linestyle='--')
        plt.xlabel('Cost')
        plt.ylabel('Frequency')
        plt.title('Method Comparison')
        plt.legend()
        plt.grid(True, alpha=0.3)
    else:
        plt.subplot(1, 2, 2)
        costs = rl_results['costs'].numpy()
        indices = np.arange(len(costs))
        plt.scatter(indices, costs, alpha=0.6, color='blue')
        plt.axhline(rl_results['mean_cost'], color='red', linestyle='--', 
                   label=f'Mean: {rl_results["mean_cost"]:.4f}')
        plt.xlabel('Instance')
        plt.ylabel('Cost')
        plt.title('Cost per Instance')
        plt.legend()
        plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()

def visualize_solution(
    data: TensorDict,
    actions: torch.Tensor,
    instance_idx: int = 0,
    title: str = "MTVRP Solution"
):
    """Visualize the solution route for a specific instance"""
    
    locs = data['locs'][instance_idx].cpu().numpy()
    action_seq = actions[instance_idx].cpu().numpy()
    
    depot = locs[0]
    customer_locs = locs[1:]
    
    plt.figure(figsize=(12, 8))
    
    # Plot depot
    plt.scatter(depot[0], depot[1], c='red', s=200, marker='s', 
                label='Depot', zorder=5, edgecolors='black', linewidth=2)
    
    # Plot customers
    plt.scatter(customer_locs[:, 0], customer_locs[:, 1], c='blue', s=100, 
                alpha=0.7, label='Customers', zorder=3)
    
    # Draw route
    route_locs = locs[action_seq]
    plt.plot(route_locs[:, 0], route_locs[:, 1], 'g-', linewidth=2, alpha=0.7, label='Route')
    
    # Add customer numbers
    for i, (x, y) in enumerate(customer_locs):
        plt.annotate(f'{i+1}', (x, y), xytext=(5, 5), textcoords='offset points',
                    fontsize=8, ha='left')
    
    # Calculate tour length
    try:
        td_single = TensorDict({
            'locs': torch.tensor(locs).unsqueeze(0),
            'actions': torch.tensor(action_seq).unsqueeze(0)
        }, batch_size=[1])
        tour_length = get_tour_length(td_single).item()
    except:
        tour_length = 0.0
        for i in range(len(route_locs) - 1):
            dist = np.sqrt((route_locs[i+1, 0] - route_locs[i, 0])**2 + 
                          (route_locs[i+1, 1] - route_locs[i, 1])**2)
            tour_length += dist
    
    plt.title(f'{title} - Instance {instance_idx}\nTour Length: {tour_length:.4f}')
    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    plt.tight_layout()
    plt.show()
# Keep all your other existing functions exactly as they are...
# (I'll skip copying them all here to save space, but include ALL of them)

# [Include all your existing functions: visualize_instance, train_model, solve_instances, etc.]