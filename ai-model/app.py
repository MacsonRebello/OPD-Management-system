import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from datetime import datetime, timedelta
import joblib

app = Flask(__name__)
CORS(app)

# AI Model for Waiting Time Prediction
class WaitingTimePredictor:
    def __init__(self):
        """Initialize the waiting time prediction model"""
        self.model_trained = False
        self.training_data = []
        
    def predict_waiting_time(self, patients_in_queue, avg_consultation_time, current_position):
        """
        Predict waiting time based on queue position and consultation time
        
        Args:
            patients_in_queue: Number of patients in queue
            avg_consultation_time: Average consultation time in minutes
            current_position: Current position in queue (1-based)
        
        Returns:
            Estimated waiting time in minutes
        """
        if current_position <= 1:
            return 0
        
        # Calculate waiting time
        patients_ahead = current_position - 1
        estimated_wait = patients_ahead * avg_consultation_time
        
        # Add buffer time (10% for administrative tasks)
        buffer = estimated_wait * 0.1
        total_wait = estimated_wait + buffer
        
        # Add variance based on time of day (peak hours)
        now = datetime.now()
        hour = now.hour
        
        # Peak hours multiplier (9-11 AM, 2-4 PM)
        if (9 <= hour < 11) or (14 <= hour < 16):
            peak_multiplier = 1.2
        else:
            peak_multiplier = 1.0
        
        total_wait = total_wait * peak_multiplier
        
        return int(total_wait)
    
    def predict_token_call_time(self, patients_in_queue, avg_consultation_time, token_number):
        """
        Predict when a token will be called
        
        Args:
            patients_in_queue: List of patients in queue
            avg_consultation_time: Average consultation time in minutes
            token_number: Target token number
        
        Returns:
            Estimated time when token will be called
        """
        current_time = datetime.now()
        
        # Find position of token in queue
        position = None
        for i, patient in enumerate(patients_in_queue):
            if patient['token_number'] == token_number:
                position = i + 1
                break
        
        if position is None:
            return None
        
        # Calculate time until token is called
        wait_time = self.predict_waiting_time(len(patients_in_queue), avg_consultation_time, position)
        estimated_call_time = current_time + timedelta(minutes=wait_time)
        
        return {
            'token_number': token_number,
            'position': position,
            'estimated_wait_time': wait_time,
            'estimated_call_time': estimated_call_time.strftime('%H:%M:%S')
        }
    
    def predict_crowd_level(self, patients_in_queue):
        """
        Predict crowd level: low, medium, high
        
        Args:
            patients_in_queue: Number of patients in queue
        
        Returns:
            Crowd level assessment
        """
        if patients_in_queue <= 5:
            return {
                'level': 'low',
                'percentage': patients_in_queue * 20,
                'recommendation': 'Low crowd. Good time to visit.'
            }
        elif patients_in_queue <= 15:
            return {
                'level': 'medium',
                'percentage': 60,
                'recommendation': 'Moderate crowd. Average waiting time.'
            }
        else:
            return {
                'level': 'high',
                'percentage': 100,
                'recommendation': 'High crowd. Consider visiting later.'
            }

# Initialize predictor
predictor = WaitingTimePredictor()

# Routes
@app.route('/api/predict-waiting-time', methods=['POST'])
def predict_waiting_time():
    """
    Endpoint to predict waiting time for a patient
    
    Request body:
    {
        "patients_in_queue": 10,
        "avg_consultation_time": 15,
        "current_position": 5
    }
    """
    try:
        data = request.json
        
        patients_in_queue = data.get('patients_in_queue', 0)
        avg_consultation_time = data.get('avg_consultation_time', 15)
        current_position = data.get('current_position', 1)
        
        waiting_time = predictor.predict_waiting_time(
            patients_in_queue,
            avg_consultation_time,
            current_position
        )
        
        return jsonify({
            'status': 'success',
            'waiting_time_minutes': waiting_time,
            'patients_ahead': current_position - 1,
            'predicted_time': (datetime.now() + timedelta(minutes=waiting_time)).strftime('%H:%M:%S')
        }), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/predict-token-call-time', methods=['POST'])
def predict_token_call_time():
    """
    Endpoint to predict when a token will be called
    
    Request body:
    {
        "patients_in_queue": [
            {"token_number": 1, "status": "completed"},
            {"token_number": 2, "status": "in_progress"},
            {"token_number": 3, "status": "scheduled"}
        ],
        "avg_consultation_time": 15,
        "token_number": 5
    }
    """
    try:
        data = request.json
        
        patients_in_queue = data.get('patients_in_queue', [])
        avg_consultation_time = data.get('avg_consultation_time', 15)
        token_number = data.get('token_number')
        
        result = predictor.predict_token_call_time(
            patients_in_queue,
            avg_consultation_time,
            token_number
        )
        
        if result is None:
            return jsonify({'status': 'error', 'message': 'Token not found in queue'}), 404
        
        return jsonify({'status': 'success', 'data': result}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/predict-crowd-level', methods=['POST'])
def predict_crowd_level():
    """
    Endpoint to predict crowd level
    
    Request body:
    {
        "patients_in_queue": 12
    }
    """
    try:
        data = request.json
        patients_in_queue = data.get('patients_in_queue', 0)
        
        result = predictor.predict_crowd_level(patients_in_queue)
        
        return jsonify({'status': 'success', 'data': result}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    """
    Endpoint for batch predictions for multiple patients
    
    Request body:
    {
        "patients": [
            {"token_number": 3, "position": 3},
            {"token_number": 5, "position": 5}
        ],
        "avg_consultation_time": 15
    }
    """
    try:
        data = request.json
        patients = data.get('patients', [])
        avg_consultation_time = data.get('avg_consultation_time', 15)
        
        predictions = []
        for patient in patients:
            position = patient.get('position', 1)
            wait_time = predictor.predict_waiting_time(
                len(patients),
                avg_consultation_time,
                position
            )
            
            predictions.append({
                'token_number': patient.get('token_number'),
                'position': position,
                'estimated_wait_time': wait_time,
                'estimated_call_time': (datetime.now() + timedelta(minutes=wait_time)).strftime('%H:%M:%S')
            })
        
        return jsonify({'status': 'success', 'predictions': predictions}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Waiting Time Prediction Model',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print('🚀 AI Waiting Time Prediction Model running on port 5001')
    print('📍 API Base URL: http://localhost:5001/api')
    app.run(debug=True, port=5001)
