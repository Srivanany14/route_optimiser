# scripts/inference_server.py
import torch
import json
from src.mtvrp_rl4co_trainer import MTVRPTrainer
from configs.rl4co_config import RL4CO_CONFIG

class MTVRPInferenceServer:
    def __init__(self, model_path: str):
        self.trainer = MTVRPTrainer(RL4CO_CONFIG)
        self.trainer.load_model(model_path)
        
    def solve_problem(self, locations: list, vehicles: list, config: dict) -> dict:
        """Solve MTVRP problem for web interface"""
        try:
            # Convert frontend data to model format
            results = self.trainer.solve_custom_problem(locations, vehicles)
            
            # Convert results to frontend format
            return self.convert_results_to_frontend(results, locations, vehicles)
            
        except Exception as e:
            return {"error": str(e)}
            
    def convert_results_to_frontend(self, results: dict, locations: list, vehicles: list) -> dict:
        """Convert model results to frontend format"""
        # This needs to be implemented based on your frontend expectations
        # For now, return basic structure
        
        return {
            "routes": [
                {
                    "vehicleId": 1,
                    "stops": [
                        {
                            "locationId": 1,
                            "arrivalTime": 0,
                            "load": 0,
                            "distance": 0
                        }
                    ],
                    "totalDistance": results.get('mean_cost', 0),
                    "totalCost": results.get('mean_cost', 0),
                    "totalTime": results.get('mean_cost', 0) * 0.6
                }
            ],
            "totalCost": results.get('mean_cost', 0),
            "totalDistance": results.get('mean_cost', 0),
            "totalTime": results.get('mean_cost', 0) * 0.6,
            "solveTime": 2.0,
            "algorithm": "RL4CO_POMO"
        }

# Test the inference server
if __name__ == "__main__":
    # Test with sample data
    sample_locations = [
        {"id": 1, "name": "Depot", "x": 0.5, "y": 0.5, "demand": 0, "type": "depot"},
        {"id": 2, "name": "Customer A", "x": 0.2, "y": 0.3, "demand": 15, "type": "customer"}
    ]
    
    sample_vehicles = [
        {"id": 1, "name": "Truck 1", "capacity": 50, "costPerKm": 1.0}
    ]
    
    # This would be used after training
    # server = MTVRPInferenceServer("models/mtvrp_rl4co_model.pth")
    # result = server.solve_problem(sample_locations, sample_vehicles, {})
    # print(json.dumps(result, indent=2))