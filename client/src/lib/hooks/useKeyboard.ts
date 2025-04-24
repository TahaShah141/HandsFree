import { useEffect } from "react";

const modifiers = ["Shift", "Control", "Alt", "Meta", "CapsLock"];
const arrowMap = {
  "ArrowUp": "up", 
  "ArrowDown": "down", 
  "ArrowLeft": "left", 
  "ArrowRight": "right",

};

export const pressKey = (key: string) => {
  fetch(`http://${window.location.hostname}:1301/keyboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      keys: [key],
    }),
  });
}

export const useKeyboard = () => {
  useEffect(() => {
    const heldKeys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (!heldKeys.has(event.key)) {
        heldKeys.add(event.key);
        if (!modifiers.includes(event.key)) {

          if (event.key in arrowMap) return pressKey(arrowMap[event.key as keyof typeof arrowMap]);
          if (event.key === "Backspace") return pressKey('backspace');
          if (event.key === "Enter") return pressKey('enter');
          if (event.key === "Tab") return pressKey('tab');

          fetch(`http://${window.location.hostname}:1301/text`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: event.key,
            }),
          })
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      heldKeys.delete(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};