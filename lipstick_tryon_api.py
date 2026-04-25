import os
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
import replicate

REPLICATE_API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")
# Using a high-fidelity, instruction-following model that is definitely public
REPLICATE_MODEL = "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f"

@app.route("/lipstick-try-on", methods=["POST"])
def lipstick_try_on():
    # 1. Validate Input
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded. Key: 'image'"}), 400

    image_file = request.files["image"]
    
    # Get all shades
    lip_shade = request.form.get("lip_shade") or request.form.get("shade", "850000")
    eye_shade = request.form.get("eye_shade", "transparent")
    face_shade = request.form.get("face_shade", "transparent")
    
    # 2. Process User Image
    mime_type = image_file.mimetype or "image/jpeg"
    image_bytes = image_file.read()
    user_image_base64 = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('utf-8')}"

    # 3. Construct AI Instruction
    instructions = []
    if lip_shade != "transparent":
        instructions.append(f"apply lipstick in color #{lip_shade}")
    if eye_shade != "transparent":
        instructions.append(f"apply eyeshadow in color #{eye_shade}")
    if face_shade != "transparent":
        instructions.append(f"apply foundation/blush in color #{face_shade}")
    
    prompt = "Apply professional makeup: " + ", ".join(instructions) + ". Keep the person's identity and face structure exactly the same."
    
    print(f"Sending to Replicate with prompt: {prompt}")
    
    try:
        # Initialize client
        client = replicate.Client(api_token=REPLICATE_API_TOKEN)
        
        # Prepare inputs for Instruct-Pix2Pix
        input_data = {
            "image": user_image_base64,
            "prompt": prompt,
            "num_inference_steps": 25,
            "image_guidance_scale": 1.5,
            "text_guidance_scale": 7.5
        }

        # Run prediction
        output = client.run(
            REPLICATE_MODEL,
            input=input_data
        )
        
        transformed_url = output
        if isinstance(output, list):
            transformed_url = output[0]

        print(f"Replicate success: {transformed_url}")

        return jsonify({
            "transformed_url": transformed_url,
            "success": True,
            "lip_shade": lip_shade,
            "eye_shade": eye_shade,
            "face_shade": face_shade
        })

    except Exception as e:
        print(f"Replicate failed: {e}. Falling back to n8n webhook...")
        try:
            # Fallback to n8n webhook which is known to work in this project
            webhook_url = "https://jinalman33.app.n8n.cloud/webhook/lipstick-try-on"
            
            # We need to send it as a file/form-data
            image_file.seek(0) # Reset file pointer
            files = {'image': (image_file.filename, image_file.read(), image_file.mimetype)}
            data = {
                'lip_shade': lip_shade,
                'eye_shade': eye_shade,
                'face_shade': face_shade,
                'shade': lip_shade
            }
            
            n8n_resp = requests.post(webhook_url, files=files, data=data, timeout=30)
            
            if n8n_resp.ok:
                n8n_data = n8n_resp.json()
                output_url = (n8n_data[0].get('transformed_url') if isinstance(n8n_data, list) else n8n_data.get('transformed_url')) or n8n_data.get('url')
                
                if output_url:
                    print(f"n8n Fallback Success: {output_url}")
                    return jsonify({
                        "transformed_url": output_url,
                        "success": True,
                        "source": "n8n"
                    })

            print(f"n8n Fallback failed: {n8n_resp.text}")
        except Exception as n8n_err:
            print(f"n8n Fallback Error: {n8n_err}")

        print("All AI fallbacks failed. Returning error.")
        return jsonify({
            "error": "AI services unavailable (Rate Limited or Offline)",
            "success": False,
            "warning": f"AI services unavailable: {str(e)}"
        }), 503

if __name__ == "__main__":
    print("Lipstick & Makeup API Server Running...")
    print("Proxy Target: http://localhost:5678/lipstick-try-on")
    app.run(host="0.0.0.0", port=5678, debug=True)
