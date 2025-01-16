from pynput.keyboard import Key

# Extended keymap to include all common keys, modifiers, and function keys
pynputKeyMap = {
    # Modifier keys
    "cmd": Key.cmd,
    "ctrl": Key.ctrl,
    "alt": Key.alt,
    "shift": Key.shift,
    "caps": Key.caps_lock,
    "fn": Key.cmd,
    
    # Function keys
    "f1": Key.f1,
    "f2": Key.f2,
    "f3": Key.f3,
    "f4": Key.f4,
    "f5": Key.f5,
    "f6": Key.f6,
    "f7": Key.media_previous,
    "f8": Key.media_play_pause,
    "f9": Key.media_next,
    "f10": Key.media_volume_mute,
    "f11": Key.media_volume_down,
    "f12": Key.media_volume_up,
    
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

