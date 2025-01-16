from flask import Flask, request, jsonify
from pynput.keyboard import Controller as KeyboardController
from flask_cors import CORS
from killServers import killServers
from keymap import pGUIKeyMap, pynputKeyMap
from pyautogui import hotkey

app = Flask(__name__)
CORS(app)

keyboard = KeyboardController()

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
    
    hotkey('shift', pGUIKeyMap[k])
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
            return jsonify({"status": "error", "message": str(e)}), 500
          
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

if __name__ == '__main__':
    # displayIPAddress(port=1013)
    app.run(host='0.0.0.0', port=1301)