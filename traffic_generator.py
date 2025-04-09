import time
import random
import requests

SERVER_URL = "http://127.0.0.1:5000"  # Change this if your Flask server is running elsewhere

def generate_traffic():
    locations = ["USA", "India", "UK", "Germany", "Australia"]
    devices = ["Mobile", "Desktop", "Tablet"]

    while True:
        visitor_data = {
            "ip": f"192.168.1.{random.randint(1, 255)}",
            "location": random.choice(locations),
            "device": random.choice(devices),
            "session_duration": random.randint(10, 300),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        try:
            requests.post(f"{SERVER_URL}/send_traffic", json=visitor_data)
            print(f"Sent visitor data: {visitor_data}")
        except requests.exceptions.ConnectionError:
            print("⚠️ Error: Unable to connect to the server. Make sure Flask is running.")

        time.sleep(3)  # Simulate a new visitor every 3 seconds

if __name__ == "__main__":
    generate_traffic()
