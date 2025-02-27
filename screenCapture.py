import subprocess
import base64
from io import BytesIO
from PIL import Image, ImageGrab

def updateScreenshot(rotated, path="./client/public/screen.png"):
    """Captures the screen and saves the image to the given path."""
    try:
        # Capture screenshot
        subprocess.run(["screencapture", path])
        print(f"Screenshot saved to {path}")
        
        if rotated:
            # Open image and rotate
            img = Image.open(path)
            img = img.rotate(90, expand=True)  # Rotate counterclockwise for correct orientation
            img.save(path)
    except Exception as e:
        print(f"Error capturing screenshot: {e}")

def captureScreen():
    """Captures the screen and returns a base64-encoded string of the image."""
    
    # Step 1: Capture screenshot and copy to clipboard
    subprocess.run(["screencapture", "-c"])  # Screenshot saved to clipboard

    # Step 2: Retrieve image from clipboard
    try:
        image = ImageGrab.grabclipboard()  # Extract image from clipboard
        if image is None:
            print("No image found in clipboard!")
            return None
          
        image = image.rotate(90, expand=True)
        buffered = BytesIO()
        image.save(buffered, format="PNG")  # Convert image to PNG format
        b64_image = base64.b64encode(buffered.getvalue()).decode()  # Encode as base64
        return b64_image

    except Exception as e:
        print(f"Error extracting image from clipboard: {e}")
        return None

def display_base64_image(b64_string):
    """Displays the base64 image for debugging."""
    try:
        image_data = base64.b64decode(b64_string)
        image = Image.open(BytesIO(image_data))
        image.show()  # Open the image for viewing
    except Exception as e:
        print(f"Error displaying image: {e}")

# Example usage
if __name__ == "__main__":
    b64_screenshot = captureScreen()
    if b64_screenshot:
        print("Base64 Screenshot Captured!")
        print("Base64 (truncated):", b64_screenshot[:100] + "...")  # Print first 100 chars for debugging

        # Display the image
        display_base64_image(b64_screenshot)