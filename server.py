import time
from flask import Flask, request, jsonify
from pynput.keyboard import Controller as KeyboardController
from pynput.mouse import Controller as MouseController  # Added for scrolling
from flask_cors import CORS
from killServers import killServers
from keymap import pynputKeyMap, pyGUIKeyMap
from pyautogui import hotkey, size, moveTo, click
from screenCapture import captureScreen, updateScreenshot

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
    
@app.route('/text', methods=['POST'])
def type():
  data = request.json
  text = data.get('text', '')
  keyboard.type(text)
  return jsonify({"status": "success", "message": f"Text '{text}' typed"}), 200

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
      
@app.route('/screen', methods=['GET'])
def get_screenshot():
    rotate_param = request.args.get('rotate', 'false').lower()    
    rotate = rotate_param == 'true'
    updateScreenshot(rotated=rotate)
    return jsonify({"message": "Screenshot Captured!"}), 200

@app.route('/click', methods=['POST'])
def handle_click():
    """ Moves the mouse to a given (x, y) percentage position and clicks. """
    try:
        data = request.json
        x_percent = float(data.get("x", 0))
        y_percent = float(data.get("y", 0))
        clicking = False if data.get("clicking", 0) == 0 else True
        
        if x_percent == -1 and y_percent == -1:
            click()
            return jsonify({"status": "success", "message": "Clicked"}), 200

        # Get the screen size
        screen_width, screen_height = size()

        # Convert percentages to absolute pixel coordinates
        x_absolute = int(x_percent * screen_width)
        y_absolute = int(y_percent * screen_height)
        
        print("Clicking", x_absolute, y_absolute)

        # Move the mouse and click
        moveTo(x_absolute, y_absolute)
        if clicking: click()

        return jsonify({"status": "success", "x": x_absolute, "y": y_absolute}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

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
        arrows = data.get('isArrowKeys')
        direction = data.get('direction')
        print(arrows)
        if arrows:
          if direction not in ['up', 'down', 'left', 'right']:
            return jsonify({"status": "error", "message": "Invalid direction. Use 'up', 'down', 'left', or 'right'"}), 400
          if direction in pynputKeyMap:
              keyboard.tap(pynputKeyMap[direction])
              return jsonify({"status": "success", "message": f"Key {direction} Tapped"}), 200
          else:
              return jsonify({"status": "error", "message": "Invalid key"}), 500
        
        magnitude = int(data.get('magnitude', 0))  # Ensure magnitude is an integer
        step_size = 2 # Small step per scroll
        
        steps = abs(magnitude) // step_size
        maxTime = 0.1
        maxDelay = 0.008
        delay = min(maxTime / max(steps, 1), maxDelay)

        if direction not in ['up', 'down', 'left', 'right']:
            return jsonify({"status": "error", "message": "Invalid direction. Use 'up', 'down', 'left', or 'right'"}), 400

        # Determine scroll step (positive for up/right, negative for down/left)
        step = step_size if direction in ['up', 'right'] else -step_size

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
    # app.run(host='0.0.0.0', port=1301, debug=True)
    app.run(host='0.0.0.0', port=1301)