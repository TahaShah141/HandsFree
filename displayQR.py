import socket
import qrcode

def displayIPAddress(port=5173):
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

        # Generate the QR code with larger size and higher density
        qr = qrcode.QRCode(
            version=10,  # Higher version for more density
            error_correction=qrcode.constants.ERROR_CORRECT_L,  # Lower error correction to allow smaller modules
            box_size=8,  # Larger box size for bigger QR code
            border=4,  # Standard border size
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Generate the QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")

        # Display the QR code
        qr_img.show()  # Opens the QR code in the default image viewer

        # Print the server URL
        print(f"Server URL: {url}")

    except Exception as e:
        print(f"Error: {e}")
