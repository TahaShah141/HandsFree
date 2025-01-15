from flask import Flask, request, jsonify
from flask_cors import CORS
import pyautogui
from displayQR import displayIPAddress
from killServers import killServers
from keymap import keymap, functionMap
from pynput.keyboard import Controller as KeyboardController

app = Flask(__name__)
CORS(app)

keyboard = KeyboardController()

def simulate_hotkey(keys):
    try:
        # Map the input keys to valid keys using the keymap
        valid_keys = [keymap[key] for key in keys if key in keymap]

        if not valid_keys:
            print("No valid keys found to simulate.")
            return

        # Use pyautogui to press the keys in order
        pyautogui.hotkey(*valid_keys)
        print(f"Hotkey {keys} simulated successfully.")
    except KeyError as e:
        print(f"Key '{e.args[0]}' is not in the keymap.")
    except Exception as e:
        print(f"An error occurred: {e}")
        

@app.route('/', methods=['GET'])
def test_route():
    return jsonify({"message": "Hello Taha"}), 200

@app.route('/kill', methods=['GET'])
def kill():
    killServers()
    return jsonify({"message": "Servers killed"}), 200

@app.route('/keyboard', methods=['POST'])
def handle_keyboard():
    data = request.json
    keys = data.get('keys', [])  # List of keys to press in order

    try:
        # Replace "hyper" with "shift", "ctrl", "alt", "cmd"
        replacements = ["shift", "ctrl", "alt", "cmd"]
        new_keys = []
        for key in keys:
            if key == "hyper":
                new_keys.extend(replacements)
            else:
                new_keys.append(key)
        keys = new_keys
        
        if len(keys) == 1 and keys[0] in functionMap.keys():
          keyboard.tap(functionMap[keys[0]])
        else:
          simulate_hotkey(keys)

        return jsonify({"status": "success", "message": f"Keys {keys} pressed in order"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    displayIPAddress(port=5173)
    app.run(host='0.0.0.0', port=3000)
    
              