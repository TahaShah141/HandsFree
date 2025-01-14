import subprocess
import sys

# Define process placeholders
server_process = None
client_process = None

def run_servers():
    global server_process, client_process
    try:
        # Start the backend server
        print("Starting backend server...")
        server_process = subprocess.Popen(
            ["python3", "server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        
        # Navigate to the client directory and start the client server
        print("Starting client server...")
        client_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd="./client",  # Change directory to ./client
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        
        # Wait for both processes to run indefinitely
        print("Both servers are running. Press Ctrl+C to stop.")
        while True:
            pass
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        cleanup()

def cleanup():
    """Terminate both processes gracefully."""
    global server_process, client_process
    if server_process:
        print("Stopping backend server...")
        server_process.terminate()
        server_process.wait()
    if client_process:
        print("Stopping client server...")
        client_process.terminate()
        client_process.wait()
    print("Servers stopped successfully.")
    sys.exit(0)

if __name__ == "__main__":
    run_servers()