import subprocess
import sys
import signal
import threading

# Define process placeholders
server_process = None
client_process = None
shutdown_event = threading.Event()

def run_servers():
    """Run backend and client servers."""
    global server_process, client_process

    try:
        # Start the backend server
        print("Starting backend server...")
        server_process = subprocess.Popen(
            [sys.executable, "server.py"],  # Use the current Python interpreter
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
            shell=(sys.platform == "win32"),  # Use shell=True for Windows
        )

        # Wait for shutdown event
        print("Both servers are running. Press Ctrl+C to stop.")
        shutdown_event.wait()

    except KeyboardInterrupt:
        print("\nReceived keyboard interrupt. Shutting down servers...")
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

# Setup signal handling for graceful shutdown
def setup_signal_handlers():
    signal.signal(signal.SIGINT, lambda sig, frame: shutdown_event.set())  # Handle Ctrl+C
    signal.signal(signal.SIGTERM, lambda sig, frame: shutdown_event.set())  # Handle termination signals

if __name__ == "__main__":
    setup_signal_handlers()
    run_servers()