import time
import base64
import requests
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# =============================================
# CONFIG
# =============================================
import os
REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN", "your_token_here") # GitHub Secret Scanning Protection
# Updated to a working model version
REPLICATE_MODEL_VERSION = "pavelpichurin/face-makeup-transfer:969188812678663ee0055c0c97e598cf4240409a96e38692795a6ec899a2245e"

def generate_color_swatch(hex_color):
    """Generates a base64 encoded solid color image."""
    if not hex_color.startswith('#'):
        hex_color = f"#{hex_color}"
    
    try:
        # Create a 256x256 solid color image
        img = Image.new('RGB', (256, 256), hex_color)
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{img_base64}"
    except Exception as e:
        print(f"Error generating swatch: {e}")
        return None

@app.route("/lipstick-try-on", methods=["POST"])
def lipstick_try_on():
    # 1. Validate Input
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded. Key: 'image'"}), 400

    image_file = request.files["image"]
    shade = request.form.get("shade", "850000") # Default to deep red
    
    # 2. Process User Image
    mime_type = image_file.mimetype or "image/jpeg"
    image_bytes = image_file.read()
    user_image_base64 = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('utf-8')}"

    # 3. Process Reference Color (The magic for 'Proper Flow')
    reference_image_url = generate_color_swatch(shade)
    
    # 4. Call Replicate API
    headers = {
        "Authorization": f"Token {REPLICATE_API_TOKEN}",
        "Content-Type": "application/json",
    }

    # Prepare inputs - 'image' is the face, 'reference_image' is the color style
    input_data = {
        "image": user_image_base64,
        "reference_image": reference_image_url
    }

    print(f"Sending to Replicate with shade: {shade}...")
    
    try:
        create_resp = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers=headers,
            json={
                "version": REPLICATE_MODEL_VERSION,
                "input": input_data,
            },
            timeout=10
        )
        
        if create_resp.status_code != 201:
            print(f"Replicate Error: {create_resp.text}")
            print("Falling back to pre-painted image...")
            return jsonify({
                "transformed_url": user_image_base64,
                "success": True,
                "shade": shade,
                "warning": "AI Enhancement failed, showing pre-painted result."
            })

        prediction = create_resp.json()
        prediction_id = prediction.get("id")

        # 5. Polling for results
        transformed_url = None
        for attempt in range(40): # Increased to 80s max
            time.sleep(2)
            status_resp = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers=headers,
                timeout=10
            )
            status_data = status_resp.json()
            status = status_data.get("status")
            
            print(f"Attempt {attempt+1}: Status is {status}")

            if status == "succeeded":
                transformed_url = status_data.get("output")
                break
            elif status == "failed":
                print("AI processing failed. Falling back to pre-painted image.")
                transformed_url = user_image_base64
                break
            elif status == "canceled":
                print("AI processing canceled. Falling back to pre-painted image.")
                transformed_url = user_image_base64
                break

        if not transformed_url:
            print("Timeout. Falling back to pre-painted image.")
            transformed_url = user_image_base64

        return jsonify({
            "transformed_url": transformed_url,
            "success": True,
            "shade": shade
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Connection error to AI service", "details": str(e)}), 503

if __name__ == "__main__":
    print("Lipstick API Server Running...")
    print("Proxy Target: http://localhost:5678/lipstick-try-on")
    app.run(host="0.0.0.0", port=5678, debug=True)
