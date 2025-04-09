from flask import Flask, render_template, request
from flask_socketio import SocketIO
import threading
import time
import random
import webbrowser  # To auto-open browser

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to receive traffic data
@app.route('/send_traffic', methods=['POST'])
def receive_traffic():
    visitor_data = request.json
    socketio.emit('new_visitor', visitor_data)  # Send data to frontend
    return {"status": "success"}, 200

# Simulated traffic generator (runs in background)
def generate_traffic():
    locations = ["USA", "India", "UK", "Germany", "Australia"]
    devices = ["Mobile", "Desktop", "Tablet"]

    while True:
        visitor_data = {
            "ip": f"192.168.1.{random.randint(1, 255)}",
            "location": random.choice(locations),
            "device": random.choice(devices),
            "session_duration": random.randint(10, 300),  # Seconds
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        socketio.emit('new_visitor', visitor_data)  # Send data to frontend
        time.sleep(3)  # Simulate a new visitor every 3 seconds

# Open browser automatically
def open_browser():
    time.sleep(1)  # Give Flask time to start
    webbrowser.open("http://127.0.0.1:5000")

# Start background tasks
threading.Thread(target=generate_traffic, daemon=True).start()
threading.Thread(target=open_browser, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
