import os
import psutil
import subprocess
import time
import platform

def get_pids_by_port(port):
    """Find all PIDs listening on a specific port."""
    try:
        if platform.system() == "Windows":
            # Use netstat and findstr to find processes on the port (Windows)
            result = subprocess.run(
                ["netstat", "-ano", "|", "findstr", f":{port}"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True,
            )
            lines = result.stdout.strip().split("\n")
            pids = set()
            for line in lines:
                parts = line.split()
                if len(parts) >= 5 and parts[1].endswith(f":{port}"):
                    pids.add(int(parts[-1]))  # PID is in the last column
            return list(pids)
        else:
            # Use lsof to find processes on the port (macOS/Linux)
            result = subprocess.run(
                ["lsof", "-t", "-i", f":{port}"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            pids = result.stdout.strip().split("\n")
            return [int(pid) for pid in pids if pid.isdigit()]
    except Exception as e:
        print(f"Error finding PIDs for port {port}: {e}")
        return []

def kill_process(pid):
    """Kill a process by PID."""
    try:
        proc = psutil.Process(pid)
        proc.terminate()  # Send SIGTERM
        proc.wait(timeout=3)  # Wait for process to terminate
        print(f"Successfully terminated process with PID {pid}")
    except psutil.NoSuchProcess:
        print(f"Process with PID {pid} does not exist.")
    except psutil.TimeoutExpired:
        print(f"Process with PID {pid} did not terminate in time. Sending SIGKILL.")
        proc.kill()  # Forcefully kill the process
    except Exception as e:
        print(f"Error killing process with PID {pid}: {e}")

def killServers():
    """Kill all processes listening on ports 5173 and 3000."""
    # Prioritize port 5173
    ports = [1013, 1301]
    for port in ports:
        print(f"Checking for processes on port {port}...")
        pids = get_pids_by_port(port)
        if not pids:
            print(f"No processes found on port {port}.")
            continue

        for pid in pids:
            if port == ports[1] and len(pids) == 1:
                print(f"Delaying termination of server process on port {port} (PID: {pid}) until last.")
                time.sleep(2)  # Delay to ensure other tasks finish
            print(f"Killing process with PID {pid} listening on port {port}...")
            kill_process(pid)

# Uncomment this to run the script
if __name__ == "__main__":
  killServers()