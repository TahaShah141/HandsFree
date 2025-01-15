from pyautogui import KEYBOARD_KEYS
from pynput.keyboard import Key

functionMap = {
  'f1': Key.f1,
  'f2': Key.f2,
  'f3': Key.f3,
  'f4': Key.f4,
  'f5': Key.f5,
  'f6': Key.f6,
  'f7': Key.media_previous,
  'f8': Key.media_play_pause,
  'f9': Key.media_next,
  'f10': Key.media_volume_mute,
  'f11': Key.media_volume_down,
  'f12': Key.media_volume_up,
}

# Extended keymap to include all common keys, modifiers, and function keys
keymap = {
    # Modifier keys
    "cmd": "command",
    "ctrl": "ctrl",
    "alt": "alt",
    "shift": "shift",
    "caps": "capslock",
    "fn": "command",  # Not supported by pyautogui

    # Function keys
    "f1": "f1",
    "f2": "f2",
    "f3": "f3",
    "f4": "f4",
    "f5": "f5",
    "f6": "f6",
    "f7": "f7",
    "f8": "f8",
    "f9": "f9",
    "f10": "f10",
    "f11": "f11",
    "f12": "f12",

    # Navigation keys
    "up": "up",
    "down": "down",
    "left": "left",
    "right": "right",
    "delete": "delete",
    "backspace": "backspace",
    "tab": "tab",
    "enter": "enter",
    "escape": "esc",

    # Misc keys
    "space": "space",

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

