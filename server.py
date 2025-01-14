from flask import Flask, request, jsonify
from pynput.keyboard import Controller as KeyboardController, Key
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

keyboard = KeyboardController()

# Extended keymap to include all common keys, modifiers, and function keys
keymap = {
    # Modifier keys
    "cmd": Key.cmd,
    "ctrl": Key.ctrl,
    "alt": Key.alt,
    "shift": Key.shift,
    "caps": Key.caps_lock,
    "fn": Key.cmd_r,
    
    # Function keys
    "f1": Key.f1,
    "f2": Key.f2,
    "f3": Key.f3,
    "f4": Key.f4,
    "f5": Key.f5,
    "f6": Key.f6,
    "f7": Key.f7,
    "f8": Key.f8,
    "f9": Key.f9,
    "f10": Key.f10,
    "f11": Key.f11,
    "f12": Key.f12,
    
    # Navigation keys
    "up": Key.up,
    "down": Key.down,
    "left": Key.left,
    "right": Key.right,
    "delete": Key.delete,
    "backspace": Key.backspace,
    "tab": Key.tab,
    "enter": Key.enter,
    "escape": Key.esc,
    
    # Misc keys
    "space": Key.space,
    
    # Symbols and additional keys
    "-": "-",
    "=": "=",
    "[": "[",
    "]": "]",
    ";": ";",
    "'": "'",
    "\\": "\\",
    "/": "/",
    ",": ",",
    ".": ".",
    "`": "`",
    
    # Alphanumeric keys
    **{chr(i): chr(i) for i in range(32, 127)},  # ASCII printable characters
}

@app.route('/', methods=['GET'])
def test_route():
  return jsonify({"message": "Hello Taha"}), 200

@app.route('/keyboard', methods=['POST'])
def handle_keyboard():
    data = request.json
    keys = data.get('keys', [])  # List of keys to press in order

    try:
        pressed_keys = []
        
        if len(keys) == 1:
          if keys[0] in keymap:
            keyboard.tap(keymap[keys[0]])
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
            if key in keymap:
                keyboard.press(keymap[key])
                pressed_keys.append(key)
            else:
                return jsonify({"status": "error", "message": f"Key '{key}' not allowed"}), 400

        # Release keys in reverse order
        for key in reversed(pressed_keys):
            keyboard.release(keymap[key])

        return jsonify({"status": "success", "message": f"Keys {keys} pressed in order"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port=3000, debug=True)