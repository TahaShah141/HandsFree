import socket
import qrcode
import webbrowser

def displayIPAddress(port=3000):
    try:
        # Get the local IPv4 address of the active network interface
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(1)
        # Use Google's public DNS server to determine the local IP address
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()

        # Generate the URL with the IP address and port
        url = f"http://{local_ip}:{port}"

        # Generate the QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        # Display the QR code
        qr_img.show()  # Opens the QR code in the default image viewer

        # Optionally, open the URL in the browser
        print(f"Server URL: {url}")

    except Exception as e:
        print(f"Error: {e}")

# Call the function with the desired port
if __name__ == "__main__":
    displayIPAddress(port=3000)