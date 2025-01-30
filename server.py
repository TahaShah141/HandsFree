import time
from flask import Flask, request, jsonify
from pynput.keyboard import Controller as KeyboardController
from pynput.mouse import Controller as MouseController  # Added for scrolling
from flask_cors import CORS
from killServers import killServers
from keymap import pynputKeyMap, pyGUIKeyMap
from pyautogui import hotkey

app = Flask(__name__)
CORS(app)

keyboard = KeyboardController()
mouse = MouseController()  # Pynput mouse controller

@app.route('/', methods=['GET'])
def test_route():
    return jsonify({"message": "Hello Taha"}), 200

@app.route('/kill', methods=['GET'])
def kill():
    killServers()

@app.route('/shift', methods=['POST'])
def handle_shift():
    try:
        data = request.json
        keys = data.get('keys', [])  # List of keys to press in order
        k = keys[0]
        hotkey('shift', pyGUIKeyMap[k])
        return jsonify({"status": "success", "message": f"Keys {keys} pressed in order"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/keyboard', methods=['POST'])
def handle_keyboard():
    data = request.json
    keys = data.get('keys', [])  # List of keys to press in order

    try:
        pressed_keys = []
        if len(keys) == 1:
            if keys[0] in pynputKeyMap:
                keyboard.tap(pynputKeyMap[keys[0]])
                return jsonify({"status": "success", "message": f"Key {keys[0]} Tapped"}), 200
            else:
                return jsonify({"status": "error", "message": "Invalid key"}), 500

        # Replace "hyper" with "shift", "ctrl", "alt", "cmd"
        replacements = ["shift", "ctrl", "alt", "cmd"]
        new_keys = []
        for key in keys:
            if key == "hyper":
                new_keys.extend(replacements)
            else:
                new_keys.append(key)
        keys = new_keys

        for key in keys:
            if key in pynputKeyMap:
                keyboard.press(pynputKeyMap[key])
                pressed_keys.append(key)
            else:
                return jsonify({"status": "error", "message": f"Key '{key}' not allowed"}), 400

        # Release keys in reverse order
        for key in reversed(pressed_keys):
            keyboard.release(pynputKeyMap[key])

        return jsonify({"status": "success", "message": f"Keys {keys} pressed in order"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/scroll', methods=['POST'])
def handle_scroll():
    try:
        data = request.json
        direction = data.get('direction')
        magnitude = int(data.get('magnitude', 0))  # Ensure magnitude is an integer
        step_size = 1 # Small step per scroll
        delay = 0.008  # Delay for smooth effect

        if direction not in ['up', 'down', 'left', 'right']:
            return jsonify({"status": "error", "message": "Invalid direction. Use 'up', 'down', 'left', or 'right'"}), 400

        # Determine scroll step (positive for up/right, negative for down/left)
        step = step_size if direction in ['up', 'right'] else -step_size
        steps = abs(magnitude) // step_size  # Number of small scrolls

        # Perform smooth scrolling
        for _ in range(steps):
            if direction in ['up', 'down']:
                mouse.scroll(0, step)  # Vertical scrolling
            else:
                mouse.scroll(step, 0)  # Horizontal scrolling (Mac Magic Mouse style)
            time.sleep(delay)  # Delay to create smooth effect

        return jsonify({"status": "success", "message": f"Smoothly scrolled {direction} by {magnitude}"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1301, debug=True)